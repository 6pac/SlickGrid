import conventionalChangelog from 'conventional-changelog';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const projectRootLocation = process.cwd();
const EOL = '\n';
const BLANK_LINE = EOL + EOL;
const CHANGELOG_HEADER = [
  '# Change Log',
  'All notable changes to this project will be documented in this file.',
  'See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.'
].join(EOL);

/**
 * Insert/Update "CHANGELOG.md" with conventional commits since last tagged version
 * @param { { infile: String, preset: String, tagPrefix: String } } args
 * @param {String} newVersion
 * @returns
 */
export function updateChangelog(args, newVersion) {
  const default_args = { preset: 'angular' };
  args = Object.assign({}, default_args, args);
  const { infile, preset, tagPrefix } = args;

  return new Promise((resolve, reject) => {
    let content = '';
    let oldContent = '';

    // read changelog.md if it exist or else we'll create it
    const changelogLocation = path.resolve(projectRootLocation, infile);
    const fileExist = existsSync(changelogLocation);
    if (fileExist) {
      oldContent = readFileSync(path.resolve(projectRootLocation, infile), 'utf8');
    }

    // find the position of the last release and remove header since we'll append it back on top
    let oldContentWithoutHeader = oldContent;
    if (oldContent.includes(CHANGELOG_HEADER)) {
      oldContentWithoutHeader = oldContent.substring(CHANGELOG_HEADER.length);
    }

    const context = { version: newVersion };
    const changelogStream = conventionalChangelog(
      { preset, tagPrefix },
      context,
      { merges: null, path: args.path }
    ).on('error', (err) => {
      return reject(err);
    });

    changelogStream.on('data', (buffer) => {
      content += buffer.toString();
    });

    changelogStream.on('end', () => {
      const newContent = [CHANGELOG_HEADER, content, oldContentWithoutHeader]
        .join(BLANK_LINE)
        .trim()
        .replace(/[\r\n]{2,}/gm, '\n\n'); // conventional-changelog adds way too many extra line breaks, let's remove a few of them

      writeFileSync(changelogLocation, newContent, 'utf8');

      return resolve({ location: changelogLocation, newEntry: content });
    });
  });
}
