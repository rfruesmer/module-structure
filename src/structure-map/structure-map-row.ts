import {StructureMapEntity} from "./structure-map-entity";
import {StructureMapPackage} from "./structure-map-package";
import {StructureMapModule} from "./structure-map-module";


export class StructureMapRow {
    private _items: Array<StructureMapEntity> = [];
    private _itemsMap: any = {};
    private _dependencyMap: any = {};
    private _parent: StructureMapPackage;

    constructor(parent: StructureMapPackage) {
        this._parent = parent;
    }

    public insert(entity: StructureMapEntity): void {
        this.indexDependencies(entity);
        this.insertInternal(entity);
    }

    private indexDependencies(entity: StructureMapEntity): void {
        if (entity instanceof StructureMapPackage) { // notable: after this instanceof check, TypeScript implicitly casts param entity to Package :)
            entity.packages.forEach(childPackage => this.indexDependencies(childPackage));
            entity.modules.forEach(module => this.indexDependencies(module));
        }

        entity.dependencies.forEach(dependency => {
            this.indexDependency(entity, dependency);
        });
    }

    private indexDependency(from: StructureMapEntity, to: StructureMapEntity): void {
        this.indexDependencyInternal(to.name, from.name);

        let parent = to.parent;
        for (let i = 0; i < 100; ++i) {
            if (this._parent.name.indexOf(parent.name) === 0) {
                break;
            }

            let list = this._dependencyMap[parent.name];
            if (!list) {
                list = [];
                this._dependencyMap[parent.name] = list;
            }
            list.push(from.name);

            parent = parent.parent;
        }
    }

    private indexDependencyInternal(to: string, from: string) {
        let dependencyList = this._dependencyMap[to];
        if (!dependencyList) {
            dependencyList = [];
            this._dependencyMap[to] = dependencyList;
        }

        dependencyList.push(from);
    }

    private insertInternal(entity: StructureMapEntity): void {
        this._items.push(entity);
        this._itemsMap[entity.name] = entity;
    }

    public getDependencyCountTo(entity: StructureMapEntity): number {
        let dependencyList = this._dependencyMap[entity.name];
        if (!dependencyList) {
            return 0;
        }

        dependencyList = dependencyList.filter(firstItem => {
            for (let secondItem of dependencyList) {
                return secondItem === firstItem || secondItem.indexOf(firstItem) !== 0;
            }

            return false;
        });

        return dependencyList.length;
    }

    public getDependencyCountFrom(entity: StructureMapEntity): number {
        let count = 0;

        entity.dependencies.forEach(dependency => {
            if (this.containsDependency(dependency)) {
                count++;
            }
        });

        return count;
    }

    private containsDependency(dependency: StructureMapEntity): boolean {
        if (this._itemsMap[dependency.name]) {
            return true;
        }

        let parent = dependency.parent;
        if (this._parent.name.indexOf(parent.name) === 0) {
            return false;
        }

        return this.containsDependency(parent);
    }

    get items(): Array<StructureMapEntity> {
        return this._items.slice();
    }
}
