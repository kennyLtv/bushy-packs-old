import { LGSMSettingsFiles } from './interfaces';
import * as _ from 'lodash';
import * as path from 'path';
import * as fs from 'fs-extra';

export default async function(
  lgsmObj: LGSMSettingsFiles,
  configPath: string,
): Promise<void> {
  await fs.mkdirp(configPath);

  _.each(
    lgsmObj,
    async (fileSettings, fileName): Promise<void> => {
      const fileOutputPath = path.join(configPath, `${fileName}.cfg`);

      let fileString = '';

      _.each(
        fileSettings,
        async (settingValue, settingKey): Promise<void> => {
          fileString = `${fileString}${settingKey}="${settingValue}"\n`;
        },
      );

      await fs.writeFile(fileOutputPath, fileString);
    },
  );
}
