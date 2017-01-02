import { Order } from "./order";
import { OrderRequest } from "./order-request";
import { BillingService } from "../billing/billing-service";
export class SalesService {
    constructor() {
        this.billingService = new BillingService();
    }
    placeOrder(request) {
        const order = new Order("4711", new Date(), request.customer);
        request.products.forEach(product => order.addProduct(product));
        return this.billingService.processPaymentFor(order);
    }
}
