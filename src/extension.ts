import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension "the-right-terminal" is now active!');

    // Create a Status Bar Item
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'theRightTerminal.open';
    statusBarItem.text = '$(terminal) Right Terminal';
    statusBarItem.tooltip = 'Click to open a Terminal on the Right';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    let disposable = vscode.commands.registerCommand('theRightTerminal.open', async () => {
        const config = vscode.workspace.getConfiguration('theRightTerminal');
        const terminalName = config.get<string>('terminalName', 'AI CLI Terminal');
        const defaultCommand = config.get<string>('defaultCommand', '');
        const clearOnOpen = config.get<boolean>('clearOnOpen', false);
        const preserveFocus = config.get<boolean>('preserveFocus', false);

        // Keep track of active text editor to restore focus if needed
        const previousActiveEditor = vscode.window.activeTextEditor;

        // Find existing terminal or create a new one
        let terminal = vscode.window.terminals.find(t => t.name === terminalName);
        const isNew = !terminal;

        if (!terminal) {
            terminal = vscode.window.createTerminal({
                name: terminalName,
                location: vscode.TerminalLocation.Editor
            });
        }

        // Show the terminal editor
        terminal.show(preserveFocus);

        // Move the terminal editor to the right group
        // A slight delay is helpful to ensure VS Code has rendered/registered the terminal editor tab
        await new Promise(resolve => setTimeout(resolve, 150));
        await vscode.commands.executeCommand('workbench.action.moveEditorToRightGroup');

        // Run the default command if it's a newly created terminal
        if (isNew && defaultCommand) {
            if (clearOnOpen) {
                terminal.sendText('clear');
            }
            terminal.sendText(defaultCommand);
        }

        // Restore focus to the previous editor if preserveFocus is enabled
        if (preserveFocus && previousActiveEditor) {
            await vscode.window.showTextDocument(previousActiveEditor.document, previousActiveEditor.viewColumn);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
