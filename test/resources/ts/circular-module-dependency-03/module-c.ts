import {ClassE} from "./module-e";
import {ClassD} from "./module-d";

export class ClassC {
    private d: ClassD = new ClassD();
    private e: ClassE = new ClassE();

    doSomething() {
        this.d.doSomething();
        this.e.doSomething();
    }
}
