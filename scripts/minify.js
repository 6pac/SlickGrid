const autoprefixer = require('autoprefixer');
const chalk = require('chalk');
const cssnano = require('cssnano');
const litePreset = require('cssnano-preset-lite');
const postcss = require('postcss');
const fs = require('fs-extra');
const path = require('path');
const UglifyJS = require('uglify-js');
const rimraf = require('rimraf');
const yargs = require('yargs');

const pkg = require("../package.json");
const argv = yargs.argv;

const changedFiles = new Set();

/**
 * Get SlickGrid header that will be prepended to each JS file
 * @param {String} [newVersion]
 * @returns {String}
 */
 function getSlickGridHeader(newVersion) {
    return `/**
 * SlickGrid v${newVersion}
 * (c) 2009-present Michael Leibman
 * homepage: http://github.com/mleibman/slickgrid
 * license: MIT
 * date: {{date}}
 * file: {{filename}}
 */`;
  }

/**
 * Execute the minification process which will return a Set of changed files
 * @param {String} [version] - optional version
 * @returns {Set<String>} - changed files
 */
function execute(version) {
    // empty dist folder and then minify all the JS files it found in the root & plugins folder
    return new Promise((resolve, reject) => {
        rimraf('dist', async (error) => {
            if (error) {
                reject(error);
            } else {
                const cssFileList = getFileListToMinify('.css');
                const jsFileList = getFileListToMinify('.js');
                await minifyCssFiles(cssFileList);
                await minifyJsFiles(jsFileList, version);

                // also copy the images into the "/dist" folder so that all CSS url() still work
                fs.copySync('./images', './dist/images');
                console.log('\n');
                console.log(`// ${chalk.green('DONE MINIFYING!!!')} //`);
                console.log('-----------------------\n');

                resolve(changedFiles);
            }
        });
    });
}

/** Minify an array of CSS files */
async function minifyCssFiles(filenames) {
    const preset = litePreset({});
    console.log(`//-- ${chalk.cyan('CSS Minify')} --//`);
    console.log('--------------------');

    for (const filename of filenames) {
        console.log(filename);
        const inputFile = fs.readFileSync(filename, 'utf8');
        const writeFilePath = './dist/' + filename.replace('./', '')
            .replace('.css', '.min.css');

        const result = await postcss([cssnano({ preset, plugins: [autoprefixer] })])
            .process(inputFile, { from: undefined });

        const minifiedCss = result.css.replace(/(url\(.*)(\.css)([\W]\))/gi, '$1.min.css$3');

        ensureDirectoryExistence(writeFilePath);
        fs.writeFileSync(writeFilePath, minifiedCss, 'utf8');
        changedFiles.add(path.resolve(writeFilePath));
    }
}

/**
 * Minify an array of JS files
 * @param {String} [version] - optional version
 */
function minifyJsFiles(filenames, version) {
    // use version provided or get it from package.json when undefined
    let newVersion = version || pkg.version;

    console.log('\n');
    console.log(`//-- ${chalk.cyan('JS Minify')} --//`);
    console.log('-------------------');

    for (const filename of filenames) {
        console.log(filename);
        const writeFilePath = './dist/' + filename.replace('./', '').replace('.js', '.min.js');
        const writeFileSourcePath = './dist/' + filename.replace('./', '').replace('.js', '.js.map');
        ensureDirectoryExistence(writeFilePath);

        const minifiedFile = UglifyJS.minify(
            {
                filename: fs.readFileSync(filename, "utf8")
            },
            {
                // uglify options
                output: {
                    beautify: false,
                    preamble: getSlickGridHeader(newVersion).replace('{{date}}', new Date().toISOString().substring(0, 10)).replace('{{filename}}', filename),
                },
                sourceMap: true
            });

        fs.writeFileSync(writeFilePath, minifiedFile.code, 'utf8');
        fs.writeFileSync(writeFileSourcePath, minifiedFile.map, 'utf8');
        changedFiles.add(path.resolve(writeFilePath));
    }
}

function getFileListToMinify(extension) {
    let filePaths = [];
    const fileLocations = ['./', './controls/', './plugins/', './examples/'];

    for (const folderPath of fileLocations) {
        const filesOnDisk = fs.readdirSync(folderPath);
        const filteredFiles = filesOnDisk.filter(filename => {
            return filename.endsWith(extension) && !filename.includes('index')
        });

        filePaths = filePaths.concat(filteredFiles.map(file => `${folderPath}${file}`));
    }
    return filePaths;
}

/**
 * Ensure folder exist or else create it
 * @param {String} filePath
 * @returns {Boolean}
 */
function ensureDirectoryExistence(filePath) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

if (argv['start']) {
    execute();
}

module.exports = {
    execute
}