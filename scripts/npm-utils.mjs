import { exec, spawnStreaming } from './child-process.mjs';

/**
 * Run `npm publish`
 * @param {String} [publishTagName] - optional publish tag (alpha, beta, ...)
 * @param {{ cwd: String, dryRun: Boolean}} options
 * @returns {Promise<any>}
 */
export function publishPackage(publishTagName, { cwd, otp, dryRun, stream }) {
  const execArgs = ['publish'];
  if (publishTagName) {
    execArgs.push('--tag', publishTagName);
  }
  if (otp) {
    execArgs.push('--otp', otp);
  }
  if (dryRun) {
    execArgs.push('--dry-run');
  }

  if (stream) {
    return spawnStreaming('npm', execArgs, { cwd });
  }
  return exec('npm', execArgs, { cwd });
}

/**
 * @param {{ cwd: String, dryRun: Boolean}} options
 * @returns {Promise<any>}
 */
export function syncLockFile({ cwd, dryRun }) {
  return exec('npm', ['install', '--package-lock-only'], { cwd }, dryRun);
}