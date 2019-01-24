import * as path from 'path';

import { IParsedConfig } from '../interfaces';
import recursiveCopy from '../recursiveCopy';

import { serverPath } from '../args';

async function merge(config: IParsedConfig, repoDir: string) {
  await recursiveCopy(
    path.resolve(repoDir, 'merge'),
    serverPath,
    config.vars,
  );
}

export default merge;
