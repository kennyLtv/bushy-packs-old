import * as path from 'path';
import * as commander from 'commander';

interface InterfaceCLI extends commander.Command {
  path?: string
  config?: string
  dir?: string
  key?: string
  preset?: string
  repo?: string
  bitbucket?: boolean
  mod? : string
}

const program: InterfaceCLI = commander
  .version('0.1.0')
  .usage('[options] <file>')
  .option('-m, --mod [mod]', 'The mod you are using. (cstring|csgo)', 'csgo')
  .option('-c, --config <repo>', 'The repo that holds your config.')
  .option('-d, --dir <dir>', 'The directory that holds your mod directory.')
  .option('-k, --key [name]', 'The name of the key in your .ssh folder.', 'id_rsa')
  .option('-p, --preset <name>', 'The preset within your config')
  .option('-r, --repo [name]', 'A specific repo if you only want to install one.')
  .option('-b, --bitbucket', 'Use this if you are on bitbucket')
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
  process.exit();
}

if (typeof program.config === 'undefined') {
  console.error('You did not specify a config repo.');
  process.exit(1);
}

if (typeof program.dir === 'undefined') {
  console.error('You did not specify which directory.');
  process.exit(1);
}

if (typeof program.preset === 'undefined') {
  console.error('You did not specify which preset.');
  process.exit(1);
}

const modPath = path.resolve(program.path, program.mod);

const args = {
  modPath,
  ...program
};

export = args;
