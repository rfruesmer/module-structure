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


describe("a-over-b-and-c", function() {

    const projectRoot = join(__dirname, "../../../");

    const tests = [
        {rootDir: join(projectRoot, "test/resources/es6/a-over-b-and-c"), moduleType: "es6", extension: ".js"},
        {rootDir: join(projectRoot, "test/resources/ts/a-over-b-and-c"), moduleType: "ts", extension: ".ts"}
    ];

    tests.forEach(test => {
        test.viewModel = buildViewModelFor(test.rootDir);
    });

    tests.forEach(function(test) {
        describe(test.moduleType, function() {

            it("contains root", function () {
                expectRootIsPresent(test.viewModel);
            });

            it("root is valid", function () {
                expectPackageNodeToEqual(test.viewModel.root, "a-over-b-and-c", "a-over-b-and-c");
            });

            it("root contains two rows", function () {
                expectRootRowCountToEqual(test.viewModel, 2);
            });

            it("package-a should be in first row", function () {
                const row = test.viewModel.root.rows[0];
                expectRowNodesCountToEqual(row, 1);
                expectRowContainsPackage(row, "a-over-b-and-c.package-a", "package-a");
            });

            it("package-a contains module-a", function () {
                expectPackageContainsSingleModule(test.viewModel, "a-over-b-and-c.package-a", 0, "module-a" + test.extension);
            });

            it("second row contains two elements", function () {
                const row = test.viewModel.root.rows[1];
                expectRowNodesCountToEqual(row, 2);
            });

            it("second row contains package-b", function () {
                const row = test.viewModel.root.rows[1];
                expectRowContainsPackage(row, "a-over-b-and-c.package-b", "package-b");
            });

            it("package-b contains module-b", function () {
                expectPackageContainsSingleModule(test.viewModel, "a-over-b-and-c.package-b", 1, "module-b" + test.extension);
            });

            it("second row contains package-c", function () {
                const row = test.viewModel.root.rows[1];
                expectRowContainsPackage(row, "a-over-b-and-c.package-c", "package-c");
            });

            it("package-c contains module-c", function () {
                expectPackageContainsSingleModule(test.viewModel, "a-over-b-and-c.package-c", 1, "module-c"  + test.extension);
            });

            it("contains two dependencies", function () {
                expectDependencyCountToEqual(test.viewModel, 2);
            });

            it("contains dependency from module-a to module-b", function () {
                expectContainsDependency(test.viewModel, "a-over-b-and-c.package-a.module-a" + test.extension,
                    "a-over-b-and-c.package-b.module-b" + test.extension);
            });

            it("contains dependency from module-a to module-c", function () {
                expectContainsDependency(test.viewModel, "a-over-b-and-c.package-a.module-a" + test.extension,
                    "a-over-b-and-c.package-c.module-c" + test.extension);
            });

            it("contains no feedbacks", function() {
                expectFeedbackCountToEqual(test.viewModel, 0);
            });
        });
    });
});
