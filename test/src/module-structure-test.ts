import {moduleStructure} from "../../src/api";
import {suite, test} from "mocha-typescript";
import * as sinon from "sinon";
import {expect} from "chai";
import SinonSpyStatic = sinon.SinonSpyStatic;


const fs = require("fs");
const os = require("os");
const path = require("path");

const HttpServerModule = require("http-server");
const HttpServer = require("http-server").HttpServer;


@suite class ModuleStructureConfigurationTest {

    @test "shows export"() {
        this.showsExport();
    }

    private showsExport(port: number = undefined) {
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

    @test "shows export with given port"() {
        this.showsExport(8080);
    }

    @test "doesn't show export if not specified"() {
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
}
