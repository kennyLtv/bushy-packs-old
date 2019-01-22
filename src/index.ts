import * as minimist from 'minimist';
import * as path from 'path';

import fetchPresetRepos from './fetchPresetRepos';
import fetchRepo from './fetchRepo';
import parseConfig from './parseConfig';
import processRepos from './processRepos/index';
import remakeDir from './remakeDir';
import { IParsedConfig } from './interfaces';

const argv: minimist.ParsedArgs = minimist(process.argv.slice(2));
const argConfigRepo: string = argv.config || 'bushtarikgg/tarik-server-configs';
const argMod = argv.mod || 'csgo';
const argServerPath: string = argv.path
  ? path.resolve(__dirname, argv.path)
  : path.resolve(__dirname, '..', 'test_dir');
const modPath = path.resolve(argServerPath, argMod);

const [, configRepoName]: string[] = argConfigRepo.split('/');

const reposDir: string = path.resolve(__dirname, '..', '.repos');
const configDir: string = path.resolve(reposDir, configRepoName);

async function start() {
  await remakeDir(reposDir);
  await remakeDir(modPath);
  await fetchRepo(argConfigRepo, configDir);
  const parsedConfig: IParsedConfig = await parseConfig(configDir);
  await fetchPresetRepos(parsedConfig.repos);
  await processRepos(parsedConfig);
}

start();
