import {suite, test} from "mocha-typescript";
import {expect} from "chai";
import {StructureViewModelNode} from "../src/structure-view-model/structure-view-model-node";
import {ModuleStructureAnalyerTest} from "./module-structure-analyzer-test";


@suite class AOverBAndCTest extends ModuleStructureAnalyerTest {

    @test "contains root"() {
        expect(this.viewModel).to.have.property("root");
    }

    @test "root is valid"() {
        expect(this.viewModel.root).to.be.an.instanceOf(StructureViewModelNode);
        expect(this.viewModel.root.id).to.equal("a-over-b-and-c");
        expect(this.viewModel.root.name).to.equal("a-over-b-and-c");
        expect(this.viewModel.root.isGroup).to.equal(true);
    }

    @test "root contains two rows"() {
        expect(this.viewModel.root).to.have.property("rows").with.length(2);
    }

    @test "package-a should be in first row"() {
        let firstRow = this.viewModel.root.rows[0];
        expect(firstRow).to.have.length(1);

        let viewModelNode = firstRow[0];
        expect(viewModelNode).to.be.an.instanceOf(StructureViewModelNode);
        expect(viewModelNode.id).to.equal("a-over-b-and-c.package-a");
        expect(viewModelNode.name).to.equal("package-a");
        expect(viewModelNode.isGroup).to.equal(true);
    }

    @test "package-a contains class-a"() {
        let row = this.viewModel.root.rows[0];
        let packageNode = row[0];

        expect(packageNode.rows).to.have.length(1);

        row = packageNode.rows[0];
        expect(row).to.have.length(1);

        this.expectModuleNodeToEqual(row[0], "a-over-b-and-c.package-a.class-a.ts", "class-a.ts");
    }

    @test "second row contains two elements"() {
        let row = this.viewModel.root.rows[1];
        expect(row).to.have.length(2);
    }

    @test "second row contains package-b"() {
        let row = this.viewModel.root.rows[1];
        this.expectRowContainsPackage(row, "a-over-b-and-c.package-b", "package-b");
    }

    @test "package-b contains class-b"() {
        let row = this.viewModel.root.rows[1];
        let packageNode = this.findNode("a-over-b-and-c.package-b", row);

        expect(packageNode.rows).to.have.length(1);

        row = packageNode.rows[0];
        expect(row).to.have.length(1);

        this.expectModuleNodeToEqual(row[0], "a-over-b-and-c.package-b.class-b.ts", "class-b.ts");
    }

    @test "second row contains package-c"() {
        let row = this.viewModel.root.rows[1];
        this.expectRowContainsPackage(row, "a-over-b-and-c.package-c", "package-c");
    }

    @test "package-c contains class-c"() {
        let row = this.viewModel.root.rows[1];
        let packageNode = this.findNode("a-over-b-and-c.package-c", row);

        expect(packageNode.rows).to.have.length(1);

        row = packageNode.rows[0];
        expect(row).to.have.length(1);

        this.expectModuleNodeToEqual(row[0], "a-over-b-and-c.package-c.class-c.ts", "class-c.ts");
    }

    @test "contains two dependencies"() {
        expect(this.viewModel).to.have.property("dependencies");
        expect(this.viewModel.dependencies).to.have.length(2);
    }

    @test "contains dependency from class-a to class-b"() {
        this.expectContainsDependency("a-over-b-and-c.package-a.class-a.ts", "a-over-b-and-c.package-b.class-b.ts");
    }

    @test "contains dependency from class-a to class-c"() {
        this.expectContainsDependency("a-over-b-and-c.package-a.class-a.ts", "a-over-b-and-c.package-c.class-c.ts");
    }
}
