#!/usr/bin/env node
// Zenviq Island — connects Claude Code and Google Antigravity to the island for every project
// on this computer, or disconnects them again.
//   npm run setup     (node setup.js)            install / repair the hooks
//   npm run unsetup   (node setup.js --remove)   remove them
// Files: ~/.claude/settings.json (Claude Code) and ~/.gemini/config/hooks.json (Antigravity).
// Everything else in those files is kept. Before the first change each file is copied to
// <file>.zenviq-backup. Re-running is safe: old island entries are replaced, never doubled.
const fs = require('fs');
const os = require('os');
const path = require('path');

const REMOVE = process.argv.includes('--remove');
const HOOK = path.join(__dirname, 'hooks', 'island-hook.js').replace(/\\/g, '/'); // works in bash, cmd and PowerShell
const cmd = (...args) => ['node', `"${HOOK}"`, ...args].join(' ');
const isIsland = (h) => typeof h.command === 'string' && h.command.includes('island-hook.js');

function update(file, change) {
  let data = {};
  if (fs.existsSync(file)) {
    const text = fs.readFileSync(file, 'utf8');
    data = text.trim() ? JSON.parse(text) : {}; // a malformed file throws here and is left untouched
    if (!fs.existsSync(file + '.zenviq-backup')) fs.copyFileSync(file, file + '.zenviq-backup');
  } else if (REMOVE) {
    return;
  } else {
    fs.mkdirSync(path.dirname(file), { recursive: true });
  }
  change(data);
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
  console.log(`${REMOVE ? 'Removed island hooks from' : 'Installed island hooks in'} ${file}`);
}

// ---- Claude Code: ~/.claude/settings.json (user scope = every project) ----------------
const CLAUDE = {
  PermissionRequest: { matcher: '*', timeout: 300 }, // the hook waits up to 270 s for your click
  PreToolUse: { matcher: '*', timeout: 10 },
  PostToolUse: { matcher: '*', timeout: 10 },
  PostToolUseFailure: { matcher: '*', timeout: 10 },
  Notification: { matcher: 'permission_prompt|idle_prompt|agent_completed', timeout: 10 },
  Stop: { timeout: 10 },
  SessionStart: { timeout: 10 },
  SessionEnd: { timeout: 10 },
  UserPromptSubmit: { timeout: 10 },
};
update(path.join(os.homedir(), '.claude', 'settings.json'), (s) => {
  const hooks = s.hooks || {};
  for (const ev of Object.keys(hooks)) { // drop earlier island entries, keep everyone else's
    hooks[ev] = (hooks[ev] || [])
      .map((m) => ({ ...m, hooks: (m.hooks || []).filter((h) => !isIsland(h)) }))
      .filter((m) => m.hooks.length);
    if (!hooks[ev].length) delete hooks[ev];
  }
  if (!REMOVE) {
    for (const [ev, { matcher, timeout }] of Object.entries(CLAUDE)) {
      (hooks[ev] = hooks[ev] || []).push({ ...(matcher ? { matcher } : {}), hooks: [{ type: 'command', command: cmd(), timeout }] });
    }
  }
  if (Object.keys(hooks).length) s.hooks = hooks; else delete s.hooks;
});

// ---- Google Antigravity: ~/.gemini/config/hooks.json (global = every workspace) ---------
update(path.join(os.homedir(), '.gemini', 'config', 'hooks.json'), (h) => {
  delete h['zenviq-island'];
  if (REMOVE) return;
  h['zenviq-island'] = {
    SessionStart: [{ type: 'command', command: cmd('antigravity', 'SessionStart'), timeout: 10 }],
    // run_command waits up to 120 s for your click; every other tool passes straight through.
    PreToolUse: [{ matcher: '*', hooks: [{ type: 'command', command: cmd('antigravity', 'PreToolUse'), timeout: 150 }] }],
    PostToolUse: [{ matcher: '*', hooks: [{ type: 'command', command: cmd('antigravity', 'PostToolUse'), timeout: 10 }] }],
    Stop: [{ type: 'command', command: cmd('antigravity', 'Stop'), timeout: 10 }],
  };
});

console.log(REMOVE
  ? 'Done. Claude Code and Antigravity no longer talk to the island.'
  : 'Done. Start a new Claude Code session (or open /hooks once) and reopen Antigravity for the hooks to load.');
