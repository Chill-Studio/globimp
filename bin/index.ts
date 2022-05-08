#!/usr/bin/env node

import { version as packageJsonVersion } from "../package.json"
import { createConfigFile, setConfigFromPackageJSON } from "./configuration-parser";
import { generateGlobalImportsCode } from "./code-generator";

try {
  console.log("Globimp: v", packageJsonVersion);
  setConfigFromPackageJSON();
} catch (e) {
  console.log("Globimp: No configuration file found, creating one");
  createConfigFile();
}
generateGlobalImportsCode();
console.log("Globimp: Done!");
