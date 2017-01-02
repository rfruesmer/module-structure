import {ModuleImportParser} from "./module-import-parser";
import {ModuleImport} from "./module-import";

import {parse} from "babylon";
import {File, ImportDeclaration} from "babel-types";

import fs = require("fs");


export class DefaultImportParser implements ModuleImportParser {

    parseImports(filePath: string): Array<ModuleImport> {
        let ast = DefaultImportParser.parseModule(filePath);
        let importDeclarations = DefaultImportParser.getImportDeclarations(ast);

        return this.parseImportDeclarations(importDeclarations);
    }

    private static parseModule(filePath: string): File {
        let input = fs.readFileSync(filePath, "utf-8");

        return parse(input, {sourceType: "module"}) as File;
    }

    private static getImportDeclarations(ast: File): Array<ImportDeclaration> {
        return ast.program.body.filter(node => node.type === "ImportDeclaration") as Array<ImportDeclaration>;
    }

    private parseImportDeclarations(importDeclarations: Array<ImportDeclaration>): Array<ModuleImport> {
        let imports: Array<ModuleImport> = [];
        importDeclarations.forEach(declaration => {
            imports.push(DefaultImportParser.parseImportDeclaration(declaration));
        });

        return imports;
    }

    private static parseImportDeclaration(declaration: ImportDeclaration): ModuleImport {
        let types = DefaultImportParser.getImportedTypes(declaration);
        let modulePath = DefaultImportParser.getModulePath(declaration) + ".js";

        return new ModuleImport(types, modulePath);
    }

    private static getImportedTypes(declaration: ImportDeclaration): Array<string> {
        return declaration.specifiers.map(specifier => specifier.local.name);
    }

    private static getModulePath(statement: ImportDeclaration): string {
        return statement.source.value;
    }
}
