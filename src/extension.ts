import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

import * as toml from '@iarna/toml';

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
const ROOT_DIR_FILES_GENERAL = [
  '.editorconfig',
  '.gitattributes',
  '.gitignore',
];
const ROOT_DIR_FILES_PYTHON = [
  '.pre-commit-config.yaml',
  'pyproject.toml',
  'requirements-dev.txt',
  'requirements.txt',
];

const LINE_LENGTH_DEFAULT = 120;
const IS_AGGRESSIVE_DEFAULT = false;
const PY_TARGET_DEFAULT = '3.10';
const FORMATTING_TOOL_DEFAULT = 'ruff';
const RUFF_VERSION = 'v0.2.0';
const BLACK_VERSION = '24.1.1';

const AGGRESSIVE_SELECTS =
  '["C90", "I", "N", "UP", "YTT", "ANN", "ASYNC", "TRIO", "S", "BLE", "B", "A", "COM", "C4", "DTZ", "T10", "DJ", "EM", "EXE", "FA", "ISC", "ICN", "G", "INP", "PIE", "PYI", "PT", "Q", "RSE", "RET", "SLOT", "SIM", "TID", "TCH", "INT", "ARG", "PTH", "PD", "PL", "TRY", "FLY", "NPY", "AIR", "PERF", "FURB", "LOG", "RUF"]';
const AGGRESSIVE_IGNORES =
  '["ANN101", "ANN102", "I001", "NPY002", "INP001", "TRY003", "ISC001", "COM812"]';
const AGGRESSIVE_FIXABLES = '["ALL"]';
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

      VSCODE_DIR_FILES.forEach((filename: string) => {
        const targetFilename = path.join(vscodePath, filename);
        const templateFilename = path.join(templatePath, filename);

        saveVscodeFiles(templateFilename, targetFilename, filename);
      });

      ROOT_DIR_FILES_PYTHON.forEach((filename) => {
        if (!WORKSPACE_FOLDER) return;

        const targetFilename = path.join(WORKSPACE_FOLDER, filename);
        const templateFilename = path.join(templatePath, filename);

        saveRootdirPythonFiles(templateFilename, targetFilename, filename);
      });

      ROOT_DIR_FILES_GENERAL.forEach((filename) => {
        if (!WORKSPACE_FOLDER) return;

        const targetFilename = path.join(WORKSPACE_FOLDER, filename);
        const templateFilename = path.join(templatePath, filename);

        saveRootdirGeneralFiles(templateFilename, targetFilename);
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

function saveVscodeFiles(
  templateFilename: string,
  targetFilename: string,
  filename: string,
) {
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
    } else if (filename === 'launch.json') {
      if (pathExists(targetFilename)) {
        const targetFileData: {
          [key: string]: string | any[] | boolean | number | any;
        } = readJsonFile(targetFilename);

        if (
          targetFileData['configurations'] &&
          templateData['configurations']
        ) {
          const mergedData = [...templateData['configurations']];

          for (const targetFileDataItem of targetFileData['configurations']) {
            const labelExistsInUserConfig = mergedData.some(
              (task) => task['name'] === targetFileDataItem['name'],
            );

            if (!labelExistsInUserConfig) {
              mergedData.push(targetFileDataItem);
            }
          }

          templateData['configurations'] = mergedData;
        }
      }
    } else if (filename === 'tasks.json') {
      if (pathExists(targetFilename)) {
        const targetFileData: {
          [key: string]: string | any[] | boolean | number | any;
        } = readJsonFile(targetFilename);

        if (targetFileData['tasks'] && templateData['tasks']) {
          const mergedData = [...templateData['tasks']];

          for (const targetFileDataItem of targetFileData['tasks']) {
            const labelExistsInUserConfig = mergedData.some(
              (task) => task.label === targetFileDataItem['label'],
            );

            if (!labelExistsInUserConfig) {
              mergedData.push(targetFileDataItem);
            }
          }

          templateData['tasks'] = mergedData;
        }
      }
    }

    writeJsonFile(targetFilename, templateData);
  } catch (err) {
    vscode.window.showErrorMessage(`Could not write file ${targetFilename}.`);
    return;
  }
}

function saveRootdirPythonFiles(
  templateFilename: string,
  targetFilename: string,
  filename: string,
) {
  try {
    let templateData = fs.readFileSync(templateFilename);
    const data = templateData.toString().split('\n');

    if (filename === 'pyproject.toml') {
      let modifiedData = pyprojectTomlContent(data);

      const currentPyprojectData = fs.readFileSync(targetFilename);
      const currentTomlData = toml.parse(currentPyprojectData.toString());
      const templateTomlData = toml.parse(templateData.toString());

      const fileExistAlready = projectHasAlrearyPyprojectToml(targetFilename);
      const hasProjectDefinition = projectHasProjectDefinition(currentTomlData);
      if (fileExistAlready && hasProjectDefinition) {
        const mergedTomlData = mergeTomlFiles(
          currentTomlData,
          templateTomlData,
        );
        if (mergedTomlData !== undefined)
          modifiedData = toml.stringify(mergedTomlData).split('\n');
      }

      templateData = Buffer.from(modifiedData.join('\r\n'), 'utf8');
      fs.writeFileSync(targetFilename, templateData);
    } else if (filename === '.pre-commit-config.yaml') {
      const modifiedData = preCommitYamlContent(data);

      templateData = Buffer.from(
        modifiedData
          .filter((value: string | undefined) => value !== undefined)
          .join('\r\n'),
        'utf8',
      );
      fs.writeFileSync(targetFilename, templateData);
    } else if (
      filename === 'requirements.txt' ||
      filename === 'requirements-dev.txt'
    ) {
      templateData = Buffer.from(data.join('\r\n'), 'utf8');

      if (!pathExists(targetFilename)) {
        fs.writeFileSync(targetFilename, templateData);
      }
    }
  } catch (err) {
    vscode.window.showErrorMessage(`Could not write file ${targetFilename}.`);
    return;
  }
}

function saveRootdirGeneralFiles(
  templateFilename: string,
  targetFilename: string,
) {
  try {
    const templateData = fs.readFileSync(templateFilename);

    // dont override files
    if (!pathExists(targetFilename)) {
      fs.writeFileSync(targetFilename, templateData);
    }
  } catch (err) {
    vscode.window.showErrorMessage(`Could not write file ${targetFilename}.`);
    return;
  }
}

function pyprojectTomlContent(data: string[]) {
  return data.map((line: string) => {
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
}

function preCommitYamlContent(data: string[]) {
  let isFormatterLines = false;

  return data.map((line: string) => {
    if (
      line.includes('nbqa-black') &&
      FORMATTING_TOOL.toLowerCase() === 'ruff'
    ) {
      // do nothing
    } else if (
      line.includes('-   repo: https://github.com/psf/black') &&
      FORMATTING_TOOL.toLowerCase() === 'ruff'
    ) {
      isFormatterLines = true;
      return `-   repo: https://github.com/astral-sh/ruff-pre-commit`;
    } else if (line.includes('repo:')) {
      isFormatterLines = false;
      return line;
    } else if (isFormatterLines && FORMATTING_TOOL.toLowerCase() === 'ruff') {
      if (line.includes(`    rev: ${BLACK_VERSION}`)) {
        return `    rev: ${RUFF_VERSION}`;
      } else if (line.includes('    hooks:')) {
        return '    hooks:';
      } else if (line.includes('    -   id: black')) {
        return '    -   id: ruff-format\n        types_or: [python, pyi, jupyter]';
      } else {
        isFormatterLines = false;
        return line;
      }
    } else {
      return line;
    }
  });
}

function projectHasAlrearyPyprojectToml(targetFilename: string): boolean {
  return pathExists(targetFilename);
}

function projectHasProjectDefinition(tomlData: toml.JsonMap): boolean {
  try {
    if (tomlData['tool']) return true;
  } catch (err) {}

  return false;
}

function mergeTomlFiles(
  currentTomlData: toml.JsonMap,
  templateTomlData: toml.JsonMap,
) {
  const mergedTomlData = currentTomlData;
  const mergeKeys = ['black', 'isort', 'ruff', 'mypy', 'pyright'];

  for (const mergeKey of mergeKeys) {
    if (
      currentTomlData['tool'] !== undefined &&
      currentTomlData['tool'][mergeKey] !== undefined
    ) {
      mergedTomlData['tool'][mergeKey] = templateTomlData['tool'][mergeKey];
    } else {
      mergedTomlData['tool'][mergeKey] = templateTomlData['tool'][mergeKey];
    }
  }

  return mergedTomlData;
}
