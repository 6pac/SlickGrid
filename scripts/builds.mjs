import { execSync } from 'child_process';
import copyfiles from 'copyfiles';
import { build } from 'esbuild';
import fs from 'fs-extra';
import { globSync } from 'glob';
import path from 'node:path';
import { compile as sassCompile } from 'sass';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { removeImportsPlugin } from './esbuild-plugins.mjs';

const argv = yargs(hideBin(process.argv)).argv;
export const BUILD_FORMATS = ['cjs', 'esm'];

// when --prod is provided, we'll do a full build of all JS/TS files and also all SASS files
if (argv.prod) {
  executeFullBuild();
  buildAllSassFiles();
  copySassFiles();
  // execSync('npm run build:types:prod');
}

// --test is only used for testing purpose,
// TODO: this should eventually be removed before the next major release (also remove npm script)
if (argv.test) {
  // buildAllIifeFiles(getAllJSFiles());
  // executeCjsEsmBuilds();
  copySassFiles();
}

/**
 * Get a list of all JS/TS files (using glob pattern)
 * @return {String[]} list of files
 */
function getAllJSFiles() {
  return globSync(['src/**/*.{js,ts}']);
}

/** Execute full build of all format types (iife, cjs & esm) */
export async function executeFullBuild() {
  // get all JS in root(core), controls & plugins
  const allFiles = getAllJSFiles();

  // make sure "slick.core.js" (or .ts) is 1st file
  // we do this because the Slick object gets created first by slick.core.js, then we can extend Slick afterward
  allFiles.sort((a, b) => {
    const wordToBeFirst = /slick.core.[jt]s/;
    if (wordToBeFirst.test(a)) {
      return -1;
    } else if (wordToBeFirst.test(b)) {
      return 1;
    }
    return a > b;
  });

  // first CJS/ESM bundle as single file
  executeCjsEsmBuilds();

  // build iife in a separate process since all files are built separately instead of a single bundle
  return await buildAllIifeFiles(allFiles);
}

/**
 * Loop through all slick files and build them as separate iife files using esbuild
 */
export async function executeCjsEsmBuilds() {
  // build all other formats to a single bundled file
  for (const format of BUILD_FORMATS) {
    const startTime = new Date().getTime();
    await bundleByFormat(format);
    const endTime = new Date().getTime();
    console.info(`⚡️ Bundled to "${format}" format in ${endTime - startTime}ms`);
  }
}

/**
 * Bundle with esbuild to either CJS or ESM format
 * @param {"cjs" | "esm"} format - build format type
 */
export function bundleByFormat(format) {
  return runBuild({
    entryPoints: ['src/index.js'],
    format,
    target: 'es2020',
    treeShaking: true,
    define: { IIFE_ONLY: 'false' },
    outdir: `dist/${format}`,
  });
}

/** iife builds */
async function buildAllIifeFiles(allFiles) {
  const startTime = new Date().getTime();

  // loop through all js/ts files and build them one at a time in iife
  for (const file of allFiles) {
    if (/index.[j|t]s/i.test(file) || /.*\.d.ts/i.test(file)) {
      continue; // skip index.js and any *.d.ts files which are useless for iife
    }
    buildIifeFile(file);
  }
  const endTime = new Date().getTime();
  console.info(`⚡️ Built ${allFiles.length} files to "iife" format in ${endTime - startTime}ms`);
}

/** build as iife, every file will be bundled separately */
export async function buildIifeFile(file) {
  // for `slick.core.js` file only, we'll add it to the global Slick variable
  const globalName = /slick.core.[jt]s/gi.test(file) ? 'Slick' : undefined;

  await runBuild({
    entryPoints: [file],
    format: 'iife',
    globalName,
    define: { IIFE_ONLY: 'true' },
    outfile: `dist/browser/${file.replace('src', '').replace(/.[j|t]s/, '')}.js`,
    plugins: [
      removeImportsPlugin,
    ],
  });
}

/**
 * Run esbuild build with default configs, merge any options provided
 * @param {Object} [options] - optional esbuild options
 */
export function runBuild(options) {
  return build({
      // default options
      ...{
        color: true,
        bundle: true,
        minify: argv['minify'] || false,
        minifySyntax: true,
        target: 'es2015', // support ES6 and IE11
        sourcemap: true,
        logLevel: 'error',
        // packages: 'external', // check SortableJS
      },

      // merge any optional esbuild options
      ...options,
  }).catch(() => {
    // don't do anything when an error occured, this is to avoid watch mode to crash on errors
    // console.error('esbuild error: ', err);
  });
}

// --
// SASS related methods
// ----------------------

/** Copy all SASS input files to the dist output folder */
function copySassFiles() {
  // copy all scss files but exclude any variable files (any file starting with "_")
  copyfiles(
    ['src/styles/*.scss', 'dist/styles/sass'], // 1st in array is source, last is target
    { flat: true, up: 2, exclude: '**/_*.scss' },
    () => console.log('SASS files copied.')
  );
}

/** build all SASS (.scss) files, from "src/styles", to CSS (.css) */
export function buildAllSassFiles() {
  try {
    execSync('npm run sass:build');
  } catch (err) {
    // don't do anything when an error occured, this is to avoid watch mode to crash on errors
    // console.error('SASS error: ', JSON.stringify(err));
  }
}

/**
 * build an input SASS (.scss) file to CSS (.css),
 * if filename starts with "_" then it will trigger a full rebuild since it is a detected to be a SASS variable file.
 * @param {String} sassFile
 */
export function buildSassFile(sassFile) {
  let sassLogged = false;
  const filename = path.basename(sassFile, '.scss');
  // const extension = path.extname(sassFile);

  if (!sassLogged) {
    console.log('SASS file changes detected');
    sassLogged = true;
  }
  if (filename.startsWith('_')) {
    // when _variables changes, let's rebuild all SASS files instead of just one
    buildAllSassFiles();
    console.log('variable scss file changed, triggering full SASS rebuild', sassFile)
  } else {
    const srcDir = 'src';
    const distDir = 'dist';
    const basePath = path.join(process.cwd(), `/${srcDir}/styles`);
    const absoluteFilePath = path.relative(basePath, sassFile);
    const posixPath = absoluteFilePath.replaceAll('\\', '/');

    try {
      fs.outputFileSync(
        `${distDir ? distDir + '/' : ''}styles/css/${filename}.css`,
        sassCompile(`${srcDir ? srcDir + '/' : ''}styles/${posixPath}`, { style: 'compressed', quietDeps: true, noSourceMap: true }).css
      );
    } catch (err) {
      // don't do anything when an error occured, this is to avoid watch mode to crash on errors
      // console.error('SASS error: ', err);
    }
  }
}
