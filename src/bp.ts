#!/usr/bin/env node

import * as path from 'path';

import fetchPresetRepos from './fetchPresetRepos';
import fetchRepo from './fetchRepo';
import parseConfig from './parseConfig';
import processRepos from './processRepos/index';
import remakeDir from './remakeDir';
import lgsmStart from './lgsm';
import { ParsedConfig } from './interfaces';
import fileAccess from './fileAccess';
import * as fs from 'fs-extra';

import { config, repo, modDir, lgsm } from './args';

const [, configRepoName]: string[] = config.split('/');

const reposDir: string = path.resolve(__dirname, '..', '.repos');
const configDir: string = path.resolve(reposDir, configRepoName);

async function start(config: ParsedConfig): Promise<void> {
  await fetchPresetRepos(config.repos);
  await processRepos(config);
}

async function init(): Promise<void> {
  await remakeDir(reposDir);
  await fetchRepo(config, configDir);

  let parsedConfig: ParsedConfig = await parseConfig(configDir);

  const access = await fileAccess(modDir);

  if (!access) {
    await fs.mkdirp(modDir);
  }

  if (repo) {
    parsedConfig = {
      ...parsedConfig,
      repos: [repo],
    };
  }

  await start(parsedConfig);

  if (lgsm) {
    await lgsmStart(parsedConfig.lgsm, lgsm);
  }
}

init();
