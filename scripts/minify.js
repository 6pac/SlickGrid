const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const litePreset = require('cssnano-preset-lite');
const postcss = require('postcss');
const fs = require('fs-extra');
const path = require('path');
const UglifyJS = require('uglify-js');
const rimraf = require('rimraf');
const pkg = require("../package.json");

const header =
  `/**
    * SlickGrid v${pkg.version}
    * (c) 2009-present Michael Leibman
    * homepage: http://github.com/mleibman/slickgrid
    * license: MIT
    * date: {{date}}
    * file: {{filename}}
    */`;

// empty dist folder and then minify all the JS files it found in the root & plugins folder
rimraf('dist', async (error) => {
    if (!error) {
        const cssFileList = getFileListToMinify('.css');
        const jsFileList = getFileListToMinify('.js');
        await minifyCssFiles(cssFileList);
        await minifyJsFiles(jsFileList);

        // also copy the images into the "/dist" folder so that all CSS url() still work
        fs.copySync('./images', './dist/images');
        console.log('\n-----------------');
        console.log('// ALL DONE!!! //');
        console.log('//-------------//\n');
    }
});

/** Ensure folder exist or else create it */
function ensureDirectoryExistence(filePath) {
    var dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

/** Minify an array of CSS files */
async function minifyCssFiles(filenames) {
    const preset = litePreset({});
    console.log('//-- CSS Minify --//');
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
    }
}

/** Minify an array of JS files */
function minifyJsFiles(filenames) {
    console.log('\n');
    console.log('//-- JS Minify --//');
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
                    preamble: header.replace('{{date}}', new Date().toISOString()).replace('{{filename}}', filename),
                },
                sourceMap: true
            });

        fs.writeFileSync(writeFilePath, minifiedFile.code, 'utf8');
        fs.writeFileSync(writeFileSourcePath, minifiedFile.map, 'utf8');
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