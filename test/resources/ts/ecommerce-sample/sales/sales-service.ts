import {Order} from "./order";
import {OrderRequest} from "./order-request";
import {BillingService} from "../billing/billing-service";

export class SalesService {
    private billingService: BillingService = new BillingService();

    public placeOrder(request: OrderRequest): boolean {
        let order = new Order("4711", new Date(), request.customer);
        request.products.forEach(product => order.addProduct(product));

        return this.billingService.processPaymentFor(order);
    }
}
