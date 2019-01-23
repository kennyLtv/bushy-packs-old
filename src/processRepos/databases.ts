import { IParsedConfig, IExecResponse } from '../interfaces';
import * as fs from 'fs-extra';
import * as minimist from 'minimist';
import * as path from 'path';
import * as bluebird from 'bluebird';
import * as vdf from 'simple-vdf';
import * as _ from 'lodash';

const argv: minimist.ParsedArgs = minimist(process.argv.slice(2));

const argMod = argv.mod || 'csgo';
const argServerPath: string = argv.path
  ? path.resolve(__dirname, argv.path)
  : path.resolve(__dirname, '..', '..', 'test_dir');
const modPath = path.resolve(argServerPath, argMod);

async function databases(config: IParsedConfig, repoDir: string) {
  const dbPath = path.join(repoDir, 'databases.cfg');
  const existingSmDbPath = path.join(
    modPath,
    'addons',
    'sourcemod',
    'configs',
    'databases.cfg',
  );
  try {
    await fs.access(existingSmDbPath);
    const existingSmDbBuffer = await fs.readFile(existingSmDbPath);
    const existingSmDbString = existingSmDbBuffer.toString();
    const existingSmDbObj = vdf.parse(existingSmDbString);

    const mergeSmDbBuffer = await fs.readFile(dbPath);
    const mergeSmDbString = mergeSmDbBuffer.toString();
    const mergeSmDbObj = vdf.parse(mergeSmDbString);

    const newSmDbObj = _.merge(existingSmDbObj, mergeSmDbObj);
    const newSbDbString = vdf.stringify(newSmDbObj, true);

    await fs.writeFile(existingSmDbPath, newSbDbString);
  } catch (err) {
    console.error('error merging database');
  }
}

export default databases;
