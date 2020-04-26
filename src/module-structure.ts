import {ModuleStructureConfiguration} from "./module-structure-configuration";
import {StructureMapBuilder} from "./structure-map/structure-map-builder";
import {StructureMapPackage} from "./structure-map/structure-map-package";
import {StructureViewModel} from "./structure-view-model/structure-view-model";
import {StructureViewModelBuilder} from "./structure-map/structure-view-model-builder";
import {ExtensionRegistry} from "./structure-map/extension-registry";
import fs = require("fs-extra");
import path = require("path");
import process = require("process");
import os = require("os");

const log4js = require("log4js");
const project = require("../package.json");
const PluginManager = require("js-plugins");

let HttpServerModule = require("http-server");
let getInstalledPathSync = require("get-installed-path").getInstalledPathSync;
let opener = require("opener");

const TEMP_DIR = "module-structure-0c8c1f08";

let logger;
let startTime = 0;
let config: ModuleStructureConfiguration;
let structureMap: StructureMapPackage;
let viewModel: StructureViewModel;
let firstRequest = true;
let installedPath = "";
let extensionRegistry = new ExtensionRegistry();


export function moduleStructure(options: any): StructureViewModel {
    injectDependencies(arguments);
    buildConfiguration(options);
    configureLogging();
    loadExtensions();

    if (isTemporaryExport()) {
        deployWebAppToTempDir();
    }

    if (isCreateViewModel(options)) {
        createStructureMap();
        createViewModel();
    }
    else {
        readViewModel(options.inputFile);
    }

    if (isExportViewModel()) {
        exportViewModel();
    }

    if (isShowViewModel()) {
        showViewModel();
    }

    return viewModel;
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

function buildConfiguration(options: any): void {
    installedPath = getInstalledPath();

    config = new ModuleStructureConfiguration(options);
    config.debug = installedPath.length === 0;
    if (config.rootDir && !path.isAbsolute(config.rootDir)) {
        config.rootDir = path.join(process.cwd(), config.rootDir);
    }
}

function getInstalledPath(): string {
    try {
        return getInstalledPathSync(project.name, {local: true});
    }
    catch (e) {
        // ignored
    }

    try {
        return getInstalledPathSync(project.name);
    }
    catch (e) {
        // ignored
    }

    return "";
}

function configureLogging(): void {
    let log4jsConfig = {
        appenders: {
            default: {
                type: "console",
                layout: {
                    type: "pattern",
                    pattern: "%m"
                }
            }
        },
        categories: {
            default: {
                appenders: ["default"],
                level: "info"
            }
        }
    };
    log4js.configure(log4jsConfig);

    logger = log4js.getLogger();
    logger.level = config.logging ? log4js.levels.INFO : log4js.levels.OFF;
}

function loadExtensions(): void {
    let globalModulesDirectory = require("global-modules");
    let moduleDirectories = [globalModulesDirectory];
    let localModulesDirectory = getInstalledPath();
    localModulesDirectory = localModulesDirectory.length > 0
        ? path.join(localModulesDirectory, "..")
        : path.join(process.cwd(), "node_modules"); // for development
    if (path.basename(localModulesDirectory) === "node_modules"
            && localModulesDirectory !== globalModulesDirectory) {
        moduleDirectories.push(localModulesDirectory);
    }

    let pluginManager = new PluginManager();
    pluginManager.scanSubdirs(moduleDirectories);
    pluginManager.scan();

    let extensionsMap = pluginManager.connect({}, "", {multi: true}, () => {})._extensions;
    for (let extensionPoint in extensionsMap) {
        if (!extensionsMap.hasOwnProperty(extensionPoint)) {
            continue;
        }

        let extensions = extensionsMap[extensionPoint];
        extensions.forEach(id => registerExtension(extensionPoint, id, extensions.names[id]));
    }
}

function registerExtension(extensionPoint: any, id: string, factory: Function) {
    let info = {extension: extensionPoint, name: id};
    factory(null, {}, info, (err, instance) => {
        if (err) {
            logger.error(err);
            return;
        }
        extensionRegistry.register(extensionPoint, id, instance);
    });
}

function isTemporaryExport(): boolean {
    return config.open && config.outFile.length === 0;
}


function buildTemporaryOutFilePath(): void {
    config.outFile = path.join(getTempDir(), "module-structure.json");
}

function isDebugMode() {
    return config.debug;
}

function deployWebAppToTempDir() {
    buildTemporaryOutFilePath();

    logger.info("Deploying web-app ...");

    let sourceDir = path.join(installedPath, "dist", "web-app");
    let destDir = isTemporaryExport() ? getTempDir() : path.dirname(config.outFile);

    fs.removeSync(destDir);
    fs.mkdirSync(destDir);
    fs.copySync(sourceDir, destDir);
}

function getTempDir() {
    return path.join(os.tmpdir(), TEMP_DIR);
}

function isCreateViewModel(options: any) {
    return !options.inputFile;
}

function createStructureMap(): void {
    startProcessing("Building structure map (may take some time for large AMD code bases)");

    let builder = new StructureMapBuilder(extensionRegistry);
    structureMap = builder.build(config.rootDir, config.exclude);

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

function readViewModel(inputFile: string) {
    viewModel = JSON.parse(fs.readFileSync(inputFile, "utf-8"));
}

function isExportViewModel(): boolean {
    return config.outFile.length > 0;
}

function exportViewModel(): void {
    if (fs.existsSync(config.outFile)) {
        fs.unlinkSync(config.outFile);
    }

    let spacing = config.pretty ? 2 : 0;
    fs.writeFileSync(config.outFile, JSON.stringify(viewModel, null, spacing));
}

function showViewModel(): void {
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

        if (isCreateViewModel(config)) {
            // reload extensions to clear states/caches
            loadExtensions();
            createStructureMap();
            createViewModel();
        }
        else {
            readViewModel(config.inputFile);
        }

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
