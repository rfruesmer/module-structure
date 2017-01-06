#! /usr/bin/env node

const cli = require("../dist/lib/cli");

const theApp = new cli.Application();
theApp.run();
