import { IParsedConfig, IEnvVars } from './interfaces';
import * as fs from 'fs-extra';
import * as _ from 'lodash';
import * as path from 'path';
import { presetName, serverPath, mod } from './args';


async function parseConfig(configDir: string) {
  const config = await fs.readJson(path.join(configDir, 'test.json'));

  const configPreset = _.find(config.presets, preset => {
    const foundPreset = _.find(Object.keys(preset.servers), server => {
      return server === presetName;
    });
    return !!foundPreset;
  });

  const { globals } = configPreset;
  const serverVars = configPreset.servers[presetName];

  let newVars: IEnvVars = {
    mod,
    serverPath: serverPath,
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

  newVars = _.mapKeys(newVars, (_value, key) => `bp_${key}`);

  const parsedObj: IParsedConfig = {
    repos: configPreset.repos,
    vars: newVars,
  };

  return parsedObj;
}

export default parseConfig;
