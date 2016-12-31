import {ClassB} from "../package-b/class-b";
import {ClassC} from "../package-c/class-c";

export class ClassA {

    foo(): void {
        let b = new ClassB();
        b.doSomething();

        let c = new ClassC();
        c.doSomething();
    }
}
