import {Product} from "../shared/product";

export class Basket {
    private _products: Array<Product> = [];

    public add(product: Product): void {
        this._products.push(product);
    }
}
