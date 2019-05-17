import * as childProcess from 'child_process';
import { ParsedConfig, EnvVars } from '../interfaces';
import execAsync from '../execAsync';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as _ from 'lodash';

async function sh(config: ParsedConfig, repoDir: string): Promise<void> {
  const allVars: EnvVars = {};
  _.merge(allVars, config.vars);
  _.merge(allVars, process.env);

  const shellDir: string = path.join(repoDir, 'sh');
  const initPath: string = path.join(shellDir, 'init.sh');

  const execOptions: childProcess.ExecOptions = {
    cwd: shellDir,
    env: allVars,
  };

  await fs.chmod(initPath, '755');

  const keys: string[] = Object.keys(config.vars);
  let exportString = '';
  _.each(
    keys,
    (key): void => {
      exportString += `${key}="${config.vars[key]}" `;
    },
  );

  const stdout = await execAsync(`${exportString}bash init.sh`, execOptions);

  console.log(stdout);
}

export default sh;
