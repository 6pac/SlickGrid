import { subscribe } from '@parcel/watcher';
import browserSync from 'browser-sync';
import { relative } from 'node:path';

import {
  buildAllSassFiles,
  buildIifeFile,
  buildSassFile,
  buildAllIifeFiles,
  executeCjsEsmBuilds,
  executeFullBuild
} from './builds.mjs';
import { parseArgs } from './parse-args.mjs';

const argv = parseArgs({
  serve: { type: 'boolean' },
  open: { type: 'boolean' },
});

const browserSyncHost = process.env.BROWSERSYNC_HOST || '127.0.0.1';
const browserSyncPort = Number.parseInt(process.env.BROWSERSYNC_PORT || '8080', 10);
const watchedFilePattern = /\.(?:js|ts|html|css|scss)$/i;

/**
 * BrowserSync injects its own client script, which a page serving a strict CSP would
 * reject. Rather than making the CSP example carry dev-server tokens it would never
 * ship with, grant them here, only on the pages that declare a policy and only while
 * this dev server is the one serving them.
 */
const browserSyncTrustedTypesPolicy = `<script nonce="browser-sync">
  if (window.trustedTypes && trustedTypes.createPolicy) {
    trustedTypes.createPolicy('browser-sync', {
      createScriptURL: (url) => {
        const parsedUrl = new URL(url, document.baseURI);
        if (parsedUrl.origin !== window.location.origin || !parsedUrl.pathname.startsWith('/browser-sync/')) {
          throw new TypeError('Only same-origin BrowserSync script URLs are allowed');
        }
        return parsedUrl.href;
      }
    });
  }
</script>`;

const cspRewriteRule = {
  match: /<meta http-equiv="Content-Security-Policy"[\s\S]*?">/,
  fn: (_req, _res, match) =>
    match.replace("script-src 'self'", "script-src 'self' 'nonce-browser-sync'").replace('trusted-types dompurify', 'trusted-types dompurify browser-sync') +
    browserSyncTrustedTypesPolicy,
};

/**
 * Dev script that will watch for files changed and run esbuild/sass for the file(s) that changed.
 * We use @parcel/watcher to watch source files and then run esbuild or SASS CLIs to build our supported formats (.js, .ts, .html, .css, .scss).
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
    subscription = await subscribe(process.cwd(), (err, events) => {
      if (err) return onError(err);

      for (const event of events) {
        const changedFilePath = relative(process.cwd(), event.path).replaceAll('\\', '/');
        if (watchedFilePattern.test(changedFilePath)) {
          onFileChanged(changedFilePath, event.type);
        }
      }
    }, {
      ignore: [
        '**/.git/**',
        '**/dist/**',
        '**/cypress/**',
        '**/node_modules/**'
      ]
    });

    // also watch for any Signal termination to cleanly exit the watch command
    process.once('SIGINT', () => destroy());
    process.once('SIGTERM', () => destroy());
    // run full prod build `/dist` and full SASS build
    if (!argv.serve) {
      await executeFullBuild();
      await buildAllSassFiles();
    }
    // The initial build above already built every IIFE file. Do not rebuild
    // the entire IIFE set on the first subsequent source change.
    initialBuild = false;

    // start browser-sync server
    await startBrowserSync();
  }

  /**
   * Initialize and start BrowserSync
   * see https://browsersync.io/docs/api#api-watch
   */
  async function startBrowserSync() {
    bsync = browserSync.create();

    await new Promise((resolve, reject) => {
      bsync.init({
        server: './',
        rewriteRules: [cspRewriteRule],
        host: browserSyncHost,
        port: browserSyncPort,
        ui: false,
        // File watching and rebuilds are handled by @parcel/watcher below.
        // BrowserSync only serves the examples and receives explicit reloads.
        watch: false,
        online: false,
        open: argv.open,
        startPath: 'examples/index.html',
        snippetOptions: {
          rule: {
            match: /<\/head>/i,
            fn: (snippet, match) => snippet.replace('id=', `nonce="browser-sync" id=`) + match
          }
        }
      }, (err) => {
        if (err) {
          const startupError = new Error(`BrowserSync could not start at http://${browserSyncHost}:${browserSyncPort}: ${err.message}`);
          onError(startupError);
          reject(startupError);
          return;
        }
        console.log(`BrowserSync serving at http://${browserSyncHost}:${browserSyncPort}`);
        console.log('Use Ctrl+C to Quit');
        resolve();
      });
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
  function onFileChanged(filepath, eventType = 'update') {
    if (timer) {
      clearTimeout(timer);
    }
    changedFiles.add(filepath);
    console.log(`[Watch] ${eventType}: ${filepath}`);
    timer = setTimeout(() => {
      timer = 0;
      void executeCommandCallback(Array.from(changedFiles).pop());
    }, 150);
  }

  function hasQueuedChanges() {
    if (changedFiles.size > 0) {
      return true;
    }

    return false;
  }

  async function executeCommandCallback(filepath = '') {
    if (processing) {
      return;
    }

    processing = true;
    changedFiles.delete(filepath);
    console.log(`[Watch] Rebuilding: ${filepath}`);

    try {
      if (filepath.endsWith('.js') || filepath.endsWith('.ts')) {
        // 1. ESM requires a full build because it ends up bundled into a single "index.js" file.
        await executeCjsEsmBuilds();

        // 2. IIFE files are built separately, so rebuild only the changed file.
        await (initialBuild ? buildAllIifeFiles() : buildIifeFile(filepath));
      } else if (filepath.endsWith('.scss')) {
        await buildSassFile(filepath);
      }

    } catch (err) {
      onError(err);
    } finally {
      // Always request a full browser reload after a change, including when a
      // TypeScript rebuild reports an error. Passing a file pattern here would
      // emit a file-change event rather than guarantee a page reload.
      bsync?.reload();
      console.log(`[Watch] Browser reload requested: ${filepath}`);
      processing = false;
      initialBuild = false;

      // Process the latest queued change after the current build completes.
      if (hasQueuedChanges()) {
        void executeCommandCallback(Array.from(changedFiles).pop());
      }
    }
  }

  async function destroy() {
    console.log('Exiting the dev file watch...');
    bsync?.exit();
    await subscription?.unsubscribe();
  }

  // start dev watch process
  init().catch((err) => {
    onError(err);
    void destroy();
  });
})();
