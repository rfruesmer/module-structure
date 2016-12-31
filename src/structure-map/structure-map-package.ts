import {StructureMapRow} from "./structure-map-row";
import {Package} from "../package-tree/package";
import {StructureMapEntity} from "./structure-map-entity";
import {PackageTreeEntity} from "../package-tree/package-tree-entity";
import {StructureMapEntityFactory} from "./structure-map-entity-factory";
import {Module} from "../package-tree/module";


export class StructureMapPackage implements StructureMapEntity {
    private _package: Package;
    private _rows: Array<StructureMapRow> = [];

    constructor(_package: Package) {
        this._package = _package;
        this._rows.push(new StructureMapRow());
        this.packages.forEach(childPackage => this.insertEntity(childPackage));
        this.modules.forEach(module => this.insertEntity(module));
    }

    private insertEntity(packageTreeEntity: PackageTreeEntity): void {
        let structureMapEntity = StructureMapEntityFactory.createFrom(packageTreeEntity);

        // console.log(packageTreeEntity.name);

        for (let i = this._rows.length - 1; i >= 0; --i) {
            let row = this._rows[i];
            let dependenciesToEntity = row.getDependencyCountTo(structureMapEntity);
            let dependenciesToRow = row.getDependencyCountFrom(structureMapEntity);

            if (dependenciesToEntity === 0) {
                if (dependenciesToRow > 0) {
                    continue;
                }

                if (i === 0) {
                    this.insertEntityIntoRow(structureMapEntity, 0);
                    return;
                }

                continue;
            }

            if (dependenciesToEntity > dependenciesToRow) {
                if (i < this._rows.length - 1) {
                    dependenciesToEntity = this._rows[i + 1].getDependencyCountTo(structureMapEntity);
                    dependenciesToRow = this._rows[i + 1].getDependencyCountFrom(structureMapEntity);
                    if (dependenciesToEntity === 0 && dependenciesToRow === 0) {
                        this.insertEntityIntoRow(structureMapEntity, i + 1);
                        return;
                    }
                }

                this.insertEntityIntoNewRowBelow(structureMapEntity, i);
                return;
            }

            // continue to row above
        }

        this.insertEntityIntoRow(structureMapEntity, -1);
    }

    private insertEntityIntoRow(entity: StructureMapEntity, rowIndex: number) {
        if (rowIndex < 0) {
            this._rows.splice(0, 0, new StructureMapRow());
            rowIndex = 0;
        }
        else if (rowIndex >= this._rows.length) {
            this._rows.push(new StructureMapRow());
        }

        let row = this._rows[rowIndex];
        row.insert(entity);
    }

    private insertEntityIntoNewRowBelow(entity: StructureMapEntity, rowIndex: number) {
        let newRow = new StructureMapRow();
        this._rows.splice(rowIndex + 1, 0, newRow);
        this.insertEntityIntoRow(entity, rowIndex + 1);
        return newRow;
    }

    get name(): string {
        return this._package.name;
    }

    get simpleName(): string {
        return this._package.simpleName;
    }

    get packages(): Array<Package> {
        return this._package.packages;
    }

    get modules(): Array<Module> {
        return this._package.modules;
    }

    get rows(): Array<StructureMapRow> {
        return this._rows.slice();
    }

    get dependencies(): Array<PackageTreeEntity> {
        return this._package.dependencies;
    }
}
