export class Product {
    private _color: string;
    private _size: string;
    private _price: number;

    constructor(color: string, size: string, price: number) {
        this._color = color;
        this._size = size;
        this._price = price;
    }

    get color(): string {
        return this._color;
    }

    get size(): string {
        return this._size;
    }

    get price(): number {
        return this._price;
    }
}
