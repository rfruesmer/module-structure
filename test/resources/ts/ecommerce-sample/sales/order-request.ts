import {Customer} from "../shared/customer";
import {Product} from "../shared/product";


export class OrderRequest {
    private _customer: Customer;
    private _products: Array<Product> = [];

    constructor(customer: Customer) {
        this._customer = customer;
    }

    get customer(): Customer {
        return this._customer;
    }
    get products(): Array<Product> {
        return this._products;
    }

    public addProduct(product: Product) {
        this._products.push(product);
    }
}
