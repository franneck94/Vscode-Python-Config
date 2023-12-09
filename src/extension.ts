import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

import {
  mkdirRecursive,
  pathExists,
  readJsonFile,
  writeJsonFile,
} from './utils/fileUtils';
import { getGlobalSetting } from './utils/settings';
import { disposeItem } from './utils/vscodeUtils';

let generateCCommandDisposable: vscode.Disposable | undefined;

let WORKSPACE_FOLDER: string | undefined;
let EXTENSION_PATH: string | undefined;

const EXTENSION_NAME = 'Python_Config';
const VSCODE_DIR_FILES = ['launch.json', 'settings.json', 'tasks.json'];
const ROOT_DIR_FILES = [
  '.editorconfig',
  '.gitattributes',
  '.gitignore',
  '.pre-commit-config.yaml',
  'pyproject.toml',
  'requirements-dev.txt',
];

const LINE_LENGTH_DEFAULT = 120;
const IS_AGGRESSIVE_DEFAULT = false;
const PY_TARGET_DEFAULT = '3.10';
const FORMATTING_TOOL_DEFAULT = 'black';
const RUFF_VERSION = 'v0.1.7';
const BLACK_VERSION = '23.11.0';

const AGGRESSIVE_SELECTS =
  '["W", "C90", "I", "N", "UP", "YTT", "ANN", "ASYNC", "BLE", "B", "A", "COM", "C4", "EXE", "FA", "ISC", "ICN", "INP", "PIE", "PYI", "PT", "Q", "RSE", "RET", "SLF", "SLOT", "SIM", "TID", "TCH", "INT", "ARG", "PTH", "TD", "FIX", "PD", "PL", "TRY", "FLY", "NPY", "PERF", "FURB", "RUF", "TRIO"]';
const AGGRESSIVE_IGNORES =
  '["I001", "ANN401", "SIM300", "PERF203", "ANN101", "B905", "NPY002", "COM812", "N999", "PTH", "INP001", "TRY003", "PLW1641", "E203", "PLW1514"]';
const AGGRESSIVE_FIXABLES =
  '["W", "C90", "I", "N", "UP", "YTT", "ANN", "ASYNC", "BLE", "B", "A", "COM", "C4", "EXE", "FA", "ISC", "ICN", "INP", "PIE", "PYI", "PT", "Q", "RSE", "RET", "SLF", "SLOT", "SIM", "TID", "TCH", "INT", "ARG", "PTH", "TD", "FIX", "PD", "PL", "TRY", "FLY", "NPY", "PERF", "FURB", "RUF", "TRIO"]';
const AGGRESSIVE_UNFIXABLES = '[]';

let LINE_LENGTH: number = LINE_LENGTH_DEFAULT;
let IS_AGGRESSIVE: boolean = IS_AGGRESSIVE_DEFAULT;
let PY_TARGET: string = PY_TARGET_DEFAULT;
let FORMATTING_TOOL: string = FORMATTING_TOOL_DEFAULT;

export function activate(context: vscode.ExtensionContext) {
  if (
    !vscode.workspace.workspaceFolders ||
    vscode.workspace.workspaceFolders.length !== 1 ||
    !vscode.workspace.workspaceFolders[0] ||
    !vscode.workspace.workspaceFolders[0].uri
  ) {
    WORKSPACE_FOLDER = '';
  } else {
    WORKSPACE_FOLDER = vscode.workspace.workspaceFolders[0].uri.fsPath;
  }

  EXTENSION_PATH = context.extensionPath;

  initGeneratePythonCommandDisposable(context);
}

export function deactivate() {
  disposeItem(generateCCommandDisposable);
}

function getCurrentGlobalSettings() {
  LINE_LENGTH = getGlobalSetting(
    EXTENSION_NAME,
    'lineLength',
    LINE_LENGTH_DEFAULT,
  );
  IS_AGGRESSIVE = getGlobalSetting(
    EXTENSION_NAME,
    'aggressiveSettings',
    IS_AGGRESSIVE_DEFAULT,
  );
  PY_TARGET = getGlobalSetting(
    EXTENSION_NAME,
    'pythonVersion',
    PY_TARGET_DEFAULT,
  );
  FORMATTING_TOOL = getGlobalSetting(
    EXTENSION_NAME,
    'formattingTool',
    FORMATTING_TOOL_DEFAULT,
  );
}

function initGeneratePythonCommandDisposable(context: vscode.ExtensionContext) {
  if (generateCCommandDisposable) return;

  const CommanddName = `${EXTENSION_NAME}.generateConfigPython`;
  generateCCommandDisposable = vscode.commands.registerCommand(
    CommanddName,
    async () => {
      if (!WORKSPACE_FOLDER) {
        vscode.window.showErrorMessage('No workspace opened!');
        return;
      }

      const { templatePath, vscodePath } = getFilepaths();
      if (!templatePath || !vscodePath) return;

      getCurrentGlobalSettings();

      if (!pathExists(vscodePath)) {
        mkdirRecursive(vscodePath);
      }

      // SETTINGS.JSON
      VSCODE_DIR_FILES.forEach((filename: string) => {
        const targetFilename = path.join(vscodePath, filename);
        const templateFilename = path.join(templatePath, filename);

        try {
          const templateData: {
            [key: string]: string | any[] | boolean | number | any;
          } = readJsonFile(templateFilename);

          if (filename === 'settings.json') {
            if (LINE_LENGTH >= 80) {
              templateData['editor.rulers'] = [LINE_LENGTH];
            } else if (LINE_LENGTH > 0) {
              templateData['editor.rulers'] = [80];
            } else {
              templateData['editor.rulers'] = [120];
            }

            if (FORMATTING_TOOL.toLowerCase() === 'ruff') {
              templateData['[python]']['editor.defaultFormatter'] =
                'charliermarsh.ruff';
            } else {
              templateData['[python]']['editor.defaultFormatter'] =
                'ms-python.black-formatter';
            }

            if (IS_AGGRESSIVE) {
              templateData['ruff.fixAll'] = true;
            } else {
              templateData['ruff.fixAll'] = false;
            }

            if (IS_AGGRESSIVE) {
              templateData['notebook.formatOnSave.enabled'] = true;
            } else {
              templateData['notebook.formatOnSave.enabled'] = false;
            }
          }

          writeJsonFile(targetFilename, templateData);
        } catch (err) {
          vscode.window.showErrorMessage(
            `Could not write file ${targetFilename}.`,
          );
          return;
        }
      });

      ROOT_DIR_FILES.forEach((filename) => {
        if (!WORKSPACE_FOLDER) return;

        const targetFilename = path.join(WORKSPACE_FOLDER, filename);
        const templateFilename = path.join(templatePath, filename);

        try {
          let templateData = fs.readFileSync(templateFilename);

          if (filename === 'pyproject.toml') {
            const data = templateData.toString().split('\n');

            const modifiedData = data.map((line: string) => {
              // START: GENERAL
              if (IS_AGGRESSIVE) {
                // START: MYPY
                if (line.startsWith('check_untyped_defs')) {
                  return `check_untyped_defs = true`;
                } else if (line.startsWith('no_implicit_optional')) {
                  return `no_implicit_optional = true`;
                } else if (line.startsWith('strict_optional')) {
                  return `strict_optional = true`;
                } else if (line.startsWith('disallow_untyped_defs')) {
                  return `disallow_untyped_defs = true`;
                } else if (line.startsWith('disallow_incomplete_defs')) {
                  return `disallow_incomplete_defs = true`;
                } else if (line.startsWith('disallow_subclassing_any')) {
                  return `disallow_subclassing_any = true`;
                } else if (line.startsWith('allow_untyped_globals')) {
                  return `allow_untyped_globals = false`;
                } else if (line.startsWith('allow_redefinition')) {
                  return `allow_redefinition = false`;
                } else if (line.startsWith('extend-select')) {
                  // START: RUFF
                  return `extend-select = ${AGGRESSIVE_SELECTS}`;
                } else if (line.startsWith('ignore = ')) {
                  return `ignore = ${AGGRESSIVE_IGNORES}`;
                } else if (line.startsWith('fixable')) {
                  return `fixable = ${AGGRESSIVE_FIXABLES}`;
                } else if (line.startsWith('unfixable')) {
                  return `unfixable = ${AGGRESSIVE_UNFIXABLES}`;
                } else if (line.startsWith('allow-star-arg-any')) {
                  return 'allow-star-arg-any = false';
                } else if (line.startsWith('ignore-fully-untyped')) {
                  return 'ignore-fully-untyped = false';
                } else if (line.includes('skip-string-normalization')) {
                  // START: BLACK
                  return 'skip-string-normalization = false';
                } else if (line.includes('skip-magic-trailing-comma')) {
                  return 'skip-magic-trailing-comma = false';
                } else if (line.includes('ignore=')) {
                  return 'ignore=';
                } else if (line.startsWith('reportUntypedFunctionDecorator')) {
                  // START PYRIGHT
                  return 'reportUntypedFunctionDecorator = true';
                } else if (line.startsWith('reportUntypedNamedTuple')) {
                  return 'reportUntypedNamedTuple = true';
                } else if (line.startsWith('reportGeneralTypeIssues')) {
                  return 'reportGeneralTypeIssues = true';
                } else if (line.startsWith('reportOptionalCall')) {
                  return 'reportOptionalCall = true';
                } else if (line.startsWith('reportOptionalIterable')) {
                  return 'reportOptionalIterable = true';
                } else if (line.startsWith('reportOptionalMemberAccess')) {
                  return 'reportOptionalMemberAccess = true';
                } else if (line.startsWith('reportOptionalMemberAccess')) {
                  return 'reportOptionalMemberAccess = true';
                } else if (line.startsWith('reportOptionalOperand')) {
                  return 'reportOptionalOperand = true';
                } else if (line.startsWith('reportOptionalSubscript')) {
                  return 'reportOptionalSubscript = true';
                } else if (line.startsWith('reportPrivateImportUsage')) {
                  return 'reportPrivateImportUsage = true';
                } else if (line.startsWith('reportUnboundVariable')) {
                  return 'reportUnboundVariable = true';
                }
              }

              // LINE LENGTH
              if (line.includes('line-length')) {
                return `line-length = ${LINE_LENGTH}`;
              } else if (line.includes('line_length')) {
                return `line_length = ${LINE_LENGTH}`;
              } else if (line.includes('max-line-length')) {
                return `max-line-length = ${LINE_LENGTH}`;
                // TARGET VERSION
              } else if (line.startsWith("target-version = ['py")) {
                return `target-version = ['py${PY_TARGET.replace('.', '')}']`;
              } else if (line.startsWith('py_version = 3')) {
                return `py_version = ${PY_TARGET.replace('.', '')}`;
              } else if (line.startsWith('python_version = "3.')) {
                return `python_version = "${PY_TARGET}"`;
              } else if (line.startsWith('target-version = "py3')) {
                return `target-version = "py${PY_TARGET.replace('.', '')}"`;
              } else if (line.startsWith('pythonVersion = "3.')) {
                return `pythonVersion = "${PY_TARGET}"`;
              } else {
                //EVERYTHING ELSE
                return line;
              }
            });

            templateData = Buffer.from(modifiedData.join('\r\n'), 'utf8');
          } else if (filename === '.pre-commit-config.yaml') {
            const data = templateData.toString().split('\n');

            let isFormatter = false;
            const modifiedData = data.map((line: string) => {
              if (
                line.includes('nbqa-black') &&
                FORMATTING_TOOL.toLowerCase() === 'ruff'
              ) {
                // do nothing
              } else if (
                line.includes('-   repo: https://github.com/psf/black') &&
                FORMATTING_TOOL.toLowerCase() === 'ruff'
              ) {
                isFormatter = true;
                return `-   repo: https://github.com/astral-sh/ruff-pre-commit`;
              } else if (line.includes('repo:')) {
                isFormatter = false;
                return line;
              } else if (
                isFormatter &&
                FORMATTING_TOOL.toLowerCase() === 'ruff'
              ) {
                if (line.includes(`    rev: ${BLACK_VERSION}`)) {
                  return `    rev: ${RUFF_VERSION}`;
                } else if (line.includes('    hooks:')) {
                  return '    hooks:';
                } else if (line.includes('    -   id: black')) {
                  return '    -   id: ruff-format\n        types_or: [python, pyi, jupyter]';
                } else {
                  isFormatter = false;
                  return line;
                }
              } else {
                return line;
              }
            });

            templateData = Buffer.from(
              modifiedData
                .filter((value: string | undefined) => value !== undefined)
                .join('\r\n'),
              'utf8',
            );
          } else if (filename === 'requirements-dev.txt') {
            const data = templateData.toString().split('\n');

            templateData = Buffer.from(data.join('\r\n'), 'utf8');
          }

          fs.writeFileSync(targetFilename, templateData);
        } catch (err) {
          vscode.window.showErrorMessage(
            `Could not write file ${targetFilename}.`,
          );
          return;
        }
      });
    },
  );

  context?.subscriptions.push(generateCCommandDisposable);
}

function getFilepaths() {
  if (!EXTENSION_PATH || !WORKSPACE_FOLDER) return {};

  const templatePath = path.join(EXTENSION_PATH, 'templates');
  const vscodePath = path.join(WORKSPACE_FOLDER, '.vscode');

  return { templatePath, vscodePath };
}
