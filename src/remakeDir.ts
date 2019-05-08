import * as fs from 'fs-extra';

async function remakeDir(dir: string): Promise<void> {
  try {
    await fs.access(dir);
    await fs.remove(dir);
    await fs.mkdirp(dir);
  } catch (err) {
    await fs.mkdirp(dir);
  }
}

export default remakeDir;
