import * as minimist from 'minimist';
import * as path from 'path';

import { IParsedConfig } from '../interfaces';
import recursiveCopy from '../recursiveCopy';

const argv: minimist.ParsedArgs = minimist(process.argv.slice(2));
const argServerPath: string = argv.path
  ? path.resolve(__dirname, argv.path)
  : path.resolve(__dirname, '..', '..', 'test_dir');

async function merge(config: IParsedConfig, repoDir: string) {
  await recursiveCopy(
    path.resolve(repoDir, 'merge'),
    argServerPath,
    config.vars,
  );
}

export default merge;
