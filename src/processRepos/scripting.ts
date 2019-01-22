import { IParsedConfig } from '../interfaces';

async function scripting(config: IParsedConfig, repoDir: string) {
  console.log(repoDir);
  console.log('has scripting');
}

export default scripting;
