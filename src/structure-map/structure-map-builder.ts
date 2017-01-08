import {StructureMapPackageBuilder} from "./structure-map-package-builder";
import {StructureMapPackage} from "./structure-map-package";

import fs = require("fs");
import path = require("path");
import {StructureMapModule} from "./structure-map-module";

const preconditions = require("preconditions").instance();
const checkArgument = preconditions.checkArgument;


export class StructureMapBuilder {
    private dir: string;
    private typeScript: boolean;
    private excludes: string[] = [];
    private packageIndex: any = {};
    private moduleIndex: any = {};
    private structureMap: StructureMapPackage;


    public build(dir: string, typeScript: boolean, excludes: string[] = []): StructureMapPackage {
        this.dir = dir;
        this.typeScript = typeScript;
        this.excludes = excludes;

        this.buildStructureMap();
        this.indexStructureMap();
        this.setupDependencies(this.structureMap);
        this.levelizeStructureMap();

        return this.structureMap;
    }

    private buildStructureMap(): void {
        let packageBuilder = new StructureMapPackageBuilder();
        this.structureMap = packageBuilder.build(this.dir, this.typeScript, this.excludes);
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
