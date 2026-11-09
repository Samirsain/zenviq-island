// Demo without Claude Code: simulates a session + a permission request.
// Usage: node server.js  (in one terminal)  →  node demo.js  (in another)
// Then open http://127.0.0.1:18777 and click Allow / Deny.
const BASE = 'http://127.0.0.1:18777';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function post(path, body) {
  const res = await fetch(BASE + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return res.text();
}
(async () => {
  console.log('Demo: session start → Bash → permission request (waiting for your click)…');
  await post('/api/event', { hookEventName: 'SessionStart', cwd: 'C:\\Users\\you\\demo-app', session_id: 'demo' });
  await sleep(800);
  await post('/api/event', { hookEventName: 'PreToolUse', tool_name: 'Bash', tool_input: { command: 'npm run build' }, cwd: 'C:\\Users\\you\\demo-app', session_id: 'demo' });
  console.log('Now sending PermissionRequest — open http://127.0.0.1:18777 and click Allow or Deny.');
  const out = await post('/api/permission', { hookEventName: 'PermissionRequest', tool_name: 'Bash', tool_input: { command: 'npm run build' }, cwd: 'C:\\Users\\you\\demo-app', session_id: 'demo' });
  console.log('Claude would receive:', out);
  await post('/api/event', { hookEventName: 'Stop', cwd: 'C:\\Users\\you\\demo-app', session_id: 'demo' });
  console.log('Demo done.');
})();
