import {suite, test} from "mocha-typescript";
import {ModuleStructureIntegrationTest} from "./module-structure-integration-test";


@suite class CircularPackageDependency01Test extends ModuleStructureIntegrationTest {

    before() {
        this.buildViewModelFor("test/resources/ts/circular-package-dependency-01");
    }

    @test "contains root"() {
        this.expectRootIsPresent();
    }

    @test "root is valid"() {
        this.expectPackageNodeToEqual(this.viewModel.root, "circular-package-dependency-01", "circular-package-dependency-01");
    }

    @test "root contains four rows"() {
        this.expectRootRowCountToEqual(4);
    }

    @test "package-a and package-b should be in first row"() {
        let row = this.viewModel.root.rows[0];

        this.expectRowNodesCountToEqual(row, 2);
        this.expectRowContainsPackage(row, "circular-package-dependency-01.package-a", "package-a");
        this.expectRowContainsPackage(row, "circular-package-dependency-01.package-b", "package-b");
    }

    @test "package-e should be in second row"() {
        let row = this.viewModel.root.rows[1];

        this.expectRowNodesCountToEqual(row, 1);
        this.expectRowContainsPackage(row, "circular-package-dependency-01.package-e", "package-e");
    }

    @test "package-c should be in third row"() {
        let row = this.viewModel.root.rows[2];

        this.expectRowNodesCountToEqual(row, 1);
        this.expectRowContainsPackage(row, "circular-package-dependency-01.package-c", "package-c");
    }

    @test "package-d should be in fourth row"() {
        let row = this.viewModel.root.rows[3];

        this.expectRowNodesCountToEqual(row, 1);
        this.expectRowContainsPackage(row, "circular-package-dependency-01.package-d", "package-d");
    }

    @test "package-a contains module-a"() {
        this.expectPackageContainsSingleModule("circular-package-dependency-01.package-a", 0, "module-a.ts");
    }

    @test "package-b contains module-b"() {
        this.expectPackageContainsSingleModule("circular-package-dependency-01.package-b", 0, "module-b.ts");
    }

    @test "package-c contains module-c"() {
        this.expectPackageContainsSingleModule("circular-package-dependency-01.package-c", 2, "module-c.ts");
    }

    @test "package-d contains module-d"() {
        this.expectPackageContainsSingleModule("circular-package-dependency-01.package-d", 3, "module-d.ts");
    }

    @test "package-e contains module-e"() {
        this.expectPackageContainsSingleModule("circular-package-dependency-01.package-e", 1, "module-e.ts");
    }

    @test "contains six dependencies"() {
        this.expectDependencyCountToEqual(6);
    }

    @test "contains dependency from module-a to module-c"() {
        this.expectContainsDependency("circular-package-dependency-01.package-a.module-a.ts", "circular-package-dependency-01.package-c.module-c.ts");
    }

    @test "contains dependency from module-b to module-e"() {
        this.expectContainsDependency("circular-package-dependency-01.package-b.module-b.ts", "circular-package-dependency-01.package-e.module-e.ts");
    }

    @test "contains dependency from module-b to module-c"() {
        this.expectContainsDependency("circular-package-dependency-01.package-b.module-b.ts", "circular-package-dependency-01.package-c.module-c.ts");
    }

    @test "contains dependency from module-e to module-c"() {
        this.expectContainsDependency("circular-package-dependency-01.package-e.module-e.ts", "circular-package-dependency-01.package-c.module-c.ts");
    }

    @test "contains dependency from module-c to module-e"() {
        this.expectContainsDependency("circular-package-dependency-01.package-c.module-c.ts", "circular-package-dependency-01.package-e.module-e.ts");
    }

    @test "contains dependency from module-c to module-d"() {
        this.expectContainsDependency("circular-package-dependency-01.package-c.module-c.ts", "circular-package-dependency-01.package-d.module-d.ts");
    }
}
