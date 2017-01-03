import {StructureMapModule} from "./structure-map-module";
import {TypeScriptImportParser} from "./typescript-import-parser";

import path = require("path");
import fs = require("fs");
import os = require("os");

const dependencyTree = require("dependency-tree");

export class StructureMapModuleBuilder {
    private typeScriptHelper: TypeScriptImportParser = new TypeScriptImportParser();

    public build(modulePath: string, name: string): StructureMapModule {
        let simpleName = StructureMapModuleBuilder.getSimpleName(modulePath);
        let dependencies = this.getImports(modulePath);

        return new StructureMapModule(modulePath, name, simpleName, dependencies);
    }

    private static getSimpleName(filePath: string): string {
        return path.basename(filePath);
    }

    private getImports(modulePath: string): Array<string> {
        if (path.extname(modulePath) === ".ts") {
            return this.typeScriptHelper.getImports(modulePath);
        }

        let moduleDirectory = path.join(process.cwd(), path.dirname(modulePath));
        let tree = dependencyTree({directory: moduleDirectory, filename: modulePath});
        let key = Object.keys(tree)[0];
        let imports = Object.keys(tree[key]);

        return imports.map(dependencyPath => path.relative(moduleDirectory, dependencyPath));
    }
}
