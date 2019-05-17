import { ParsedConfig, EnvVars } from '../interfaces';
import * as childProcess from 'child_process';

import * as path from 'path';
import * as _ from 'lodash';

import execAsync from '../execAsync';

async function node(config: ParsedConfig, repoDir: string): Promise<void> {
  const allVars: EnvVars = _.merge(config.vars, process.env);
  const execOptions: childProcess.ExecOptions = {
    cwd: path.join(repoDir, 'node'),
    env: allVars,
  };

  const stdout = await execAsync(
    'npm install --loglevel=error --no-audit && node ./index.js',
    execOptions,
  );

  console.log(stdout);
}

export default node;
