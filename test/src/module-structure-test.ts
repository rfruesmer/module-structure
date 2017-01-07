import {moduleStructure} from "../../src/api";
import {suite, test} from "mocha-typescript";
import * as sinon from "sinon";
import {expect} from "chai";
import SinonSpyStatic = sinon.SinonSpyStatic;


const fs = require("fs");
const os = require("os");
const path = require("path");
const rimrafSync = require("rimraf").sync;
const project = require("../../package.json");

const HttpServerModule = require("http-server");
const HttpServer = require("http-server").HttpServer;


@suite class ModuleStructureConfigurationTest {

    @test "starts http-server"() {
        this.startsHttpServer();
    }

    private startsHttpServer(port: number = undefined) {
        let rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "module-structure-test-"));
        let outDir = path.join(process.cwd(), "src", "structure-view", "data");
        let httpServerSpy = new HttpServer();
        httpServerSpy.listen = sinon.spy();
        let HttpServerModuleMock = sinon.mock(HttpServerModule);
        HttpServerModuleMock.expects("createServer").withExactArgs({root: outDir}).once().returns(httpServerSpy);

        moduleStructure({rootDir: rootDir, showExport: true, serverPort: port, httpServerModule: HttpServerModule});

        HttpServerModuleMock.verify();
        expect(httpServerSpy.listen.withArgs(port ? port : 3000, "127.0.0.1").calledOnce).to.be.true;

        fs.rmdirSync(rootDir);
    }

    @test "starts http-sserver with given port"() {
        this.startsHttpServer(8080);
    }

    @test "doesn't start http-server if showExport isn't specified"() {
        let rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "module-structure-test-"));
        let httpServerSpy = new HttpServer();
        httpServerSpy.listen = sinon.spy();
        let HttpServerModuleMock = sinon.mock(HttpServerModule);
        HttpServerModuleMock.expects("createServer").never();

        moduleStructure({rootDir: rootDir, httpServerModule: HttpServerModule});

        HttpServerModuleMock.verify();
        expect(httpServerSpy.listen.notCalled).to.be.true;

        fs.rmdirSync(rootDir);
    }

    @test "opens browser"(done) {
        this.opensBrowser(done);
    }

    private opensBrowser(done: any, port: number = undefined) {
        let rootDir = path.join(process.cwd(), "test", "resources", "es6", "ecommerce-sample");
        let outDir = path.join(process.cwd(), "src", "structure-view", "data");
        let outFile = path.join(outDir, "module-structure.json");


        let httpServerSpy = new HttpServer();
        httpServerSpy.listen = function(port, host, callback) {
            callback();
        };

        let HttpServerModuleMock = sinon.mock(HttpServerModule);
        HttpServerModuleMock.expects("createServer").once().returns(httpServerSpy);

        let opener = function(actualURL) {
            let expectedURL = "http://localhost:" + (port ? port : "3000") + "/index.html?input=module-structure.json";
            expect(actualURL).to.equal(expectedURL);
            HttpServerModuleMock.verify();
            done();
        };

        moduleStructure({rootDir: rootDir, showExport: true, serverPort: port, opener: opener});

        fs.unlinkSync(outFile);
        fs.rmdirSync(outDir);
    }

    @test "opens browser at given port"(done) {
        this.opensBrowser(done, 8080);
    }

    @test "creates outFile"() {
        let rootDir = path.join(process.cwd(), "test", "resources", "es6", "ecommerce-sample");
        let outDir = fs.mkdtempSync(path.join(os.tmpdir(), "module-structure-test-"));
        let outFile = path.join(outDir, "module-structure.json");

        moduleStructure({rootDir: rootDir, outFile: outFile});

        let actualModel = JSON.parse(fs.readFileSync(outFile, "utf-8"));
        let expectedModelPath = path.join(rootDir, "ecommerce-sample.json");
        let expectedModel = JSON.parse(fs.readFileSync(expectedModelPath, "utf-8"));

        expect(actualModel).to.deep.equal(expectedModel);

        fs.unlinkSync(outFile);
        fs.rmdirSync(outDir);
    }

    @test "skips excluded names"() {
        let rootDir = path.join(process.cwd(), "test", "resources", "es6", "ecommerce-sample");

        let actualModel = moduleStructure({rootDir: rootDir, excludes: ["billing", "sales-service.js"]});

        let expectedModelPath = path.join(rootDir, "ecommerce-sample-without-excludes.json");
        let expectedModel = JSON.parse(fs.readFileSync(expectedModelPath, "utf-8"));

        expect(actualModel).to.deep.equal(expectedModel);
    }

    @test "uses installation dist path for temporary outFiles"() {
        let rootDir = path.join(process.cwd(), "test", "resources", "es6", "ecommerce-sample");
        let installedPath = path.join(process.cwd());
        let distPath = path.join(installedPath, "dist");
        let webAppPath = path.join(distPath, "web-app");
        let expectedOutFilePath  = path.join(webAppPath, "module-structure.json");

        rimrafSync(distPath);
        fs.mkdirSync(distPath);
        fs.mkdirSync(webAppPath);

        let getInstalledPathSync = sinon.stub();
        getInstalledPathSync.withArgs(project.name).returns(installedPath);

        moduleStructure({rootDir: rootDir, showExport: true, getInstalledPathSync: getInstalledPathSync});

        let actualModel = JSON.parse(fs.readFileSync(expectedOutFilePath, "utf-8"));
        let expectedModelPath = path.join(rootDir, "ecommerce-sample.json");
        let expectedModel = JSON.parse(fs.readFileSync(expectedModelPath, "utf-8"));

        expect(getInstalledPathSync.withArgs(project.name).calledOnce).to.be.true;
        expect(actualModel).to.deep.equal(expectedModel);
    }
}

