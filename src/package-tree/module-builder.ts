import {Module} from "./module";
import {TypeScriptImportParser} from "./typescript-import-parser";
import {DefaultImportParser} from "./default-import-parser";

import path = require("path");

const preconditions = require("preconditions").instance();
const checkArgument = preconditions.checkArgument;


export class ModuleBuilder {
    private importParsers: any = {};


    constructor(moduleType: string) {
        this.importParsers[".js"] = new DefaultImportParser();
        this.importParsers[".ts"] = new TypeScriptImportParser();
    }

    public build(filePath: string, name: string, packageName: string): Module {
        let importParser = this.importParsers[path.extname(filePath)];
        checkArgument(importParser, "Unknown file extension: " + filePath);

        let simpleName = ModuleBuilder.getSimpleName(filePath);
        let imports = importParser.parseImports(filePath);

        return new Module(filePath, name, simpleName, packageName, imports);
    }

    private static getSimpleName(filePath: string): string {
        return path.basename(filePath);
    }
}
