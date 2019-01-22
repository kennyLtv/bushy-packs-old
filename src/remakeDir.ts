import * as fs from 'fs-extra';

async function remakeDir(dir: string) {
  try {
    await fs.access(dir);
    await fs.remove(dir);
    await fs.mkdir(dir);
  } catch (err) {
    await fs.mkdir(dir);
  }
}

export default remakeDir;
