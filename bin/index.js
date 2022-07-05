#!/usr/bin/env node
"use strict";
exports.__esModule = true;
var package_json_1 = require("../package.json");
var configuration_parser_1 = require("./configuration-parser");
var code_generator_1 = require("./code-generator");
try {
    console.log("Globimp: v", package_json_1.version);
    (0, configuration_parser_1.setConfigFromPackageJSON)();
}
catch (e) {
    console.log("Globimp: No configuration file found, creating one");
    (0, configuration_parser_1.createConfigFile)();
}
(0, code_generator_1.generateGlobalImportsCode)();
console.log("Globimp: Done!");
