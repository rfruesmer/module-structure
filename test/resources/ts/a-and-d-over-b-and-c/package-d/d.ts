import {B} from "../package-b/b";

export class D {

    foo(): void {
        let b = new B();
        b.doSomething();
    }

    doSomething() {
        console.log("done");
    }
}
