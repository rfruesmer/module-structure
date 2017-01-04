import {StructureMapBuilder} from "./structure-map/structure-map-builder";
import {StructureMapPackage} from "./structure-map/structure-map-package";
import {StructureViewModelBuilder} from "./structure-map/structure-view-model-builder";

import fs = require("fs");
import path = require("path");
import process = require("process");

const project = require("../package.json");
const commandLineArgs = require("command-line-args");
const commandLineUsage = require("command-line-usage");
const colors = require("colors/safe");
const preconditions = require("preconditions").instance();
const getInstalledPathSync = require("get-installed-path").sync;
const httpServerModule = require("http-server");
const opener = require("opener");


class ApplicationConfiguration {
    rootDir = "";
    module =  "js";
    outFile =  "";
    prettyPrint = false;
    serverPort = 3000;
    excludes = [];
    showExport = false;
}

export class Application {
    private static readonly EXIT_SUCCESS = 0;
    private static readonly EXIT_FAILURE = -1;

    private options: any;
    private optionDefinitions = [
        {
            name: "help",
            alias: "h",
            type: String,
            description: "Show this help."
        },
        {
            name: "version",
            alias: "v",
            type: Boolean,
            description: "Print the version number."
        },
        {
            name: "rootDir",
            type: String,
            typeLabel: "[underline]{directory}",
            description: "Specifies the root directory of input files."
        },
        {
            name: "typescript",
            alias: "ts",
            type: String,
            description: "Only necessary for analyzing TypeScript modules."
        },
        {
            name: "outFile",
            type: String,
            typeLabel: "[underline]{file}",
            description: "Optional: the output path for the structure map JSON-file. If omitted, the file will be created in a temporary directory and rendered as a diagram in your default browser."
        },
        {
            name: "exclude",
            alias: "e",
            type: String,
            multiple: true,
            description: "One or more expressions to filter packages and/or modules."
        },
        {
            name: "pretty",
            type: Boolean,
            description: "Pretty-print the generated structure map JSON-file."
        },
        {
            name: "port",
            alias: "p",
            defaultValue: 3000,
            typeLabel: "[underline]{port}",
            description: "Port for serving the included viewer webapp (defaults to 3000). Omitted if --outFile is specified."
        }
    ];
    private config = new ApplicationConfiguration();
    private structureMap: StructureMapPackage;
    private startTime: number;


    public run(): void {
        this.parseArguments();
        this.processArguments();
        this.createStructureMap();
        this.exportViewModel();
        if (this.config.showExport) {
            this.showViewModel();
        }
        else {
            Application.exitWithSuccess();
        }
    }

    private parseArguments(): void {
        try {
            this.options = commandLineArgs(this.optionDefinitions);
        }
        catch (e) {
            console.error(e.message);
            this.printUsage();
            Application.exitWithFailure();
        }
    }

    private printUsage(): void {
        let sections = [
            {
                header: project.name,
                content: "Creates levelized structure maps from ECMAScript, TypeScript and AMD dependencies."
            },
            {
                header: "Usage",
                content: [
                    "$ " + project.name + " [bold]{--rootDir} [underline]{directory}",
                    "$ " + project.name + " [bold]{--rootDir} [underline]{directory} [bold]{--outFile} [underline]{file}"
                ]
            },
            {
                header: "Options",
                optionList: this.optionDefinitions
            }
        ];

        console.log(commandLineUsage(sections));
    }

    private static exitWithFailure(): void {
        process.exit(Application.EXIT_FAILURE);
    }

    private processArguments(): void {
        this.processHelpArgument();
        this.processVersionArgument();
        this.processRootDirArgument();
        this.processModuleArgument();
        if (this.isOutFileSpecified()) {
            this.processOutFileArgument();
        }
        else {
            this.buildTemporaryOutputPath();
        }
        this.processExcludes();
        this.processPrettyArgument();
        this.processPortArgument();
    }

    private processHelpArgument(): void {
        if (this.options.help !== undefined) {
            this.printUsage();
            Application.exitWithSuccess();
        }
    }

    private static exitWithSuccess(): void {
        process.exit(Application.EXIT_SUCCESS);
    };

    private processVersionArgument(): void {
        if (this.options.version) {
            console.log(project.name + " version " + project.version);
            Application.exitWithSuccess();
        }
    }

    private processRootDirArgument(): void {
        if (!this.options.rootDir) {
            console.error("Missing --rootDir argument");
            this.printUsage();
            Application.exitWithFailure();
        }

        if (!fs.existsSync(this.options.rootDir)
                || !fs.statSync(this.options.rootDir).isDirectory()) {
            console.error("Invalid --rootDir argument");
            Application.exitWithFailure();
        }

        this.config.rootDir = this.options.rootDir;
    }

    private processModuleArgument(): void {
        this.config.module = this.options.typescript ? "ts" : "es6";
    }

    private isOutFileSpecified(): boolean {
        return this.options.outFile !== undefined;
    }

    private processOutFileArgument(): void {
        let outDir = path.dirname(this.options.outFile);
        if (!fs.existsSync(outDir)
            || !fs.statSync(outDir).isDirectory()) {
            console.error("Invalid --outFile argument");
            Application.exitWithFailure();
        }

        this.config.outFile = this.options.outFile;
    }

    private buildTemporaryOutputPath(): void {
        try {
            let installedPath = getInstalledPathSync(project.name);
            this.config.outFile = path.join(installedPath, "dist/web-app/module-structure.json");
            this.config.showExport = true;
        }
        catch (e) {
            this.config.outFile = path.join(process.cwd(), "src/structure-view/data/module-structure.json");
        }
    }

    private processExcludes(): void {
        this.config.excludes = this.options.exclude ? this.options.exclude : [];
    }

    private processPrettyArgument(): void {
        this.config.prettyPrint = this.options.pretty !== undefined;
    }

    private processPortArgument(): void {
        this.config.serverPort = this.options.port;
    }

    private createStructureMap(): void {
        this.startProcessing("Building structure map (this may take several minutes for AMD modules)");

        let builder = new StructureMapBuilder();
        this.structureMap = builder.build(this.config.rootDir, this.config.module, this.config.excludes);

        this.stopProcessing();
    }

    private startProcessing(message: string) {
        process.stdout.write(colors.yellow(message + " ... "));
        this.startTime = Date.now();
    }

    private stopProcessing() {
        let stopTime = Date.now();
        let elapsed = stopTime - this.startTime;
        console.log(colors.yellow("finished in " + elapsed + "ms"));
    }

    private exportViewModel(): void {
        this.startProcessing("Exporting view model");

        let destDir = path.dirname(this.config.outFile);
        if (!fs.existsSync(destDir)) {
            fs.mkdir(destDir);
        }

        if (fs.existsSync(this.config.outFile)) {
            fs.unlinkSync(this.config.outFile);
        }

        let viewModelBuilder = new StructureViewModelBuilder();
        let viewModel = viewModelBuilder.build(this.structureMap);

        let spacing = this.config.prettyPrint ? 2 : 0;
        fs.writeFileSync(this.config.outFile, JSON.stringify(viewModel, null, spacing));

        this.stopProcessing();
    }

    private showViewModel() {
        let serverRoot = path.join(process.cwd(), "dist/web-app");
        console.log(colors.yellow("Starting http-server, serving from " + serverRoot));

        let server = httpServerModule.createServer({root: serverRoot});
        server.listen(this.config.serverPort, "127.0.0.1", () => {
            let url = "http://localhost:" + this.config.serverPort + "/index.html?input=module-structure.json";
            console.log(colors.green("Module structure is now available at " + url));
            console.info("Hit CTRL-C to stop the server");

            opener(url);
        });
    }
}
