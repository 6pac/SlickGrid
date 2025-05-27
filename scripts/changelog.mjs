import { ConventionalChangelog } from 'conventional-changelog';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const projectRootLocation = process.cwd();
const EOL = '\n';
const BLANK_LINE = EOL + EOL;
const headerEntries = [
  '# Change Log',
  '',
  'All notable changes to this project will be documented in this file.',
  'See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.'
]
const CHANGELOG_HEADER = headerEntries.join(EOL);

/**
 * Insert/Update "CHANGELOG.md" with conventional commits since last tagged version
 * @param { { infile: String, preset: String, tagPrefix: String } } args
 * @param {String} newVersion
 * @returns
 */
export function updateChangelog(args, newVersion) {
  const { infile, tagPrefix } = args;

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
    if (oldContent.includes(headerEntries.at(-1))) {
      oldContentWithoutHeader = oldContent.substring(CHANGELOG_HEADER.length + 1);
    }

    const changelogStream = new ConventionalChangelog()
      .readPackage()
      .loadPreset('angular')
      .commits({ path: args.path })
      .context({ version: newVersion })
      .tags({ prefix: tagPrefix })
      .writeStream();

    changelogStream.on('data', (buffer) => content += buffer.toString());
    changelogStream.on('error', (err) => reject(err));
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
