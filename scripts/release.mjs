import c from 'picocolors';
import { loadJsonFileSync } from 'load-json-file';
import { writeJsonSync } from 'fs-extra/esm';
import { copyFileSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import readline from 'readline';
import { rimrafSync } from 'rimraf';
import semver from 'semver';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { exec } from './child-process.mjs';
import { gitAdd, gitCommit, gitTag, gitTagPushRemote, gitPushToCurrentBranch, hasUncommittedChanges } from './git-utils.mjs';
import { createRelease, createReleaseClient, parseGitRepo } from './github-release.mjs';
import { publishPackage, syncLockFile } from './npm-utils.mjs';
import { runProdBuildWithTypes } from './builds.mjs';
import { updateChangelog } from './changelog.mjs';

const PUBLISH_CLEAN_FIELDS = ['devDependencies', 'scripts'];
const TAG_PREFIX = '';
const VERSION_PREFIX = 'v';
const RELEASE_COMMIT_MSG = 'chore(release): publish version %s';

const cwd = process.cwd();
const argv = yargs(hideBin(process.argv)).argv;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRootPath = path.join(__dirname, '../');
const pkg = loadJsonFileSync(path.join(projectRootPath, 'package.json'));

/**
 * Main entry, this script will execute the following steps
 * 1. Ask for version bump type
 * 2. Delete (empty) dist folder
 * 3. Bump version in "package.json" and "slick.grid.ts"
 * 4. Run a prod build (TS + SASS)
 * 5. Create/Update changelog.md
 * 6. Update (sync) npm lock file with new version
 * 7. Add all changed files to Git ("package.json", "slick.grid.ts", "CHANGELOG.md" and all minified files)
 * 8. Create git tag of the new release
 * 9. Commit all files changed to git
 * 10. Push git tags and all commits to origin
 * 11. NPM publish
 * 12. Create GitHub Release
 */
(async function main() {
  let dryRunPrefix = argv.dryRun ? '[dry-run]' : '';
  let newTag;
  if (argv.dryRun) {
    console.info(`-- ${c.bgMagenta('DRY-RUN')} mode --`);
  }
  await hasUncommittedChanges(argv);
  const repo = parseGitRepo();

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
      name: `${bumpType.bump} (${c.bold(c.magenta(bumpVersion(bumpType.bump, false)))}) ${bumpType.desc}`,
      value: bumpType.bump
    });
  }
  versionIncrements.push(
    { key: 'o', name: 'Other, please specify...', value: 'other' },
    { key: 'q', name: 'QUIT', value: 'quit' }
  );

  const defaultIdx = versionIncrements.length - 1;
  const whichBumpType = await promptConfirmation(
    `${c.bgMagenta(dryRunPrefix)} Select increment to apply (next version)`,
    versionIncrements,
    defaultIdx
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
    console.log(`${c.bgMagenta(dryRunPrefix)} Bumping new version to "${newTag}"`);

    // 2. delete (empty) dist folder
    console.log('Emptying dist folder');
    rimrafSync('dist');

    // 3. update package.json & slick.grid.ts with new version
    await updatePackageVersion(newVersion);
    await updateSlickGridVersion(newVersion);

    // 4. run a prod build (TS + SASS)
    await runProdBuildWithTypes();

    // 5. Create/Update changelog.md
    const { newEntry: newChangelogEntry } = await updateChangelog({
      infile: './CHANGELOG.md',
      preset: 'angular',
      tagPrefix: TAG_PREFIX,
    }, newVersion);

    // 6. Update (sync) npm lock file
    await syncLockFile({ cwd, dryRun: argv.dryRun });

    // 7. "git add ." all changed files
    await gitAdd(null, { cwd, dryRun: argv.dryRun });

    // show git changes to user so he can confirm the changes are ok
    const shouldCommitChanges = await promptConfirmation(`${c.bgMagenta(dryRunPrefix)} Ready to tag version "${newTag}" and push commits to remote? Choose No to cancel.`);
    if (shouldCommitChanges) {
      // 8. create git tag of new release
      await gitTag(newTag, { cwd, dryRun: argv.dryRun });

      // 9. Commit all files changed to git
      await gitCommit(RELEASE_COMMIT_MSG.replace(/%s/g, newVersion), { cwd, dryRun: argv.dryRun });

      // 10. Push git tags and all commits to origin
      await gitTagPushRemote(newTag, 'origin', { cwd, dryRun: argv.dryRun });
      await gitPushToCurrentBranch('origin', { cwd, dryRun: argv.dryRun });

      // 11. NPM publish
      if (await promptConfirmation(`${c.bgMagenta(dryRunPrefix)} Are you ready to publish "${newTag}" to npm?`)) {
        // create a copy of "package.json" to "package.json.backup" and remove (devDependencies, scripts) from "package.json"
        await cleanPublishPackage();

        // add publish --tag when version is alpha/beta
        let publishTagName;
        if (whichBumpType.includes('alpha')) {
          publishTagName = 'alpha';
        } else if (whichBumpType.includes('beta')) {
          publishTagName = 'beta';
        }

        const otp = await promptOtp(dryRunPrefix);
        await publishPackage(publishTagName, { cwd, otp, dryRun: argv.dryRun, stream: true });

        // rename backup to original filename "package.json"
        console.log(`Renaming "package.json" backup file to its original name.`);
        renameSync(path.join(projectRootPath, 'package.json.backup'), path.join(projectRootPath, 'package.json'));

        console.log(`${c.bgMagenta(dryRunPrefix)} 📦 Published to NPM - 🔗 https://www.npmjs.com/package/${pkg.name}`.trim());
      }

      // 12. Create GitHub Release
      if (argv.createRelease) {
        const releaseNote = { name: pkg.name, notes: newChangelogEntry };
        const releaseClient = createReleaseClient(argv.createRelease);
        await createRelease(
          releaseClient,
          { tag: newTag, releaseNote },
          { gitRemote: 'origin', execOpts: { cwd } },
          argv.dryRun
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

  if (argv.dryRun) {
    console.log(`${c.magenta('[dry-run]')}`);
  }
  writeJsonSync(path.resolve(projectRootPath, 'package.json'), pkg, { spaces: 2 });

  console.log('-- updating "package.json" --');
  console.log(` "version": "${pkg.version}"`);
  console.log('---------------------------\n');
}

/**
 * Update version property into "slick.grid.json"
 * @param {String} newVersion
 */
function updateSlickGridVersion(newVersion) {
  const slickGridFileContent = readFileSync(path.resolve(projectRootPath, 'src/slick.grid.ts'), { encoding: 'utf8', flag: 'r' });

  // replaces version in 2 areas (a version could be "2.4.45" or "2.4.45-alpha.0"):
  // 1- in top comments, ie: SlickGrid v2.4.45
  // 2- in public API definitions, ie: "slickGridVersion": "2.4.45",
  const updatedSlickGridJs = slickGridFileContent
    .replace(/(SlickGrid v)([0-9-.alpha|beta]*)/gi, `$1${newVersion}`)
    .replace(/(slickGridVersion) = '([0-9\.]*([\-\.]?alpha[\-\.]?|[\-\.]?beta[\-\.]?)?[0-9\-\.]*)'/gi, `$1 = '${newVersion}'`);

  if (argv.dryRun) {
    console.log(`${c.magenta('[dry-run]')}`);
  }
  writeFileSync(path.resolve(projectRootPath, 'src/slick.grid.ts'), updatedSlickGridJs);

  console.log('-- updating "src/slick.grid.ts" --');
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
    if (defaultIndex === undefined) {
      defaultIndex = 0;
    }
  }

  // display propmpt message and choices
  console.log(message.trim());
  for (var i = 0; i < choices.length; i++) {
    console.log(' ' + (i + 1) + ' - ' + choices[i].name);
  }

  // get and process input
  const input = await getConsoleInput(`Enter value (default ${(defaultIndex + 1)}): `);
  var index = !isNaN(input) && !isNaN(parseFloat(input)) ? +input - 1 : defaultIndex;
  if (index < 0 || index >= choices.length) {
    throw Error(`The input ${input} could not be matched to a selection`);
  }
  return choices[index].value;
}

async function promptOtp(dryRunPrefix = '') {
  const otp = await getConsoleInput(`${c.bgMagenta(dryRunPrefix)} If you have an OTP (One-Time-Password), type it now or press "Enter" to continue: \n`);
  if (!otp) {
    console.log('No OTP provided, continuing to next step...')
  } else if (otp.length > 0 && otp.length < 6) {
    throw new Error('OTP must be 6 exactly digits.');
  }
  return otp;
}

/** Method that will create a backup copy of the original "package.json", remove some fields (devDependencies, scripts) */
async function cleanPublishPackage() {
  console.log(`Make a copy of "package.json" and rename it to "package.json.backup".`);
  copyFileSync(path.join(projectRootPath, 'package.json'), path.join(projectRootPath, 'package.json.backup'));

  // remove (devDependencies & scripts) fields from "package.json"
  for (let field of PUBLISH_CLEAN_FIELDS) {
    await exec('npm', ['pkg', 'delete', field]);
  }
}