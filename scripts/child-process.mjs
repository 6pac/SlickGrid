import os from 'node:os';
import logTransformer from 'strong-log-transformer';
import { x } from 'tinyexec';
import c from 'tinyrainbow';

// bookkeeping for spawned processes
const children = new Set();

/**
 * Execute a command asynchronously, piping stdio by default.
 * @param {String} command - shell command
 * @param {String[]} execArgs - shell command arguments
 * @param {import("tinyexec").Options} [opts] - tinyexec node options
 * @param {Boolean} [cmdDryRun]
 */
export function execAsyncPiped(command, execArgs, execOpts, cmdDryRun) {
  const options = {
    nodeOptions: {
      ...execOpts,
      stdio: ['pipe'],
    }
  };
  const spawned = spawnProcess(command, execArgs, options, cmdDryRun);

  return cmdDryRun ? Promise.resolve() : wrapError(spawned);
}

/**
 * Execute a command synchronously.
 * @param {String} command - shell command
 * @param {String[]} args - shell command arguments
 * @param {import("tinyexec").Options} [opts] - tinyexec options
 * @param {Boolean} [cmdDryRun] - dry-run flag
 */
export async function execAsync(command, args, opts, cmdDryRun = false) {
  return cmdDryRun
    ? logExecDryRunCommand(command, args)
    : (await x('git', args, opts)).stdout.trim();
}

/**
 * Log the exec command without actually executing the actual command
 * @param {String} command - shell command
 * @param {String[]} args - shell command arguments
 * @returns {String} output
 */
export function logExecDryRunCommand(command, args) {
  const argStr = (Array.isArray(args) ? args.join(' ') : args) ?? '';

  const cmdList = [];
  for (const cmd of [command, argStr]) {
    cmdList.push(Array.isArray(cmd) ? cmd.join(' ') : cmd);
  }

  console.info(c.magenta(c.bold('[dry-run] >')), cmdList.join(' '));
  return '';
}

/**
 * @param {String} command - shell command
 * @param {String[]} args - shell command arguments
 * @param {import("tinyexec").Options} execOpts - tinyexec options
 * @returns {Promise<any>}
 */
export async function spawnProcess(
  command,
  args,
  execOpts,
  cmdDryRun = false
) {
  if (cmdDryRun) {
    return logExecDryRunCommand(command, args);
  }
  const child = x(command, args, execOpts);
  const drain = (_code, signal) => {
    children.delete(child);

    // don't run repeatedly if this is the error event
    if (signal === undefined) {
      child.process.removeListener('exit', drain);
    }
  };

  child.process.once('exit', drain);
  child.process.once('error', drain);
  children.add(child);

  return child;
}

/**
 * Spawn a command asynchronously, streaming stdio with optional prefix.
 * @param {String} command
 * @param {String[]} args
 * @param {import("tinyexec").Options} [opts]
 * @param {String} [prefix]
 * @param {Boolean} [cmdDryRun=false]
 */
// istanbul ignore next
export function spawnStreaming(
  command,
  args,
  opts,
  prefix,
  cmdDryRun = false
) {
  const options = {
    ...opts,
    nodeOptions: {
      stdio: ['ignore', 'pipe'],
    }
  };

  if (cmdDryRun) {
    return logExecDryRunCommand(command, args);
  }
  const spawned = spawnProcess(command, args, options, cmdDryRun);

  const stdoutOpts = {};
  const stderrOpts = {}; // mergeMultiline causes escaped newlines :P

  if (prefix) {
    const color = c['magenta'];
    stdoutOpts.tag = `${color.bold(prefix)}:`;
    stderrOpts.tag = `${color(prefix)}:`;
  }

  // Avoid 'Possible EventEmitter memory leak detected' warning due to piped stdio
  if (children.size > process.stdout.listenerCount('close')) {
    process.stdout.setMaxListeners(children.size);
    process.stderr.setMaxListeners(children.size);
  }

  spawned.stdout?.pipe(logTransformer(stdoutOpts)).pipe(process.stdout);
  spawned.stderr?.pipe(logTransformer(stderrOpts)).pipe(process.stderr);

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
 * @param {import("tinyexec").Output} spawned
 */
function wrapError(spawned) {
  return spawned.catch((err) => {
    // ensure exit code is always a number
    err.exitCode = getExitCode(err);

    console.error('SPAWN PROCESS ERROR');
    throw err;
  });
}
