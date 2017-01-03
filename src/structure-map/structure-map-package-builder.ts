import {StructureMapModuleBuilder} from "./structure-map-module-builder";

import fs = require("fs");
import path = require("path");
import {StructureMapPackage} from "./structure-map-package";
import {StructureMapModule} from "./structure-map-module";

const preconditions = require("preconditions").instance();
const checkArgument = preconditions.checkArgument;


export class StructureMapPackageBuilder {
    private rootDir: string;
    private moduleType: string;
    private excludes: string[] = [];
    private moduleBuilder;


    public build(dir: string, module: string, excludes: string[]): StructureMapPackage {
        checkArgument(fs.statSync(dir).isDirectory());

        this.rootDir =  path.normalize(path.join(dir, ".."));
        this.moduleType = module;
        this.excludes = excludes;
        this.moduleBuilder = new StructureMapModuleBuilder();

        return this.buildInternal(dir);
    }

    private buildInternal(dir: string): StructureMapPackage {
        let packageName = this.getPackageName(dir);
        if (this.excludes.indexOf(packageName) > -1) {
            return null;
        }

        let simplePackageName = StructureMapPackageBuilder.getSimpleName(dir);
        let packages = this.buildPackages(dir);
        let modules = this.buildModules(dir, packageName);

        return new StructureMapPackage(dir, packageName, simplePackageName, packages, modules);
    }

    private getPackageName(dir: string): string {
        let replace = path.sep.replace("\\", "\\\\");
        let regEx = new RegExp(replace, "g");

        return path.relative(this.rootDir, dir)
            .replace(regEx, ".")
            .toLowerCase();
    }

    private static getSimpleName(dir: string): string {
        return path.basename(dir);
    }

    private buildPackages(dir: string): Array<StructureMapPackage> {
        let childPackages: Array<StructureMapPackage> = [];

        this.getSubDirectories(dir).forEach(subDir => {
            let childPackage = this.buildInternal(subDir);
            if (childPackage) {
                childPackages.push(childPackage);
            }
        });

        return childPackages;
    }

    private getSubDirectories(dir: string): string[] {
        return fs.readdirSync(dir)
            .map(file => path.join(dir, file))
            .filter(path => fs.statSync(path).isDirectory());
    }

    private buildModules(dir: string, packageName: string): Array<StructureMapModule> {
        let modules: Array<StructureMapModule> = [];

        this.getModuleFiles(dir).forEach(modulePath => {
            let moduleName = StructureMapPackageBuilder.getModuleName(modulePath, packageName);
            if (this.isIncluded(modulePath, moduleName)) {
                modules.push(this.moduleBuilder.build(modulePath, moduleName, packageName, this.rootDir));
            }
        });

        return modules;
    }

    private getModuleFiles(dir: string): string[] {
        return fs.readdirSync(dir)
            .map(fileName => path.join(dir, fileName))
            .filter(filePath => fs.statSync(filePath).isFile() && [".js", ".ts"].indexOf(path.extname(filePath)) > -1);
    }

    private static getModuleName(filePath: string, packageName: string): string {
        return packageName + "." + path.basename(filePath);
    }

    private isIncluded(modulePath: string, moduleName: string) {
        return this.excludes.indexOf(moduleName) === -1
                && this.isResponsibleFor(modulePath);
    }

    public isResponsibleFor(filePath: string): boolean {
        let extension = path.extname(filePath).toLowerCase();
        if (this.moduleType === "es6") {
            return extension === ".js";
        }
        else if (this.moduleType === "ts") {
            return extension === ".ts";
        }

        return false;
    }
}
