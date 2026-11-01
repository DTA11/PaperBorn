/* High-contrast visual flashcards: black/white patterns for newborn eyes. */
import { PATTERNS, PATTERN_OPTIONS, DEFAULT_PATTERNS, patternSVG } from './patterns.js';
import { theme } from '../../core/state.js';

const THEMES = {
  bw:   { name: 'Black & White',          desc: 'Highest contrast',        bg: '#ffffff', fg: '#000000', acc: '#000000', font: 'sans', frame: '' },
  bwr:  { name: 'Black, White & Red',     desc: 'Red accents for 3+ months', bg: '#ffffff', fg: '#000000', acc: '#e10600', font: 'sans', frame: '' },
  rw:   { name: 'Red & White',            desc: 'Easiest color to see first', bg: '#ffffff', fg: '#e10600', acc: '#e10600', font: 'sans', frame: '' },
  wb:   { name: 'White on Black',         desc: 'Inverted, dark cards',    bg: '#000000', fg: '#ffffff', acc: '#ffffff', font: 'sans', frame: '' },
  by:   { name: 'Black & Yellow',         desc: 'Bold and bright',         bg: '#ffd400', fg: '#000000', acc: '#000000', font: 'sans', frame: '' },
};

const LAYOUTS = { 1: [1, 1], 4: [2, 2], 6: [2, 3] };
const perPage = d => +d.layout || 4;
const chunk = (arr, n) => { const out = []; for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n)); return out.length ? out : [[]]; };

function template(e, t, f, dv, page) {
  const th = theme(), [cols, rows] = LAYOUTS[perPage(dv)] || LAYOUTS[4];
  const sel = (dv.patterns || []).filter(id => PATTERNS[id]);
  const cards = chunk(sel, cols * rows)[page] || [];
  if (!sel.length) return `<div class="m-auto text-center text-xl font-bold">Choose at least one pattern in the sidebar.</div>`;
  /* Cut lines as one SVG over the grid: html2canvas (PDF/PNG export) ignores CSS outline, but draws SVG exactly. */
  const lc = th.bg === '#000000' ? '#888' : '#9a9a9a';
  const lines = [];
  for (let c = 0; c <= cols; c++) lines.push(`<line x1="${c * 100 / cols}%" y1="0" x2="${c * 100 / cols}%" y2="100%"/>`);
  for (let r = 0; r <= rows; r++) lines.push(`<line x1="0" y1="${r * 100 / rows}%" x2="100%" y2="${r * 100 / rows}%"/>`);
  const cutSvg = t.crop ? `<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="${lc}" stroke-width="1.5" stroke-dasharray="7 5">${lines.join('')}</g></svg>` : '';
  const cells = Array.from({ length: cols * rows }, (_, i) => {
    const id = cards[i];
    if (!id) return `<div></div>`;
    const lab = t.footer ? `<div style="text-align:center;font-size:${cols === 1 ? 22 : 13}px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;padding-top:6px;height:${cols === 1 ? 40 : 26}px;box-sizing:border-box">${PATTERNS[id][0]}</div>` : '';
    return `<div style="display:flex;flex-direction:column;padding:${cols === 1 ? 28 : 16}px;box-sizing:border-box;min-height:0;min-width:0"><div style="flex:1;min-height:0;display:flex;align-items:center;justify-content:center"><div class="ar-box" style="aspect-ratio:1/1;height:100%;max-width:100%">${patternSVG(id, th.fg, th.acc, th.bg)}</div></div>${lab}</div>`;
  }).join('');
  return `<div style="flex:1;min-height:0;position:relative;display:grid;grid-template-columns:repeat(${cols},minmax(0,1fr));grid-template-rows:repeat(${rows},minmax(0,1fr));gap:${t.crop ? 0 : 8}px">${cells}${cutSvg}</div>`;
}

export default {
  slug: 'flashcards', pinTitle: 'Newborn flashcards',
  name: 'High-Contrast Flashcards',
  fileName: d => `high-contrast-flashcards`,
  themes: THEMES,
  defaultTheme: 'bw',
  ui: { themeTitle: 'Colors' },
  formats: {
    a4:       { label: 'A4 (210×297 mm)',      w: 794, h: 1123, mm: [210, 297] },
    usletter: { label: 'US Letter (8.5×11 in)', w: 816, h: 1056, mm: [215.9, 279.4] },
    a5:       { label: 'A5 (148×210 mm)',      w: 559, h: 794,  mm: [148, 210] },
  },
  defaultFormat: 'a4',
  photo: false,
  pad: 30,
  chrome: { frame: false, crop: false },
  ornaments: [['crop', 'Cut lines'], ['footer', 'Pattern names under cards']],
  defaults: {
    toggles: { crop: true, footer: false, border: false },
    data: { patterns: DEFAULT_PATTERNS, layout: '4' },
  },
  sections: [{
    title: 'Cards',
    boxes: [
      { fields: [{ key: 'layout', type: 'select', label: 'Cards per page', options: [['1', '1 large card per page'], ['4', '4 cards per page (2×2)'], ['6', '6 cards per page (2×3)']] }] },
      { fields: [
        { key: 'patterns', type: 'multicheck', label: 'Patterns (tick the ones you want)', options: PATTERN_OPTIONS },
        { type: 'note', text: 'Tip: pick a multiple of the cards-per-page for tidy sheets. More than one page? Use the page arrows under the preview.' } ] },
    ],
  }],
  pack: {
    title: 'All Colors in One PDF',
    desc: 'One PDF with your cards in every color set you tick.',
    button: 'Download all colors (PDF)',
    options: Object.entries(THEMES).map(([id, th]) => [id, th.name]),
    apply(state, id) { state.theme = id; },
  },
  pageCount: (dv) => chunk((dv.patterns || []).filter(id => PATTERNS[id]), perPage(dv)).length,
  templates: Object.fromEntries(Object.keys(THEMES).map(id => [id, template])),
};
