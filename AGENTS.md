# AGENTS.md — Portfolio Architecture Guide

## Project Overview

A zero-dependency, pure HTML/CSS/JS portfolio website for Adel Auditor (AI Automation Specialist). Three source files, no build step, deployable anywhere static files are served.

## File Structure

```
/
├── index.html   — All markup, sections, and CDN links
├── style.css    — All styling (custom properties, animations, responsive)
├── script.js    — All interactivity (no libraries)
├── data.json    — Editable content: skills[] and projects[] (see below)
├── README.md
└── AGENTS.md
```

## Updating Content (data.json)

Skills and projects are **not** hard-coded in `index.html`. They live in
`data.json` and are fetched + rendered into `#skills-grid` and
`#projects-grid` by section 0 of `script.js` (`loadPortfolioData`).

To add/edit/remove a skill, edit the `skills` array:
```json
{ "name": "n8n", "icon": "fa-solid fa-network-wired", "percent": 95 }
```
- `icon` is any Font Awesome 6 class string (already loaded via CDN).
- The first 6 skills also populate the decorative radar chart labels.

To add/edit/remove a project, edit the `projects` array:
```json
{
  "title": "Project Name",
  "icon": "fa-solid fa-robot",
  "status": "live",
  "featured": false,
  "description": "One or two sentences.",
  "tags": ["n8n", "OpenAI"],
  "link": "https://github.com/ad3lwebdev/repo-name"
}
```
- `featured` (boolean) applies the `.project-card--featured` highlight style.
- `status` becomes both the CSS class (`project-status--{status}`) and the
  displayed label (auto-capitalized) — use values that make sense with the
  existing status-dot styling (e.g. `live`, `beta`, `archived`).

**Important:** because content is fetched via `fetch('data.json')`, opening
`index.html` directly as a `file://` URL will fail silently (browsers block
local `fetch` by default) — the sections will show a "failed to load"
message. Use a local server (`python3 -m http.server 8080`) or view it live
via GitHub Pages, where `fetch` works normally over HTTP.

## HTML Sections (index.html)

| Section ID  | Purpose                                      |
|-------------|----------------------------------------------|
| `#home`     | Hero — typing effect, animated background    |
| `#about`    | Bio + animated stat counters                 |
| `#services` | 5 service cards (glassmorphism)              |
| `#skills`   | Progress bars + decorative radar chart       |
| `#projects` | 4 project cards with tags                    |
| `#workflow` | 5-step horizontal flow diagram               |
| `#contact`  | Contact info + form                          |

The `<header class="navbar">` is outside `<main>` and is position:fixed.

## CSS Conventions (style.css)

- **All design tokens** are CSS custom properties on `:root`. Light mode overrides on `[data-theme="light"]`.
- **Key variables:** `--bg-primary`, `--bg-secondary`, `--purple-primary`, `--purple-light`, `--purple-gradient`, `--purple-glow`, `--text-primary`, `--text-secondary`, `--glass-border`, `--card-bg`.
- **Glass cards:** `.glass-card` uses `backdrop-filter: blur(18px)` + `background: var(--card-bg)` + `border: 1px solid var(--glass-border)`.
- **Animations:** defined with `@keyframes` — `orbFloat`, `circuitDash`, `nodeGlow`, `badgePulse`, `cursorBlink`, `scrollDrop`, `aiPulse`, `arrowPulse`, `radarPulse`.
- **Scroll-reveal:** `.reveal` → add `.visible` class via JS (opacity 0 → 1, translateY 28px → 0).
- Responsive breakpoints: `max-width: 768px` (mobile) and `max-width: 1024px` (tablet).

## JavaScript Patterns (script.js)

All code runs inside a single `DOMContentLoaded` listener. No global state except closures.

| Feature              | Mechanism                                    |
|----------------------|----------------------------------------------|
| Theme toggle         | Toggle `data-theme="light"` on `<html>`, save to `localStorage` key `aa-theme` |
| Mobile menu          | Toggle `.active` on `#hamburger` and `#mobile-menu` |
| Sticky navbar        | Add `.scrolled` to `.navbar` when `scrollY > 48` |
| Typing effect        | Character-by-character `setTimeout` loop, targets `#typed-text` |
| Stat counters        | `IntersectionObserver` on `[data-target]`, `requestAnimationFrame` count-up |
| Dynamic content      | `fetch('data.json')` on load → renders `#skills-grid` and `#projects-grid`, then calls `initSkillBars()` |
| Skill bars           | `IntersectionObserver` on `.skill-fill[data-width]`, sets `style.width` (invoked by `initSkillBars()` after render) |
| Scroll reveal        | `IntersectionObserver` adds `.visible` to `.reveal` elements |
| Active nav           | Scroll listener reads `section.offsetTop`, sets `.active` on `.nav-link` |
| Contact form         | `#contact-form` — client-side validation, then real submission via `fetch()` to Web3Forms (`api.web3forms.com/submit`); honeypot field drops bots |
| Footer year          | Sets `#footer-year` to `new Date().getFullYear()` |

## Non-Obvious Decisions

- **No framework** — chosen deliberately for GitHub Pages compatibility and zero build pipeline. Avoids node_modules, config files, and framework churn.
- **Glassmorphism requires `backdrop-filter`** — works in all modern browsers. Falls back gracefully (card is still visible, just without blur).
- **`data-theme` on `<html>`** rather than `<body>` — allows CSS selectors to scope the entire document including the navbar which is outside `<main>`.
- **`data-target` attribute** drives counter animation — keeps HTML declarative and JS generic.
- **`data-width` on `.skill-fill`** — the CSS `width` starts at 0; JS sets it after observation, triggering the CSS `transition`.
- **Circuit SVG in the hero** is purely decorative (`aria-hidden="true"`) to avoid polluting the accessibility tree.
