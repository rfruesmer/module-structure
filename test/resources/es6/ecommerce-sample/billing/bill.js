import { Order } from "../sales/order";
export class Bill {
    constructor(order) {
        this._order = order;
        this._sum = order.calcSum();
    }
    get sum() {
        return this._sum;
    }
}
