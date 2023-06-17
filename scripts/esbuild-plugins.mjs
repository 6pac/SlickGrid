import util from 'util';
import fs from 'fs';
import path from 'path';

const readFile = util.promisify(fs.readFile);

/**
 * Parse a value into a boolean
 * @param {*} val
 * @returns
 */
export function parseBoolean(val) {
  return val === 'true' || val === true || val === 1;
}

// -- Plugin 1 --//
/**
 * `ifdef` esbuild plugin that lets you use `//#ifdef` comments JS/TS files, so you can conditionally add (or removed) code to files.
 * If the value is a boolean, true means the code inside `//#ifdef` KEY_IN_OBJECT will be included, otherwise it will be removed before tree shaking/parsing.
 * @see https://github.com/Jarred-Sumner/esbuild-plugin-ifdef for detailed info of its usage
 * @param {Object} env - list of ifdef to process for removal, it could be read from env variables or directly from arg definition
 * @returns
 */
export function ifdefPlugin(env = process.env) {
  const IF_DEFS = [];
  const ENDIF = '';
  const IFDEF = '//#ifdef';
  const MODE = { find_opening: 0, find_closing: 1, };
  const LINE_TYPE = { plain: 0, ifdef: 1, closing: 2, };

  function configureStringsToSearch(vars) {
    for (let _key in vars) {
      const key = _key.replace('process.env.', '');
      let keytype = typeof vars[_key];
      let isDefined = (keytype === 'boolean' && vars[_key] === true) || keytype !== 'undefined';

      if (isDefined && (parseBoolean(vars[_key]) === false || vars[_key] === 'undefined')) {
        isDefined = false;
      }
      // if (keytype === 'boolean' && vars[_key] === true) {
      //   console.log('isDefined', vars[_key], isDefined)
      // }

      if (isDefined) {
        IF_DEFS.push(key);
      }
    }
  }

  async function onLoadPlugin(args) {
    let text = await readFile(args.path, 'utf8');
    if (text.includes(IFDEF)) {
      let lines = text.split('\n');
      let ifdefStart = -1;
      let depth = 0;
      let line = '';
      let expression = '';
      let step = MODE.find_opening;
      let shouldRemove = false;
      let lineType = LINE_TYPE.plain;

      for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
        line = lines[lineNumber];

        if (line.startsWith(IFDEF)) {
          lineType = LINE_TYPE.ifdef;
        } else if (line.startsWith(ENDIF)) {
          lineType = LINE_TYPE.closing;
        } else {
          lineType = LINE_TYPE.plain;
        }

        if (lineType === LINE_TYPE.ifdef && step === MODE.find_opening) {
          depth = 0;
          ifdefStart = lineNumber;
          step = MODE.find_closing;
          expression = line.substring(IFDEF.length).trim();
          const expressions = expression.split(' ');
          if (expressions.length > 1) {
            expression = expressions[0]; // keep only 1st endif token and discard the rest (like extra comments)
          }
          shouldRemove = !IF_DEFS.includes(expression);
          if (shouldRemove && expression.startsWith('!')) {
            console.log('not remove', expression, lines[lineNumber + 1])
            shouldRemove = false;
          }
        } else if (lineType === LINE_TYPE.ifdef && step === MODE.find_closing) {
          depth++;
        } else if (
          lineType === LINE_TYPE.closing &&
          step === MODE.find_closing &&
          depth > 0
        ) {
          depth--;
        } else if (
          lineType === LINE_TYPE.closing &&
          step === MODE.find_closing &&
          depth === 0
        ) {
          if (shouldRemove) {
            lines = [
              ...lines.slice(0, ifdefStart),
              ...lines.slice(lineNumber + 1),
            ];
          } else {
            lines = [
              ...lines.slice(0, ifdefStart),
              ...lines.slice(ifdefStart + 1, lineNumber),
              ...lines.slice(lineNumber + 1),
            ];
          }

          step = MODE.find_opening;
          ifdefStart = -1;
          shouldRemove = false;
          lineNumber = 0;
        }
      }

      text = lines.join('\n');

      return {
        contents: text,
        loader: path.extname(args.path).substring(1),
      };
    } else {
      return null;
    }
  }

  // rest
  configureStringsToSearch(env);

  return {
    name: '#ifdef',
    setup(build) {
      build.onLoad({ filter: /.*.(js|ts)/ }, onLoadPlugin);
    },
  };
}

// -- Plugin 2 --//
/** esbuild plugin to remove any imports from iife build since we'll be using the Slick object on the window object */
export const removeImportsPlugin = {
  name: 'remove-imports-plugin',
  setup(build) {
    build.onResolve({ filter: /.*/ }, (args) => {
      if (args.kind !== 'entry-point') {
        return { path: args.path + '.js', namespace: 'import-ns' }
      }
    });
    build.onLoad({ filter: /.*/, namespace: 'import-ns' }, () => ({
      contents: `// empty string, do nothing`,
      loader: 'js',
    }));
  }
}
