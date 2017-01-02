import {ClassD} from "../package-d/module-d";

export class ClassC {

    foo(): void {
        let d = new ClassD();
        d.doSomething();
    }

    doSomething() {
        console.log("done");
    }
}
