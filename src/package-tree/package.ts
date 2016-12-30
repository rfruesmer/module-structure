import {PackageTreeEntity} from "./package-tree-entity";
import {Module} from "./module";


export class Package extends PackageTreeEntity {
    private _packages: Array<Package>;
    private _modules: Array<Module>;


    constructor(path: string,
                name: string,
                simpleName: string,
                childPackages: Array<Package>,
                modules: Array<Module>) {
        super(path, name, simpleName);

        this._packages = childPackages.slice();
        this._modules = modules.slice();
    }

    get packages(): Array<Package> {
        return this._packages.slice();
    }

    get modules(): Array<Module> {
        return this._modules.slice();
    }
}
