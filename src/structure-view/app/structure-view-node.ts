import {StructureViewObject} from "./structure-view-object";
import {StructureViewObjectListener} from "./structure-view-object-listener";
import {StructureViewRow} from "./structure-view-row";
import {Point} from "./point";
import {StructureViewModelNode} from "../../structure-view-model/structure-view-model-node";
import {StructureViewUtil} from "./structure-view-util";


export class StructureViewNode extends StructureViewObject implements StructureViewObjectListener {
    public static readonly OFFSET_X = 10;
    private static readonly DEFAULT_HEIGHT = 30;
    private static readonly PADDING_TOP = 40;
    private static readonly PADDING_BOTTOM = 30;
    private static readonly ICON_SIZE = 24;
    private static readonly ICON_PADDING = 5;
    private static readonly TEXT_PADDING = 10;

    canvas: JQuery;
    rect: JQuery<SVGElement>;
    icon: JQuery<SVGElement>;
    text: JQuery<SVGElement>;
    model: StructureViewModelNode;
    parent: StructureViewNode;
    rows: Array<StructureViewRow> = [];
    x: number = 0;
    y: number = 0;
    width: number = 0;
    height: number = 0;
    expanded: boolean = false;
    visible: boolean;
    private _selected: boolean;

    constructor(parent: StructureViewNode, model: StructureViewModelNode, canvas: JQuery) {
        super();

        this.parent = parent;
        this.model = model;
        this.canvas = canvas;

        this.createRect();
        this.createIcon();
        this.createText();
        this.updateSize();
    }

    private createRect() {
        this.rect = StructureViewUtil.createSVGElement("rect");
        this.rect.attr({
            "x": 0,
            "y": 0,
            "width": 0,
            "height": 0,
            "fill": "#5d5d5d"
        });
        this.rect.css({
            "stroke-width": 1.0
        });

        this.updateRectColors();
        this.rect.click(event => this.onClick(event));
        this.rect.dblclick(event => this.onDoubleClick(event));
        this.canvas.append(this.rect);
    }

    private updateRectColors(): void {
        this.rect.attr({
            "stroke": this._selected ? "#ddcb00" : this.model.isGroup ? "#7cbe00" : "#70B8A8"
        });
        this.rect.css({
            "fill-opacity": this.expanded ? 1.0 : 0.0,
            "stroke-opacity": this.expanded || this._selected ? 1.0 : 0.0
        });
    }

    private createIcon() {
        let iconFile = this.model.isGroup
            ? "assets/ic_folder_black_24px.svg"
            : "assets/ic_insert_drive_file_black_24px.svg";
        this.icon = StructureViewUtil.createSVGElement("image");
        this.icon.attr({
            "preserveAspectRatio": "none",
            "x": 0,
            "y": 0,
            "width": StructureViewNode.ICON_SIZE,
            "height": StructureViewNode.ICON_SIZE
        });
        this.icon.get(0).setAttributeNS("http://www.w3.org/1999/xlink", "href", iconFile);
        this.icon.click(event => this.onClick(event));
        this.icon.dblclick(event => this.onDoubleClick(event));
        this.canvas.append(this.icon);
    }

    private createText() {
        this.text = StructureViewUtil.createSVGElement("text");
        this.text.attr({
            "x": 0,
            "y": 0,
            "fill": "#bcbcbc",
        });
        this.text.css({
            "cursor": "default",
            "font-family": "Arial",
            "font-size": "12px"
        });
        this.text.text(this.model.name);
        this.text.click(event => this.onClick(event));
        this.text.dblclick(event => this.onDoubleClick(event));
        this.canvas.append(this.text);
    }

    private onClick(event: JQuery.Event): void {
        this.notifyClicked(this, event);
    }

    public set selected(selected: boolean) {
        this._selected = selected;
        this.updateRectColors();
    }

    public get selected() {
        return this._selected;
    }

    private onDoubleClick(event: JQuery.Event): void {
        this.selected = true;
        this.toggle();
        this.notifyDoubleClicked(this, event);
    }

    public toggle(): void {
        if (!this.expanded) {
            this.expand();
        }
        else {
            this.collapse();
        }
    }

    public expand(): void {
        if (!this.model.isGroup
                || this.model.rows.length === 0) {
            return;
        }

        this.expanded = true;

        this.lazyCreateRows();
        this.displayRows(true);
        this.updateSize();
        this.updateRectColors();
        this.notifyExpanded(this);
    }

    private lazyCreateRows() {
        if (this.rows.length > 0) {
            return;
        }

        for (let row of this.model.rows) {
            let viewRow = new StructureViewRow(this, row, this.canvas);
            viewRow.addListener(this);
            this.rows.push(viewRow);
        }
    }

    private displayRows(display: boolean): void {
        for (let row of this.rows) {
            row.setVisible(display);
        }
    }

    private updateSize(): void {
        this.setSize(this.calculateSize());
        this.notifySizeChanged();
    }

    private calculateSize(): Point {
        const textBox = $(this.text).get(0).getBoundingClientRect();
        const minimumWidth = 2 * StructureViewNode.ICON_PADDING + StructureViewNode.ICON_SIZE
            + textBox.width + StructureViewNode.TEXT_PADDING;
        if (!this.expanded || this.rows.length === 0) {
            return new Point(minimumWidth, StructureViewNode.DEFAULT_HEIGHT);
        }

        let width = 0;
        let height = StructureViewNode.PADDING_TOP;

        for (let i = 0; i < this.rows.length; ++i) {
            let row = this.rows[i];
            width = row.width > width ? row.width : width;
            height += row.height;
            if (i < this.rows.length - 1) {
                height += StructureViewNode.PADDING_BOTTOM;
            }
        }

        width += 2 * StructureViewNode.OFFSET_X;
        width =  width < minimumWidth ? minimumWidth : width;
        height += 10;

        return new Point(width, height);
    }

    private setSize(point: Point) {
        this.width = point.x;
        this.height = point.y;

        this.rect.attr({
            "width": this.width,
            "height": this.height
        });
    }

    private layoutRows(): void {
        let centerX = this.x + this.width / 2;
        let offsetY = this.y + StructureViewNode.PADDING_TOP;
        for (let row of this.rows) {
            let offsetX = centerX - row.width / 2;
            row.setPosition(offsetX, offsetY);
            offsetY += row.height + StructureViewNode.PADDING_BOTTOM;
        }
    }

    public collapse(): void {
        if (!this.model.isGroup
                || this.model.rows.length === 0) {
            return;
        }

        this.expanded = false;

        this.displayRows(false);
        this.updateSize();
        this.updateRectColors();
        this.notifyCollapsed(this);
    }

    public setPosition(x: number, y: number): void {
        this.x = x;
        this.y = y;

        this.rect.attr({
            "x": x,
            "y": y
        });

        this.icon.attr({
            "x": x + StructureViewNode.ICON_PADDING,
            "y": y + 3,
        });

        this.text.attr({
            "x": x + (2 * StructureViewNode.ICON_PADDING) + StructureViewNode.ICON_SIZE,
            "y": y + 19
        });

        this.layoutRows();
    }

    public setVisible(visible: boolean): void {
        if (visible === this.visible) {
            return;
        }

        for (let row of this.rows) {
            row.setVisible(this.expanded && visible);
        }

        let display = visible ? "block" : "none";
        this.rect.css({display: display});
        this.icon.css({display: display});
        this.text.css({display: display});

        this.visible = visible;
    }

    public onSizeChanged(): void {
        this.updateSize();
    }

    layout() {
        this.layoutRows();
    }

    onCollapsed(target: StructureViewObject): void {
        this.notifyCollapsed(target);
    }

    onExpanded(target: StructureViewObject): void {
        this.notifyExpanded(target);
    }

    onClicked(target: StructureViewObject, event: JQuery.Event): void {
        this.notifyClicked(target, event);
    }

    onDoubleClicked(target: StructureViewObject, event: JQuery.Event): void {
        this.notifyDoubleClicked(target, event);
    }

    isParentOf(source: StructureViewNode) {
        let parent = source.parent;
        while (parent !== null) {
            if (parent === this) {
                return true;
            }

            parent = parent.parent;
        }

        return false;
    }
}
