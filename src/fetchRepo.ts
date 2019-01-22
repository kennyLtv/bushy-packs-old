import * as fs from 'fs-extra';
import * as minimist from 'minimist';
import * as git from 'nodegit';
import * as os from 'os';
import * as path from 'path';

const { Cred, Clone } = git;

const argv = minimist(process.argv.slice(2));
const argRsaKey = argv.rsa || 'id_rsa_tarik';

const pubKeyPath = path.join(os.homedir(), '.ssh', `${argRsaKey}.pub`);
const privKeyPath = path.join(os.homedir(), '.ssh', argRsaKey);

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
