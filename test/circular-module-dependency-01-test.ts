import {suite, test} from "mocha-typescript";
import {ModuleStructureIntegrationTest} from "./module-structure-integration-test";


@suite class CircularModuleDependency01Test extends ModuleStructureIntegrationTest {

    before() {
        this.buildViewModelFor("test/resources/ts/circular-module-dependency-01");
    }

    @test "contains root"() {
        this.expectRootIsPresent();
    }

    @test "root is valid"() {
        this.expectPackageNodeToEqual(this.viewModel.root, "circular-module-dependency-01", "circular-module-dependency-01");
    }

    @test "root contains two rows"() {
        this.expectRootRowCountToEqual(2);
    }

    @test "module-a and module-c should be in first row"() {
        let row = this.viewModel.root.rows[0];

        this.expectRowNodesCountToEqual(row, 2);
        this.expectRowContainsModule(row, "circular-module-dependency-01.module-a.ts", "module-a.ts");
        this.expectRowContainsModule(row, "circular-module-dependency-01.module-c.ts", "module-c.ts");
    }

    @test "module-b should be in second row"() {
        let row = this.viewModel.root.rows[1];

        this.expectRowNodesCountToEqual(row, 1);
        this.expectRowContainsModule(row, "circular-module-dependency-01.module-b.ts", "module-b.ts");
    }

    @test "contains three dependencies"() {
        this.expectDependencyCountToEqual(3);
    }

    @test "contains dependency from module-a to module-b"() {
        this.expectContainsDependency("circular-module-dependency-01.module-a.ts", "circular-module-dependency-01.module-b.ts");
    }

    @test "contains dependency from module-b to module-c"() {
        this.expectContainsDependency("circular-module-dependency-01.module-b.ts", "circular-module-dependency-01.module-c.ts");
    }

    @test "contains dependency from module-c to module-b"() {
        this.expectContainsDependency("circular-module-dependency-01.module-c.ts", "circular-module-dependency-01.module-b.ts");
    }
}
