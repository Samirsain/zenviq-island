// Zenviq Island — Dynamic Island for Claude Code (Windows / Mac / Linux)
// No dependencies. Node 18+ only. Listens on localhost only (127.0.0.1:18777).
// Security: this server NEVER auto-allows anything. If the user does not click,
// the PermissionRequest hook returns {} and Claude falls back to its normal
// terminal prompt. A hook "allow" also never overrides a deny rule in settings.
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.ISLAND_PORT || 18777;
const PERMISSION_WAIT_MS = 270_000; // hook timeout in settings.json is 300s

let seq = 0;
const state = {
  status: 'idle', // idle | working | needs-permission | done | error
  sessionId: null,
  project: null,
  cwd: null,
  tool: null,
  detail: null, // file path / command, truncated for display
  startedAt: null,
  lastEventAt: Date.now(),
  pending: null, // { id, tool_name, tool_input, suggestions, receivedAt }
  history: [], // last 20 events, newest first
  decisions: 0,
};

const sseClients = new Set();
// pending permission: id -> { res, timer }
const pendingWaits = new Map();
let settleTimer = null; // returns the island from Done to Ready

function broadcast() {
  const payload = 'data: ' + JSON.stringify(publicState()) + '\n\n';
  for (const res of [...sseClients]) {
    try { res.write(payload); } catch { sseClients.delete(res); }
  }
}
function publicState() {
  return { ...state, pending: state.pending, now: Date.now() };
}
function logEvent(type, data) {
  state.history.unshift({ type, at: new Date().toISOString(), ...data });
  state.history = state.history.slice(0, 20);
  state.lastEventAt = Date.now();
}
function summariseTool(toolName, toolInput = {}) {
  if (!toolInput || typeof toolInput !== 'object') return '';
  if (toolInput.command) return String(toolInput.command).slice(0, 120);
  if (toolInput.file_path) return String(toolInput.file_path).slice(-90);
  if (toolInput.path) return String(toolInput.path).slice(-90);
  if (toolInput.pattern) return `search: ${String(toolInput.pattern).slice(0, 80)}`;
  if (toolInput.url) return String(toolInput.url).slice(0, 100);
  if (toolInput.prompt) return String(toolInput.prompt).slice(0, 100);
  const keys = Object.keys(toolInput);
  return keys.length ? keys.slice(0, 3).join(', ') : '';
}

function handleEvent(ev) {
  // Claude Code sends hook_event_name; demos and the Antigravity bridge send hookEventName.
  const type = ev.hook_event_name || ev.hookEventName || ev.type || 'unknown';
  const tool = ev.tool_name || ev.tool || null;
  state.source = ev.source || 'claude';
  switch (type) {
    case 'SessionStart':
      state.status = 'working';
      state.sessionId = ev.session_id || null;
      state.cwd = ev.cwd || null;
      state.project = ev.cwd ? path.basename(ev.cwd) : null;
      state.startedAt = Date.now();
      state.tool = null; state.detail = 'Session started';
      logEvent(type, { project: state.project });
      break;
    case 'UserPromptSubmit':
      state.status = 'working';
      state.tool = null;
      state.detail = (ev.prompt || 'New prompt').toString().slice(0, 100);
      logEvent(type, {});
      break;
    case 'PreToolUse':
      if (state.status !== 'needs-permission') state.status = 'working';
      state.tool = tool;
      state.detail = summariseTool(tool, ev.tool_input);
      logEvent(type, { tool, detail: state.detail });
      break;
    case 'PostToolUse':
    case 'PostToolUseFailure':
      state.tool = tool;
      state.detail = (type === 'PostToolUseFailure' ? 'Failed: ' : 'Done: ') + summariseTool(tool, ev.tool_input);
      if (type === 'PostToolUseFailure') state.status = 'error';
      logEvent(type, { tool, detail: state.detail });
      break;
    case 'Notification':
      // permission_prompt only fires ~6s after the prompt waited — PermissionRequest is the instant signal.
      state.detail = ev.message || ev.notification_type || 'Notification';
      logEvent(type, { notification_type: ev.notification_type || ev.message });
      break;
    case 'Stop':
    case 'SubagentStop':
      if (!state.pending) {
        state.status = 'done';
        state.tool = null;
        state.detail = type === 'Stop' ? 'Task complete' : 'Subagent finished';
        // Done is a moment, not a mode: back to Ready after 6 s unless something else happened.
        clearTimeout(settleTimer);
        settleTimer = setTimeout(() => {
          if (state.status !== 'done' || state.pending) return;
          state.status = 'idle'; state.tool = null; state.detail = null;
          broadcast();
        }, 6000);
      }
      logEvent(type, {});
      break;
    case 'SessionEnd':
      state.status = 'idle';
      state.tool = null; state.detail = 'Session ended';
      state.sessionId = null;
      logEvent(type, {});
      break;
    default:
      logEvent(type, { tool });
  }
  if (ev.session_id === 'demo') state.history[0].demo = true; // demo rows are labelled in the UI
  // A waiting request outranks activity: another agent's (or session's) events must not hide it.
  if (state.pending) state.status = 'needs-permission';
  broadcast();
}

function handlePermissionRequest(ev, req, res) {
  const id = 'perm-' + (++seq) + '-' + Date.now().toString(36);
  const pending = {
    id,
    tool_name: ev.tool_name || 'unknown',
    tool_input: ev.tool_input || {},
    detail: summariseTool(ev.tool_name, ev.tool_input),
    suggestions: ev.permission_suggestions || [],
    cwd: ev.cwd || null,
    session_id: ev.session_id || null,
    source: ev.source || 'claude',
    // Each bridge says how long its agent waits; never longer than the Claude hook budget.
    waitMs: Math.min(PERMISSION_WAIT_MS, Math.max(10_000, Number(ev.wait_ms) || PERMISSION_WAIT_MS)),
    receivedAt: Date.now(),
  };
  state.source = pending.source;
  // If an old permission is still waiting, deny it safely (return no-decision
  // so Claude falls back to its terminal prompt) instead of stacking prompts.
  if (state.pending) {
    const old = pendingWaits.get(state.pending.id);
    if (old) { clearTimeout(old.timer); try { old.res.end('{}'); } catch {} pendingWaits.delete(state.pending.id); }
  }
  state.pending = pending;
  state.status = 'needs-permission';
  state.tool = pending.tool_name;
  state.detail = pending.detail;
  logEvent('PermissionRequest', { tool: pending.tool_name, detail: pending.detail, id, demo: pending.session_id === 'demo' || undefined });
  broadcast();

  const timer = setTimeout(() => {
    // Timeout: NEVER auto-allow. Return {} = no decision, Claude shows its own prompt.
    pendingWaits.delete(id);
    if (state.pending && state.pending.id === id) {
      state.pending = null;
      state.status = 'working';
      broadcast();
    }
    try { res.end('{}'); } catch {}
  }, pending.waitMs);
  // NOTE: do NOT listen for req 'close' here — Node fires it as soon as the
  // request body is fully read, which would delete the pending wait before
  // the user can click. The timeout above is the only expiry.
  pendingWaits.set(id, { res, timer });
}

function decide(id, behavior, always) {
  const wait = pendingWaits.get(id);
  if (!wait) return { ok: false, error: 'No pending request with that id (expired or already decided).' };
  clearTimeout(wait.timer);
  pendingWaits.delete(id);
  state.decisions += 1;
  const wasPending = state.pending;
  state.pending = null;
  state.status = behavior === 'allow' ? 'working' : 'working';
  state.detail = behavior === 'allow' ? `Allowed: ${wasPending.tool_name}` : `Denied: ${wasPending.tool_name}`;
  logEvent('Decision', { tool: wasPending.tool_name, behavior, always: !!always, demo: wasPending.session_id === 'demo' || undefined });
  broadcast();
  // Claude Code PermissionRequest decision format (docs: code.claude.com/docs/en/hooks)
  // hookSpecificOutput.decision.behavior = "allow" | "deny"
  // "allow" does NOT override a matching deny rule. updatedPermissions is only
  // sent when the user clicked "Always allow" — and only for this session unless
  // the suggestion itself says otherwise.
  const out = { hookSpecificOutput: { hookEventName: 'PermissionRequest', decision: { behavior } } };
  if (behavior === 'allow' && always) {
    out.hookSpecificOutput.decision.updatedPermissions = [{
      type: 'addRules',
      behavior: 'allow',
      destination: 'session',
      rules: [{ toolName: wasPending.tool_name }],
    }];
    out.hookSpecificOutput.decision.message = undefined;
  }
  if (behavior === 'deny') {
    out.hookSpecificOutput.decision.message = 'Denied from Zenviq Island by the user.';
  }
  try { wait.res.end(JSON.stringify(out)); } catch {}
  return { ok: true, behavior };
}

const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.mp4': 'video/mp4' };
const PUBLIC_DIR = path.join(__dirname, 'public');

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  // Only localhost may use this server — it can approve Claude tool calls.
  const host = (req.headers.host || '').split(':')[0];
  if (host !== '127.0.0.1' && host !== 'localhost' && host !== '[::1]') {
    res.writeHead(403); return res.end('localhost only');
  }
  // No CORS: other websites in your browser must never read the pending request or answer it.
  // Hooks and scripts send no Origin; the island page sends its own.
  const origin = req.headers.origin;
  if (origin && origin !== `http://127.0.0.1:${PORT}` && origin !== `http://localhost:${PORT}`) {
    console.warn(`[security] blocked ${req.method} ${url.pathname} from origin ${origin}`);
    res.writeHead(403); return res.end('origin not allowed');
  }

  if (req.method === 'GET' && url.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(fs.readFileSync(path.join(__dirname, 'public', 'index.html')));
  }
  if (req.method === 'GET' && url.pathname === '/api/state') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(publicState()));
  }
  if (req.method === 'GET' && url.pathname === '/api/events') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
    res.write('data: ' + JSON.stringify(publicState()) + '\n\n');
    sseClients.add(res);
    req.on('close', () => sseClients.delete(res));
    return;
  }
  if (req.method === 'POST' && (url.pathname === '/api/event' || url.pathname === '/api/permission')) {
    let body = '';
    req.on('data', (c) => { body += c; if (body.length > 1_000_000) req.destroy(); });
    req.on('end', () => {
      let ev = {};
      try { ev = body ? JSON.parse(body) : {}; } catch { res.writeHead(400); return res.end('bad json'); }
      if (url.pathname === '/api/permission') {
        // Long-poll: do NOT end the response here — decide() or the timeout ends it.
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return handlePermissionRequest(ev, req, res);
      }
      handleEvent(ev);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
    });
    return;
  }
  if (req.method === 'POST' && url.pathname === '/api/decision') {
    let body = '';
    req.on('data', (c) => { body += c; });
    req.on('end', () => {
      let d = {};
      try { d = body ? JSON.parse(body) : {}; } catch {}
      const result = decide(d.id, d.behavior === 'allow' ? 'allow' : 'deny', !!d.always);
      res.writeHead(result.ok ? 200 : 404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    });
    return;
  }
  if (req.method === 'POST' && url.pathname === '/api/demo') {
    let body = '';
    req.on('data', (c) => { body += c; });
    req.on('end', () => {
      let d = {};
      try { d = body ? JSON.parse(body) : {}; } catch {}
      runDemo(d.scenario || 'permission');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
    });
    return;
  }
  if (req.method === 'GET' && url.pathname.startsWith('/public/')) {
    const file = path.join(PUBLIC_DIR, decodeURIComponent(url.pathname.slice('/public/'.length)));
    if (!file.startsWith(PUBLIC_DIR + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); return res.end('not found'); }
    const buf = fs.readFileSync(file);
    const type = MIME[path.extname(file)] || 'application/octet-stream';
    // Range support so <video loop> can seek back to the start.
    const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
    if (range && buf.length) {
      const start = range[1] ? Number(range[1]) : 0;
      const end = range[2] ? Math.min(Number(range[2]), buf.length - 1) : buf.length - 1;
      if (start > end) { res.writeHead(416, { 'Content-Range': `bytes */${buf.length}` }); return res.end(); }
      res.writeHead(206, { 'Content-Type': type, 'Accept-Ranges': 'bytes', 'Content-Range': `bytes ${start}-${end}/${buf.length}`, 'Content-Length': end - start + 1 });
      return res.end(buf.subarray(start, end + 1));
    }
    res.writeHead(200, { 'Content-Type': type, 'Accept-Ranges': 'bytes', 'Content-Length': buf.length });
    return res.end(buf);
  }
  res.writeHead(404); res.end('not found');
});

function runDemo(scenario) {
  // Obviously fake data, tagged session_id 'demo' so the UI labels it.
  const cwd = 'C:\\Users\\you\\demo-app', file = cwd + '\\src\\App.tsx', session_id = 'demo';
  if (scenario === 'working') {
    handleEvent({ hookEventName: 'SessionStart', cwd, session_id });
    setTimeout(() => handleEvent({ hookEventName: 'PreToolUse', tool_name: 'Read', tool_input: { file_path: file }, cwd, session_id }), 600);
    setTimeout(() => handleEvent({ hookEventName: 'PostToolUse', tool_name: 'Read', tool_input: { file_path: file }, cwd, session_id }), 2200);
    setTimeout(() => handleEvent({ hookEventName: 'PreToolUse', tool_name: 'Edit', tool_input: { file_path: file }, cwd, session_id }), 3000);
    setTimeout(() => handleEvent({ hookEventName: 'Stop', cwd, session_id }), 6500);
  } else {
    // permission: working -> permission request that waits for a real click in the UI.
    handleEvent({ hookEventName: 'SessionStart', cwd, session_id });
    setTimeout(() => handleEvent({ hookEventName: 'PreToolUse', tool_name: 'Bash', tool_input: { command: 'npm run build' }, cwd, session_id }), 800);
    setTimeout(() => {
      // Fake a hook waiting on /api/permission by creating a pending entry directly.
      const fakeReq = { on: () => {} };
      const fakeRes = { end: (s) => console.log('[demo] permission resolved:', s) };
      handlePermissionRequest({ hookEventName: 'PermissionRequest', tool_name: 'Bash', tool_input: { command: 'npm run build' }, cwd, session_id }, fakeReq, fakeRes);
    }, 1800);
  }
}

// A second copy (e.g. `node server.js` while the Electron island runs) just reuses the first.
server.on('error', (e) => {
  if (e.code !== 'EADDRINUSE') throw e;
  console.log(`Zenviq Island is already running on http://127.0.0.1:${PORT}`);
  if (require.main === module) process.exit(0);
});
server.listen(PORT, '127.0.0.1', () => {
  console.log(`Zenviq Island running → http://127.0.0.1:${PORT}`);
  console.log('Open that URL in a browser for the demo, or run the Electron app for the real always-on-top island.');
});
