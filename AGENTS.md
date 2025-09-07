# Repository Guidelines

## Project Structure & Modules
- `index.html` – main page with semantic sections (hero, features, properties, footer).
- `styles.css` – global styles, CSS variables, responsive rules.
- `script.js` – vanilla JS for interactions/animations.
- `images/` – all assets; use lowercase, kebab-case names (e.g., `recent-property-1.png`).
- `README.md` – product overview (pt-BR) and visual specs.

## Build, Test, and Development
- No build step. Open `index.html` directly in a browser.
- Serve locally for SPA-like navigation/perf: `python -m http.server 8080` then visit `http://localhost:8080`.
- Optional quick check: open DevTools Console (no errors/warnings on load) and test scrolling/hover/search.

## Coding Style & Naming
- Indentation: 4 spaces in HTML/CSS/JS; keep semicolons in JS; single quotes preferred.
- HTML: semantic sections; keep Portuguese UI text consistent with README.
- CSS: kebab-case class names; reuse variables in `:root`; follow palette/typography from README; group rules by section.
- JS: ES6+ without frameworks; camelCase for variables/functions; keep DOM selectors aligned with CSS names; comments may be pt-BR.
- Assets: place new images in `images/`; optimize (dimensions/size) before commit.

## Testing Guidelines
- No automated tests. Perform manual QA:
  - View at 1440px, 1024px, 768px, 375px; check layout, animations, parallax.
  - Lighthouse (Performance/Accessibility/Best Practices) in Chrome DevTools.
  - Keyboard navigation and focus states; verify no console errors.

## Commit & Pull Request Guidelines
- Use clear, scoped commits; Conventional Commits are encouraged: `feat:`, `fix:`, `style:`, `docs:`, `refactor:`, `chore:`.
- Subject ≤ 72 chars; present tense. Example: `feat: add property types section grid`.
- PRs must include:
  - Summary of changes and rationale.
  - Before/after screenshots (desktop/tablet/mobile).
  - Any known trade-offs and manual test notes.

## Security & Configuration Tips
- Do not commit secrets or trackers. Keep external deps minimal (fonts via Google Fonts only).
- Optimize and attribute images appropriately; prefer local assets.

## Agent-Specific Notes
- Keep changes small and focused; do not introduce build tools unless requested.
- Preserve file organization and naming; avoid wholesale reformatting.
- When adding sections, mirror existing HTML/CSS patterns and variables.

