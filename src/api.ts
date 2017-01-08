import {StructureMapBuilder} from "./structure-map/structure-map-builder";
import {StructureMapPackage} from "./structure-map/structure-map-package";
import {StructureViewModelBuilder} from "./structure-map/structure-view-model-builder";
import {StructureViewModel} from "./structure-view-model/structure-view-model";

import fs = require("fs");
import path = require("path");
import process = require("process");

const httpServerModule = require("http-server");
const opener = require("opener");
const log4js = require("log4js");
const preconditions = require("preconditions").instance();
const checkArgument = preconditions.checkArgument;
const getInstalledPathSync = require("get-installed-path").sync;
const project = require("../package.json");

let startTime = 0;
let config: ModuleStructureConfiguration;
let logger;


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

export function moduleStructure(options: any): StructureViewModel {
    config = new ModuleStructureConfiguration(options);
    configureLogging();

    if (isTemporaryExportNeeded()) {
        buildTemporaryOutFilePath();
    }

    let structureMap = createStructureMap();
    let viewModel = createViewModel(structureMap);

    if (config.outFile.length > 0) {
        exportViewModel(viewModel);
    }

    if (config.showExport) {
        showViewModel();
    }

    return viewModel;
}

function configureLogging()  {
    let log4jsConfig = {
        appenders: [
            {
                type: "console",
                layout: {
                    type: "pattern",
                    pattern: "%m"
                }
            }
        ]
    };
    log4js.configure(log4jsConfig);

    logger = log4js.getLogger();
    logger.setLevel(config.logging ? log4js.levels.INFO : log4js.levels.OFF);
}

function isTemporaryExportNeeded() {
    return config.showExport && config.outFile.length === 0;
}

function buildTemporaryOutFilePath(): void {
    try {
        let installedPath = config.getInstalledPathSync(project.name);
        config.outFile = path.join(installedPath, "dist/web-app/module-structure.json");
    }
    catch (e) {
        // fallback for debugging/development
        config.outFile = path.join(process.cwd(), "src/structure-view/data/module-structure.json");
    }
}

function createStructureMap(): StructureMapPackage {
    startProcessing("Building structure map (may take some time for large AMD code bases)");

    let builder = new StructureMapBuilder();
    let structureMap = builder.build(config.rootDir, config.module, config.excludes);

    stopProcessing();

    return structureMap;
}

function startProcessing(message: string) {
    logger.info(message + " ... ");
    startTime = Date.now();
}

function stopProcessing() {
    let stopTime = Date.now();
    let elapsed = stopTime - startTime;
    logger.info("Finished in " + elapsed + "ms");
}

function createViewModel(structureMap: StructureMapPackage) {
    startProcessing("Exporting view model");

    let viewModelBuilder = new StructureViewModelBuilder();
    let viewModel = viewModelBuilder.build(structureMap);

    stopProcessing();

    return viewModel;
}

function exportViewModel(viewModel: StructureViewModel): void {
    let destDir = path.dirname(config.outFile);
    if (!fs.existsSync(destDir)) {
        fs.mkdir(destDir);
    }

    if (fs.existsSync(config.outFile)) {
        fs.unlinkSync(config.outFile);
    }

    let spacing = config.prettyPrint ? 2 : 0;
    fs.writeFileSync(config.outFile, JSON.stringify(viewModel, null, spacing));
}

function showViewModel(): void {
    let serverRoot = path.dirname(config.outFile);
    logger.info("Starting http-server, serving from " + serverRoot);

    let server = config.HttpServerModule.createServer({root: serverRoot});
    server.listen(config.serverPort, "127.0.0.1", () => {
        let url = "http://localhost:" + config.serverPort + "/index.html?input=module-structure.json";
        logger.info("Module structure is now available at " + url);
        logger.info("Hit CTRL-C to stop the server");

        config.opener(url);
    });
}

