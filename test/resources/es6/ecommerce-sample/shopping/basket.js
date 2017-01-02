import { Product } from "../shared/product";
export class Basket {
    constructor() {
        this._products = [];
    }
    add(product) {
        this._products.push(product);
    }
}
