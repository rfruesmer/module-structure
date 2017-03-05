import {StructureMapModuleBuilder} from "./structure-map-module-builder";
import {StructureMapPackage} from "./structure-map-package";
import {StructureMapModule} from "./structure-map-module";
import {ExtensionRegistry} from "./extension-registry";
import {StructureMapDependencyProvider} from "./structure-map-module-dependency-provider";

import fs = require("fs");
import path = require("path");
import Map = require("core-js/es6/map");

const preconditions = require("preconditions").instance();
const checkArgument = preconditions.checkArgument;


export class StructureMapPackageBuilder {
    public static readonly LANGUAGE_EXTENSION_POINT = "module-structure:language";

    private rootDir: string;
    private rootDirParent: string;
    private excludes: Array<string> = [];
    private moduleBuilder: StructureMapModuleBuilder;
    private dependencyProviders: Map<string, StructureMapDependencyProvider>;
    private supportedExtensions: Array<string> = [];

    constructor(extensionRegistry: ExtensionRegistry) {
        checkArgument(extensionRegistry);

        this.dependencyProviders = <Map<string, StructureMapDependencyProvider>>
            extensionRegistry.getExtensions(StructureMapPackageBuilder.LANGUAGE_EXTENSION_POINT);

        for (let extension in this.dependencyProviders) {
            this.supportedExtensions.push("." + extension);
        }

        this.moduleBuilder = new StructureMapModuleBuilder(this.dependencyProviders);
    }

    public build(rootDir: string, excludes: string[]): StructureMapPackage {
        this.setOptions(rootDir, excludes);

        return this.buildInternal(this.rootDir);
    }

    private setOptions(rootDir: string, excludes: string[]) {
        checkArgument(fs.statSync(rootDir).isDirectory());

        this.rootDir = rootDir;
        this.rootDirParent = path.normalize(path.join(rootDir, ".."));
        this.excludes = excludes;
    }

    private buildInternal(dir: string): StructureMapPackage {
        let packageName = this.getPackageName(dir);
        if (this.isExcluded(packageName)) {
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

        return path.relative(this.rootDirParent, dir)
            .replace(regEx, ".")
            .toLowerCase();
    }

    private isExcluded(name: string): boolean {
        for (let exclude of this.excludes) {
            if (name.match(exclude)) {
                return true;
            }
        }

        return false;
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
            if (!this.isExcluded(moduleName)) {
                modules.push(this.moduleBuilder.build(modulePath, moduleName, this.rootDir));
            }
        });

        return modules;
    }

    private getModuleFiles(dir: string): string[] {
        let moduleFileMap = {};
        fs.readdirSync(dir)
            .filter(fileName => fs.statSync(path.join(dir, fileName)).isFile())
            .filter(fileName => this.supportedExtensions.indexOf(path.extname(fileName)) > -1)
            .map(fileName => path.join(dir, fileName))
            .forEach(moduleFile => moduleFileMap[moduleFile] = path.extname(moduleFile));

        for (let moduleFile in moduleFileMap) {
            if (moduleFileMap[moduleFile] !== ".ts") {
                continue;
            }

            let correspondingJsFile = moduleFile.substr(0, moduleFile.length - 3) + ".js";
            if (moduleFileMap[correspondingJsFile]) {
                delete moduleFileMap[correspondingJsFile];
            }
        }

        return Object.keys(moduleFileMap);
    }

    private static getModuleName(filePath: string, packageName: string): string {
        return packageName + "." + path.basename(filePath);
    }
}
