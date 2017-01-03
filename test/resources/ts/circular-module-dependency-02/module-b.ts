import {ClassC} from "./module-c";

export class ClassB {
    private c: ClassC = new ClassC();

    doSomething() {
        this.c.doSomething();
    }
}
