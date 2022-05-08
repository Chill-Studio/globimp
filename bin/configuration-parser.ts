
import { writeFileSync, readFileSync } from "fs";
import { GlobimpConfig } from "./types/globimp-config";
const currentDirectory = process.cwd()
const packageJSON = require(currentDirectory + "/package.json")

export function createConfigFile() {
  const initialConfig = getInitialConfig();
  writeFileSync(
    currentDirectory + `/globimp.config.json`,
    JSON.stringify(initialConfig, null, 2));
}

export function getInitialConfig(): GlobimpConfig {
  let imports: GlobimpConfig = { defaultImports: {}, namedImports: {} };
  for (let dependencieKey in packageJSON.dependencies) {
    imports.defaultImports[dependencieKey] = false;
    imports.namedImports[dependencieKey] = [];
  }
  return imports;
}

// Read the package.json and create a configuration file according to it.
// If a config is already existing before the update, we keep the fields that have been modified.
export function setConfigFromPackageJSON() {
  console.log("Updating dependencies...");
  let oldConfig = require(currentDirectory + "/globimp.config.json")
  let newConfig = getInitialConfig();
  // Merge existing key with their values into the newConfig
  for (const oldDefaultImportKey in oldConfig.defaultImports) {
    if (oldDefaultImportKey in newConfig.defaultImports) {
      newConfig.defaultImports[oldDefaultImportKey] =
        oldConfig.defaultImports[oldDefaultImportKey];
      newConfig.namedImports[oldDefaultImportKey] =
        oldConfig.namedImports[oldDefaultImportKey];
    }
    writeFileSync(
      currentDirectory + `/globimp.config.json`,
      JSON.stringify(newConfig, null, 2));
  }
}
