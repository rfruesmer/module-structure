import {StructureMapPackage} from "./structure-map-package";
import {StructureMapViewModel} from "./structure-map-view-model";
import {StructureMapViewModelNode} from "./structure-map-view-model-node";
import {StructureMapRow} from "./structure-map-row";
import {StructureMapEntity} from "./structure-map-entity";
import {StructureMapModule} from "./structure-map-module";

const preconditions = require("preconditions").instance();
const checkState = preconditions.checkState;


export class StructureMapViewModelBuilder {
    private viewModel: StructureMapViewModel;


    public buildFrom(structureMap: StructureMapPackage): StructureMapViewModel {
        this.viewModel = new StructureMapViewModel();
        this.viewModel.root = this.buildViewModelNode(structureMap);

        return this.viewModel;
    }

    private buildViewModelNode(structureMapEntity: StructureMapEntity): StructureMapViewModelNode {
        if (structureMapEntity instanceof StructureMapPackage) {
            return this.buildPackageViewModel(structureMapEntity);
        }
        else if (structureMapEntity instanceof StructureMapModule) {
            return StructureMapViewModelBuilder.buildModuleViewModel(structureMapEntity);
        }

        checkState(false, "Unknown entity type");

        return null; // will never reach here, but this return statment makes our compiler happy
    }

    private buildPackageViewModel(_package: StructureMapPackage): StructureMapViewModelNode {
        let node = new StructureMapViewModelNode();
        node.id = _package.name;
        node.name = _package.simpleName;
        node.isGroup = true;
        node.rows = this.buildViewModelRows(_package);

        return node;
    }

    private buildViewModelRows(_package: StructureMapPackage): Array<Array<StructureMapViewModelNode>> {
        let viewModelRows: Array<Array<StructureMapViewModelNode>> = [];

        _package.rows.forEach(row => {
            viewModelRows.push(this.buildViewModelRow(row));
        });

        return viewModelRows;
    }

    private buildViewModelRow(structureMapRow: StructureMapRow): Array<StructureMapViewModelNode> {
        let viewModelRow: Array<StructureMapViewModelNode> = [];

        structureMapRow.items.forEach(entity => {
            viewModelRow.push(this.buildViewModelNode(entity));
        });

        return viewModelRow;
    }

    private static buildModuleViewModel(module: StructureMapModule) {
        let node = new StructureMapViewModelNode();
        node.id = module.name;
        node.name = module.simpleName;
        node.isGroup = false;

        return node;
    }
}
