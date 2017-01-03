import {Order} from "../sales/order";

export class ShippingService {

    public arrangeShippingFor(order: Order): void {
        console.log(order.customer);
    }
}
