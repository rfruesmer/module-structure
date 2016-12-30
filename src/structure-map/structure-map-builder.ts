import {Package} from "../package-tree/package";
import {PackageTreeBuilder} from "../package-tree/package-tree-builder";
import {Module} from "../package-tree/module";
import {ModuleImport} from "../package-tree/module-import";
import {StructureMapPackage} from "./structure-map-package";

import fs = require("fs");
import path = require("path");

const preconditions = require("preconditions").instance();
const checkArgument = preconditions.checkArgument;


export class StructureMapBuilder {
    private dir: string;
    private excludes: string[] = [];
    private packageTree: Package;
    private packageIndex: any = {};
    private moduleIndex: any = {};
    private structureMap: StructureMapPackage;


    public build(dir: string, excludes: string[]): StructureMapPackage {
        this.dir = dir;
        this.excludes = excludes;

        this.buildPackageTree();
        this.indexPackageTree();
        this.resolveDependencies();
        this.createStructureMap();

        return this.structureMap;
    }

    private buildPackageTree(): void {
        let packageTreeBuilder = new PackageTreeBuilder();
        this.packageTree = packageTreeBuilder.build(this.dir, this.excludes);
    }

    private indexPackageTree(): void {
        this.indexPackage(this.packageTree);
    }

    private indexPackage(_package: Package): void {
        _package.packages.forEach(childPackage => this.indexPackage(childPackage));
        _package.modules.forEach(module => this.indexModule(module));

        this.packageIndex[_package.name] = _package;
    }

    private indexModule(module: Module): void {
        checkArgument(fs.existsSync(module.path));
        this.moduleIndex[module.path] = module;
    }

    private resolveDependencies(): void {
        this.resolveModuleDependencies(this.packageTree);
        this.resolvePackageDependencies(this.packageTree);
    }

    private resolveModuleDependencies(_package: Package): void {
        _package.packages.forEach(childPackage => this.resolveModuleDependencies(childPackage));
        _package.modules.forEach(module =>
            module.imports.forEach(_import => this.resolveModuleDependency(module, _import)));
    }

    private resolveModuleDependency(module: Module, _import: ModuleImport): void {
        let moduleDirectory = path.dirname(module.path);
        let importedModulePath = path.join(moduleDirectory, _import.from);
        importedModulePath = path.normalize(importedModulePath);

        let importedModule = this.moduleIndex[importedModulePath];
        if (importedModule) {
            module.addDependency(importedModule);
        }
    }

    private resolvePackageDependencies(_package: Package): void {
        _package.packages.forEach(childPackage => this.resolvePackageDependencies(childPackage));
        _package.modules.forEach(module =>
            module.dependencies
                .filter(dependency => dependency instanceof Module)
                .forEach(dependentModule => {
                    _package.addDependency(this.packageIndex[(dependentModule as Module).packageName]);
                }));
    }

    private createStructureMap(): void {
        this.structureMap = new StructureMapPackage(this.packageTree);
    }
}
