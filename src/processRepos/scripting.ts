import { IParsedConfig, IExecResponse } from '../interfaces';
import recursiveCopy from '../recursiveCopy';
import * as fs from 'fs-extra';
import * as minimist from 'minimist';
import * as path from 'path';
import execAsync from '../execAsync';
import * as bluebird from 'bluebird';

const argv: minimist.ParsedArgs = minimist(process.argv.slice(2));

const argMod = argv.mod || 'csgo';
const argServerPath: string = argv.path
  ? path.resolve(__dirname, argv.path)
  : path.resolve(__dirname, '..', '..', 'test_dir');
const modPath = path.resolve(argServerPath, argMod);

const serverScriptingPath = path.join(
  modPath,
  'addons',
  'sourcemod',
  'scripting',
);

async function scripting(config: IParsedConfig, repoDir: string) {
  const repoScriptingPath = path.resolve(repoDir, 'scripting');

  await recursiveCopy(repoScriptingPath, serverScriptingPath, config.vars);

  const ls = await fs.readdir(repoScriptingPath);

  await bluebird.map(ls, async (script: string) => {
    if (path.extname(script) !== '.sp') {
      return;
    }

    const smxName = script.replace('.sp', '.smx');
    const command = `./spcomp ${script} -o../plugins/${smxName} -w203`;

    const { stderror, stdout }: IExecResponse = await execAsync(command, {
      cwd: serverScriptingPath,
    });

    if (stderror.trim()) {
      console.log(stderror.trim());
    }

    if (stdout.trim()) {
      console.log(stdout.trim());
    }
  });

}

export default scripting;
