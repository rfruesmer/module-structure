export abstract class PackageTreeEntity {
    private _path: string;
    private _name: string;
    private _simpleName: string;
    private _dependencies: Array<PackageTreeEntity> = [];


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

    addDependency(entity: PackageTreeEntity) {
        if (this._dependencies.indexOf(entity) === -1) {
            this._dependencies.push(entity);
        }
    }

    get dependencies(): Array<PackageTreeEntity> {
        return this._dependencies.slice();
    }
}
