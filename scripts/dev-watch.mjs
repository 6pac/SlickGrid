import { subscribe } from '@parcel/watcher';
import browserSync from 'browser-sync';
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
 * Dev script that will watch for files changed and run esbuild/sass for the file(s) that changed
 * We use @parcel/watcher to watch source files and then run esbuild/sass for all 3 formats defined.
 */
(() => {
  let subscription;
  let bsync;
  let timer = 0;
  let changedFiles = new Set();
  let processing = false;
  let initialBuild = true; // on initial build we need to do full iife build

  /**
   * initialize @parcel/watcher watch & init browserSync
   * We are watching the files with extensions (.js, .ts, .html, .css, .scss) but we'll ignore folders like node_modules, dist & .git
   * Note: the watcher often send duplicate events, however the use of Set of file changes & the use of a setTimeout delay gets rid of this problem.
   */
  async function init() {
    subscription = subscribe(process.cwd(), (err, events) => {
      if (err) return onError(err);

      for (const event of events) {
        onFileChanged(event.path);
      }
    }, {
      ignore: [
        '**/.git/**',
        '**/dist/**',
        '**/node_modules/**',
        '!**/*.{ts,js,html,css,scss}' // which file extensions to watch
      ]
    });

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
   * Initialize and start BrowserSync
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
      startPath: 'examples/index.html',
      snippetOptions: {
        rule: {
          match: /<\/head>/i,
          fn: (snippet, match) => snippet.replace('id=', `nonce="browser-sync" id=`) + match
        }
      },
    }, () => {
      console.log('Use Ctrl+C to Quit');
    });
  }

  /** Log to the terminal any watch errors */
  function onError(err) {
    console.error('File watcher error', err);
  }

  /**
   * On file changes, we will perform a rebuild and/or reload the browser depending on the file extension being detected.
   * We add a setTimeout delay to throttle the callbacks to avoid calling the build too often.
   * @param {String} filepath - file path that changed
   */
  function onFileChanged(filepath) {
    if (timer) {
      clearTimeout(timer);
    }
    changedFiles.add(filepath);
    timer = setTimeout(() => {
      executeCommandCallback(Array.from(changedFiles).pop());
    }, 50);
  }

  function hasQueuedChanges() {
    if (changedFiles.size > 0) {
      return true;
    }

    return false;
  }

  function executeCommandCallback(filepath = '') {
    return new Promise(async (resolve) => {
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
          executeCommandCallback(Array.from(changedFiles).pop());
        }
      }
      resolve(true);
    });
  }

  async function destroy() {
    console.log('Exiting the dev file watch...');
    bsync.exit();
    (await subscription).unsubscribe();
  }

  // start dev watch process
  init();
})();