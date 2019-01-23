declare module 'simple-vdf' {
  export function dump(obj: object, pretty: boolean): string;
  export function stringify(obj: object, pretty: boolean): string;
  export function parse(text: string): object;
}
