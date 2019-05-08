import { IParsedConfig } from '../interfaces';
import recursiveCopy from '../recursiveCopy';

import { serverPath } from '../args';

async function merge(config: IParsedConfig, dir: string) {
  await recursiveCopy(
    dir,
    serverPath,
    config.vars,
  );
}

export default merge;
