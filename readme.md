_A fork of [`postcss-icss` Git repository](https://github.com/css-modules/postcss-icss), updated to use the latest dependency versions. The Git repo hosts codebases of both **postcss-modules-parser** (older), and **postcss-icss** (newer) NPM packages. The present fork updates and releases **postcss-modules-parser** only (see the branch of the same name)._

A CSS Modules parser to extract tokens from the css file. Provides opportunity to process multiple files.

## API

In order to use it you should provide a `fetch` function which should load contents of files and process it with the PostCSS instance.
`fetch` function should return  promise object which will resolve into tokens.

```js
const ICSS = require('postcss-icss');

function fetch(importee, importerDir, processor) {
  // load content
  return processor.process(css, { from: filename })
    .then(result => result.messages.find(d => d.type === "icss").exportTokens);
}

postcss([ ICSS({ fetch }) ]);
```
