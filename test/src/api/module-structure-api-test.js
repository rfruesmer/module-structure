const moduleStructure = require("../../../src/module-structure");

const describe = require("mocha").describe;
const it = require("mocha").it;
const assert = require("chai").assert;
const sinon = require("sinon");
const os = require("os");
const fs = require("fs");
const path = require("path");
const mv = require("mv");
const project = require("../../../package.json");


describe("module-structure-api", function() {
    let config;
    let dependencies;
    let rootDir;
    let outFile;
    let HttpServerModule;
    let httpServer;
    let httpServerOptions;
    let serverRoot;
    let opener;
    let actualModel;
    let expectedOutFilePath;
    let getInstalledPathSync;
    let tempDir;
    let response;

    it("starts http-server", function() {
        expectsItStartsHttpServer();
    });

    function expectsItStartsHttpServer(port) {
        givenConfigWithOpen(port);
        givenRootDir("test/resources/ts/ecommerce-sample");
        givenInstalledPath();
        givenSpyingHttpServer();
        givenHttpServerModule();
        whenInvokingAPI();
        thenHttpServerShouldHaveBeenStarted(port);
    }

    function givenConfigWithOpen(port) {
        config = {open: true};
        if (port) {
            config.port = port;
        }
        dependencies = {};
    }

    function givenRootDir(dir) {
        rootDir = path.join(process.cwd(), dir);
        config.rootDir = rootDir;
    }

    function givenInstalledPath() {
        const installedPath = fs.mkdtempSync(path.join(os.tmpdir(), "module-structure-"));
        const distPath = path.join(installedPath, "dist");
        serverRoot = path.join(distPath, "web-app");
        expectedOutFilePath  = path.join(serverRoot, "module-structure.json");

        fs.mkdirSync(distPath);
        fs.mkdirSync(serverRoot);

        getInstalledPathSync = sinon.stub();
        getInstalledPathSync.withArgs(project.name, {local: true}).returns(installedPath);

        dependencies.getInstalledPathSync = getInstalledPathSync;
    }

    function givenSpyingHttpServer() {
        httpServer = {};
        httpServer.listen = sinon.spy();
    }

    function givenHttpServerModule() {
        HttpServerModule = {};
        HttpServerModule.createServer = sinon.stub();
        HttpServerModule.createServer.withArgs({root: serverRoot, cache: 0, before: sinon.match.any}).returns(httpServer);

        dependencies.HttpServerModule = HttpServerModule;
    }

    function whenInvokingAPI() {
        actualModel = moduleStructure(config, dependencies);
    }

    function thenHttpServerShouldHaveBeenStarted(port) {
        assert.isTrue(HttpServerModule.createServer.withArgs({root: serverRoot, cache: 0, before: sinon.match.any}).calledOnce);
        assert.isTrue(httpServer.listen.withArgs(port ? port : 3000, "127.0.0.1").calledOnce);
    }

    it("starts http-server with given port", function() {
        expectsItStartsHttpServer(8080);
    });

    it("doesn't start http-server if open isn't specified", function() {
        givenConfigWithoutOpen();
        givenRootDir("test/resources/ts/ecommerce-sample");
        givenInstalledPath();
        givenSpyingHttpServer();
        givenHttpServerModule();
        whenInvokingAPI();
        thenHttpServerShouldNotHaveBeenStarted();
    });

    function givenConfigWithoutOpen() {
        config = {};
    }

    function thenHttpServerShouldNotHaveBeenStarted() {
        assert.isFalse(HttpServerModule.createServer.called);
    }

    it("opens browser with default port", function() {
        givenConfigWithOpen();
        givenRootDir("test/resources/ts/ecommerce-sample");
        givenInstalledPath();
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
        dependencies.opener = opener;
    }

    function thenBrowserShouldHaveBeenOpened(port) {
        const url = "http://localhost:" + (port ? port : 3000) + "/index.html?input=module-structure.json";
        assert.isTrue(opener.calledWith(url));
    }

    it("opens browser with specified port", function() {
        givenConfigWithOpen(8080);
        givenRootDir("test/resources/ts/ecommerce-sample");
        givenInstalledPath();
        givenFakeHttpServer();
        givenHttpServerModule();
        givenOpener();
        whenInvokingAPI();
        thenBrowserShouldHaveBeenOpened(8080);
    });

    it("exports outFile", function() {
        givenConfigWithoutOpen();
        givenRootDir("test/resources/es6/ecommerce-sample");
        givenOutFile("src/structure-view/data/module-structure.json");
        whenInvokingAPI();
        thenExportedModelShouldEqualExpectedModel("ecommerce-sample.json");
    });

    function givenOutFile(pathName) {
        outFile = path.join(process.cwd(), pathName);
        config.outFile = outFile;

        const outDir = path.dirname(outFile);
        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir);
        }
    }

    function thenExportedModelShouldEqualExpectedModel(fileName) {
        const actualModel = JSON.parse(fs.readFileSync(outFile, "utf-8"));
        const expectedModelPath = path.join(rootDir, fileName);
        const expectedModel = JSON.parse(fs.readFileSync(expectedModelPath, "utf-8"));

        assert.deepEqual(actualModel, expectedModel);
    }

    it("skips excludes", function() {
        givenConfigWithoutOpen();
        givenRootDir("test/resources/es6/ecommerce-sample");
        givenOutFile("src/structure-view/data/module-structure.json");
        givenExcludes(["billing", "sales-service.js"]);
        whenInvokingAPI();
        thenActualModelShouldEqualExpectedModel();
    });

    function givenExcludes(excludes) {
        config.exclude = excludes;
    }

    function thenActualModelShouldEqualExpectedModel() {
        const expectedModelPath = path.join(rootDir, "ecommerce-sample-without-excludes.json");
        const expectedModel = JSON.parse(fs.readFileSync(expectedModelPath, "utf-8"));

        assert.deepEqual(actualModel, expectedModel);
    }

    it("uses installation dist path for temporary outFiles", function() {
        givenConfigWithOpen();
        givenRootDir("test/resources/es6/ecommerce-sample");
        givenInstalledPath();
        givenSpyingHttpServer();
        givenHttpServerModule();
        whenInvokingAPI();
        thenOutFileShouldBeExportedToDist();
    });

    function thenOutFileShouldBeExportedToDist() {
        const actualModel = JSON.parse(fs.readFileSync(expectedOutFilePath, "utf-8"));
        const expectedModelPath = path.join(rootDir, "ecommerce-sample.json");
        const expectedModel = JSON.parse(fs.readFileSync(expectedModelPath, "utf-8"));

        assert.isTrue(getInstalledPathSync.withArgs(project.name, {local: true}).calledOnce);
        assert.deepEqual(actualModel, expectedModel);
    }

    it("uses cwd dist path for temporary outFiles if not installed", function() {
        givenConfigWithOpen();
        givenRootDir("test/resources/es6/ecommerce-sample");
        givenDevelopmentPath();
        givenSpyingHttpServer();
        givenHttpServerModule();
        whenInvokingAPI();
        thenOutFileShouldBeExportedToDist();
    });

    function givenDevelopmentPath() {
        serverRoot = path.join(process.cwd(), "src/structure-view/data");
        expectedOutFilePath  = path.join(serverRoot, "module-structure.json");

        if (!fs.existsSync(serverRoot)) {
            fs.mkdirSync(serverRoot);
        }

        getInstalledPathSync = sinon.stub();
        getInstalledPathSync.withArgs(project.name, {local: true}).throws(Error);

        dependencies.getInstalledPathSync = getInstalledPathSync;
    }

    it("repeats analysis on index.html reload", function(done) {
        givenConfigWithOpen();
        givenRootDir("test/resources/es6/ecommerce-sample");
        givenDevelopmentPath();
        givenFakeHttpServer();
        givenFakeHttpServerModule();
        givenOpener();
        whenInvokingAPI();
        afterPageIsLoaded();
        thenEmitShouldHaveBeenCalled();
        afterModelHasChanged()
            .then(() => andReloadingPage(done))
            .catch(err => failTest(err, done));
    });

    function givenFakeHttpServerModule() {
        HttpServerModule = {};
        HttpServerModule.createServer = function(options) {
            httpServerOptions = options;
            return httpServer;
        };
        dependencies.HttpServerModule = HttpServerModule;
    }

    function afterPageIsLoaded() {
        loadResource("/index.html?input=module-structure.json");
    }

    function thenEmitShouldHaveBeenCalled() {
        assert.isTrue(response.emit.called);
        response.emit.reset();
    }

    function loadResource(url) {
        const request = {};
        request.originalUrl = url;

        response = {};
        response.emit = sinon.spy();

        httpServerOptions.before[0](request, response);
    }

    function afterModelHasChanged() {
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "module-structure-"));
        tempDir = path.join(tempDir, "app");
        const sourceDir = path.join(rootDir, "app");

        return new Promise((resolve, reject) => {
            mv(sourceDir, tempDir, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(0);
                }
            });
        });
    }

    function andReloadingPage(done) {
        afterPageIsLoaded();
        thenEmitShouldHaveBeenCalled();
        thenExportedModelShouldEqualExpectedModel("ecommerce-sample-without-app.json");

        rollbackMovedDirectory()
            .then(() => done())
            .catch(err => done(err));
    }

    function rollbackMovedDirectory() {
        const destDir = path.join(rootDir, "app");

        return new Promise((resolve, reject) => {
            if (!fs.existsSync(tempDir)) {
                resolve(0);
                return;
            }

            mv(tempDir, destDir, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(0);
                }
            });
        });
    }

    function failTest(err, done) {
        rollbackMovedDirectory()
            .then(() => done(err))
            .catch(() => done(err));
    }


    it("doesn't repeats analysis for reload of other resources", function(done) {
        givenConfigWithOpen();
        givenRootDir("test/resources/es6/ecommerce-sample");
        givenDevelopmentPath();
        givenFakeHttpServer();
        givenFakeHttpServerModule();
        givenOpener();
        whenInvokingAPI();
        afterPageIsLoaded();
        thenEmitShouldHaveBeenCalled();
        afterModelHasChanged()
            .then(() => andLoadingSomeOtherResource(done))
            .catch(err => failTest(err, done));
    });

    function andLoadingSomeOtherResource(done) {
        loadResource("/styles.css");

        thenEmitShouldHaveBeenCalled();
        thenExportedModelShouldEqualExpectedModel("ecommerce-sample.json");

        rollbackMovedDirectory()
            .then(() => done())
            .catch(err => done(err));
    }
});
