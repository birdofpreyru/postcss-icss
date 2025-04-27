# PostCSS Modules Parser

[![Latest NPM Release](https://img.shields.io/npm/v/@dr.pogodin/postcss-modules-parser.svg)](https://www.npmjs.com/package/@dr.pogodin/postcss-modules-parser)
[![NPM Downloads](https://img.shields.io/npm/dm/@dr.pogodin/postcss-modules-parser.svg)](https://www.npmjs.com/package/@dr.pogodin/postcss-modules-parser)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/birdofpreyru/postcss-icss/tree/postcss-modules-parser.svg?style=shield)](https://app.circleci.com/pipelines/github/birdofpreyru/postcss-icss)
[![GitHub Repo stars](https://img.shields.io/github/stars/birdofpreyru/postcss-icss?style=social)](https://github.com/birdofpreyru/postcss-icss/tree/postcss-modules-parser)

A CSS Modules parser to extract tokens from the css file. Provides opportunity to process multiple files. Supports both synchronous and asynchronous file loaders.

[![Sponsor](https://raw.githubusercontent.com/birdofpreyru/postcss-icss/refs/heads/postcss-modules-parser/.README/sponsor.svg)](https://github.com/sponsors/birdofpreyru)

---
_This is a fork of [`postcss-icss` Git repository](https://github.com/css-modules/postcss-icss), updated to use the latest dependency versions. The Git repo hosts codebases of both [postcss-modules-parser] (older), and **postcss-icss** (newer) NPM packages. The present fork updates and releases [postcss-modules-parser] only._

---

## API

In order to use it you should provide a `fetch` function which should load contents of files and process it with the PostCSS instance. `fetch` function should return tokens or promise object which will resolve into tokens.

```javascript
var Parser = require('@dr.pogodin/postcss-modules-parser');

/**
 * @param  {string} to   Path to the new file. Could be any.
 * @param  {string} from Path to the source file. Should be absolute.
 * @return {object}      Tokens
 */
function fetch(to, from) {
  // load content
  return instance.process(css, {from: filename}).root.tokens;
}

new Parser({fetch: fetch});
```

See the examples:
- asynchronous loader: [test/helper/async-loader.js](https://github.com/css-modules/postcss-modules-parser/blob/master/test/helper/async-loader.js)
- synchronous loader: [test/helper/sync-loader.js](https://github.com/css-modules/postcss-modules-parser/blob/master/test/helper/sync-loader.js)

<!-- Links -->
[postcss-modules-parser]: https://www.npmjs.com/package/@dr.pogodin/postcss-modules-parser
