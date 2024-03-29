import * as path from 'path';
import * as through2 from 'through2';
import * as handlebars from 'handlebars';
import * as fs from 'fs-extra';
import * as bluebird from 'bluebird';
import * as vdf from 'simple-vdf';
import * as _ from 'lodash';

import fileAccess from './fileAccess';
import { EnvVars, IncObj } from './interfaces';
import { Transform } from 'stream';

const inc: IncObj = {};
handlebars.registerHelper(
  'inc',
  (id: string): number => {
    if (typeof inc[id] === 'undefined') {
      inc[id] = 1;
    } else {
      inc[id] = inc[id] += 1;
    }
    return inc[id];
  },
);

handlebars.registerHelper(
  'ifEquals',
  (arg1, arg2, options): boolean => {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this);
  },
);

handlebars.registerHelper(
  'ifNotEquals',
  (arg1, arg2, options): boolean => {
    return arg1 != arg2 ? options.fn(this) : options.inverse(this);
  },
);

handlebars.registerHelper(
  'ifInList',
  (arg1, arg2, options): boolean => {
    const listArray = arg2.split(',');
    if (listArray.includes(arg1)) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  },
);

handlebars.registerHelper(
  'ifNotInList',
  (arg1, arg2, options): boolean => {
    const listArray = arg2.split(',');
    if (!listArray.includes(arg1)) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  },
);

function handlebarsTransform(envs: EnvVars): Transform {
  return through2(
    {
      allowHalfOpen: false,
      objectMode: true,
    },
    (chunk, enc, cb): void => {
      const template = handlebars.compile(chunk.toString(enc));
      const templatedString = template(envs);
      cb(null, templatedString);
    },
  );
}

async function mergeVDF(
  srcPath: string,
  destPath: string,
  vars: EnvVars,
): Promise<void> {
  try {
    const access = await fileAccess(destPath);

    if (access) {
      const srcBuffer = await fs.readFile(srcPath);
      const destBuffer = await fs.readFile(destPath);

      const srcString = srcBuffer.toString();
      const destString = destBuffer.toString();

      const srcTemplate = handlebars.compile(srcString);
      const srcTemplatedString = srcTemplate(vars);

      const srcVdfObj = vdf.parse(srcTemplatedString);

      const destVdfObj = vdf.parse(destString);

      const mergedVdfObj = _.merge(srcVdfObj, destVdfObj);

      const newSbDbString = vdf.stringify(mergedVdfObj, true);

      await fs.writeFile(destPath, newSbDbString);
    } else {
      const srcBuffer = await fs.readFile(srcPath);
      const srcString = srcBuffer.toString();
      const srcTemplate = handlebars.compile(srcString);
      const srcTemplatedString = srcTemplate(vars);
      await fs.writeFile(destPath, srcTemplatedString);
    }
  } catch (err) {
    console.error('err while merging vdf', err);
  }
}

async function copyTemplatedFile(
  src: string,
  dest: string,
  vars: EnvVars,
): Promise<void> {
  await new bluebird(
    (resolve, reject): void => {
      const readStream = fs.createReadStream(src);
      const writeStream = fs.createWriteStream(dest);

      readStream.pipe(handlebarsTransform(vars)).pipe(writeStream);

      readStream.on('error', reject);
      writeStream.on('error', reject);

      writeStream.once(
        'finish',
        (): void => {
          resolve();
        },
      );
    },
  );
}

function filterWithVars(vars: EnvVars): fs.CopyFilterAsync {
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
  vars: EnvVars,
): Promise<void> {
  const copyOptions: fs.CopyOptions = {
    filter: filterWithVars(vars),
  };
  await fs.copy(src, dest, copyOptions);
}

export default recursiveCopy;
