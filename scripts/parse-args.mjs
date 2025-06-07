/** parse command line arguments, similar to parseArgs() from node but it accepts both `--camelCase` and `--snake-case` */
export function parseArgs(args) {
  const result = {};
  const argv = process.argv.slice(2);

  for (const key in args) {
    const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    const camelKey = key;

    // Check if the option is present
    const index = argv.findIndex(arg => arg === `--${kebabKey}` || arg === `--${camelKey}`);
    if (index !== -1) {
      if (args[key].type === 'boolean') {
        result[key] = true;
      } else if (args[key].type === 'string') {
        result[key] = argv[index + 1];
      } else {
        throw new Error(`Unsupported type: ${args[key].type}`);
      }
    } else {
      // Check if the negated option is present
      const negatedIndex = argv.findIndex(arg => arg === `--no-${kebabKey}` || arg === `--no-${camelKey}`);
      if (negatedIndex !== -1 && args[key].type === 'boolean') {
        result[key] = false;
      }
    }
  }

  // handle help and version options
  if (argv.includes('--help') || argv.includes('-h')) {
    console.log('Available options:');
    for (const key in args) {
      console.log(`--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${args[key].description}`);
    }
    process.exit(0);
  }

  if (argv.includes('--version') || argv.includes('-v')) {
    console.log('0.1.6'); // replace with your actual version
    process.exit(0);
  }

  return result;
}
