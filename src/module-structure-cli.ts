import {moduleStructure} from "./module-structure";

import fs = require("fs");
import path = require("path");
import process = require("process");
import {ModuleStructureConfiguration} from "./module-structure-configuration";

const project = require("../package.json");
const commandLineArgs = require("command-line-args");
const commandLineUsage = require("command-line-usage");


export class Application {
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
    private config: any = {logging: true};
    private api: any;


    constructor(api: any = moduleStructure) {
        this.api = api;
    }

    public run(): void {
        this.parseArguments();
        this.processArguments();
        this.invokeAPI();
        this.onFinished();
    }

    private parseArguments(): void {
        try {
            this.options = commandLineArgs(this.optionDefinitions);
        }
        catch (e) {
            Application.exitWithFailure(e.message);
        }
    }

    private static exitWithFailure(message: string): void {
        console.error(message + " See 'module-structure --help'.");
        throw new Error();
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

    private processArguments(): void {
        this.processHelpArgument();
        this.processVersionArgument();
        this.processRootDirArgument();
        this.processModuleArgument();
        this.processOutFileArgument();
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
        throw null;
    };

    private processVersionArgument(): void {
        if (this.options.version) {
            console.log(project.name + " version " + project.version);
            Application.exitWithSuccess();
        }
    }

    private processRootDirArgument(): void {
        if (!this.options.rootDir) {
            Application.exitWithFailure("Missing --rootDir argument.");
        }

        if (!ModuleStructureConfiguration.checkRootDir(this.options.rootDir)) {
            Application.exitWithFailure("Invalid --rootDir argument.");
        }

        this.config.rootDir = this.options.rootDir;
    }

    private processModuleArgument(): void {
        this.config.module = this.options.ts ? "ts" : "es6";
    }

    private processOutFileArgument(): void {
        if (!ModuleStructureConfiguration.checkOutFile(this.options.outFile)) {
            Application.exitWithFailure("Invalid --outFile argument.");
        }

        this.config.outFile = this.options.outFile;
        this.config.showExport = !this.options.outFile;
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

    private onFinished() {
        if (!this.config.showExport) {
            Application.exitWithSuccess();
        }
    }

    private invokeAPI() {
        try {
            this.api(this.config);
        }
        catch (e) {
            console.error(e);
            throw e;
        }
    }
}
