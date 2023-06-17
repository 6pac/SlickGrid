import browserSync from 'browser-sync';
import chokidar from 'chokidar';

import { buildAllSassFiles, buildIifeFile, buildSassFile, executeFullBuild } from './builds.mjs';

/**
 * Dev script that will watch for files changed and run esbuild for the file that changed
 * We use Chokidar to watch source files and then run esbuild for all 3 formats defined.
 */
(() => {
  let watcher;
  let bsync;

  /** initialize Chokidar watch & init browserSync */
  async function init() {
    // change to new dir after moving files to src folder: 'src/**/*.{ts,js}'
    // also remove dist after we use dist folder only
    watcher = chokidar.watch('**/*.{ts,js,html,css,scss}', {
      cwd: process.cwd(),
      ignored: ['**/.git/**', '**/dist/**', '**/dist/**', '**/node_modules/**', '**/tests/**'],
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

    // run full prod build (/dist) & SASS files
    await executeFullBuild();
    buildAllSassFiles();

    // start server
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
      // proxy: "http://localhost:8080",
      watchTask: true,
      online: false,
      startPath: 'examples/index.html'
    }, () => {
      console.log('Use Ctrl+C to Quit');
    });
  }

  function onError(err) {
    console.error('Chokidar watch error', err);
  }

  /** On file changes, depending on the file extension we will rebuild and/or reload browser */
  async function onFileChanged(filepath) {
    if (filepath.endsWith('.js') || filepath.endsWith('.ts')) {
      // 1. CJS/ESM is full build in single bundle
      executeFullBuild();

      // 2. build separate iife file(s)
      const startTime = new Date().getTime();
      buildIifeFile(filepath);
      const endTime = new Date().getTime();
      console.info(`⚡️ Built ${filepath} to "iife" format in ${endTime - startTime}ms`);
    } else if (filepath.endsWith('.html')) {
      // HTML files, reload all connected browser when html file changes
      // bsync.reload('*.html');
    } else if (filepath.endsWith('.css') || filepath.endsWith('.scss')) {
      // CSS/SCSS files
      if (filepath.endsWith('.scss')) {
        await buildSassFile(filepath);
      }
    }

    // in every case we want to reload the webpage
    bsync.reload('*.html');
    // bsync.reload(['*.js', '*.html']);
  }

  async function destroy() {
    console.log('Exiting the file watch...');
    bsync.exit();
    watcher.close();
  }

  // start watch process
  init();
})();