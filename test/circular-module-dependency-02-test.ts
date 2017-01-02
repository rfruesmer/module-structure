import {suite, test} from "mocha-typescript";
import {expect} from "chai";
import {StructureViewModelNode} from "../src/structure-view-model/structure-view-model-node";
import {ModuleStructureIntegrationTest} from "./module-structure-integration-test";
import {StructureMapBuilder} from "../src/structure-map/structure-map-builder";
import {StructureViewModelBuilder} from "../src/structure-map/structure-view-model-builder";


@suite class CircularModuleDependency02Test extends ModuleStructureIntegrationTest {

    before() {
        this.buildViewModelFor("test/resources/ts/circular-module-dependency-02");
    }

    @test "contains root"() {
        this.expectRootIsPresent();
    }

    @test "root is valid"() {
        this.expectPackageNodeToEqual(this.viewModel.root, "circular-module-dependency-02", "circular-module-dependency-02");
    }

    @test "root contains three rows"() {
        this.expectRootRowCountToEqual(3);
    }

    @test "module-a, module-b and module-e should be in first row"() {
        let row = this.viewModel.root.rows[0];

        this.expectRowNodesCountToEqual(row, 3);
        this.expectRowContainsModule(row, "circular-module-dependency-02.module-a.ts", "module-a.ts");
        this.expectRowContainsModule(row, "circular-module-dependency-02.module-b.ts", "module-b.ts");
        this.expectRowContainsModule(row, "circular-module-dependency-02.module-e.ts", "module-e.ts");
    }

    @test "module-c should be in second row"() {
        let row = this.viewModel.root.rows[1];

        this.expectRowNodesCountToEqual(row, 1);
        this.expectRowContainsModule(row, "circular-module-dependency-02.module-c.ts", "module-c.ts");
    }

    @test "module-d should be in third row"() {
        let row = this.viewModel.root.rows[2];

        this.expectRowNodesCountToEqual(row, 1);
        this.expectRowContainsModule(row, "circular-module-dependency-02.module-d.ts", "module-d.ts");
    }

    @test "contains five dependencies"() {
        this.expectDependencyCountToEqual(5);
    }

    @test "contains dependency from module-a to module-c"() {
        this.expectContainsDependency("circular-module-dependency-02.module-a.ts", "circular-module-dependency-02.module-c.ts");
    }

    @test "contains dependency from module-b to module-c"() {
        this.expectContainsDependency("circular-module-dependency-02.module-b.ts", "circular-module-dependency-02.module-c.ts");
    }

    @test "contains dependency from module-e to module-c"() {
        this.expectContainsDependency("circular-module-dependency-02.module-e.ts", "circular-module-dependency-02.module-c.ts");
    }

    @test "contains dependency from module-c to module-e"() {
        this.expectContainsDependency("circular-module-dependency-02.module-c.ts", "circular-module-dependency-02.module-e.ts");
    }

    @test "contains dependency from module-c to module-d"() {
        this.expectContainsDependency("circular-module-dependency-02.module-c.ts", "circular-module-dependency-02.module-d.ts");
    }
}
