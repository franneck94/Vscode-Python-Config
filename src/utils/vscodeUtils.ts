import * as vscode from 'vscode';

export function disposeItem(disposableItem: vscode.Disposable | undefined) {
  disposableItem?.dispose();
}
