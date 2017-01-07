import {StructureMapBuilder} from "./structure-map/structure-map-builder";
import {StructureMapPackage} from "./structure-map/structure-map-package";
import {StructureViewModelBuilder} from "./structure-map/structure-view-model-builder";
import {StructureViewModel} from "./structure-view-model/structure-view-model";

import fs = require("fs");
import path = require("path");
import process = require("process");

const httpServerModule = require("http-server");
const opener = require("opener");
const colors = require("colors/safe");
const preconditions = require("preconditions").instance();
const checkArgument = preconditions.checkArgument;
const getInstalledPathSync = require("get-installed-path").sync;
const project = require("../package.json");

let startTime = 0;


export class ModuleStructureConfiguration {
    rootDir = "";
    module = "es6";
    outFile = "";
    prettyPrint = false;
    serverPort = 3000;
    excludes = [];
    showExport = false;

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
    let config = new ModuleStructureConfiguration(options);

    if (isTemporaryExportNeeded(config)) {
        buildTemporaryOutFilePath(config);
    }

    let structureMap = createStructureMap(config);
    let viewModel = createViewModel(structureMap);

    if (config.outFile.length > 0) {
        exportViewModel(viewModel, config);
    }

    if (config.showExport) {
        showViewModel(config);
    }

    return viewModel;
}

function isTemporaryExportNeeded(config: ModuleStructureConfiguration) {
    return config.showExport && config.outFile.length === 0;
}

function buildTemporaryOutFilePath(config: ModuleStructureConfiguration): void {
    try {
        let installedPath = getInstalledPathSync(project.name);
        config.outFile = path.join(installedPath, "dist/web-app/module-structure.json");
    }
    catch (e) {
        // fallback for debugging/development
        config.outFile = path.join(process.cwd(), "src/structure-view/data/module-structure.json");
    }
}

function createStructureMap(config: ModuleStructureConfiguration): StructureMapPackage {
    startProcessing("Building structure map (may take some time for large AMD code bases)");

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

function createViewModel(structureMap: StructureMapPackage) {
    startProcessing("Exporting view model");

    let viewModelBuilder = new StructureViewModelBuilder();
    let viewModel = viewModelBuilder.build(structureMap);

    stopProcessing();

    return viewModel;
}

function exportViewModel(viewModel: StructureViewModel, config: ModuleStructureConfiguration): void {
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
