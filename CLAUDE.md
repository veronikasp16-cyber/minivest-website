# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing (תדמית) website for **MiniVest**, a Tinder-style app that matches small Israeli businesses with private investors. Investors filter businesses by category and vice versa; investments start at ₪500 and the cap is set by the business owner. Course project (Business Data and Technology).

## Structure

Static site, no build step, no dependencies besides the Heebo font from Google Fonts. Content is Hebrew, `dir="rtl"`: keep new copy in Hebrew and check alignment in RTL.

- `index.html`: landing page (swipe demo, how-it-works tabs, category chips, investment slider, FAQ) plus the **signup form** (`#joinForm`) that creates a profile.
- `profile.html?id=…`: personal page for one profile (business or investor). `&new=1` shows the "your page is ready" banner; own profile gets an edit button that links to `index.html?edit=1#join` (form refilled).
- `explore.html`: grid of all profiles with role tabs, category filter and text search.
- `styles.css`: all shared CSS (tokens, components, and the sections for the form, profile page and explore page).
- `store.js`: shared data layer exposed as `window.MV`, plus header behaviour (mobile menu; the "הצטרפות" button `#joinBtn` becomes "העמוד שלי" when a profile exists). Every page loads it.

## Data (no backend)

- Profiles are stored **only in the visitor's browser** (`localStorage` key `minivest.profiles`; own profile id in `minivest.me`). Other visitors/devices never see them. Every storage access is wrapped in try/catch; `MV.save` returns `null` when storage fails.
- `MV.all()` = saved profiles + `SEED` in `store.js` (5 sample businesses, 4 sample investors, flagged `sample:true` and labeled "דוגמה" in the UI). The `BUSINESSES` array in `index.html` is separate and only feeds the swipe demo.
- `MV.CATEGORIES` is the single source for categories (form, filters, profile tags). Note the category chips in the `#categories` section of `index.html` are still static HTML.
- Profile photos are downscaled via `MV.resizeImage` (≤400px JPEG data URL) to stay under localStorage limits.
- All user-supplied text is inserted through `MV.esc` into `innerHTML` templates; keep doing that for any new field. The email is collected but intentionally never displayed ("contact details open after a match").

## Conventions

- Colors are CSS tokens on `:root`, with dark-mode overrides in both `@media (prefers-color-scheme: dark)` and `:root[data-theme="dark"]`. Change both blocks together.
- Brand palette: violet → magenta-pink → orange. `--grad` is the brand gradient used for primary buttons, the logo, active tabs/chips, step numbers, the match overlay, profile header band and gradient text. `--cta-bg` is the dark violet gradient behind the signup intro box. `--accent` (pink) and `--violet` are solid colors for glows, shadows and icons.
- `--mint` (green) is reserved for success/match signals (funding progress bars, the like button, checkmarks, "your page" badge). `--nope` is the red for the reject button and form errors. Don't use the brand gradient for those.
- The hero has two animated blurred blobs, disabled under `prefers-reduced-motion`.
- Header and footer markup is duplicated in each HTML file; when changing nav links, update all three pages.
- The footer investment disclaimer should stay on every page.

## Investment analysis agent and hook (user-level, outside this repo)

- `business-investment-analyst` is a global subagent defined in `~/.claude/agents/business-investment-analyst.md`. Give it a business (name, sector, city, years, funding goal, purpose, investment amount) and it researches the sector and returns scenarios (ROI %, payback, break-even, risk-adjusted view, total-loss case) in Hebrew with sources. It is research, not investment advice. Business data on the site is sample data, so its output rests on stated assumptions, not real financials.
- Agents are loaded when a session starts. If it was created or edited mid-session, `Agent` reports "not found": start a new session, or run the same instructions through `general-purpose`.
- `~/.claude/settings.json` has a `SubagentStop` hook that plays a sound when any subagent finishes: `~/.claude/sounds/win95.wav` if present, otherwise `C:\Windows\Media\tada.wav`. Also loaded at session start.

## Local preview

There is no Python/Node on this machine. `.claude/launch.json` defines `minivest-static`, which runs a tiny PowerShell static server (`serve.ps1` kept in the session scratchpad, not in the repo; recreate it if missing). Opening `index.html` via `file://` also works for a quick look, but the browser-pane preview of a bare file does not load the sibling `styles.css`/`store.js`.
