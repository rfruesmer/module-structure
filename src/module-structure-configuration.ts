import fs = require("fs");
import path = require("path");

const httpServerModule = require("http-server");
const getInstalledPathSync = require("get-installed-path").sync;
const opener = require("opener");

const preconditions = require("preconditions").instance();
const checkArgument = preconditions.checkArgument;


export class ModuleStructureConfiguration {
    rootDir = "";
    module = "es6";
    outFile = "";
    prettyPrint = false;
    serverPort = 3000;
    excludes = [];
    showExport = false;
    HttpServerModule: any;
    opener: any;
    getInstalledPathSync: any;
    logging: boolean;


    constructor(options: any) {
        checkArgument(ModuleStructureConfiguration.checkRootDir(options.rootDir), "invalid rootDir");
        checkArgument(ModuleStructureConfiguration.checkModule(options.module), "invalid module type");
        checkArgument(ModuleStructureConfiguration.checkOutFile(options.outFile), "invalid outFile");

        this.rootDir = options.rootDir;
        this.module = options.module ? options.module : "es6";
        this.outFile = options.outFile ? options.outFile : "";
        this.prettyPrint = options.prettyPrint ? options.prettyPrint : false;
        this.serverPort =  options.serverPort ? options.serverPort : 3000;
        this.excludes = options.excludes ? options.excludes : [];
        this.showExport = options.showExport ? options.showExport : false;
        this.HttpServerModule = options.HttpServerModule ? options.HttpServerModule : httpServerModule;
        this.opener = options.opener ? options.opener : opener;
        this.getInstalledPathSync = options.getInstalledPathSync ? options.getInstalledPathSync : getInstalledPathSync;
        this.logging = options.logging;
    }

    public static checkRootDir(rootDir: string): boolean {
        return rootDir !== undefined
            && fs.existsSync(rootDir)
            && fs.statSync(rootDir).isDirectory();
    }

    public static checkModule(module: string): boolean {
        return !module
            || module === "es6"
            || module === "ts";
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
