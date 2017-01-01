import {StructureViewObjectListener} from "./structure-view-object-listener";


export class StructureViewObject {
    listeners: Array<StructureViewObjectListener> = [];

    public addListener(listener: StructureViewObjectListener): void {
        if (this.listeners.indexOf(listener) === -1) {
            this.listeners.push(listener);
        }
    }

    protected notifyCollapsed(target: StructureViewObject): void {
        for (let listener of this.listeners) {
            listener.onCollapsed(target);
        }
    }

    protected notifyExpanded(target: StructureViewObject): void {
        for (let listener of this.listeners) {
            listener.onExpanded(target);
        }
    }

    protected notifySizeChanged(): void {
        for (let listener of this.listeners) {
            listener.onSizeChanged(this);
        }
    }
}
