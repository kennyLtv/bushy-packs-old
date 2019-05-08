import { ParsedConfig } from '../interfaces';
import * as fs from 'fs-extra';
import * as bluebird from 'bluebird';
import * as path from 'path';

import { path as serverPath } from '../args';

async function deleteTxt(
  _config: ParsedConfig,
  repoDir: string,
): Promise<void> {
  const deletePath = path.join(repoDir, 'delete.txt');
  const deleteFile = await fs.readFile(deletePath);
  const deleteFileString = deleteFile.toString();
  const deleteFileArray = deleteFileString.match(/[^\r\n]+/g);

  await bluebird.map(
    deleteFileArray,
    async (file): Promise<void> => {
      const filePath = path.join(serverPath, file);
      try {
        await fs.access(filePath);
        await fs.unlink(filePath);
        console.log('deleted', file);
      } catch (err) {
        console.log('file does not exist to delete');
      }
    },
  );
}

export default deleteTxt;
