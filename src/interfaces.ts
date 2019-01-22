export interface IEnvVars {
  [key: string]: string;
}

export interface IParsedConfig {
  readonly repos: string[];
  vars: IEnvVars;
}

export interface IExecResponse {
  stdout: string;
  stderror: string;
}
