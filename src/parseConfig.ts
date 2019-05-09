import { ParsedConfig, EnvVars } from './interfaces';
import * as fs from 'fs-extra';
import * as _ from 'lodash';
import * as path from 'path';
import { preset as presetName, dir, mod } from './args';

async function parseConfig(configDir: string): Promise<ParsedConfig> {
  const config = await fs.readJson(path.join(configDir, 'config.json'));

  const configPreset = _.find(
    config.presets,
    (preset): boolean => {
      const foundPreset = _.find(
        Object.keys(preset.servers),
        (server): boolean => {
          return server === presetName;
        },
      );
      return !!foundPreset;
    },
  );

  const { globals } = configPreset;
  const serverVars = configPreset.servers[presetName];

  let newVars: EnvVars = {
    mod,
    dir,
  };

  _.each(
    globals,
    (varValue, varKey): void => {
      if (!_.startsWith(varKey, '_')) {
        newVars[varKey] = varValue;
      }
    },
  );

  _.each(
    serverVars,
    (varValue, varKey): void => {
      const globalTemplateString = globals[`_${varKey}`];
      if (globalTemplateString) {
        newVars[varKey] = globalTemplateString.replace('%s', varValue);
      } else {
        newVars[varKey] = varValue;
      }
    },
  );

  newVars = _.mapKeys(newVars, (_value, key): string => `bp_${key}`);

  const parsedObj: ParsedConfig = {
    repos: configPreset.repos,
    vars: newVars,
  };

  return parsedObj;
}

export default parseConfig;
