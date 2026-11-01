/* Birthday cards: one layout per card type (invitation, "one year" poster, thank-you card), dressed by seven designs.
   Each design gives a palette, a picture ("scene") and a background. Pictures are SVG; all words are HTML so they keep
   the page fonts in downloads. Sizes scale with the paper (u = 1 on A4). Inline styles only. */
import { ANIMALS } from '../../core/animals.js';
import { wcDefs, cloud, spark, dot, balloon, rainbowArch, ground, sprig } from '../../core/art.js';
import { photoHTML } from '../../core/photo.js';
import { partyHat, bunting, confetti, paintedNumber, cake } from './art.js';
import { numStyle } from '../../core/numbers.js';

const U = f => Math.min(f.w / 794, f.h / 1123);
const px = v => v.toFixed(1) + 'px';
const fit = (s, base, chars) => base * Math.min(1, chars / Math.max(String(s || '').length, 1));
const cap1 = w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
const nice = s => { const v = String(s || '').trim(), bare = v.replace(/&\w+;/g, ''); return v && bare === bare.toUpperCase() ? v.split(/(\s+|-)/).map(w => /\w/.test(w) ? cap1(w) : w).join('') : v; };
const svgBox = (w, h, inner, z = 0) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w.toFixed(1)} ${h.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" style="position:absolute;left:0;top:0;pointer-events:none;z-index:${z}">${inner}</svg>`;
const full = (f, inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${f.w} ${f.h}" width="${f.w}" height="${f.h}" style="position:absolute;left:0;top:0;pointer-events:none">${inner}</svg>`;
const SCRIPT = "'Dancing Script',cursive";

/* ---------- Designs ---------- */
const ANIMAL_PAL = {
  pink: { name: 'Pink', bg: '#fbf7f0', ink: '#6f5560', soft: '#8f8476', accent: '#cf8799', label: '#d495a5', pill: '#f9ecef', line: '#efc9d2',
    num: ['#f6d3db', '#eab0bd', '#da93a5'], edge: '#cf7f93', wash: '#f9e7eb', flags: ['#f6c6cf', '#f8e3b5', '#cfe0f0', '#d9e8cf'], hat: ['#f6c6cf', '#d98a9d'], conf: ['#f2b8c4', '#f3d38e', '#b9d0e8', '#c7dcb9'] },
  blue: { name: 'Blue', bg: '#fbf7f0', ink: '#5b6676', soft: '#8f8476', accent: '#7f9cc2', label: '#8aa6c8', pill: '#eaf1f8', line: '#c9d8ea',
    num: ['#b9cfe6', '#94b3d6', '#7f9fc6'], edge: '#6f93bf', wash: '#e3edf6', flags: ['#b9cfe6', '#f8e3b5', '#f6c6cf', '#d9e8cf'], hat: ['#b9cfe6', '#7f9fc6'], conf: ['#a9c3e2', '#f3d38e', '#f2b8c4', '#c7dcb9'] },
  sage: { name: 'Sage', bg: '#fbf7f0', ink: '#5d6656', soft: '#8f8476', accent: '#7f9f71', label: '#94ad86', pill: '#eef4e8', line: '#cfdfc5',
    num: ['#d3e3c7', '#adc8a0', '#90b081'], edge: '#7c9e6d', wash: '#e9f1e2', flags: ['#c7dcb9', '#f8e3b5', '#f6d3c4', '#e9e1d2'], hat: ['#c7dcb9', '#86a776'], conf: ['#b8d1ab', '#f3d38e', '#f2c2b0', '#e2d6c0'] },
};
const BAL = { bg: '#fdfaf5', ink: '#56606e', soft: '#8b8378', accent: '#6f8fb5', label: '#8aa3c2', pill: '#eef3f8', line: '#cddbea',
  colors: [['#c4d7ea', '#8fadd0'], ['#f6ead6', '#dcc6a2'], ['#a9c1df', '#6f93bf'], ['#d9e6cf', '#a8c096'], ['#f6d9de', '#e0a9b4']] };
const CAKE = { bg: '#fff7f4', ink: '#6b4f57', soft: '#8f7b78', accent: '#d9798f', label: '#de97a8', pill: '#fdebef', line: '#f3c9d3',
  cake: ['#fde2e7', '#f3bccb'], cake2: ['#e3f1ea', '#bcdccc'], icing: '#fffaf3', dots: '#f5b8c6', stand: ['#f3e7da', '#d9c6b1'], candle: '#8ec1ae',
  sprinkles: ['#f39bb0', '#f6cf6c', '#8ec1ae', '#9fb9e3'], flags: ['#f6c6cf', '#cfe8dd', '#f8e3b5', '#d6e2f5'], conf: ['#f39bb0', '#f6cf6c', '#8ec1ae', '#9fb9e3'] };
const POP = { bg: '#fffdf8', ink: '#2b2d42', soft: '#5d6075', accent: '#ef476f', label: '#118ab2', pill: '#fff1d6', line: '#ffd166',
  letters: ['#ef476f', '#ffb703', '#06d6a0', '#118ab2', '#8e7dbe'], conf: ['#ef476f', '#ffd166', '#06d6a0', '#118ab2', '#8e7dbe', '#ff9f68'] };
const RB = { bg: '#f6eee4', ink: '#5a3a2a', soft: '#8a6f5d', accent: '#b9633f', label: '#c08a5c', pill: '#fbf4ea', line: '#e2c9ad',
  bands: ['#c46a46', '#e0a458', '#e7b9a5', '#d9c3a3', '#a7b494'], num: ['#e7b48f', '#d48a5f', '#b9633f'], edge: '#a4512f' };

export const THEMES = {
  animals: { name: 'Party Animals', desc: 'Painted number & an animal in a party hat', bg: '#fbf7f0', fg: '#6f5560', font: 'playful', pad: 0, fonts: ['script'], shape: 'circle', filter: 'none', frame: '',
    colors: Object.fromEntries(Object.entries(ANIMAL_PAL).map(([k, P]) => [k, { name: P.name, dot: P.num[1], fg: P.ink }])) },
  balloons: { name: 'Balloon Party', desc: 'Watercolor balloons & a teddy', bg: BAL.bg, fg: BAL.ink, font: 'playful', pad: 0, fonts: ['script'], shape: 'circle', filter: 'none', frame: '' },
  cake:     { name: 'Birthday Cake', desc: 'Pastel cake with a number candle', bg: CAKE.bg, fg: CAKE.ink, font: 'playful', pad: 0, fonts: ['script'], shape: 'circle', filter: 'none', frame: '' },
  confetti: { name: 'Confetti Pop', desc: 'Bright letters & confetti', bg: POP.bg, fg: POP.ink, font: 'playful', pad: 0, fonts: ['script'], shape: 'circle', filter: 'none', frame: '' },
  rainbow:  { name: 'Boho Rainbow', desc: 'Terracotta rainbow & sprigs', bg: RB.bg, fg: RB.ink, font: 'serif', pad: 0, fonts: ['script'], shape: 'circle', filter: 'warm', frame: '' },
};
const PAL = (id, dv) => id === 'animals' ? (ANIMAL_PAL[dv && dv.color] || ANIMAL_PAL.pink) : { balloons: BAL, cake: CAKE, confetti: POP, rainbow: RB }[id];
const hasBunting = id => id === 'animals' || id === 'cake';

/* ---------- Pictures. Each draws into a W×H box; `small` is the cut-down version that sits beside a photo. ---------- */
function animalsScene(p, P, W, H, dv) {
  const BW = 520, BH = 400, k = Math.min(W / BW, H / BH), ox = (W - BW * k) / 2, oy = H - BH * k;
  const an = ANIMALS[dv.animal] || ANIMALS.elephant, num = paintedNumber(p + 'n', dv.ageNum, 0, 0, 300, P.num, P.edge, p + 'w', numStyle(dv, 'smooth'));
  const nx = Math.max(20, 312 - num.w);
  const art = `<defs>${wcDefs(p)}<radialGradient id="${p}wa" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${P.wash}"/><stop offset=".7" stop-color="${P.wash}" stop-opacity=".7"/><stop offset="1" stop-color="${P.wash}" stop-opacity="0"/></radialGradient></defs>
    <g transform="translate(${ox.toFixed(1)} ${oy.toFixed(1)}) scale(${k.toFixed(4)})">
      <ellipse cx="270" cy="230" rx="230" ry="190" fill="url(#${p}wa)" filter="url(#${p}w)"/>
      <g transform="translate(${nx.toFixed(1)} 382)">${num.svg}</g>
      ${ground(p, 270, 384, 440, { flowers: P.flags[0] })}
      <g transform="translate(392 228) scale(1.12)">${an.svg(p + 'a')}<g transform="${an.hatAt || 'translate(0 8)'}">${partyHat(p + 'h', P.hat[0], P.hat[1])}</g></g></g>`;
  return svgBox(W, H, art);
}
const animalsSmall = (p, P, s, dv) => { const an = ANIMALS[dv.animal] || ANIMALS.elephant; return `<g transform="scale(${s})">${an.svg(p + 'a')}<g transform="${an.hatAt || 'translate(0 8)'}">${partyHat(p + 'h', P.hat[0], P.hat[1])}</g></g>`; };

function balloonsSet(p, cx, top, R, numStr, bear, bearS, gy, style = 'smooth') {
  const spots = [[-1.25, .55, .9], [-.45, .1, 1.05], [.55, 0, 1.25], [1.3, .5, .92], [.1, .95, .85]];
  const hand = bear ? [cx + 46 * bearS, gy - 150 * bearS + 88 * bearS] : [cx, top + R * 5];
  const bs = spots.map(([nx, ny, k], i) => balloon(p, i, cx + nx * R * 1.15, top + R * k + ny * R, R * k, ...BAL.colors[i]));
  const big = bs[2], D = numStr ? paintedNumber(p + 'bn', numStr, 0, 0, R * 1.05, ['#ffffff', '#f7faff', '#eef3fb'], '#6f93bf', p + 'w', style) : null;
  const strings = bs.map(b => `<path d="M${b.knot[0].toFixed(1)} ${b.knot[1].toFixed(1)} C${(b.knot[0] + 8).toFixed(1)} ${((b.knot[1] + hand[1]) / 2).toFixed(1)} ${(hand[0] - 12).toFixed(1)} ${(hand[1] - 30).toFixed(1)} ${hand[0].toFixed(1)} ${hand[1].toFixed(1)}" fill="none" stroke="#a89b8a" stroke-width="1.3"/>`).join('');
  const bx = spots[2][0] * R * 1.15 + cx, by = top + R * 1.25;
  /* The balloon with the number is drawn last, so no other balloon covers the number */
  const order = [0, 1, 3, 4, 2].map(i => bs[i].svg).join('');
  return `<defs>${bs.map(b => b.defs).join('')}</defs>${strings}${order}
    ${D ? `<g opacity=".95" transform="translate(${(bx - D.w / 2).toFixed(1)} ${(by + R * .5).toFixed(1)})">${D.svg}</g>` : ''}
    ${bear ? `<g transform="translate(${cx.toFixed(1)} ${(gy - 150 * bearS).toFixed(1)}) scale(${bearS.toFixed(3)})">${ANIMALS.bear.svg(p + 'a')}</g>
      <circle cx="${hand[0].toFixed(1)}" cy="${hand[1].toFixed(1)}" r="${(9 * bearS).toFixed(1)}" fill="#c69a6e" stroke="#9c7350" stroke-width="1.2"/>` : ''}`;
}
function balloonsScene(p, P, W, H, dv) {
  const BW = 520, BH = 420, k = Math.min(W / BW, H / BH), ox = (W - BW * k) / 2, oy = H - BH * k;
  return svgBox(W, H, `<defs>${wcDefs(p)}</defs><g transform="translate(${ox.toFixed(1)} ${oy.toFixed(1)}) scale(${k.toFixed(4)})">
    <ellipse cx="260" cy="404" rx="190" ry="13" fill="#eee6da" filter="url(#${p}w)"/>
    ${balloonsSet(p, 260, 10, 62, dv.ageNum, true, 1.05, 402, numStyle(dv, 'smooth'))}</g>`);
}
const balloonsSmall = (p, P, s, dv) => `<g transform="scale(${s})">${balloonsSet(p, 0, -330, 50, dv.ageNum, false, 1, 0, numStyle(dv, 'smooth'))}</g>`;

function cakeScene(p, P, W, H, dv) {
  const s = Math.min(W / 330, H / 345);
  return svgBox(W, H, `<g transform="translate(${(W / 2).toFixed(1)} ${(H - 4).toFixed(1)})">${cake(p, s, CAKE, dv.ageNum, numStyle(dv, 'smooth'))}</g>`);
}
const cakeSmall = (p, P, s, dv) => cake(p, s, CAKE, dv.ageNum, numStyle(dv, 'smooth'));

function popScene(p, P, W, H, dv, u) {
  const word = dv.ageWord.toUpperCase(), fs = Math.min(H * .9, W / (word.length * .74));
  const letters = word.split('').map((c, i) => `<span style="color:${POP.letters[i % POP.letters.length]};display:inline-block;transform:rotate(${[-6, 4, -3, 5, -4][i % 5]}deg)">${c}</span>`).join('');
  return `<div style="position:absolute;left:0;top:0;width:${px(W)};height:${px(H)};display:flex;align-items:center;justify-content:center;font-family:'Fredoka',sans-serif;font-weight:700;font-size:${px(fs)};line-height:1;letter-spacing:.02em;text-shadow:0 ${px(6 * u)} 0 rgba(43,45,66,.12)">${letters}</div>`;
}

function rainbowScene(p, P, W, H, dv) {
  const BW = 520, BH = 330, k = Math.min(W / BW, H / BH), ox = (W - BW * k) / 2, oy = H - BH * k;
  const num = paintedNumber(p + 'n', dv.ageNum, 0, 0, 84, RB.num, RB.edge, p + 'w', numStyle(dv, 'smooth'));
  return svgBox(W, H, `<defs>${wcDefs(p)}</defs><g transform="translate(${ox.toFixed(1)} ${oy.toFixed(1)}) scale(${k.toFixed(4)})">
    ${rainbowArch(p, 260, 316, 240, 30, RB.bands)}
    <g transform="translate(${(260 - num.w / 2).toFixed(1)} 306)">${num.svg}</g>
    ${cloud(52, 296, 1.05, 1, '#fffaf3', '#e4d3bf', '#efe2d2')}${cloud(468, 296, 1.05, 1, '#fffaf3', '#e4d3bf', '#efe2d2')}</g>`);
}
const rainbowSmall = (p, P, s) => `<g transform="scale(${s})">${rainbowArch(p, 0, 0, 120, 16, RB.bands)}${cloud(-112, -6, .55, 1, '#fffaf3', '#e4d3bf', '#efe2d2')}${cloud(112, -6, .55, 1, '#fffaf3', '#e4d3bf', '#efe2d2')}</g>`;

/* The picture area: the design's scene, or the photo with a smaller version of the picture beside it. */
function picture(id, P, f, t, dv, W, H, u) {
  const p = `fb${id}${dv.color || ""}`;
  if (!t.photo) {
    if (id === 'animals') return animalsScene(p, P, W, H, dv);
    return { balloons: balloonsScene, cake: cakeScene, confetti: popScene, rainbow: rainbowScene }[id](p, P, W, H, dv, u);
  }
  const D = Math.round(Math.min(H * .92, W * .6)), cx = W / 2, top = (H - D) / 2;
  const ring = `border:${px(6 * u)} solid #fff;box-shadow:0 0 0 ${px(2 * u)} ${P.line},0 ${px(8 * u)} ${px(22 * u)} rgba(0,0,0,.08);`;
  const ph = `<div style="position:absolute;left:${px(cx - D / 2)};top:${px(top)};width:${D}px;z-index:1">${photoHTML(ring, D / (f.photoH || 360))}</div>`;
  let side = '';
  if (id === 'animals') side = svgBox(W, H, `<defs>${wcDefs(p)}</defs><g transform="translate(${(cx + D * .5).toFixed(1)} ${(top + D - 150 * D / 520).toFixed(1)})">${animalsSmall(p, P, D / 520, dv)}</g>`, 2);
  else if (id === 'balloons') side = svgBox(W, H, `<defs>${wcDefs(p)}</defs><g transform="translate(${(cx - D * .66).toFixed(1)} ${(top + D * .98).toFixed(1)})">${balloonsSmall(p, P, D / 480, dv)}</g>`, 2);
  else if (id === 'cake') side = svgBox(W, H, `<g transform="translate(${(cx + D * .52).toFixed(1)} ${(top + D).toFixed(1)})">${cakeSmall(p, P, D / 640, dv)}</g>`, 2);
  else if (id === 'rainbow') side = svgBox(W, H, `<g transform="translate(${cx.toFixed(1)} ${(top + D * .62).toFixed(1)})">${rainbowSmall(p, P, D / 190)}</g>`, 0);
  return `${side}${ph}`;
}

/* ---------- Words ---------- */
const kicker = (s, u, c) => s ? `<div style="font-size:${px(15 * u)};letter-spacing:.34em;text-transform:uppercase;color:${c}">${s}</div>` : '';
const nameLine = (name, u, c, base = 118) => name ? `<div style="font-family:${SCRIPT};font-weight:700;font-size:${px(fit(name, base * u, 7))};line-height:1.12;color:${c}">${name}</div>` : '';
const titleLine = (s, u, P, id) => `<div style="font-size:${px(fit(s, 40 * u, 16))};font-weight:${id === 'rainbow' ? 700 : 600};letter-spacing:.16em;text-transform:uppercase;color:${P.ink};line-height:1.15">${s}</div>`;

function inviteWords(e, t, u, P, id) {
  const first = nice(e.firstName);
  const top = `<div style="text-align:center">${kicker(e.inviteTop, u, P.label)}
    <div style="margin-top:${px(6 * u)}">${nameLine(first, u, P.accent)}</div>
    ${titleLine(`${e.ordWord} Birthday`, u, P, id)}</div>`;
  const when = [e.partyDate, e.partyTime].filter(Boolean);
  const bottom = `<div style="text-align:center;color:${P.ink}">
    ${when.length ? `<div style="font-size:${px(25 * u)};font-weight:600;line-height:1.3">${when[0]}</div>${when[1] ? `<div style="font-size:${px(21 * u)};margin-top:${px(2 * u)}">${when[1]}</div>` : ''}` : ''}
    ${e.place ? `<div style="font-size:${px(21 * u)};font-weight:600;margin-top:${px(12 * u)}">${e.place}</div>` : ''}
    ${e.address ? `<div style="font-size:${px(17 * u)};color:${P.soft};margin-top:${px(2 * u)}">${e.address}</div>` : ''}
    ${e.rsvp ? `<div style="display:inline-block;margin-top:${px(16 * u)};padding:${px(8 * u)} ${px(22 * u)};border-radius:${px(30 * u)};background:${P.pill};font-size:${px(16 * u)};letter-spacing:.06em;color:${P.ink}">${e.rsvp}</div>` : ''}
  </div>`;
  return { top, bottom, k: .42 };
}

function posterWords(e, t, u, P, id) {
  const first = nice(e.firstName);
  const top = `<div style="text-align:center">${kicker(`Happy ${e.ordShort} birthday`, u, P.label)}
    <div style="margin-top:${px(4 * u)}">${nameLine(first, u, P.accent, 112)}</div>
    ${e.born ? `<div style="font-size:${px(15 * u)};letter-spacing:.3em;text-transform:uppercase;color:${P.soft};margin-top:${px(4 * u)}">${e.born}</div>` : ''}</div>`;
  const col = (label, w, l) => (w || l) ? `<div style="flex:1;min-width:0;background:${P.pill};border-radius:${px(16 * u)};padding:${px(10 * u)} ${px(8 * u)};text-align:center">
      <div style="font-size:${px(11.5 * u)};letter-spacing:.26em;text-transform:uppercase;color:${P.label}">${label}</div>
      <div style="font-size:${px(22 * u)};font-weight:600;color:${P.ink};margin-top:${px(3 * u)};white-space:nowrap">${[w, l].filter(Boolean).join(' · ')}</div></div>` : '';
  const stats = t.stats ? [col('At birth', e.birthW, e.birthL), col(`At ${e.ageNum} year${e.ageNum === '1' ? '' : 's'}`, e.nowW, e.nowL)].filter(Boolean) : [];
  const facts = t.facts ? [['First word', e.firstWord], ['Favorite food', e.food], ['Favorite toy', e.toy], ['Favorite song', e.song], ['Teeth', e.teeth], ['I can', e.cando]].filter(r => r[1]) : [];
  const bottom = `<div style="color:${P.ink}">
    ${stats.length ? `<div style="display:flex;gap:${px(12 * u)};max-width:${px(560 * u)};margin:0 auto">${stats.join('')}</div>` : ''}
    ${facts.length ? `<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:${px(28 * u)};row-gap:${px(10 * u)};max-width:${px(600 * u)};margin:${px(16 * u)} auto 0">
      ${facts.map(([l, v]) => `<div style="min-width:0;border-bottom:1.5px dotted ${P.line};padding-bottom:${px(6 * u)}"><div style="font-size:${px(11 * u)};letter-spacing:.24em;text-transform:uppercase;color:${P.label}">${l}</div><div style="font-size:${px(19 * u)};font-weight:600;line-height:1.25;overflow-wrap:anywhere">${v}</div></div>`).join('')}</div>` : ''}
  </div>`;
  return { top, bottom, k: .33 };
}

function thanksWords(e, t, u, P, id) {
  const first = nice(e.firstName);
  const top = `<div style="text-align:center">
    <div style="font-family:${SCRIPT};font-weight:700;font-size:${px(112 * u)};line-height:1.1;color:${P.accent}">Thank you</div>
    <div style="font-size:${px(19 * u)};letter-spacing:.22em;text-transform:uppercase;color:${P.ink};margin-top:${px(6 * u)};line-height:1.5">for celebrating${first ? ` ${first}’s` : ' our'}<br>${e.ordShort} birthday</div></div>`;
  const bottom = `<div style="text-align:center;color:${P.ink}">
    ${e.message ? `<div style="font-size:${px(20 * u)};line-height:1.45;max-width:${px(560 * u)};margin:0 auto;color:${P.soft}">${e.message}</div>` : ''}
    ${e.from ? `<div style="font-family:${SCRIPT};font-weight:600;font-size:${px(38 * u)};color:${P.accent};margin-top:${px(10 * u)}">Love, ${nice(e.from)}</div>` : ''}</div>`;
  return { top, bottom, k: .42 };
}

const WORDS = { invite: inviteWords, poster: posterWords, thanks: thanksWords };

function template(id) {
  return (e, t, f, dv) => {
    const P = PAL(id, dv), u = U(f), side = 52 * u, topPad = (hasBunting(id) && t.accents ? 104 : 56) * u, botPad = 44 * u;
    const w = (WORDS[dv.card] || inviteWords)(e, t, u, P, id), W = f.w - side * 2;
    const H = Math.round(f.h * w.k * (f.h / f.w > 1.2 ? 1 : .8));
    return `<div style="position:relative;flex:1;min-height:0;display:flex;flex-direction:column;padding:${px(topPad)} ${px(side)} ${px(botPad)}">
      ${w.top}
      <div style="margin:auto 0;padding:${px(12 * u)} 0"><div style="position:relative;width:${px(W)};height:${px(H)}">${picture(id, P, f, t, dv, W, H, u)}</div></div>
      ${w.bottom}
      ${t.footer ? `<div style="text-align:center;font-size:${px(9 * u)};letter-spacing:.32em;text-transform:uppercase;color:${P.soft};opacity:.6;margin-top:${px(12 * u)}">Baby Card Printables</div>` : ''}
    </div>`;
  };
}

/* ---------- Backgrounds ---------- */
function decor(id) {
  return (t, f, e, dv) => {
    const P = PAL(id, dv), u = U(f), p = `fbd${id}`;
    const border = t.border ? `<rect x="${(16 * u).toFixed(1)}" y="${(16 * u).toFixed(1)}" width="${(f.w - 32 * u).toFixed(1)}" height="${(f.h - 32 * u).toFixed(1)}" rx="${(14 * u).toFixed(1)}" fill="none" stroke="${P.line}" stroke-width="1.5" stroke-dasharray="${id === 'confetti' ? '' : '6 6'}"/>` : '';
    let art = '';
    if (t.accents) {
      if (hasBunting(id)) art += bunting(-10, 10 * u, f.w + 10, 10 * u, 62 * u, Math.max(9, Math.round(f.w / (64 * u))), 40 * u, P.flags);
      if (id === 'animals' || id === 'balloons') {
        art += [[60, 300, .7], [f.w / u - 60, 340, .8], [80, 760, .5], [f.w / u - 70, 820, .6]].map(([x, y, s]) => spark(x * u, y * u, s * u, '#e8c46c')).join('');
        art += [[40, 520], [f.w / u - 40, 560], [150, 960], [f.w / u - 150, 980]].map(([x, y]) => dot(x * u, y * u, 2.6 * u, P.line)).join('');
      }
      if (id === 'balloons') art += cloud(f.w - 110 * u, 96 * u, .55 * u) + cloud(100 * u, 70 * u, .42 * u, .9);
      if (id === 'animals' || id === 'cake') art += confetti(f.w, f.h, 26, P.conf, 5, [[90 * u, 0, f.w - 180 * u, f.h]], u);
      if (id === 'confetti') art += confetti(f.w, f.h, 120, POP.conf, 9, [[46 * u, 60 * u, f.w - 92 * u, f.h - 120 * u]], 1.4 * u) + confetti(f.w, f.h * .3, 14, POP.conf, 4, [[46 * u, 0, f.w - 92 * u, f.h]], 1.1 * u);
      if (id === 'rainbow') art += sprig(14 * u, f.h - 10 * u, .5 * u, 40, '#a4836a', '#b9a58c') + sprig(f.w - 14 * u, f.h - 10 * u, .5 * u, -40, '#a4836a', '#b9a58c')
        + [[70, 120], [f.w / u - 70, 140], [50, 520], [f.w / u - 50, 560]].map(([x, y]) => dot(x * u, y * u, 3 * u, '#e0a458', .7)).join('');
    }
    return full(f, `<defs>${wcDefs(p)}</defs><rect width="${f.w}" height="${f.h}" fill="${P.bg}"/>${border}${art}`);
  };
}

export const TEMPLATES = Object.fromEntries(Object.keys(THEMES).map(id => [id, template(id)]));
export const DECOR = Object.fromEntries(Object.keys(THEMES).map(id => [id, decor(id)]));
