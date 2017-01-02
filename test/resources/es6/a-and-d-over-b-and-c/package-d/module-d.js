import { ClassB } from "../package-b/module-b";
export class ClassD {
    foo() {
        const b = new ClassB();
        b.doSomething();
    }
    doSomething() {
        // ...
    }
}
