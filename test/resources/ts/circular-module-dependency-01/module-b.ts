import {ClassC} from "./module-c";

export class ClassB {
    private c: ClassC = new ClassC();

    public doSomething(): void {
        this.c.doSomething();
    }
}
