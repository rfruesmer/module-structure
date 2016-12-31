import {StructureMapBuilder} from "./structure-map/structure-map-builder";
import {StructureMapPackage} from "./structure-map/structure-map-package";
import {StructureViewModelBuilder} from "./structure-map/structure-view-model-builder";

import fs = require("fs");
import path = require("path");
import process = require("process");

const commandLineArgs = require("command-line-args");
const commandLineUsage = require("command-line-usage");
const preconditions = require("preconditions").instance();


export class Application {
    private static readonly EXIT_SUCCESS = 0;
    private static readonly EXIT_FAILURE = -1;

    private config: any = {
        src: "",
        dest: "",
        excludes: []
    };
    private structureMap: StructureMapPackage;


    public run(): void {
        this.parseArguments();
        this.createStructureMap();
        this.exportViewModel();

        Application.exitWithSuccess();
    }

    private parseArguments() {
        let optionDefinitions = [
            {name: "help", alias: "h", type: String},
            {name: "src", type: String},
            {name: "dest", type: String}
        ];

        let options = commandLineArgs(optionDefinitions);
        if (!options.src
                || !options.dest
                || typeof options.help !== "undefined") {
            this.printUsage();
            Application.exitWithSuccess();
        }

        if (!fs.existsSync(options.src)
                || !fs.statSync(options.src).isDirectory()) {
            console.error("Invalid --src argument");
            Application.exitWithFailure();
        }

        this.config.src = options.src;
        this.config.dest = options.dest;
    }

    private printUsage() {
        let sections = [
            {
                header: "typescript-dependencies",
                content: "Generates a TypeScript dependency diagram for a given directory."
            },
            {
                header: "Synopsis",
                content: [
                    "$ node index.js [bold]{--src} [underline]{directory} [bold]{--dest} [underline]{file}",
                    "$ node index.js [bold]{--help}"
                ]
            },
            {
                header: "Options",
                optionList: [
                    {
                        name: "src",
                        typeLabel: "[underline]{directory}",
                        description: "The input directory to process."
                    },
                    {
                        name: "dest",
                        typeLabel: "[underline]{file}",
                        description: "The path for the output HTML file."
                    },
                    {
                        name: "help",
                        alias: "h",
                        description: "Print this usage guide."
                    }
                ]
            }
        ];

        console.log(commandLineUsage(sections));
    }

    private static exitWithSuccess(): void {
        process.exit(Application.EXIT_SUCCESS);
    };

    private static exitWithFailure() {
        process.exit(Application.EXIT_FAILURE);
    }

    private createStructureMap(): void {
        let builder = new StructureMapBuilder();
        this.structureMap = builder.build(this.config.src, this.config.excludes);
    }

    private exportViewModel(): void {
        let destDir = path.dirname(this.config.dest);
        if (!fs.existsSync(destDir)) {
            fs.mkdir(destDir);
        }

        if (fs.existsSync(this.config.dest)) {
            fs.unlinkSync(this.config.dest);
        }

        let viewModelBuilder = new StructureViewModelBuilder();
        let viewModel = viewModelBuilder.build(this.structureMap);

        fs.writeFileSync(this.config.dest, JSON.stringify(viewModel));
    }
}
