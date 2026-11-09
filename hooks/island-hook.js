#!/usr/bin/env node
// Zenviq Island — hook bridge for Claude Code and Google Antigravity.
//   Claude Code:  node island-hook.js                      (event name arrives in the stdin JSON)
//   Antigravity:  node island-hook.js antigravity <Event>  (Antigravity does not name the event)
// Permission (Claude PermissionRequest, Antigravity run_command) → POSTs to the island and WAITS
// for your click. Island off, or no answer in time → no decision, and the agent shows its own
// normal prompt. NEVER auto-allows.
// Every other event → fire-and-forget POST (800 ms max), then exits.
// Requires Node 18+ (fetch is built in). No dependencies.
const BASE = process.env.ZENVIQ_ISLAND_URL || 'http://127.0.0.1:18777';
const CLAUDE_WAIT_MS = 270_000; // settings.json gives PermissionRequest a 300 s timeout
const AG_WAIT_MS = 120_000; // hooks.json gives Antigravity PreToolUse a 150 s timeout

async function readStdin() {
  let data = '';
  process.stdin.setEncoding('utf8');
  for await (const chunk of process.stdin) data += chunk;
  return data;
}

async function post(path, body, timeoutMs) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(BASE + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    return await res.text();
  } finally { clearTimeout(t); }
}

const print = (v) => process.stdout.write(typeof v === 'string' ? v : JSON.stringify(v));

// ---- Claude Code -------------------------------------------------------------------
async function claude(ev) {
  // Claude Code sends snake_case (hook_event_name); older demos used camelCase.
  const event = ev.hook_event_name || ev.hookEventName || '';
  if (event === 'PermissionRequest') {
    try {
      // The server replies with Claude's decision JSON, or '{}' when nobody answered.
      const out = await post('/api/permission', ev, CLAUDE_WAIT_MS);
      print(out && out.trim() ? out : '{}');
    } catch {
      print('{}'); // island not running → Claude shows its own prompt
    }
    return;
  }
  try { await post('/api/event', ev, 800); } catch { /* island may be off — fine */ }
}

// ---- Antigravity ---------------------------------------------------------------------
// Antigravity tool names → the names the island already understands.
const AG_TOOLS = {
  run_command: 'Terminal', view_file: 'Read', write_to_file: 'Write',
  replace_file_content: 'Edit', multi_replace_file_content: 'Edit',
  grep_search: 'Search', find_by_name: 'Search', list_dir: 'Search',
  read_url_content: 'WebFetch', search_web: 'WebSearch',
};
function agInput(a = {}) {
  return {
    command: a.CommandLine,
    file_path: a.AbsolutePath || a.TargetFile || a.FilePath,
    path: a.SearchPath || a.DirectoryPath || a.SearchDirectory,
    url: a.Url,
    pattern: a.Query || a.Pattern,
  };
}

async function antigravity(event, ev) {
  const call = ev.toolCall || {};
  const args = call.args || {};
  const base = {
    source: 'antigravity',
    session_id: ev.conversationId || null,
    cwd: args.Cwd || (ev.workspacePaths || [])[0] || null,
    tool_name: call.name ? AG_TOOLS[call.name] || call.name : undefined,
    tool_input: agInput(args),
  };

  if (event === 'PreToolUse' && call.name === 'run_command') {
    try {
      const res = await post('/api/permission', { ...base, hookEventName: 'PermissionRequest', wait_ms: AG_WAIT_MS }, AG_WAIT_MS + 5000);
      const d = JSON.parse(res || '{}');
      const behavior = d.hookSpecificOutput && d.hookSpecificOutput.decision && d.hookSpecificOutput.decision.behavior;
      // auto_approve still honours your own explicit Antigravity rules.
      if (behavior === 'allow') return print({ decision: 'auto_approve', reason: 'Allowed from Zenviq Island' });
      if (behavior === 'deny') return print({ decision: 'deny', reason: 'Denied from Zenviq Island by the user.' });
    } catch { /* island off or timed out */ }
    return print({ decision: 'allow' }); // no answer: defer to Antigravity's own policy and prompt
  }

  const type = event === 'PostToolUse' && ev.error ? 'PostToolUseFailure' : event;
  if (['SessionStart', 'PreToolUse', 'PostToolUse', 'PostToolUseFailure', 'Stop'].includes(type)) {
    try { await post('/api/event', { ...base, hookEventName: type }, 800); } catch { /* island off */ }
  }
  print(event === 'PreToolUse' ? { decision: 'allow' } : {});
}

(async () => {
  let ev = {};
  try { ev = JSON.parse((await readStdin()) || '{}'); } catch { /* ignore */ }
  if (process.argv[2] === 'antigravity') await antigravity(process.argv[3] || '', ev);
  else await claude(ev);
  process.exit(0);
})();
