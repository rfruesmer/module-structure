import {StructureMapRow} from "./structure-map-row";
import {StructureMapEntity} from "./structure-map-entity";
import {StructureMapModule} from "./structure-map-module";

const preconditions = require("preconditions").instance();
const checkState = preconditions.checkState;


export class StructureMapPackage extends StructureMapEntity {
    private _packages: Array<StructureMapPackage>;
    private _modules: Array<StructureMapModule>;
    private _rows: Array<StructureMapRow> = [];

    constructor(path: string,
                name: string,
                simpleName: string,
                childPackages: Array<StructureMapPackage>,
                modules: Array<StructureMapModule>) {
        super(path, name, simpleName);

        this._packages = childPackages.slice();
        this._packages.forEach(_package => _package.parent = this);

        this._modules = modules.slice();
        this._modules.forEach(_package => _package.parent = this);

        this._rows.push(new StructureMapRow(this));
    }

    public levelize(): void {
        this.packages.forEach(childPackage => {
            childPackage.levelize();
            this.levelizeEntity(childPackage);
        });
        this.modules.forEach(module => this.levelizeEntity(module));

        for (let i = this._rows.length - 1; i > 0; --i) {
            this.finalizeRow(i);
        }
    }

    private levelizeEntity(entity: StructureMapEntity): void {
        // console.log("\n>>> " + entity.name + " => " + this.name);

        for (let i = this._rows.length - 1; i >= 0; --i) {
            let row = this._rows[i];
            let dependenciesToEntity = row.getDependencyCountTo(entity);
            let dependenciesToRow = row.getDependencyCountFrom(entity);

            if (dependenciesToEntity === 0) {
                if (dependenciesToRow > 0) {
                    continue;
                }

                if (i === 0) {
                    this.insertEntityIntoRow(entity, 0);
                    return;
                }

                continue;
            }

            if (dependenciesToEntity > dependenciesToRow) {
                if (i < this._rows.length - 1) {
                    dependenciesToEntity = this._rows[i + 1].getDependencyCountTo(entity);
                    dependenciesToRow = this._rows[i + 1].getDependencyCountFrom(entity);
                    if (dependenciesToEntity === 0 && dependenciesToRow === 0) {
                        this.insertEntityIntoRow(entity, i + 1);
                        return;
                    }
                }

                this.insertEntityIntoNewRowBelow(entity, i);
                return;
            }

            // continue to row above
        }

        this.insertEntityIntoRow(entity, -1);
        for (let i = 1; i < this._rows.length - 1; ++i) {
            this.relevelizeRow(i);
        }
    }

    private insertEntityIntoRow(entity: StructureMapEntity, rowIndex: number) {
        if (rowIndex < 0) {
            this._rows.splice(0, 0, new StructureMapRow(this));
            rowIndex = 0;
        }
        else if (rowIndex >= this._rows.length) {
            this._rows.push(new StructureMapRow(this));
        }

        let row = this._rows[rowIndex];
        row.insert(entity);
    }

    private insertEntityIntoNewRowBelow(entity: StructureMapEntity, rowIndex: number) {
        let newRow = new StructureMapRow(this);
        this._rows.splice(rowIndex + 1, 0, newRow);
        this.insertEntityIntoRow(entity, rowIndex + 1);
        return newRow;
    }

    private relevelizeRow(rowIndex: number): void {
        let row = this._rows[rowIndex];
        let rowEntities = row.entities;
        rowEntities.forEach(entity => row.remove(entity));
        this._rows.splice(rowIndex, 1);
        rowEntities.forEach(entity => this.levelizeEntity(entity));
    }

    private finalizeRow(rowIndex: number): void {
        let row = this._rows[rowIndex];
        let rowAbove = this._rows[rowIndex - 1];

        row.entities.forEach(entity => {
            if (rowAbove.getDependencyCountTo(entity) === 0) {
                row.remove(entity);
                rowAbove.insert(entity);
            }
        });

        checkState(row.entities.length > 0);
    }

    get packages(): Array<StructureMapPackage> {
        return this._packages.slice();
    }

    get modules(): Array<StructureMapModule> {
        return this._modules.slice();
    }

    get rows(): Array<StructureMapRow> {
        return this._rows.slice();
    }
}
