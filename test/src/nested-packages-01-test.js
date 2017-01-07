const describe = require("mocha").describe;
const it = require("mocha").it;

const util = require("./api-integration-test-util");
const buildViewModelFor = util.buildViewModelFor;
const expectRootIsPresent = util.expectRootIsPresent;
const expectPackageNodeToEqual = util.expectPackageNodeToEqual;
const expectRootRowCountToEqual = util.expectRootRowCountToEqual;
const expectRowNodesCountToEqual = util.expectRowNodesCountToEqual;
const expectRowContainsPackage = util.expectRowContainsPackage;
const expectDependencyCountToEqual = util.expectDependencyCountToEqual;
const expectContainsDependency = util.expectContainsDependency;
const expectRowContainsModule = util.expectRowContainsModule;
const findNode = util.findNode;
const expectNodeRowsCountToEqual = util.expectNodeRowsCountToEqual;


describe("nested-packages-01", function() {

    const tests = [
        {rootDir: "test/resources/es6/nested-packages-01", moduleType: "es6", extension: ".js"},
        {rootDir: "test/resources/ts/nested-packages-01", moduleType: "ts", extension: ".ts"}
    ];

    tests.forEach(test => {
        test.viewModel = buildViewModelFor(test.rootDir, test.moduleType);
    });

    tests.forEach(function(test) {
        describe(test.moduleType, function() {

            it("contains root", function () {
                expectRootIsPresent(test.viewModel);
            });

            it("root is valid", function () {
                expectPackageNodeToEqual(test.viewModel.root, "nested-packages-01", "nested-packages-01");
            });

            it("root contains two rows", function () {
                expectRootRowCountToEqual(test.viewModel, 2);
            });

            it("first row contains package-b, module-one and module-zero", function () {
                const row = test.viewModel.root.rows[0];
                expectRowNodesCountToEqual(row, 3);
                expectRowContainsPackage(row, "nested-packages-01.package-b", "package-b");
                expectRowContainsModule(row, "nested-packages-01.module-one" + test.extension, "module-one" + test.extension);
                expectRowContainsModule(row, "nested-packages-01.module-zero" + test.extension, "module-zero" + test.extension);
            });

            it("package-b contains package-bb", function () {
                let row = test.viewModel.root.rows[0];
                let node = findNode("nested-packages-01.package-b", row);
                expectNodeRowsCountToEqual(node, 1);

                row = node.rows[0];
                expectRowNodesCountToEqual(row, 1);
                expectRowContainsPackage(row, "nested-packages-01.package-b.package-bb", "package-bb");
            });


            it("package-bb contains module-bb", function () {
                let row = test.viewModel.root.rows[0];
                let node = findNode("nested-packages-01.package-b", row);
                row = node.rows[0];

                node = findNode("nested-packages-01.package-b.package-bb", row);
                expectNodeRowsCountToEqual(node, 1);

                row = node.rows[0];
                expectRowNodesCountToEqual(row, 1);

                expectRowContainsModule(row, "nested-packages-01.package-b.package-bb.module-bb" + test.extension, "module-bb" + test.extension);
            });

            it("second row contains package-a", function () {
                let row = test.viewModel.root.rows[1];
                expectRowNodesCountToEqual(row, 1);

                expectRowContainsPackage(row, "nested-packages-01.package-a", "package-a");
            });

            it("package-b contains package-aa, module-a1 and module-a2", function () {
                let row = test.viewModel.root.rows[1];
                let node = findNode("nested-packages-01.package-a", row);
                expectNodeRowsCountToEqual(node, 2);

                row = node.rows[0];
                expectRowNodesCountToEqual(row, 2);
                expectRowContainsPackage(row, "nested-packages-01.package-a.package-aa", "package-aa");
                expectRowContainsModule(row, "nested-packages-01.package-a.module-a1" + test.extension, "module-a1" + test.extension);

                row = node.rows[1];
                expectRowNodesCountToEqual(row, 1);
                expectRowContainsModule(row, "nested-packages-01.package-a.module-a2" + test.extension, "module-a2" + test.extension);
            });

            it("package-bbb contains module-aaa, module-aab", function () {
                let row = test.viewModel.root.rows[1];
                let node = findNode("nested-packages-01.package-a", row);
                node = findNode("nested-packages-01.package-a.package-aa", node.rows[0]);

                row = node.rows[0];
                expectRowNodesCountToEqual(row, 2);
                expectRowContainsModule(row, "nested-packages-01.package-a.package-aa.module-aaa" + test.extension, "module-aaa" + test.extension);
                expectRowContainsModule(row, "nested-packages-01.package-a.package-aa.module-aab" + test.extension, "module-aab" + test.extension);
            });

            it("contains 7 dependencies", function() {
                expectDependencyCountToEqual(test.viewModel, 7);
            });

            it("contains dependency from module-bb to module-aaa", function() {
                expectContainsDependency(test.viewModel, "nested-packages-01.package-b.package-bb.module-bb" + test.extension,
                    "nested-packages-01.package-a.package-aa.module-aaa" + test.extension);
            });

            it("contains dependency from module-bb to module-a1", function() {
                expectContainsDependency(test.viewModel, "nested-packages-01.package-b.package-bb.module-bb" + test.extension,
                    "nested-packages-01.package-a.module-a1" + test.extension);
            });

            it("contains dependency from module-bb to module-a2", function() {
                expectContainsDependency(test.viewModel, "nested-packages-01.package-b.package-bb.module-bb" + test.extension,
                    "nested-packages-01.package-a.module-a2" + test.extension);
            });

            it("contains dependency from module-zero to module-a1", function() {
                expectContainsDependency(test.viewModel, "nested-packages-01.module-zero" + test.extension,
                    "nested-packages-01.package-a.module-a1" + test.extension);
            });

            it("contains dependency from module-aaa to module-bb", function() {
                expectContainsDependency(test.viewModel, "nested-packages-01.package-a.package-aa.module-aaa" + test.extension,
                    "nested-packages-01.package-b.package-bb.module-bb" + test.extension);
            });

            it("contains dependency from module-aab to module-bb", function() {
                expectContainsDependency(test.viewModel, "nested-packages-01.package-a.package-aa.module-aab" + test.extension,
                    "nested-packages-01.package-b.package-bb.module-bb" + test.extension);
            });

            it("contains dependency from module-aab to module-a2", function() {
                expectContainsDependency(test.viewModel, "nested-packages-01.package-a.package-aa.module-aab" + test.extension,
                    "nested-packages-01.package-a.module-a2" + test.extension);
            });
        });
    });
});
