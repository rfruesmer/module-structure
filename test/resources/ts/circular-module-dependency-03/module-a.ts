import {ClassC} from "./module-c";

export class ClassA {
    private c: ClassC = new ClassC();

    doSomething() {
        this.c.doSomething();
    }
}
