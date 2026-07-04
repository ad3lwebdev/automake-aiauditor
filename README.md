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

## FAQ Chat Widget (no backend, no API cost)

A floating chat assistant ("AVA") sits in the bottom-right corner of every
page. It's fully client-side — no AI API, no server, no ongoing cost — and
answers by matching keywords in the visitor's question against the entries
in **`faq.json`**.

**To edit what it says:**
1. Open `faq.json`
2. Edit `greeting`, `fallback`, `quickQuestions` (the suggestion chips), or
   any entry in `faqs` — each has a list of `keywords` to match against and
   an `answer` to show when matched
3. Save, commit, push — live immediately, no code changes needed

If nothing matches, it falls back to the `fallback` message pointing the
visitor to the real contact form.

## Contact Form (Web3Forms)

The contact form sends real emails via [Web3Forms](https://web3forms.com) —
a free, backend-free form relay (no signup account needed, just an access
key delivered to your email).

**One-time setup:**
1. Go to https://web3forms.com and enter the email where you want to
   receive messages (e.g. `adelauditor05@gmail.com`)
2. Copy the **Access Key** you receive
3. Open `index.html`, find this line near the top of the contact form:
   ```html
   <input type="hidden" name="access_key" value="YOUR-WEB3FORMS-ACCESS-KEY-HERE" />
   ```
4. Replace `YOUR-WEB3FORMS-ACCESS-KEY-HERE` with your real access key
5. Save, commit, push — done. Every form submission now emails you directly.

No monthly cap on the free plan for this volume of traffic. A built-in
honeypot field (`botcheck`) silently drops obvious bot submissions.

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
