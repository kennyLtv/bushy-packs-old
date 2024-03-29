import * as bluebird from 'bluebird';
import * as path from 'path';
import fetchRepo from './fetchRepo';

const reposDir = path.resolve(__dirname, '..', '.repos');

async function fetchPresetRepos(repos: string[]): Promise<void> {
  await bluebird.map(
    repos,
    async (repo): Promise<void> => {
      const [, gitRepoName] = repo.split('/');
      const newRepoDir = path.join(reposDir, gitRepoName);

      try {
        await fetchRepo(repo, newRepoDir);
        console.log(`Cloned:  ${gitRepoName}`);
      } catch (err) {
        console.error('error fetching repo: ', gitRepoName);
      }
    },
  );
}

export default fetchPresetRepos;
