
export class PaymentStatus {
    private _succeeded: boolean;

    constructor(succeeded: boolean) {
        this._succeeded = succeeded;
    }

    get isSucceeded(): boolean {
        return this._succeeded;
    }
}
