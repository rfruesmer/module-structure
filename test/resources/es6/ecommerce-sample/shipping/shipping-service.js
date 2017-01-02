import { Order } from "../sales/order";
export class ShippingService {
    arrangeShippingFor(order) {
        console.log(order.id);
        return true;
    }
}
