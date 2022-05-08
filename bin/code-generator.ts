import { writeFileSync } from "fs";
import { GlobimpConfig } from "./types/globimp-config";
const currentDirectory = process.cwd()

// Based on the globimp.config.json, generate a globimp.ts containing the relevant types and global variables.
export function generateGlobalImportsCode() {
    const currentConfig = require(currentDirectory + "/globimp.config.json") as GlobimpConfig;
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
    writeFileSync(currentDirectory + `/src/globimp.ts`, imports + typings + globalVar);
}