import * as minimist from 'minimist';
import * as path from 'path';

const argv: minimist.ParsedArgs = minimist(process.argv.slice(2));
const argServerPath: string = argv.path
  ? path.resolve(__dirname, argv.path)
  : path.resolve(__dirname, '..', '..', 'test_dir');
const argMod = argv.mod || 'csgo';
const modPath = path.resolve(argServerPath, argMod);
const argPresetName = argv.preset;
const argRsaKey = argv.rsa || 'id_rsa_tarik';
const argConfigRepo: string = argv.config || 'bushtarikgg/tarik-server-configs';

const args = {
  mod: argMod,
  presetName: argPresetName,
  serverPath: argServerPath,
  modPath,
  rsaKey: argRsaKey,
  configRepo: argConfigRepo,
};

export = args;
