export class StructureViewUtil {

    public static createSVGElement(tagName: string): JQuery {
        return $(document.createElementNS("http://www.w3.org/2000/svg", tagName));
    }
}
