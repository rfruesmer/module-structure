import {Order} from "../sales/order";

export class Bill {
    private _order: Order;

    constructor(order: Order) {
        this._order = order;
    }
}
