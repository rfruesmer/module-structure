import { ClassBBB } from "../../package-b/package-bb/module-bb";
export class ClassAAA {
    foo() {
        let c = new ClassBBB();
        c.doSomething();
    }
}
