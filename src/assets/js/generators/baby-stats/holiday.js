/* Holiday birth-card designs: Christmas · Little Animals, Christmas · Classic Red, New Year · Midnight Gold.
   A "greeting" choice switches the wording (Baby's First Christmas, Merry Christmas, Happy New Year...).
   Same rules as illustrated.js: pictures are SVG, words are HTML, inline styles only, sizes scale with the paper. */
import { U, fit, nice, photoAt, svgBox, full, footer, lowerBlock, animalOf } from './illustrated.js';
import { wcDefs, spark, dot, snowflake, xmasTree, gift, santaHat, wreath, burst, bow } from '../../core/art.js';
import { DIGITS } from '../milestones/numerals.js';

export const GREETINGS = [['auto', 'Matches the design'], ['first', 'Baby’s First Christmas'], ['merry', 'Merry Christmas'],
  ['newyear', 'Happy New Year'], ['both', 'Merry Christmas & Happy New Year'], ['season', 'Season’s Greetings']];

/* [small line, big script line, year]. Christmas uses this year (last year in January); New Year uses next year from October. */
function greeting(key, design) {
  const now = new Date(), m = now.getMonth(), y = now.getFullYear();
  const xmasY = String(m === 0 ? y - 1 : y), nyY = String(m >= 9 ? y + 1 : y);
  let k = key && key !== 'auto' ? key : (design === 'newyear' ? 'newyear' : 'first');
  if (design === 'newyear' && k !== 'both') k = 'newyear';   // the fireworks design always says New Year, even if a Christmas wording was picked earlier
  const all = { first: ['Baby’s First', 'Christmas', xmasY], merry: ['Wishing you a', 'Merry Christmas', xmasY], newyear: ['Happy', 'New Year', nyY],
    both: ['Merry Christmas &', 'Happy New Year', nyY], season: ['Warm', 'Season’s Greetings', xmasY] };
  return all[k] || all.first;
}

function heading(e, t, u, dv, design, c) {
  const [small, big, year] = greeting(dv.greeting, design), first = nice(e.firstName);
  const who = t.name && (e.firstName || e.lastName) ? [first, nice(e.lastName)].filter(Boolean).join(' ') : '';
  return `<div style="text-align:center">
    <div style="font-size:${(15 * u).toFixed(1)}px;letter-spacing:.36em;text-transform:uppercase;color:${c.kick}">${small}</div>
    <div style="font-family:'Dancing Script',cursive;font-weight:700;font-size:${fit(big, 112 * u, 10).toFixed(1)}px;line-height:1.08;color:${c.script}">${big}</div>
    <div style="font-size:${(15 * u).toFixed(1)}px;letter-spacing:.42em;color:${c.kick}">${year}</div>
    ${who ? `<div style="font-size:${fit(who, 22 * u, 18).toFixed(1)}px;letter-spacing:.32em;text-transform:uppercase;color:${c.name};margin-top:${(12 * u).toFixed(1)}px">${who}</div>` : ''}
    ${t.date && e.date ? `<div style="font-size:${(13 * u).toFixed(1)}px;letter-spacing:.24em;text-transform:uppercase;color:${c.soft};margin-top:${(4 * u).toFixed(1)}px">Born ${e.date}</div>` : ''}
  </div>`;
}
const frame = (D, u, ring, glow) => `border:${(6 * u).toFixed(1)}px solid ${ring};box-shadow:0 0 0 ${(2 * u).toFixed(1)}px ${glow},0 ${(8 * u).toFixed(1)}px ${(22 * u).toFixed(1)}px rgba(0,0,0,.14);`;
const snowField = (f, u, c, op, seed = 3) => {
  let o = '', s = seed;
  const r = () => (s = s * 16807 % 2147483647) / 2147483647;
  for (let i = 0; i < 26; i++) o += snowflake(r() * f.w, r() * f.h, (.6 + r() * .9) * u * 1.3, c, op * (.5 + r() * .5));
  for (let i = 0; i < 40; i++) o += dot(r() * f.w, r() * f.h, (1.2 + r() * 2) * u, c, op * .7);
  return o;
};

/* ---------- Christmas · Little Animals ---------- */
const XA = { kick: '#a8464e', script: '#b8343e', name: '#5b4b44', soft: '#8f8476', pill: '#f3ebe3', label: '#b26a6f', ink: '#5b4b44', accent: '#b8343e' };
function xaScene(f, t, dv, u, W) {
  const p = 'bsxa', ph = t.photo, D = Math.round(f.photoH * (ph ? .86 : .68)), an = animalOf(dv);
  const sc = ph ? D / 330 : D / 200, Hs = (ph ? D : 260 * sc) + 40 * u, gy = Hs - 14 * u;
  const pcx = ph ? W / 2 - D * .1 : W / 2, ax = ph ? pcx + D / 2 + 6 * sc : W / 2 + 18 * sc, ay = gy - 150 * sc;
  const tx = ph ? pcx - D / 2 - 16 * sc : W / 2 - 150 * sc;
  const back = `<defs>${wcDefs(p)}<radialGradient id="${p}s" cx=".5" cy=".3" r=".7"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e3edf4"/></radialGradient></defs>
    ${t.accents ? xmasTree(tx, gy - 6 * u, sc * 1.25) : ''}
    <ellipse cx="${(W / 2).toFixed(1)}" cy="${(gy + 2 * u).toFixed(1)}" rx="${Math.min(W * .48, D * 1.15 + 90 * sc).toFixed(1)}" ry="${(18 * u).toFixed(1)}" fill="url(#${p}s)" stroke="#d7e3ec" stroke-width="1.5" filter="url(#${p}w)"/>`;
  const front = `<g transform="translate(${ax.toFixed(1)} ${ay.toFixed(1)}) scale(${sc.toFixed(3)})">${an.svg(p + 'a')}${santaHat(-12)}</g>
    ${t.accents ? `${gift(ax + 82 * sc, gy + 4 * u, sc * 1.1, '#d9534f', '#f6e7b4')}${gift(ax + 122 * sc, gy + 4 * u, sc * .8, '#5f8f6b', '#f6e7b4', 34, 26)}` : ''}`;
  return `<div style="position:relative;width:${W.toFixed(1)}px;height:${Hs.toFixed(1)}px;margin:0 auto">${svgBox(W, Hs, back)}
    ${ph ? `<div style="position:absolute;left:${(pcx - D / 2).toFixed(1)}px;top:${(gy - D - 6 * u).toFixed(1)}px;width:${D}px;z-index:1">${photoAt(f, D, frame(D, u, '#fff', '#b8343e55'), 'padding-bottom:34%')}</div>` : ''}
    ${svgBox(W, Hs, front, 2)}</div>`;
}
const xmasAnimals = (e, t, f, dv) => {
  const u = U(f), W = f.w - 72 - (t.border ? 24 : 0);
  return `${heading(e, t, u, dv, 'xmas', XA)}
    <div style="margin:auto 0;padding:${(8 * u).toFixed(1)}px 0">${xaScene(f, t, dv, u, W)}</div>
    ${lowerBlock(e, t, u, { ...XA, script: XA.accent, pillLine: '' })}
    ${footer(e, t, 'Baby Card Printables · Christmas', '#bcae9f', u)}`;
};
const xmasAnimalsDecor = (t, f) => {
  const u = U(f), p = 'bsxad';
  return full(f, `<defs>${wcDefs(p)}<linearGradient id="${p}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef4f8"/><stop offset=".6" stop-color="#fbf8f3"/><stop offset="1" stop-color="#fbf8f3"/></linearGradient></defs>
    <rect width="${f.w}" height="${f.h}" fill="url(#${p}g)"/>${t.accents ? snowField(f, u, '#9fb9cc', .55) : ''}
    ${t.border ? `<rect x="${(18 * u).toFixed(1)}" y="${(18 * u).toFixed(1)}" width="${(f.w - 36 * u).toFixed(1)}" height="${(f.h - 36 * u).toFixed(1)}" rx="${(16 * u).toFixed(1)}" fill="none" stroke="#d9b9b4" stroke-width="1.5" stroke-dasharray="6 6"/>` : ''}`);
};

/* ---------- Christmas · Classic Red ---------- */
const XR = { kick: '#e9c46a', script: '#fbefdc', name: '#fbefdc', soft: '#f1d9c0', pill: 'rgba(255,255,255,.12)', label: '#e9c46a', ink: '#fbefdc', accent: '#fbefdc' };
function xrScene(f, t, u, W) {
  const p = 'bsxr', D = Math.round(f.photoH * .72), R = D / 2 + 22 * u, Hs = 2 * R + 70 * u, cx = W / 2, cy = R + 18 * u, s = u * 1.35;
  const art = `<defs>${wcDefs(p)}</defs>${wreath(cx, cy, R, s)}${wreath(cx, cy, R - 10 * u, s * .8, '#2f6343', '#4f8a5f')}
    ${t.photo ? '' : xmasTree(cx, cy + D * .38, D / 150)}
    ${bow(p, cx, cy + R + 4 * u, u * .9, '#e9c46a', '#b8892b')}`;
  return `<div style="position:relative;width:${W.toFixed(1)}px;height:${Hs.toFixed(1)}px;margin:0 auto">
    ${t.photo ? `<div style="position:absolute;left:${(cx - D / 2).toFixed(1)}px;top:${(cy - D / 2).toFixed(1)}px;width:${D}px">${photoAt(f, D, frame(D, u, '#fbefdc', '#e9c46a'))}</div>` : ''}
    ${svgBox(W, Hs, art, 2)}</div>`;
}
const xmasRed = (e, t, f, dv) => {
  const u = U(f), W = f.w - 72 - (t.border ? 24 : 0);
  return `${heading(e, t, u, dv, 'xmas', XR)}
    <div style="margin:auto 0;padding:${(8 * u).toFixed(1)}px 0">${xrScene(f, t, u, W)}</div>
    ${lowerBlock(e, t, u, { ...XR, script: XR.accent, pillLine: 'rgba(233,196,106,.45)' })}
    ${footer(e, t, 'Baby Card Printables · Christmas', '#d9a9a0', u)}`;
};
const xmasRedDecor = (t, f) => {
  const u = U(f), p = 'bsxrd';
  return full(f, `<defs><radialGradient id="${p}g" cx=".5" cy=".42" r=".75"><stop offset="0" stop-color="#a8243a"/><stop offset="1" stop-color="#6e1220"/></radialGradient></defs>
    <rect width="${f.w}" height="${f.h}" fill="url(#${p}g)"/>${t.accents ? snowField(f, u, '#fbefdc', .35, 11) : ''}
    ${t.border ? `<rect x="${(16 * u).toFixed(1)}" y="${(16 * u).toFixed(1)}" width="${(f.w - 32 * u).toFixed(1)}" height="${(f.h - 32 * u).toFixed(1)}" fill="none" stroke="#e9c46a" stroke-width="1.5"/>
      <rect x="${(22 * u).toFixed(1)}" y="${(22 * u).toFixed(1)}" width="${(f.w - 44 * u).toFixed(1)}" height="${(f.h - 44 * u).toFixed(1)}" fill="none" stroke="#e9c46a" stroke-opacity=".45" stroke-width="1"/>` : ''}`);
};

/* ---------- New Year · Midnight Gold ---------- */
const NY = { kick: '#e9c46a', script: '#f3d48a', name: '#f3ead6', soft: '#c9c3e0', pill: 'rgba(255,255,255,.08)', label: '#e9c46a', ink: '#f3ead6', accent: '#f3d48a' };
function yearOutline(year, cx, base, h) {
  const ds = year.split('').map(c => DIGITS[c]).filter(Boolean), k = h / 700, w = ds.reduce((a, d) => a + d.w, 0) * k;
  let x = cx - w / 2;
  return ds.map(d => { const o = `<path transform="translate(${x.toFixed(1)} ${base.toFixed(1)}) scale(${k.toFixed(4)})" d="${d.d}"/>`; x += d.w * k; return o; }).join('');
}
function nyScene(f, t, dv, u, W) {
  const p = 'bsny', D = Math.round(f.photoH * .74), Hs = D + 60 * u, cx = W / 2, cy = Hs / 2, year = greeting(dv.greeting, 'newyear')[2];
  const yw = year.split('').reduce((a, c) => a + (DIGITS[c] ? DIGITS[c].w : 0), 0) / 700;   // width per unit of height
  const yh = Math.min(Hs * (t.photo ? .62 : .8), W * .86 / yw);
  const back = (t.photo ? `<g fill="none" stroke="#e9c46a" stroke-opacity=".5" stroke-width="${(2.4 * u).toFixed(1)}">${yearOutline(year, cx, cy + yh / 2, yh)}</g>`
      : `<defs><linearGradient id="${p}y" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7e2a4"/><stop offset=".55" stop-color="#e9c46a"/><stop offset="1" stop-color="#b8892b"/></linearGradient></defs>
        <g fill="url(#${p}y)" stroke="#f7e2a4" stroke-width="1">${yearOutline(year, cx, cy + yh / 2, yh)}</g>`) + `
    ${t.accents ? `${burst(cx - D * .78, cy - D * .3, 46 * u, '#e9c46a')}${burst(cx + D * .8, cy - D * .38, 38 * u, '#f08fb0', .8)}${burst(cx + D * .7, cy + D * .36, 30 * u, '#7fd1c4', .75)}` : ''}`;
  const ring = `<circle cx="${cx}" cy="${cy}" r="${(D / 2 + 12 * u).toFixed(1)}" fill="none" stroke="#e9c46a" stroke-width="${(1.6 * u).toFixed(1)}"/>
    <circle cx="${cx}" cy="${cy}" r="${(D / 2 + 20 * u).toFixed(1)}" fill="none" stroke="#e9c46a" stroke-opacity=".45" stroke-width="1" stroke-dasharray="2 6"/>`;
  return `<div style="position:relative;width:${W.toFixed(1)}px;height:${Hs.toFixed(1)}px;margin:0 auto">${svgBox(W, Hs, back)}
    ${t.photo ? `<div style="position:absolute;left:${(cx - D / 2).toFixed(1)}px;top:${(cy - D / 2).toFixed(1)}px;width:${D}px;z-index:1">${photoAt(f, D, frame(D, u, '#101b3d', '#e9c46a'))}</div>` : ''}
    ${svgBox(W, Hs, (t.photo ? ring : '') + `<defs>${wcDefs(p)}</defs>`, 2)}</div>`;
}
const newYear = (e, t, f, dv) => {
  const u = U(f), W = f.w - 72 - (t.border ? 24 : 0);
  return `${heading(e, t, u, dv, 'newyear', NY)}
    <div style="margin:auto 0;padding:${(8 * u).toFixed(1)}px 0">${nyScene(f, t, dv, u, W)}</div>
    ${lowerBlock(e, t, u, { ...NY, script: NY.accent, pillLine: 'rgba(233,196,106,.4)' })}
    ${footer(e, t, 'Baby Card Printables · New Year', '#8f8ab0', u)}`;
};
const newYearDecor = (t, f) => {
  const u = U(f), p = 'bsnyd';
  let confetti = '', s = 5;
  const r = () => (s = s * 16807 % 2147483647) / 2147483647, cols = ['#e9c46a', '#f08fb0', '#7fd1c4', '#f3ead6'];
  if (t.accents) for (let i = 0; i < 70; i++) { const x = r() * f.w, y = r() * f.h, w = (3 + r() * 5) * u; confetti += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${(w * .45).toFixed(1)}" rx="1" fill="${cols[i % 4]}" opacity="${(.35 + r() * .45).toFixed(2)}" transform="rotate(${(r() * 180).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`; }
  return full(f, `<defs><linearGradient id="${p}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1330"/><stop offset=".6" stop-color="#172552"/><stop offset="1" stop-color="#231c4d"/></linearGradient></defs>
    <rect width="${f.w}" height="${f.h}" fill="url(#${p}g)"/>${confetti}
    ${t.accents ? [[60, 90, .8], [f.w / u - 70, 120, .7], [110, 560, .6], [f.w / u - 90, 620, .7]].map(([x, y, k]) => spark(x * u, y * u, k * u * 1.2, '#f3d48a')).join('') : ''}
    ${t.border ? `<rect x="${(16 * u).toFixed(1)}" y="${(16 * u).toFixed(1)}" width="${(f.w - 32 * u).toFixed(1)}" height="${(f.h - 32 * u).toFixed(1)}" fill="none" stroke="#e9c46a" stroke-opacity=".7" stroke-width="1.2"/>` : ''}`);
};

export const HOLIDAY_THEMES = {
  xmas_animals: { name: 'Christmas · Little Animals', desc: 'Santa hat, tree, gifts & snow', bg: '#fbf8f3', fg: '#5b4b44', font: 'playful', shape: 'circle', filter: 'none', frame: '', pad: 36, fonts: ['script'] },
  xmas_red:     { name: 'Christmas · Classic Red', desc: 'Wreath, gold bow & falling snow', bg: '#8f1d2c', fg: '#fbefdc', font: 'serif', shape: 'circle', filter: 'warm', frame: '', pad: 36, fonts: ['script'] },
  newyear:      { name: 'New Year · Midnight Gold', desc: 'Fireworks, confetti & the new year', bg: '#101b3d', fg: '#f3ead6', font: 'serif', shape: 'circle', filter: 'none', frame: '', pad: 36, fonts: ['script'] },
};
export const HOLIDAY_TEMPLATES = { xmas_animals: xmasAnimals, xmas_red: xmasRed, newyear: newYear };
export const HOLIDAY_DECOR = { xmas_animals: xmasAnimalsDecor, xmas_red: xmasRedDecor, newyear: newYearDecor };
