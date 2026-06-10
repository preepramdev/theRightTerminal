import * as vscode from 'vscode';

function disposeTerminal(name: string) {
    for (const t of vscode.window.terminals) {
        if (t.name === name) {
            t.dispose();
        }
    }
}

async function closeEmptyGroups() {
    for (const group of vscode.window.tabGroups.all) {
        if (group.tabs.length === 0) {
            await vscode.window.tabGroups.close(group, true);
        }
    }
    await vscode.commands.executeCommand('workbench.action.evenEditorWidths');
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension "the-right-terminal" is now active!');

    const config = vscode.workspace.getConfiguration('theRightTerminal');
    const terminalName = config.get<string>('terminalName', 'Right Terminal');
    const defaultCommand = config.get<string>('defaultCommand', '');
    const clearOnOpen = config.get<boolean>('clearOnOpen', false);
    const preserveFocus = config.get<boolean>('preserveFocus', false);

    disposeTerminal(terminalName);
    closeEmptyGroups();

    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'theRightTerminal.open';
    statusBarItem.text = '$(terminal) Right Terminal';
    statusBarItem.tooltip = 'Click to toggle Terminal on the Right';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    let disposable = vscode.commands.registerCommand('theRightTerminal.open', async () => {
        try {
            const previousActiveEditor = vscode.window.activeTextEditor;

            const existing = vscode.window.terminals.find(t => t.name === terminalName);
            if (existing) {
                disposeTerminal(terminalName);
                await closeEmptyGroups();
                return;
            }

            const terminal = vscode.window.createTerminal({
                name: terminalName,
                isTransient: true,
                location: {
                    viewColumn: vscode.ViewColumn.Beside,
                    preserveFocus: preserveFocus
                }
            });

            if (defaultCommand) {
                await new Promise(resolve => setTimeout(resolve, 150));
                if (clearOnOpen) {
                    terminal.sendText('clear');
                }
                terminal.sendText(defaultCommand);
            }

            if (preserveFocus && previousActiveEditor) {
                await vscode.window.showTextDocument(previousActiveEditor.document, previousActiveEditor.viewColumn);
            }
        } catch (error) {
            console.error('Error opening the right terminal:', error);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
    disposeTerminal('Right Terminal');
}
