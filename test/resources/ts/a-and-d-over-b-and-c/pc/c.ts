import {D} from "../pd/d";

export class C {

    foo(): void {
        let d = new D();
        d.doSomething();
    }

    doSomething() {
        console.log("done");
    }
}
