import {StructureMapModule} from "./structure-map-module";
import {TypeScriptImportParser} from "./typescript-import-parser";

import path = require("path");
import fs = require("fs");
import os = require("os");

const dependencyTree = require("dependency-tree");

export class StructureMapModuleBuilder {
    private typeScriptHelper: TypeScriptImportParser = new TypeScriptImportParser();


    public build(modulePath: string, name: string, rootDir: string): StructureMapModule {
        let simpleName = StructureMapModuleBuilder.getSimpleName(modulePath);
        let dependencies = this.getImports(modulePath, rootDir);

        return new StructureMapModule(modulePath, name, simpleName, dependencies);
    }

    private static getSimpleName(filePath: string): string {
        return path.basename(filePath);
    }

    private getImports(modulePath: string, rootDir: string): Array<string> {
        if (path.extname(modulePath) === ".ts") {
            return this.typeScriptHelper.getImports(modulePath);
        }

        let tree = dependencyTree({directory: rootDir, filename: modulePath});
        let key = Object.keys(tree)[0];
        let imports = Object.keys(tree[key]);
        let moduleDirectory = path.dirname(modulePath);

        return imports.map(dependencyPath => {
            return path.relative(moduleDirectory, dependencyPath);
        });
    }
}
