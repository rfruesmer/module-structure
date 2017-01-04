export class ParameterContainer {
    private parameters: Array<string>;

    addParameter(p: string): void {
        this.parameters.push(p);
    }
}
