"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.generateGlobalImportsCode = void 0;
var fs_1 = require("fs");
var currentDirectory = process.cwd();
// Based on the globimp.config.json, generate a globimp.ts containing the relevant types and global variables.
function generateGlobalImportsCode() {
    var importGeneratedCode = "";
    var typingsGeneratedCode = "";
    var globalVarsGeneratedCode = "";
    var currentConfig = require(currentDirectory + "/globimp.config.json");
    var statementList = {};
    var _loop_1 = function (importKey) {
        var _a;
        //handle default imports
        if (currentConfig.defaultImports[importKey] === true) {
            statementList = __assign(__assign({}, statementList), (_a = {}, _a[importKey] = {
                imports: ["import * as ".concat(importKey, "_ from \"").concat(importKey, "\"\n")],
                typings: ["\n    var ".concat(importKey, " : typeof ").concat(importKey, "_.default\n")],
                globalVars: ["global.".concat(importKey, " = ").concat(importKey, "_ as any\n")]
            }, _a));
        }
        else {
            // Build an object having a CodeStatements shape to easily create a string out of it
            var currentNamedImportList = currentConfig.namedImports[importKey];
            statementList[importKey] = (currentNamedImportList.reduce(function (acc, namedImport) {
                var _a, _b, _c;
                acc[importKey] = {
                    imports: __spreadArray(__spreadArray([], (((_a = acc[importKey]) === null || _a === void 0 ? void 0 : _a.imports) || []), true), ["".concat(namedImport, " as ").concat(namedImport, "_")], false),
                    typings: __spreadArray(__spreadArray([], (((_b = acc[importKey]) === null || _b === void 0 ? void 0 : _b.typings) || []), true), ["    var ".concat(namedImport, " : typeof ").concat(namedImport, "_")], false),
                    globalVars: __spreadArray(__spreadArray([], (((_c = acc[importKey]) === null || _c === void 0 ? void 0 : _c.globalVars) || []), true), ["global.".concat(namedImport, " = ").concat(namedImport, "_ as any")], false)
                };
                return acc;
            }, {}))[importKey];
            statementList[importKey].imports = ["import { ".concat(statementList[importKey].imports.join(", "), " } from \"").concat(importKey, "\"\n")];
        }
        importGeneratedCode += statementList[importKey].imports;
        typingsGeneratedCode += "".concat(statementList[importKey].typings.join("\n"));
        globalVarsGeneratedCode += "".concat(statementList[importKey].globalVars.join("\n"), "\n");
    };
    for (var importKey in currentConfig.namedImports) {
        _loop_1(importKey);
    }
    if (typingsGeneratedCode !== "") {
        typingsGeneratedCode = "\ndeclare global {\n".concat(typingsGeneratedCode, "}\n\n");
    }
    (0, fs_1.writeFileSync)(currentDirectory + "/src/globimp.ts", "/* Auto-generated file using globimp */\n\n     ".concat(importGeneratedCode, "\n     ").concat(typingsGeneratedCode, "\n     ").concat(globalVarsGeneratedCode));
}
exports.generateGlobalImportsCode = generateGlobalImportsCode;
