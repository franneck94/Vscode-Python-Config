import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

import { mkdirRecursive, pathExists } from './utils/fileUtils';
import { disposeItem } from './utils/vscodeUtils';

let generateCCommandDisposable: vscode.Disposable | undefined;
let workspaceFolder: string | undefined;
let extensionPath: string | undefined;

const EXTENSION_NAME = 'Python_Config';
const VSCODE_DIR_FILES = ['launch.json', 'settings.json', 'tasks.json'];
const ROOT_DIR_FILES = [
  '.editorconfig',
  '.gitattributes',
  '.gitignore',
  '.pre-commit-config.yaml',
  'pyproject.toml',
  'requirements-dev.txt',
  'setup.cfg',
];

export function activate(context: vscode.ExtensionContext) {
  if (
    !vscode.workspace.workspaceFolders ||
    vscode.workspace.workspaceFolders.length !== 1 ||
    !vscode.workspace.workspaceFolders[0] ||
    !vscode.workspace.workspaceFolders[0].uri
  ) {
    return;
  }

  workspaceFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
  extensionPath = context.extensionPath;

  initGeneratePythonCommandDisposable(context);
}

export function deactivate() {
  disposeItem(generateCCommandDisposable);
}

function initGeneratePythonCommandDisposable(context: vscode.ExtensionContext) {
  if (generateCCommandDisposable) return;

  const CommanddName = `${EXTENSION_NAME}.generateConfigPython`;
  generateCCommandDisposable = vscode.commands.registerCommand(
    CommanddName,
    async () => {
      const { templatePath, vscodePath } = getFilepaths();
      if (!templatePath || !vscodePath) return;

      if (!pathExists(vscodePath)) mkdirRecursive(vscodePath);

      // Still not exist due to somewhat mkdir error
      if (!pathExists(vscodePath)) {
        const message = 'Error: .vscode folder could not be generated.';
        vscode.window.showErrorMessage(message);
      } else {
        VSCODE_DIR_FILES.forEach((filename) => {
          const targetFilename = path.join(vscodePath, filename);
          const templateFilename = path.join(templatePath, filename);

          const templateData = fs.readFileSync(templateFilename);

          try {
            fs.writeFileSync(targetFilename, templateData);
          } catch (err) {}
        });
      }

      ROOT_DIR_FILES.forEach((filename) => {
        if (!workspaceFolder) return;

        const targetFilename = path.join(workspaceFolder, filename);
        const templateFilename = path.join(templatePath, filename);

        const templateData = fs.readFileSync(templateFilename);

        try {
          fs.writeFileSync(targetFilename, templateData);
        } catch (err) {}
      });
    },
  );

  context?.subscriptions.push(generateCCommandDisposable);
}

function getFilepaths() {
  if (!extensionPath || !workspaceFolder) return {};

  const templatePath = path.join(extensionPath, 'templates');
  const vscodePath = path.join(workspaceFolder, '.vscode');

  return { templatePath, vscodePath };
}
