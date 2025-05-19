import { replaceSymbols } from 'icss-utils';
import type { PluginCreator, Root } from 'postcss';

const importRegexp = /^:import\((.+)\)$/;
const exportRegexp = /^:export$/;

type RootWithTokens = Root & { tokens?: Record<string, string> };

// TODO: Perhaps, we can replace this entire function by the expression
// promise instanceof Promise, but we better do it separately later, to be on
// the safe side.
function isPromise(promise: unknown): promise is Promise<unknown> {
  return !!promise && typeof promise === 'object'
    && 'then' in promise && typeof promise.then === 'function';
}

function proceed(css: RootWithTokens, translations: Record<string, string>) {
  const exportTokens: Record<string, string> = {};

  replaceSymbols(css, translations);

  css.walkRules(exportRegexp, (rule) => {
    rule.walkDecls((decl) => {
      Object.entries(translations).forEach(([key, value]) => {
        // eslint-disable-next-line no-param-reassign
        decl.value = decl.value.replace(key, value);
      });
      exportTokens[decl.prop] = decl.value;
    });

    rule.remove();
  });

  // eslint-disable-next-line no-param-reassign
  css.tokens = exportTokens;
}

export type FetchT = (
  importee: string,
  importerDir: string,
) => Record<string, string> | Promise<Record<string, string>>;

type OptionsT = {
  fetch?: FetchT;
};

const parser: PluginCreator<OptionsT> = ({ fetch }: OptionsT = {}) => ({
  Once: (css: Root): void | Promise<void> => {
    if (!fetch) throw Error('Missing "fetch" option');

    // https://github.com/postcss/postcss/blob/master/docs/api.md#inputfile
    const file = css.source?.input.file;

    if (!file) throw Error('Missing "file" value');

    const translations: Record<string, string> = {};
    const promises: Array<Promise<void>> = [];

    css.walkRules(importRegexp, (rule) => {
      const dependency = RegExp.$1.replace(/^["']|["']$/g, '');
      const result = fetch(dependency, file);

      if (isPromise(result)) {
        promises.push(
          result.then((exportMap) => {
            rule.walkDecls(
              (decl) => {
                const value = exportMap[decl.value];
                if (value !== undefined) translations[decl.prop] = value;
              },
            );
            rule.remove();
          }),
        );
      } else {
        rule.walkDecls((decl) => {
          const value = result[decl.value];
          if (value !== undefined) translations[decl.prop] = value;
        });
        rule.remove();
      }
    });

    if (promises.length === 0) {
      proceed(css, translations);
      return undefined;
    }

    return Promise.all(promises)
      .then(() => {
        proceed(css, translations);
      });
  },
  postcssPlugin: 'parser',
});

parser.postcss = true;
export default parser;
