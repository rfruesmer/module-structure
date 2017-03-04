import {Map} from "es6-map";


export class ExtensionRegistry {
    private _registry = new Map<string, Map<string, any>>();

    public register(extensionPoint: string, id: string, extension: any): void {
        let extensionMap = this._registry[extensionPoint];
        if (!extensionMap) {
            extensionMap = new Map<string, any>();
            this._registry[extensionPoint] = extensionMap;
        }

        extensionMap[id] = extension;
    }

    public getExtensions(extensionPoint: string): Map<string, any> {
        let extensions = new Map<string, any>();
        let extensionMap = this._registry[extensionPoint];
        if (!extensionMap) {
            return extensions;
        }

        for (let key in extensionMap) {
            extensions[key] = extensionMap[key];
        }

        return extensions;
    }
}
