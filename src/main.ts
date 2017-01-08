import {Application} from "./module-structure-cli";

try {
    new Application().run();
}
catch (e) {
    // already logged
    process.exit(e === null ? 0 : -1);
}
