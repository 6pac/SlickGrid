import browserSync from 'browser-sync';
import chokidar from 'chokidar';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import {
  buildAllSassFiles,
  buildIifeFile,
  buildSassFile,
  buildAllIifeFiles,
  executeCjsEsmBuilds,
  executeFullBuild
} from './builds.mjs';

const argv = yargs(hideBin(process.argv)).argv;

/**
 * Dev script that will watch for files changed and run esbuild for the file that changed
 * We use Chokidar to watch source files and then run esbuild for all 3 formats defined.
 */
(() => {
  let watcher;
  let bsync;
  let timer = 0;
  let changedFiles = new Set();
  let processing = false;
  let initialBuild = true; // on initial build we need to do full iife build

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
  function onFileChanged(filepath) {
    changedFiles.add(filepath);
    return executeCommandCallback(filepath);
  }

  function hasQueuedChanges() {
    if (changedFiles.size > 0) {
      return true;
    }

    return false;
  }

  function executeCommandCallback(filepath = '') {
    if (timer) {
      clearTimeout(timer);
    }
    return new Promise((resolve) => {
      timer = setTimeout(async () => {
        if (!processing) {
          processing = true;
          if (filepath.endsWith('.js') || filepath.endsWith('.ts')) {
            // 1. ESM requires is always a full build since it is bundled into a single "index.js" file
            await executeCjsEsmBuilds();

            // 2. for iife format, we can rebuild each separate file (unless it's the initial build, if so execute full rebuild)
            await (initialBuild
              ? buildAllIifeFiles()
              : buildIifeFile(filepath)
            );
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
          changedFiles.delete(filepath);
          processing = false;
          if (initialBuild) {
            initialBuild = false;
          }

          // we might still have other packages that have changes though, so re-execute command callback process if any were found
          if (hasQueuedChanges()) {
            executeCommandCallback();
          }
        }
        resolve(true);
      }, 50);
    });
  }

  async function destroy() {
    console.log('Exiting the dev file watch...');
    bsync.exit();
    watcher.close();
  }

  // start dev watch process
  init();
})();