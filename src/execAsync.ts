import * as bluebird from 'bluebird';
import * as childProcess from 'child_process';

export default function execAsync(
  line: string,
  options: childProcess.ExecOptions,
): bluebird<string> {
  return new bluebird(
    (resolve, reject): void => {
      childProcess.exec(
        line,
        options,
        (err, stdout, stderror): void => {
          if (err) {
            reject(err);
          } else if (stderror) {
            reject (stderror.trim());
          } else {
            resolve(stdout.trim());
          }
        },
      );
    },
  );
}
