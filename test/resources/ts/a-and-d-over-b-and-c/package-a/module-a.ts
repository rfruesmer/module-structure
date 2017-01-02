import {ClassB} from "../package-b/module-b";
import {ClassC} from "../package-c/module-c";

export class ClassA {

    foo(): void {
        let b = new ClassB();
        b.doSomething();

        let c = new ClassC();
        c.doSomething();
    }
}
