import fs = require("fs");
import path = require("path");

const opener = require("opener");

const preconditions = require("preconditions").instance();
const checkArgument = preconditions.checkArgument;


export class ModuleStructureConfiguration {
    rootDir = "";
    outFile = "";
    exclude = [];
    pretty = false;
    port = 3000;
    open = false;
    inputFile = "";
    logging: boolean;
    debug: boolean;

    constructor(options: any) {
        checkArgument(ModuleStructureConfiguration.checkRootDir(options), "invalid rootDir");
        checkArgument(ModuleStructureConfiguration.checkOutFile(options.outFile), "output directory doesn't exist");
        checkArgument(ModuleStructureConfiguration.checkOpen(options), "outFile argument missing or invalid");
        checkArgument(ModuleStructureConfiguration.checkInputFile(options.inputFile), "invalid input file");

        this.rootDir = options.rootDir;
        this.outFile = options.outFile ? options.outFile : "";
        this.exclude = options.exclude ? options.exclude : [];
        this.pretty = options.pretty ? options.pretty : false;
        this.port =  options.port ? options.port : 3000;
        this.open = options.open ? options.open : false;
        this.inputFile = options.inputFile;
        this.logging = options.logging;
    }

    public static checkRootDir(options: any): boolean {
        if (options.inputFile) {
            return true;
        }

        return options.rootDir !== undefined
            && fs.existsSync(options.rootDir)
            && fs.statSync(options.rootDir).isDirectory();
    }

    public static checkOutFile(outFile: string): boolean {
        if (!outFile) {
            return true;
        }

        let outDir = path.dirname(outFile);
        return fs.existsSync(outDir)
            && fs.statSync(outDir).isDirectory();
    }

    private static checkOpen(options: any) {
        if (options.open) {
            return true;
        }

        if (!options.outFile || options.outFile.length === 0) {
            return false;
        }

        let outDir = path.dirname(options.outFile);
        return fs.existsSync(outDir)
            && fs.statSync(outDir).isDirectory();
    }

    private static checkInputFile(inputFile: string) {
        if (!inputFile) {
            return true;
        }

        return fs.existsSync(inputFile)
            && fs.statSync(inputFile).isFile();
    }
}
