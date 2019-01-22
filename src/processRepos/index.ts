import { IParsedConfig } from '../interfaces';
import * as bluebird from 'bluebird';
import * as path from 'path';
import * as fs from 'fs-extra';

import merge from './merge';
import node from './node';
import sh from './sh';
import scripting from './scripting';
import deleteTxt from './deleteTxt';

const reposDir = path.resolve(__dirname, '..', '..', '.repos');

async function processRepos(config: IParsedConfig) {
  await bluebird.mapSeries(config.repos, async repo => {
    const [, gitRepoName] = repo.split('/');
    const repoDir = path.join(reposDir, gitRepoName);
    const repoFolders = await fs.readdir(repoDir);

    console.log(gitRepoName);

    if (repoFolders.includes('merge')) {
      try {
        await merge(config, repoDir);
      } catch (err) {
        console.error(err);
        console.error('error while merging');
      }
    }

    if (repoFolders.includes('node')) {
      try {
        await node(config, repoDir);
      } catch (err) {
        console.error(err);
        console.error('error while running node');
      }
    }

    if (repoFolders.includes('sh')) {
      try {
        await sh(config, repoDir);
      } catch (err) {
        console.error(err);
        console.error('error while running shell scripts');
      }
    }

    if (repoFolders.includes('scripting')) {
      try {
        await scripting(config, repoDir);
      } catch (err) {
        console.error(err);
        console.error('error while running scripting magic');
      }
    }

    if (repoFolders.includes('delete.txt')) {
      try {
        await deleteTxt(config, repoDir);
      } catch (err) {
        console.error(err);
        console.error('error while deleting files in txt');
      }
    }
  });
}

export default processRepos;
