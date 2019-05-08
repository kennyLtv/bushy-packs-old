import { ParsedConfig } from '../interfaces';
import recursiveCopy from '../recursiveCopy';

import { path } from '../args';

async function merge(config: ParsedConfig, dir: string): Promise<void> {
  await recursiveCopy(dir, path, config.vars);
}

export default merge;
