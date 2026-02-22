import { readFile } from 'node:fs';
import { dirname, resolve } from 'node:path';

import postcss, { type Processor, type Root } from 'postcss';

import parser, { type FetchT } from '../src';

let instance: Processor | undefined;

const fetch: FetchT = async (
  _to: string,
  from: string,
): Promise<Record<string, string>> => {
  const to = _to.replace(/^["']|["']$/g, '');
  const filename = (/\w/i).test(to[0]!)
    ? require.resolve(to)
    : resolve(dirname(from), to);

  return new Promise((promiseResolve, reject) => {
    readFile(filename, 'utf8', (err, css) => {
      if (err) {
        reject(err);
        return;
      }

      instance ??= postcss([parser({ fetch })]);
      instance.process(css, { from: filename })
        .then((result) => {
          const root = result.root as
            Root & { tokens?: Record<string, string> };

          if (!root.tokens) throw Error('Missing "tokens" field');

          promiseResolve(root.tokens);
        })
        .catch(reject);
    });
  });
};

export default fetch;
