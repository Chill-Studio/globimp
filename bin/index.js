#!/usr/bin/env node

const fs = require("fs");
const dir = process.cwd();
const ownPackageJSON = require("../package.json");
const packageJSON = require(dir + "/package.json");

try {
  console.log("Globimp: v", ownPackageJSON.version);
  setConfigFromPackageJSON();
} catch (e) {
  console.log("Globimp: No configuration file found, creating one");
  createConfigFile();
}
createImportsTypings();
console.log("Globimp: Done!");

function createImportsTypings() {
  const currentConfig = require(dir + "/globimp.config.json");
  let imports = "";
  let typings = "";
  let globalVar = "";
  for (let importKey in currentConfig.namedImports) {
    //handle default imports
    if (currentConfig.defaultImports[importKey] === true) {
      imports += `import * as ${importKey}_ from "${importKey}"\n`;
      typings += `\n var ${importKey} : typeof ${importKey}_.default\n`;
      globalVar += `global.${importKey} = ${importKey}_ as any\n`;
    } else {
      // handle named imports
      const currentNamedImportList = currentConfig.namedImports[importKey];
      const innerImportStatement = currentNamedImportList
        .map((namedImport) => `${namedImport} as ${namedImport}_`)
        .join(", ");
      if (innerImportStatement !== "") {
        imports += `import {${innerImportStatement} } from "${importKey}"\n`;
        typings += currentNamedImportList
          .map((namedImport) => ` var ${namedImport} : typeof ${namedImport}_`)
          .join("\n");
        globalVar +=
          currentNamedImportList
            .map(
              (namedImport) => `global.${namedImport} = ${namedImport}_ as any`
            )
            .join("\n") + "\n";
      }
    }
  }
  if (typings !== "") {
    typings = `declare global {\n${typings}\n}\n`;
  }
  fs.writeFileSync(dir + `/src/globimp.ts`, imports + typings + globalVar, {
    newline: true,
  });
}

function getInitialConfig() {
  let imports = { defaultImports: {}, namedImports: {} };
  for (let dependencieKey in packageJSON.dependencies) {
    imports.defaultImports[dependencieKey] = false;
    imports.namedImports[dependencieKey] = [];
  }
  return imports;
}
function createConfigFile() {
  const initialConfig = getInitialConfig();
  fs.writeFileSync(
    dir + `/globimp.config.json`,
    JSON.stringify(initialConfig, null, 2),
    { newline: true }
  );
}
// Read the package.json and create a config according to it.
// Keep already modified imports from the glopimp config before the update.
function setConfigFromPackageJSON() {
  console.log("Updating dependencies...");
  let oldConfig = JSON.parse(fs.readFileSync(dir + `/globimp.config.json`));
  let newConfig = getInitialConfig();
  // Merge existing key into the newConfig
  for (const oldDefaultImportKey in oldConfig.defaultImports) {
    if (oldDefaultImportKey in newConfig.defaultImports) {
      newConfig.defaultImports[oldDefaultImportKey] =
        oldConfig.defaultImports[oldDefaultImportKey];
      newConfig.namedImports[oldDefaultImportKey] =
        oldConfig.namedImports[oldDefaultImportKey];
    }
    fs.writeFileSync(
      dir + `/globimp.config.json`,
      JSON.stringify(newConfig, null, 2),
      { newline: true }
    );
  }
}
