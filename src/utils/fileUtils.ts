import * as fs from 'fs';

export function mkdirRecursive(dir: string) {
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch (err) {
    return false;
  }

  return true;
}

export function pathExists(filepath: string) {
  try {
    fs.accessSync(filepath);
  } catch (err) {
    return false;
  }

  return true;
}
