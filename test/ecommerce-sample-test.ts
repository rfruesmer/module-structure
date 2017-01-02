import {suite, test} from "mocha-typescript";
import {ModuleStructureIntegrationTest} from "./module-structure-integration-test";
import {StructureViewModelNode} from "../src/structure-view-model/structure-view-model-node";

@suite class ECommerceSampleTest extends ModuleStructureIntegrationTest {

    before() {
        this.buildViewModelFor("test/resources/ts/ecommerce-sample");
    }

    @test "contains root"() {
        this.expectRootIsPresent();
    }

    @test "root is valid"() {
        this.expectPackageNodeToEqual(this.viewModel.root, "ecommerce-sample", "ecommerce-sample");
    }

    @test "root contains four rows"() {
        this.expectRootRowCountToEqual(4);
    }

    @test "app, billing and shopping should be in first row"() {
        let row = this.viewModel.root.rows[0];

        this.expectRowNodesCountToEqual(row, 3);
        this.expectRowContainsPackage(row, "ecommerce-sample.app", "app");
        this.expectRowContainsPackage(row, "ecommerce-sample.billing", "billing");
        this.expectRowContainsPackage(row, "ecommerce-sample.shopping", "shopping");
    }

    @test "shipping should be in second row"() {
        let row = this.viewModel.root.rows[1];

        this.expectRowNodesCountToEqual(row, 1);
        this.expectRowContainsPackage(row, "ecommerce-sample.shipping", "shipping");
    }

    @test "sales should be in third row"() {
        let row = this.viewModel.root.rows[2];

        this.expectRowNodesCountToEqual(row, 1);
        this.expectRowContainsPackage(row, "ecommerce-sample.sales", "sales");
    }

    @test "shared should be in fourth row"() {
        let row = this.viewModel.root.rows[3];

        this.expectRowNodesCountToEqual(row, 1);
        this.expectRowContainsPackage(row, "ecommerce-sample.shared", "shared");
    }

    @test "app contains application-service module"() {
        this.expectPackageContainsSingleModule("ecommerce-sample.app", 0, "application-service.ts");
    }

    @test "billing contains bill-, billing-sevice- and payment-status modules"() {
        let row = this.viewModel.root.rows[0];
        let billingPackage = this.findNode("ecommerce-sample.billing", row);
        this.expectNodeRowsCountToEqual(billingPackage, 1);

        row = billingPackage.rows[0];
        this.expectRowContainsModule(row, "ecommerce-sample.billing.bill.ts", "bill.ts");
        this.expectRowContainsModule(row, "ecommerce-sample.billing.billing-service.ts", "billing-service.ts");
        this.expectRowContainsModule(row, "ecommerce-sample.billing.payment-status.ts", "payment-status.ts");
    }

    @test "shopping contains basket module"() {
        this.expectPackageContainsSingleModule("ecommerce-sample.shopping", 0, "basket.ts");
    }

    @test "shipping contains shipping-service and shipping modules"() {
        let row = this.viewModel.root.rows[1];
        let shippingPackage = this.findNode("ecommerce-sample.shipping", row);
        this.expectNodeRowsCountToEqual(shippingPackage, 1);

        row = shippingPackage.rows[0];
        this.expectRowContainsModule(row, "ecommerce-sample.shipping.shipping-service.ts", "shipping-service.ts");
        this.expectRowContainsModule(row, "ecommerce-sample.shipping.shipping.ts", "shipping.ts");
    }

    @test "sales contains sales-service, order-request and order modules"() {
        let row = this.viewModel.root.rows[2];
        let shippingPackage = this.findNode("ecommerce-sample.sales", row);
        this.expectNodeRowsCountToEqual(shippingPackage, 2);

        row = shippingPackage.rows[0];
        this.expectRowNodesCountToEqual(row, 1);
        this.expectRowContainsModule(row, "ecommerce-sample.sales.sales-service.ts", "sales-service.ts");

        row = shippingPackage.rows[1];
        this.expectRowNodesCountToEqual(row, 2);
        this.expectRowContainsModule(row, "ecommerce-sample.sales.order-request.ts", "order-request.ts");
        this.expectRowContainsModule(row, "ecommerce-sample.sales.order.ts", "order.ts");
    }

    @test "shared contains customer and product modules"() {
        let row = this.viewModel.root.rows[3];
        let sharedPackage = this.findNode("ecommerce-sample.shared", row);
        this.expectNodeRowsCountToEqual(sharedPackage, 1);

        row = sharedPackage.rows[0];
        this.expectRowNodesCountToEqual(row, 2);
        this.expectRowContainsModule(row, "ecommerce-sample.shared.customer.ts", "customer.ts");
        this.expectRowContainsModule(row, "ecommerce-sample.shared.product.ts", "product.ts");
    }

    @test "contains 15 dependencies"() {
        this.expectDependencyCountToEqual(15);
    }

    @test "contains dependency from application-service to sales-service"() {
        this.expectContainsDependency("ecommerce-sample.app.application-service.ts", "ecommerce-sample.sales.sales-service.ts");
    }

    @test "contains dependency from application-service to order-request"() {
        this.expectContainsDependency("ecommerce-sample.app.application-service.ts", "ecommerce-sample.sales.order-request.ts");
    }

    @test "contains dependency from bill to order"() {
        this.expectContainsDependency("ecommerce-sample.billing.bill.ts", "ecommerce-sample.sales.order.ts");
    }

    @test "contains dependency from billing-service to shipping-service"() {
        this.expectContainsDependency("ecommerce-sample.billing.billing-service.ts", "ecommerce-sample.shipping.shipping-service.ts");
    }

    @test "contains dependency from billing-service to order"() {
        this.expectContainsDependency("ecommerce-sample.billing.billing-service.ts", "ecommerce-sample.sales.order.ts");
    }

    @test "contains dependency from basket to product"() {
        this.expectContainsDependency("ecommerce-sample.shopping.basket.ts", "ecommerce-sample.shared.product.ts");
    }

    @test "contains dependency from shipping-service to order"() {
        this.expectContainsDependency("ecommerce-sample.shipping.shipping-service.ts", "ecommerce-sample.sales.order.ts");
    }

    @test "contains dependency from shipping to order"() {
        this.expectContainsDependency("ecommerce-sample.shipping.shipping.ts", "ecommerce-sample.sales.order.ts");
    }

    @test "contains dependency from sales-service to billing-service"() {
        this.expectContainsDependency("ecommerce-sample.sales.sales-service.ts", "ecommerce-sample.billing.billing-service.ts");
    }

    @test "contains dependency from sales-service to order-request"() {
        this.expectContainsDependency("ecommerce-sample.sales.sales-service.ts", "ecommerce-sample.sales.order-request.ts");
    }

    @test "contains dependency from sales-service to order"() {
        this.expectContainsDependency("ecommerce-sample.sales.sales-service.ts", "ecommerce-sample.sales.order.ts");
    }

    @test "contains dependency from order-request to customer"() {
        this.expectContainsDependency("ecommerce-sample.sales.order-request.ts", "ecommerce-sample.shared.customer.ts");
    }

    @test "contains dependency from order-request to product"() {
        this.expectContainsDependency("ecommerce-sample.sales.order-request.ts", "ecommerce-sample.shared.product.ts");
    }

    @test "contains dependency from order to customer"() {
        this.expectContainsDependency("ecommerce-sample.sales.order.ts", "ecommerce-sample.shared.customer.ts");
    }

    @test "contains dependency from order to product"() {
        this.expectContainsDependency("ecommerce-sample.sales.order.ts", "ecommerce-sample.shared.product.ts");
    }
}
