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
    logging: boolean;


    constructor(options: any) {
        checkArgument(ModuleStructureConfiguration.checkRootDir(options.rootDir), "invalid rootDir");
        checkArgument(ModuleStructureConfiguration.checkOutFile(options.outFile), "output directory doesn't exist");

        this.rootDir = options.rootDir;
        this.outFile = options.outFile ? options.outFile : "";
        this.exclude = options.exclude ? options.exclude : [];
        this.pretty = options.pretty ? options.pretty : false;
        this.port =  options.port ? options.port : 3000;
        this.open = options.open ? options.open : false;
        this.logging = options.logging;
    }

    public static checkRootDir(rootDir: string): boolean {
        return rootDir !== undefined
            && fs.existsSync(rootDir)
            && fs.statSync(rootDir).isDirectory();
    }

    public static checkOutFile(outFile: string): boolean {
        if (!outFile) {
            return true;
        }

        let outDir = path.dirname(outFile);
        return fs.existsSync(outDir)
            && fs.statSync(outDir).isDirectory();
    }
}
