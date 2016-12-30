import {Module} from "../package-tree/module";
import {StructureMapEntity} from "./structure-map-entity";
import {StructureMapPackage} from "./structure-map-package";


export class StructureMapRow {
    private _items: Array<StructureMapEntity> = [];
    private _itemsMap: any = {};
    private _dependencyMap: any = {};


    public insert(entity: StructureMapEntity): void {
        this.indexDependencies(entity);
        this.insertInternal(entity);
    }

    private indexDependencies(entity: StructureMapEntity): void {
        if (entity instanceof StructureMapPackage) { // notable: after this instanceof check, TypeScript implicitly casts param entity to Package :)
            entity.packages.forEach(childPackage => this.indexDependencies(childPackage));
            entity.modules.forEach(module => this.indexModuleDependencies(module));
        }

        entity.dependencies.forEach(dependency => {
            this.indexDependency(entity, dependency);
        });
    }

    private indexModuleDependencies(module: Module): void {
        module.dependencies.forEach(dependency => this.indexDependency(module, dependency));
    }

    private indexDependency(from: StructureMapEntity, to: StructureMapEntity): void {
        let dependencyList = this._dependencyMap[to.name];
        if (!dependencyList) {
            dependencyList = [];
            this._dependencyMap[to.name] = dependencyList;
        }

        dependencyList.push(from);
    }

    private insertInternal(entity: StructureMapEntity): void {
        this._items.push(entity);
        this._itemsMap[entity.name] = entity;
    }

    public getDependencyCountTo(entity: StructureMapEntity): number {
        let dependencyList = this._dependencyMap[entity.name];
        return dependencyList ? dependencyList.length : 0;
    }

    public getDependencyCountFrom(entity: StructureMapEntity): number {
        let count = 0;

        entity.dependencies.forEach(dependency => {
            if (this._itemsMap[dependency.name]) {
                count++;
            }
        });

        return count;
    }

    get items(): Array<StructureMapEntity> {
        return this._items.slice();
    }
}
