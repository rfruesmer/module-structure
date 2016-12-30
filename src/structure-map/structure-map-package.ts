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
        this.insertFirstRow();
        this.levelize();
    }

    private insertFirstRow(): void {
        this._rows.push(new StructureMapRow());
    }

    private levelize(): void {
        this.packages.forEach(childPackage => this.insertEntity(childPackage));
        this.modules.forEach(module => this.insertEntity(module));
    }

    private insertEntity(packageTreeEntity: PackageTreeEntity): void {
        let structureMapEntity = StructureMapEntityFactory.createFrom(packageTreeEntity);
        let inserted = this.findRowAndInsertEntityThere(structureMapEntity);
        if (!inserted) {
            this.appendRow(structureMapEntity);
        }
    }

    private findRowAndInsertEntityThere(entity: StructureMapEntity): boolean {
        for (let i = 0; i < this._rows.length; ++i) {
            let row = this._rows[i];
            let dependenciesToEntity = row.getDependencyCountTo(entity);
            let dependenciesToRow = row.getDependencyCountFrom(entity);
            if (dependenciesToEntity < dependenciesToRow) {
                let newRow = new StructureMapRow();
                newRow.insert(entity);
                this._rows.splice(i, 0, newRow);
                return true;
            }
            else if (dependenciesToRow === 0 && dependenciesToEntity === 0) {
                row.insert(entity);
                return true;
            }
        }

        return false;
    }

    private appendRow(entity: StructureMapEntity) {
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
