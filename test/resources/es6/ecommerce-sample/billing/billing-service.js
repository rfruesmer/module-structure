import { ShippingService } from "../shipping/shipping-service";
import { Bill } from "./bill";
import { Order } from "../sales/order";
export class BillingService {
    constructor() {
        this.shippingService = new ShippingService();
    }
    processPaymentFor(order) {
        console.log(order.customer.fullname);
        this.shippingService.arrangeShippingFor(order);
        return new Bill(order);
    }
}
