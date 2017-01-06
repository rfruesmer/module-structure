import {ModuleStructureConfiguration, moduleStructure} from "./api";

import fs = require("fs");
import path = require("path");
import process = require("process");

const project = require("../package.json");
const commandLineArgs = require("command-line-args");
const commandLineUsage = require("command-line-usage");
const preconditions = require("preconditions").instance();
const getInstalledPathSync = require("get-installed-path").sync;



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
            name: "ts",
            type: Boolean,
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
    private config = new ModuleStructureConfiguration();


    public run(): void {
        this.parseArguments();
        this.processArguments();
        this.invokeAPI(this.config);
        this.onFinished();
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
        this.processExcludeArgument();
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
        this.config.module = this.options.ts ? "ts" : "es6";
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

    private processExcludeArgument(): void {
        this.config.excludes = this.options.exclude ? this.options.exclude : [];
    }

    private processPrettyArgument(): void {
        this.config.prettyPrint = this.options.pretty !== undefined;
    }

    private processPortArgument(): void {
        this.config.serverPort = this.options.port;
    }

    private invokeAPI(config: ModuleStructureConfiguration) {
        moduleStructure(config);
    }

    private onFinished() {
        if (!this.config.showExport) {
            Application.exitWithSuccess();
        }
    }
}
