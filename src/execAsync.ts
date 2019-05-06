import * as bluebird from 'bluebird';
import * as childProcess from 'child_process';
import { IExecResponse } from './interfaces';

export default function execAsync(
  line: string,
  options: childProcess.ExecOptions,
): bluebird<IExecResponse> {
  return new bluebird((resolve, reject) => {
    childProcess.exec(line, options, (err, stdout, stderror) => {
      if (err) {
        console.log('stdout', stdout);
        console.log('stderror', stderror);

        reject(err);
      } else {
        const execResponse: IExecResponse = {
          stderror,
          stdout,
        };
        resolve(execResponse);
      }
    });
  });
}
