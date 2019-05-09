import { ParsedConfig } from '../interfaces';
import recursiveCopy from '../recursiveCopy';

import { dir } from '../args';

async function merge(config: ParsedConfig, mergeDir: string): Promise<void> {
  await recursiveCopy(mergeDir, dir, config.vars);
}

export default merge;
