# Adel Auditor — AI Automation Specialist Portfolio

A premium, production-ready personal portfolio website for Adel Auditor, an AI Automation Specialist.

## Features

- **Dark / Light mode** — user preference persisted in `localStorage`
- **Glassmorphism UI** — frosted glass cards with backdrop-filter blur
- **Animated gradient background** — floating orbs + SVG circuit traces
- **Typing hero effect** — cycles through role titles character by character
- **Smooth scrolling navigation** — sticky navbar with active-link highlight
- **Mobile menu** — hamburger with animated X transform
- **Skills progress bars** — animated on viewport entry via IntersectionObserver
- **Animated stat counters** — count-up on scroll (50+, 30+, 200+, 10 000+)
- **Project showcase cards** — glassmorphism, hover lift, tag chips
- **Workflow visualization** — 5-step horizontal flow diagram with pulse animations
- **Contact form** — client-side validation with success/error states
- **Fully responsive** — mobile-first, breakpoints at 768px and 1024px
- **SEO optimised** — Open Graph, Twitter Card, canonical, meta descriptions

## Updating Your Skills & Projects

You no longer need to edit HTML to add a project or skill. Just edit
**`data.json`** — the page renders it automatically. See `AGENTS.md` for the
exact field format. After saving, refresh the page (via a local server or
GitHub Pages) to see your changes.

## Tech Stack

- HTML5 (semantic, accessible, ARIA labels)
- CSS3 (custom properties, backdrop-filter, CSS animations, grid, flexbox)
- Vanilla JavaScript (ES2020, IntersectionObserver, no dependencies)
- [Inter](https://fonts.google.com/specimen/Inter) + [Space Mono](https://fonts.google.com/specimen/Space+Mono) (Google Fonts)
- [Font Awesome 6](https://fontawesome.com/) (CDN icons)

## Running Locally

No build step required, but since skills and projects are now loaded from
`data.json` via `fetch()`, you need to serve the folder over HTTP (opening
`index.html` directly as a `file://` URL will fail to load that content):

```bash
# any static server works
npx serve .
python3 -m http.server 8080
```

Then visit `http://localhost:8080` (or the port shown).

## GitHub Pages Deployment

Push the repository to GitHub and enable **Pages → Deploy from branch → `main` / `/ (root)`**. The site will be live immediately with no build configuration.
