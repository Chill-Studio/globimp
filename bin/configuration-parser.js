"use strict";
exports.__esModule = true;
exports.setConfigFromPackageJSON = exports.getInitialConfig = exports.createConfigFile = void 0;
var fs_1 = require("fs");
var currentDirectory = process.cwd();
var packageJSON = require(currentDirectory + "/package.json");
function createConfigFile() {
    var initialConfig = getInitialConfig();
    (0, fs_1.writeFileSync)(currentDirectory + "/globimp.config.json", JSON.stringify(initialConfig, null, 2));
}
exports.createConfigFile = createConfigFile;
// Create a config based on the dependencies of the package.json
function getInitialConfig() {
    var imports = { defaultImports: {}, namedImports: {} };
    for (var dependencyKey_ in packageJSON.dependencies) {
        // Remove '@' and replace "/" and "-" by "_"
        var dependencyKey = dependencyKey_.replace(/[/-]/g, "_").replace("@", "");
        imports.defaultImports[dependencyKey] = false;
        imports.namedImports[dependencyKey] = [];
    }
    return imports;
}
exports.getInitialConfig = getInitialConfig;
// Read the package.json and create a configuration file according to it.
// If a config is already existing before the update, we keep the fields that have been modified.
function setConfigFromPackageJSON() {
    console.log("Updating dependencies...");
    var oldConfig = require(currentDirectory + "/globimp.config.json");
    var newConfig = getInitialConfig();
    // Merge existing key with their values into the newConfig
    for (var oldDefaultImportKey in oldConfig.defaultImports) {
        if (oldDefaultImportKey in newConfig.defaultImports) {
            newConfig.defaultImports[oldDefaultImportKey] =
                oldConfig.defaultImports[oldDefaultImportKey];
            newConfig.namedImports[oldDefaultImportKey] =
                oldConfig.namedImports[oldDefaultImportKey];
        }
        (0, fs_1.writeFileSync)(currentDirectory + "/globimp.config.json", JSON.stringify(newConfig, null, 2));
    }
}
exports.setConfigFromPackageJSON = setConfigFromPackageJSON;
