import { IParsedConfig, IEnvVars, IExecResponse } from '../interfaces';
import * as childProcess from 'child_process';

import * as path from 'path';
import * as _ from 'lodash';

import execAsync from '../execAsync';

async function node(config: IParsedConfig, repoDir: string) {
  const allVars: IEnvVars = _.merge(config.vars, process.env);
  const execOptions: childProcess.ExecOptions = {
    cwd: path.join(repoDir, 'node'),
    env: allVars,
  };

  const { stderror, stdout }: IExecResponse = await execAsync(
    'npm install --loglevel=error --no-audit && node ./index.js',
    execOptions,
  );

  console.log(stdout);

  if (stderror) {
    console.error(stderror);
  }
}

export default node;
