export class Customer {
    private _id: string;
    private _fullname: string;

    constructor(id: string, fullname: string) {
        this._id = id;
        this._fullname = fullname;
    }

    get id(): string {
        return this._id;
    }

    get fullname(): string {
        return this._fullname;
    }
}
