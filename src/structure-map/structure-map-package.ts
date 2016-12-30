import {StructureMapRow} from "./structure-map-row";
import {Package} from "../package-tree/package";
import {StructureMapEntity} from "./structure-map-entity";
import {PackageTreeEntity} from "../package-tree/package-tree-entity";


export class StructureMapPackage implements StructureMapEntity {
    private _package: Package;
    private _rows: Array<StructureMapRow> = [];


    constructor(_package: Package) {
        this._package = _package;
        this.insertFirstRow();
        this.levelize();
    }

    private insertFirstRow(): void {
        this._rows.push(new StructureMapRow());
    }

    private levelize(): void {
        this._package.packages.forEach(childPackage => this.insertEntity(childPackage));
        this._package.modules.forEach(module => this.insertEntity(module));
    }

    private insertEntity(entity: PackageTreeEntity): void {
        let inserted = this.findRowAndInsertEntityThere(entity);
        if (!inserted) {
            this.appendRow(entity);
        }
    }

    private findRowAndInsertEntityThere(entity: PackageTreeEntity): boolean {
        for (let i = 0; i < this._rows.length; ++i) {
            let row = this._rows[i];
            let dependenciesToPackage = row.getDependencyCountTo(entity);
            let dependenciesToRow = row.getDependencyCountFrom(entity);
            if (dependenciesToPackage < dependenciesToRow) {
                let newRow = new StructureMapRow();
                newRow.insert(entity);
                this._rows.splice(i, 0, newRow);
                return true;
            }
            else if (dependenciesToRow === dependenciesToPackage) {
                row.insert(entity);
                return true;
            }
        }

        return false;
    }

    private appendRow(entity: PackageTreeEntity) {
        let row = new StructureMapRow();
        row.insert(entity);
        this._rows.push(row);
    }

    get name(): string {
        return this._package.name;
    }

    get simpleName(): string {
        return this._package.simpleName;
    }

    get rows(): Array<StructureMapRow> {
        return this._rows.slice();
    }
}
