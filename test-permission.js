// Quick self-test: permission long-poll + decision, and hook script end-to-end.
const BASE = 'http://127.0.0.1:18777';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  // Test 1: DENY via API
  const p1 = fetch(BASE + '/api/permission', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ hookEventName: 'PermissionRequest', tool_name: 'Bash', tool_input: { command: 'rm -rf dist' } }) }).then((r) => r.text());
  await sleep(500);
  const s1 = await (await fetch(BASE + '/api/state')).json();
  console.log('T1 state:', s1.status, '| pending:', s1.pending?.tool_name, s1.pending?.id);
  const d1 = await (await fetch(BASE + '/api/decision', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: s1.pending.id, behavior: 'deny' }) })).json();
  console.log('T1 decide:', d1);
  console.log('T1 Claude receives:', await p1);

  // Test 2: ALLOW + always via hook script (spawned as a child, stdin JSON)
  const { spawn } = require('child_process');
  const hook = spawn('node', ['hooks/island-hook.js'], { stdio: ['pipe', 'pipe', 'pipe'] });
  let out = '';
  hook.stdout.on('data', (c) => (out += c));
  hook.stdin.end(JSON.stringify({ hookEventName: 'PermissionRequest', tool_name: 'Edit', tool_input: { file_path: 'C:\\x\\App.tsx' } }));
  await sleep(500);
  const s2 = await (await fetch(BASE + '/api/state')).json();
  console.log('T2 state:', s2.status, '| pending:', s2.pending?.tool_name);
  const d2 = await (await fetch(BASE + '/api/decision', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: s2.pending.id, behavior: 'allow', always: true }) })).json();
  console.log('T2 decide:', d2);
  await new Promise((r) => hook.on('exit', r));
  console.log('T2 hook stdout (Claude receives):', out);
  console.log('ALL TESTS DONE');
  process.exit(0);
})();
