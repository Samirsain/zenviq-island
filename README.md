# Zenviq Island

A Dynamic Island for AI coding agents. Zenviq Island sits at the top of your screen and shows what **Claude Code** and **Google Antigravity** are doing, lets you approve or deny their permission requests in place, and tells you when work is done.

## Features

- **Live activity:** the current tool, file, or command, the project, and a session timer.
- **Permission requests in place:** Allow, Deny, or Always allow (Claude Code, current session) without switching to the terminal. A countdown ring shows how long the agent will wait.
- **Done and failure states:** a chime, a system notification, and a short celebration, after which the island returns to Ready.
- **Every project:** hooks are installed once at user level, so the island works in any project and any terminal.
- **Unobtrusive:** drag it anywhere, choose Mini, Normal, or Large, and click through it everywhere except the island itself.
- **Apple-style motion:** spring-based morphs, blur transitions, and a welcome greeting with the date and time at startup.
- **Local only:** the server listens on `127.0.0.1` and never auto-approves anything.

## Requirements

- Node.js 18 or later
- Claude Code and/or Google Antigravity (a version with hooks support)
- Windows 10/11 (tested). macOS and Linux are supported by Electron but are less tested.

## Installation

```bash
git clone https://github.com/Samirsain/zenviq-island.git
cd zenviq-island
npm install
npm run setup
npm run island -- --autostart
```

| Step | What it does |
|---|---|
| `npm install` | Installs Electron. |
| `npm run setup` | Adds the island hooks to `~/.claude/settings.json` (Claude Code) and `~/.gemini/config/hooks.json` (Antigravity). Existing settings are preserved, and a `.zenviq-backup` copy of each file is made before the first change. |
| `npm run island -- --autostart` | Starts the island and registers it to start at login. Omit `--autostart` to run it once. |

After setup, start a new Claude Code session (or open `/hooks` once) and restart Antigravity so the hooks load.

## Usage

### Island states

| State | What you see |
|---|---|
| Ready | Compact pill with the avatar. |
| Working | Verb and target (for example *Editing …/src/App.tsx*), spinner, session timer. |
| Permission | The island expands: the requested command, Deny and Allow buttons, and the time remaining. |
| Allowed / Denied | A green check or red cross for a moment, then back to Working. |
| Done | A chime, a short expansion with the celebration animation, then back to Ready after 6 seconds. |
| Failed / Offline | A red indicator and the reason. |

Click the island to expand or collapse its detail view (recent activity and the sound toggle).

### Permissions

- **Claude Code:** every permission request appears on the island. If you do not answer within 4 minutes 30 seconds, Claude Code shows its normal terminal prompt.
- **Antigravity:** terminal commands (`run_command`) appear on the island. If you do not answer within 2 minutes, Antigravity applies its own policy and prompt. Other tools pass straight through and only show as activity.
- An approval from the island never overrides an explicit deny rule in either tool.

### Keyboard

| Key | Action |
|---|---|
| Return | Allow |
| Esc | Deny |
| A | Always allow for this session (Claude Code only) |
| Space | Expand or collapse |

Shortcuts only answer a request after you click or Tab into the island, so typing in another application can never approve anything.

### Position and size

- **Move:** drag the island anywhere. Drop it near the top centre to snap it back. The position is remembered.
- **Size:** right-click the island, or use the tray icon, and choose **Mini**, **Normal**, or **Large**. Mini shows only the avatar and status, and does not expand on Done. Permission requests always expand.
- **Tray menu:** size, move back to top centre, open the control page, start at login, quit.

### Control page and demo

Open `http://127.0.0.1:18777` in a browser to see the island, recent activity, and demo controls. `npm run demo` simulates a session and a permission request without Claude Code.

## Avatar

The avatar art is not included in this repository. Without it, the island shows a plain dark tile and the tray uses a simple pill icon. To add your own, place these files in `public/avatar/` (square, on a dark background):

| File | Used for |
|---|---|
| `hatch_dark_still.webp` | Still image and fallback |
| `hatch_dark.mp4` | Ready and permission (loop) |
| `hatch_working_dark.mp4` | Working (loop) |
| `hatch_making_something_dark.mp4` | Editing files (loop) |
| `hatch_milestone_dark.mp4` | Done (plays once) |
| `tray.png` | Tray icon, 32×32 |

The name in the startup greeting is set by `USER_NAME` in `public/index.html`.

## Security

- The server binds to `127.0.0.1:18777` and rejects requests whose `Host` is not local.
- Cross-origin requests are refused, so other websites open in your browser cannot read or answer a pending request.
- The island never approves anything on its own. When it is closed, or a request times out, each agent falls back to its normal prompt.
- "Always allow" adds a rule for the current Claude Code session only.

## Uninstall

```bash
npm run unsetup
```

This removes the island hooks from both configuration files and leaves everything else untouched. To stop the island from starting at login, untick **Start at login** in the tray menu.

## Project structure

```
server.js               Local server: state, permission long-polling, live updates (SSE)
public/index.html       Island and control page (UI, motion, keyboard)
hooks/island-hook.js    Hook bridge for Claude Code and Antigravity
setup.js                Installs and removes the hooks
electron/main.js        Always-on-top window, drag, sizes, tray, start at login
electron/preload.js     Minimal bridge between the page and the window
demo.js                 Simulated session for testing
test-permission.js      End-to-end permission test (npm test)
```

## Scripts

| Command | Description |
|---|---|
| `npm run island` | Start the island |
| `npm run setup` | Install hooks for Claude Code and Antigravity |
| `npm run unsetup` | Remove the hooks |
| `npm start` | Run only the server (use the island in a browser) |
| `npm run demo` | Simulate a session with a permission request |
| `npm test` | Run the permission flow test (server must be running) |

## License

[MIT](LICENSE)
