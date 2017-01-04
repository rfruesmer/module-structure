import fs = require("fs");
import path = require("path");

const preconditions = require("preconditions").instance();
const checkArgument = preconditions.checkArgument;


/**
 *  Simple implementation to allow processing of TypeScript modules - necessary because
 *  TypeScript compiler output cannot be used since it removes even "important" imports.
 */
export class TypeScriptImportParser {
    private static readonly COMMENT_REGEXP = /(\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\/)|(\/\/.*)/g;
    private static readonly IMPORT_REGEXP = /import(?:["'\s]*([\w*{\s*}\n, ]+)from\s*)?["'\s]*([@\w\/\._-]+)["'\s]*;?;/g;


    public getImportSourcesFromFile(modulePath: string): Array<string> {
        checkArgument(fs.existsSync(modulePath) && fs.statSync(modulePath).isFile());
        let moduleAsString = fs.readFileSync(modulePath, "utf-8");

        return this.getImportSourcesFromString(moduleAsString);
    }

    public getImportSourcesFromString(moduleAsString: string): Array<string> {
        return this.findImportSources(this.removeComments(moduleAsString));
    }

    private removeComments(str: string): string {
        return this.replaceAll(str, TypeScriptImportParser.COMMENT_REGEXP, "");
    }

    private replaceAll(str: string, searchValue: RegExp, replaceValue: string): string {
        let length = str.length;
        str = str.replace(searchValue, replaceValue);
        return str.length === length ? str : this.replaceAll(str, searchValue, replaceValue);
    }

    private findImportSources(moduleString: string): Array<string> {
        let matches = TypeScriptImportParser.match(moduleString, TypeScriptImportParser.IMPORT_REGEXP);
        return matches.filter(match => match.length === 3).map(match => match[2] + ".ts");
    }

    private static match(str: string, regExp: RegExp): Array<RegExpExecArray> {
        let match: RegExpExecArray;
        let matches: Array<RegExpExecArray> = [];

        while ((match = regExp.exec(str)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (match.index === regExp.lastIndex) {
                regExp.lastIndex++;
            }

            if (match.length === 0) {
                continue;
            }

            matches.push(match);
        }

        return matches;
    }
}
