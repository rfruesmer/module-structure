import {Application} from "./cli";

try {
    new Application().run();
}
catch (e) {
    // already logged
    process.exit(e === null ? 0 : -1);
}
