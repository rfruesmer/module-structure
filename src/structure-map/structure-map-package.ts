import {StructureMapRow} from "./structure-map-row";
import {StructureMapEntity} from "./structure-map-entity";
import {StructureMapModule} from "./structure-map-module";

const preconditions = require("preconditions").instance();
const checkArgument = preconditions.checkArgument;


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
        this.finalizeRows();
        this.relevelizeEntitiesWithoutDependenciesFromRowAbove();
        this.relevelizeEntitiesWithoutDependenciesToRowBelow();
        this.relevelizeEntitiesByRowSplitting();
        this.finalizeRows();
    }

    private levelizeEntity(entity: StructureMapEntity, relevelizing = false): void {
        // console.log("\n>>> " + entity.name + " => " + this.name);

        let dependenciesToEntity: number;
        let dependenciesToRow: number;
        let insertPos: number;


        for (let i = this._rows.length - 1; i >= 0; --i) {
            let row = this._rows[i];
            dependenciesToEntity = row.getDependencyCountTo(entity);
            dependenciesToRow = row.getDependencyCountFrom(entity);

            if (dependenciesToEntity > dependenciesToRow) {
                if (this.isLastRow(i)) {
                    this.insertEntityIntoNewRowBelow(entity, i);
                    insertPos = i;
                }
                else {
                    row = this._rows[i + 1];
                    dependenciesToEntity = row.getDependencyCountTo(entity);
                    dependenciesToRow = row.getDependencyCountFrom(entity);
                    if (dependenciesToEntity === 0 && dependenciesToRow === 0) {
                        this.insertEntityIntoRow(entity, i + 1);
                    }
                    else {
                        this.insertEntityIntoNewRowBelow(entity, i);
                    }

                    insertPos = i + 1;
                }

                if (!relevelizing) {
                    this.relevelizeRowsAbove(insertPos);
                }

                return;
            }

            // continue to row above
        }

        let firstRow = this._rows[0];
        dependenciesToEntity = firstRow.getDependencyCountTo(entity);
        dependenciesToRow = firstRow.getDependencyCountFrom(entity);
        if (dependenciesToEntity === 0 && dependenciesToRow === 0) {
            this.insertEntityIntoRow(entity, 0);
        }
        else {
            this.insertEntityIntoRow(entity, -1);
            if (!relevelizing) {
                this.relevelizeSecondRow();
            }
        }
    }

    private isLastRow(rowIndex: number) {
        return rowIndex === this._rows.length - 1;
    }

    private insertEntityIntoNewRowBelow(entity: StructureMapEntity, rowIndex: number) {
        this.createNewRow(rowIndex + 1);
        this.insertEntityIntoRow(entity, rowIndex + 1);
    }

    private createNewRow(rowIndex: number) {
        let newRow = new StructureMapRow(this);
        this._rows.splice(rowIndex, 0, newRow);
    }

    private insertEntityIntoRow(entity: StructureMapEntity, rowIndex: number) {
        checkArgument(rowIndex >= -1);

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

    private relevelizeSecondRow(): void {
        let firstRow = this._rows[0];
        let secondRow = this._rows[1];
        let entitiesToBeMovedToFirstRow = [];
        let entitiesToBeMovedToNewRow = [];

        secondRow.entities.forEach(entity => {
            let dependenciesToEntity = firstRow.getDependencyCountTo(entity);
            let dependenciesToRow = firstRow.getDependencyCountFrom(entity);
            if (dependenciesToRow > dependenciesToEntity) {
                entitiesToBeMovedToNewRow.push(entity);
            }
            else if (dependenciesToRow === 0 && dependenciesToEntity === 0) {
                entitiesToBeMovedToFirstRow.push(entity);
            }
        });

        entitiesToBeMovedToFirstRow.forEach(entity => {
            secondRow.remove(entity);
            firstRow.insert(entity);
        });

        if (secondRow.entities.length === 0) {
            this._rows.splice(1, 1);
        }

        if (entitiesToBeMovedToNewRow.length === 0) {
            return;
        }

        this._rows.splice(0, 0, new StructureMapRow(this));
        let newRow = this._rows[0];

        entitiesToBeMovedToNewRow.forEach(entity => {
            secondRow.remove(entity);
            newRow.insert(entity);
        });

        if (secondRow.entities.length === 0) {
            this._rows.splice(2, 1);
        }

        this.relevelizeSecondRow();
    }

    private finalizeRows() {
        for (let i = this._rows.length - 1; i > 0; --i) {
            const restart = this.finalizeRow(i);
            if (this._rows[i].entities.length === 0) {
                this._rows.splice(i, 1);
            }

            if (restart) {
                i = this._rows.length - 1;
            }
        }

        this._rows[0].sort();
    }

    private finalizeRow(rowIndex: number): boolean {
        let row = this._rows[rowIndex];
        let rowAbove = this._rows[rowIndex - 1];
        let restart = false;

        row.entities.forEach(entity => {
            let dependenciesToEntity = rowAbove.getDependencyCountTo(entity);
            let dependenciesToRow = rowAbove.getDependencyCountFrom(entity);
            if (dependenciesToEntity === 0 && dependenciesToRow === 0) {
                row.remove(entity);
                rowAbove.insert(entity);
                restart = true;
            }
        });

        row.sort();

        return restart;
    }

    private relevelizeRowsAbove(rowIndex: number) {
        let entititesToLevelize = [];

        for (let i = rowIndex - 1; i >= 0; --i) {
            let row = this._rows[i];
            entititesToLevelize = entititesToLevelize.concat(row.entities);
            this._rows.splice(i, 1);
        }

        entititesToLevelize.forEach(entity => {
            this.levelizeEntity(entity, true);
        });
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

    private relevelizeEntitiesByRowSplitting() {
        for (let i = this._rows.length - 1; i > 0; --i) {
            const currentRow = this._rows[i];
            let rowWasSplit = false;
            for (let j = i - 1; j >= 0; --j) {
                const rowAbove = this._rows[j];

                rowAbove.entities.forEach(entity => {
                    if (currentRow.entities.length === 1
                            || currentRow.getDependencyCountTo(entity) < currentRow.getDependencyCountFrom(entity)) {
                        return;
                    }

                    const independentEntites = currentRow.getEntitiesIndependentFrom(entity);
                    if (independentEntites.length === 0) {
                        return;
                    }

                    if (!rowWasSplit) {
                        this.createNewRow(i + 1);
                        this.createNewRow(i + 2);
                        rowWasSplit = true;
                    }

                    // move entity into new row below current row
                    rowAbove.remove(entity);
                    this.insertEntityIntoRow(entity, i + 1);

                    // remove undependent entities from row
                    independentEntites.forEach(undependentEntity => {
                        currentRow.remove(undependentEntity);
                    });

                    // insert undependent entities into new row below
                    independentEntites.forEach(undependentEntity => {
                        this._rows[i + 2].insert(undependentEntity);
                    });

                    this._rows[i + 2].sort();
                });
            }
        }
    }

    private relevelizeEntitiesWithoutDependenciesFromRowAbove() {
        for (let i = this._rows.length - 1; i > 0; --i) {
            let restart = false;

            const currentRow = this._rows[i];
            const rowAbove = this._rows[i - 1];

            for (let j = 0; j < currentRow.entities.length; ++j) {
                const currentEntity = currentRow.entities[j];
                if (rowAbove.getDependencyCountTo(currentEntity) === 0) {
                    currentRow.remove(currentEntity);
                    this.levelizeEntity(currentEntity, true);
                    restart = true;
                    break;
                }
            }

            if (restart) {
                i = this._rows.length - 1;
            }
        }
    }

    private relevelizeEntitiesWithoutDependenciesToRowBelow() {
        for (let i = 0; i < this._rows.length - 1; ++i) {
            let restart = false;

            const currentRow = this._rows[i];
            const rowBelow = this._rows[i + 1];

            for (let j = 0; j < currentRow.entities.length; ++j) {
                const currentEntity = currentRow.entities[j];
                if (rowBelow.getDependencyCountFrom(currentEntity) === 0
                        && rowBelow.getDependencyCountTo(currentEntity) > 0) {
                    currentRow.remove(currentEntity);
                    this.levelizeEntity(currentEntity, true);
                    restart = true;
                    break;
                }
            }

            if (restart) {
                i = this._rows.length - 1;
            }
        }
    }
}
