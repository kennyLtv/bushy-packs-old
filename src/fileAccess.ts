import * as fs from 'fs-extra';

export default async function(path: string): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}
