/**
 * Copies *.d.ts files in 'types' folder to 'dist'.
 * Needed after tsc build, because tsc does not copy/include typings from d.ts files in dist directory
 */

const shell = require('shelljs');

shell.echo('Copying typings to dist...');
shell.cp('-R', `./lib/types`, `./dist/lib`);