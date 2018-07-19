'use strict'
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as prettydiff from 'prettydiff2';
import * as vscode from 'vscode';

const vscodeConfig = vscode.workspace.getConfiguration('editor')

const prettyDiff = (document: any, range: any, options: Object) => {
  const result = []
  const content = document.getText(range)
  const activeConfig = vscode.window.activeTextEditor.options

  const newText = prettydiff({
    source: content,
    lang: 'html',
    mode: 'beautify',
    insize: activeConfig.tabSize || vscodeConfig.tabSize,
    newLine: vscodeConfig.newLine,
    objsort: vscodeConfig.methodChain,
    wrap: vscodeConfig.wrap,
    methodchain: vscodeConfig.methodchain,
    ternaryline: vscodeConfig.ternaryLine,
  })

  result.push(vscode.TextEdit.replace(range, newText))
  return result
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider('nunjucks', {
      provideDocumentFormattingEdits(document, options, token) {
        // entire contnets
        const start = new vscode.Position(0, 0)
        const end = new vscode.Position(
          document.lineCount - 1,
          document.lineAt(document.lineCount - 1).text.length,
        )
        const range = new vscode.Range(start, end)
        return prettyDiff(document, range, options)
      },
    }),
  )
}

// this method is called when your extension is deactivated
export function deactivate() {}
