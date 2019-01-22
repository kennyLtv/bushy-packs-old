import { IParsedConfig, IEnvVars } from './interfaces';
import * as fs from 'fs-extra';
import * as _ from 'lodash';
import * as minimist from 'minimist';
import * as path from 'path';

const argv = minimist(process.argv.slice(2));
const argPresetName = argv.preset;
const argServerPath = argv.path
  ? path.resolve(__dirname, argv.path)
  : path.resolve(__dirname, '../test_dir');
const argMod = argv.mod || 'csgo';

async function parseConfig(configDir: string) {
  const config = await fs.readJson(path.join(configDir, 'test.json'));

  const configPreset = _.find(config.presets, preset => {
    const foundPreset = _.find(Object.keys(preset.servers), server => {
      return server === argPresetName;
    });
    return !!foundPreset;
  });

  const { globals } = configPreset;
  const serverVars = configPreset.servers[argPresetName];

  let newVars: IEnvVars = {
    mod: argMod,
    serverPath: argServerPath,
  };

  _.each(globals, (varValue, varKey) => {
    if (!_.startsWith(varKey, '_')) {
      newVars[varKey] = varValue;
    }
  });

  _.each(serverVars, (varValue, varKey) => {
    const globalTemplateString = globals[`_${varKey}`];
    if (globalTemplateString) {
      newVars[varKey] = globalTemplateString.replace('%s', varValue);
    } else {
      newVars[varKey] = varValue;
    }
  });

  newVars = _.mapKeys(newVars, (value, key) => `bp_${key}`);

  const parsedObj: IParsedConfig = {
    repos: configPreset.repos,
    vars: newVars,
  };

  return parsedObj;
}

export default parseConfig;
