import {Module} from "./module";
import {ModuleImport} from "./module-import";
import {CompilerOptions, transpile, ScriptTarget, ModuleKind} from "typescript/lib/typescript";
import {parse} from "babylon";
import {File, ImportDeclaration} from "babel-types";

import fs = require("fs");
import path = require("path");

const preconditions = require("preconditions").instance();


export class ModuleBuilder {

    public build(filePath: string, name: string, packageName: string): Module {
        let simpleName = ModuleBuilder.getSimpleName(filePath);
        let imports = this.parseImports(filePath);

        return new Module(filePath, name, simpleName, packageName, imports);
    }

    private static getSimpleName(filePath: string): string {
        return path.basename(filePath);
    }

    private parseImports(filePath: string): Array<ModuleImport> {
        let ast = ModuleBuilder.parseModule(filePath);
        let importDeclarations = ModuleBuilder.getImportDeclarations(ast);

        return this.parseImportDeclarations(importDeclarations);
    }

    private static parseModule(filePath: string): File {
        let input = fs.readFileSync(filePath, "utf-8");

        let compilerOptions: CompilerOptions = {
            target: ScriptTarget.Latest,
            module: ModuleKind.ES2015
        };

        let output = transpile(input, compilerOptions, filePath);

        return parse(output, {sourceType: "module"}) as File;
    }

    private static getImportDeclarations(ast: File): Array<ImportDeclaration> {
        return ast.program.body.filter(node => node.type === "ImportDeclaration") as Array<ImportDeclaration>;
    }

    private parseImportDeclarations(importDeclarations: Array<ImportDeclaration>): Array<ModuleImport> {
        let imports: Array<ModuleImport> = [];
        importDeclarations.forEach(declaration => {
            imports.push(ModuleBuilder.parseImportDeclaration(declaration));
        });

        return imports;
    }

    private static parseImportDeclaration(declaration: ImportDeclaration): ModuleImport {
        let types = ModuleBuilder.getImportedTypes(declaration);
        let modulePath = ModuleBuilder.getModulePath(declaration) + ".ts";

        return new ModuleImport(types, modulePath);
    }

    private static getImportedTypes(declaration: ImportDeclaration): Array<string> {
        return declaration.specifiers.map(specifier => specifier.local.name);
    }

    private static getModulePath(statement: ImportDeclaration): string {
        return statement.source.value;
    }
}
