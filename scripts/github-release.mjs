import 'dotenv/config';
import { Octokit } from '@octokit/rest';
import parseGitUrl from 'git-url-parse';
import newGithubReleaseUrl from 'new-github-release-url';
import { styleText } from 'node:util';
import semver from 'semver';

import { execAsync } from './child-process.mjs';

function createGitHubClient() {
  const { GITHUB_TOKEN } = process.env;

  const options = {};
  if (GITHUB_TOKEN) {
    options.auth = `token ${GITHUB_TOKEN}`;
  }

  return new Octokit(options);
}

/**
 * Parse git repo to get all its details
 * @param {String} [remote]
 * @param {Object} [opts]
 * @returns
 */
export async function parseGitRepo(remote = 'origin', opts) {
  const args = ['config', '--get', `remote.${remote}.url`];
  const url = await execAsync('git', args, opts);

  if (!url) {
    throw new Error(`Git remote URL could not be found using "${remote}".`);
  }

  return parseGitUrl(url);
}

export function createReleaseClient(type) {
  switch (type) {
    case 'github':
      return createGitHubClient();
    default:
      throw new Error('Invalid release client type');
  }
}

/**
 * @param {ReturnType<typeof createReleaseClient>} client
 * @param {{ tags: string[]; releaseNotes: { name: string; notes: string; }[] }} commandProps
 * @param {{ gitRemote: string; execOpts: import('@lerna/child-process').ExecOpts }} opts
 */
export async function createRelease(
  client,
  { tag, releaseNote },
  { gitRemote, execOpts },
  gitDryRun = false
) {
  const { GITHUB_TOKEN } = process.env;
  const repo = await parseGitRepo(gitRemote, execOpts);
  const { notes, name } = releaseNote;

  if (!tag) {
    return Promise.resolve();
  }

  const prereleaseParts = semver.prerelease(tag.replace(`${name}@`, '')) || [];

  if (!GITHUB_TOKEN) {
    const releaseUrl = newGithubReleaseUrl({
      user: repo.owner,
      repo: repo.name,
      tag,
      isPrerelease: prereleaseParts.length > 0,
      title: tag,
      body: notes
    });
    console.log(`🏷️ (GitHub Release web interface) - 🔗 ${releaseUrl}`);
    return Promise.resolve();
  }

  const releaseOptions = {
    owner: repo.owner,
    repo: repo.name,
    tag_name: tag,
    name: tag,
    body: notes,
    draft: false,
    prerelease: prereleaseParts.length > 0,
  };

  if (gitDryRun) {
    const host = 'github.com';
    console.info(
      `${styleText('bgMagenta', '[dry-run]')} 🔗 https://${host}/${releaseOptions.owner}/${releaseOptions.repo}/releases/tag/${releaseOptions.tag_name} 🏷️ (GitHub Release)`
    );
    return Promise.resolve();
  }

  return await client.repos.createRelease(releaseOptions);
}
