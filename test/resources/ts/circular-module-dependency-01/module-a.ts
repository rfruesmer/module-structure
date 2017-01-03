import {ClassB} from "./module-b";

export class ClassA {
    private b: ClassB = new ClassB();

    public foo(): void {
        this.b.doSomething();
    }
}
