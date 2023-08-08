import c from 'picocolors';
import { exec } from 'child_process';
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

// when --prod is provided, we'll do a full build of all JS/TS files and also all SASS files
if (argv.prod) {
  prodBuild();
}

// --test is only used for testing purpose,
// TODO: this should eventually be removed before the next major release (also remove npm script)
if (argv.test) {
  buildTest();
}

async function prodBuild() {
  await executeFullBuild();
  await buildAllSassFiles();
  copySassFiles();
  // execSync('npm run build:types:prod');
}

async function buildTest() {
  await buildAllIifeFiles();
  await executeEsmBuild();
  await copySassFiles();
}

/**
 * Get a list of all JS/TS files (using glob pattern)
 * @return {String[]} list of files
 */
function getAllJSFiles() {
  const allFiles = globSync(['src/**/*.{js,ts}']);

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

  return allFiles;
}

/** Execute full build of all format types (iife & esm) */
export async function executeFullBuild() {
  // first execute ESM bundle to single file
  await executeEsmBuild();

  // build iife in a separate process since all files are built separately instead of a single bundle
  return await buildAllIifeFiles();
}

/**
 * Loop through all slick files and build them as separate iife files using esbuild
 */
export async function executeEsmBuild() {
  // build all other formats to a single bundled file
  const startTime = new Date().getTime();
  await bundleAsEsm();
  const endTime = new Date().getTime();
  console.log(`[${c.yellow('esbuild ⚡')}] Bundled to "esm" format in ${endTime - startTime}ms`);
}

/**
 * Bundle with esbuild to ESM format
 */
export function bundleAsEsm() {
  const format = 'esm';
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
export async function buildAllIifeFiles() {
  const allFiles = getAllJSFiles();
  const startTime = new Date().getTime();

  // loop through all js/ts files and build them one at a time in iife
  for (const file of allFiles) {
    // skip "index.js", "src/models/*.ts" or any *.d.ts files which are useless for iife
    if (/index.[j|t]s/i.test(file) || /src[\\/]models[\\/].*\.ts/i.test(file) || /.*\.d.ts/i.test(file)) {
      continue;
    }
    buildIifeFile(file, false);
  }
  const endTime = new Date().getTime();
  console.log(`[${c.yellow('esbuild ⚡')}] Built ${allFiles.length} files to "iife" format in ${endTime - startTime}ms`);
}

/** build as iife, every file will be bundled separately */
export async function buildIifeFile(file, displayLog = true) {
  // for `slick.core.js` file only, we'll add it to the global Slick variable
  const globalName = /slick.core.[jt]s/gi.test(file) ? 'Slick' : undefined;
  const startTime = new Date().getTime();
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

  if (displayLog) {
    const endTime = new Date().getTime();
    console.log(`[${c.yellow('esbuild ⚡')}] Built "${file}" to "iife" format in ${endTime - startTime}ms`);
  }
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
      target: 'es2018',
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
    () => console.log(`[${c.magenta('SASS')}] SASS files copied`)
  );
}

/** build all SASS (.scss) files, from "src/styles", to CSS (.css) */
export function buildAllSassFiles() {
  try {
    return new Promise((resolve) => {
      exec('npm run sass:build').on('close', (code) => {
        console.log(`[${c.magenta('SASS')}] Full SASS build completed`);
        resolve(code);
      });
    });
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
export async function buildSassFile(sassFile) {
  let sassLogged = false;
  const filename = path.basename(sassFile, '.scss');
  // const extension = path.extname(sassFile);

  if (!sassLogged) {
    console.log(`[${c.magenta('SASS')}] SASS file changes detected`);
    sassLogged = true;
  }
  if (filename.startsWith('_')) {
    // when _variables changes, let's rebuild all SASS files instead of just one
    console.log(`[${c.magenta('SASS')}] scss variable file changed, requires full SASS rebuild (triggered by`, `"${sassFile}")`);
    await buildAllSassFiles();
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
