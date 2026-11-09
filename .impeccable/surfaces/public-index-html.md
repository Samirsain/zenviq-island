---
version: 1
slug: "public-index-html"
primary_target: "public/index.html"
related_targets: []
---

## Scope

`public/index.html`: the island (Electron window shows only the island, via `?island` or Electron user agent) and the browser control page. Visitor mode: Operate.

## Audience, job, constraints

Developer glancing up from other work. Jobs: know what Claude is doing; answer a permission request in seconds; hear and see when work is done. Constraints: never auto-allow; keys arm only once the request is visible; works at 640 px wide transparent Electron window; reduced motion respected.

## Direction contract

THESIS: The island is Apple's Dynamic Island for Claude Code: one black shape that morphs on a spring between compact and expanded, with the hatch avatar in the caller's seat. It refuses the web-dashboard pill with coloured borders and an endlessly pulsing outline.

OWN-WORLD: Hardware-black island with a hairline edge; iOS dark system colours doing real jobs (orange #FF9F0A permission and countdown, green #30D158 allow and done, red #FF453A deny and failure, blue #0A84FF focus); system SF / Segoe type with tabular numerals; 8-spoke iOS activity spinner; call-style round Deny and Allow buttons; the avatar is Now-Playing-style rounded-square artwork playing the hatch character clips (idle, laptop, orb, celebration) with blur crossfades (user feedback 2026-11-09); concentric radii (island 34, inner 16). Control page: iOS inset-grouped lists on #F2F2F7 / #000 with Settings-style colour tiles and a real switch.

STORY: Glance and know what Claude is doing. When Claude needs you, the island opens like an incoming call; read the command, press green or red, the island folds back with the outcome. Done lands with a drawn checkmark and a chime.

FIRST VIEWPORT: Island centred 14 px from the top: 44 px pill, animated hatch avatar as 32 px rounded-square artwork at left (laptop clip while working), verb in semibold plus detail in secondary, spinner and session timer at right. Below it the page: large title, Try it group (permission demo, working demo, sound switch, expand), Activity list, How it works, Keyboard.

FORM: Brief-pinned direction (Apple Dynamic Island); no concept roll ran, seed key: none (pinned by the user's brief).

SIGNATURE: Shared-element morph. The avatar travels from the compact leading slot (32 px, radius 10) to the expanded leading slot (64 px, radius 16) on the island's own spring while the outgoing content blurs out and the incoming content blurs in; during a permission request a countdown ring drains around the avatar.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
