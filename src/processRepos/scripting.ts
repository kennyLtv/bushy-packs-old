import { IParsedConfig, IExecResponse } from '../interfaces';
import recursiveCopy from '../recursiveCopy';
import * as fs from 'fs-extra';
import * as path from 'path';
import execAsync from '../execAsync';
import * as bluebird from 'bluebird';

import { modPath } from '../args';

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
      console.log(`found a non .sp file: ${script}`);
      return;
    }

    console.log(`Running: ${script}`);
    
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
