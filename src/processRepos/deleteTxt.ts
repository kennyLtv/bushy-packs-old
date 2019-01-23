import { IParsedConfig } from '../interfaces';
import * as fs from 'fs-extra';
import * as bluebird from 'bluebird';
import * as minimist from 'minimist';
import * as path from 'path';

const argv: minimist.ParsedArgs = minimist(process.argv.slice(2));

const argMod = argv.mod || 'csgo';
const argServerPath: string = argv.path
  ? path.resolve(__dirname, argv.path)
  : path.resolve(__dirname, '..', '..', 'test_dir');
const modPath = path.resolve(argServerPath, argMod);

async function deleteTxt(config: IParsedConfig, repoDir: string) {
  const deletePath = path.join(repoDir, 'delete.txt');
  const deleteFile = await fs.readFile(deletePath);
  const deleteFileString = deleteFile.toString();
  const deleteFileArray = deleteFileString.match(/[^\r\n]+/g);

  await bluebird.map(deleteFileArray, async (file: string) => {
    const filePath = path.join(argServerPath, file);
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
