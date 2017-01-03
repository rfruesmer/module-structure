import {Order} from "../sales/order";
import {ShippingService} from "../shipping/shipping-service";
import {Bill} from "./bill";

export class BillingService {
    private shippingService: ShippingService = new ShippingService();

    public processPaymentFor(order: Order): Bill {
        console.log(order.customer.fullname);

        // payment accepted....

        this.shippingService.arrangeShippingFor(order);
        return new Bill(order);
    }
}
