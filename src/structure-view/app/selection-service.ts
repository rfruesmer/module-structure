import {StructureViewObject} from "./structure-view-object";
import {SelectionListener} from "./selection-listener";
import {StructureViewNode} from "./structure-view-node";


export class SelectionService {
    static selection: StructureViewObject;
    static selectionListeners: Array<SelectionListener> = [];

    public static addListener(listener: SelectionListener): void {
        if (this.selectionListeners.indexOf(listener) === -1) {
            this.selectionListeners.push(listener);
        }
    }

    public static setSelection(selection: StructureViewNode): void {
        if (SelectionService.selection === selection) {
            return;
        }

        SelectionService.selection = selection;

        for (let listener of SelectionService.selectionListeners) {
            listener.onSelectionChanged(selection);
        }
    }
}
