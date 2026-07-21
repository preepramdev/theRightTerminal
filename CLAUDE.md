# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"The Right Terminal" is a zero-runtime-dependency VS Code extension (TypeScript) that spawns a terminal inside the Editor Area (instead of the bottom panel) and positions it beside the active editor group, so AI CLI tools (aider, llm, copilot-cli, etc.) can run side-by-side with code.

The core implementation lives in a single file: [src/extension.ts](src/extension.ts), with tests under [src/test/](src/test/). Only devDependencies exist (esbuild, typescript, eslint, @vscode/test-cli) — no runtime dependencies.

## Build & Development Commands

- `npm install` — install devDependencies.
- `npm run check-types` — typecheck only, no output (`tsc --noEmit`).
- `npm run lint` — ESLint over `src` (flat config in `eslint.config.mjs`).
- `npm run compile` — typecheck then bundle once via esbuild to `dist/extension.js`.
- `npm run watch` — esbuild in watch mode (no typecheck loop); this is what `F5` runs as a pre-launch task.
- `npm run package` — typecheck + minified production bundle (`vscode:prepublish` runs this before packaging/publishing).
- `npm test` — compiles `src/**/*.ts` to `out/` via `tsconfig.test.json` (the `pretest` step), then runs `vscode-test` (`@vscode/test-cli`), which launches a real VS Code instance and runs the suite in [src/test/extension.test.ts](src/test/extension.test.ts). To run a single test, use mocha's `--grep` via `vscode-test`'s underlying runner, or temporarily narrow the `files` glob in `.vscode-test.mjs`.
- `npx @vscode/vsce package --no-git-tag-version` — build the distributable `.vsix`.
- `npm run publish` — `npx @vscode/vsce publish` (publishes to the VS Code Marketplace — do not run without explicit user request).
- `npm run publish:ovsx` — `npx ovsx publish -p $OVSX_PAT` (publishes to the Open VSX Registry, which VS Code forks like Cursor pull from instead of the Marketplace — needs `OVSX_PAT` set; do not run without explicit user request).

To manually verify a change end-to-end, press `F5` in VS Code to launch the Extension Development Host, then run **Open Terminal on the Right** from the Command Palette (or the status bar / editor-title button).

## Architecture

Everything is in `activate()`/`deactivate()` in [src/extension.ts](src/extension.ts):

- **Single-terminal-instance model**: the extension identifies "its" terminal purely by matching `terminal.name` against the configured `terminalName` setting (see `disposeTerminal`). There is no other handle/state tracked across calls — whichever `vscode.window.terminals` entry has that name *is* the right terminal.
- **Toggle semantics**: the `theRightTerminal.open` command is a toggle. If a terminal with the configured name already exists, it's disposed (closed) and empty editor groups are cleaned up. Otherwise a new terminal is created via `vscode.window.createTerminal` with `location: { viewColumn: ViewColumn.Beside }`, which is what places it in the editor grid beside the current group rather than the bottom panel. Terminals are created with `isTransient: true` so VS Code doesn't try to restore them across sessions.
- **Empty group cleanup**: `closeEmptyGroups()` loops closing any empty tab groups left behind after a terminal closes, then runs `workbench.action.evenEditorWidths` to rebalance the remaining layout. This runs both on `activate()` (cleans up stale groups from a previous session) and after disposing the terminal on toggle-off.
- **Config is re-read per invocation**: `getConfig()` pulls `theRightTerminal.{terminalName,defaultCommand,clearOnOpen,preserveFocus}` fresh on every command invocation (and once at `activate()` for the status bar label), so settings changes take effect without reload.
- **Auto-run command**: on fresh terminal creation, if `defaultCommand` is set, the extension waits 150ms (letting the shell initialize) before optionally sending `clear` and then sending `defaultCommand` via `terminal.sendText`.
- **Focus preservation**: if `preserveFocus` is on, after creating the terminal the extension re-shows the previously active text editor/view column so keyboard focus stays in the code editor rather than jumping to the terminal.
- Three entrypoints all invoke the same `theRightTerminal.open` command: the `Ctrl+Alt+T` / `Cmd+Ctrl+T` keybinding, the status bar item created in `activate()`, and the editor-title menu icon contributed in `package.json`.

## Repo Notes

- `agent.md` is now a short pointer to this file (kept for AI-agent-discovery conventions that look for `agent.md`/`AGENTS.md`); this file is the canonical detailed doc — update this one, not agent.md.
- `dist/extension.js` and `out/` (compiled test output) are build artifacts; don't hand-edit them.
- `graphify-out/` is generated knowledge-graph output, not source.
- Root-level `.vsix` files are packaged release artifacts, one per published version — not build inputs.
- `CHANGELOG.md` is packaged into the `.vsix` and shown on the Marketplace's Changelog tab — keep it updated per release.
