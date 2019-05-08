import * as path from 'path';
import * as through2 from 'through2';
import * as handlebars from 'handlebars';
import * as fs from 'fs-extra';
import * as bluebird from 'bluebird';
import * as vdf from 'simple-vdf';
import * as _ from 'lodash';

import { modPath } from './args';
import { IEnvVars, IIncObj } from './interfaces';

const inc: IIncObj = {};
handlebars.registerHelper('inc', (id) => {
  if (typeof (inc[id]) === 'undefined') {
    inc[id] = 1;
  } else {
    inc[id] = inc[id] += 1;
  }
  return inc[id];
});

function handlebarsTransform(envs: IEnvVars) {
  return through2(
    {
      allowHalfOpen: false,
      objectMode: true,
    },
    (chunk, enc, cb) => {
      const template = handlebars.compile(chunk.toString(enc))
      const templatedString = template(envs);
      cb(null, templatedString);
    },
  );
}

async function mergeVDF(src: string, dest: string, vars: IEnvVars) {
  const existingSmDbPath = path.join(
    modPath,
    'addons',
    'sourcemod',
    'configs',
    'databases.cfg',
  );

  await bluebird.join(
    fs.readFile(existingSmDbPath),
    fs.readFile(src),
    async (serverSmDbBuffer, mergeSmDbBuffer) => {
      const serverSmDbString = serverSmDbBuffer.toString();
      const template = handlebars.compile(serverSmDbString)
      const templatedString = template(vars);
      const serverSmDbObj = vdf.parse(templatedString);

      const mergeSmDbString = mergeSmDbBuffer.toString();
      const mergeSmDbObj = vdf.parse(mergeSmDbString);

      const newSmDbObj = _.merge(serverSmDbObj, mergeSmDbObj);
      const newSbDbString = vdf.stringify(newSmDbObj, true);

      await fs.writeFile(dest, newSbDbString);
    }
  )
}

async function copyTemplatedFile(src: string, dest: string, vars: IEnvVars) {
  await new bluebird((resolve, reject) => {
    const readStream = fs.createReadStream(src);
    const writeStream = fs.createWriteStream(dest);

    readStream.pipe(handlebarsTransform(vars)).pipe(writeStream);

    readStream.on('error', reject);
    writeStream.on('error', reject);

    writeStream.once('finish', () => {
      resolve();
    });
  });
}

function filterWithVars(vars: IEnvVars) {
  return async function filter(src: string, dest: string): Promise<boolean> {
    if (path.basename(src).includes('bpm.cfg')) {
      const newDest = dest.replace('.bpm.cfg', '.cfg');
      await mergeVDF(src, newDest, vars);
      return false;
    }

    if (path.basename(src).includes('.bp')) {
      const newDest = dest.replace('.bp', '');
      await copyTemplatedFile(src, newDest, vars);
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
