import browserSync from 'browser-sync';
import chokidar from 'chokidar';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { buildAllSassFiles, buildIifeFile, buildSassFile, executeFullBuild } from './builds.mjs';

const argv = yargs(hideBin(process.argv)).argv;

/**
 * Dev script that will watch for files changed and run esbuild for the file that changed
 * We use Chokidar to watch source files and then run esbuild for all 3 formats defined.
 */
(() => {
  let watcher;
  let bsync;

  /**
   * initialize Chokidar watch & init browserSync
   * we will watch for `src/` and `examples/` folders for any files that changed with the following extensions (js, ts, html, css, scss)
   */
  async function init() {
    watcher = chokidar.watch('**/*.{ts,js,html,css,scss}', {
      cwd: process.cwd(),
      ignored: ['**/.git/**', '**/dist/**', '**/node_modules/**'],
      ignoreInitial: true,
      ignorePermissionErrors: true,
      persistent: true
    });

    watcher
      .on('all', (_event, path) => onFileChanged(path))
      .on('error', (error) => onError(error));

    // also watch for any Signal termination to cleanly exit the watch command
    process.once('SIGINT', () => destroy());
    process.once('SIGTERM', () => destroy());
    process.stdin.on('end', () => destroy());
    process.stdin.on('exit', () => process.stdin.destroy());

    // run full prod build `/dist` and full SASS build
    if (!argv.serve) {
      await executeFullBuild();
      buildAllSassFiles(); // start SASS build but don't wait for it
    }

    // start browser-sync server
    startBrowserSync();
  }

  /**
   * Start and initialize BrowserSync
   * see https://browsersync.io/docs/api#api-watch
   */
  async function startBrowserSync() {
    bsync = browserSync.create();

    bsync.init({
      server: './',
      port: 8080,
      watchTask: true,
      online: false,
      open: argv.open,
      startPath: 'examples/index.html'
    }, () => {
      console.log('Use Ctrl+C to Quit');
    });
  }

  function onError(err) {
    console.error('Chokidar watch error', err);
  }

  /**
   * On file changes, we will perform certain action(s) depending on the file extension detected,
   * we will rebuild and/or reload browser
   * @param {String} filepath - file path that changed
   */
  async function onFileChanged(filepath) {
    if (filepath.endsWith('.js') || filepath.endsWith('.ts')) {
      // 1. CJS/ESM requires a full build since it is bundled into a single index.js output
      await executeFullBuild();

      // 2. for iife format, we can rebuild each separate file
      const startTime = new Date().getTime();
      await buildIifeFile(filepath);
      const endTime = new Date().getTime();
      console.info(`⚡️ Built "${filepath}" to "iife" format in ${endTime - startTime}ms`);
    } else if (filepath.endsWith('.css') || filepath.endsWith('.scss')) {
      // CSS/SCSS files
      if (filepath.endsWith('.scss')) {
        await buildSassFile(filepath);
      }
    }
    // ELSE, reaching outside of the conditions above (ie, .html)
    // will simply perform the common action, shown below, of reloading all connected browser


    // in every case, we want to reload the webpage
    bsync.reload('*.html');
  }

  async function destroy() {
    console.log('Exiting the dev file watch...');
    bsync.exit();
    watcher.close();
  }

  // start dev watch process
  init();
})();