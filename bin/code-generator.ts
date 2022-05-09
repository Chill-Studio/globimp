import { writeFileSync } from "fs";
import { GlobimpConfig } from "./types/globimp-config";
const currentDirectory = process.cwd()

interface CodeStatements { imports: string[], typings: string[], globalVars: string[] }
// Based on the globimp.config.json, generate a globimp.ts containing the relevant types and global variables.
export function generateGlobalImportsCode() {
    let importGeneratedCode = "";
    let typingsGeneratedCode = "";
    let globalVarsGeneratedCode = "";
    const currentConfig = require(currentDirectory + "/globimp.config.json") as GlobimpConfig;
    let statementList: { [key: string]: CodeStatements } = {}
    for (let importKey in currentConfig.namedImports) {
        //handle default imports
        if (currentConfig.defaultImports[importKey] === true) {
            statementList = {
                ...statementList,
                [importKey]: {
                    imports: [`import * as ${importKey}_ from "${importKey}"\n`],
                    typings: [`\n    var ${importKey} : typeof ${importKey}_.default\n`],
                    globalVars: [`global.${importKey} = ${importKey}_ as any\n`]
                },

            }
        } else {
            // Build an object having a CodeStatements shape to easily create a string out of it
            const currentNamedImportList = currentConfig.namedImports[importKey];
            statementList[importKey] = (currentNamedImportList.reduce((acc, namedImport) => {
                acc[importKey] = {
                    imports: [...(acc[importKey]?.imports || []), `${namedImport} as ${namedImport}_`],
                    typings: [...(acc[importKey]?.typings || []), `    var ${namedImport} : typeof ${namedImport}_`],
                    globalVars: [...(acc[importKey]?.globalVars || []), `global.${namedImport} = ${namedImport}_ as any`],

                }
                return acc

            }, {}))[importKey] as CodeStatements
            statementList[importKey].imports = [`import { ${statementList[importKey].imports.join(", ")} } from "${importKey}"\n`]
        }
        importGeneratedCode += statementList[importKey].imports
        typingsGeneratedCode += `${statementList[importKey].typings.join("\n")}`
        globalVarsGeneratedCode += `${statementList[importKey].globalVars.join("\n")}\n`
    }
    if (typingsGeneratedCode !== "") {
        typingsGeneratedCode = `\ndeclare global {\n${typingsGeneratedCode}}\n\n`
    }
    writeFileSync(currentDirectory + `/src/globimp.ts`, `/* Auto-generated file using globimp */\n
     ${importGeneratedCode}
     ${typingsGeneratedCode}
     ${globalVarsGeneratedCode}`);

}





