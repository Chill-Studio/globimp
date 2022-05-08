export interface GlobimpConfig {
    defaultImports: { [dependencyName: string]: boolean }
    namedImports: { [namedImportName: string]: string[] }
}