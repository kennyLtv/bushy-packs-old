import * as path from 'path';
import * as through2 from 'through2';
import * as Mustache from 'mustache';
import * as fs from 'fs-extra';
import * as bluebird from 'bluebird';

import { IEnvVars } from './interfaces';

function mustacheTransform(envs: IEnvVars) {
  return through2(
    {
      allowHalfOpen: false,
      objectMode: true,
    },
    (chunk, enc, cb) => {
      const rendered = Mustache.render(chunk.toString(enc), envs);
      cb(null, rendered);
    },
  );
}

async function mergeVDF(src: string, dest: string) {
  console.log(src, dest);
  await bluebird.join();
}

function filterWithVars(vars: IEnvVars) {
  return async function filter(src: string, dest: string): Promise<boolean> {
    if (path.basename(src).includes('.bpm')) {
      const newDest = dest.replace('.bpm', '');

      await mergeVDF(src, newDest);

      return false;
    }

    if (path.basename(src).includes('.bp')) {
      const newDest = dest.replace('.bp', '');

      await new bluebird((resolve, reject) => {
        const readStream = fs.createReadStream(src);
        const writeStream = fs.createWriteStream(newDest);

        readStream.pipe(mustacheTransform(vars)).pipe(writeStream);

        readStream.on('error', reject);
        writeStream.on('error', reject);

        writeStream.once('finish', () => {
          resolve();
        });
      });

      return false;
    }

    return true;
  };
}

async function recursiveCopy(
  src: string,
  dest: string,
  vars: IEnvVars,
): Promise<any> {
  const copyOptions: fs.CopyOptions = {
    filter: filterWithVars(vars),
  };
  await fs.copy(src, dest, copyOptions);
}

export default recursiveCopy;
