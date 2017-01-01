import {ClassD} from "../package-d/class-d";

export class ClassC {

    foo(): void {
        let d = new ClassD();
        d.doSomething();
    }

    doSomething() {
        console.log("done");
    }
}
