/**
 * Copy some fs-extra util implementations
 * https://github.com/jprichardson/node-fs-extra
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

export function outputFileSync(file, ...args) {
  const dir = dirname(file);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  writeFileSync(file, ...args);
}

export function readJSONSync(file, options = {}) {
  if (typeof options === 'string') {
    options = { encoding: options };
  }

  const shouldThrow = 'throws' in options ? options.throws : true;

  try {
    let content = readFileSync(file, options);
    content = stripBom(content);
    return JSON.parse(content, options.reviver);
  } catch (err) {
    if (shouldThrow) {
      err.message = `${file}: ${err.message}`;
      throw err;
    } else {
      return null;
    }
  }
}

export function stringify(obj, { EOL = '\n', finalEOL = true, replacer = null, spaces } = {}) {
  const EOF = finalEOL ? EOL : '';
  const str = JSON.stringify(obj, replacer, spaces);

  return str.replace(/\n/g, EOL) + EOF;
}

export function stripBom(content) {
  // we do this because JSON.parse would convert it to a utf8 string if encoding wasn't specified
  if (Buffer.isBuffer(content)) {
    content = content.toString('utf8');
  }
  return content.replace(/^\uFEFF/, '');
}

export function writeJsonSync(file, obj, options = {}) {
  const str = stringify(obj, options);
  // not sure if fs.writeFileSync returns anything, but just in case
  return writeFileSync(file, str, options);
}
