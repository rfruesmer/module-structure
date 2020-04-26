const describe = require("mocha").describe;
const it = require("mocha").it;
const join = require("path").join;
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
const expectFeedbackCountToEqual = util.expectFeedbackCountToEqual;
const expectContainsFeedback = util.expectContainsFeedback;


describe("a-and-d-over-b-and-c", function() {

    const projectRoot = join(__dirname, "../../../");

    const tests = [
        {rootDir: join(projectRoot, "test/resources/es6/a-and-d-over-b-and-c"), moduleType: "es6", extension: ".js"},
        {rootDir: join(projectRoot, "test/resources/ts/a-and-d-over-b-and-c"), moduleType: "ts", extension: ".ts"}
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

            it("root contains four rows", function() {
                expectRootRowCountToEqual(test.viewModel, 4);
            });

            it("package-a is in row one", function() {
                const row = test.viewModel.root.rows[0];
                expectRowNodesCountToEqual(row, 1);
                expectRowContainsPackage(row, "a-and-d-over-b-and-c.package-a", "package-a");
            });

            it("package-c is in row two", function() {
                const row = test.viewModel.root.rows[1];
                expectRowNodesCountToEqual(row, 1);
                expectRowContainsPackage(row, "a-and-d-over-b-and-c.package-c", "package-c");
            });

            it("package-d is in row three", function() {
                const row = test.viewModel.root.rows[2];
                expectRowNodesCountToEqual(row, 1);
                expectRowContainsPackage(row, "a-and-d-over-b-and-c.package-d", "package-d");
            });

            it("package-b is in row four", function() {
                const row = test.viewModel.root.rows[3];
                expectRowNodesCountToEqual(row, 1);
                expectRowContainsPackage(row, "a-and-d-over-b-and-c.package-b", "package-b");
            });

            it("package-a should contain module-a", function() {
                expectPackageContainsSingleModule(test.viewModel, "a-and-d-over-b-and-c.package-a", 0, "module-a" + test.extension);
            });

            it("package-d should contain module-d", function() {
                expectPackageContainsSingleModule(test.viewModel, "a-and-d-over-b-and-c.package-d", 2, "module-d" + test.extension);
            });

            it("package-b should contain module-b", function() {
                expectPackageContainsSingleModule(test.viewModel, "a-and-d-over-b-and-c.package-b", 3, "module-b" + test.extension);
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

            it("contains no feedbacks", function() {
                expectFeedbackCountToEqual(test.viewModel, 0);
            });
        });
    });
});
