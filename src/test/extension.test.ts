import * as assert from 'assert';
import * as vscode from 'vscode';
import { getConfig } from '../extension';

suite('theRightTerminal', () => {
    test('getConfig returns documented defaults when unset', () => {
        const config = getConfig();
        assert.strictEqual(config.terminalName, 'Right Terminal');
        assert.strictEqual(config.defaultCommand, '');
        assert.strictEqual(config.clearOnOpen, false);
        assert.strictEqual(config.preserveFocus, false);
    });

    test('theRightTerminal.open creates and then disposes a terminal on toggle', async () => {
        const { terminalName } = getConfig();

        await vscode.commands.executeCommand('theRightTerminal.open');
        assert.ok(
            vscode.window.terminals.some(t => t.name === terminalName),
            'expected a terminal to be created on first toggle'
        );

        await vscode.commands.executeCommand('theRightTerminal.open');
        assert.ok(
            !vscode.window.terminals.some(t => t.name === terminalName),
            'expected the terminal to be disposed on second toggle'
        );
    });
});
