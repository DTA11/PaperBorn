# Paperborn Studio

> Little details. Forever memories.

Paperborn is a single-file web app for designing birth-stats keepsake cards. Enter your baby's details, pick one of seven styles, add a photo and download a print-ready PDF or PNG. Everything runs in the browser, so nothing is uploaded to a server.

## Features

- **7 design styles:** Minimalist Gallery, Playful & Whimsical, Victorian Gazette, Gold & Midnight Noir, Boho Botanical, Cyber Tech Sheet and Editorial High Fashion.
- **Smart inputs:** calendar date picker, 24-hour time, weight in grams, height in cm. The zodiac sign is worked out automatically from the birth date.
- **Photo studio:** upload a photo and choose a frame shape (rectangle, circle, oval, arch, hexagon, rounded), a colour filter (natural, B&W, sepia, warm, cool, dither), plus brightness, contrast, zoom and offset.
- **Paper sizes:** A4, A5, US Letter, 8×10 frame and square.
- **Fonts:** six pairings (Playfair, Inter, Fredoka, Caveat, Cinzel, JetBrains Mono).
- **Export:** PDF and PNG, with an optional 3 mm print bleed.
- **Card pack:** one multi-page PDF containing any selection of the styles.
- **Templates:** save and reload a look (style, size, font, photo settings, toggles) without the baby's details.
- **Undo / redo:** header buttons, or Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z (Ctrl+Y also redoes).
- **Autosave:** your settings are kept in the browser between visits.

## Getting started

No build step and no dependencies to install.

1. Put `index.html` in a folder (optionally with `robots.txt` and this README).
2. Open `index.html` in a modern browser (Chrome, Edge, Safari or Firefox).

An internet connection is needed on first load for Tailwind CSS, html2canvas, jsPDF, Google Fonts and the sample photo.

## How to use

1. **Choose a theme.** Picking one also sets its matching font and photo frame.
2. **Add a photo** with *Upload image* and adjust the shape, filter and sliders.
3. **Fill in the details.** Untick any field you don't want on the card, and leave a field empty to hide it.
4. **Pick a paper size** and, for print, tick *Add 3 mm print bleed*.
5. **Download** the PDF or PNG, or build a multi-style pack in *Card Pack*.

## Tech stack

| Purpose | Library |
| --- | --- |
| Styling | [Tailwind CSS](https://tailwindcss.com) (Play CDN) |
| Image export | [html2canvas](https://html2canvas.hertzen.com) 1.4.1 |
| PDF export | [jsPDF](https://github.com/parallax/jsPDF) 2.5.1 |
| Fonts | Google Fonts |

## Project structure

```
index.html   the entire app (HTML, CSS and JavaScript)
robots.txt   crawler rules
README.md    this file
```

## Deployment

Upload the files to any static host (GitHub Pages, Netlify, Cloudflare Pages, Vercel or plain web hosting). Keep `robots.txt` at the site root. For a public production site, consider compiling Tailwind instead of using the Play CDN.

## Privacy

Photos and details are processed locally in your browser and are never sent to a server. Settings and saved templates are stored in your browser's `localStorage`; the photo itself is not stored. Google Fonts, the CDN libraries and the sample photo are fetched from their own servers when the page loads.

## Known limitations

- The bleed option extends the background colour on export. It is not a true vector bleed with crop marks outside the trim.
- html2canvas is a raster renderer, so PDFs are high-resolution images rather than vector text.
- Very large exports are capped in resolution to stay within mobile canvas limits.
- Uploaded photos are downscaled to 1600 px on their longest side before processing.

## Roadmap

- True print-ready vector PDF output.
- Import and export of projects as files.
- More themes and paper sizes.
