import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

import * as toml from '@iarna/toml';

import {
  filesInDir,
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
const GITHUB_FILES = [
  'codeql-analysis.yaml',
  'documentation.yaml',
  'pre-commit.yaml',
  'publish.yaml',
  'test.yaml',
];
const ROOT_DIR_FILES_PROJECT = ['mkdocs.yaml', 'LICENSE', 'README.md'];
const DOCS_FILES = ['api.md', 'index.md'];

const LINE_LENGTH_DEFAULT = 120;
const IS_AGGRESSIVE_DEFAULT = false;
const PY_TARGET_DEFAULT = '3.10';
const FORMATTING_TOOL_DEFAULT = 'ruff';
const RUFF_VERSION = 'v0.4.10';
const BLACK_VERSION = '24.4.2';

const AGGRESSIVE_SELECTS = `
    "C90",
    "I",
    "N",
    "UP",
    "YTT",
    "ANN",
    "ASYNC",
    "S",
    "BLE",
    "B",
    "A",
    "COM",
    "C4",
    "DTZ",
    "T10",
    "DJ",
    "EM",
    "EXE",
    "FA",
    "ISC",
    "ICN",
    "G",
    "INP",
    "PIE",
    "PYI",
    "PT",
    "Q",
    "RSE",
    "RET",
    "SLOT",
    "SIM",
    "TID",
    "INT",
    "ARG",
    "PTH",
    "PD",
    "PL",
    "TRY",
    "FLY",
    "NPY",
    "AIR",
    "PERF",
    "FURB",
    "LOG",
    "RUF",
`;
const AGGRESSIVE_IGNORES = `
    "ANN101",
    "ANN102",
    "ANN401",
    "I001",
    "NPY002",
    "INP001",
    "TRY003",
    "ISC001",
    "COM812",
`;
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
      const workspace = WORKSPACE_FOLDER;

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
        const targetFilename = path.join(workspace, filename);
        const templateFilename = path.join(templatePath, filename);

        saveRootdirPythonFiles(templateFilename, targetFilename, filename);
      });

      ROOT_DIR_FILES_GENERAL.forEach((filename) => {
        const targetFilename = path.join(workspace, filename);
        const templateFilename = path.join(templatePath, filename);

        saveRootdirGeneralFiles(templateFilename, targetFilename);
      });

      const projectName = getProjectName(workspace);
      if (projectName === '') return;

      const targetGithubDir = path.join(workspace, '.github', 'workflows');
      if (!pathExists(targetGithubDir)) {
        mkdirRecursive(targetGithubDir);
      }

      GITHUB_FILES.forEach((filename: string) => {
        const templateFilename = path.join(
          templatePath,
          '.github',
          'workflows',
          filename,
        );
        const targetFilename = path.join(targetGithubDir, filename);

        saveGithubFiles(templateFilename, targetFilename);
      });

      const hasReadmeRst = pathExists(path.join(workspace, 'README.rst'));
      const targetDocsDir = path.join(workspace, 'docs');
      let hasSphinxDocs = hasAlreadySphinxDoc(targetDocsDir);
      if (!hasSphinxDocs) {
        hasSphinxDocs = hasAlreadySphinxDoc(path.join(workspace, 'doc'));
      }

      ROOT_DIR_FILES_PROJECT.forEach((filename: string) => {
        const templateFilename = path.join(templatePath, filename);
        const targetFilename = path.join(workspace, filename);

        if (
          (filename === 'README.md' && !hasReadmeRst) ||
          (filename === 'mkdocs.yaml' && !hasSphinxDocs) ||
          (filename !== 'README.md' && filename !== 'mkdocs.yaml')
        ) {
          saveProjectFiles(templateFilename, targetFilename, projectName);
        }
      });

      const docDir = path.join(workspace, 'doc');
      const hasDocDir = pathExists(docDir);
      if (hasSphinxDocs || hasDocDir) return;

      if (!pathExists(targetDocsDir)) {
        mkdirRecursive(targetDocsDir);
      }

      DOCS_FILES.forEach((filename: string) => {
        const templateFilename = path.join(templatePath, 'docs', filename);
        const targetFilename = path.join(targetDocsDir, filename);

        saveProjectFiles(templateFilename, targetFilename, projectName);
      });
    },
  );

  context?.subscriptions.push(generateCCommandDisposable);
}

function hasAlreadySphinxDoc(targetDocsDir: string) {
  const hasSphinxDir = pathExists(path.join(targetDocsDir, 'sphinx'));
  const currentDocFiles = filesInDir(targetDocsDir);
  return (
    hasSphinxDir ||
    currentDocFiles.some((file: string) => file.endsWith('.rst'))
  );
}

function getProjectName(workspace: string) {
  if (pathExists(path.join(workspace, 'setup.py'))) {
    return getProjectNameFromSetup(workspace, path.join(workspace, 'setup.py'));
  } else if (pathExists(path.join(workspace, 'setup.cfg'))) {
    return getProjectNameFromSetup(
      workspace,
      path.join(workspace, 'setup.cfg'),
    );
  } else if (pathExists(path.join(workspace, 'pyproject.toml'))) {
    const currentPyprojectData = fs.readFileSync(
      path.join(workspace, 'pyproject.toml'),
    );
    const currentTomlData = toml.parse(currentPyprojectData.toString());
    const hasProjectDefinition = projectHasProjectDefinition(currentTomlData);
    if (hasProjectDefinition) return path.basename(workspace);
  }

  return '';
}

function getProjectNameFromSetup(workspace: string, filename: string) {
  const setupBuffer = fs.readFileSync(filename);
  const setupData = setupBuffer.toString().split('\n');
  const projectLine = setupData.find((line: string) => line.includes('name='));
  if (projectLine !== undefined)
    return projectLine
      .slice(projectLine.indexOf('=') + 1)
      .replaceAll('"', '')
      .replaceAll(',', '');
  else return path.basename(workspace);
}

function saveProjectFiles(
  templateFilename: string,
  targetFilename: string,
  projectName: string,
) {
  try {
    if (pathExists(targetFilename)) return;

    let templateDataBuffer = fs.readFileSync(templateFilename);
    const templateData = templateDataBuffer.toString().split('\n');

    const modifiedData = templateData.map((line: string) => {
      if (line.includes('PROJECTNAME')) {
        return line.replace('PROJECTNAME', projectName);
      } else {
        return line;
      }
    });

    templateDataBuffer = Buffer.from(modifiedData.join('\r\n'), 'utf8');
    fs.writeFileSync(targetFilename, templateDataBuffer);
  } catch (err) {
    vscode.window.showErrorMessage(`Could not write file ${targetFilename}.`);
    return;
  }
}

function saveGithubFiles(templateFilename: string, targetFilename: string) {
  try {
    if (pathExists(targetFilename)) return;
    const templateDataBuffer = fs.readFileSync(templateFilename);
    fs.writeFileSync(targetFilename, templateDataBuffer);
  } catch (err) {
    vscode.window.showErrorMessage(`Could not write file ${targetFilename}.`);
    return;
  }
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

      if (IS_AGGRESSIVE) {
        templateData['[python]']['editor.codeActionsOnSave'][
          'source.organizeImports'
        ] = 'explicit';
      } else {
        templateData['[python]']['editor.codeActionsOnSave'][
          'source.organizeImports'
        ] = 'never';
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
    const templateDataBuffer = fs.readFileSync(templateFilename);
    const templateData = templateDataBuffer.toString().split('\n');

    if (filename === 'pyproject.toml') {
      savePyProjectToml(targetFilename, templateData);
    } else if (filename === '.pre-commit-config.yaml') {
      savePreCommitFile(targetFilename, templateData);
    } else if (
      filename === 'requirements.txt' ||
      filename === 'requirements-dev.txt'
    ) {
      saveRequirementsFile(targetFilename, templateData);
    }
  } catch (err) {
    vscode.window.showErrorMessage(`Could not write file ${targetFilename}.`);
    return;
  }
}

async function savePyProjectToml(
  targetFilename: string,
  templateData: string[],
) {
  let modifiedData = pyprojectTomlContent(templateData);

  const fileExistAlready = projectHasAlrearyPyprojectToml(targetFilename);
  if (fileExistAlready) {
    const currentPyprojectData = fs.readFileSync(targetFilename);
    const currentTomlData = toml.parse(currentPyprojectData.toString());

    const hasProjectDefinition = projectHasProjectDefinition(currentTomlData);
    if (hasProjectDefinition) {
      const templateTomlData = toml.parse(modifiedData.join('\n'));
      const mergedTomlData = mergeTomlFiles(currentTomlData, templateTomlData);
      if (mergedTomlData !== undefined) {
        modifiedData = toml.stringify(mergedTomlData).split('\n');

        modifiedData = modifiedData.map((line: string) => {
          if (
            (line.includes('[') && !line.includes('"')) ||
            (line.includes('=') && line.indexOf('"') >= line.indexOf('='))
          ) {
            return line.trimStart().replace('[ ', '[').replace(' ]', ']');
          } else if (/^ {2}/.test(line)) {
            return line.replace(/^ {2}/, '    ');
          } else {
            return line;
          }
        });
      }
    }
  }

  const templateDataBuffer = Buffer.from(modifiedData.join('\r\n'), 'utf8');
  fs.writeFileSync(targetFilename, templateDataBuffer);
}

function savePreCommitFile(targetFilename: string, templateData: string[]) {
  const modifiedData = preCommitYamlContent(templateData);

  const templateDataBuffer = Buffer.from(
    modifiedData
      .filter((value: string | undefined) => value !== undefined)
      .join('\r\n'),
    'utf8',
  );
  fs.writeFileSync(targetFilename, templateDataBuffer);
}

function saveRequirementsFile(targetFilename: string, templateData: string[]) {
  if (
    !pathExists(targetFilename) ||
    targetFilename.includes('requirements-dev.txt')
  ) {
    const templateDataBuffer = Buffer.from(templateData.join('\r\n'), 'utf8');
    fs.writeFileSync(targetFilename, templateDataBuffer);
  } else {
    if (targetFilename.includes('requirements.txt')) {
      const currentRequirementsBuffer = fs.readFileSync(targetFilename);
      const currentRequirements = currentRequirementsBuffer
        .toString()
        .split('\n');
      const hasDevLinked = currentRequirements.some(
        (req: string) => req === '-r requirements-dev.txt',
      );
      if (!hasDevLinked) {
        currentRequirements.push('-r requirements-dev.txt');
        const modifiedCurrentRequirementsBuffer = Buffer.from(
          currentRequirements.join('\r\n'),
          'utf8',
        );
        fs.writeFileSync(targetFilename, modifiedCurrentRequirementsBuffer);
      }
    }
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

function pyprojectTomlContent(templateData: string[]) {
  const mapped_data = templateData.map((line: string) => {
    if (IS_AGGRESSIVE) {
      return aggressiveSettingsPyprojectToml(line);
    }

    return regularSettingsPyprojectToml(line);
  });

  return mapped_data;
}

function aggressiveSettingsPyprojectToml(line: string) {
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
  } else if (line.includes('extend-select')) {
    // START: RUFF
    return 'extend-select = [' + `${AGGRESSIVE_SELECTS}` + ']';
  } else if (line.startsWith('ignore = ')) {
    return 'ignore = [' + `${AGGRESSIVE_IGNORES}` + ']';
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
  } else {
    return regularSettingsPyprojectToml(line);
  }
}

function regularSettingsPyprojectToml(line: string) {
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
}

function preCommitYamlContent(templateData: string[]) {
  let isFormatterLines = false;

  return templateData.map((line: string) => {
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
    if (tomlData['project'] !== undefined) return true;
  } catch (err) {}

  return false;
}

function mergeTomlFiles(
  currentTomlData: toml.JsonMap,
  templateTomlData: toml.JsonMap,
) {
  const mergedTomlData = currentTomlData;
  const mergeKeys = ['black', 'isort', 'ruff', 'mypy'];

  for (const mergeKey of mergeKeys) {
    if (
      currentTomlData['tool'] !== undefined &&
      // @ts-ignore
      currentTomlData['tool'][mergeKey] !== undefined
    ) {
      // @ts-ignore
      mergedTomlData['tool'][mergeKey] = templateTomlData['tool'][mergeKey];
    } else {
      // @ts-ignore
      mergedTomlData['tool'][mergeKey] = templateTomlData['tool'][mergeKey];
    }
  }

  return mergedTomlData;
}
