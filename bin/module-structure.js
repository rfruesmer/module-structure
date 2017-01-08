#! /usr/bin/env node

const cli = require("../dist/lib/module-structure-cli");

try {
    new cli.Application().run();
}
catch (e) {
    // already logged
    process.exit(e === null ? 0 : -1);
}
