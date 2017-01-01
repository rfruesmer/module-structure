import {suite, test} from "mocha-typescript";
import {expect} from "chai";
import {StructureViewModelNode} from "../src/structure-view-model/structure-view-model-node";
import {ModuleStructureIntegrationTest} from "./module-structure-integration-test";
import {StructureMapBuilder} from "../src/structure-map/structure-map-builder";
import {StructureViewModelBuilder} from "../src/structure-map/structure-view-model-builder";


@suite class CircularModuleDependency02Test extends ModuleStructureIntegrationTest {

    before() {
        let structureMap = new StructureMapBuilder().build("test/resources/ts/circular-module-dependency-02");
        this.viewModel = new StructureViewModelBuilder().build(structureMap);
    }

    @test "contains root"() {
        expect(this.viewModel).to.have.property("root");
    }

    @test "root is valid"() {
        expect(this.viewModel.root).to.be.an.instanceOf(StructureViewModelNode);
        expect(this.viewModel.root.id).to.equal("circular-module-dependency-02");
        expect(this.viewModel.root.name).to.equal("circular-module-dependency-02");
        expect(this.viewModel.root.isGroup).to.equal(true);
    }

    @test "root contains three rows"() {
        expect(this.viewModel.root).to.have.property("rows").with.length(3);
    }

    @test "class-a, class-b and class-e should be in first row"() {
        let row = this.viewModel.root.rows[0];
        expect(row).to.have.length(3);

        let node = this.findNode("circular-module-dependency-02.class-a.ts", row);
        expect(node).to.be.an.instanceOf(StructureViewModelNode);
        expect(node.id).to.equal("circular-module-dependency-02.class-a.ts");
        expect(node.name).to.equal("class-a.ts");
        expect(node.isGroup).to.equal(false);

        node = this.findNode("circular-module-dependency-02.class-b.ts", row);
        expect(node).to.be.an.instanceOf(StructureViewModelNode);
        expect(node.id).to.equal("circular-module-dependency-02.class-b.ts");
        expect(node.name).to.equal("class-b.ts");
        expect(node.isGroup).to.equal(false);

        node = this.findNode("circular-module-dependency-02.class-e.ts", row);
        expect(node).to.be.an.instanceOf(StructureViewModelNode);
        expect(node.id).to.equal("circular-module-dependency-02.class-e.ts");
        expect(node.name).to.equal("class-e.ts");
        expect(node.isGroup).to.equal(false);
    }

    @test "class-c should be in second row"() {
        let row = this.viewModel.root.rows[1];
        expect(row).to.have.length(1);

        let node = this.findNode("circular-module-dependency-02.class-c.ts", row);
        expect(node).to.be.an.instanceOf(StructureViewModelNode);
        expect(node.id).to.equal("circular-module-dependency-02.class-c.ts");
        expect(node.name).to.equal("class-c.ts");
        expect(node.isGroup).to.equal(false);
    }

    @test "class-d should be in third row"() {
        let row = this.viewModel.root.rows[2];
        expect(row).to.have.length(1);

        let node = this.findNode("circular-module-dependency-02.class-d.ts", row);
        expect(node).to.be.an.instanceOf(StructureViewModelNode);
        expect(node.id).to.equal("circular-module-dependency-02.class-d.ts");
        expect(node.name).to.equal("class-d.ts");
        expect(node.isGroup).to.equal(false);
    }

    @test "contains five dependencies"() {
        expect(this.viewModel).to.have.property("dependencies");
        expect(this.viewModel.dependencies).to.have.length(5);
    }

    @test "contains dependency from class-a to class-c"() {
        this.expectContainsDependency("circular-module-dependency-02.class-a.ts", "circular-module-dependency-02.class-c.ts");
    }

    @test "contains dependency from class-b to class-c"() {
        this.expectContainsDependency("circular-module-dependency-02.class-b.ts", "circular-module-dependency-02.class-c.ts");
    }

    @test "contains dependency from class-e to class-c"() {
        this.expectContainsDependency("circular-module-dependency-02.class-e.ts", "circular-module-dependency-02.class-c.ts");
    }

    @test "contains dependency from class-c to class-e"() {
        this.expectContainsDependency("circular-module-dependency-02.class-c.ts", "circular-module-dependency-02.class-e.ts");
    }

    @test "contains dependency from class-c to class-d"() {
        this.expectContainsDependency("circular-module-dependency-02.class-c.ts", "circular-module-dependency-02.class-d.ts");
    }
}
