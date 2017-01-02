import { Customer } from "../shared/customer";
import { Product } from "../shared/product";
export class Order {
    constructor(id, date, customer) {
        this._products = [];
        this._id = id;
        this._customer = customer;
        this._date = date;
    }
    get id() {
        return this._id;
    }
    get customer() {
        return this._customer;
    }
    get date() {
        return this._date;
    }
    get products() {
        return this._products;
    }
    addProduct(product) {
        this._products.push(product);
    }
}
