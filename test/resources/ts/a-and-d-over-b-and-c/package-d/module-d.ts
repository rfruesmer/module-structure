import {ClassB} from "../package-b/module-b";

export class ClassD {

    foo(): void {
        let b = new ClassB();
        b.doSomething();
    }

    doSomething() {
        console.log("done");
    }
}
