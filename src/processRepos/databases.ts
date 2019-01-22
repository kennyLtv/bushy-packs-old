import { IParsedConfig } from '../interfaces';

async function databases(config: IParsedConfig, repoDir: string) {
  console.log(repoDir);
  console.log('has databases');
}

export default databases;
