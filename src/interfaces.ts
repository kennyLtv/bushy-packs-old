export interface EnvVars {
  [key: string]: string;
}

export interface LGSMSettings {
  [key: string]: string | number;
}

export interface LGSMSettingsFiles {
  [key: string]: LGSMSettings;
}

export interface ParsedConfig {
  readonly repos: string[];
  vars: EnvVars;
  lgsm: LGSMSettingsFiles;
}

export interface IncObj {
  [key: string]: number;
}
