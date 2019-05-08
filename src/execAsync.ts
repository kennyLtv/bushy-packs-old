import * as bluebird from 'bluebird';
import * as childProcess from 'child_process';
import { ExecResponse } from './interfaces';

export default function execAsync(
  line: string,
  options: childProcess.ExecOptions,
): bluebird<ExecResponse> {
  return new bluebird(
    (resolve, reject): void => {
      childProcess.exec(
        line,
        options,
        (err, stdout, stderror): void => {
          if (err) {
            console.log('stdout', stdout);
            console.log('stderror', stderror);

            reject(err);
          } else {
            const execResponse: ExecResponse = {
              stderror,
              stdout,
            };
            resolve(execResponse);
          }
        },
      );
    },
  );
}
