import {StructureViewObject} from "./structure-view-object";
import {StructureViewObjectListener} from "./structure-view-object-listener";
import {StructureViewNode} from "./structure-view-node";
import {StructureViewModelNode} from "../../structure-view-model/structure-view-model-node";


export class StructureViewNodeRow extends StructureViewObject implements StructureViewObjectListener {
    nodes: Array<StructureViewNode> = [];
    x: number = 0;
    y: number = 0;
    width: number = 0;
    height: number = 0;
    visible: boolean = false;


    constructor(parent: StructureViewNode, nodes: Array<StructureViewModelNode>, paper: Snap.Paper) {
        super();

        this.createNodes(parent, nodes, paper);
        this.calculateSize();
    }

    private createNodes(parent: StructureViewNode, nodes: Array<StructureViewModelNode>, paper: Snap.Paper) {
        for (let node of nodes) {
            let viewNode = new StructureViewNode(parent, node, paper);
            viewNode.addListener(this);
            this.nodes.push(viewNode);
        }
    }

    private calculateSize() {
        this.width = 0;
        this.height = 0;

        for (let i = 0; i < this.nodes.length; ++i) {
            let node = this.nodes[i];
            this.width += node.width;
            if (i < this.nodes.length - 1) {
                this.width += StructureViewNode.OFFSET_X;
            }
            this.height = node.height > this.height ? node.height : this.height;
        }
    }

    public setPosition(x: number, y: number): void {
        this.x = x;
        this.y = y;

        let currentX = x;
        let centerY = y + this.height / 2;

        for (let node of this.nodes) {
            let currentY = centerY - node.height / 2;
            node.setPosition(currentX, currentY);
            currentX += node.width;
            currentX += StructureViewNode.OFFSET_X;
        }
    }

    setVisible(visible: boolean): void {
        if (visible === this.visible) {
            return;
        }

        for (let node of this.nodes) {
            node.setVisible(visible);
        }

        this.visible = visible;
    }

    public onSizeChanged(): void {
        this.calculateSize();
        this.notifySizeChanged();
    }

    onCollapsed(target: StructureViewObject): void {
        this.notifyCollapsed(target);
    }

    onExpanded(target: StructureViewObject): void {
        this.notifyExpanded(target);
    }
}
