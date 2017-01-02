import {suite, test} from "mocha-typescript";
import {expect} from "chai";
import {ModuleStructureIntegrationTest} from "./module-structure-integration-test";


@suite class AOverBAndCTest extends ModuleStructureIntegrationTest {

    before() {
        this.buildViewModelFor("test/resources/ts/a-over-b-and-c");
    }

    @test "contains root"() {
        this.expectRootIsPresent();
    }

    @test "root is valid"() {
        this.expectPackageNodeToEqual(this.viewModel.root, "a-over-b-and-c", "a-over-b-and-c");
    }

    @test "root contains two rows"() {
        this.expectRootRowCountToEqual(2);
    }

    @test "package-a should be in first row"() {
        let row = this.viewModel.root.rows[0];

        this.expectRowNodesCountToEqual(row, 1);
        this.expectRowContainsPackage(row, "a-over-b-and-c.package-a", "package-a");
    }

    @test "package-a contains module-a"() {
        this.expectPackageContainsSingleModule("a-over-b-and-c.package-a", 0, "module-a.ts");
    }

    @test "second row contains two elements"() {
        let row = this.viewModel.root.rows[1];

        this.expectRowNodesCountToEqual(row, 2);
    }

    @test "second row contains package-b"() {
        let row = this.viewModel.root.rows[1];
        this.expectRowContainsPackage(row, "a-over-b-and-c.package-b", "package-b");
    }

    @test "package-b contains module-b"() {
        this.expectPackageContainsSingleModule("a-over-b-and-c.package-b", 1, "module-b.ts");
    }

    @test "second row contains package-c"() {
        let row = this.viewModel.root.rows[1];
        this.expectRowContainsPackage(row, "a-over-b-and-c.package-c", "package-c");
    }

    @test "package-c contains module-c"() {
        this.expectPackageContainsSingleModule("a-over-b-and-c.package-c", 1, "module-c.ts");
    }

    @test "contains two dependencies"() {
        this.expectDependencyCountToEqual(2);
    }

    @test "contains dependency from module-a to module-b"() {
        this.expectContainsDependency("a-over-b-and-c.package-a.module-a.ts", "a-over-b-and-c.package-b.module-b.ts");
    }

    @test "contains dependency from module-a to module-c"() {
        this.expectContainsDependency("a-over-b-and-c.package-a.module-a.ts", "a-over-b-and-c.package-c.module-c.ts");
    }
}
