import { ClassB } from "../package-b/module-b";
import { ClassC } from "../package-c/module-c";
export class ClassA {
    foo() {
        const b = new ClassB();
        b.doSomething();
        const c = new ClassC();
        c.doSomething();
    }
}
