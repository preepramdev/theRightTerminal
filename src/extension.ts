import * as vscode from 'vscode';

function findTerminalTab(terminalName: string): vscode.Tab | undefined {
    try {
        for (const group of vscode.window.tabGroups.all) {
            for (const tab of group.tabs) {
                const isTerminalInput = tab.input && (
                    tab.input instanceof vscode.TabInputTerminal || 
                    tab.input.constructor.name === 'TabInputTerminal' ||
                    (tab.input as any).uri?.scheme === 'vscode-terminal'
                );
                if (isTerminalInput && tab.label === terminalName) {
                    return tab;
                }
            }
        }
    } catch (e) {
        console.error('Error finding terminal tab:', e);
    }
    return undefined;
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension "the-right-terminal" is now active!');

    // Create a Status Bar Item
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'theRightTerminal.open';
    statusBarItem.text = '$(terminal) Right Terminal';
    statusBarItem.tooltip = 'Click to toggle Terminal on the Right';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    // Listen for terminal close events to reset the status bar state
    context.subscriptions.push(vscode.window.onDidCloseTerminal(t => {
        const config = vscode.workspace.getConfiguration('theRightTerminal');
        const terminalName = config.get<string>('terminalName', 'Right Terminal');
        if (t.name === terminalName) {
            statusBarItem.text = '$(terminal) Right Terminal';
            statusBarItem.tooltip = 'Click to toggle Terminal on the Right';
        }
    }));

    let disposable = vscode.commands.registerCommand('theRightTerminal.open', async () => {
        try {
            const config = vscode.workspace.getConfiguration('theRightTerminal');
            const terminalName = config.get<string>('terminalName', 'Right Terminal');
            const defaultCommand = config.get<string>('defaultCommand', '');
            const clearOnOpen = config.get<boolean>('clearOnOpen', false);
            const preserveFocus = config.get<boolean>('preserveFocus', false);

            // Keep track of active text editor to restore focus if needed
            const previousActiveEditor = vscode.window.activeTextEditor;

            // Check if the terminal editor is currently active/focused to toggle show/hide
            const terminalTab = findTerminalTab(terminalName);
            let terminal = vscode.window.terminals.find(t => t.name === terminalName && t.exitStatus === undefined);

            if (terminal) {
                if (terminalTab) {
                    if (terminalTab.isActive && terminalTab.group.isActive) {
                        // It's currently active and focused. Hide it completely!
                        // 1. Focus the first editor group (usually where the code editor is)
                        await vscode.commands.executeCommand('workbench.action.focusFirstEditorGroup');
                        // 2. Maximize the focused code editor group (this completely collapses and hides the terminal group with ZERO blinking)
                        await vscode.commands.executeCommand('workbench.action.toggleMaximizeEditorGroup');

                        // Update status bar to show it is running in background (hidden)
                        statusBarItem.text = '$(terminal) Right Terminal (Running)';
                        statusBarItem.tooltip = 'Right Terminal is running in the background. Click to show.';
                    } else {
                        // It exists and is hidden/collapsed. Show/restore it!
                        // 1. Even the editor widths (un-maximize and restore to split-screen)
                        await vscode.commands.executeCommand('workbench.action.evenEditorWidths');
                        // 2. Focus the terminal tab
                        terminal.show(preserveFocus);

                        // Update status bar back to standard
                        statusBarItem.text = '$(terminal) Right Terminal';
                        statusBarItem.tooltip = 'Click to toggle Terminal on the Right';

                        if (preserveFocus && previousActiveEditor) {
                            await vscode.window.showTextDocument(previousActiveEditor.document, previousActiveEditor.viewColumn);
                        }
                    }
                    return;
                } else {
                    // Fallback: Terminal exists but tab wasn't found in tabGroups. Show/restore it!
                    await vscode.commands.executeCommand('workbench.action.evenEditorWidths');
                    terminal.show(preserveFocus);
                    return;
                }
            }

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
                const terminalName = config.get<string>('terminalName', 'Right Terminal');
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
