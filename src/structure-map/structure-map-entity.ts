
import {StructureMapPackage} from "./structure-map-package";
export abstract class StructureMapEntity {
    private _path: string;
    private _name: string;
    private _simpleName: string;
    private _parent: StructureMapPackage;
    private _dependencies: Array<StructureMapEntity> = [];


    constructor(path: string, name: string, simpleName: string) {
        this._path = path;
        this._name = name;
        this._simpleName = simpleName;
    }

    get path(): string {
        return this._path;
    }

    get name(): string {
        return this._name;
    }

    get simpleName(): string {
        return this._simpleName;
    }

    set parent(_parent: StructureMapPackage) {
        this._parent = _parent;
    }

    get parent(): StructureMapPackage {
        return this._parent;
    }

    addDependency(entity: StructureMapEntity) {
        if (this._dependencies.indexOf(entity) > -1) {
            return;
        }

        this._dependencies.push(entity);

        if (this._parent && entity.parent.name.indexOf(this._parent.name) !== 0) {
            this._parent.addDependency(entity);
        }
    }

    get dependencies(): Array<StructureMapEntity> {
        return this._dependencies.slice();
    }
}
