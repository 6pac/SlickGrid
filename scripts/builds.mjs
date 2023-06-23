import { build } from 'esbuild';
import { execSync } from 'child_process';
import copyfiles from 'copyfiles';
import fs from 'fs-extra';
import { globSync } from 'glob';
import path from 'node:path';
import { compile as sassCompile } from 'sass';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { removeImportsPlugin } from './esbuild-plugins.mjs';

const argv = yargs(hideBin(process.argv)).argv;
export const BUILD_FORMATS = ['cjs', 'esm'];

if (argv.prod) {
  executeFullBuild();
  copySassFiles();
}
if (argv.test) {
  buildAllIifeFiles(getAllJSFiles());
  executeCjsEsmBuilds();
  copySassFiles();
}

function copySassFiles() {
  copyfiles(
    ['src/styles/scss/*.scss', 'dist/styles/sass'],
    { flat: true },
    () => {
      console.log('SASS files copied, proceeding to build all files');
    }
  );
}

function getAllJSFiles() {
  return globSync(['src/**/*.{js,ts}']);
}

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

export async function executeCjsEsmBuilds() {
  // build all other formats to a single bundled file
  for (const format of BUILD_FORMATS) {
    const startTime = new Date().getTime();
    await bundleByFormat(format);
    const endTime = new Date().getTime();
    console.info(`⚡️ Bundled to "${format}" format in ${endTime - startTime}ms`);
  }
}

// bundle by either CJS or ESM formats
export function bundleByFormat(format) {
  runBuild({
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

  for (const file of allFiles) {
    if (/index.[j|t]s/i.test(file) || file.includes('.d.ts')) {
      continue; // skip index.js and any *.d.ts files which are not useful for iife
    }
    buildIifeFile(file);
  }
  const endTime = new Date().getTime();
  console.info(`⚡️ Built ${allFiles.length} files to "iife" format in ${endTime - startTime}ms`);
}

/** build as iife, every file will be bundled separately */
export async function buildIifeFile(file) {
  let globalName;
  if (/slick.core.[jt]s/gi.test(file)) {
    globalName = 'Slick';
  }

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

/** generic run of esbuild with some default options */
export function runBuild(options) {
  try {
    return build({
      ...{
        color: true,
        bundle: true,
        minify: argv['minify'] || false,
        minifySyntax: true,
        target: 'es2015',
        sourcemap: argv['minify'] || false,
        logLevel: 'error',
        // packages: 'external', // check SortableJS
      },
      ...options,
    });
  } catch (err) {
    // console.error('esbuild error: ', err);
  }
}

export function buildAllSassFiles() {
  try {
    execSync('npm run sass:build');
  } catch (err) {
    // console.error('SASS error: ', JSON.stringify(err));
  }
}

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
    console.log('prefixed scss file changed', sassFile)
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
      // console.error('SASS error: ', err);
    }
  }
}
