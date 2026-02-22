import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import postcss, { type Processor, type Root } from 'postcss';

import Parser, { type FetchT } from '../src';

let instance: Processor | undefined;

const fetch: FetchT = (_to, from) => {
  const to = _to.replace(/^["']|["']$/g, '');
  const filename = (/\w/i).test(to[0]!)
    ? require.resolve(to)
    : resolve(dirname(from), to);

  const css = readFileSync(filename, 'utf8');

  instance ??= postcss([Parser({ fetch })]);

  const root = instance.process(css, { from: filename }).root as
    Root & { tokens?: Record<string, string> };

  if (!root.tokens) throw Error('Missing "tokens" field');

  return root.tokens;
};

export default fetch;
