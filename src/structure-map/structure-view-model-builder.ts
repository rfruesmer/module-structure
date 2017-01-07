import {StructureMapPackage} from "./structure-map-package";
import {StructureMapRow} from "./structure-map-row";
import {StructureMapEntity} from "./structure-map-entity";
import {StructureMapModule} from "./structure-map-module";
import {StructureViewModel} from "../structure-view-model/structure-view-model";
import {StructureViewModelNode} from "../structure-view-model/structure-view-model-node";
import {StructureViewModelDependency} from "../structure-view-model/structure-view-model-dependency";

const preconditions = require("preconditions").instance();
const checkArgument = preconditions.checkArgument;


export class StructureViewModelBuilder {
    private viewModel: StructureViewModel;


    public build(structureMap: StructureMapPackage): StructureViewModel {
        checkArgument(structureMap);

        this.viewModel = new StructureViewModel();
        this.viewModel.root = this.buildInternal(structureMap);

        return this.viewModel;
    }

    private buildInternal(structureMapEntity: StructureMapEntity): StructureViewModelNode {
        checkArgument(structureMapEntity instanceof StructureMapPackage
                || structureMapEntity instanceof StructureMapModule);

        if (structureMapEntity instanceof StructureMapPackage) {
            return this.serializePackage(structureMapEntity);
        }

        return this.serializeModule(structureMapEntity as StructureMapModule);
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

        structureMapRow.entities.forEach(entity => {
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
