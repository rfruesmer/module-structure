import {ClassB} from "./module-b";

export class ClassC {
    private b: ClassB = new ClassB();

    public doSomething(): void {
        this.b.doSomething();
    }
}
