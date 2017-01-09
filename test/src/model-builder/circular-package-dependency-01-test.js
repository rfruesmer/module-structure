const describe = require("mocha").describe;
const it = require("mocha").it;

const util = require("./model-builder-test-util");
const buildViewModelFor = util.buildViewModelFor;
const expectRootIsPresent = util.expectRootIsPresent;
const expectPackageNodeToEqual = util.expectPackageNodeToEqual;
const expectRootRowCountToEqual = util.expectRootRowCountToEqual;
const expectRowNodesCountToEqual = util.expectRowNodesCountToEqual;
const expectRowContainsPackage = util.expectRowContainsPackage;
const expectDependencyCountToEqual = util.expectDependencyCountToEqual;
const expectContainsDependency = util.expectContainsDependency;
const expectPackageContainsSingleModule = util.expectPackageContainsSingleModule;


describe("circular-package-dependency-01", function() {

    const tests = [
        {rootDir: "test/resources/es6/circular-package-dependency-01", moduleType: "es6", extension: ".js"},
        {rootDir: "test/resources/ts/circular-package-dependency-01", moduleType: "ts", extension: ".ts"}
    ];

    tests.forEach(test => {
        test.viewModel = buildViewModelFor(test.rootDir);
    });

    tests.forEach(function(test) {
        describe(test.moduleType, function() {
            it("contains root", function() {
                expectRootIsPresent(test.viewModel);
            });

            it("root is valid", function() {
                expectPackageNodeToEqual(test.viewModel.root, "circular-package-dependency-01", "circular-package-dependency-01");
            });

            it("root contains four rows", function() {
                expectRootRowCountToEqual(test.viewModel, 4);
            });

            it("package-a and package-b should be in first row", function() {
                const row = test.viewModel.root.rows[0];

                expectRowNodesCountToEqual(row, 2);
                expectRowContainsPackage(row, "circular-package-dependency-01.package-a", "package-a");
                expectRowContainsPackage(row, "circular-package-dependency-01.package-b", "package-b");
            });

            it("package-e should be in second row", function() {
                const row = test.viewModel.root.rows[1];

                expectRowNodesCountToEqual(row, 1);
                expectRowContainsPackage(row, "circular-package-dependency-01.package-e", "package-e");
            });

            it("package-c should be in third row", function() {
                const row = test.viewModel.root.rows[2];

                expectRowNodesCountToEqual(row, 1);
                expectRowContainsPackage(row, "circular-package-dependency-01.package-c", "package-c");
            });

            it("package-d should be in fourth row", function() {
                const row = test.viewModel.root.rows[3];

                expectRowNodesCountToEqual(row, 1);
                expectRowContainsPackage(row, "circular-package-dependency-01.package-d", "package-d");
            });

            it("package-a contains module-a", function() {
                expectPackageContainsSingleModule(test.viewModel, "circular-package-dependency-01.package-a", 0, "module-a" + test.extension);
            });

            it("package-b contains module-b", function() {
                expectPackageContainsSingleModule(test.viewModel, "circular-package-dependency-01.package-b", 0, "module-b" + test.extension);
            });

            it("package-c contains module-c", function() {
                expectPackageContainsSingleModule(test.viewModel, "circular-package-dependency-01.package-c", 2, "module-c" + test.extension);
            });

            it("package-d contains module-d", function() {
                expectPackageContainsSingleModule(test.viewModel, "circular-package-dependency-01.package-d", 3, "module-d" + test.extension);
            });

            it("package-e contains module-e", function() {
                expectPackageContainsSingleModule(test.viewModel, "circular-package-dependency-01.package-e", 1, "module-e" + test.extension);
            });

            it("contains six dependencies", function() {
                expectDependencyCountToEqual(test.viewModel, 6);
            });

            it("contains dependency from module-a to module-c", function() {
                expectContainsDependency(test.viewModel, "circular-package-dependency-01.package-a.module-a" + test.extension,
                    "circular-package-dependency-01.package-c.module-c" + test.extension);
            });

            it("contains dependency from module-b to module-e", function() {
                expectContainsDependency(test.viewModel, "circular-package-dependency-01.package-b.module-b" + test.extension,
                    "circular-package-dependency-01.package-e.module-e" + test.extension);
            });

            it("contains dependency from module-b to module-c", function() {
                expectContainsDependency(test.viewModel, "circular-package-dependency-01.package-b.module-b" + test.extension,
                    "circular-package-dependency-01.package-c.module-c" + test.extension);
            });

            it("contains dependency from module-e to module-c", function() {
                expectContainsDependency(test.viewModel, "circular-package-dependency-01.package-e.module-e" + test.extension,
                    "circular-package-dependency-01.package-c.module-c" + test.extension);
            });

            it("contains dependency from module-c to module-e", function() {
                expectContainsDependency(test.viewModel, "circular-package-dependency-01.package-c.module-c" + test.extension,
                    "circular-package-dependency-01.package-e.module-e" + test.extension);
            });

            it("contains dependency from module-c to module-d", function() {
                expectContainsDependency(test.viewModel, "circular-package-dependency-01.package-c.module-c" + test.extension,
                    "circular-package-dependency-01.package-d.module-d" + test.extension);
            });
        });
    });
});
