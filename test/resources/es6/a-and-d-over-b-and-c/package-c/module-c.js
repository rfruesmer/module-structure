import { ClassD } from "../package-d/module-d";
export class ClassC {
    foo() {
        const d = new ClassD();
        d.doSomething();
    }
    doSomething() {
        // ...
    }
}
