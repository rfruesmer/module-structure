import fs = require("fs");
import path = require("path");
import process = require("process");
import {ModuleStructureConfiguration} from "./module-structure-configuration";

const moduleStructure = require("./module-structure");
const project = require("../package.json");
const commandLineArgs = require("command-line-args");
const commandLineUsage = require("command-line-usage");


export class Application {
    private options: any;
    private optionDefinitions = [
        {
            name: "help",
            alias: "h",
            type: Boolean,
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
            name: "inputFile",
            type: String,
            typeLabel: "[underline]{file}",
            description: "Skips the analysis step and directly renders the specified input model file as a diagram in your default browser."
        },
        {
            name: "port",
            alias: "p",
            defaultValue: 3000,
            typeLabel: "[underline]{port}",
            description: "Port for serving the included viewer webapp (defaults to 3000). Omitted if neither --outFile or --inFile are specified."
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
        this.processOutFileArgument();
        this.processExcludeArgument();
        this.processInputFileArgument();
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
        if (!this.options.rootDir && !this.options.inputFile) {
            Application.exitWithFailure("Missing --rootDir argument.");
        }

        if (!ModuleStructureConfiguration.checkRootDir(this.options)) {
            Application.exitWithFailure("Invalid --rootDir argument.");
        }

        this.config.rootDir = this.options.rootDir;
    }

    private processOutFileArgument(): void {
        if (!ModuleStructureConfiguration.checkOutFile(this.options.outFile)) {
            Application.exitWithFailure("Invalid --outFile argument.");
        }

        this.config.outFile = this.options.outFile;
        this.config.open = !this.options.outFile;
    }

    private processExcludeArgument(): void {
        this.config.exclude = this.options.exclude ? this.options.exclude : [];
    }

    private processInputFileArgument() {
        if (this.options.inputFile) {
            this.config.open = true;
        }
        this.config.inputFile = this.options.inputFile;
    }

    private processPrettyArgument(): void {
        this.config.pretty = this.options.pretty !== undefined;
    }

    private processPortArgument(): void {
        this.config.port = this.options.port;
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

    private onFinished() {
        if (!this.config.open) {
            Application.exitWithSuccess();
        }
    }
}
