import {ModuleStructureConfiguration} from "./module-structure-configuration";
import {StructureMapBuilder} from "./structure-map/structure-map-builder";
import {StructureMapPackage} from "./structure-map/structure-map-package";
import {StructureViewModelBuilder} from "./structure-map/structure-view-model-builder";
import {StructureViewModel} from "./structure-view-model/structure-view-model";

import fs = require("fs");
import path = require("path");
import process = require("process");

const log4js = require("log4js");
const project = require("../package.json");

let HttpServerModule = require("http-server");
let getInstalledPathSync = require("get-installed-path").sync;
let opener = require("opener");

let logger;
let startTime = 0;
let config: ModuleStructureConfiguration;
let structureMap: StructureMapPackage;
let viewModel: StructureViewModel;
let firstRequest = true;


export function moduleStructure(options: any): StructureViewModel {
    buildConfiguration(options);
    injectDependencies(arguments);
    configureLogging();
    buildTemporaryOutFilePath();
    createStructureMap();
    createViewModel();
    exportViewModel();
    showViewModel();

    return viewModel;
}

function buildConfiguration(options: any): void {
    config = new ModuleStructureConfiguration(options);
}

function injectDependencies(args: IArguments) {
    if (args.length < 2) {
        return;
    }

    let dependencies = args[1];
    HttpServerModule = dependencies.HttpServerModule ? dependencies.HttpServerModule : HttpServerModule;
    opener = dependencies.opener ? dependencies.opener : opener;
    getInstalledPathSync = dependencies.getInstalledPathSync ? dependencies.getInstalledPathSync : getInstalledPathSync;
}

function configureLogging(): void {
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

function buildTemporaryOutFilePath(): void {
    if (!isTemporaryExport()) {
        return;
    }

    try {
        let installedPath = getInstalledPathSync(project.name);
        config.outFile = path.join(installedPath, "dist/web-app/module-structure.json");
    }
    catch (e) {
        // fallback for debugging/development
        config.outFile = path.join(process.cwd(), "src/structure-view/data/module-structure.json");
    }
}

function isTemporaryExport(): boolean {
    return config.open && config.outFile.length === 0;
}

function createStructureMap(): void {
    startProcessing("Building structure map (may take some time for large AMD code bases)");

    let builder = new StructureMapBuilder();
    structureMap = builder.build(config.rootDir, config.ts, config.exclude);

    stopProcessing();
}

function startProcessing(message: string): void {
    logger.info(message + " ... ");
    startTime = Date.now();
}

function stopProcessing(): void {
    let stopTime = Date.now();
    let elapsed = stopTime - startTime;
    logger.info("Finished in " + elapsed + "ms");
}

function createViewModel(): void {
    startProcessing("Exporting view model");

    let viewModelBuilder = new StructureViewModelBuilder();
    viewModel = viewModelBuilder.build(structureMap);

    stopProcessing();
}

function exportViewModel(): void {
    if (!isExportViewModel()) {
        return;
    }

    if (fs.existsSync(config.outFile)) {
        fs.unlinkSync(config.outFile);
    }

    let spacing = config.pretty ? 2 : 0;
    fs.writeFileSync(config.outFile, JSON.stringify(viewModel, null, spacing));
}

function isExportViewModel(): boolean {
    return config.outFile.length > 0;
}

function showViewModel(): void {
    if (!isShowViewModel()) {
        return;
    }

    let serverRoot = path.dirname(config.outFile);
    logger.info("Starting http-server, serving from " + serverRoot);

    let options = {
        root: serverRoot,
        cache: 0,
        before: [onRequest]
    };

    let server = HttpServerModule.createServer(options);
    server.listen(config.port, "127.0.0.1", () => {
        let url = "http://localhost:" + config.port + "/index.html?input=module-structure.json";
        logger.info("Module structure is now available at " + url);
        logger.info("Hit F5 in browser to run analysis again and refresh browser");
        logger.info("Hit CTRL-C to stop the server");

        opener(url);
    });
}

function onRequest(req, res) {
    try {
        if (firstRequest) {
            firstRequest = false;
            return;
        }

        if (req.originalUrl.indexOf("/index.html") !== 0) {
            return;
        }

        createStructureMap();
        createViewModel();
        exportViewModel();
    }
    finally {
        res.emit("next");
    }
}

function isShowViewModel(): boolean {
    return config.open;
}

module.exports = moduleStructure;
