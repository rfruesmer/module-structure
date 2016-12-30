import {Package} from "../package-tree/package";
import {Module} from "../package-tree/module";
import {StructureMapEntity} from "./structure-map-entity";
import {PackageTreeEntity} from "../package-tree/package-tree-entity";
import {StructureMapEntityFactory} from "./structure-map-entity-factory";


export class StructureMapRow {
    private _items: Array<StructureMapEntity> = [];
    private _itemsMap: any = {};
    private _dependencyMap: any = {};


    public insert(entity: PackageTreeEntity): void {
        this.indexDependencies(entity);
        this.insertInternal(entity);
    }

    private indexDependencies(entity: PackageTreeEntity): void {
        if (entity instanceof Package) { // notable: after this instanceof check, TypeScript implicitly casts param entity to Package :)
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

    private indexDependency(from: PackageTreeEntity, to: PackageTreeEntity): void {
        let dependencyList = this._dependencyMap[to.name];
        if (!dependencyList) {
            dependencyList = [];
            this._dependencyMap[to.name] = dependencyList;
        }

        dependencyList.push(from);
    }

    private insertInternal(packageTreeEntity: PackageTreeEntity): void {
        let structureMapEntity = StructureMapEntityFactory.createFrom(packageTreeEntity);
        this._items.push(structureMapEntity);
        this._itemsMap[structureMapEntity.name] = structureMapEntity;
    }

    public getDependencyCountTo(entity: PackageTreeEntity): number {
        let dependencyList = this._dependencyMap[entity.name];
        return dependencyList ? dependencyList.length : 0;
    }

    public getDependencyCountFrom(entity: PackageTreeEntity): number {
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
