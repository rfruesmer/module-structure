import { ClassA1 } from "../../package-a/module-a1";
import { ClassA2 } from "../../package-a/module-a2";
import { ClassAAA } from "../../package-a/package-aa/module-aaa";
export class ClassBBB {
    doSomething() {
        let a1 = new ClassA1();
        a1.foo();
        let a2 = new ClassA2();
        a2.foo();
    }
}
