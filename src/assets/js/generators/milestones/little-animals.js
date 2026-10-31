/* "Little Animals" milestone design: a soft watercolor number with a cute animal leaning on it.
   Everything is laid out in a 560×794 base box and scaled to the chosen paper size.
   The painted number is SVG (digit outlines from numerals.js, because the PNG/PDF export cannot use web fonts
   inside SVG); words are normal HTML text on top so they use the page's fonts. */
import { photoHTML } from '../../core/photo.js';
import { br } from '../../core/util.js';
import { DIGITS } from './numerals.js';
import { ANIMALS, animalFor } from '../../core/animals.js';

export const PALETTES = {
  blue: { name: 'Blue', num: ['#b9cfe6', '#94b3d6', '#7f9fc6'], spots: ['#cfe0f0', '#a7c1df', '#7f9fc7'], edge: '#6f93bf', wash: '#e3edf6', word: '#7f9cc2' },
  pink: { name: 'Pink', num: ['#f6d3db', '#eab0bd', '#da93a5'], spots: ['#f9e0e6', '#eeb9c5', '#d98a9d'], edge: '#cf7f93', wash: '#f9e7eb', word: '#cf8799' },
  sage: { name: 'Sage', num: ['#d3e3c7', '#adc8a0', '#90b081'], spots: ['#e2edd9', '#b8d1ab', '#86a776'], edge: '#7c9e6d', wash: '#e9f1e2', word: '#7f9f71' },
  sand: { name: 'Sand', num: ['#f0dcbb', '#ddbb8e', '#c9a06d'], spots: ['#f6e8d1', '#e3c59c', '#c19361'], edge: '#b98c58', wash: '#f5ebdb', word: '#b38c5c' },
};

const BASE_W = 560, BASE_H = 794, SCENE_TOP = 145, SCENE_BOT = 575, SCENE_H = SCENE_BOT - SCENE_TOP, CX = 280;
const isNum = s => /^\d{1,3}$/.test(String(s || '').trim());
const nice = s => { const v = String(s || '').trim(); return v === v.toUpperCase() ? v.charAt(0) + v.slice(1).toLowerCase() : v; };

/* Where everything goes for this paper size and these switches. All values in base units except s/ox/oy. */
function layout(f, t, e) {
  const s = Math.min(f.w / BASE_W, f.h / BASE_H), ox = (f.w - BASE_W * s) / 2, oy = (f.h - BASE_H * s) / 2;
  const line1 = (t.name && e.babyName) || (t.date && e.date);
  const stats = (t.weight && e.weight) || (t.height && e.height);
  const facts = t.facts && (e.loves || e.skill || e.fun);
  const T = 92 + (line1 ? 32 : 0) + (stats ? 26 : 0) + (t.note && e.note ? 50 : 0) + (facts ? 44 : 0);
  const P = t.photo ? 200 : 0;
  const textTop = BASE_H - 46 - T, sceneBot = textTop - 6;
  const roof = P ? 40 + P : 150;                                   // keep the sky (clouds, moon) clear without a photo
  const k = Math.max(.45, Math.min(1, (sceneBot - roof) / SCENE_H));
  return { s, ox, oy, k, sceneBot, textTop, P, line1, stats, facts };
}
const X = (L, x) => L.ox + x * L.s, Y = (L, y) => L.oy + y * L.s;
const scenePt = (L, x, y) => [CX + (x - CX) * L.k, L.sceneBot + (y - SCENE_BOT) * L.k];   // scene coords → base coords

/* The big number: digit outlines placed so its right edge sits just behind the animal. */
function numberShape(big) {
  const ds = String(big).trim().split('').map(c => DIGITS[c]);
  const em = ds.reduce((a, d) => a + d.w, 0) / 1000;
  const F = Math.min(470, (ds.length > 2 ? 300 : 330) / em), w = em * F, cx = Math.max(40 + w / 2, (ds.length > 1 ? 352 : 370) - w / 2);
  let x = cx - w / 2;
  const paths = ds.map(d => { const out = `<path transform="translate(${x.toFixed(1)} 545) scale(${(F / 1000).toFixed(4)})" d="${d.d}"/>`; x += d.w / 1000 * F; return out; }).join('');
  return { paths, cx, w };
}

const DECOR_DEFS = id => `
  <filter id="${id}wc" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="2" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="6" xChannelSelector="R" yChannelSelector="G"/></filter>
  <filter id="${id}bl" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14"/></filter>
  <filter id="${id}b2"><feGaussianBlur stdDeviation="2.5"/></filter>
  <filter id="${id}pp"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="3"/><feColorMatrix type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.38  0 0 0 0 0.3  0 0 0 0.06 0"/></filter>
  <path id="${id}sp" d="M0 -10 Q0 0 10 0 Q0 0 0 10 Q0 0 -10 0 Q0 0 0 -10Z"/>
  <g id="${id}cl"><ellipse cx="0" cy="22" rx="62" ry="7" fill="#dfe7ef" opacity=".7"/><path d="M-58 14 C-70 14 -72 -6 -54 -8 C-54 -26 -30 -32 -20 -18 C-14 -40 22 -42 26 -16 C40 -26 62 -14 54 4 C68 6 66 20 54 20 L-50 20 C-60 20 -64 14 -58 14Z" fill="#fff" stroke="#d6e1ec" stroke-width="2"/></g>
  <g id="${id}tf" fill="none" stroke-linecap="round"><path d="M0 0 C-2 -14 -8 -22 -14 -26" stroke="#8fb283" stroke-width="3"/><path d="M2 0 C2 -16 4 -26 2 -34" stroke="#a3c495" stroke-width="3"/><path d="M4 0 C8 -12 14 -18 20 -20" stroke="#7fa673" stroke-width="3"/><path d="M-4 0 C-8 -8 -16 -12 -22 -12" stroke="#a9c79b" stroke-width="2.5"/></g>
  <g id="${id}lf"><path d="M0 0 C6 -14 22 -18 30 -16 C26 -6 14 4 0 0Z" fill="#a7c39a"/><path d="M0 0 C10 -6 18 -10 28 -15" stroke="#86a77a" stroke-width="1.2" fill="none"/></g>
  <g id="${id}fl"><g fill="#f6c6cf"><circle cx="0" cy="-5" r="4.2"/><circle cx="4.8" cy="-1.5" r="4.2"/><circle cx="3" cy="4" r="4.2"/><circle cx="-3" cy="4" r="4.2"/><circle cx="-4.8" cy="-1.5" r="4.2"/></g><circle r="2.6" fill="#f2c96a"/></g>`;

function decor(pal, t, f, e, dv) {
  const P = PALETTES[pal], L = layout(f, t, e), id = `la${pal}`;
  const big = isNum(e.big) ? numberShape(e.big) : null;
  const ncx = big ? big.cx : 210;
  const animal = ANIMALS[animalFor(dv.animal, dv.milestone)];
  const sky = t.accents ? `
    ${t.photo ? '' : `<g transform="translate(452 96)"><path d="M0 -26 A26 26 0 1 0 22 14 A20 20 0 1 1 0 -26Z" fill="#f1d38e" filter="url(#${id}wc)"/></g>`}
    <use href="#${id}cl" transform="translate(${t.photo ? 92 : 128} ${t.photo ? 110 : 132}) scale(${t.photo ? .7 : .9})"/>
    <use href="#${id}cl" transform="translate(${t.photo ? 478 : 470} ${t.photo ? 170 : 150}) scale(.62)"/>
    ${t.photo ? '' : `<use href="#${id}cl" transform="translate(300 76) scale(.45)" opacity=".85"/>`}
    <g fill="#e8c46c" opacity=".9"><use href="#${id}sp" transform="translate(70 230) scale(.8)"/><use href="#${id}sp" transform="translate(205 ${t.photo ? 60 : 108}) scale(.55)"/>
      <use href="#${id}sp" transform="translate(${t.photo ? 440 : 398} ${t.photo ? 64 : 70}) scale(.6)"/><use href="#${id}sp" transform="translate(505 245) scale(.75)"/></g>
    <g fill="#c9d8e8"><circle cx="160" cy="215" r="2.5"/><circle cx="430" cy="215" r="2"/><circle cx="60" cy="330" r="2"/><circle cx="512" cy="330" r="2.5"/></g>` : '';
  const ground = `
    <ellipse cx="300" cy="566" rx="210" ry="14" fill="#e9e1d2" opacity=".75" filter="url(#${id}wc)"/>
    ${t.accents ? `<ellipse cx="150" cy="560" rx="22" ry="13" fill="#dcd5c8"/><ellipse cx="144" cy="555" rx="8" ry="4" fill="#efe9de"/><ellipse cx="180" cy="566" rx="14" ry="9" fill="#d3cbbd"/><ellipse cx="505" cy="563" rx="16" ry="10" fill="#dcd5c8"/>
    <use href="#${id}tf" transform="translate(118 566)"/><use href="#${id}tf" transform="translate(212 568) scale(.8)"/><use href="#${id}tf" transform="translate(330 566) scale(.9)"/><use href="#${id}tf" transform="translate(482 568) scale(.85)"/>
    <use href="#${id}lf" transform="translate(92 568) rotate(-20)"/><use href="#${id}lf" transform="translate(470 566) scale(-1 1) rotate(-15)"/><use href="#${id}lf" transform="translate(236 570) rotate(-35) scale(.8)"/>
    <use href="#${id}fl" transform="translate(104 540)"/><use href="#${id}fl" transform="translate(222 548) scale(.8)"/><use href="#${id}fl" transform="translate(518 546) scale(.9)"/>` : ''}`;
  const number = big ? `
    <clipPath id="${id}nc">${big.paths}</clipPath>
    <g filter="url(#${id}wc)"><g clip-path="url(#${id}nc)">
      <linearGradient id="${id}ng" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="${P.num[0]}"/><stop offset=".55" stop-color="${P.num[1]}"/><stop offset="1" stop-color="${P.num[2]}"/></linearGradient>
      <rect x="20" y="150" width="520" height="420" fill="url(#${id}ng)"/>
      <g filter="url(#${id}bl)" transform="translate(${(ncx - 252).toFixed(1)} 0)">
        <ellipse cx="190" cy="250" rx="70" ry="40" fill="${P.spots[0]}" opacity=".75"/><ellipse cx="320" cy="300" rx="60" ry="80" fill="${P.spots[1]}" opacity=".55"/>
        <ellipse cx="230" cy="430" rx="80" ry="45" fill="${P.spots[0]}" opacity=".6"/><ellipse cx="330" cy="500" rx="70" ry="40" fill="${P.spots[2]}" opacity=".45"/><ellipse cx="150" cy="470" rx="50" ry="30" fill="${P.spots[2]}" opacity=".5"/></g>
      <g fill="none" stroke="${P.edge}" stroke-width="9" opacity=".35" filter="url(#${id}b2)">${big.paths}</g>
    </g></g>` : '';
  const scene = `<g transform="translate(${CX} ${L.sceneBot}) scale(${L.k.toFixed(4)}) translate(${-CX} ${-SCENE_BOT})">
    <radialGradient id="${id}wa" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${P.wash}"/><stop offset=".75" stop-color="${P.wash}" stop-opacity=".7"/><stop offset="1" stop-color="#f6f2ea" stop-opacity="0"/></radialGradient>
    <ellipse cx="${(ncx + 23).toFixed(1)}" cy="372" rx="215" ry="205" fill="url(#${id}wa)" filter="url(#${id}wc)"/>
    ${number}${ground}
    <g transform="translate(398 418)">${animal.svg(id + 'a')}</g></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${f.w} ${f.h}" width="${f.w}" height="${f.h}" style="position:absolute;left:0;top:0;pointer-events:none">
    <defs>${DECOR_DEFS(id)}</defs>
    <rect width="${f.w}" height="${f.h}" fill="#fbf7f0"/><rect width="${f.w}" height="${f.h}" filter="url(#${id}pp)"/>
    ${t.border ? `<rect x="${(f.w * .036).toFixed(1)}" y="${(f.w * .036).toFixed(1)}" width="${(f.w * .928).toFixed(1)}" height="${(f.h - f.w * .072).toFixed(1)}" rx="${(18 * L.s).toFixed(1)}" fill="none" stroke="#e4dccf" stroke-width="1.5"/>` : ''}
    <g transform="translate(${L.ox.toFixed(2)} ${L.oy.toFixed(2)}) scale(${L.s.toFixed(4)})">${sky}${scene}</g></svg>`;
}

function template(pal, e, t, f) {
  const P = PALETTES[pal], L = layout(f, t, e), s = L.s;   // absolute boxes ignore the engine's 12px content padding, so no offset is needed
  const px = v => (v * s).toFixed(1) + 'px';
  const parts = [];
  /* Big word in place of the number for "Hello" and custom words */
  if (!isNum(e.big) && e.big) {
    const [x, y] = scenePt(L, 178, 400), fs = Math.min(128, 440 / Math.max(3, String(e.big).length * .55)) * L.k;
    parts.push(`<div style="position:absolute;left:${X(L, x - 170)}px;width:${340 * s}px;top:${Y(L, y - fs * .7)}px;text-align:center;font-family:'Dancing Script',cursive;font-weight:700;font-size:${px(fs)};line-height:1.2;color:${P.word}">${e.big}</div>`);
  }
  if (t.photo) {
    const H = 170 * s, hMul = H / (f.photoH || 360);
    parts.push(`<div style="position:absolute;left:0;width:${f.w}px;top:${Y(L, 40)}px">${photoHTML(`border:${px(6)} solid #fff;box-shadow:0 0 0 ${px(2)} ${P.word}66, 0 ${px(8)} ${px(20)} rgba(0,0,0,.08);`, hMul)}</div>`);
  }
  const line = [t.name && e.babyName, t.date && e.date].filter(Boolean).join(' · ');
  const stats = [t.weight && e.weight, t.height && e.height].filter(Boolean).join(' · ');
  const facts = t.facts ? [['Loves', e.loves], ['New skill', e.skill], ['Fun fact', e.fun]].filter(r => r[1]) : [];
  parts.push(`<div style="position:absolute;left:${X(L, 40)}px;width:${480 * s}px;top:${Y(L, L.textTop)}px;text-align:center;color:#8f8476">
    <div style="font-family:'Dancing Script',cursive;font-weight:600;font-size:${px(74)};line-height:1.15;color:${P.word}">${nice(e.small)}</div>
    ${line ? `<div style="font-size:${px(16)};letter-spacing:.3em;text-transform:uppercase;font-weight:500;margin-top:${px(10)}">${line}</div>` : ''}
    ${stats ? `<div style="font-size:${px(13)};letter-spacing:.25em;text-transform:uppercase;margin-top:${px(8)};color:${P.word}">${stats}</div>` : ''}
    ${t.note && e.note ? `<div style="font-family:'Dancing Script',cursive;font-size:${px(21)};line-height:1.2;margin-top:${px(10)};color:#7d7266">${br(e.note)}</div>` : ''}
    ${facts.length ? `<div style="font-size:${px(12)};line-height:1.5;margin-top:${px(10)}">${facts.map(([l, v]) => `<span style="white-space:nowrap;margin:0 ${px(6)}"><span style="color:${P.word}">♥</span> ${l}: ${v}</span>`).join(' ')}</div>` : ''}
  </div>`);
  if (t.footer) parts.push(`<div style="position:absolute;left:0;width:${f.w}px;top:${Y(L, BASE_H - 40)}px;text-align:center;font-size:${px(8)};letter-spacing:.35em;text-transform:uppercase;color:#b8ad9e">Baby Card Printables</div>`);
  return `<div style="position:absolute;left:0;top:0;width:${f.w}px;height:${f.h}px">${parts.join('')}</div>`;
}

export const LA_THEMES = Object.fromEntries(Object.entries(PALETTES).map(([k, p]) => [`animals_${k}`, {
  name: `Little Animals · ${p.name}`, desc: 'Watercolor number & a cute animal', bg: '#fbf7f0', fg: '#6f655a', font: 'playful',
  shape: 'circle', filter: 'none', frame: '', pad: 0, fonts: ['script'], toggles: { photo: false, note: false, facts: false },
}]));
export const LA_TEMPLATES = Object.fromEntries(Object.keys(PALETTES).map(k => [`animals_${k}`, (e, t, f) => template(k, e, t, f)]));
export const LA_DECOR = Object.fromEntries(Object.keys(PALETTES).map(k => [`animals_${k}`, (t, f, e, dv) => decor(k, t, f, e, dv)]));
