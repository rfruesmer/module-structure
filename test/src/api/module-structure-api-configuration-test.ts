import {ModuleStructureConfiguration} from "../../../src/module-structure-configuration";

import {suite, test} from "mocha-typescript";
import {expect} from "chai";

const fs = require("fs");
const os = require("os");
const path = require("path");


@suite class ModuleStructureAPIConfigurationTest {
    @test "checkRootDir rejects undefined rootDir"() {
        let rootDir = undefined;
        expect(ModuleStructureConfiguration.checkRootDir(rootDir)).to.be.false;
    }

    @test "checkRootDir rejects empty rootDir"() {
        let rootDir = "";
        expect(ModuleStructureConfiguration.checkRootDir(rootDir)).to.be.false;
    }

    @test "checkRootDir rejects non-existing rootDir"() {
        let rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "module-structure-test-"));
        fs.rmdirSync(rootDir);

        expect(ModuleStructureConfiguration.checkRootDir(rootDir)).to.be.false;
    }

    @test "checkOutFile accepts empty outFile"() {
        expect(ModuleStructureConfiguration.checkOutFile("")).to.be.true;
    }

    @test "checkOutFile accepts undefined outFile"() {
        let outFile = undefined;
        expect(ModuleStructureConfiguration.checkOutFile(outFile)).to.be.true;
    }

    @test "checkOutFile checks that outFile directory exists"() {
        let outFileDir = fs.mkdtempSync(path.join(os.tmpdir(), "module-structure-test-"));
        let outFile = path.join(outFileDir, "module-structure.json");
        fs.rmdirSync(outFileDir);

        expect(ModuleStructureConfiguration.checkOutFile(outFile)).to.be.false;
    }

    @test "constructor throws error if rootDir is undefined"() {
        expect(() => new ModuleStructureConfiguration({})).to.throw(Error);
    }

    @test "constructor throws error if rootDir is empty"() {
        expect(() => new ModuleStructureConfiguration({rootDir: ""})).to.throw(Error);
    }

    @test "constructor throws error if rootDir does not exist"() {
        let rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "module-structure-test-"));
        fs.rmdirSync(rootDir);

        expect(() => new ModuleStructureConfiguration({rootDir: rootDir})).to.throw(Error);
    }

    @test "constructor doesn't throw error if rootDir exists"() {
        let rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "module-structure-test-"));

        expect(() => new ModuleStructureConfiguration({rootDir: rootDir})).to.not.throw(Error);

        fs.rmdirSync(rootDir);
    }

    @test "constructor doesn't throw error if module is undefined"() {
        let rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "module-structure-test-"));

        expect(() => new ModuleStructureConfiguration({rootDir: rootDir})).to.not.throw(Error);

        fs.rmdirSync(rootDir);
    }

    @test "constructor doesn't throw error if module is empty"() {
        let rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "module-structure-test-"));

        expect(() => new ModuleStructureConfiguration({rootDir: rootDir, module: ""})).to.not.throw(Error);

        fs.rmdirSync(rootDir);
    }

    @test "constructor doesn't throw error if module is es6"() {
        let rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "module-structure-test-"));

        expect(() => new ModuleStructureConfiguration({rootDir: rootDir, module: "es6"})).to.not.throw(Error);

        fs.rmdirSync(rootDir);
    }

    @test "constructor doesn't throw error if module is ts"() {
        let rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "module-structure-test-"));

        expect(() => new ModuleStructureConfiguration({rootDir: rootDir, module: "ts"})).to.not.throw(Error);

        fs.rmdirSync(rootDir);
    }

    @test "constructor doesn't throw error if outFile is empty"() {
        let rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "module-structure-test-"));

        expect(() => new ModuleStructureConfiguration({rootDir: rootDir, outFile: ""})).to.not.throw(Error);

        fs.rmdirSync(rootDir);
    }

    @test "constructor doesn't throw error if outFile is undefined"() {
        let rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "module-structure-test-"));

        expect(() => new ModuleStructureConfiguration({rootDir: rootDir})).to.not.throw(Error);

        fs.rmdirSync(rootDir);
    }

    @test "constructor doesn't throw error if outFile directory exists"() {
        let rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "module-structure-test-"));
        let outFileDir = fs.mkdtempSync(path.join(os.tmpdir(), "module-structure-test-"));
        let outFile = path.join(outFileDir, "module-structure.json");

        expect(() => new ModuleStructureConfiguration({rootDir: rootDir, outFile: outFile})).to.not.throw(Error);

        fs.rmdirSync(outFileDir);
    }

    @test "constructor throws error if outFile directory doesn't exists"() {
        let rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "module-structure-test-"));
        let outFileDir = fs.mkdtempSync(path.join(os.tmpdir(), "module-structure-test-"));
        let outFile = path.join(outFileDir, "module-structure.json");
        fs.rmdirSync(outFileDir);

        expect(() => new ModuleStructureConfiguration({rootDir: rootDir, outFile: outFile})).to.throw(Error);
    }
}
