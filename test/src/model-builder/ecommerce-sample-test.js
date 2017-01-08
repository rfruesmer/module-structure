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
const expectRowContainsModule = util.expectRowContainsModule;
const expectNodeRowsCountToEqual = util.expectNodeRowsCountToEqual;
const findNode = util.findNode;


describe("ecommerce-sample", function() {

    const tests = [
        {rootDir: "test/resources/es6/ecommerce-sample", moduleType: "es6", extension: ".js"},
        {rootDir: "test/resources/ts/ecommerce-sample", moduleType: "ts", extension: ".ts"}
    ];

    tests.forEach(test => {
        test.viewModel = buildViewModelFor(test.rootDir, test.moduleType);
    });

    tests.forEach(function(test) {
        describe(test.moduleType, function() {
            it("contains root", function() {
                expectRootIsPresent(test.viewModel);
            });

            it("root is valid", function() {
                expectPackageNodeToEqual(test.viewModel.root, "ecommerce-sample", "ecommerce-sample");
            });

            it("root contains four rows", function() {
                expectRootRowCountToEqual(test.viewModel, 4);
            });

            it("app, billing and shopping should be in first row", function() {
                const row = test.viewModel.root.rows[0];
                expectRowNodesCountToEqual(row, 3);
                expectRowContainsPackage(row, "ecommerce-sample.app", "app");
                expectRowContainsPackage(row, "ecommerce-sample.billing", "billing");
                expectRowContainsPackage(row, "ecommerce-sample.shopping", "shopping");
            });

            it("shipping should be in second row", function() {
                const row = test.viewModel.root.rows[1];
                expectRowNodesCountToEqual(row, 1);
                expectRowContainsPackage(row, "ecommerce-sample.shipping", "shipping");
            });

            it("sales should be in third row", function() {
                const row = test.viewModel.root.rows[2];
                expectRowNodesCountToEqual(row, 1);
                expectRowContainsPackage(row, "ecommerce-sample.sales", "sales");
            });

            it("shared should be in fourth row", function() {
                const row = test.viewModel.root.rows[3];
                expectRowNodesCountToEqual(row, 1);
                expectRowContainsPackage(row, "ecommerce-sample.shared", "shared");
            });

            it("app contains application-service module", function() {
                expectPackageContainsSingleModule(test.viewModel, "ecommerce-sample.app", 0, "application-service" + test.extension);
            });

            it("billing contains bill-, billing-sevice- and payment-status modules", function() {
                let row = test.viewModel.root.rows[0];
                const billingPackage = findNode("ecommerce-sample.billing", row);
                expectNodeRowsCountToEqual(billingPackage, 2);

                row = billingPackage.rows[0];
                expectRowContainsModule(row, "ecommerce-sample.billing.billing-service" + test.extension, "billing-service" + test.extension);
                expectRowContainsModule(row, "ecommerce-sample.billing.payment-status" + test.extension, "payment-status" + test.extension);

                row = billingPackage.rows[1];
                expectRowContainsModule(row, "ecommerce-sample.billing.bill" + test.extension, "bill" + test.extension);
            });

            it("shopping contains basket module", function() {
                expectPackageContainsSingleModule(test.viewModel, "ecommerce-sample.shopping", 0, "basket" + test.extension);
            });

            it("shipping contains shipping-service and shipping modules", function() {
                let row = test.viewModel.root.rows[1];
                const shippingPackage = findNode("ecommerce-sample.shipping", row);
                expectNodeRowsCountToEqual(shippingPackage, 1);

                row = shippingPackage.rows[0];
                expectRowContainsModule(row, "ecommerce-sample.shipping.shipping-service" + test.extension, "shipping-service" + test.extension);
                expectRowContainsModule(row, "ecommerce-sample.shipping.shipping" + test.extension, "shipping" + test.extension);
            });

            it("sales contains sales-service, order-request and order modules", function() {
                let row = test.viewModel.root.rows[2];
                const shippingPackage = findNode("ecommerce-sample.sales", row);
                expectNodeRowsCountToEqual(shippingPackage, 2);

                row = shippingPackage.rows[0];
                expectRowNodesCountToEqual(row, 1);
                expectRowContainsModule(row, "ecommerce-sample.sales.sales-service" + test.extension, "sales-service" + test.extension);

                row = shippingPackage.rows[1];
                expectRowNodesCountToEqual(row, 2);
                expectRowContainsModule(row, "ecommerce-sample.sales.order-request" + test.extension, "order-request" + test.extension);
                expectRowContainsModule(row, "ecommerce-sample.sales.order" + test.extension, "order" + test.extension);
            });

            it("shared contains customer-repository, customer and product modules", function() {
                let row = test.viewModel.root.rows[3];
                const sharedPackage = findNode("ecommerce-sample.shared", row);
                expectNodeRowsCountToEqual(sharedPackage, 2);

                row = sharedPackage.rows[0];
                expectRowNodesCountToEqual(row, 2);
                expectRowContainsModule(row, "ecommerce-sample.shared.customer-repository" + test.extension, "customer-repository" + test.extension);
                expectRowContainsModule(row, "ecommerce-sample.shared.product" + test.extension, "product" + test.extension);

                row = sharedPackage.rows[1];
                expectRowNodesCountToEqual(row, 1);
                expectRowContainsModule(row, "ecommerce-sample.shared.customer" + test.extension, "customer" + test.extension);
            });

            it("contains 19 dependencies", function() {
                expectDependencyCountToEqual(test.viewModel, 19);
            });

            it("contains dependency from application-service to sales-service", function() {
                expectContainsDependency(test.viewModel, "ecommerce-sample.app.application-service" + test.extension,
                    "ecommerce-sample.sales.sales-service" + test.extension);
            });

            it("contains dependency from application-service to order-request", function() {
                expectContainsDependency(test.viewModel, "ecommerce-sample.app.application-service" + test.extension,
                    "ecommerce-sample.sales.order-request" + test.extension);
            });

            it("contains dependency from application-service to customer-repository", function() {
                expectContainsDependency(test.viewModel, "ecommerce-sample.app.application-service" + test.extension,
                    "ecommerce-sample.shared.customer-repository" + test.extension);
            });

            it("contains dependency from application-service to product", function() {
                expectContainsDependency(test.viewModel, "ecommerce-sample.app.application-service" + test.extension,
                    "ecommerce-sample.shared.product" + test.extension);
            });

            it("contains dependency from billing-service to shipping-service", function() {
                expectContainsDependency(test.viewModel, "ecommerce-sample.billing.billing-service" + test.extension,
                    "ecommerce-sample.shipping.shipping-service" + test.extension);
            });

            it("contains dependency from billing-service to order", function() {
                expectContainsDependency(test.viewModel, "ecommerce-sample.billing.billing-service" + test.extension,
                    "ecommerce-sample.sales.order" + test.extension);
            });

            it("contains dependency from billing-service to bill", function() {
                expectContainsDependency(test.viewModel, "ecommerce-sample.billing.billing-service" + test.extension,
                    "ecommerce-sample.billing.bill" + test.extension);
            });

            it("contains dependency from bill to order", function() {
                expectContainsDependency(test.viewModel, "ecommerce-sample.billing.bill" + test.extension,
                    "ecommerce-sample.sales.order" + test.extension);
            });

            it("contains dependency from basket to product", function() {
                expectContainsDependency(test.viewModel, "ecommerce-sample.shopping.basket" + test.extension,
                    "ecommerce-sample.shared.product" + test.extension);
            });

            it("contains dependency from shipping-service to order", function() {
                expectContainsDependency(test.viewModel, "ecommerce-sample.shipping.shipping-service" + test.extension,
                    "ecommerce-sample.sales.order" + test.extension);
            });

            it("contains dependency from shipping to order", function() {
                expectContainsDependency(test.viewModel, "ecommerce-sample.shipping.shipping" + test.extension,
                    "ecommerce-sample.sales.order" + test.extension);
            });

            it("contains dependency from sales-service to billing-service", function() {
                expectContainsDependency(test.viewModel, "ecommerce-sample.sales.sales-service" + test.extension,
                    "ecommerce-sample.billing.billing-service" + test.extension);
            });

            it("contains dependency from sales-service to order-request", function() {
                expectContainsDependency(test.viewModel, "ecommerce-sample.sales.sales-service" + test.extension,
                    "ecommerce-sample.sales.order-request" + test.extension);
            });

            it("contains dependency from sales-service to order", function() {
                expectContainsDependency(test.viewModel, "ecommerce-sample.sales.sales-service" + test.extension,
                    "ecommerce-sample.sales.order" + test.extension);
            });

            it("contains dependency from order-request to customer", function() {
                expectContainsDependency(test.viewModel, "ecommerce-sample.sales.order-request" + test.extension,
                    "ecommerce-sample.shared.customer" + test.extension);
            });

            it("contains dependency from order-request to product", function() {
                expectContainsDependency(test.viewModel, "ecommerce-sample.sales.order-request" + test.extension,
                    "ecommerce-sample.shared.product" + test.extension);
            });

            it("contains dependency from order to customer", function() {
                expectContainsDependency(test.viewModel, "ecommerce-sample.sales.order" + test.extension,
                    "ecommerce-sample.shared.customer" + test.extension);
            });

            it("contains dependency from order to product", function() {
                expectContainsDependency(test.viewModel, "ecommerce-sample.sales.order" + test.extension,
                    "ecommerce-sample.shared.product" + test.extension);
            });

            it("contains dependency from customer-repository to customer", function() {
                expectContainsDependency(test.viewModel, "ecommerce-sample.shared.customer-repository" + test.extension,
                    "ecommerce-sample.shared.customer" + test.extension);
            });
        });
    });
});
