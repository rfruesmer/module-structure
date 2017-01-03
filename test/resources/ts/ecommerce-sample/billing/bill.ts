import {Order} from "../sales/order";


export class Bill {
    private _order: Order;
    private _sum: number;

    constructor(order: Order) {
        this._order = order;
        this._sum = order.calcSum();
    }

    get sum(): number {
        return this._sum;
    }
}
