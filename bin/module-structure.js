#! /usr/bin/env node

const ApplicationModule = require("../dist/lib/application");

let theApp = new ApplicationModule.Application();
theApp.run();
