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
        try {
            const config = vscode.workspace.getConfiguration('theRightTerminal');
            const terminalName = config.get<string>('terminalName', 'AI CLI Terminal');
            const defaultCommand = config.get<string>('defaultCommand', '');
            const clearOnOpen = config.get<boolean>('clearOnOpen', false);
            const preserveFocus = config.get<boolean>('preserveFocus', false);

            // Keep track of active text editor to restore focus if needed
            const previousActiveEditor = vscode.window.activeTextEditor;

            // Find an existing active terminal with our name that hasn't exited
            let terminal = vscode.window.terminals.find(t => t.name === terminalName && t.exitStatus === undefined);
            let isNew = !terminal;

            if (!terminal) {
                // Create terminal directly in the group beside the current one (native split-right)
                terminal = vscode.window.createTerminal({
                    name: terminalName,
                    location: {
                        viewColumn: vscode.ViewColumn.Beside,
                        preserveFocus: preserveFocus
                    }
                });
                isNew = true;
            } else {
                // Show the existing terminal editor
                terminal.show(preserveFocus);
            }

            // Only execute the auto-command if this is a newly created terminal
            if (isNew) {
                // Run the default command if it's a newly created terminal
                if (defaultCommand) {
                    // A slight delay ensures the terminal is ready to receive input
                    await new Promise(resolve => setTimeout(resolve, 150));
                    if (clearOnOpen) {
                        terminal.sendText('clear');
                    }
                    terminal.sendText(defaultCommand);
                }
            }

            // Restore focus to the previous editor if preserveFocus is enabled
            if (preserveFocus && previousActiveEditor) {
                await vscode.window.showTextDocument(previousActiveEditor.document, previousActiveEditor.viewColumn);
            }
        } catch (error) {
            console.error('Error opening the right terminal:', error);
            
            // Safe fallback to create a brand new terminal on error
            try {
                const config = vscode.workspace.getConfiguration('theRightTerminal');
                const terminalName = config.get<string>('terminalName', 'AI CLI Terminal');
                const defaultCommand = config.get<string>('defaultCommand', '');
                const clearOnOpen = config.get<boolean>('clearOnOpen', false);
                const preserveFocus = config.get<boolean>('preserveFocus', false);

                const terminal = vscode.window.createTerminal({
                    name: terminalName,
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
            } catch (fallbackError) {
                console.error('Fallback failed:', fallbackError);
            }
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
