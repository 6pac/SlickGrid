/** esbuild plugin to remove any imports from iife build since we'll be using the Slick object on the window object */
export const removeImportsPlugin = {
  name: 'remove-imports-plugin',
  setup(build) {
    build.onResolve({ filter: /.*/ }, (args) => {
      if (args.kind !== 'entry-point') {
        return { path: args.path + '.js', namespace: 'import-ns' }
      }
    });
    build.onLoad({ filter: /.*/, namespace: 'import-ns' }, () => ({
      contents: `// empty string, do nothing`,
      loader: 'js',
    }));
  }
}
