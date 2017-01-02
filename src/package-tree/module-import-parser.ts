import {ModuleImport} from "./module-import";

export interface ModuleImportParser {
    parseImports(filePath: string): Array<ModuleImport>;
}
