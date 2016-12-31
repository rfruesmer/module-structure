import {B} from "../package-b/b";
import {C} from "../package-c/c";

export class A {

    foo(): void {
        let b = new B();
        b.doSomething();

        let c = new C();
        c.doSomething();
    }
}
