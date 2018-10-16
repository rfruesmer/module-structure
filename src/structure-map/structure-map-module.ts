import {StructureMapEntity} from "./structure-map-entity";


export class StructureMapModule extends StructureMapEntity {
    private _imports: Array<string> = [];

    constructor(path: string,
                name: string,
                simpleName: string,
                imports: Array<string>) {
        super(path, name, simpleName);

        this._imports = imports.slice();
    }

    get imports(): Array<string> {
        return this._imports.slice();
    }

    set imports(imports: Array<string>) {
        this._imports = imports;
    }
}
