import {StructureMapViewModelNode} from "./structure-map-view-model-node";
import {StructureMapViewModelDependency} from "./structure-map-view-model-dependency";


export class StructureMapViewModel {
    root: StructureMapViewModelNode;
    dependencies: Array<StructureMapViewModelDependency>
}
