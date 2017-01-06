import {StructureMapBuilder} from "./structure-map/structure-map-builder";
import {StructureViewModelBuilder} from "./structure-map/structure-view-model-builder";

import fs = require("fs");
import path = require("path");
import process = require("process");
import {StructureMapPackage} from "./structure-map/structure-map-package";

const httpServerModule = require("http-server");
const opener = require("opener");
const colors = require("colors/safe");

let startTime = 0;

export class ModuleStructureConfiguration {
    rootDir = "";
    module = "es6";
    outFile = "";
    prettyPrint = false;
    serverPort = 3000;
    excludes = [];
    showExport = false;
}

export function moduleStructure(config: ModuleStructureConfiguration): void {
    let structureMap = createStructureMap(config);
    exportViewModel(structureMap, config);
    if (config.showExport) {
        showViewModel(config);
    }
}

function createStructureMap(config: ModuleStructureConfiguration): StructureMapPackage {
    startProcessing("Building structure map (this may take some time for large AMD code bases)");

    let builder = new StructureMapBuilder();
    let structureMap = builder.build(config.rootDir, config.module, config.excludes);

    stopProcessing();

    return structureMap;
}

function startProcessing(message: string) {
    process.stdout.write(colors.yellow(message + " ... "));
    startTime = Date.now();
}

function stopProcessing() {
    let stopTime = Date.now();
    let elapsed = stopTime - startTime;
    console.log(colors.yellow("finished in " + elapsed + "ms"));
}

function exportViewModel(structureMap: StructureMapPackage, config: ModuleStructureConfiguration): void {
    startProcessing("Exporting view model");

    let destDir = path.dirname(config.outFile);
    if (!fs.existsSync(destDir)) {
        fs.mkdir(destDir);
    }

    if (fs.existsSync(config.outFile)) {
        fs.unlinkSync(config.outFile);
    }

    let viewModelBuilder = new StructureViewModelBuilder();
    let viewModel = viewModelBuilder.build(structureMap);

    let spacing = config.prettyPrint ? 2 : 0;
    fs.writeFileSync(config.outFile, JSON.stringify(viewModel, null, spacing));

    stopProcessing();
}

function showViewModel(config: ModuleStructureConfiguration): void {
    let serverRoot = path.dirname(config.outFile);
    console.log(colors.yellow("Starting http-server, serving from " + serverRoot));

    let server = httpServerModule.createServer({root: serverRoot});
    server.listen(config.serverPort, "127.0.0.1", () => {
        let url = "http://localhost:" + config.serverPort + "/index.html?input=module-structure.json";
        console.log(colors.green("Module structure is now available at " + url));
        console.info("Hit CTRL-C to stop the server");

        opener(url);
    });
}
