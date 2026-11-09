---
name: Zenviq Island
description: Apple's Dynamic Island for Claude Code; one hardware-black shape that springs open when Claude needs you.
colors:
  island-black: "#000000"
  island-label: "#ffffff"
  island-label-secondary: "rgba(235, 235, 245, .64)"
  island-label-tertiary: "rgba(235, 235, 245, .5)"
  island-fill: "rgba(118, 118, 128, .28)"
  island-fill-hover: "rgba(118, 118, 128, .42)"
  island-separator: "rgba(84, 84, 88, .55)"
  system-orange: "#ff9f0a"
  system-green: "#30d158"
  system-red: "#ff453a"
  system-blue: "#0a84ff"
  offline-gray: "#636366"
  page-bg: "#f2f2f7"
  page-group: "#ffffff"
  page-label: "#000000"
  page-label-secondary: "rgba(60, 60, 67, .78)"
  page-separator: "rgba(60, 60, 67, .2)"
  page-press: "rgba(120, 120, 128, .16)"
  page-tint: "#007aff"
  page-switch-off: "rgba(120, 120, 128, .2)"
  page-switch-on: "#34c759"
  page-chip: "rgba(118, 118, 128, .12)"
  page-bg-dark: "#000000"
  page-group-dark: "#1c1c1e"
  page-label-dark: "#ffffff"
  page-label-secondary-dark: "rgba(235, 235, 245, .64)"
  page-separator-dark: "rgba(84, 84, 88, .6)"
  page-press-dark: "rgba(120, 120, 128, .3)"
  page-tint-dark: "#0a84ff"
  page-switch-off-dark: "rgba(120, 120, 128, .32)"
  page-switch-on-dark: "#30d158"
  page-chip-dark: "rgba(118, 118, 128, .26)"
  tile-orange: "#ff9500"
  tile-blue: "#007aff"
  tile-pink: "#ff2d55"
  tile-gray: "#8e8e93"
  tile-indigo: "#5856d6"
  tile-green: "#34c759"
typography:
  large-title:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"SF Pro Display\", \"Segoe UI Variable Display\", \"Segoe UI\", system-ui, sans-serif"
    fontSize: "34px"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-.025em"
  group-title:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"SF Pro Display\", \"Segoe UI Variable Display\", \"Segoe UI\", system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-.02em"
  ask-tool:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"Segoe UI Variable Text\", \"Segoe UI\", system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-.02em"
  island-title:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"Segoe UI Variable Text\", \"Segoe UI\", system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-.02em"
  page-lede:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"Segoe UI Variable Text\", \"Segoe UI\", system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.4
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"Segoe UI Variable Text\", \"Segoe UI\", system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "-.005em"
  island-compact:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"Segoe UI Variable Text\", \"Segoe UI\", system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "-.01em"
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"Segoe UI Variable Text\", \"Segoe UI\", system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1
  numeric:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"Segoe UI Variable Text\", \"Segoe UI\", system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1
    fontFeature: "\"tnum\""
  caption:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"Segoe UI Variable Text\", \"Segoe UI\", system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.3
  mono:
    fontFamily: "ui-monospace, \"SF Mono\", \"Cascadia Code\", Consolas, monospace"
    fontSize: "12.5px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0"
rounded:
  island-expanded: "34px"
  island-compact: "22px"
  inner: "16px"
  artwork-compact: "10px"
  artwork-expanded: "16px"
  group: "12px"
  tile: "7px"
  key: "6px"
  chip: "5px"
  capsule: "999px"
  round: "50%"
spacing:
  hairline: "0.5px"
  xxs: "4px"
  xs: "7px"
  sm: "10px"
  md: "12px"
  lg: "14px"
  row-x: "16px"
  island-pad: "18px"
  group-gap: "30px"
  hero-gap: "32px"
  page-top: "72px"
components:
  island-compact:
    backgroundColor: "{colors.island-black}"
    textColor: "{colors.island-label}"
    typography: "{typography.island-compact}"
    rounded: "{rounded.island-compact}"
    height: "44px"
    padding: "0 15px 0 48px"
  island-expanded:
    backgroundColor: "{colors.island-black}"
    textColor: "{colors.island-label}"
    rounded: "{rounded.island-expanded}"
    width: "min(560px, calc(100vw - 24px))"
    padding: "18px"
  button-allow:
    backgroundColor: "{colors.system-green}"
    textColor: "{colors.island-label}"
    rounded: "{rounded.round}"
    size: "46px"
  button-deny:
    backgroundColor: "{colors.system-red}"
    textColor: "{colors.island-label}"
    rounded: "{rounded.round}"
    size: "46px"
  capsule:
    backgroundColor: "{colors.island-fill}"
    textColor: "{colors.island-label}"
    typography: "{typography.label}"
    rounded: "{rounded.capsule}"
    height: "34px"
    padding: "0 14px"
  capsule-hover:
    backgroundColor: "{colors.island-fill-hover}"
  code-well:
    backgroundColor: "{colors.island-fill}"
    textColor: "{colors.island-label}"
    typography: "{typography.mono}"
    rounded: "{rounded.inner}"
    padding: "11px 13px"
  list-group:
    backgroundColor: "{colors.page-group}"
    rounded: "{rounded.group}"
  list-row:
    textColor: "{colors.page-label}"
    typography: "{typography.body}"
    height: "48px"
    padding: "9px 16px"
  list-row-pressed:
    backgroundColor: "{colors.page-press}"
  settings-tile:
    textColor: "{colors.island-label}"
    rounded: "{rounded.tile}"
    size: "30px"
  switch-off:
    backgroundColor: "{colors.page-switch-off}"
    rounded: "{rounded.capsule}"
    width: "51px"
    height: "31px"
  switch-on:
    backgroundColor: "{colors.page-switch-on}"
---

# Design System: Zenviq Island

## Overview

**Creative North Star: "The Incoming Call"**

The system is Apple's Dynamic Island, adopted whole by brief, and put to work for Claude Code. One hardware-black shape sits at the top of the screen and changes size instead of changing screens: compact while Claude works, open like an incoming call when Claude needs a decision, open briefly for the done celebration, then folded back. All meaning is carried by shape, the iOS dark system colours, and motion on real springs; there is no chrome, no border colour, and no ambient pulsing.

The browser control page is the island's Settings app: iOS inset-grouped lists on the system grouped background, coloured Settings tiles, a real switch, large title. It follows light and dark; the island never does. Density is iOS-native: 44 px compact island, 48 px rows, 16 px row inset.

The avatar is the island's artwork. The hatch character plays as Now-Playing-style rounded-square artwork in the leading seat and travels as a shared element between the compact and expanded seats on the island's own spring.

**Key Characteristics:**
- One black shape, morphing on sampled spring physics, never swapping screens.
- iOS dark system colours each own exactly one job.
- System SF / Segoe type, tabular numerals for every clock.
- Concentric radii: island 34, inner wells 16, artwork 16 inside a 64 px seat.
- Text swaps by blur-replace; views leave by blur-out and arrive by blur-in.
- Reduced motion collapses every movement to opacity and a 200 ms ease.

## Colors

Hardware black plus the iOS dark system palette for the island; the iOS grouped-list palette, light and dark, for the control page.

### Primary
- **Hardware Black** (island-black): the island in every theme and every state, including the artwork seat behind the avatar video. Light mode does not lighten it.
- **System Orange** (system-orange): permission only. The compact verb, the compact countdown, the countdown ring stroke (track at 22% alpha), and the "left" countdown in the ask view.

### Secondary
- **System Green** (system-green): allow and done. The Allow call button, the done check disc, the "Allowed" verb flash.
- **System Red** (system-red): deny and failure. The Deny call button, the cross and alert discs, the "Denied" verb flash.
- **System Blue** (system-blue): focus on the island (2 px outline, 3 px offset on the shape) and text selection (55% alpha on black).

### Neutral
- **Island Label / Secondary / Tertiary** (island-label, island-label-secondary, island-label-tertiary): white for verbs and titles, 64% for detail and timers, 50% for project meta, recent-event times, and key hints.
- **Island Fill** (island-fill, island-fill-hover): the only surface inside the island: capsule buttons, the code well, keycaps.
- **Island Separator** (island-separator): the 0.5 px rule above the recent-events list.
- **Offline Gray** (offline-gray): the alert disc when the server is offline, so offline reads as absent rather than failed.
- **Grouped Page** (page-bg, page-group, page-label, page-label-secondary, page-separator, page-press, page-chip, and their `-dark` twins): the iOS grouped-list set. `page-tint` is the row trailing action ("Run") and the page focus ring.
- **Settings Tiles** (tile-orange, tile-blue, tile-pink, tile-gray, tile-indigo, tile-green): iOS light system colours behind white glyphs, one per row topic (orange permission, blue activity, pink sound, gray system, indigo hooks, green done).

### Named Rules
**The One Job Rule.** Orange means permission, green means allow or done, red means deny or failure, blue means focus. No colour is borrowed for decoration, and no state uses a coloured border on the island.

**The Always-Black Rule.** The island is #000 in light and dark. Only the page around it follows the colour scheme.

## Typography

**Display Font:** SF Pro Display (with Segoe UI Variable Display, Segoe UI, system-ui)
**Body Font:** SF Pro Text (with Segoe UI Variable Text, Segoe UI, system-ui)
**Label/Mono Font:** SF Mono (with Cascadia Code, Consolas)

**Character:** The platform's own type, because the world is the platform's own island. Display cuts only for the page's large title and group headings; everything inside the island is the Text cut, tightened slightly at larger sizes.

### Hierarchy
- **Large title** (700, 34px, 1.12, -.025em): the control page title only, balanced wrap.
- **Group title** (700, 20px, 1.25): grouped-list section headings.
- **Ask tool** (600, 19px, 1.2): the tool name in the permission view, single line with ellipsis.
- **Island title** (600, 17px, 1.25): the expanded detail title.
- **Body** (400, 15px, 1.45): page rows; page lede is 17px/1.4 in label-secondary, max 46ch.
- **Island compact** (500, 14px): compact verb at 600 plus detail at 400 in secondary, 5 px apart, one line.
- **Label** (600, 13px): capsules; ask verb ("Claude wants to run") is 400 13px secondary above the tool.
- **Numeric** (500, 13px, tabular): session timer, countdown, compact trailing time; the detail timer is 15px.
- **Caption** (12px): island meta and recent events (12.5px); keycaps 500 11px.
- **Mono** (400, 12.5px, 1.5): the requested command in the code well, wraps anywhere, selectable.

### Named Rules
**The Tabular Clock Rule.** Every running number (session timer, countdown, log time) uses tabular numerals so the island never jitters as seconds tick.

**The Verb-First Rule.** Compact state reads verb in semibold, then detail in secondary, then the trailing indicator. One line, ellipsis, never wrap.

## Layout

The island is fixed, centred, 14 px from the top (10 px in the Electron transparent window). Its size is measured from the active view's content, never hard-coded: compact is max-content between 176 px and min(470px, 100vw - 24px) at 44 px tall; expanded views are min(560px, 100vw - 24px) wide with 18 px padding. Expanded views share one head: a 64 px seat for the avatar, 14 px gap, text column, then trailing timer or call buttons (12 px apart). Meta text aligns to the text column (78 px left inset).

The control page is a single 640 px column, 16 px side padding, whose top padding is island height + 72 px and animates on the island's spring so the page makes room as the island grows. Groups are 30 px apart, the hero 32 px above the first group, group titles 9 px above their list, footnotes 8 px below. Rows are min 48 px, 9/16 padding, 12 px gap; row separators are 0.5 px and start at 58 px (after the tile) or 16 px in lists without tiles.

## Elevation & Depth

The page is flat; depth belongs to the island alone, which floats over everything like hardware. Inside the island depth is tonal: translucent gray fills on black, no shadows.

### Shadow Vocabulary
- **Island float** (`box-shadow: inset 0 0 0 .5px rgba(255,255,255,.1), 0 16px 36px -12px rgba(0,0,0,.55), 0 3px 10px rgba(0,0,0,.18)`): the island only. The inset hairline gives the black edge definition on a black page.
- **Switch knob** (`box-shadow: 0 3px 8px rgba(0,0,0,.15), 0 1px 1px rgba(0,0,0,.16), 0 3px 1px rgba(0,0,0,.1)`): the iOS switch thumb only.

### Named Rules
**The Hairline Edge Rule.** The island's edge is a 0.5 px white hairline at 10%, never a coloured or animated border.

## Shapes

Continuous, concentric rounding. The compact island is a full pill (radius = height / 2); expanded it becomes a 34 px rounded rectangle, and the inner code well (16) and expanded artwork (16) sit concentrically 18 px inside it. Artwork is a rounded square: 10 px at 32 px in the compact seat, 16 px at 64 px expanded; the countdown ring is a rounded square that wraps it 5 px out and starts at 12 o'clock. Call buttons are circles, capsules are full pills, grouped lists 12 px, Settings tiles 7 px, keycaps 6 px, inline code and tags 5 px. No borders anywhere except 0.5 px separators.

## Components

### Island (signature)
One `section` with three absolutely stacked views: **compact** (status line), **detail** (title, detail clamped to 3 lines, project meta, last 3 events, sound capsule), **ask** (incoming-call layout: verb line, tool name, Deny and Allow, code well, Always-allow capsule, countdown, cwd and key hints). Clicking the shape toggles; Space or Return toggles when focused; Esc collapses outside ask.

- **Morph:** width, height, radius, avatar position/size/radius, and the page top padding all transition on one spring per morph. Growing uses the open spring (response 0.55 s, damping 0.74, about 680 ms, ~3% overshoot); shrinking uses the close spring (response 0.42 s, damping 0.92, about 440 ms, no visible overshoot). Both are sampled at 49 points into CSS `linear()`; browsers without `linear()` get `cubic-bezier(.3, 1.25, .5, 1)` 520 ms / `cubic-bezier(.2, .8, .2, 1)` 420 ms.
- **View swap:** outgoing view fades and blurs to 10 px and scales to .94 in 170 ms ease-out; incoming view returns opacity over 340 ms (80 ms delay) and blur over 400 ms (60 ms delay) on ease-out `cubic-bezier(.2, .8, .2, 1)`, scale on the spring.
- **Text swap (blur-replace):** changed text re-enters from opacity 0 / blur 5 px over 300 ms, only in the visible view.
- **Avatar:** two video layers crossfade (opacity 400 ms, blur 6 px to 0 over 450 ms); clips are idle, work (laptop), make (orb, for edits), done (plays once). A still image is the fallback; error and offline grey it out.
- **Nudge:** on a new permission request, one 640 ms scale beat (1 to 1.06 to .985 to 1). Never repeats.
- **Shake:** on error or a failed answer, 460 ms horizontal shake (-9, 8, -6, 4, -2 px).
- **Welcome:** a fourth expanded view for the first 5.2 s after the island turns on: "Welcome, Samir" (17/600), greeting by hour plus long date (14, label-2, one line), and the time at 32/600 display tabular on the right; 500 px wide. A pending request pre-empts it.
- **Done is a moment:** the server returns Done to Ready (idle) after 6 s with no new activity.
- **Sizes (Electron):** Mini keeps only the artwork and the trailing glyph or timer in the compact pill and skips the Done auto-expand; permission still expands. Normal is the default. Large zooms the whole island to 1.25. Drag moves the window; dropping within 60 × 40 px of top centre snaps home. Position and size persist.

### Buttons
- **Call buttons (Deny / Allow):** 46 px circles, system red and system green, white 22 px stroke glyph at 2.6 width. Hover brightness 1.1; press scales to .88 in 80 ms and springs back.
- **Capsule:** 34 px pill on island fill, 600 13px label, optional 15 px glyph. Hover lifts to island-fill-hover; press scales to .95.
- **Focus:** 2 px system-blue outline, 2 px offset (3 px on the island itself).

### Status indicators
- **Spinner:** iOS activity indicator, 16 px, 8 spokes with opacity 1 to .24 trailing, rotating in 8 steps per 800 ms.
- **Done check:** 20 px green disc with white tick drawn over 450 ms after a 280 ms delay.
- **Cross / alert:** 20 px red discs (alert disc goes gray offline).
- **Countdown ring:** 2.2 px orange stroke on a 22% orange track around the artwork, visible only in ask, draining linearly once per second toward the 4:30 timeout.

### Lists / Containers
- **Grouped list:** group surface, 12 px radius, clipped; rows 48 px min with 0.5 px inset separators. Button rows show press tint instantly and release over 400 ms ease-out.
- **Settings tile:** 30 px rounded square, 18 px white glyph, one tile colour per topic.
- **Activity rows:** tabular 66 px time column, event name, secondary detail, optional "Demo" tag; new rows enter from -6 px over 340 ms, 40 ms stagger.
- **Code well:** island fill, 16 px radius, mono, max 132 px tall, thin scrollbar.

### Inputs / Fields
- **Switch:** native checkbox with `role="switch"`, 51 x 31 pill; off is translucent gray, on is iOS green; 27 px white knob slides 20 px on the spring (340 ms) and widens to 33 px while pressed.

### Reduced motion
Morphs use a 200 ms ease with no overshoot; views cross-fade on opacity only (no blur, no scale); blur-replace, nudge, shake, log entry and check draw are skipped; the avatar shows the still image. The spinner keeps turning and the ring keeps draining because they report state, not decoration.

## Do's and Don'ts

### Do:
- **Do** change the island's size and radius on the sampled springs (open 0.55/0.74, close 0.42/0.92); measure the target from content.
- **Do** keep the island #000 with the 0.5 px 10% white hairline in every theme.
- **Do** give each iOS system colour exactly one job: orange permission, green allow/done, red deny/failure, blue focus.
- **Do** keep radii concentric: island 34, inner 16, artwork 10 compact / 16 expanded.
- **Do** swap text by blur-replace and views by blur-out / blur-in.
- **Do** use tabular numerals for every timer and countdown.
- **Do** give every motion a reduced-motion path that keeps state readable.

### Don't:
- **Don't** put coloured borders or a pulsing outline on the island; the brief rejects the web-dashboard pill.
- **Don't** loop attention effects; the nudge plays once per request.
- **Don't** add shadows inside the island; depth there is tonal fill on black.
- **Don't** animate the island with transform scale for the morph; it distorts text and corner radii.
- **Don't** let the island follow the light theme.
