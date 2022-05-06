# Globimp

## Github sources

[https://github.com/Chill-Studio/globimp/tree/main](https://github.com/Chill-Studio/globimp/tree/main)

## Getting started

### Installation

Chose one of :

```shell
yarn global add globimp
npm i globimp -g
pnpm add globimp -g
```

### Generate a globimp files

At the root of your npm project

```shell
npm globimp
```

Then in `package.json` add `npm globimp` to your start, build and tests scripts

```json
    "start": "npm globimp && <your other start scripts>",
    "build": "npm globimp && <your other build scripts>",
    "test": "npm globimp && <your other test scripts>",
```

This will generate a `globimp.config.json` based on your `package.json` at the root.
It will also generate an `globimp.ts` in `<root-of-project>/src`

### Import types

At the root of your project import the global variable for them to be defined.

```js
import React from "react";
import ReactDOM from "react-dom";
import { App } from "./app";

// Add this line
import "./globimp";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
```

## Global default imports

In `globimp.config.json`, to have access a the default import, set the dependency value to `true` under the key `defaultImport`

```json
{
    "defaultImports": {
        ...
        "axios": true,
        ...
    },
    ...
}
```

> **WARNING**: Any change in `globimp.config.json` require a `npm globimp` in order for the update to be taken into account

## Global named imports

In `globimp.config.json`, to access a named import globally, add the name of the named import in the array of the relevant dependency

```json
  "namedImports": {
    "react": ["useEffect","useState"],
  }
```

> **WARNING**: Any change in `globimp.config.json` require a `npm globimp` in order for the update to be taken into account
