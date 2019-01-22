import { IParsedConfig } from '../interfaces';

async function deleteTxt(config: IParsedConfig, repoDir: string) {
  console.log(repoDir);
  console.log('has delete.txt');
}

export default deleteTxt;
