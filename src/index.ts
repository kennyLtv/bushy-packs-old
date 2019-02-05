import * as path from 'path';

import fetchPresetRepos from './fetchPresetRepos';
import fetchRepo from './fetchRepo';
import parseConfig from './parseConfig';
import processRepos from './processRepos/index';
import remakeDir from './remakeDir';
import { IParsedConfig } from './interfaces';

import { configRepo } from './args';

const [, configRepoName]: string[] = configRepo.split('/');

const reposDir: string = path.resolve(__dirname, '..', '.repos');
const configDir: string = path.resolve(reposDir, configRepoName);

async function start() {
  await remakeDir(reposDir);
  // await remakeDir(modPath);
  await fetchRepo(configRepo, configDir);
  const parsedConfig: IParsedConfig = await parseConfig(configDir);
  await fetchPresetRepos(parsedConfig.repos);
  await processRepos(parsedConfig);
}

start();
