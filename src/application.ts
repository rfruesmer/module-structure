import {StructureMapBuilder} from "./structure-map/structure-map-builder";
import {StructureMapPackage} from "./structure-map/structure-map-package";

import fs = require("fs");
import path = require("path");
import process = require("process");
import {StructureMapViewModel} from "./structure-map/structure-map-view-model";
import {StructureMapViewModelBuilder} from "./structure-map/structure-map-view-model-builder";

const commandLineArgs = require("command-line-args");
const commandLineUsage = require("command-line-usage");
const preconditions = require("preconditions").instance();
const checkArgument = preconditions.checkArgument;


export class Application {
    private static readonly EXIT_SUCCESS = 0;

    private config: any = {excludes: []};
    private structureMap: StructureMapPackage;
    private viewModel: StructureMapViewModel;


    public run(): void {
        this.parseArguments();
        this.createStructureMap();
        this.createViewModel();
        this.exportViewModel();
    }

    private parseArguments() {
        let optionDefinitions = [
            {name: "help", alias: "h", type: String},
            {name: "src", type: String},
            {name: "dest", type: String}
        ];

        let options = commandLineArgs(optionDefinitions);
        if (!options.src || typeof options.help !== "undefined") {
            this.printUsage();
            Application.exitWithSuccess();
        }

        checkArgument(fs.existsSync(options.src) && fs.statSync(options.src).isDirectory());
        this.config.src = options.src;
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

    private createStructureMap(): void {
        let builder = new StructureMapBuilder();
        this.structureMap = builder.build(this.config.src, this.config.excludes);
    }

    private createViewModel(): void {
        let builder = new StructureMapViewModelBuilder();
        this.viewModel = builder.buildFrom(this.structureMap);
    }

    private exportViewModel(): void {
        // TODO
    }
}
