import * as vscode from 'vscode';

function disposeTerminal(name: string) {
    for (const t of vscode.window.terminals) {
        if (t.name === name) {
            t.dispose();
        }
    }
}

async function closeEmptyGroups() {
    let closed = true;
    while (closed) {
        closed = false;
        for (const group of vscode.window.tabGroups.all) {
            if (group.tabs.length === 0) {
                await vscode.window.tabGroups.close(group, true);
                closed = true;
                break;
            }
        }
    }
    await vscode.commands.executeCommand('workbench.action.evenEditorWidths');
}

function getConfig() {
    const config = vscode.workspace.getConfiguration('theRightTerminal');
    return {
        terminalName: config.get<string>('terminalName', 'Right Terminal'),
        defaultCommand: config.get<string>('defaultCommand', ''),
        clearOnOpen: config.get<boolean>('clearOnOpen', false),
        preserveFocus: config.get<boolean>('preserveFocus', false),
    };
}

export function activate(context: vscode.ExtensionContext) {
    const { terminalName } = getConfig();

    disposeTerminal(terminalName);
    closeEmptyGroups();

    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'theRightTerminal.open';
    statusBarItem.text = `$(terminal) ${terminalName}`;
    statusBarItem.tooltip = `Toggle ${terminalName}`;
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    let disposable = vscode.commands.registerCommand('theRightTerminal.open', async () => {
        try {
            const { terminalName, defaultCommand, clearOnOpen, preserveFocus } = getConfig();
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
            vscode.window.showErrorMessage('Failed to open Right Terminal');
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
    const { terminalName } = getConfig();
    disposeTerminal(terminalName);
}
