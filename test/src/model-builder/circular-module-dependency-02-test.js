const describe = require("mocha").describe;
const it = require("mocha").it;
const join = require("path").join;
const util = require("./model-builder-test-util");
const buildViewModelFor = util.buildViewModelFor;
const expectRootIsPresent = util.expectRootIsPresent;
const expectPackageNodeToEqual = util.expectPackageNodeToEqual;
const expectRootRowCountToEqual = util.expectRootRowCountToEqual;
const expectRowNodesCountToEqual = util.expectRowNodesCountToEqual;
const expectRowContainsModule = util.expectRowContainsModule;
const expectDependencyCountToEqual = util.expectDependencyCountToEqual;
const expectContainsDependency = util.expectContainsDependency;
const expectFeedbackCountToEqual = util.expectFeedbackCountToEqual;
const expectContainsFeedback = util.expectContainsFeedback;


describe("circular-module-dependency-02", function() {

    const projectRoot = join(__dirname, "../../../");

    const tests = [
        {rootDir: join(projectRoot, "test/resources/es6/circular-module-dependency-02"), moduleType: "es6", extension: ".js"},
        {rootDir: join(projectRoot, "test/resources/ts/circular-module-dependency-02"), moduleType: "ts", extension: ".ts"}
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
                expectPackageNodeToEqual(test.viewModel.root, "circular-module-dependency-02", "circular-module-dependency-02");
            });

            it("root contains three rows", function() {
                expectRootRowCountToEqual(test.viewModel, 3);
            });

            it("module-a, module-b and module-e should be in first row", function() {
                const row = test.viewModel.root.rows[0];

                expectRowNodesCountToEqual(row, 3);
                expectRowContainsModule(row, "circular-module-dependency-02.module-a" + test.extension, "module-a" + test.extension);
                expectRowContainsModule(row, "circular-module-dependency-02.module-b" + test.extension, "module-b" + test.extension);
                expectRowContainsModule(row, "circular-module-dependency-02.module-e" + test.extension, "module-e" + test.extension);
            });

            it("module-c should be in second row", function() {
                const row = test.viewModel.root.rows[1];

                expectRowNodesCountToEqual(row, 1);
                expectRowContainsModule(row, "circular-module-dependency-02.module-c" + test.extension, "module-c" + test.extension);
            });

            it("module-d should be in third row", function() {
                const row = test.viewModel.root.rows[2];

                expectRowNodesCountToEqual(row, 1);
                expectRowContainsModule(row, "circular-module-dependency-02.module-d" + test.extension, "module-d" + test.extension);
            });

            it("contains five dependencies", function() {
                expectDependencyCountToEqual(test.viewModel, 5);
            });

            it("contains dependency from module-a to module-c", function() {
                expectContainsDependency(test.viewModel, "circular-module-dependency-02.module-a" + test.extension,
                    "circular-module-dependency-02.module-c" + test.extension);
            });

            it("contains dependency from module-b to module-c", function() {
                expectContainsDependency(test.viewModel, "circular-module-dependency-02.module-b" + test.extension,
                    "circular-module-dependency-02.module-c" + test.extension);
            });

            it("contains dependency from module-e to module-c", function() {
                expectContainsDependency(test.viewModel, "circular-module-dependency-02.module-e" + test.extension,
                    "circular-module-dependency-02.module-c" + test.extension);
            });

            it("contains dependency from module-c to module-e", function() {
                expectContainsDependency(test.viewModel, "circular-module-dependency-02.module-c" + test.extension,
                    "circular-module-dependency-02.module-e" + test.extension);
            });

            it("contains dependency from module-c to module-d", function() {
                expectContainsDependency(test.viewModel, "circular-module-dependency-02.module-c" + test.extension,
                    "circular-module-dependency-02.module-d" + test.extension);
            });

            it("contains one feedback", function() {
                expectFeedbackCountToEqual(test.viewModel, 1);
            });

            it("contains feedback from module-c to module-e", function() {
                expectContainsFeedback(test.viewModel, "circular-module-dependency-02.module-c" + test.extension,
                    "circular-module-dependency-02.module-e" + test.extension);
            });
        });
    });
});
