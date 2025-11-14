import { execAsyncPiped } from './child-process.mjs';

/**
 * @param {Array<String>} [files]
 * @param {{ cwd: String, dryRun: Boolean}} options
 * @returns {Promise<any>}
 */
export async function gitAdd(files, { cwd, dryRun }) {
  const execArgs = files ? ['add', '--', ...files] : ['add', '.'];
  return execAsyncPiped('git', execArgs, { cwd }, dryRun);
}

/**
 * @param {String} commitMsg
 * @param {{ cwd: String, dryRun: Boolean}} options
 * @returns {Promise<any>}
 */
export async function gitCommit(commitMsg, { cwd, dryRun }) {
  const execArgs = ['commit', '-m', commitMsg];
  return execAsyncPiped('git', execArgs, { cwd }, dryRun);
}

/**
 * @param {String} commitMsg
 * @param {{ cwd: String, dryRun: Boolean}} options
 * @returns {Promise<any>}
 */
export async function gitCurrentBranchName({ cwd }) {
  const execArgs = ['branch', '--show-current'];
  const procRtn = await execAsyncPiped('git', execArgs, { cwd });
  return procRtn.stdout;
}

/**
 * @param {String} tag - tag name
 * @param {{ cwd: String, dryRun: Boolean}} options
 * @returns {Promise<any>}
 */
export async function gitTag(tag, { cwd, dryRun }) {
  const execArgs = ['tag', tag, '-m', tag];
  return execAsyncPiped('git', execArgs, { cwd }, dryRun);
}

/**
 * @param {String} tag - tag name
 * @param {String} [remote=origin]
 * @param {{ cwd: String, dryRun: Boolean}} options
 * @returns {Promise<any>}
 */
export async function gitTagPushRemote(tag, remote = 'origin', { cwd, dryRun }) {
  const execArgs = ['push', remote, tag];
  return execAsyncPiped('git', execArgs, { cwd }, dryRun);
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
  return execAsyncPiped('git', execArgs, { cwd }, dryRun);
}

/**
 * @param {String} tag - tag name
 * @param {String} [remote=origin]
 * @param {{ cwd: String, dryRun: Boolean}} options
 * @returns {Promise<any>}
 */
export async function gitPushUpstreamBranch(remote = 'origin', { cwd, branch, dryRun }) {
  try {
    const branchName = branch || 'master';
    console.log(`🚀 Preparing to push branch: ${branchName} to remote: ${remote}`);

    // If in dry run mode, just log the intended action
    if (dryRun) {
      console.log(`[DRY RUN] Would push ${branchName} to ${remote}`);
      return;
    }

    // Push strategies
    const pushStrategies = [
      ['push', '-u', remote, branchName],
      ['push', '--set-upstream', remote, branchName],
      ['push', remote, branchName]
    ];

    for (const strategy of pushStrategies) {
      try {
        console.log(`🛫 Attempting push: git ${strategy.join(' ')}`);
        const result = await execAsyncPiped('git', strategy, { cwd }, dryRun);
        console.log('✅ Push Successful');
        return result;
      } catch (strategyError) {
        console.warn(`❌ Push failed with strategy ${strategy.join(' ')}`,
          strategyError.message || 'Unknown error');
      }
    }

    throw new Error('All push strategies failed');
  } catch (error) {
    console.error('🚨 Upstream Push Error:', error.message);
    throw error;
  }
}

/**
 * Check if there's anything uncommited
 * @param {{ cwd: String, dryRun: Boolean; skipChecks: Boolean; }} options
 */
export async function hasUncommittedChanges({ cwd, skipChecks }) {
  const execArgs = ['status', '--porcelain', '-uno'];
  const { stdout } = await execAsyncPiped('git', execArgs, { cwd });
  if (stdout.length && !skipChecks) {
    throw Error('Working tree has uncommitted changes, please commit or remove the following changes before continuing.');
  }
}
