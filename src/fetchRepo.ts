import * as git from 'nodegit';
import * as os from 'os';
import * as path from 'path';
import { rsaKey } from './args';

const { Cred, Clone } = git;

const pubKeyPath = path.join(os.homedir(), '.ssh', `${rsaKey}.pub`);
const privKeyPath = path.join(os.homedir(), '.ssh', rsaKey);

const cloneOptions = {
  fetchOpts: {
    callbacks: {
      credentials(url: string, userName: string) {
        const creds = Cred.sshKeyNew(userName, pubKeyPath, privKeyPath, '');
        return creds;
      },
    },
  },
};

async function fetchRepo(repoName: string, outputDirectory: string) {
  const configGitUrl = `git@github.com:${repoName}.git`;
  await Clone.clone(configGitUrl, outputDirectory, cloneOptions);
}

export default fetchRepo;
