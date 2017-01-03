import { ClassA1 } from "./package-a/module-a1";
export class ClassZero {
    foo() {
        let a1 = new ClassA1();
        a1.foo();
    }
}
