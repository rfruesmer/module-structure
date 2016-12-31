import {StructureMapRow} from "./structure-map-row";
import {Package} from "../package-tree/package";
import {StructureMapEntity} from "./structure-map-entity";
import {PackageTreeEntity} from "../package-tree/package-tree-entity";
import {StructureMapEntityFactory} from "./structure-map-entity-factory";
import {Module} from "../package-tree/module";

const preconditions = require("preconditions").instance();
const checkState = preconditions.checkState;


export class StructureMapPackage implements StructureMapEntity {
    private _package: Package;
    private _rows: Array<StructureMapRow> = [];

    constructor(_package: Package) {
        this._package = _package;
        this._rows.push(new StructureMapRow());
        this.levelize();
    }

    private levelize(): void {
        this.packages.forEach(childPackage => this.insertEntity(childPackage));
        this.modules.forEach(module => this.insertEntity(module));
    }

    private insertEntity(packageTreeEntity: PackageTreeEntity): void {
        let structureMapEntity = StructureMapEntityFactory.createFrom(packageTreeEntity);

        for (let i = this._rows.length - 1; i >= 0; --i) {
            let row = this._rows[i];
            let dependenciesToEntity = row.getDependencyCountTo(structureMapEntity);
            let dependenciesToRow = row.getDependencyCountFrom(structureMapEntity);

            // if row doesn't depend on entity
            if (dependenciesToEntity === 0) {
                // if entity depends on row
                if (dependenciesToRow > 0) {
                    continue;
                }

                // if row is first row
                if (i === 0) {
                    // insert entity into first row
                    this.insertEntityIntoRow(structureMapEntity, 0);
                    return;
                }
                else {
                    // continue to row above
                    continue;
                }
            }

            // if row depends on entity more than entity on row
            if (dependenciesToEntity > dependenciesToRow) {
                // insert entity into row below
                let newRow = new StructureMapRow();
                this._rows.splice(i + 1, 0, newRow)
                this.insertEntityIntoRow(structureMapEntity, i + 1);
                return;
            }
            // else if entity depends on row more than row on entity
            else if (dependenciesToRow > dependenciesToEntity) {
                // continue to row above
            }
            else {
                // TODO: break up row
                checkState(false, "not implemented");
            }
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
