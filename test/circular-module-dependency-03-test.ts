import {suite, test} from "mocha-typescript";
import {expect} from "chai";
import {ModuleStructureIntegrationTest} from "./module-structure-integration-test";


@suite class CircularModuleDependency03Test extends ModuleStructureIntegrationTest {

    before() {
        this.buildViewModelFor("test/resources/ts/circular-module-dependency-03");
    }

    @test "contains root"() {
        this.expectRootIsPresent();
    }

    @test "root is valid"() {
        this.expectPackageNodeToEqual(this.viewModel.root, "circular-module-dependency-03", "circular-module-dependency-03");
    }

    @test "root contains four rows"() {
        this.expectRootRowCountToEqual(4);
    }

    @test "module-a and module-b should be in first row"() {
        let row = this.viewModel.root.rows[0];

        this.expectRowNodesCountToEqual(row, 2);
        this.expectRowContainsModule(row, "circular-module-dependency-03.module-a.ts", "module-a.ts");
        this.expectRowContainsModule(row, "circular-module-dependency-03.module-b.ts", "module-b.ts");
    }

    @test "module-e should be in second row"() {
        let row = this.viewModel.root.rows[1];

        this.expectRowNodesCountToEqual(row, 1);
        this.expectRowContainsModule(row, "circular-module-dependency-03.module-e.ts", "module-e.ts");
    }

    @test "module-c should be in third row"() {
        let row = this.viewModel.root.rows[2];

        this.expectRowNodesCountToEqual(row, 1);
        this.expectRowContainsModule(row, "circular-module-dependency-03.module-c.ts", "module-c.ts");
    }

    @test "module-d should be in fourth row"() {
        let row = this.viewModel.root.rows[3];

        this.expectRowNodesCountToEqual(row, 1);
        this.expectRowContainsModule(row, "circular-module-dependency-03.module-d.ts", "module-d.ts");
    }

    @test "contains six dependencies"() {
        this.expectDependencyCountToEqual(6);
    }

    @test "contains dependency from module-a to module-c"() {
        this.expectContainsDependency("circular-module-dependency-03.module-a.ts", "circular-module-dependency-03.module-c.ts");
    }

    @test "contains dependency from module-b to module-e"() {
        this.expectContainsDependency("circular-module-dependency-03.module-b.ts", "circular-module-dependency-03.module-e.ts");
    }

    @test "contains dependency from module-b to module-c"() {
        this.expectContainsDependency("circular-module-dependency-03.module-b.ts", "circular-module-dependency-03.module-c.ts");
    }

    @test "contains dependency from module-e to module-c"() {
        this.expectContainsDependency("circular-module-dependency-03.module-e.ts", "circular-module-dependency-03.module-c.ts");
    }

    @test "contains dependency from module-c to module-e"() {
        this.expectContainsDependency("circular-module-dependency-03.module-c.ts", "circular-module-dependency-03.module-e.ts");
    }

    @test "contains dependency from module-c to module-d"() {
        this.expectContainsDependency("circular-module-dependency-03.module-c.ts", "circular-module-dependency-03.module-d.ts");
    }
}
