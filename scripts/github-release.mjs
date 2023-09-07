import 'dotenv/config';
import { Octokit } from '@octokit/rest';
import c from 'picocolors';
import parseGitUrl from 'git-url-parse';
import newGithubReleaseUrl from 'new-github-release-url';
import semver from 'semver';

import { execSync } from './child-process.mjs';

function createGitHubClient() {
  const { GITHUB_TOKEN } = process.env;

  const options = {};
  if (GITHUB_TOKEN) {
    options.auth = `token ${GITHUB_TOKEN}`;
  }

  return new Octokit(options);
}

/**
 *
 * @param {String} [remote]
 * @param {Object} [opts]
 * @returns
 */
export function parseGitRepo(remote = 'origin', opts) {
  const args = ['config', '--get', `remote.${remote}.url`];
  const url = execSync('git', args, opts);

  if (!url) {
    throw new Error(`Git remote URL could not be found using "${remote}".`);
  }

  return parseGitUrl(url);
}

export function createReleaseClient(type) {
  switch (type) {
    // case 'gitlab':
    //   return createGitLabClient();
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
export function createRelease(
  client,
  { tag, releaseNote },
  { gitRemote, execOpts },
  gitDryRun = false
) {
  const { GITHUB_TOKEN } = process.env;
  const repo = parseGitRepo(gitRemote, execOpts);
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
    // const repo = await client.repos.get({
    //     owner: releaseOptions.owner,
    //     repo: releaseOptions.repo,
    // });
    const host = 'github.com';
    console.info(
      // JSON.stringify(releaseOptions)
      `${c.bgMagenta('[dry-run]')} 🔗 https://${host}/${releaseOptions.owner}/${releaseOptions.repo}/releases/tag/${releaseOptions.tag_name} 🏷️ (GitHub Release)`
    );
    return Promise.resolve();
  }

  return client.repos.createRelease(releaseOptions);
}
