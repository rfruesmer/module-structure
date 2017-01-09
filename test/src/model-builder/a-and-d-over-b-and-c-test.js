const describe = require("mocha").describe;
const it = require("mocha").it;

const util = require("./model-builder-test-util");
const buildViewModelFor = util.buildViewModelFor;
const expectRootIsPresent = util.expectRootIsPresent;
const expectPackageNodeToEqual = util.expectPackageNodeToEqual;
const expectRootRowCountToEqual = util.expectRootRowCountToEqual;
const expectRowNodesCountToEqual = util.expectRowNodesCountToEqual;
const expectRowContainsPackage = util.expectRowContainsPackage;
const expectPackageContainsSingleModule = util.expectPackageContainsSingleModule;
const expectDependencyCountToEqual = util.expectDependencyCountToEqual;
const expectContainsDependency = util.expectContainsDependency;


describe("a-and-d-over-b-and-c", function() {

    const tests = [
        {rootDir: "test/resources/es6/a-and-d-over-b-and-c", moduleType: "es6", extension: ".js"},
        {rootDir: "test/resources/ts/a-and-d-over-b-and-c", moduleType: "ts", extension: ".ts"}
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
                expectPackageNodeToEqual(test.viewModel.root, "a-and-d-over-b-and-c", "a-and-d-over-b-and-c");
            });

            it("root contains two rows", function() {
                expectRootRowCountToEqual(test.viewModel, 2);
            });

            it("package-a and package-d should be in first row", function() {
                const row = test.viewModel.root.rows[0];
                expectRowNodesCountToEqual(row, 2);
                expectRowContainsPackage(row, "a-and-d-over-b-and-c.package-a", "package-a");
                expectRowContainsPackage(row, "a-and-d-over-b-and-c.package-d", "package-d");
            });

            it("package-a should contain module-a", function() {
                expectPackageContainsSingleModule(test.viewModel, "a-and-d-over-b-and-c.package-a", 0, "module-a" + test.extension);
            });

            it("package-d should contain module-d", function() {
                expectPackageContainsSingleModule(test.viewModel, "a-and-d-over-b-and-c.package-d", 0, "module-d" + test.extension);
            });

            it("package-b and package-c should be in second row", function() {
                const row = test.viewModel.root.rows[1];
                expectRowNodesCountToEqual(row, 2);
                expectRowContainsPackage(row, "a-and-d-over-b-and-c.package-b", "package-b");
                expectRowContainsPackage(row, "a-and-d-over-b-and-c.package-c", "package-c");
            });

            it("package-b should contain module-b", function() {
                expectPackageContainsSingleModule(test.viewModel, "a-and-d-over-b-and-c.package-b", 1, "module-b" + test.extension);
            });

            it("package-c should contain module-c", function() {
                expectPackageContainsSingleModule(test.viewModel, "a-and-d-over-b-and-c.package-c", 1, "module-c" + test.extension);
            });

            it("contains four dependencies", function() {
                expectDependencyCountToEqual(test.viewModel, 4);
            });

            it("contains dependency from module-a to module-b", function() {
                expectContainsDependency(test.viewModel, "a-and-d-over-b-and-c.package-a.module-a" + test.extension,
                    "a-and-d-over-b-and-c.package-b.module-b" + test.extension);
            });

            it("contains dependency from module-a to module-c", function() {
                expectContainsDependency(test.viewModel, "a-and-d-over-b-and-c.package-a.module-a" + test.extension,
                    "a-and-d-over-b-and-c.package-c.module-c" + test.extension);
            });

            it("contains dependency from module-c to module-d", function() {
                expectContainsDependency(test.viewModel, "a-and-d-over-b-and-c.package-c.module-c" + test.extension,
                    "a-and-d-over-b-and-c.package-d.module-d" + test.extension);
            });

            it("contains dependency from module-d to module-b", function() {
                expectContainsDependency(test.viewModel, "a-and-d-over-b-and-c.package-d.module-d" + test.extension,
                    "a-and-d-over-b-and-c.package-b.module-b" + test.extension);
            });
        });
    });
});
