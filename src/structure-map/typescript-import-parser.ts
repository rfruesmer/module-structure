import fs = require("fs");
import path = require("path");

const preconditions = require("preconditions").instance();
const checkState = preconditions.checkState;
const readEachLineSync  = require("read-each-line-sync");

/**
 *  Simple implementation to allow processing of TypeScript modules - necessary because
 *  TypeScript compiler output cannot be used since it removes even "important" imports.
 */
export class TypeScriptImportParser {


    public getImports(modulePath: string): Array<string> {
        let imports: Array<string> = [];

        // TODO: allow multiline import declarations
        let self = this;
        readEachLineSync(modulePath, function(line: any) {
            imports.push.apply(imports, self.parseLine(line));
        });

        return imports;
    }

    private parseLine(line: any): Array<string> {
        line = TypeScriptImportParser.removeComments(line);
        return TypeScriptImportParser.getImportDeclarations(line)
            .map(declaration => TypeScriptImportParser.getImportSource(declaration));
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

    private static getImportDeclarations(line: string): Array<string> {
        const regExp = /\s*?import\s+?[{]?.*?[}]?\s+?from\s+?".*?"\s*?;/g;

        let matches = TypeScriptImportParser.match(line, regExp);
        for (let i = 0; i < matches.length; ++i) {
            matches[i] = matches[i].trim();
        }

        return matches;
    }

    private static getImportSource(importDeclaration: string): string {
        const regExp = /\s*?import\s+?[{]?.*?[}]?\s+?from\s+?"(.*?)"\s*?;/g;

        let matches = regExp.exec(importDeclaration);
        checkState(matches.length === 2);

        return matches[1].toString() + ".ts";
    }
}
