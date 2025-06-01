import { execAsyncPiped, spawnStreaming } from './child-process.mjs';

/** parse command line arguments, similar to parseArgs() from node but it accepts both `--camelCase` and `--snake-case` */
export function parseArgs(args) {
  const result = {};
  const argv = process.argv.slice(2);

  for (const key in args) {
    const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    const camelKey = key;
    const index = argv.findIndex(arg => arg === `--${kebabKey}` || arg === `--${camelKey}`);

    if (index !== -1) {
      if (args[key].type === 'boolean') {
        result[key] = true;
      } else {
        result[key] = argv[index + 1];
      }
    }
  }

  return result;
}

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
  return execAsyncPiped('npm', execArgs, { cwd });
}

/**
 * @param {{ cwd: String, dryRun: Boolean}} options
 * @returns {Promise<any>}
 */
export function syncLockFile({ cwd, dryRun }) {
  return execAsyncPiped('npm', ['install', '--package-lock-only', '--legacy-peer-deps'], { cwd }, dryRun);
}