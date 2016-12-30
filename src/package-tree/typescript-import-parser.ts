
import fs = require("fs");
import path = require("path");
import {ModuleImport} from "./module-import";

const preconditions = require("preconditions").instance();
const checkState = preconditions.checkState;
const readEachLineSync  = require("read-each-line-sync");


export class TypeScriptImportParser {

    public parseImports(filePath: string): Array<ModuleImport> {
        let imports: Array<ModuleImport> = [];

        // TODO: allow multiline import declarations
        let self = this;
        readEachLineSync(filePath, function(line: any) {
            self.parseLine(line, imports);
        });

        return imports;
    }

    private parseLine(line: any, imports: Array<ModuleImport>) {
        line = TypeScriptImportParser.removeComments(line);
        let importStatements = TypeScriptImportParser.getImportStatements(line);
        if (importStatements.length > 0) {
            this.parseImportStatements(importStatements)
                .forEach(lineImport => imports.push(lineImport));
        }
    }

    private static removeComments(line: string): string {
        const regExp = /(\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\/)|(\/\/.*)/g;

        let lineWithoutComments = line;

        TypeScriptImportParser.match(line, regExp)
            .forEach(match => lineWithoutComments = lineWithoutComments.replace(match, ""));

        return lineWithoutComments;
    }

    private static match(str: string, regExp: RegExp): Array<string> {
        let match: RegExpExecArray;
        let matches: Array<string> = [];

        while ((match = regExp.exec(str)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (match.index === regExp.lastIndex) {
                regExp.lastIndex++;
            }

            if (match.length === 0) {
                continue;
            }

            matches.push(match.toString());
        }

        return matches;
    }

    private static getImportStatements(line: string): Array<string> {
        const regExp = /\s*?import\s+?[{]?.*?[}]?\s+?from\s+?".*?"\s*?;/g;

        // line = `import a from "c";`;
        // line = `import {a, b} from "c";`;

        let matches = TypeScriptImportParser.match(line, regExp);
        for (let i = 0; i < matches.length; ++i) {
            matches[i] = matches[i].trim();
        }

        return matches;
    }

    private parseImportStatements(importStatements: Array<string>): Array<ModuleImport> {
        let ModuleImports: Array<ModuleImport> = [];
        importStatements.forEach(statement => {
            ModuleImports.push(TypeScriptImportParser.parseImportStatement(statement));
        });

        return ModuleImports;
    }

    private static parseImportStatement(statement: string): ModuleImport {
        let types = TypeScriptImportParser.getImportedTypes(statement);
        let modulePath = TypeScriptImportParser.getModulePath(statement) + ".ts";

        return new ModuleImport(types, modulePath);
    }

    private static getImportedTypes(statement: string): Array<string> {
        const multiTypeRegExp = /{(.*?)}/;
        const defaultTypeRegExp = /import\s+(\w+)/g;

        let matches = multiTypeRegExp.exec(statement);
        if (matches === null) {
            matches = defaultTypeRegExp.exec(statement);
        }

        checkState(matches.length === 2);

        return matches[1]
            .toString()
            .split(",")
            .map(typename => typename.trim());
    }

    private static getModulePath(statement: string): string {
        const regExp = /\s*?import\s+?[{]?.*?[}]?\s+?from\s+?"(.*?)"\s*?;/g;

        let matches = regExp.exec(statement);
        checkState(matches.length === 2);

        return matches[1].toString();
    }
}
