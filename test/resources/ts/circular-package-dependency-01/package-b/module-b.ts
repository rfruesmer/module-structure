import {ClassC} from "../package-c/module-c";
import {ClassE} from "../package-e/module-e";

export class ClassB {
    private c: ClassC = new ClassC();
    private e: ClassE = new ClassE();

    doSomething() {
        this.c.doSomething();
        this.e.doSomething();
    }
}
