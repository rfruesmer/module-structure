import {StructureMapPackageBuilder} from "./structure-map-package-builder";
import {StructureMapPackage} from "./structure-map-package";

import fs = require("fs");
import path = require("path");
import {StructureMapModule} from "./structure-map-module";
import {ExtensionRegistry} from "./extension-registry";

const preconditions = require("preconditions").instance();
const checkArgument = preconditions.checkArgument;


export class StructureMapBuilder {
    private dir: string;
    private excludes: string[] = [];
    private packageIndex: any = {};
    private moduleIndex: any = {};
    private structureMap: StructureMapPackage;
    private extensionRegistry: ExtensionRegistry;


    constructor(extensionRegistry: ExtensionRegistry) {
        this.extensionRegistry = extensionRegistry;
    }

    public build(dir: string, excludes: string[] = []): StructureMapPackage {
        this.setOptions(dir, excludes);
        this.buildStructureMap();
        this.indexStructureMap();
        this.setupDependencies(this.structureMap);
        this.levelizeStructureMap();

        return this.structureMap;
    }

    private setOptions(dir: string, excludes: string[]) {
        this.dir = dir;
        this.excludes = excludes;
    }

    private buildStructureMap(): void {
        let packageBuilder = new StructureMapPackageBuilder(this.extensionRegistry);
        this.structureMap = packageBuilder.build(this.dir, this.excludes);
    }

    private indexStructureMap(): void {
        this.indexPackage(this.structureMap);
    }

    private indexPackage(_package: StructureMapPackage): void {
        _package.packages.forEach(childPackage => this.indexPackage(childPackage));
        _package.modules.forEach(module => this.indexModule(module));

        this.packageIndex[_package.name] = _package;
    }

    private indexModule(module: StructureMapModule): void {
        checkArgument(fs.existsSync(module.path));
        this.moduleIndex[module.path] = module;
    }

    private setupDependencies(_package: StructureMapPackage) {
        _package.packages.forEach(childPackage => this.setupDependencies(childPackage));
        _package.modules.forEach(module =>
                module.imports.forEach(_import => this.setupModuleDependency(module, _import)));
    }

    private setupModuleDependency(module: StructureMapModule, _import: string): void {
        let moduleDirectory = path.dirname(module.path);
        let importedModulePath = path.join(moduleDirectory, _import);
        importedModulePath = path.normalize(importedModulePath);

        let importedModule = this.moduleIndex[importedModulePath];
        if (importedModule) {
            module.addDependency(importedModule);
        }
    }

    private levelizeStructureMap(): void {
        this.structureMap.levelize();
    }
}
