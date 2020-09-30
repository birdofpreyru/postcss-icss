import { readFile } from 'fs';
import { dirname, resolve } from 'path';
import postcss from 'postcss';
import parser from '../../src';
const instance = postcss([parser({fetch})]);

export default function fetch(_to, from) {
  const to = _to.replace(/^["']|["']$/g, '');
  const filename = /\w/i.test(to[0])
    ? require.resolve(to)
    : resolve(dirname(from), to);

  return new Promise((resolve, reject) => {
    readFile(filename, 'utf8', (err, css) => {
      if (err) {
        return void reject(err);
      }

      instance.process(css, {from: filename})
        .then(result => resolve(result.root.tokens))
        .catch(reject);
    });
  });
}
