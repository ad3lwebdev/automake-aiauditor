# AGENTS.md — Portfolio Architecture Guide

## Project Overview

A zero-dependency, pure HTML/CSS/JS portfolio website for Adel Auditor (AI Automation Specialist). Three source files, no build step, deployable anywhere static files are served.

## File Structure

```
/
├── index.html   — All markup, sections, and CDN links
├── style.css    — All styling (custom properties, animations, responsive)
├── script.js    — All interactivity (no libraries)
├── README.md
└── AGENTS.md
```

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
| Skill bars           | `IntersectionObserver` on `.skill-fill[data-width]`, sets `style.width` |
| Scroll reveal        | `IntersectionObserver` adds `.visible` to `.reveal` elements |
| Active nav           | Scroll listener reads `section.offsetTop`, sets `.active` on `.nav-link` |
| Contact form         | `#contact-form` — client-side validation, simulated async submit |
| Footer year          | Sets `#footer-year` to `new Date().getFullYear()` |

## Non-Obvious Decisions

- **No framework** — chosen deliberately for GitHub Pages compatibility and zero build pipeline. Avoids node_modules, config files, and framework churn.
- **Glassmorphism requires `backdrop-filter`** — works in all modern browsers. Falls back gracefully (card is still visible, just without blur).
- **`data-theme` on `<html>`** rather than `<body>` — allows CSS selectors to scope the entire document including the navbar which is outside `<main>`.
- **`data-target` attribute** drives counter animation — keeps HTML declarative and JS generic.
- **`data-width` on `.skill-fill`** — the CSS `width` starts at 0; JS sets it after observation, triggering the CSS `transition`.
- **Circuit SVG in the hero** is purely decorative (`aria-hidden="true"`) to avoid polluting the accessibility tree.
