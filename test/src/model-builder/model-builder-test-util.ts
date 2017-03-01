import {StructureViewModelNode} from "../../../src/structure-view-model/structure-view-model-node";
import {StructureViewModel} from "../../../src/structure-view-model/structure-view-model";
import {expect} from "chai";

const fs = require("fs-extra");
const path = require("path");
const os = require("os");

const moduleStructure = require("../../../src/module-structure");


export function buildViewModelFor(rootDir: string): StructureViewModel {
    const outDir = path.join(os.tmpdir(), "module-structure-1aef3501");
    const outFile = path.join(outDir, "module-structure.json");

    fs.mkdirsSync(outDir);

    let viewModel = moduleStructure({rootDir: rootDir, outFile: outFile});
    expect(viewModel).to.exist;

    return viewModel;
}

export function expectRootIsPresent(viewModel: StructureViewModel) {
    expect(viewModel).to.have.property("root");
}

export function expectRootRowCountToEqual(viewModel: StructureViewModel, expectedRowCount: number) {
    expect(viewModel.root).to.have.property("rows").with.length(expectedRowCount);
}

export function expectRowNodesCountToEqual(row: Array<StructureViewModelNode>, expectedNodesCount: number) {
    expect(row).to.have.length(expectedNodesCount);
}

export function expectRowContainsPackage(row: Array<StructureViewModelNode>, packageId: string, packageName: string): void {
    let packageNode = findNode(packageId, row);
    expectPackageNodeToEqual(packageNode, packageId, packageName);
}

export function findNode(id: string, row: Array<StructureViewModelNode>): StructureViewModelNode {
    let searchResult = row.filter(entity => entity.id === id);
    expect(searchResult).to.have.length(1);

    return searchResult[0];
}

export function expectRowContainsModule(row: Array<StructureViewModelNode>, moduleId: string, moduleName: string) {
    let node = findNode(moduleId, row);
    expect(node).to.be.an.instanceOf(StructureViewModelNode);
    expect(node.id).to.equal(moduleId);
    expect(node.name).to.equal(moduleName);
    expect(node.isGroup).to.equal(false);
}

export function expectPackageNodeToEqual(packageNode: StructureViewModelNode, packageId: string, packageName: string): void {
    expect(packageNode).to.be.an.instanceOf(StructureViewModelNode);
    expect(packageNode.id).to.equal(packageId);
    expect(packageNode.name).to.equal(packageName);
    expect(packageNode.isGroup).to.equal(true);
}

export function expectPackageContainsSingleModule(viewModel: StructureViewModel, packageId: string, packageRow: number, moduleName: string): void {
    let row = viewModel.root.rows[packageRow];
    let node = findNode(packageId, row);

    expect(node.rows).to.have.length(1);

    row = node.rows[0];
    expect(row).to.have.length(1);

    node = row[0];

    expectModuleNodeToEqual(node, packageId + "." + moduleName, moduleName);
}

export function expectModuleNodeToEqual(moduleNode: StructureViewModelNode, moduleId: string, moduleName: string): void {
    expect(moduleNode).to.be.an.instanceOf(StructureViewModelNode);
    expect(moduleNode.id).to.equal(moduleId);
    expect(moduleNode.name).to.equal(moduleName);
    expect(moduleNode.isGroup).to.equal(false);
    expect(moduleNode.rows).to.have.length(0);
}

export function expectNodeRowsCountToEqual(node: StructureViewModelNode, expectedRowsCount: number) {
    expect(node.rows).to.have.length(expectedRowsCount);
}

export function expectDependencyCountToEqual(viewModel: StructureViewModel, expectedCount: number) {
    expect(viewModel).to.have.property("dependencies");
    expect(viewModel.dependencies).to.have.length(expectedCount);
}

export function expectContainsDependency(viewModel: StructureViewModel, from: string, to: string): void {
    let searchResult = viewModel.dependencies.filter(dependency => dependency.from === from && dependency.to === to);
    expect(searchResult).to.have.length(1);
}

export function expectFeedbackCountToEqual(viewModel: StructureViewModel, expectedCount: number) {
    expect(viewModel).to.have.property("feedbacks");
    expect(viewModel.feedbacks).to.have.length(expectedCount);
}

export function expectContainsFeedback(viewModel: StructureViewModel, from: string, to: string): void {
    let searchResult = viewModel.feedbacks.filter(feedback => feedback.from === from && feedback.to === to);
    expect(searchResult).to.have.length(1);
}
