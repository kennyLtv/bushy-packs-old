import * as bluebird from 'bluebird';
import * as path from 'path';
import fetchRepo from './fetchRepo';

const reposDir = path.resolve(__dirname, '..', '.repos');

async function fetchPresetRepos(repos: string[]) {
  await bluebird.map(repos, async repo => {
    const [, gitRepoName] = repo.split('/');
    const newRepoDir = path.join(reposDir, gitRepoName);
    await fetchRepo(repo, newRepoDir);
    console.log(`Cloned: ${gitRepoName}`);
  });
}

export default fetchPresetRepos;
