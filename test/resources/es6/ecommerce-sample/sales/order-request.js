import { Customer } from "../shared/customer";
import { Product } from "../shared/product";
export class OrderRequest {
    constructor(customer) {
        this._products = [];
        this._customer = customer;
    }
    get customer() {
        return this._customer;
    }
    get products() {
        return this._products;
    }
    addProduct(product) {
        this._products.push(product);
    }
}
