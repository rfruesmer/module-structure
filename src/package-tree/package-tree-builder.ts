import {Package} from "./package";
import {Module} from "./module";
import {ModuleBuilder} from "./module-builder";

import fs = require("fs");
import path = require("path");

const preconditions = require("preconditions").instance();
const checkArgument = preconditions.checkArgument;

export class PackageTreeBuilder {
    private rootDir: string;
    private excludes: string[] = [];
    private moduleBuilder = new ModuleBuilder();


    public build(dir: string, excludes: string[]): Package {
        checkArgument(fs.statSync(dir).isDirectory());

        this.rootDir =  path.normalize(path.join(dir, ".."));
        this.excludes = excludes;

        return this.buildInternal(dir);
    }

    private buildInternal(dir: string): Package {
        let packageName = this.getPackageName(dir);
        if (this.excludes.indexOf(packageName) > -1) {
            return null;
        }

        let simplePackageName = PackageTreeBuilder.getSimpleName(dir);
        let packages = this.buildPackages(dir);
        let modules = this.buildModules(dir, packageName);

        return new Package(dir, packageName, simplePackageName, packages, modules);
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

    private buildPackages(dir: string): Array<Package> {
        let childPackages: Array<Package> = [];

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

    private buildModules(dir: string, packageName: string): Array<Module> {
        let modules: Array<Module> = [];

        this.getModuleFiles(dir).forEach(modulePath => {
            let moduleName = PackageTreeBuilder.getModuleName(modulePath, packageName);
            if (this.excludes.indexOf(moduleName) === -1) {
                modules.push(this.moduleBuilder.build(modulePath, moduleName, packageName));
            }
        });

        return modules;
    }

    private getModuleFiles(dir: string): string[] {
        return fs.readdirSync(dir)
            .map(fileName => path.join(dir, fileName))
            .filter(filePath => fs.statSync(filePath).isFile() && path.extname(filePath) === ".ts"); // TODO: allow js extensions too
    }

    private static getModuleName(filePath: string, packageName: string): string {
        return packageName + "." + path.basename(filePath);
    }
}
