const describe = require("mocha").describe;
const it = require("mocha").it;

const util = require("./model-builder-test-util");
const buildViewModelFor = util.buildViewModelFor;
const expectRootIsPresent = util.expectRootIsPresent;
const expectPackageNodeToEqual = util.expectPackageNodeToEqual;
const expectRootRowCountToEqual = util.expectRootRowCountToEqual;
const expectRowNodesCountToEqual = util.expectRowNodesCountToEqual;
const expectRowContainsModule = util.expectRowContainsModule;
const expectDependencyCountToEqual = util.expectDependencyCountToEqual;
const expectContainsDependency = util.expectContainsDependency;


describe("circular-module-dependency-01", function() {

    const tests = [
        {rootDir: "test/resources/es6/circular-module-dependency-01", moduleType: "es6", extension: ".js"},
        {rootDir: "test/resources/ts/circular-module-dependency-01", moduleType: "ts", extension: ".ts"}
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
                expectPackageNodeToEqual(test.viewModel.root, "circular-module-dependency-01", "circular-module-dependency-01");
            });

            it("root contains two rows", function() {
                expectRootRowCountToEqual(test.viewModel, 2);
            });

            it("module-a and module-c should be in first row", function() {
                const row = test.viewModel.root.rows[0];

                expectRowNodesCountToEqual(row, 2);
                expectRowContainsModule(row, "circular-module-dependency-01.module-a" + test.extension, "module-a" + test.extension);
                expectRowContainsModule(row, "circular-module-dependency-01.module-c" + test.extension, "module-c" + test.extension);
            });

            it("module-b should be in second row", function() {
                const row = test.viewModel.root.rows[1];

                expectRowNodesCountToEqual(row, 1);
                expectRowContainsModule(row, "circular-module-dependency-01.module-b" + test.extension, "module-b" + test.extension);
            });

            it("contains three dependencies", function() {
                expectDependencyCountToEqual(test.viewModel, 3);
            });

            it("contains dependency from module-a to module-b", function() {
                expectContainsDependency(test.viewModel, "circular-module-dependency-01.module-a" + test.extension,
                    "circular-module-dependency-01.module-b" + test.extension);
            });

            it("contains dependency from module-b to module-c", function() {
                expectContainsDependency(test.viewModel, "circular-module-dependency-01.module-b" + test.extension,
                    "circular-module-dependency-01.module-c" + test.extension);
            });

            it("contains dependency from module-c to module-b", function() {
                expectContainsDependency(test.viewModel, "circular-module-dependency-01.module-c" + test.extension,
                    "circular-module-dependency-01.module-b" + test.extension);
            });
        });
    });
});
