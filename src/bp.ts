#!/usr/bin/env node

import * as path from 'path';

import fetchPresetRepos from './fetchPresetRepos';
import fetchRepo from './fetchRepo';
import parseConfig from './parseConfig';
import processRepos from './processRepos/index';
import remakeDir from './remakeDir';
import { ParsedConfig } from './interfaces';
import fileAccess from './fileAccess';
import * as fs from 'fs-extra';

import { config, repo, modDir } from './args';

const [, configRepoName]: string[] = config.split('/');

const reposDir: string = path.resolve(__dirname, '..', '.repos');
const configDir: string = path.resolve(reposDir, configRepoName);

async function start(): Promise<void> {
  await remakeDir(reposDir);
  await fetchRepo(config, configDir);
  const parsedConfig: ParsedConfig = await parseConfig(configDir);

  const access = await fileAccess(modDir);
  if (!access) {
    await fs.mkdirp(modDir);
  }

  if (repo) {
    const newConfig: ParsedConfig = {
      ...parsedConfig,
      repos: [repo],
    };

    await fetchPresetRepos(newConfig.repos);
    await processRepos(newConfig);
  } else {
    await fetchPresetRepos(parsedConfig.repos);
    await processRepos(parsedConfig);
  }
}

start();
