import {StructureViewNode} from "./structure-view-node";

export interface SelectionListener {
    onSelectionChanged(selection: StructureViewNode): void;
}
