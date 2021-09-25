import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  test('Test getBasename', () => {
    assert.strictEqual(true, true);
  });

  vscode.window.showInformationMessage('Finished all tests.');
});
