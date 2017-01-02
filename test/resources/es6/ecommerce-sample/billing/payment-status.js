export class PaymentStatus {
    constructor(succeeded) {
        this._succeeded = succeeded;
    }
    get isSucceeded() {
        return this._succeeded;
    }
}
