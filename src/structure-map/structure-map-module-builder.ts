import {StructureMapModule} from "./structure-map-module";
import {StructureMapLanguageProvider} from "./structure-map-language-provider";

import path = require("path");
import Map = require("core-js/es6/map");


export class StructureMapModuleBuilder {
    private dependencyProviders: Map<string, StructureMapLanguageProvider>;


    constructor(dependencyProviders: Map<string, StructureMapLanguageProvider>) {
        this.dependencyProviders = dependencyProviders;
    }

    public build(modulePath: string, name: string, rootDir: string): StructureMapModule {
        let simpleName = StructureMapModuleBuilder.getSimpleName(modulePath);
        let dependencies = this.getDependencies(modulePath, rootDir);

        return new StructureMapModule(modulePath, name, simpleName, dependencies);
    }

    private static getSimpleName(filePath: string): string {
        return path.basename(filePath);
    }

    private getDependencies(modulePath: string, rootDir: string): Array<string> {
        let fileExtension = path.extname(modulePath).substr(1);
        let dependencyProvider = this.dependencyProviders[fileExtension];

        return dependencyProvider ? dependencyProvider.getDependencies(modulePath, rootDir) : [];
    }
}
