import {Order} from "../sales/order";
import {ShippingService} from "../shipping/shipping-service";

export class BillingService {
    private shippingService: ShippingService = new ShippingService();

    public processPaymentFor(order: Order): boolean {
        // payment accepted....

        return this.shippingService.arrangeShippingFor(order);
    }
}
