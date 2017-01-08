import {ModuleStructureConfiguration} from "./module-structure-configuration";
import {StructureMapBuilder} from "./structure-map/structure-map-builder";
import {StructureMapPackage} from "./structure-map/structure-map-package";
import {StructureViewModelBuilder} from "./structure-map/structure-view-model-builder";
import {StructureViewModel} from "./structure-view-model/structure-view-model";

import fs = require("fs");
import path = require("path");
import process = require("process");

const opener = require("opener");
const log4js = require("log4js");
const project = require("../package.json");

let logger;
let startTime = 0;
let config: ModuleStructureConfiguration;
let structureMap: StructureMapPackage;
let viewModel: StructureViewModel;


export function moduleStructure(options: any): StructureViewModel {
    buildConfiguration(options);
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
        let installedPath = config.getInstalledPathSync(project.name);
        config.outFile = path.join(installedPath, "dist/web-app/module-structure.json");
    }
    catch (e) {
        // fallback for debugging/development
        config.outFile = path.join(process.cwd(), "src/structure-view/data/module-structure.json");
    }
}

function isTemporaryExport(): boolean {
    return config.showExport && config.outFile.length === 0;
}

function createStructureMap(): void {
    startProcessing("Building structure map (may take some time for large AMD code bases)");

    let builder = new StructureMapBuilder();
    structureMap = builder.build(config.rootDir, config.module, config.excludes);

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

function isExportViewModel(): boolean {
    return config.outFile.length > 0;
}

function showViewModel(): void {
    if (!isShowViewModel()) {
        return;
    }

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

function isShowViewModel(): boolean {
    return config.showExport;
}

module.exports = moduleStructure;
