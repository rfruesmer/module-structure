import {PackageTreeEntity} from "./package-tree-entity";
import {ModuleImport} from "./module-import";


export class Module extends PackageTreeEntity {
    private _imports: Array<ModuleImport> = [];
    private _packageName: string;


    constructor(path: string,
                name: string,
                simpleName: string,
                packageName: string,
                imports: Array<ModuleImport>) {
        super(path, name, simpleName);

        this._packageName = packageName;
        this._imports = imports.slice();
    }

    get packageName(): string {
        return this._packageName;
    }

    get imports(): Array<ModuleImport> {
        return this._imports.slice();
    }
}
