import {ClassC} from "./module-c";

export class ClassE {
    private c: ClassC = new ClassC();

    doSomething() {
        this.c.doSomething();
    }
}
