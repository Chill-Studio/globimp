# Globimp

Access node_modules functions and variables from anywhere, without imports.
With typescript support !

How does it look ?
![Example](https://i.ibb.co/JB2GVL2/screenshot-2.png)

## Github sources

[https://github.com/Chill-Studio/globimp/tree/main](https://github.com/Chill-Studio/globimp/tree/main)

## Getting started

### Video tutorial

[Watch the video](https://streamable.com/p0bibc)

### Installation

```shell
npm install -g globimp
```

In `package.json` you can add globimp command to `postinstall` the hooks.
This way the globimp typings and variables will be updated when your `package.json` updates its dependencies

```json
scripts : {
  ...
  "postinstall" : "globimp"
  ...
}
```

### Generate a globimp files

At the root of your npm project :

```shell
globimp
```

This will generate a `globimp.config.json` based on your `package.json` at the root.
It will also generate an `globimp.ts` in `<root-of-project>/src`

### Enable Globimp

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

## Access default imports globaly

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

> **WARNING**: Any change in `globimp.config.json` require a `globimp` in order for the update to be taken into account

## Access named imports globaly

In `globimp.config.json`, to access a named import globally, add the name of the named import in the array of the relevant dependency

**Note** If this import is already defined and set to true in the default section, the namedImports section will be ignored.

```json
  "namedImports": {
    "react": ["useEffect","useState"],
  }
```

> **WARNING**: Any change in `globimp.config.json` require a `globimp` in order for the update to be taken into account
