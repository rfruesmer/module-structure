import {ClassBBB} from "../../package-b/package-bb/module-bb";
import {ClassA2} from "../module-a2";

export class ClassAAB {

    foo(): void {
        let c = new ClassBBB();
        c.doSomething();

        let a2 = new ClassA2();
        a2.foo();
    }
}
