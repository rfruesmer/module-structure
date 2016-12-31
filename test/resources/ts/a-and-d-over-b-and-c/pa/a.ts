import {B} from "../pb/b";
import {C} from "../pc/c";

export class A {

    foo(): void {
        let b = new B();
        b.doSomething();

        let c = new C();
        c.doSomething();
    }
}
