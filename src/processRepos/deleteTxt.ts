import { ParsedConfig } from '../interfaces';
import * as fs from 'fs-extra';
import * as bluebird from 'bluebird';
import * as path from 'path';
import fileAccess from '../fileAccess';

import { dir } from '../args';

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
      const filePath = path.join(dir, file);
      try {
        const access = await fileAccess(filePath);
        if (access) {
          await fs.unlink(filePath);
          console.log('file deleted');
        }
        console.log('file not found', file);
      } catch (err) {
        console.error('error while deleting file');
      }
    },
  );
}

export default deleteTxt;
