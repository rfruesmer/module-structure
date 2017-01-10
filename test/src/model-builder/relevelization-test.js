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
const expectFeedbackCountToEqual = util.expectFeedbackCountToEqual;


describe("relevelization", function() {

    const tests = [
        {rootDir: "test/resources/es6/relevelization", moduleType: "es6", extension: ".js"},
        {rootDir: "test/resources/ts/relevelization", moduleType: "ts", extension: ".ts"}
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
                expectPackageNodeToEqual(test.viewModel.root, "relevelization", "relevelization");
            });

            it("root contains three rows", function () {
                expectRootRowCountToEqual(test.viewModel, 3);
            });

            it("first row contains application and configuration packages", function () {
                const row = test.viewModel.root.rows[0];
                expectRowNodesCountToEqual(row, 2);
                expectRowContainsPackage(row, "relevelization.application", "application");
                expectRowContainsPackage(row, "relevelization.configuration", "configuration");
            });

            it("application package contains application module", function () {
                expectPackageContainsSingleModule(test.viewModel, "relevelization.application", 0, "application" + test.extension);
            });

            it("configuration package contains configuration module", function () {
                expectPackageContainsSingleModule(test.viewModel, "relevelization.configuration", 0, "configuration" + test.extension);
            });

            it("second row contains project package ", function () {
                const row = test.viewModel.root.rows[1];
                expectRowNodesCountToEqual(row, 1);
                expectRowContainsPackage(row, "relevelization.project", "project");
            });

            it("project package contains project module", function () {
                expectPackageContainsSingleModule(test.viewModel, "relevelization.project", 1, "project" + test.extension);
            });

            it("third row contains core and logging packages", function () {
                const row = test.viewModel.root.rows[2];
                expectRowNodesCountToEqual(row, 2);
                expectRowContainsPackage(row, "relevelization.core", "core");
                expectRowContainsPackage(row, "relevelization.logging", "logging");
            });

            it("core package contains parameter-container module", function () {
                expectPackageContainsSingleModule(test.viewModel, "relevelization.core", 2, "parameter-container" + test.extension);
            });

            it("logging package contains logger-context module", function () {
                expectPackageContainsSingleModule(test.viewModel, "relevelization.logging", 2, "logger-context" + test.extension);
            });

            it("contains 4 dependencies", function() {
                expectDependencyCountToEqual(test.viewModel, 4);
            });

            it("contains dependency from module application to module project", function() {
                expectContainsDependency(test.viewModel, "relevelization.application.application" + test.extension,
                    "relevelization.project.project" + test.extension);
            });

            it("contains dependency from module configuration to module parameter-container4", function() {
                expectContainsDependency(test.viewModel, "relevelization.configuration.configuration" + test.extension,
                    "relevelization.core.parameter-container" + test.extension);
            });

            it("contains dependency from module project to module parameter-container", function() {
                expectContainsDependency(test.viewModel, "relevelization.project.project" + test.extension,
                    "relevelization.core.parameter-container" + test.extension);
            });

            it("contains dependency from module project to module logger-context", function() {
                expectContainsDependency(test.viewModel, "relevelization.project.project" + test.extension,
                    "relevelization.logging.logger-context" + test.extension);
            });

            it("contains no feedbacks", function() {
                expectFeedbackCountToEqual(test.viewModel, 0);
            });
        });
    });
});
