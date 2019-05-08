import * as path from 'path';

import fetchPresetRepos from './fetchPresetRepos';
import fetchRepo from './fetchRepo';
import parseConfig from './parseConfig';
import processRepos from './processRepos/index';
import remakeDir from './remakeDir';
import { IParsedConfig } from './interfaces';

import { config, repo } from './args';

const [, configRepoName]: string[] = config.split('/');

const reposDir: string = path.resolve(__dirname, '..', '.repos');
const configDir: string = path.resolve(reposDir, configRepoName);

async function start() {
  await remakeDir(reposDir);
  await fetchRepo(config, configDir);
  const parsedConfig: IParsedConfig = await parseConfig(configDir);

  if (repo) {
    const newConfig: IParsedConfig = {
      ...parsedConfig,
      repos: [repo]
    }

    await fetchPresetRepos(newConfig.repos);
    await processRepos(newConfig);
  } else {
    await fetchPresetRepos(parsedConfig.repos);
    await processRepos(parsedConfig);
  }
}

start();
