import forEach from 'lodash.foreach';
import { replaceSymbols } from 'icss-utils';
const importRegexp = /^:import\((.+)\)$/;
const exportRegexp = /^:export$/;

/**
 * @param  {object}  promise
 * @return {boolean}
 */
function isPromise(promise) {
  return typeof promise === 'object' && typeof promise.then === 'function';
}

/**
 * @param  {object} css
 * @param  {object} translations
 */
function proceed(css, translations) {
  const exportTokens = {};

  replaceSymbols(css, translations);

  css.walkRules(exportRegexp, rule => {
    rule.walkDecls(decl => {
      forEach(translations, (value, key) => decl.value = decl.value.replace(key, value));
      exportTokens[decl.prop] = decl.value;
    });

    rule.remove();
  });

  css.tokens = exportTokens;
}

/**
 * @param  {function} options.fetch
 * @return {function}
 */
'parser'

function parser({ fetch } = {}) {
  return {
    postcssPlugin: 'parser',
    Once: css => {
      // https://github.com/postcss/postcss/blob/master/docs/api.md#inputfile
      const file = css.source.input.file;

      const translations = {};
      const promises = [];

      let iteration = 0;

      css.walkRules(importRegexp, rule => {
        const dependency = RegExp.$1.replace(/^["']|["']$/g, '');
        const result = fetch(dependency, file, iteration++);

        if (isPromise(result)) {
          result.then(exports => {
            rule.walkDecls(decl => translations[decl.prop] = exports[decl.value]);
            rule.remove();
          });

          promises.push(result);
        } else {
          rule.walkDecls(decl => translations[decl.prop] = result[decl.value]);
          rule.remove();
        }
      });

      if (promises.length === 0) {
        return void proceed(css, translations);
      }

      return Promise.all(promises)
        .then(() => proceed(css, translations));
    },
  };
}

parser.postcss = true;
export default parser;
