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
        statementList[importKey] = { imports: [], typings: [], globalVars: [] }
        if (currentConfig.defaultImports[importKey] === true) {

            statementList = {
                ...statementList,
                [importKey]: {
                    imports: [`import * as ${importKey}_ from "${importKey}"`],
                    typings: [`    var ${importKey} : typeof ${importKey}_.default`],
                    globalVars: [`global.${importKey} = ${importKey}_ as any`]
                },

            }

        } else {
            if (currentConfig.namedImports[importKey].length > 0) {
                // Build an object having a CodeStatements shape to easily create a string out of it
                const currentNamedImportList = currentConfig.namedImports[importKey];
                statementList[importKey] = (currentNamedImportList.reduce((acc, namedImport) => {
                    acc[importKey] = {
                        imports: [...(acc[importKey]?.imports || []), `${namedImport} as ${namedImport}_`],
                        typings: [...(acc[importKey]?.typings || []), `    var ${namedImport} : typeof ${namedImport}_`],
                        globalVars: [...(acc[importKey]?.globalVars || []), `global.${namedImport} = ${namedImport}_ as any`]

                    }
                    return acc

                }, {}))[importKey] as CodeStatements

                statementList[importKey].imports = [`import { ${statementList[importKey].imports.join(", ")} } from "${importKey}"`]

            }
        }
        importGeneratedCode += statementList[importKey].imports + "\n"
        typingsGeneratedCode += `${statementList[importKey].typings.join("\n")}\n`
        globalVarsGeneratedCode += `${statementList[importKey].globalVars.join("\n")}\n`


    }
    if (typingsGeneratedCode.trim().length > 0) {
        console.log("La valeur ", typingsGeneratedCode)

        typingsGeneratedCode = `declare global {\n${typingsGeneratedCode}}\n`
    }
    writeFileSync(currentDirectory + `/src/globimp.ts`, `/* Auto-generated file using globimp */
${importGeneratedCode}
${typingsGeneratedCode}
${globalVarsGeneratedCode}`);

}





