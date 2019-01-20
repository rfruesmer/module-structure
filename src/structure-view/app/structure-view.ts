import {StructureViewObjectListener} from "./structure-view-object-listener";
import {SelectionService} from "./selection-service";
import {StructureViewNode} from "./structure-view-node";
import {StructureViewObject} from "./structure-view-object";
import {StructureViewModel} from "../../structure-view-model/structure-view-model";
import {Point} from "./point";
import {StructureViewUtil} from "./structure-view-util";


export class StructureView implements StructureViewObjectListener {
    private canvas: JQuery;
    private rootNode: StructureViewNode;
    private selectionService = new SelectionService();
    private dependenciesMap: any = {};
    private visibleLeafsMap: any = {};
    private arrowsMap: any = {};
    private filteredDependencies: Array<string> = [];
    private dependencyDisplayMode: DependencyDisplayMode = DependencyDisplayMode.ALL;


    public show(model: StructureViewModel) {
        this.initCanvas();
        this.createRootNode(model);
        this.resize();
        this.indexDependencies(model);
        this.subscribe();
        this.makeVisible();
    }

    private initCanvas(): void {
        this.canvas = $("#canvas");

        this.createDefs();
        this.createMarker("arrow", "#ffffff");
        this.createMarker("arrow-hover", "#7fb8ff");
        this.createMarker("arrow-feedback", "#F75F00");
    }

    private createDefs() {
        let defs = StructureViewUtil.createSVGElement("defs");
        this.canvas.append(defs);
    }

    private createMarker(id: string, color: string) {
        let marker = StructureViewUtil.createSVGElement("marker");
        marker.attr({
            "id": id,
            "markerWidth": 6,
            "markerHeight": 5,
            "refX": 0,
            "refY": 3,
            "orient": "auto",
            "markerUnits": "strokeWidth",
        });

        let path = StructureViewUtil.createSVGElement("path");
        path.attr({
            "d": "M0,1 L6,3 L0,5",
            "stroke": color,
            "stroke-width": "0.1",
            "fill": color
        });

        marker.append(path);

        this.canvas.find("defs").append(marker);
    }

    private createRootNode(model: StructureViewModel): void {
        this.rootNode = new StructureViewNode(null, model.root, this.canvas);
    }

    private resize(): void {
        this.rootNode.setPosition(1, 1);
        this.rootNode.layout();

        this.canvas.attr({
            style: this.calculateStyles(),
            width: this.rootNode.width + 2,
            height: this.rootNode.height + 2
        });
    }

    /**
     *  Workaround for correct centering while scrollbars are visible.
     */
    private calculateStyles(): string {
        let left = "";
        let top = "";
        let transform = "";

        let scrollX = this.rootNode.width > window.innerWidth;
        let scrollY = this.rootNode.height > window.innerHeight;

        if (scrollX && scrollY) {
            left = "left: 10px;";
            top = "top: 10px;";
            transform = "transform: translate(0, 0);";
        }
        else if (scrollX) {
            left = "left: 10px;";
            transform = "transform: translate(0, -50%);";
        }
        else if (scrollY) {
            top = "top: 10px;";
            transform = "transform: translate(-50%, 0);";
        }

        return left + top + transform;
    }

    private indexDependencies(model: StructureViewModel): void {
        for (let dependency of model.dependencies) {
            this.indexDependency(dependency.from, dependency.to);
        }
    }

    private indexDependency(from: string, to: string): void {
        let toArray = this.dependenciesMap[from];
        if (!toArray) {
            toArray = [];
            this.dependenciesMap[from] = toArray;
        }

        if (toArray.indexOf(to) === -1) {
            toArray.push(to);
        }

        this.getParentIds(to)
            .filter(parentId => toArray.indexOf(parentId) === -1)
            .forEach(parentId => toArray.push(parentId));

        this.getParentIds(from)
            .forEach(parentId => this.indexDependency(parentId, to));
    }

    private getParentIds(id: string): Array<string> {
        let parentIds: Array<string> = [];

        let index = id.length;
        for (let i = 0; i < 100; ++i) { // prevent endless loop
            index = id.lastIndexOf(".", index - 1);
            if (index === -1) {
                break;
            }

            let lastPart = id.substr(index);
            if (lastPart === ".ts"
                    || lastPart === ".js") {
                index = id.lastIndexOf(".", index - 1);
            }

            let parentId = id.substr(0, index);
            if (parentId === this.rootNode.model.id) {
                break;
            }

            parentIds.push(parentId);
        }

        return parentIds;
    }

    private subscribe(): void {
        this.rootNode.addListener(this);
        window.addEventListener("resize", () => this.resize());
        document.addEventListener("keydown", event => this.onKeyDown(event));
    }

    private makeVisible(): void {
        this.rootNode.setVisible(true);
        this.rootNode.expand();
    }

    onCollapsed(target: StructureViewObject): void {
        if (!(target instanceof StructureViewNode)) {
            return;
        }

        let node = target as StructureViewNode;
        this.removeVisibleLeafs(node);
        this.addVisibleLeaf(node);
        this.removeDependencyArrows();
        this.createDependencyArrowsOf(this.rootNode);
    }

    private removeVisibleLeafs(parent: StructureViewNode) {
        for (let key in this.visibleLeafsMap) {
            if (key.indexOf(parent.model.id) === 0) {
                delete this.visibleLeafsMap[key];
            }
        }
    }

    private addVisibleLeaf(node: StructureViewNode) {
        this.visibleLeafsMap[node.model.id] = node;
    }

    private removeDependencyArrows() {
        for (let key in this.arrowsMap) {
            let entries = this.arrowsMap[key] as Array<any>;
            entries.forEach(entry => {
                $(entry.path.node).off("mouseenter mouseleave");
                entry.path.remove();
            });
            delete this.arrowsMap[key];
        }
    }

    onExpanded(target: StructureViewObject): void {
        if (!(target instanceof StructureViewNode)) {
            return;
        }

        let node = target as StructureViewNode;
        this.removeVisibleLeaf(node);
        this.addVisibleLeafs(node);
        this.removeDependencyArrows();
        this.createDependencyArrowsOf(this.rootNode);
    }

    private removeVisibleLeaf(node: StructureViewNode) {
        delete this.visibleLeafsMap[node.model.id];
    }

    private addVisibleLeafs(parent: StructureViewNode): void {
        this.getVisibleLeafs(parent)
                .forEach(leaf => this.visibleLeafsMap[leaf.model.id] = leaf);
    }

    private createDependencyArrowsOf(node: StructureViewNode): void {
        let visibleLeafs = this.getVisibleLeafs(node);
        this.createDependencyArrows(visibleLeafs);
    }

    private getVisibleLeafs(node: StructureViewNode): Array<StructureViewNode> {
        if (!node || !node.expanded) {
            return [];
        }

        let visibleLeafs: Array<StructureViewNode> = [];
        node.rows.forEach(row =>
            row.nodes.forEach(node => {
                if (!node.expanded) {
                    visibleLeafs.push(node);
                }
                else {
                    visibleLeafs.push.apply(visibleLeafs, this.getVisibleLeafs(node));
                }
            }));

        return visibleLeafs;
    }

    private createDependencyArrows(visibleLeafs: Array<StructureViewNode>) {
        visibleLeafs
            .filter(leaf => this.dependenciesMap[leaf.model.id] !== undefined)
            .forEach(leaf => {
                (this.dependenciesMap[leaf.model.id] as Array<string>)
                    .map(dependency => this.visibleLeafsMap[dependency])
                    .filter(target => target !== undefined && target !== leaf)
                    .forEach(target => this.createDependencyArrow(leaf, target));
            });
    }

    private createDependencyArrow(source: StructureViewNode, target: StructureViewNode): void {
        if (this.dependencyDisplayMode === DependencyDisplayMode.SELECTED
                && this.filteredDependencies.indexOf(source.model.id) === -1
                && this.filteredDependencies.indexOf(target.model.id) === -1) {
            return;
        }

        if (this.dependencyDisplayMode === DependencyDisplayMode.BETWEEN
                && !this.filteredDependenciesInclude(source, target)) {
            return;
        }

        let entry = this.arrowsMap[source.model.id];
        if (entry && entry.target === target) {
            return;
        }

        let pathDesc = (source.y < target.y)
            ? this.createDownPathSpec(source, target)
            : this.createUpPathSpec(source, target);
        let path = this.createArrowPath(pathDesc, source, target);
        this.mapArrow(source, target, path);
    }

    private filteredDependenciesInclude(source: StructureViewNode, target: StructureViewNode) {
        if (!source.selected || !target.selected) {
            if (this.isInsideSameSelectedNode(source, target)) {
                return false;
            }
        }

        let foundSource = false;
        let foundTarget = false;

        for (let filteredDependency of this.filteredDependencies) {
            if (source.model.id.indexOf(filteredDependency) === 0) {
                foundSource = true;
            }
            if (target.model.id.indexOf(filteredDependency) === 0) {
                foundTarget = true;
            }

            if (foundSource && foundTarget) {
                return true;
            }
        }

        return false;
    }

    private isInsideSameSelectedNode(source: StructureViewNode, target: StructureViewNode): boolean {
        for (let selectedNode of this.selectionService.getSelection()) {
            if (selectedNode.isParentOf(source) && selectedNode.isParentOf(target)) {
                return true;
            }
        }

        return false;
    }

    private createDownPathSpec(source: StructureViewNode, target: StructureViewNode): any {
        let sourceCenterX = source.x + (source.width / 2);
        let sourceBottom = source.y + source.height;

        let targetTop = target.y;
        let targetCenterX = target.x + (target.width / 2);

        let distX = targetCenterX - sourceCenterX;
        let distY = target.y - sourceBottom;

        let from = new Point(sourceCenterX, sourceBottom);
        let to = new Point(targetCenterX, targetTop);

        let dir = distX > 0 ? 1 : -1;
        let offX = Math.abs(distX) > 20 ? (-10 * dir) : 40;

        let stepX;
        let stepY;

        if (Math.abs(distX) > Math.abs(distY)) {
            stepX = 1.0;
            stepY = Math.abs(distY / distX);
        }
        else {
            stepX = Math.abs(distX / distY);
            stepY = 1.0;
        }

        to.x -= 20 * stepX * dir;
        to.y -= 10 * stepY;

        let qx = sourceCenterX + offX;
        let qy = sourceBottom + distY / 2;

        let strokeColor = "#ffffff";
        let markerEnd = "url(#arrow)";

        return {from, to, qx, qy, strokeColor, markerEnd};
    }

    private createUpPathSpec(source: StructureViewNode, target: StructureViewNode): any {
        let sourceCenterX = source.x + (source.width / 2);
        let sourceTop = source.y;

        let targetBottom = target.y + target.height;
        let targetCenterX = target.x + (target.width / 2);

        let distX = targetCenterX - sourceCenterX;
        let distY = sourceTop - targetBottom;

        let from = new Point(sourceCenterX, sourceTop);
        let to = new Point(targetCenterX, targetBottom);

        let dir = distX > 0 ? 1 : -1;
        let offX = Math.abs(distX) > 20 ? (10 * dir) : 40;

        let stepX;
        let stepY;

        if (Math.abs(distX) > Math.abs(distY)) {
            stepX = 1.0;
            stepY = Math.abs(distY / distX);
        }
        else {
            stepX = Math.abs(distX / distY);
            stepY = 1.0;
        }

        from.x += 10 * stepX * dir;
        from.y -= 10 * stepY;

        to.x -= 20 * stepX * dir;
        to.y += 10 * stepY;

        let qx = sourceCenterX + offX;
        let qy = from.y - distY / 2;

        let strokeColor = "#F75F00";
        let markerEnd = "url(#arrow-feedback)";

        return {from, to, qx, qy, strokeColor, markerEnd};
    }

    private createArrowPath(pathDesc: any, sourceNode: StructureViewNode, targetNode: StructureViewNode): JQuery<SVGElement> {
        let pathString = "M" + pathDesc.from.x + " " + pathDesc.from.y
            + "Q" + pathDesc.qx + " " + pathDesc.qy
            + " " + pathDesc.to.x + " " + pathDesc.to.y;

        let path = StructureViewUtil.createSVGElement("path");
        path.attr({
            "d": pathString,
            "fill": "none",
            "marker-end": pathDesc.markerEnd,
            "stroke": pathDesc.strokeColor,
            "stroke-width": 0.5
        });

        path.hover(e => {
            path.attr({
                "stroke": "#7fb8ff",
                "stroke-width": 2,
                "stroke-dasharray": "2,1"
            });

            let target = $(e.target as any);
            target.attr("marker-end", "url(#arrow-hover)");
        }, e => {
            path.attr({
                "stroke": pathDesc.strokeColor,
                "stroke-width": 0.5,
                "stroke-dasharray": ""
            });

            let target = $(e.target as any);
            target.attr("marker-end", pathDesc.markerEnd);
        });

        path.click(() => {
            console.log(sourceNode.model.name + " -> " + targetNode.model.name);
        });

        this.canvas.append(path);

        return path;
    }

    private mapArrow(source: StructureViewNode, target: StructureViewNode, path: JQuery<SVGElement>) {
        let key = source.model.id;
        let entries = this.arrowsMap[key];
        if (!entries) {
            entries = [];
            this.arrowsMap[key] = entries;
        }
        entries.push({source: source, target: target, path: path});
    }

    onSizeChanged(target: StructureViewObject): void {
        this.resize();
    }

    onClicked(target: StructureViewObject, event: JQuery.Event): void {
        if (!(target instanceof StructureViewNode)) {
            return;
        }

        let targetNode = target as StructureViewNode;
        if (event.ctrlKey) {
            this.toggleSelection(targetNode);
        }
        else {
            this.setSelection(targetNode);
        }

        this.filterDependencies();
        this.updateDependencyArrows();
        this.dumpDependencies();
    }

    private toggleSelection(node: StructureViewNode): void {
        node.selected = !node.selected;

        if (node.selected) {
            this.deselect(node);
        }
        else {
            this.select(node);
        }
    }

    private deselect(node: StructureViewNode) {
        this.selectionService.addToSelection(node);
        let index = this.filteredDependencies.indexOf(node.model.id);
        if (index === -1) {
            this.filteredDependencies.push(node.model.id);
        }
    }

    private select(node: StructureViewNode) {
        this.selectionService.removeFromSelection(node);
        let index = this.filteredDependencies.indexOf(node.model.id);
        if (index > -1) {
            this.filteredDependencies.splice(index, 1);
        }
    }

    private setSelection(node: StructureViewNode) {
        this.selectionService.getSelection().forEach(node => node.selected = false);
        this.selectionService.setSelection([node]);
        node.selected = true;
    }

    private onKeyDown(event: KeyboardEvent) {
        if (event.key === "d" && event.altKey) {
            this.showAllDependencies();
            this.stopPropagation(event);
        }
        else if (event.key === "s" && event.altKey) {
            this.showDependenciesOnSelected();
            this.stopPropagation(event);
        }
        else if (event.key === "b" && event.altKey) {
            this.showDependenciesBetweenSelected();
            this.stopPropagation(event);
        }
    }

    private showAllDependencies() {
        this.resetDependencyFilter(DependencyDisplayMode.ALL);
        this.updateDependencyArrows();
    }

    private stopPropagation(event: KeyboardEvent) {
        event.preventDefault();
        event.stopPropagation();
    }

    private resetDependencyFilter(mode: DependencyDisplayMode) {
        this.dependencyDisplayMode = mode;
        this.filteredDependencies = [];
    }

    private updateDependencyArrows() {
        this.removeDependencyArrows();
        this.createDependencyArrowsOf(this.rootNode);
    }

    private dumpDependencies() {
        let selection = this.selectionService.getSelection();
        let selectedDependencies = [];

        if (this.dependencyDisplayMode === DependencyDisplayMode.ALL
                || this.dependencyDisplayMode === DependencyDisplayMode.SELECTED) {
            selectedDependencies = this.getDependenciesOf(selection);
        }
        else {
            selectedDependencies = this.getDependenciesBetween(selection);
        }

        if (selectedDependencies.length === 0) {
            return;
        }

        console.log("-------------------------------------------------------------------------------");
        selectedDependencies.forEach(dependency => {
            console.log(dependency);
        });
    }

    private getDependenciesOf(nodes: Array<StructureViewNode>) {
        let dependencies = [];
        nodes.forEach(node => {
            dependencies = dependencies.concat(this.getDependenciesOfNode(node));
        });

        return dependencies;
    }

    private getDependenciesOfNode(node: StructureViewNode): Array<string> {
        let dependencies = this.dependenciesMap[node.model.id];
        return dependencies ? this.normalizeDependencies(dependencies, node)
            .map(dependency => this.formatDependencyOutput(node, dependency)) : [];
    }

    private normalizeDependencies(dependencies: Array<string>, filteredNode: StructureViewNode = null): Array<string> {
        return dependencies
            .filter(firstDependency => {
                for (let i = 0; i < dependencies.length; ++i) {
                    if (dependencies[i] === firstDependency) {
                        continue;
                    }

                    if (dependencies[i].indexOf(firstDependency) === 0) {
                        return false;
                    }

                    if (filteredNode &&
                            firstDependency.indexOf(filteredNode.model.id) === 0) {
                        return false;
                    }
                }

                return true;
            }).sort();
    }

    private formatDependencyOutput(node: StructureViewNode, dependency: string) {
        return node.model.id + " -> " + dependency;
    }

    private getDependenciesBetween(nodes: Array<StructureViewNode>) {
        let dependencies = [];

        nodes.forEach(firstNode => {
            let firstNodeDependencies = this.dependenciesMap[firstNode.model.id];
            if (!firstNodeDependencies) {
                return;
            }
            nodes.forEach(secondNode => {
                firstNodeDependencies.forEach(dependency => {
                    if (dependency.indexOf(firstNode.model.id) !== 0
                            && dependency.indexOf(secondNode.model.id) === 0) {
                        dependencies.push(this.formatDependencyOutput(firstNode, dependency));
                    }
                });
            });
        });

        return this.normalizeDependencies(dependencies);
    }

    private showDependenciesOnSelected() {
        this.resetDependencyFilter(DependencyDisplayMode.SELECTED);
        this.filterDependencies();
        this.updateDependencyArrows();
    }

    private filterDependencies() {
        this.filteredDependencies = [];
        this.selectionService.getSelection().forEach(node => this.filterDependenciesOf(node));
    }

    private filterDependenciesOf(node) {
        if (!node.expanded) {
            this.filteredDependencies.push(node.model.id);
            return;
        }

        node.rows.forEach(row => row.nodes.forEach(rowNode => this.filterDependenciesOf(rowNode)));
    }

    private showDependenciesBetweenSelected() {
        this.resetDependencyFilter(DependencyDisplayMode.BETWEEN);
        this.filterDependencies();
        this.updateDependencyArrows();
    }

    public onDoubleClicked(target: StructureViewObject, event: JQuery.Event): void {
        if (!(target instanceof StructureViewNode)) {
            return;
        }

        this.filterDependencies();
        this.updateDependencyArrows();
    }
}

enum DependencyDisplayMode {
    ALL,
    SELECTED,
    BETWEEN
}
