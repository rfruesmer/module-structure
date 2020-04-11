import {StructureMapModule} from "./structure-map-module";
import {StructureMapLanguageProvider} from "./structure-map-language-provider";

import path = require("path");


export class StructureMapModuleBuilder {
    private readonly dependencyProviders: Map<string, StructureMapLanguageProvider>;


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
        let dependencies = dependencyProvider ? dependencyProvider.getDependencies(modulePath, rootDir) : [];

        return dependencies.map(dependency => StructureMapModuleBuilder.resolveRootPathAlias(dependency, modulePath, rootDir));
    }

    private static resolveRootPathAlias(dependency: string, modulePath: string, rootDir: string): string {
        if (!dependency.startsWith("@/")) {
            return dependency;
        }

        const relativePath = path.relative(path.dirname(modulePath), rootDir);
        dependency =  path.join(relativePath, dependency.substr(2));

        return dependency;
    }
}
