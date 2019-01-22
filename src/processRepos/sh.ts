import * as childProcess from 'child_process';
import { IParsedConfig, IEnvVars, IExecResponse } from '../interfaces';
import execAsync from '../execAsync';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as _ from 'lodash';

async function sh(config: IParsedConfig, repoDir: string) {
  const allVars: IEnvVars = {};
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
  _.each(keys, key => {
    exportString += `${key}="${config.vars[key]}" `;
  });

  const { stderror, stdout }: IExecResponse = await execAsync(
    `${exportString}bash init.sh`,
    execOptions,
  );

  if (stdout.trim()) {
    console.log(stdout.trim());
  }

  if (stderror.trim()) {
    console.error('Error: ', stderror.trim());
  }
}

export default sh;
