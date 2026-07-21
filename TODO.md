# TODO

## Low Priority
- [ ] Preserve terminal content on toggle — embed xterm.js in editor to keep shell alive when toggling OFF.
  Requires replacing `vscode.window.createTerminal` with a `WebviewPanel` (xterm.js) backed by a real
  `node-pty` process kept alive independent of the webview, since `Terminal.hide()` only applies to
  bottom-panel terminals, not editor-area ones (confirmed against `@types/vscode`) — there is no way to
  hide-without-dispose an editor-area terminal today.

  **Spike done (throwaway, not committed):** `node-pty` spawns a real pty and captures shell output
  correctly on this machine; it uses N-API (`node-addon-api`), which is ABI-stable across Node/Electron
  versions, so it should avoid the historical node-pty-breaks-on-every-VS-Code-update problem. One real
  gotcha found: the prebuilt `spawn-helper` binary was installed *without its executable bit* by `npm
  install` here, causing pty spawn to fail silently with an opaque `posix_spawnp failed` until `chmod +x`
  was applied — any real implementation needs a packaging/CI step that verifies (or restores) this bit
  survives `npm ci`/`vsce package`. Also note: `node-pty`'s npm package bundles prebuilds for
  darwin-x64/arm64 and win32-x64/arm64, but not linux — a linux build would need `node-gyp rebuild` to
  succeed in CI (C/C++ toolchain), or per-platform `vsce package --target <platform>` builds.

  Note this ends the extension's zero-runtime-dependency status (`node-pty`, `xterm`,
  `@xterm/addon-fit` would become real `dependencies`) and loses native shell-integration
  decorations/link handling that a real VS Code terminal gets for free. Not started beyond the spike above.
