import {StructureViewModelNode} from "../src/structure-view-model/structure-view-model-node";
import {expect} from "chai";
import {StructureViewModel} from "../src/structure-view-model/structure-view-model";
import {StructureMapBuilder} from "../src/structure-map/structure-map-builder";
import {StructureViewModelBuilder} from "../src/structure-map/structure-view-model-builder";


export abstract class ModuleStructureIntegrationTest {

    protected viewModel: StructureViewModel;


    protected expectModuleNodeToEqual(moduleNode: StructureViewModelNode, id: string, name: string) {
        expect(moduleNode).to.be.an.instanceOf(StructureViewModelNode);
        expect(moduleNode.id).to.equal(id);
        expect(moduleNode.name).to.equal(name);
        expect(moduleNode.isGroup).to.equal(false);
        expect(moduleNode.rows).to.have.length(0);
    }

    protected expectRowContainsPackage(row: Array<StructureViewModelNode>, id: string, name: string) {
        let packageNode = this.findNode(id, row);

        expect(packageNode).to.be.an.instanceOf(StructureViewModelNode);
        expect(packageNode.id).to.equal(id);
        expect(packageNode.name).to.equal(name);
        expect(packageNode.isGroup).to.equal(true);
    }

    protected findNode(id: string, row: Array<StructureViewModelNode>): StructureViewModelNode {
        let searchResult = row.filter(entity => entity.id === id);
        expect(searchResult).to.have.length(1);

        return searchResult[0];
    }

    protected expectContainsDependency(from: string, to: string) {
        let searchResult = this.viewModel.dependencies.filter(dependency => dependency.from === from && dependency.to === to);
        expect(searchResult).to.have.length(1);
    }
}
