import {StructureMapPackage} from "../structure-map/structure-map-package";
import {StructureViewModel} from "./structure-view-model";
import {StructureViewModelNode} from "./structure-view-model-node";
import {StructureMapRow} from "../structure-map/structure-map-row";
import {StructureMapEntity} from "../structure-map/structure-map-entity";
import {StructureMapModule} from "../structure-map/structure-map-module";
import {StructureViewModelDependency} from "./structure-view-model-dependency";

const preconditions = require("preconditions").instance();
const checkState = preconditions.checkState;


export class StructureViewModelBuilder {
    private viewModel: StructureViewModel;


    public build(structureMap: StructureMapPackage): StructureViewModel {
        this.viewModel = new StructureViewModel();
        this.viewModel.root = this.buildInternal(structureMap);

        return this.viewModel;
    }

    private buildInternal(structureMapEntity: StructureMapEntity): StructureViewModelNode {
        if (structureMapEntity instanceof StructureMapPackage) {
            return this.serializePackage(structureMapEntity);
        }
        else if (structureMapEntity instanceof StructureMapModule) {
            return this.serializeModule(structureMapEntity);
        }

        checkState(false, "Unknown entity type");

        return null; // will never reach here, but this return statment makes our compiler happy
    }

    private serializePackage(_package: StructureMapPackage): StructureViewModelNode {
        let node = new StructureViewModelNode();
        node.id = _package.name;
        node.name = _package.simpleName;
        node.isGroup = true;
        node.rows = this.serializeRows(_package);

        return node;
    }

    private serializeRows(_package: StructureMapPackage): Array<Array<StructureViewModelNode>> {
        let viewModelRows: Array<Array<StructureViewModelNode>> = [];

        _package.rows.forEach(row => {
            viewModelRows.push(this.serializeRow(row));
        });

        return viewModelRows;
    }

    private serializeRow(structureMapRow: StructureMapRow): Array<StructureViewModelNode> {
        let viewModelRow: Array<StructureViewModelNode> = [];

        structureMapRow.items.forEach(entity => {
            viewModelRow.push(this.buildInternal(entity));
        });

        return viewModelRow;
    }

    private serializeModule(module: StructureMapModule): StructureViewModelNode {
        let node = new StructureViewModelNode();
        node.id = module.name;
        node.name = module.simpleName;
        node.isGroup = false;

        module.dependencies.forEach(dependency => {
            let viewModelDependency = new StructureViewModelDependency();
            viewModelDependency.from = module.name;
            viewModelDependency.to = dependency.name;

            this.viewModel.dependencies.push(viewModelDependency);
        });

        return node;
    }
}
