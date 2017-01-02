import {suite, test} from "mocha-typescript";
import {ModuleStructureIntegrationTest} from "./module-structure-integration-test";


@suite class AAndDOverBAndCTest extends ModuleStructureIntegrationTest {

    before() {
        this.buildViewModelFor("test/resources/ts/a-and-d-over-b-and-c");
    }

    @test "contains root"() {
        this.expectRootIsPresent();
    }

    @test "root is valid"() {
        this.expectPackageNodeToEqual(this.viewModel.root, "a-and-d-over-b-and-c", "a-and-d-over-b-and-c");
    }

    @test "root contains two rows"() {
        this.expectRootRowCountToEqual(2);
    }

    @test "package-a and package-d should be in first row"() {
        let row = this.viewModel.root.rows[0];

        this.expectRowNodesCountToEqual(row, 2);
        this.expectRowContainsPackage(row, "a-and-d-over-b-and-c.package-a", "package-a");
        this.expectRowContainsPackage(row, "a-and-d-over-b-and-c.package-d", "package-d");
    }

    @test "package-a should contain module-a"() {
        this.expectPackageContainsSingleModule("a-and-d-over-b-and-c.package-a", 0, "module-a.ts");
    }

    @test "package-d should contain module-d"() {
        this.expectPackageContainsSingleModule("a-and-d-over-b-and-c.package-d", 0, "module-d.ts");
    }

    @test "package-b and package-c should be in second row"() {
        let row = this.viewModel.root.rows[1];
        this.expectRowNodesCountToEqual(row, 2);
        this.expectRowContainsPackage(row, "a-and-d-over-b-and-c.package-b", "package-b");
        this.expectRowContainsPackage(row, "a-and-d-over-b-and-c.package-c", "package-c");
    }

    @test "package-b should contain module-b"() {
        this.expectPackageContainsSingleModule("a-and-d-over-b-and-c.package-b", 1, "module-b.ts");
    }

    @test "package-c should contain module-c"() {
        this.expectPackageContainsSingleModule("a-and-d-over-b-and-c.package-c", 1, "module-c.ts");
    }

    @test "contains four dependencies"() {
        this.expectDependencyCountToEqual(4);
    }

    @test "contains dependency from module-a to module-b"() {
        this.expectContainsDependency("a-and-d-over-b-and-c.package-a.module-a.ts", "a-and-d-over-b-and-c.package-b.module-b.ts");
    }

    @test "contains dependency from module-a to module-c"() {
        this.expectContainsDependency("a-and-d-over-b-and-c.package-a.module-a.ts", "a-and-d-over-b-and-c.package-c.module-c.ts");
    }

    @test "contains dependency from module-c to module-d"() {
        this.expectContainsDependency("a-and-d-over-b-and-c.package-c.module-c.ts", "a-and-d-over-b-and-c.package-d.module-d.ts");
    }

    @test "contains dependency from module-d to module-b"() {
        this.expectContainsDependency("a-and-d-over-b-and-c.package-d.module-d.ts", "a-and-d-over-b-and-c.package-b.module-b.ts");
    }
}
