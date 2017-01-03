import {ClassC} from "./module-c";

export class ClassA {
    private c: ClassC = new ClassC();

    foo(): void {
        this.c.doSomething();
    }
}
