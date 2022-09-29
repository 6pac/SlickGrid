const childProcess = require('./child-process.js');

/**
 * @param {String} [publishTagName] - optional publish tag (alpha, beta, ...)
 * @param {{ cwd: String, dryRun: Boolean}} options
 * @returns {Promise<any>}
 */
function publishPackage(publishTagName, { cwd, dryRun }) {
    const execArgs = ['publish'];
    if (publishTagName) {
        execArgs.push('--tag', publishTagName);
    }
    if (dryRun) {
        execArgs.push('--dry-run');
    }
    return childProcess.execStreaming('npm', execArgs, { cwd });
}

/**
 * @param {{ cwd: String, dryRun: Boolean}} options
 * @returns {Promise<any>}
 */
function syncLockFile({ cwd, dryRun }) {
    return childProcess.exec('npm', ['install', '--package-lock-only'], { cwd }, dryRun);
}

// exports
module.exports = {
    publishPackage,
    syncLockFile,
}