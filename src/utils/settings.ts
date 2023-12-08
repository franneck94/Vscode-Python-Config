import * as vscode from 'vscode';

export function getGlobalSetting(
  extension_name: string,
  name: string,
  defaultValue: any,
) {
  const configGlobal = vscode.workspace.getConfiguration(extension_name);
  const fullSettingInfo = configGlobal.inspect(name);
  return fullSettingInfo?.globalValue
    ? fullSettingInfo.globalValue
    : defaultValue;
}
