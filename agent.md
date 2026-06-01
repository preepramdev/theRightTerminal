# Agent Guide: The Right Terminal

This document is for AI agents working on this project. It provides the layout, build instructions, and core logic details for **The Right Terminal** VS Code extension.

## Project Overview
"The Right Terminal" is a VS Code extension written in TypeScript that spawns a terminal inside the Editor Area (instead of the bottom panel) and automatically positions it on the right side of the editor grid. This is perfect for running interactive CLI-based AI tools (like `aider`, `gpt-cli`, etc.) alongside code.

## Directory Structure
- `src/extension.ts` — The entrypoint of the extension containing activation and terminal handling logic.
- `package.json` — Manifest defining extension commands (`theRightTerminal.open`), settings configuration, build scripts, and dependencies.
- `tsconfig.json` — TypeScript compilation configuration.
- `dist/extension.js` — Minified, bundled production script compiled via `esbuild`.
- `.vscode/`
  - `launch.json` — Debug config to launch the extension development host.
  - `tasks.json` — Build tasks for VS Code automation (runs `npm run watch`).

## Extension Contribution & Configuration

### Commands
- `theRightTerminal.open` (Title: `Open Terminal on the Right`, Icon: `$(terminal)`): Creates (or reuses) the right terminal and positions it.

### Trigger Entrypoints
The extension supports three fast ways to trigger the terminal:
1. **Keyboard Shortcut:** `Ctrl+Alt+T` (Windows/Linux) / `Cmd+Alt+T` (macOS).
2. **Status Bar Button:** Clickable `$(terminal) Right Terminal` button in the bottom-right status bar.
3. **Editor Title Menu Button:** Clickable terminal icon (`$(terminal)`) in the top-right editor tab menu.

### Configuration Properties
Available in VS Code settings under `The Right Terminal`:
- `theRightTerminal.terminalName` (string, default: `"AI CLI Terminal"`): The visible terminal instance name.
- `theRightTerminal.defaultCommand` (string, default: `""`): Command sent to the terminal upon fresh creation.
- `theRightTerminal.clearOnOpen` (boolean, default: `false`): If true, runs `clear` before executing the default command.
- `theRightTerminal.preserveFocus` (boolean, default: `false`): If true, returns active focus to the editor group on the left.

## Developer Workflow

### Installation
```bash
npm install
```

### Build & Package Scripts
- **Type Checking:** `npm run check-types` (`tsc --noEmit`)
- **Development Compiles:** `npm run compile` (compiles once) / `npm run watch` (re-builds on file changes)
- **Production Bundle:** `npm run package` (compiles and minifies using `esbuild`)
- **VS Code Extension Package:** `npx @vscode/vsce package --no-git-tag-version` (builds the `.vsix` file)

### Debugging
Press `F5` in VS Code to launch the Extension Development Host window. Run the `Open Terminal on the Right` command from the command palette to test.
