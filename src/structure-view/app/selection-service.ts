import {StructureViewNode} from "./structure-view-node";


export class SelectionService {
    private selection: Array<StructureViewNode> = [];


    public setSelection(selection: Array<StructureViewNode>): void {
        if (this.selection === selection) {
            return;
        }

        this.selection = selection ? selection : [];
    }

    public getSelection(): Array<StructureViewNode> {
        return this.selection.slice();
    }

    public addToSelection(node: StructureViewNode): void {
        if (this.selection.indexOf(node) === -1) {
            this.selection.push(node);
        }
    }

    public removeFromSelection(node: StructureViewNode): void {
        let index = this.selection.indexOf(node);
        if (index === -1) {
            return;
        }

        this.selection.splice(index, 1);
    }
}
