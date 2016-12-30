export class ModuleImport {
    private _types: Array<string> = [];
    private _from: string = "";

    constructor(types: Array<string>, modulePath: string) {
        this._types = types.slice();
        this._from = modulePath;
    };

    get types(): Array<string> {
        return this._types.slice();
    }

    get from(): string {
        return this._from;
    }
}
