import { IParsedConfig } from '../interfaces';
import * as fs from 'fs-extra';
import * as bluebird from 'bluebird';
import * as path from 'path';

import { serverPath } from '../args';

async function deleteTxt(_config: IParsedConfig, repoDir: string) {
  const deletePath = path.join(repoDir, 'delete.txt');
  const deleteFile = await fs.readFile(deletePath);
  const deleteFileString = deleteFile.toString();
  const deleteFileArray = deleteFileString.match(/[^\r\n]+/g);

  await bluebird.map(deleteFileArray, async (file: string) => {
    const filePath = path.join(serverPath, file);
    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
      console.log('deleted', file);
    } catch (err) {
      console.log('file does not exist to delete');
    }
  });
}

export default deleteTxt;
