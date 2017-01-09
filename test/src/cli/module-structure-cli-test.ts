import {suite, test} from "mocha-typescript";
import {expect} from "chai";
import * as sinon from "sinon";
import {Application} from "../../../src/module-structure-cli";

const path = require("path");

@suite class ModuleStructureCLITest {
    private cli: Application;
    private api: any;
    private expectedConfig: any = {
        rootDir: "",
        outFile: undefined,
        exclude: [],
        pretty: false,
        port: 3000,
        open: true,
        logging: true
    };


    before() {
        process.argv = process.argv.slice(0, 2);
    }

    @test "exports to temp dir and shows export if only rootDir is given"() {
        this.givenAPI();
        this.givenCLI();
        this.givenRootDir();
        this.whenInvokingCLI();
        this.thenAPIShouldBeCalledWithExpectedConfig();
    }

    private givenAPI() {
        this.api = sinon.spy();
    }

    private givenCLI() {
        this.cli = new Application(this.api);
    }

    private givenRootDir() {
        this.expectedConfig.rootDir = path.join(process.cwd(), "test/resources/es6/ecommerce-sample");
        process.argv.push.apply(process.argv, ["--rootDir", this.expectedConfig.rootDir]);
    }

    private whenInvokingCLI() {
        this.cli.run();
    }

    private thenAPIShouldBeCalledWithExpectedConfig() {
        expect(this.api.calledWith(this.expectedConfig)).to.be.true;
        this.api.reset();
    }

    @test "exports and terminates if outFile is given"() {
        this.givenAPI();
        this.givenCLI();
        this.givenRootDir();
        this.givenOutFile();
        expect(() => this.whenInvokingCLI()).to.throw(null);
        this.thenAPIShouldBeCalledWithExpectedConfig();
    }

    private givenOutFile() {
        this.expectedConfig.outFile = path.join(process.cwd(), "test", "module-structure.json");
        process.argv.push.apply(process.argv, ["--outFile", this.expectedConfig.outFile]);

        this.expectedConfig.open = false;
    }

    @test "throws error if rootDir is missing"() {
        this.givenAPI();
        this.givenCLI();
        this.givenOutFile();
        expect(() => this.whenInvokingCLI()).to.throw(Error);
    }

    @test "throws error if rootDir is invalid"() {
        this.givenAPI();
        this.givenCLI();
        this.givenInvalidRootDir();
        expect(() => this.whenInvokingCLI()).to.throw(Error);
    }

    private givenInvalidRootDir() {
        this.expectedConfig.rootDir = path.join(process.cwd(), "not-existing-dir");
        process.argv.push.apply(process.argv, ["--rootDir", this.expectedConfig.rootDir]);
    }

    @test "throws error if outFile is invalid"() {
        this.givenAPI();
        this.givenCLI();
        this.givenRootDir();
        this.givenInvalidOutFile();
        expect(() => this.whenInvokingCLI()).to.throw(Error);
    }

    private givenInvalidOutFile(): void {
        this.expectedConfig.outFile = path.join(process.cwd(), "not-existing-dir", "module-structure.json");
        process.argv.push.apply(process.argv, ["--outFile", this.expectedConfig.outFile]);
    }

    @test "terminates after showing help"() {
        this.givenAPI();
        this.givenCLI();
        this.givenHelpArgument();
        expect(() => this.whenInvokingCLI()).to.throw(null);
    }

    private givenHelpArgument() {
        process.argv.push.apply(process.argv, ["--help"]);
    }

    @test "terminates after showing version"() {
        this.givenAPI();
        this.givenCLI();
        this.givenVersionArgument();
        expect(() => this.whenInvokingCLI()).to.throw(null);
    }

    private givenVersionArgument() {
        process.argv.push.apply(process.argv, ["--version"]);
    }

    @test "throws error if unknown argument specified"() {
        this.givenAPI();
        this.givenCLI();
        this.givenUnknownArgument();
        expect(() => this.whenInvokingCLI()).to.throw(Error);
    }

    private givenUnknownArgument() {
        process.argv.push.apply(process.argv, ["--wrong"]);
    }

    @test "rethrows errors"() {
        let error = null;

        try {
            this.givenThrowingAPI();
            this.givenCLI();
            this.givenRootDir();
            this.whenInvokingCLI();
        }
        catch (e) {
            error = e;
        }

        expect(error).to.be.not.null;
    }

    private givenThrowingAPI() {
        this.api = sinon.stub();
        this.api.withArgs(this.expectedConfig).throws(Error);
    }
}
