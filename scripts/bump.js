const pkg = require('../package.json');
const fs = require('fs-extra');
const path = require('path');
const semver = require('semver');
const yargs = require('yargs');
const argv = yargs.argv;

async function bumpVersion(bump) {
    const oldVersion = pkg.version;
    const newVersion = semver.inc(oldVersion, bump);
    if (newVersion !== oldVersion) {
        pkg.version = newVersion;
        fs.writeJsonSync(path.resolve(__dirname, '../package.json'), pkg, { spaces: 2 });
        console.log('------------------------');
        console.log('new version bump:', pkg.version)
        console.log('------------------------');
    }
}

bumpVersion(argv['bump']);