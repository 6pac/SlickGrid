const chalk = require('chalk');
const os = require('os');
const execa = require('execa');
const logTransformer = require('strong-log-transformer');

// bookkeeping for spawned processes
const children = new Set();

/**
 * Execute a command asynchronously, piping stdio by default.
 * @param {string} command
 * @param {string[]} execArgs
 * @param {import("execa").Options} [opts]
 * @param {Boolean} [cmdDryRun]
 */
function exec(command, execArgs, execOpts, cmdDryRun) {
    const options = Object.assign({ stdio: 'pipe' }, execOpts);
    const spawned = spawnProcess(command, execArgs, options, cmdDryRun);

    return cmdDryRun ? Promise.resolve() : wrapError(spawned);
}

/**
 * Execute and stream a command asynchronously, piping stdio by default.
 * @param {string} command
 * @param {string[]} execArgs
 * @param {import("execa").Options} [opts]
 * @param {Boolean} [cmdDryRun]
 */
function execStreaming(command, execArgs, execOpts, cmdDryRun) {
    const options = Object.assign({}, execOpts);
    options.stdio = ['ignore', 'pipe'];
    const spawned = spawnStreaming(command, execArgs, options, '', cmdDryRun);

    return cmdDryRun ? Promise.resolve() : wrapError(spawned);
}

/**
 * Execute a command synchronously.
 * @param {string} command
 * @param {string[]} args
 * @param {import("execa").SyncOptions} [opts]
 * @param {Boolean} [cmdDryRun]
 */
function execSync(command, args, opts, cmdDryRun = false) {
    return cmdDryRun ? logExecDryRunCommand(command, args) : execa.sync(command, args, opts).stdout;
}

/**
 * Log the exec command without actually executing the actual command
 * @param {String} command 
 * @param {string[]} args
 * @returns {String} output
 */
function logExecDryRunCommand(command, args) {
    const argStr = (Array.isArray(args) ? args.join(' ') : args) ?? '';

    const cmdList = [];
    for (const c of [command, argStr]) {
        cmdList.push(Array.isArray(c) ? c.join(' ') : c);
    }

    console.info(chalk.bold.magenta('[dry-run] >'), cmdList.join(' '));
    return '';
}

/**
 * @param {string} command
 * @param {string[]} args
 * @param {import("execa").Options} execOpts
 */
function spawnProcess(
    command,
    args,
    execOpts,
    cmdDryRun = false
) {
    if (cmdDryRun) {
        return logExecDryRunCommand(command, args);
    }
    const child = execa(command, args, execOpts);
    const drain = (_code, signal) => {
        children.delete(child);

        // don't run repeatedly if this is the error event
        if (signal === undefined) {
            child.removeListener('exit', drain);
        }
    };

    child.once('exit', drain);
    child.once('error', drain);
    children.add(child);

    return child;
}

/**
 * Spawn a command asynchronously, streaming stdio with optional prefix.
 * @param {string} command
 * @param {string[]} args
 * @param {import("execa").Options} [opts]
 * @param {string} [prefix]
 * @param {Boolean} [cmdDryRun=false]
 */
// istanbul ignore next
function spawnStreaming(
    command,
    args,
    opts,
    prefix,
    cmdDryRun = false
) {
    const options = Object.assign({}, opts);
    options.stdio = ['ignore', 'pipe'];

    if (cmdDryRun) {
        return logExecDryRunCommand(command, args);
    }
    const spawned = spawnProcess(command, args, options, cmdDryRun);

    const stdoutOpts = {};
    const stderrOpts = {}; // mergeMultiline causes escaped newlines :P

    if (prefix) {
        const color = chalk['magenta'];
        stdoutOpts.tag = `${color.bold(prefix)}:`;
        stderrOpts.tag = `${color(prefix)}:`;
    }

    // Avoid 'Possible EventEmitter memory leak detected' warning due to piped stdio
    if (children.size > process.stdout.listenerCount('close')) {
        process.stdout.setMaxListeners(children.size);
        process.stderr.setMaxListeners(children.size);
    }

    spawned.stdout.pipe(logTransformer(stdoutOpts)).pipe(process.stdout);
    spawned.stderr.pipe(logTransformer(stderrOpts)).pipe(process.stderr);

    return wrapError(spawned);
}

// --
// private functions

/**
 * Return the exitCode when possible or else throw an error
 * @param {*} result 
 * @returns 
 */
function getExitCode(result) {
    // https://nodejs.org/docs/latest-v6.x/api/child_process.html#child_process_event_close
    if (typeof result.code === 'number' || typeof result.exitCode === 'number') {
        return result.code ?? result.exitCode;
    }

    // https://nodejs.org/docs/latest-v6.x/api/errors.html#errors_error_code
    // istanbul ignore else
    if (typeof result.code === 'string' || typeof result.exitCode === 'string') {
        return os.constants.errno[result.code ?? result.exitCode];
    }

    // istanbul ignore next: extremely weird
    throw new Error(`Received unexpected exit code value ${JSON.stringify(result.code ?? result.exitCode)}`);
}

/**
 * Spawn a command asynchronously, _always_ inheriting stdio.
 * @param {string} command
 * @param {string[]} args
 * @param {import("execa").Options} [opts]
 */
function wrapError(spawned) {
    return spawned.catch((err) => {
        // ensure exit code is always a number
        err.exitCode = getExitCode(err);

        console.error('SPAWN PROCESS ERROR');
        throw err;
    });
}


module.exports = {
    exec,
    execStreaming,
    execSync,
    spawnProcess,
    spawnStreaming,
}