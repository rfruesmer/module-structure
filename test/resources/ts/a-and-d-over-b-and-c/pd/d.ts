import {B} from "../pb/b";

export class D {

    foo(): void {
        let b = new B();
        b.doSomething();
    }

    doSomething() {
        console.log("done");
    }
}
