import * as fs from 'fs-extra';
import fileAccess from './fileAccess';

async function remakeDir(dir: string): Promise<void> {
  try {
    const access = await fileAccess(dir);

    if (access) {
      await fs.remove(dir);
      await fs.mkdirp(dir);
    } else {
      await fs.mkdirp(dir);
    }
  } catch (err) {
    console.error('error while remaking dir');
  }
}

export default remakeDir;
