const moduleStructure = require("../../../src/module-structure").moduleStructure;

const describe = require("mocha").describe;
const it = require("mocha").it;
const assert = require("chai").assert;
const sinon = require("sinon");
const os = require("os");
const fs = require("fs");
const path = require("path");
const rimrafSync = require("rimraf").sync;
const project = require("../../../package.json");


describe("module-structure-api", function() {
    let config;
    let rootDir;
    let outFile;
    let HttpServerModule;
    let httpServer;
    let serverRoot;
    let opener;
    let actualModel;
    let expectedOutFilePath;
    let getInstalledPathSync;


    it("starts http-server", function() {
        expectsItStartsHttpServer();
    });

    function expectsItStartsHttpServer(port) {
        givenConfigWithShowExport(port);
        givenRootDir("test/resources/ts/ecommerce-sample");
        givenServerRoot("src/structure-view/data");
        givenSpyingHttpServer();
        givenHttpServerModule();
        whenInvokingAPI();
        thenHttpServerShouldHaveBeenStarted(port);
    }

    function givenConfigWithShowExport(port) {
        config = {showExport: true};
        if (port) {
            config.serverPort = port;
        }
    }

    function givenRootDir(dir) {
        rootDir = path.join(process.cwd(), dir);
        config.rootDir = rootDir;
    }

    function givenServerRoot(dir) {
        serverRoot = path.join(process.cwd(), dir);
    }

    function givenSpyingHttpServer() {
        httpServer = {};
        httpServer.listen = sinon.spy();
    }

    function givenHttpServerModule() {
        HttpServerModule = {};
        HttpServerModule.createServer = sinon.stub();
        HttpServerModule.createServer.withArgs({root: serverRoot}).returns(httpServer);

        config.HttpServerModule = HttpServerModule;
    }

    function whenInvokingAPI() {
        actualModel = moduleStructure(config);
    }

    function thenHttpServerShouldHaveBeenStarted(port) {
        assert.isTrue(HttpServerModule.createServer.withArgs({root: serverRoot}).calledOnce);
        assert.isTrue(httpServer.listen.withArgs(port ? port : 3000, "127.0.0.1").calledOnce);
    }

    it("starts http-server with given port", function() {
        expectsItStartsHttpServer(8080);
    });

    it("doesn't start http-server if showExport isn't specified", function() {
        givenConfigWithoutShowExport();
        givenRootDir("test/resources/ts/ecommerce-sample");
        givenServerRoot("src/structure-view/data");
        givenSpyingHttpServer();
        givenHttpServerModule();
        whenInvokingAPI();
        thenHttpServerShouldNotHaveBeenStarted();
    });

    function givenConfigWithoutShowExport() {
        config = {};
    }

    function thenHttpServerShouldNotHaveBeenStarted() {
        assert.isFalse(HttpServerModule.createServer.called);
    }

    it("opens browser with default port", function() {
        givenConfigWithShowExport();
        givenRootDir("test/resources/ts/ecommerce-sample");
        givenServerRoot("src/structure-view/data");
        givenFakeHttpServer();
        givenHttpServerModule();
        givenOpener();
        whenInvokingAPI();
        thenBrowserShouldHaveBeenOpened();
    });

    function givenFakeHttpServer() {
        httpServer = {};
        httpServer.listen = function(port, host, callback) {
            callback();
        };
    }

    function givenOpener() {
        opener = sinon.spy();
        config.opener = opener;
    }

    function thenBrowserShouldHaveBeenOpened(port) {
        const url = "http://localhost:" + (port ? port : 3000) + "/index.html?input=module-structure.json";
        assert.isTrue(opener.calledWith(url));
    }

    it("opens browser with specified port", function() {
        givenConfigWithShowExport(8080);
        givenRootDir("test/resources/ts/ecommerce-sample");
        givenServerRoot("src/structure-view/data");
        givenFakeHttpServer();
        givenHttpServerModule();
        givenOpener();
        whenInvokingAPI();
        thenBrowserShouldHaveBeenOpened(8080);
    });

    it("exports outFile", function() {
        givenConfigWithoutShowExport();
        givenRootDir("test/resources/es6/ecommerce-sample");
        givenOutFile("src/structure-view/data/module-structure.json");
        whenInvokingAPI();
        thenExportedModelShouldEqualExpectedModel();
    });

    function givenOutFile(dir) {
        outFile = path.join(process.cwd(), dir);
        config.outFile = outFile;
    }

    function thenExportedModelShouldEqualExpectedModel() {
        const actualModel = JSON.parse(fs.readFileSync(outFile, "utf-8"));
        const expectedModelPath = path.join(rootDir, "ecommerce-sample.json");
        const expectedModel = JSON.parse(fs.readFileSync(expectedModelPath, "utf-8"));

        assert.deepEqual(actualModel, expectedModel);
    }

    it("skips excludes", function() {
        givenConfigWithoutShowExport();
        givenRootDir("test/resources/es6/ecommerce-sample");
        givenOutFile("src/structure-view/data/module-structure.json");
        givenExcludes(["billing", "sales-service.js"]);
        whenInvokingAPI();
        thenActualModelShouldEqualExpectedModel();
    });

    function givenExcludes(excludes) {
        config.excludes = excludes;
    }

    function thenActualModelShouldEqualExpectedModel() {
        const expectedModelPath = path.join(rootDir, "ecommerce-sample-without-excludes.json");
        const expectedModel = JSON.parse(fs.readFileSync(expectedModelPath, "utf-8"));

        assert.deepEqual(actualModel, expectedModel);
    }

    it("uses installation dist path for temporary outFiles", function() {
        givenConfigWithShowExport();
        givenRootDir("test/resources/es6/ecommerce-sample");
        givenInstalledPath();
        givenServerRoot("src/structure-view/data/dist//web-app");
        givenSpyingHttpServer();
        givenHttpServerModule();
        whenInvokingAPI();
        thenOutFileShouldBeExportedToDist();
    });

    function givenInstalledPath() {
        const installedPath = path.join(process.cwd(), "src/structure-view/data");
        const distPath = path.join(installedPath, "dist");
        const webAppPath = path.join(distPath, "web-app");
        expectedOutFilePath  = path.join(webAppPath, "module-structure.json");

        rimrafSync(installedPath);
        fs.mkdirSync(installedPath);
        fs.mkdirSync(distPath);
        fs.mkdirSync(webAppPath);

        getInstalledPathSync = sinon.stub();
        getInstalledPathSync.withArgs(project.name).returns(installedPath);

        config.getInstalledPathSync = getInstalledPathSync;
    }

    function thenOutFileShouldBeExportedToDist() {
        const actualModel = JSON.parse(fs.readFileSync(expectedOutFilePath, "utf-8"));
        const expectedModelPath = path.join(rootDir, "ecommerce-sample.json");
        const expectedModel = JSON.parse(fs.readFileSync(expectedModelPath, "utf-8"));

        assert.isTrue(getInstalledPathSync.withArgs(project.name).calledOnce);
        assert.deepEqual(actualModel, expectedModel);
    }

    it("ignores file extensions that don't match current module type", function() {
        givenConfigWithoutShowExport();
        givenRootDir("test/resources/ts/ecommerce-sample");
        whenInvokingAPI();
        thenActualModelShouldNotHaveAnyModules();
    });

    function thenActualModelShouldNotHaveAnyModules() {
        const expectedModelString = fs.readFileSync(path.join(rootDir, "ecommerce-sample-without-modules.json"), "utf-8");
        const expectedModel = JSON.parse(expectedModelString);

        assert.deepEqual(actualModel, expectedModel);
    }
});
