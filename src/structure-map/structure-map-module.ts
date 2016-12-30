import {StructureMapEntity} from "./structure-map-entity";
import {Module} from "../package-tree/module";

export class StructureMapModule implements StructureMapEntity {
    private _module: Module;


    constructor(module: Module) {
        this._module = module;
    }

    get name(): string {
        return this._module.name;
    }

    get simpleName(): string {
        return this._module.simpleName;
    }
}
