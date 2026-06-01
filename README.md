# The Right Terminal 🚀

An elegant, zero-dependency VS Code extension that launches a dedicated, fully-featured terminal inside your Editor Area and automatically positions it on the **right side** of your editor grid.

Perfect for running interactive CLI-based AI coding companions (such as `aider`, `llm`, `gpt-cli`, or `copilot-cli`) side-by-side with your source code, while keeping your default bottom terminal panel completely free for builds, tests, and other tasks!

---

## The Side-by-Side Advantage 💡

Traditional bottom-docked terminals compress your vertical reading space, making it difficult to read long terminal outputs and code files at the same time. **The Right Terminal** splits your editor grid vertically, providing a spacious, full-height side-by-side layout:

```text
┌───────────────────────────────┬───────────────────────────────┐
│                               │                               │
│                               │                               │
│       Your Code Editor        │      The Right Terminal       │
│        (Left Column)          │        (Right Column)         │
│                               │                               │
│                               │                               │
└───────────────────────────────┴───────────────────────────────┘
```

This layout mimics the modern, popular workspace structure of high-end AI editors, but works natively with your existing VS Code theme, keybindings, and extensions!

---

## Core Features ✨

* 📂 **Real Editor Terminal:** Spawns a native, fully-featured terminal directly inside your editor area, allowing you to drag, drop, pin, or group it like any editor tab.
* ⚡ **3 Quick Launch Entrypoints:**
  1. **Keyboard Shortcut:** Toggle the terminal instantly using `Cmd+Alt+T` (macOS) or `Ctrl+Alt+T` (Windows/Linux).
  2. **Status Bar Shortcut:** Click the `$(terminal) Right Terminal` button in the bottom-right status bar.
  3. **Editor Tab Menu Button:** Click the terminal icon (`$(terminal)`) in the top-right menu of your active editor tab.
* ⚙️ **Auto-Run Commands:** Configure a default CLI tool (like `aider` or `llm`) to start automatically upon fresh terminal creation.
* 🎯 **Preserve Focus:** Toggle cursor focus retention so you can open or show the terminal while immediately typing in your active code file.
* 🧹 **Clear on Launch:** Optional setting to auto-clear the terminal screen before executing your default startup command.

---

## Configuration Recipes for AI CLIs 🤖

Configure **The Right Terminal** to automatically launch your favorite AI companion. Open your `settings.json` and add one of these recipes:

### 1. Aider AI Coding Assistant
Runs Aider automatically in the right column on launch:
```json
"theRightTerminal.defaultCommand": "aider",
"theRightTerminal.terminalName": "Aider Companion",
"theRightTerminal.preserveFocus": true
```

### 2. LLM CLI (by Simon Willison)
Ideal for quick, one-off AI queries:
```json
"theRightTerminal.defaultCommand": "llm chat",
"theRightTerminal.terminalName": "AI Chat",
"theRightTerminal.preserveFocus": false
```

### 3. GitHub Copilot CLI
Quick command-line explanations:
```json
"theRightTerminal.defaultCommand": "gh copilot suggest",
"theRightTerminal.terminalName": "Copilot CLI"
```

---

## Extension Settings ⚙️

Customize the extension inside VS Code's settings under **The Right Terminal**:

| Setting | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `theRightTerminal.terminalName` | `string` | `"Right Terminal"` | The visible name of the terminal tab inside the editor group. |
| `theRightTerminal.defaultCommand` | `string` | `""` | The command to auto-run on terminal creation (e.g., `aider`, `llm`, `gh copilot suggest`). |
| `theRightTerminal.clearOnOpen` | `boolean` | `false` | If enabled, runs a shell `clear` command before launching the default command. |
| `theRightTerminal.preserveFocus` | `boolean` | `false` | If enabled, cursor focus remains in your code editor after the terminal opens. |

---

## Installation 📦

### Via VS Code Marketplace (Recommended)
1. Open the **Extensions** view in VS Code (`Ctrl+Shift+X` / `Cmd+Shift+X`).
2. Search for **The Right Terminal** by `preepramdev`.
3. Click **Install**.
4. Alternatively, view the [VS Code Marketplace Page](https://marketplace.visualstudio.com/items?itemName=preepramdev.the-right-terminal).

### Manual VSIX Installation
1. Download the latest `.vsix` release file.
2. Open VS Code and launch the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`).
3. Select **Extensions: Install from VSIX...** and choose the downloaded file.

---

## Contributing & Local Development 🛠️

Want to customize, improve, or build the extension locally?

1. Clone the repository and install devDependencies:
   ```bash
   npm install
   ```
2. Compile and compile types:
   ```bash
   npm run compile
   ```
3. Open the repository folder in VS Code and press **`F5`** to launch the **Extension Development Host** debug window.
4. Open the Command Palette inside the debug window and select **Open Terminal on the Right** to test.
5. Package the extension into a shareable `.vsix` file locally:
   ```bash
   npx @vscode/vsce package --no-git-tag-version
   ```

---

## License 📄

This project is open-source and licensed under the [MIT License](LICENSE).
