const chalk = require('chalk');
const fs = require('fs-extra');
const readline = require('readline');
const path = require('path');
const semver = require('semver');
const yargs = require('yargs');

const changelogUtil = require('./changelog.js');
const gitUtils = require('./git-utils.js');
const githubRelease = require('./github-release.js');
const minify = require('./minify.js');
const npmUtils = require('./npm-utils.js');
const pkg = require('../package.json');

const TAG_PREFIX = '';
const VERSION_PREFIX = 'v';
const RELEASE_COMMIT_MSG = 'chore(release): publish version %s';

const argv = yargs.argv;
const options = argv;
const cwd = process.cwd();

const childProcess = require('./child-process.js');


/**
 * Main entry, this script will execute the following steps
 * 1. Ask for version bump type
 * 2. Bump version in "package.json" and "slick.grid.js"
 * 3. Run minify script and add the new version number to each minified file headers
 * 4. Create/Update changelog.md
 * 5. Update (sync) npm lock file with new version
 * 6. Add all changed files to Git ("package.json", "slick.grid.js", "CHANGELOG.md" and all minified files)
 * 7. Create git tag of the new release
 * 8. Commit all files changed to git
 * 9. Push git tags and all commits to origin
 * 10. NPM publish
 * 11. Create GitHub Release
 */
(async function main() {
  let dryRunPrefix = options.dryRun ? '[dry-run]' : '';
  let newTag;
  if (options.dryRun) {
    console.info(`-- ${chalk.bgMagenta('DRY-RUN')} mode --`);
  }
  await gitUtils.hasUncommittedChanges(options);
  const repo = githubRelease.parseGitRepo();


  console.log(`🚀 Let's create a new release for "${repo.owner}/${repo.name}" (currently at ${pkg.version})\n`);

  // 1. choose bump type
  const bumpTypes = [
    { bump: 'patch', desc: ' - Bug Fixes' },
    { bump: 'minor', desc: ' - Features & Fixes' },
    { bump: 'major', desc: ' - Breaking Change' },
    { bump: 'preminor.alpha', desc: '' },
    { bump: 'preminor.beta', desc: '' },
    { bump: 'premajor.alpha', desc: '' },
    { bump: 'premajor.beta', desc: '' },
  ]
  const versionIncrements = [];
  for (const bumpType of bumpTypes) {
    versionIncrements.push({
      key: bumpType.bump,
      name: `${bumpType.bump} (${chalk.bold.magenta(bumpVersion(bumpType.bump, false))}) ${bumpType.desc}`,
      value: bumpType.bump
    });
  }
  versionIncrements.push(
    { key: 'o', name: 'Other, please specify...', value: 'other' },
    { key: 'q', name: 'QUIT', value: 'quit' }
  );

  const whichBumpType = await promptConfirmation(
    `${chalk.bgMagenta(dryRunPrefix)} Select increment to apply (next version)`,
    versionIncrements,
    defaultIndex = versionIncrements.length - 1
  );

  if (whichBumpType !== 'quit') {
    let newVersion = '';
    if (whichBumpType === 'other') {
      newVersion = await getConsoleInput('Please enter a valid version number (or type "q" to quit):');
      if (newVersion === 'q') {
        return;
      }
    } else {
      newVersion = bumpVersion(whichBumpType, false);
    }

    newTag = `${TAG_PREFIX}${newVersion}`;
    console.log(`${chalk.bgMagenta(dryRunPrefix)} Bumping new version to "${newTag}"`);

    // 2. update package.json & slick.grid.js with new version
    await updatePackageVersion(newVersion);
    await updateSlickGridVersion(newVersion);

    // 3. minify JS/CSS files
    const changedFiles = await minify.execute(newVersion);
    changedFiles.add(path.resolve('./package.json'));
    changedFiles.add(path.resolve('./slick.grid.js'));

    // 4. Create/Update changelog.md
    const { location: changelogPath, newEntry: newChangelogEntry } = await changelogUtil.updateChangelog({
      infile: './CHANGELOG.md',
      preset: 'angular',
      tagPrefix: TAG_PREFIX,
    }, newVersion);
    changedFiles.add(changelogPath);

    // 5. Update (sync) npm lock file
    await npmUtils.syncLockFile({ cwd, dryRun: options.dryRun });
    changedFiles.add(path.resolve('./package-lock.json'));

    // 6. "git add" all changed files
    options.dryRun
      ? await gitUtils.gitAdd(null, { cwd, dryRun: options.dryRun })
      : await gitUtils.gitAdd(Array.from(changedFiles), { cwd, dryRun: options.dryRun });

    // show git changes to user so he can confirm the changes are ok
    const shouldCommitChanges = await promptConfirmation(`${chalk.bgMagenta(dryRunPrefix)} Ready to tag version "${newTag}" and push commits to remote? Choose No to cancel.`);
    if (shouldCommitChanges) {
      // 7. create git tag of new release
      await gitUtils.gitTag(newTag, { cwd, dryRun: options.dryRun });

      // 8. Commit all files changed to git
      await gitUtils.gitCommit(RELEASE_COMMIT_MSG.replace(/%s/g, newVersion), { cwd, dryRun: options.dryRun });

      // 9. Push git tags and all commits to origin
      await gitUtils.gitTagPushRemote(newTag, 'origin', { cwd, dryRun: options.dryRun });
      await gitUtils.gitPushToCurrentBranch('origin', { cwd, dryRun: options.dryRun });

      // 10. NPM publish
      const shouldPublish = await promptConfirmation(`${chalk.bgMagenta(dryRunPrefix)} Are you ready to publish "${newTag}" to npm?`);
      if (shouldPublish) {
        let publishTagName;
        if (whichBumpType.includes('alpha')) {
          publishTagName = 'alpha';
        } else if (whichBumpType.includes('beta')) {
          publishTagName = 'beta';
        }
        await npmUtils.publishPackage(publishTagName, { cwd, dryRun: options.dryRun });
        console.log(`${chalk.bgMagenta(dryRunPrefix)} 🔗 https://www.npmjs.com/package/${pkg.name} 📦 (npm)`.trim())
      }

      // 11. Create GitHub Release
      if (options.createRelease) {
        const releaseNote = { name: pkg.name, notes: newChangelogEntry };
        const releaseClient = githubRelease.createReleaseClient(options.createRelease);
        await githubRelease.createRelease(
          releaseClient,
          { tag: newTag, releaseNote },
          { gitRemote: 'origin', execOpts: { cwd: process.cwd() } },
          options.dryRun
        );
      }

      // END
      console.log(`🏁 Done (in ${Math.floor(process.uptime())}s.)`);
    }
  }
  process.exit();
})();

/**
 * Use semver to increment the version given a bump type
 * @param {String} bump
 * @returns {String}
 */
function bumpVersion(bump) {
  const isPreReleased = bump.startsWith('pre');
  const oldVersion = pkg.version;

  if (isPreReleased) {
    if (bump.includes('.alpha') || bump.includes('.beta')) {
      const [semverBump, preReleaseType] = bump.split('.');
      // const [oldSemVersion] = oldVersion.match(/^(\d\.\d\.\d)(\-)?((alpha|beta|next)\.\d)?$/) || [];

      if ((preReleaseType === 'alpha' && oldVersion.includes('alpha.'))
        || (preReleaseType === 'beta' && oldVersion.includes('beta.'))
        || (preReleaseType === 'beta' && oldVersion.includes('alpha.'))
      ) {
        return semver.inc(oldVersion, 'prerelease', preReleaseType);
      }
      return semver.inc(oldVersion, semverBump, true, preReleaseType);
    } else {
      return semver.inc(oldVersion, bump, true, 'alpha');
    }
  }
  return semver.inc(oldVersion, bump);
}

/**
 * Update version property into "package.json"
 * @param {String} newVersion
 */
function updatePackageVersion(newVersion) {
  pkg.version = newVersion;

  if (options.dryRun) {
    console.log(`${chalk.magenta('[dry-run]')}`);
  }
  fs.writeJsonSync(path.resolve(__dirname, '../package.json'), pkg, { spaces: 2 });

  console.log('-- updating "package.json" --');
  console.log(` "version": "${pkg.version}"`);
  console.log('---------------------------\n');
}

/**
 * Update version property into "slick.grid.json"
 * @param {String} newVersion
 */
function updateSlickGridVersion(newVersion) {
  const slickGridJs = fs.readFileSync(path.resolve(__dirname, '../slick.grid.js'), { encoding: 'utf8', flag: 'r' });

  // replaces version in 2 areas (a version could be "2.4.45" or "2.4.45-alpha.0"): 
  // 1- in top comments, ie: SlickGrid v2.4.45
  // 2- in public API definitions, ie: "slickGridVersion": "2.4.45",
  const updatedSlickGridJs = slickGridJs
    .replace(/(SlickGrid v)([0-9-.alpha|beta]*)/gi, `$1${newVersion}`)
    .replace(/("slickGridVersion"): "([0-9\.]*([\-\.]?alpha[\-\.]?|[\-\.]?beta[\-\.]?)?[0-9\-\.]*)"/gi, `$1: "${newVersion}"`);

  if (options.dryRun) {
    console.log(`${chalk.magenta('[dry-run]')}`);
  }
  fs.writeFileSync(path.resolve(__dirname, '../slick.grid.js'), updatedSlickGridJs);

  console.log('-- updating "slick.grid.js" --');
  console.log(` SlickGrid ${VERSION_PREFIX}${newVersion}`)
  console.log('----------------------------\n');
}

/**
 * Get console input using the 'readLine' lib
 * @param {String} promptText - prompt question message
 * @returns {Promise<String>} - the entered input
 */
function getConsoleInput(promptText) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => rl.question(promptText, ans => {
    rl.close();
    resolve(ans);
  }))
}

/**
 * Simple function to select an item from a passed list of choices
 * @param {String} message - prompt question message
 * @param {Array<String>} [choices] - prompt list of choices, defaults to Yes/No
 * @param {Number} [defaultIndex]
 * @returns {Promise<String>} - value property of selected choice
 * @returns
 */
async function promptConfirmation(message, choices, defaultIndex) {
  if (!choices) {
    choices = [
      { key: 'y', name: 'Yes', value: true },
      { key: 'n', name: 'No', value: false },
    ];
    defaultIndex = 0;
  }

  // display propmpt message and choices
  console.log(message.trim());
  for (var i=0; i<choices.length; i++) {
    console.log(' ' + (i+1) + ' - ' + choices[i].name);
  }

  // get and process input
  const input = await getConsoleInput("Enter value "  + " (default " + (defaultIndex + 1) + ') ');
  var index = !isNaN(input) && !isNaN(parseFloat(input)) ? +input - 1 : defaultIndex;
  if (index < 0 || index >= choices.length) {
     throw Error('The input ' + input + ' could not be matched to a selection');
  }
  return choices[index].value;
}
