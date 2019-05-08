import { IParsedConfig } from '../interfaces';
import recursiveCopy from '../recursiveCopy';

import { path } from '../args';

async function merge(config: IParsedConfig, dir: string) {
  await recursiveCopy(
    dir,
    path,
    config.vars,
  );
}

export default merge;
