import {StructureViewModelNode} from "../src/structure-view-model/structure-view-model-node";
import {expect} from "chai";
import {StructureViewModel} from "../src/structure-view-model/structure-view-model";
import {StructureMapBuilder} from "../src/structure-map/structure-map-builder";
import {StructureViewModelBuilder} from "../src/structure-map/structure-view-model-builder";


export abstract class ModuleStructureIntegrationTest {

    protected viewModel: StructureViewModel;


    protected buildViewModelFor(rootDir: string) {
        let structureMap = new StructureMapBuilder().build(rootDir);
        this.viewModel = new StructureViewModelBuilder().build(structureMap);
        expect(this.viewModel).to.exist;
    }

    protected expectRootIsPresent() {
        expect(this.viewModel).to.have.property("root");
    }

    protected expectRootRowCountToEqual(expectedRowCount: number) {
        expect(this.viewModel.root).to.have.property("rows").with.length(expectedRowCount);
    }

    protected expectRowNodesCountToEqual(row: Array<StructureViewModelNode>, expectedNodesCount: number) {
        expect(row).to.have.length(expectedNodesCount);
    }

    protected expectRowContainsPackage(row: Array<StructureViewModelNode>, packageId: string, packageName: string): void {
        let packageNode = this.findNode(packageId, row);
        this.expectPackageNodeToEqual(packageNode, packageId, packageName);
    }

    protected findNode(id: string, row: Array<StructureViewModelNode>): StructureViewModelNode {
        let searchResult = row.filter(entity => entity.id === id);
        expect(searchResult).to.have.length(1);

        return searchResult[0];
    }

    protected expectRowContainsModule(row: Array<StructureViewModelNode>, moduleId: string, moduleName: string) {
        let node = this.findNode(moduleId, row);
        expect(node).to.be.an.instanceOf(StructureViewModelNode);
        expect(node.id).to.equal(moduleId);
        expect(node.name).to.equal(moduleName);
        expect(node.isGroup).to.equal(false);
    }

    protected expectPackageNodeToEqual(packageNode: StructureViewModelNode, packageId: string, packageName: string): void {
        expect(packageNode).to.be.an.instanceOf(StructureViewModelNode);
        expect(packageNode.id).to.equal(packageId);
        expect(packageNode.name).to.equal(packageName);
        expect(packageNode.isGroup).to.equal(true);
    }

    protected expectPackageContainsSingleModule(packageId: string, packageRow: number, moduleName: string): void {
        let row = this.viewModel.root.rows[packageRow];
        let node = this.findNode(packageId, row);

        expect(node.rows).to.have.length(1);

        row = node.rows[0];
        expect(row).to.have.length(1);

        node = row[0];

        this.expectModuleNodeToEqual(node, packageId + "." + moduleName, moduleName);
    }

    protected expectModuleNodeToEqual(moduleNode: StructureViewModelNode, moduleId: string, moduleName: string): void {
        expect(moduleNode).to.be.an.instanceOf(StructureViewModelNode);
        expect(moduleNode.id).to.equal(moduleId);
        expect(moduleNode.name).to.equal(moduleName);
        expect(moduleNode.isGroup).to.equal(false);
        expect(moduleNode.rows).to.have.length(0);
    }

    protected expectNodeRowsCountToEqual(node: StructureViewModelNode, expectedRowsCount: number) {
        expect(node.rows).to.have.length(expectedRowsCount);
    }

    protected expectDependencyCountToEqual(expectedCount: number) {
        expect(this.viewModel).to.have.property("dependencies");
        expect(this.viewModel.dependencies).to.have.length(expectedCount);
    }

    protected expectContainsDependency(from: string, to: string): void {
        let searchResult = this.viewModel.dependencies.filter(dependency => dependency.from === from && dependency.to === to);
        expect(searchResult).to.have.length(1);
    }
}
