import {ModuleStructureConfiguration} from "../../../src/module-structure-configuration";

import {suite, test} from "mocha-typescript";
import {expect} from "chai";

const fs = require("fs");
const os = require("os");
const path = require("path");


@suite class ModuleStructureAPIConfigurationTest {
    private rootDir: string;
    private outFile: string;

    @test "checkRootDir rejects undefined rootDir"() {
        this.rootDir = undefined;
        expect(ModuleStructureConfiguration.checkRootDir(this.rootDir)).to.be.false;
    }

    @test "checkRootDir rejects empty this.rootDir"() {
        this.rootDir = "";
        expect(ModuleStructureConfiguration.checkRootDir(this.rootDir)).to.be.false;
    }

    @test "checkRootDir rejects non-existing this.rootDir"() {
        this.givenRootDir();
        fs.rmdirSync(this.rootDir);

        expect(ModuleStructureConfiguration.checkRootDir(this.rootDir)).to.be.false;
    }

    @test "checkOutFile accepts empty outFile"() {
        expect(ModuleStructureConfiguration.checkOutFile("")).to.be.true;
    }

    @test "checkOutFile accepts undefined outFile"() {
        this.outFile = undefined;
        expect(ModuleStructureConfiguration.checkOutFile(this.outFile)).to.be.true;
    }

    @test "checkOutFile checks that outFile directory exists"() {
        this.givenOutFile();
        fs.rmdirSync(path.dirname(this.outFile));

        expect(ModuleStructureConfiguration.checkOutFile(this.outFile)).to.be.false;
    }

    private givenOutFile() {
        let outFileDir = fs.mkdtempSync(path.join(os.tmpdir(), "module-structure-test-"));
        this.outFile = path.join(outFileDir, "module-structure.json");
    }

    @test "constructor throws error if this.rootDir is undefined"() {
        expect(() => new ModuleStructureConfiguration({})).to.throw(Error);
    }

    @test "constructor throws error if this.rootDir is empty"() {
        expect(() => new ModuleStructureConfiguration({rootDir: this.rootDir})).to.throw(Error);
    }

    @test "constructor throws error if this.rootDir does not exist"() {
        this.givenRootDir();
        fs.rmdirSync(this.rootDir);

        expect(() => new ModuleStructureConfiguration({rootDir: this.rootDir})).to.throw(Error);
    }

    @test "constructor doesn't throw error if this.rootDir exists"() {
        this.givenRootDir();
        this.outFile = path.join(this.rootDir, "module-structure.json");

        expect(() => new ModuleStructureConfiguration({rootDir: this.rootDir, outFile: this.outFile})).to.not.throw(Error);

        fs.rmdirSync(this.rootDir);
    }

    @test "constructor doesn't throw error if outFile is empty"() {
        this.givenRootDir();

        expect(() => new ModuleStructureConfiguration({rootDir: this.rootDir, open: true, outFile: ""})).to.not.throw(Error);

        fs.rmdirSync(this.rootDir);
    }

    @test "constructor doesn't throw error if outFile is undefined"() {
        this.givenRootDir();

        expect(() => new ModuleStructureConfiguration({rootDir: this.rootDir, open: true})).to.not.throw(Error);

        fs.rmdirSync(this.rootDir);
    }

    @test "constructor doesn't throw error if outFile directory exists"() {
        this.givenRootDir();
        this.givenOutFile();

        expect(() => new ModuleStructureConfiguration({rootDir: this.rootDir, outFile: this.outFile})).to.not.throw(Error);

        fs.rmdirSync(path.dirname(this.outFile));
    }

    @test "constructor throws error if outFile directory doesn't exists"() {
        this.givenRootDir();
        this.givenOutFile();
        fs.rmdirSync(path.dirname(this.outFile));

        expect(() => new ModuleStructureConfiguration({rootDir: this.rootDir, outFile: this.outFile})).to.throw(Error);
    }

    private givenRootDir() {
        this.rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "module-structure-test-"));
    }
}
