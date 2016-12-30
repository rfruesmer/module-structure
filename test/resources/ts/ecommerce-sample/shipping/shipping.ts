import {Order} from "../sales/order";

export class Shipping {
    private order: Order;

    constructor(order: Order) {
        this.order = order;
    }
}
