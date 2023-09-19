import { exec } from './child-process.mjs';

/**
 * @param {Array<String>} [files]
 * @param {{ cwd: String, dryRun: Boolean}} options
 * @returns {Promise<any>}
 */
export function gitAdd(files, { cwd, dryRun }) {
  const execArgs = files ? ['add', '--', ...files] : ['add', '.'];
  return exec('git', execArgs, { cwd }, dryRun);
}

/**
 * @param {String} commitMsg
 * @param {{ cwd: String, dryRun: Boolean}} options
 * @returns {Promise<any>}
 */
export function gitCommit(commitMsg, { cwd, dryRun }) {
  const execArgs = ['commit', '-m', commitMsg];
  return exec('git', execArgs, { cwd }, dryRun);
}

/**
 * @param {String} commitMsg
 * @param {{ cwd: String, dryRun: Boolean}} options
 * @returns {Promise<any>}
 */
export async function gitCurrentBranchName({ cwd }) {
  const execArgs = ['branch', '--show-current'];
  const procRtn = await exec('git', execArgs, { cwd });
  return procRtn.stdout;
}

/**
 * @param {String} tag - tag name
 * @param {{ cwd: String, dryRun: Boolean}} options
 * @returns {Promise<any>}
 */
export function gitTag(tag, { cwd, dryRun }) {
  const execArgs = ['tag', tag, '-m', tag];
  return exec('git', execArgs, { cwd }, dryRun);
}

/**
 * @param {String} tag - tag name
 * @param {String} [remote=origin]
 * @param {{ cwd: String, dryRun: Boolean}} options
 * @returns {Promise<any>}
 */
export function gitTagPushRemote(tag, remote = 'origin', { cwd, dryRun }) {
  const execArgs = ['push', remote, tag];
  return exec('git', execArgs, { cwd }, dryRun);
}

/**
 * @param {String} tag - tag name
 * @param {String} [remote=origin]
 * @param {{ cwd: String, dryRun: Boolean}} options
 * @returns {Promise<any>}
 */
export async function gitPushToCurrentBranch(remote = 'origin', { cwd, dryRun }) {
  const branchName = await gitCurrentBranchName({ cwd });
  const execArgs = ['push', remote, branchName];
  return exec('git', execArgs, { cwd }, dryRun);
}

/**
 * Check if there's anything uncommited
 * @param {{ cwd: String, dryRun: Boolean; skipChecks: Boolean; }} options
 */
export async function hasUncommittedChanges({ cwd, skipChecks }) {
  const execArgs = ['status', '--porcelain', '-uno'];
  const { stdout } = await exec('git', execArgs, { cwd });
  if (stdout.length && !skipChecks) {
    throw Error('Working tree has uncommitted changes, please commit or remove the following changes before continuing.');
  }
}
