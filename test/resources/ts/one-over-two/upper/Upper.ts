import {LowerLeft} from "../lower-left/lower-left";
import {LowerRight} from "../lower-right/lower-right";

export class Upper {

    foo(): void {
        let b = new LowerLeft();
        b.doSomething();

        let c = new LowerRight();
        c.doSomething();
    }
}
