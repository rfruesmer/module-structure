export class Customer {
    constructor(id, fullname) {
        this._id = id;
        this._fullname = fullname;
    }
    get id() {
        return this._id;
    }
    get fullname() {
        return this._fullname;
    }
}
