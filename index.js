#!/usr/bin/env node
const fs = require("fs");
const dir = process.cwd();
const packageJSON = require(dir + "/package.json");

try {
  console.log("Globimp: Try to read configuration file...");
  addDiffPackageJSONInConfig();
} catch (e) {
  console.log("Globimp: No configuration file found, creating one");
  createConfigFile();
}
createImportsTypings();

function createImportsTypings() {
  console.log("Globimp: Creating types for named imports...");
  const oldConfig = require(dir + "/globimp.config.json");
  let imports = "";
  let typings = "";
  let globalVar = "";

  for (let importKey in oldConfig.namedImports) {
    //handle default imports
    if (oldConfig.defaultImports[importKey] === true) {
      imports += `import * as ${importKey}_ from "${importKey}"\n`;
      typings += `\n    var ${importKey} : typeof ${importKey}_.default\n`;
      globalVar += `global.${importKey} = ${importKey}_ as any\n`;
    } else {
      // handle named imports
      const currentNamedImportsList = oldConfig.namedImports[importKey];
      const innerImportStatement = currentNamedImportsList
        .map((namedImport) => `${namedImport} as ${namedImport}_`)
        .join(", ");
      if (innerImportStatement !== "") {
        imports += `import {${innerImportStatement} } from "${importKey}"\n`;
        typings += currentNamedImportsList
          .map(
            (namedImport) => `    var ${namedImport} : typeof ${namedImport}_`
          )
          .join("\n");
        globalVar +=
          currentNamedImportsList
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

  console.log("Globimp: Creating global vars for default imports...");
  fs.writeFileSync(dir + `/src/globimp.ts`, imports + typings + globalVar, {
    newline: true,
  });
}

function createConfigFile() {
  // Write json config default
  let imports = { defaultImports: {}, namedImports: {} };
  for (let dependencieKey in packageJSON.dependencies) {
    imports.defaultImports[dependencieKey] = false;
    imports.namedImports[dependencieKey] = [];
  }

  fs.writeFileSync(
    dir + `/globimp.config.json`,
    JSON.stringify(imports, null, 2),
    {
      newline: true,
    }
  );
}

function addDiffPackageJSONInConfig() {
  console.log("Updating dependencies...");
  let oldConfig = JSON.parse(fs.readFileSync(dir + `/globimp.config.json`));

  createConfigFile();

  let newConfig = JSON.parse(fs.readFileSync(dir + `/globimp.config.json`));

  // Merge existing key
  for (const oldDefaultImportKey in oldConfig.defaultImports) {
    if (oldDefaultImportKey in newConfig.defaultImports) {
      newConfig.defaultImports[oldDefaultImportKey] =
        oldConfig.defaultImports[oldDefaultImportKey];
      newConfig.namedImports[oldDefaultImportKey] =
        oldConfig.namedImports[oldDefaultImportKey];
    }
  }

  fs.writeFileSync(
    dir + `/globimp.config.json`,
    JSON.stringify(newConfig, null, 2),
    {
      newline: true,
    }
  );
}
