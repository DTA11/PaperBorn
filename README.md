# Baby Card Printables

Free printable baby cards, built in the browser. No framework, no dependencies.

## Generators
| URL | What it makes |
| --- | --- |
| `/generators/baby-stats/` | Birth announcement card (11 designs, photo studio) |
| `/generators/milestones/` | Monthly milestone cards, newborn to 3 years (9 designs incl. 4 Little Animals) |
| `/generators/flashcards/` | High-contrast newborn flashcards (17 patterns, 5 palettes) |
| `/generators/shower-games/` | Gift bingo with unique boards, predictions, advice cards |

## Build and run
```
node scripts/build.mjs        # writes dist/
npm start                     # serves on http://localhost:8080 (python3 -m http.server --directory dist also works)
```
Netlify: build command `node scripts/build.mjs`, publish directory `dist` (already in `netlify.toml`).

## Styles (Tailwind)
Tailwind is compiled ahead of time into `src/assets/css/tailwind.css` (no CDN on the live site). After adding or changing Tailwind classes in pages or scripts, rebuild it and commit the result:
```
npx tailwindcss@3 -c tailwind.config.js -i tailwind/input.css -o src/assets/css/tailwind.css --minify
```

## Settings
- `site.config.json`: site name, URL, contact email (`hello@babycardprintables.com`), analytics and ads.
- Ads stay off until `ads.enabled` is true. EU visitors need a consent banner (CMP) first.
- `netlify.toml`: the Content Security Policy is still report-only. Switch it to enforcing after a real PNG/PDF export test on an iPhone shows no violations, and add ad/analytics hosts first.

## What the editor saves
Everything stays in the visitor's browser (local storage): the card details and settings, a smaller copy of an uploaded photo, and saved looks. *Start over* clears the details and photo of the current card.

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
