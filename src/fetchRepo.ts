import * as git from 'nodegit';
import * as os from 'os';
import * as path from 'path';
import { key, bitbucket } from './args';

const pubKeyPath = path.join(os.homedir(), '.ssh', `${key}.pub`);
const privKeyPath = path.join(os.homedir(), '.ssh', key);

const cloneOptions = {
  fetchOpts: {
    callbacks: {
      credentials(_url: string, userName: string): git.Cred {
        const creds = git.Cred.sshKeyNew(userName, pubKeyPath, privKeyPath, '');
        return creds;
      },
    },
  },
};

async function fetchRepo(
  repoName: string,
  outputDirectory: string,
): Promise<void> {
  let url = `git@github.com:${repoName}.git`;

  if (bitbucket) {
    url = `git@bitbucket.org:${repoName}.git`;
  }

  await git.Clone.clone(url, outputDirectory, cloneOptions);
}

export default fetchRepo;
