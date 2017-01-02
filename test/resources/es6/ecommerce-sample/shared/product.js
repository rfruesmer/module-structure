export class Product {
    constructor(color, size, price) {
        this._color = color;
        this._size = size;
        this._price = price;
    }
    get color() {
        return this._color;
    }
    get size() {
        return this._size;
    }
    get price() {
        return this._price;
    }
}
