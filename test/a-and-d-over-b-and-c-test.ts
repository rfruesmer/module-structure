import {suite, test} from "mocha-typescript";
import {ModuleStructureIntegrationTest} from "./module-structure-integration-test";
import {StructureMapBuilder} from "../src/structure-map/structure-map-builder";
import {StructureViewModelBuilder} from "../src/structure-map/structure-view-model-builder";
import {expect} from "chai";
import {StructureViewModelNode} from "../src/structure-view-model/structure-view-model-node";


@suite class AAndDOverBAndCTest extends ModuleStructureIntegrationTest {

    before() {
        let structureMap = new StructureMapBuilder().build("test/resources/ts/a-and-d-over-b-and-c");
        this.viewModel = new StructureViewModelBuilder().build(structureMap);
    }

    @test "contains root"() {
        expect(this.viewModel).to.have.property("root");
    }

    @test "root is valid"() {
        expect(this.viewModel.root).to.be.an.instanceOf(StructureViewModelNode);
        expect(this.viewModel.root.id).to.equal("a-and-d-over-b-and-c");
        expect(this.viewModel.root.name).to.equal("a-and-d-over-b-and-c");
        expect(this.viewModel.root.isGroup).to.equal(true);
    }

    @test "root contains two rows"() {
        expect(this.viewModel.root).to.have.property("rows").with.length(2);
    }

    @test "package-a and package-d should be in first row"() {
        let row = this.viewModel.root.rows[0];
        expect(row).to.have.length(2);

        let node = this.findNode("a-and-d-over-b-and-c.package-a", row);
        expect(node).to.be.an.instanceOf(StructureViewModelNode);
        expect(node.id).to.equal("a-and-d-over-b-and-c.package-a");
        expect(node.name).to.equal("package-a");
        expect(node.isGroup).to.equal(true);

        node = this.findNode("a-and-d-over-b-and-c.package-d", row);
        expect(node).to.be.an.instanceOf(StructureViewModelNode);
        expect(node.id).to.equal("a-and-d-over-b-and-c.package-d");
        expect(node.name).to.equal("package-d");
        expect(node.isGroup).to.equal(true);
    }

    @test "package-a should contain class-a"() {
        let row = this.viewModel.root.rows[0];
        let node = this.findNode("a-and-d-over-b-and-c.package-a", row);
        expect(node.rows).to.have.length(1);

        row = node.rows[0];
        expect(row).to.have.length(1);

        node = row[0];
        this.expectModuleNodeToEqual(node, "a-and-d-over-b-and-c.package-a.class-a.ts", "class-a.ts");
    }

    @test "package-d should contain class-d"() {
        let row = this.viewModel.root.rows[0];
        let node = this.findNode("a-and-d-over-b-and-c.package-d", row);
        expect(node.rows).to.have.length(1);

        row = node.rows[0];
        expect(row).to.have.length(1);

        node = row[0];
        this.expectModuleNodeToEqual(node, "a-and-d-over-b-and-c.package-d.class-d.ts", "class-d.ts");
    }

    @test "package-b and package-c should be in second row"() {
        let row = this.viewModel.root.rows[1];
        expect(row).to.have.length(2);

        let node = this.findNode("a-and-d-over-b-and-c.package-b", row);
        expect(node).to.be.an.instanceOf(StructureViewModelNode);
        expect(node.id).to.equal("a-and-d-over-b-and-c.package-b");
        expect(node.name).to.equal("package-b");
        expect(node.isGroup).to.equal(true);

        node = this.findNode("a-and-d-over-b-and-c.package-c", row);
        expect(node).to.be.an.instanceOf(StructureViewModelNode);
        expect(node.id).to.equal("a-and-d-over-b-and-c.package-c");
        expect(node.name).to.equal("package-c");
        expect(node.isGroup).to.equal(true);
    }

    @test "package-b should contain class-b"() {
        let row = this.viewModel.root.rows[1];
        let node = this.findNode("a-and-d-over-b-and-c.package-b", row);
        expect(node.rows).to.have.length(1);

        row = node.rows[0];
        expect(row).to.have.length(1);

        node = row[0];
        this.expectModuleNodeToEqual(node, "a-and-d-over-b-and-c.package-b.class-b.ts", "class-b.ts");
    }

    @test "package-c should contain class-c"() {
        let row = this.viewModel.root.rows[1];
        let node = this.findNode("a-and-d-over-b-and-c.package-c", row);
        expect(node.rows).to.have.length(1);

        row = node.rows[0];
        expect(row).to.have.length(1);

        node = row[0];
        this.expectModuleNodeToEqual(node, "a-and-d-over-b-and-c.package-c.class-c.ts", "class-c.ts");
    }

    @test "contains four dependencies"() {
        expect(this.viewModel).to.have.property("dependencies");
        expect(this.viewModel.dependencies).to.have.length(4);
    }

    @test "contains dependency from class-a to class-b"() {
        this.expectContainsDependency("a-and-d-over-b-and-c.package-a.class-a.ts", "a-and-d-over-b-and-c.package-b.class-b.ts");
    }

    @test "contains dependency from class-a to class-c"() {
        this.expectContainsDependency("a-and-d-over-b-and-c.package-a.class-a.ts", "a-and-d-over-b-and-c.package-c.class-c.ts");
    }

    @test "contains dependency from class-c to class-d"() {
        this.expectContainsDependency("a-and-d-over-b-and-c.package-c.class-c.ts", "a-and-d-over-b-and-c.package-d.class-d.ts");
    }

    @test "contains dependency from class-d to class-b"() {
        this.expectContainsDependency("a-and-d-over-b-and-c.package-d.class-d.ts", "a-and-d-over-b-and-c.package-b.class-b.ts");
    }
}
