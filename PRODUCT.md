# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

A solo developer running Claude Code on a Windows laptop who keeps working in other apps while Claude works. They need to know what Claude is doing and answer its permission prompts without watching the terminal. (Inferred from README and the build request; confirmed by the user's request on 2026-11-09.)

## Product Purpose

Zenviq Island is a Dynamic-Island-style, always-on-top pill that mirrors Claude Code hook events: live activity, permission requests answered in place (Allow / Deny / Allow always for this session), and a done or failed signal with sound and a system notification. Success: the user never has to look at the terminal to know Claude needs them.

## Positioning

Built on Claude Code's `PermissionRequest` hook as a long-poll, so the click goes straight back to Claude. It never auto-allows: after 270 s with no answer the hook returns no decision and Claude shows its own terminal prompt. A hook allow never overrides a deny rule.

## Operating Context

- Local only: zero-dependency Node server on `127.0.0.1:18777`, `hooks/island-hook.js` bridge, Electron frameless transparent always-on-top window.
- The browser page at the same URL is the demo and control page; the Electron window shows only the island.
- Windows first; macOS and Linux supported.

## Capabilities and Constraints

- States: idle, working, needs-permission, done, error (plus server offline).
- Permission: Allow, Deny, Allow always (session-scoped `addRules`), 270 s timeout, never auto-allow.
- Activity: tool plus file or command summary, project, last 20 events.
- Sound toggle, system notifications, demo scenarios (permission, working).
- Requested extras (2026-11-09): permission countdown ring, session timer, keyboard shortcuts (Return allow, Esc deny, A allow always).
- Phase 2, not built: Codex support, asking the avatar about the screen, auto-start and tray, multi-session switcher.

## Brand Commitments

- UI copy is short English (confirmed 2026-11-09).
- Visual language is Apple's Dynamic Island: Apple-style UI, motion and transitions (binding user brief).
- Avatar is "hatch" from the user's Muse library (`assets/avatar/reference`), dark variants so it melts into the black island. Third-party asset: fine for personal use, needs rights before any public or paid build.

## Evidence on Hand

- `public/avatar/hatch_dark_still.webp`: captured from the Muse viewer on 2026-11-09.
- Avatar videos in `public/avatar/` (`hatch_dark.mp4` idle, `hatch_working_dark.mp4` laptop, `hatch_making_something_dark.mp4` orb, `hatch_milestone_dark.mp4` done): rebuilt on 2026-11-09 from frames of the Muse originals (168 px, 20 fps, 5 s) because Chrome automation could not download the files. Replacing them with the original 480 px files is a straight swap.

## Product Principles

1. Never decide for the user: every allow is an explicit click or key, and keys arm only once the request is visible.
2. Glanceable first: state readable in under a second at the top of the screen.
3. Stay out of the way: compact unless the user is needed.
4. Local and private: localhost only.

## Accessibility & Inclusion

Keyboard operable, reduced-motion path, sound can be turned off, status changes announced to screen readers.
