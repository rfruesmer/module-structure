import {Product} from "../shared/product";
import {Customer} from "../shared/customer";

export class Order {
    private _id: string;
    private _date: Date;
    private _customer: Customer;
    private _products: Array<Product> = [];

    constructor(id: string, date: Date, customer: Customer) {
        this._id = id;
        this._customer = customer;
        this._date = date;
    }

    get id(): string {
        return this._id;
    }

    get customer(): Customer {
        return this._customer;
    }

    get date(): Date {
        return this._date;
    }

    get products(): Array<Product> {
        return this._products;
    }

    public addProduct(product: Product) {
        this._products.push(product);
    }
}
