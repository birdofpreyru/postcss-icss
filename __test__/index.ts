import { equal } from 'assert';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import asyncLoader from './helper/async-loader';
import syncLoader from './helper/sync-loader';

let fixture: string;
let expected: unknown;
let filename: string;

describe('postcss-modules-parser', () => {
  describe('single', () => {
    beforeEach(() => {
      fixture = 'test/fixture/single';
      filename = resolve(fixture, 'source.css');
      expected = JSON.parse(
        readFileSync(resolve(fixture, 'expected.json'), 'utf8'),
      );
    });

    it('asynchronous', async () => {
      const res = await asyncLoader(filename, filename);
      equal(JSON.stringify(res), JSON.stringify(expected));
    });

    it('synchronous', () => {
      const result = syncLoader(filename, filename);
      equal(JSON.stringify(result), JSON.stringify(expected));
    });
  });

  describe('multiple', () => {
    beforeEach(() => {
      fixture = 'test/fixture/multiple';
      filename = resolve(fixture, 'source.css');
      expected = JSON.parse(readFileSync(resolve(fixture, 'expected.json'), 'utf8'));
    });

    it('asynchronous', async () => {
      const res = await asyncLoader(filename, filename);
      equal(JSON.stringify(res), JSON.stringify(expected));
    });

    it('synchronous', () => {
      const result = syncLoader(filename, filename);
      equal(JSON.stringify(result), JSON.stringify(expected));
    });
  });
});
