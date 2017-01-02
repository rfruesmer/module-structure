import { ShippingService } from "../shipping/shipping-service";
import { Order } from "../sales/order";
export class BillingService {
    constructor() {
        this.shippingService = new ShippingService();
    }
    processPaymentFor(order) {
        return this.shippingService.arrangeShippingFor(order);
    }
}
