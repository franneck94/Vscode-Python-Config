import * as fs from 'fs';
import * as JSON5 from 'json5';
import * as path from 'path';
import * as vscode from 'vscode';

export function replaceBackslashes(text: string) {
  return text.replace(/\\/g, '/');
}

export function mkdirRecursive(dir: string) {
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch (err) {
    console.log((err as Error).message);
  }
}

export function pathExists(filepath: string) {
  try {
    fs.accessSync(filepath);
  } catch (err) {
    return false;
  }

  return true;
}

export function readJsonFile(filepath: string) {
  let configJson: any | undefined;

  try {
    const fileContent = fs.readFileSync(filepath, 'utf-8');
    configJson = JSON5.parse(fileContent);
  } catch (err) {
    return undefined;
  }

  return configJson;
}

export function writeJsonFile(outputFilePath: string, jsonContent: any) {
  if (jsonContent === undefined) return;

  const dirname = path.dirname(outputFilePath);

  if (!pathExists(dirname)) {
    mkdirRecursive(dirname);
  }

  const spaces = 4;
  const jsonString = JSON.stringify(jsonContent, null, spaces);

  try {
    fs.writeFileSync(outputFilePath, jsonString);
  } catch (err) {
    const message = `Error: ${err}`;
    vscode.window.showErrorMessage(message);
    return;
  }
}

export function readDir(dir: string | fs.PathLike) {
  try {
    return fs.readdirSync(dir, { withFileTypes: true });
  } catch (err) {}
}

export function filesInDir(dir: string) {
  const fileDirents = readDir(dir);

  if (!fileDirents) return [];

  const hasSpace = dir.includes(' ');
  const files = fileDirents
    .filter((file) => file.isFile())
    .map((file) => (hasSpace ? file.name : path.join(dir, file.name)));

  return files;
}
