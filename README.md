# Zenviq Island — Dynamic Island for Claude Code

TwoCode jaisa island, tumhare liye — screen ke top par ek chhota pill jo batata hai Claude Code kya kar raha hai, permission maangte hi expand hota hai, aur kaam ho jaye to sound + green ho jata hai.

## Kya karta hai

| Tumhari need | Kaise |
|---|---|
| Claude ko need ho to dikh jaye | `PermissionRequest` hook aate hi island expand + orange pulse + sound |
| Permission control kar saku | Island par **Allow / Deny / Allow always (this session)** buttons — Claude ko turant jawab jata hai |
| Activity dikhe | `PreToolUse` / `PostToolUse` — kaunsi file, kaunsa command, kaunsa project, live |
| Notification / sound | Kaam complete (`Stop`) par green + sound; permission par alag sound + browser notification |
| Terminal dekhe bina kaam karu | Island hamesha top par rehta hai (Electron mode) |

## Safety — important

- **Kabhi auto-allow nahi.** Agar tum 270 sec me click nahi karte, ya island band hai, to hook `{}` bhejta hai aur Claude apna normal terminal prompt dikhata hai.
- Hook ka `allow` tumhare `deny` rules ko override **nahi** karta (Claude Code docs).
- Server sirf `127.0.0.1` par chalta hai — internet se koi access nahi.
- `Allow always` sirf **is session** ke liye hota hai, permanent rule nahi banta.
- Dusri websites island server ko touch nahi kar sakti (koi CORS nahi, foreign `Origin` → 403), to koi page chupke se Allow nahi bhej sakta.
- Keyboard shortcuts (Return / Esc / A) tabhi kaam karte hain jab request aane ke **baad** tum island par click ya Tab karo — galti se typing kabhi approve nahi karegi.

## Kaise chalaye — 3 steps (Windows)

### Step 1 — Install (ek baar)
```bat
cd zenviq-island
npm install
```

### Step 2 — Claude Code + Antigravity connect karo (ek baar, saare projects ke liye)
```bat
npm run setup
```
- `~/.claude/settings.json` (Claude Code) aur `~/.gemini/config/hooks.json` (Antigravity) me island hooks add hote hain. Baaki settings same rehti hain; pehli baar `*.zenviq-backup` copy banti hai.
- Phir naya Claude Code session kholo (ya `/hooks` ek baar) aur Antigravity reopen karo.
- Hatana ho to: `npm run unsetup`.

### Step 3 — Island chalao
```bat
npm run island                    REM abhi chalao
npm run island -- --autostart     REM abhi + har Windows login par apne aap
```
Screen ke top par always-on-top island aa jayega. Tray icon (neeche right) se: control page, "Start at login" on/off, Quit.
Island ke bahar ka area click-through hai — neeche ki windows normal kaam karti hain.

- **On hote hi:** 5 sec ke liye "Welcome, Samir" + greeting, date aur time. Naam `public/index.html` me `USER_NAME` hai.
- **Move:** island ko drag karke kahin bhi rakho. Top-center ke paas chhodo to wapas notch par snap. Position yaad rehti hai.
- **Size:** island par right-click (ya tray) → Size: **Mini** (sirf avatar + status) / **Normal** / **Large**. Mini me Done par island nahi khulta; permission request phir bhi khulti hai.
- **Done ke baad:** celebration ke 6 sec baad island wapas "Ready" mode me.

### Kya kya dikhega
- **Claude Code** (kisi bhi terminal / project me): permission → Allow / Deny / Always allow (is session), activity, Done, notifications.
- **Antigravity**: agent ke terminal commands (`run_command`) island par Allow / Deny ke liye aate hain. 2 min me jawab nahi diya to Antigravity apna normal prompt dikhata hai. Activity + Done bhi dikhta hai.
- Browser demo / control page: **http://127.0.0.1:18777** (`npm run demo` se bina Claude ke test).

> Mac/Linux par bhi same commands. `npm test` permission flow ka self-test chalata hai.

## Avatar

Avatar files repo me nahi hain (wo third-party art hai). Island unke bina bhi chalta hai — bas avatar ki jagah khaali black tile aur tray me ek simple pill icon dikhega.
Apna avatar lagana ho to ye files `public/avatar/` me daalo (square, dark background best lagta hai):

| File | Kab dikhta hai |
|---|---|
| `hatch_dark_still.webp` | still image (fallback, error, reduced motion) |
| `hatch_dark.mp4` | idle / permission (loop) |
| `hatch_working_dark.mp4` | kaam chal raha hai (loop) |
| `hatch_making_something_dark.mp4` | file edit ho rahi hai (loop) |
| `hatch_milestone_dark.mp4` | Done celebration (ek baar) |
| `tray.png` | tray icon (32×32) |

## Files

- `server.js` — local server (Node, zero dependencies), port 18777, localhost only
- `public/index.html` — island UI: Apple Dynamic Island style (spring morph, blur transitions, call-style Allow/Deny, countdown ring, session timer) + browser control page
- `public/avatar/` — hatch avatar: still + 4 animated clips (idle, working on laptop, making something, done celebration). Muse se liya hai — personal use theek hai, public/paid build me daalne se pehle rights chahiye
- `hooks/island-hook.js` — Claude Code + Antigravity hook bridge (stdin JSON → server)
- `setup.js` — `npm run setup` / `npm run unsetup`: hooks install / remove (Claude Code + Antigravity)
- `claude-settings.example.json` — `~/.claude/settings.json` me dalne wala hooks block
- `electron/main.js` — always-on-top frameless window wrapper
- `demo.js` — bina Claude ke demo chalane ke liye

## Kaise kaam karta hai (technical)

Claude Code docs ke hisab se (`code.claude.com/docs/en/hooks`):
- `PermissionRequest` — jab Claude permission maangne wala hota hai, tab fire hota hai. Input: `tool_name`, `tool_input`, `permission_suggestions`. Output: `hookSpecificOutput.decision.behavior = "allow" | "deny"`. `Notification` wala `permission_prompt` iske ~6 sec baad aata hai, isliye instant signal ke liye `PermissionRequest` use kiya hai.
- `PreToolUse` / `PostToolUse` — activity feed ke liye.
- `Stop` — kaam complete hone ka signal.
- `Notification` — `idle_prompt` / `agent_completed` ke liye backup.
- Hook timeout: PermissionRequest ke liye 300s set hai, hook 270s tak wait karta hai.

## Abhi kya nahi hai (Phase 2)

- Codex support (TwoCode me hai) — Claude pehle, Codex baad me
- Robo se screen par sawal puchna ("Ask Robo about your screen")
- Multiple sessions / projects ka switcher

Batao to Phase 2 bhi bana du — ya pehle ye chala ke dekho, kya improve karna hai.
