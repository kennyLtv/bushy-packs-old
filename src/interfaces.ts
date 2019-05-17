export interface EnvVars {
  [key: string]: string;
}

export interface ParsedConfig {
  readonly repos: string[];
  vars: EnvVars;
}

export interface IncObj {
  [key: string]: number;
}
