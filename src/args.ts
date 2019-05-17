import * as path from 'path';
import * as commander from 'commander';

interface CLI extends commander.Command {
  config?: string;
  dir?: string;
  key?: string;
  preset?: string;
  repo?: string;
  bitbucket?: boolean;
  mod?: string;
}

const program: CLI = commander
  .version('0.1.0')
  .usage('[options] --dir <dir> --config <config> --preset <preset>')
  .option('-m, --mod <mod>', 'The mod you are using. (cstrike|csgo)', 'csgo')
  .option('-c, --config <config>', 'The repo that holds your config.')
  .option('-d, --dir <dir>', 'The directory that holds your mod directory.')
  .option(
    '-k, --key <key>',
    'The name of the key in your .ssh folder.',
    'id_rsa',
  )
  .option('-p, --preset <preset>', 'The preset within your config')
  .option(
    '-r, --repo <repo>',
    'A specific repo if you only want to install one.',
  )
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

const modDir = path.resolve(program.dir, program.mod);

const args = {
  modDir,
  dir: path.resolve(program.dir),
  ...program,
};

export = args;
