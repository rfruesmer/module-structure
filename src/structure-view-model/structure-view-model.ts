import {StructureViewModelNode} from "./structure-view-model-node";
import {StructureViewModelDependency} from "./structure-view-model-dependency";


export class StructureViewModel {
    root: StructureViewModelNode = null;
    dependencies: Array<StructureViewModelDependency> = [];
}
