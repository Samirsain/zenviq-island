// Zenviq Island — the always-on-top Dynamic Island (Electron).
//   npm run island                    start it (the local server runs inside this process)
//   npm run island -- --autostart     same, and also start it at every Windows login
// Drag the island anywhere; drop it near the top centre and it snaps back home. Right-click it
// (or use the tray icon) for size (Mini / Normal / Large), reset position, start at login, quit.
// Position and size are remembered.
const fs = require('fs');
const path = require('path');

let electron;
try { electron = require('electron'); } catch {
  console.error('Electron not installed. Run: npm install');
  console.error('Or test in browser: node server.js  →  http://127.0.0.1:18777');
  process.exit(1);
}
const { app, BrowserWindow, Menu, Tray, ipcMain, nativeImage, screen, shell } = electron;

// One island per computer: a second launch just exits.
if (!app.requestSingleInstanceLock()) { app.quit(); return; }

require('../server.js'); // localhost-only island server, inside this process

const PAGE = 'http://127.0.0.1:18777/';
const URL = PAGE + '?island';
const WIDTH = 640; // widest island (560) plus room for its shadow, at Normal size
const ZOOM = { mini: 1, normal: 1, large: 1.25 }; // Mini is a layout change inside the page
const MAIN = path.join(__dirname, 'main.js');
const login = { path: process.execPath, args: [MAIN] };
const startsAtLogin = () => app.getLoginItemSettings(login).openAtLogin;
const setStartAtLogin = (on) => app.setLoginItemSettings({ ...login, openAtLogin: on });

// ---- remembered position and size ----------------------------------------------------
app.setPath('userData', path.join(app.getPath('appData'), 'Zenviq Island'));
const PREFS = path.join(app.getPath('userData'), 'island-prefs.json');
let prefs = { size: 'normal' };
try { prefs = { ...prefs, ...JSON.parse(fs.readFileSync(PREFS, 'utf8')) }; } catch { /* first run */ }
if (!ZOOM[prefs.size]) prefs.size = 'normal';
const savePrefs = () => { try { fs.mkdirSync(path.dirname(PREFS), { recursive: true }); fs.writeFileSync(PREFS, JSON.stringify(prefs)); } catch {} };

const width = () => Math.round(WIDTH * ZOOM[prefs.size]);
const home = (display, w) => ({ x: Math.round(display.workArea.x + (display.workArea.width - w) / 2), y: display.workArea.y });
function startPosition() {
  const w = width();
  if (Number.isFinite(prefs.x) && Number.isFinite(prefs.y)) {
    const cx = prefs.x + w / 2;
    const visible = screen.getAllDisplays().some(({ workArea: a }) =>
      cx >= a.x && cx <= a.x + a.width && prefs.y >= a.y - 10 && prefs.y <= a.y + a.height - 60);
    if (visible) return { x: prefs.x, y: prefs.y };
  }
  return home(screen.getPrimaryDisplay(), w); // saved spot is gone (monitor unplugged): go home
}

let win = null, tray = null, drag = null;

function createWindow() {
  const { x, y } = startPosition();
  win = new BrowserWindow({
    width: width(), height: 100, x, y,
    frame: false, transparent: true, backgroundColor: '#00000000', hasShadow: false,
    alwaysOnTop: true, skipTaskbar: true, resizable: false, movable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false, contextIsolation: true, autoplayPolicy: 'no-user-gesture-required',
    },
  });
  win.setAlwaysOnTop(true, 'screen-saver');
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.setIgnoreMouseEvents(true, { forward: true });
  win.webContents.on('did-fail-load', () => setTimeout(() => win && !win.isDestroyed() && win.loadURL(URL), 500));
  win.webContents.on('did-finish-load', () => applySize(prefs.size));
  win.loadURL(URL);

  // The page reports the island's live rect and the window height it needs (it grows the
  // window before an expand and shrinks it after the collapse spring settles). Outside the
  // island the transparent window is click-through, so it never blocks what's underneath.
  let ignoring = true;
  setInterval(async () => {
    if (!win || win.isDestroyed()) return;
    try {
      if (drag) { if (ignoring) { ignoring = false; win.setIgnoreMouseEvents(false); } return; }
      const g = await win.webContents.executeJavaScript('window.islandGeometry ? window.islandGeometry() : null');
      if (!g) return;
      const z = win.webContents.getZoomFactor();
      const b = win.getBounds();
      const h = Math.round(g.frameH * z);
      if (g.frameH && Math.abs(b.height - h) > 1) win.setBounds({ ...b, height: h });
      const c = screen.getCursorScreenPoint();
      const inside = c.x >= b.x + g.x * z && c.x <= b.x + (g.x + g.w) * z && c.y >= b.y + g.y * z && c.y <= b.y + (g.y + g.h) * z;
      if (inside === ignoring) { ignoring = !inside; win.setIgnoreMouseEvents(ignoring, { forward: true }); }
    } catch {}
  }, 60);
}

// ---- drag: the window follows the cursor until the pointer is released --------------------
ipcMain.on('island:drag-start', () => {
  if (!win || drag) return;
  const c = screen.getCursorScreenPoint();
  const [x, y] = win.getPosition();
  const offset = { dx: c.x - x, dy: c.y - y };
  drag = setInterval(() => {
    const p = screen.getCursorScreenPoint();
    win.setPosition(p.x - offset.dx, p.y - offset.dy);
  }, 8);
});
ipcMain.on('island:drag-end', () => {
  if (!drag) return;
  clearInterval(drag); drag = null;
  const b = win.getBounds();
  const h = home(screen.getDisplayMatching(b), b.width);
  if (Math.abs(b.x - h.x) < 60 && Math.abs(b.y - h.y) < 40) win.setPosition(h.x, h.y); // snap home
  [prefs.x, prefs.y] = win.getPosition();
  savePrefs();
});
ipcMain.on('island:menu', () => menu().popup({ window: win }));

// ---- size --------------------------------------------------------------------------------
function applySize(size) {
  if (!win || win.isDestroyed()) return;
  win.webContents.setZoomFactor(ZOOM[size]);
  const b = win.getBounds(), w = width();
  if (b.width !== w) win.setBounds({ x: Math.round(b.x + (b.width - w) / 2), y: b.y, width: w, height: b.height });
  win.webContents.executeJavaScript(`window.setIslandSize && window.setIslandSize(${JSON.stringify(size)})`).catch(() => {});
}
function setSize(size) {
  prefs.size = size;
  applySize(size);
  if (Number.isFinite(prefs.x)) [prefs.x, prefs.y] = win.getPosition();
  savePrefs();
  if (tray) tray.setContextMenu(menu());
}
function resetPosition() {
  delete prefs.x; delete prefs.y; savePrefs();
  const h = home(screen.getPrimaryDisplay(), width());
  win.setPosition(h.x, h.y);
}

// ---- one menu for the tray and for right-click on the island ---------------------------
const menu = () => Menu.buildFromTemplate([
  { label: 'Size', submenu: ['mini', 'normal', 'large'].map((s) => ({
    label: s[0].toUpperCase() + s.slice(1), type: 'radio', checked: prefs.size === s, click: () => setSize(s),
  })) },
  { label: 'Move back to top centre', click: resetPosition },
  { type: 'separator' },
  { label: 'Open control page', click: () => shell.openExternal(PAGE) },
  { label: 'Start at login', type: 'checkbox', checked: startsAtLogin(), click: (item) => { setStartAtLogin(item.checked); if (tray) tray.setContextMenu(menu()); } },
  { type: 'separator' },
  { label: 'Quit Zenviq Island', click: () => app.quit() },
]);

function createTray() {
  // Your own avatar icon if present (public/avatar is not in the repo), else the plain pill.
  const own = path.join(__dirname, '..', 'public', 'avatar', 'tray.png');
  const icon = nativeImage.createFromPath(fs.existsSync(own) ? own : path.join(__dirname, 'tray-default.png')).resize({ width: 16, height: 16 });
  tray = new Tray(icon);
  tray.setToolTip('Zenviq Island');
  tray.setContextMenu(menu());
  tray.on('click', () => tray.popUpContextMenu());
}

app.setAppUserModelId('Zenviq Island'); // Windows needs this for system notifications
app.whenReady().then(() => {
  if (process.argv.includes('--autostart')) setStartAtLogin(true);
  createWindow();
  createTray();
});
app.on('window-all-closed', () => app.quit());
