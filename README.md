# Paperborn

Free printable baby cards, built in the browser. No framework, no dependencies.

## Generators
| URL | What it makes |
| --- | --- |
| `/generators/baby-stats/` | Birth announcement card (11 designs, photo studio) |
| `/generators/milestones/` | Monthly milestone cards, newborn to 3 years (5 designs) |
| `/generators/flashcards/` | High-contrast newborn flashcards (17 patterns, 5 palettes) |
| `/generators/shower-games/` | Gift bingo with unique boards, predictions, advice cards |

## Build and run
```
node scripts/build.mjs        # writes dist/
npm start                     # serves on http://localhost:8080 (python3 -m http.server --directory dist also works)
```
Netlify: build command `node scripts/build.mjs`, publish directory `dist` (already in `netlify.toml`).

## Before you go public
1. In `site.config.json` set `siteUrl` (your .com), `contactEmail` (currently a placeholder) and, when ready, `analytics.plausibleDomain`.
2. Replace the Tailwind CDN in `src/layout.html` with a compiled stylesheet for speed (Tailwind CLI, content `src/**/*.{html,js}`).
3. Ads stay off until `ads.enabled` is true. EU visitors need a consent banner (CMP) first.

## Add a generator
1. Create `src/assets/js/generators/<slug>/def.js` (themes, formats, sections, templates, optional decor/pageCount/pack) and a `main.js` that calls `boot(def)`.
2. Create `src/pages/generators/<slug>/index.html` with a `<!--meta {...} -->` header and `{{> editor}}`.
3. Link it from `src/pages/index.html` and run the build; the sitemap updates automatically.

## Structure
```
src/layout.html, partials/      shared page shell, header, footer, editor UI
src/pages/                      one HTML file per URL
src/assets/js/core/             engine (editor, undo, export), photo, svg, fonts
src/assets/js/generators/*/     one folder per generator
scripts/build.mjs               static site builder
```
