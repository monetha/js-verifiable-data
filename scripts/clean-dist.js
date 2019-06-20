/**
 * Deletes dist folder
 */

const shell = require('shelljs');

shell.echo('Removing dist folder...');
if (shell.rm('-rf', './dist').code !== 0) {
  shell.echo('ERROR: failed to remove directory');
  shell.exit(1);
  return;
};