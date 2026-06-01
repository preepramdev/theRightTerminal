# The Right Terminal 🚀

An elegant VS Code extension that launches a dedicated, fully-featured terminal inside your Editor Area and automatically positions it on the **right side** of your editor grid.

Perfect for running interactive CLI-based AI tools (like `aider`, `gpt-cli`, or `llm`) side-by-side with your code, while keeping your default bottom terminal panel completely free for other tasks!

---

## Features ✨

* **Separated Editor Terminal:** Runs your CLI inside a real editor tab, allowing you to position it anywhere in your editor grid.
* **Instant Triggers:** Launch or focus the right terminal with three quick entrypoints:
  1. **Keyboard Shortcut:** Press `Cmd+Alt+T` (macOS) or `Ctrl+Alt+T` (Windows/Linux) to toggle.
  2. **Status Bar Button:** Click the `$(terminal) Right Terminal` button in the bottom right status bar.
  3. **Editor Title Icon:** Click the terminal button (`$(terminal)`) in the top-right of your active editor tab menu.
* **Auto-Command Execution:** Set a default command (e.g. `aider` or `llm`) to run automatically when the terminal is created.
* **Focus Preservation:** Keep your cursor focus in your active code file automatically after opening the terminal.

---

## Extension Settings ⚙️

Customize the extension inside VS Code's settings under **The Right Terminal**:

| Setting | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `theRightTerminal.terminalName` | `string` | `"AI CLI Terminal"` | The visible name of the terminal tab. |
| `theRightTerminal.defaultCommand` | `string` | `""` | The command to auto-run on terminal creation (e.g., `aider`, `gpt-cli`). |
| `theRightTerminal.clearOnOpen` | `boolean` | `false` | Whether to clear the terminal before running the default command. |
| `theRightTerminal.preserveFocus` | `boolean` | `false` | Whether to keep the editor focused after launching the terminal. |

---

## Installation 📦

### Direct VSIX Installation (Pre-packaged)
1. Download the `the-right-terminal-0.1.0.vsix` file.
2. Open VS Code, open the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`).
3. Select **Extensions: Install from VSIX...** and choose the downloaded file.

---

## Contributing & Local Development 🛠️

Want to customize or build the extension yourself?

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Press **`F5`** to launch the extension in a debug window (**Extension Development Host**).
3. Open the command palette and run **Open Terminal on the Right** to test.
4. To package into a installable `.vsix` archive:
   ```bash
   npx @vscode/vsce package --no-git-tag-version
   ```

---

## License 📄

This project is open-source and available under the [MIT License](LICENSE).
