/* Illustrated birth card designs: Little Animals (blue, pink), Welcome Balloons, Bow & Dots (blue, pink), Sweet Elephants.
   Pictures are SVG (shared pieces in core/art.js, animals in core/animals.js); all words are HTML so they keep the
   page fonts in downloads. Sizes scale with the paper (u = 1 on A4). Inline styles only (the compiled Tailwind file
   only has classes that already exist in the project). */
import { photoHTML } from '../../core/photo.js';
import { ANIMALS } from '../../core/animals.js';
import { wcDefs, cloud, spark, dot, crescent, heart, ground, balloon, bow, scallopPath } from '../../core/art.js';

const U = f => Math.min(f.w / 794, f.h / 1123);
const fit = (s, base, chars) => base * Math.min(1, chars / Math.max(String(s || '').length, 1));
const cap1 = w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
const nice = s => { const v = String(s || '').trim(), bare = v.replace(/&\w+;/g, ''); return v && bare === bare.toUpperCase() ? v.split(/(\s+|-)/).map(w => /\w/.test(w) ? cap1(w) : w).join('') : v; };
const statList = (e, t) => [['Time', t.time && e.time], ['Weight', t.weight && e.weight], ['Length', t.height && e.height], ['Sign', t.zodiac && e.zodiac]].filter(r => r[1]);
const where = (e, t) => t.location ? [e.location, e.city].filter(Boolean).join(', ') : '';
const photoAt = (f, size, style = '') => photoHTML(style, size / (f.photoH || 360));       // '' when the photo is switched off
const svgBox = (w, h, inner, z = 0) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w.toFixed(1)} ${h.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" style="position:absolute;left:0;top:0;pointer-events:none;z-index:${z}">${inner}</svg>`;
const full = (f, inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${f.w} ${f.h}" width="${f.w}" height="${f.h}" style="position:absolute;left:0;top:0;pointer-events:none">${inner}</svg>`;
const animalOf = dv => ANIMALS[dv.animal] || ANIMALS.elephant;

function footer(e, t, label, color, u) {
  if (!(t.footer || (t.coords && e.coords))) return '';
  return `<div style="display:flex;justify-content:space-between;gap:8px;font-size:${(9.5 * u).toFixed(1)}px;letter-spacing:.22em;text-transform:uppercase;color:${color};padding-top:${(8 * u).toFixed(1)}px"><span>${t.footer ? label : ''}</span><span>${t.coords ? e.coords : ''}</span></div>`;
}
function pills(e, t, u, bg, label, ink, line = '') {
  const s = statList(e, t);
  return s.length ? `<div style="display:flex;justify-content:center;flex-wrap:wrap;gap:${(8 * u).toFixed(1)}px">${s.map(([l, v]) =>
    `<div style="background:${bg};${line ? `border:1px solid ${line};` : ''}border-radius:${(16 * u).toFixed(1)}px;padding:${(7 * u).toFixed(1)}px ${(16 * u).toFixed(1)}px;text-align:center;min-width:${(92 * u).toFixed(1)}px">
      <div style="font-size:${(10.5 * u).toFixed(1)}px;letter-spacing:.25em;text-transform:uppercase;color:${label}">${l}</div>
      <div style="font-size:${(19 * u).toFixed(1)}px;font-weight:600;color:${ink};white-space:nowrap">${v}</div></div>`).join('')}</div>` : '';
}
function nameBlock(e, t, u, { kicker, kickColor, script, last, date }) {
  const first = nice(e.firstName);
  return `<div style="text-align:center">
    ${kicker ? `<div style="font-size:${(14.5 * u).toFixed(1)}px;letter-spacing:.38em;text-transform:uppercase;color:${kickColor}">${kicker}</div>` : ''}
    ${t.name && (e.firstName || e.lastName) ? `<div style="font-family:'Dancing Script',cursive;font-weight:700;font-size:${fit(first, 124 * u, 7).toFixed(1)}px;line-height:1.1;color:${script};margin-top:${(4 * u).toFixed(1)}px">${first}</div>
      ${e.lastName ? `<div style="font-size:${fit(e.lastName, 22 * u, 12).toFixed(1)}px;letter-spacing:.42em;text-transform:uppercase;color:${last}">${e.lastName}</div>` : ''}` : ''}
    ${t.date && e.date ? `<div style="font-size:${(15 * u).toFixed(1)}px;letter-spacing:.3em;text-transform:uppercase;color:${date};margin-top:${(8 * u).toFixed(1)}px">${e.date}</div>` : ''}
  </div>`;
}
function lowerBlock(e, t, u, c) {
  const pl = where(e, t);
  return `<div style="text-align:center">
    ${pills(e, t, u, c.pill, c.label, c.ink, c.pillLine)}
    ${pl ? `<div style="font-size:${(16 * u).toFixed(1)}px;margin-top:${(12 * u).toFixed(1)}px;color:${c.soft}">${pl}</div>` : ''}
    ${t.parents && e.parents ? `<div style="font-family:'Dancing Script',cursive;font-weight:600;font-size:${(34 * u).toFixed(1)}px;line-height:1.2;color:${c.script};margin-top:${(6 * u).toFixed(1)}px">with love, ${nice(e.parents)}</div>` : ''}
    ${t.quote && e.quote ? `<div style="font-size:${(17 * u).toFixed(1)}px;font-style:italic;color:${c.soft};margin-top:${(4 * u).toFixed(1)}px">“${e.quote}”</div>` : ''}
  </div>`;
}
const dashedBorder = (f, c, u) => `<rect x="${(18 * u).toFixed(1)}" y="${(18 * u).toFixed(1)}" width="${(f.w - 36 * u).toFixed(1)}" height="${(f.h - 36 * u).toFixed(1)}" rx="${(16 * u).toFixed(1)}" fill="none" stroke="${c}" stroke-width="1.5" stroke-dasharray="6 6"/>`;

/* ---------- Little Animals (blue / pink) ---------- */
const LA = {
  blue: { accent: '#7f9cc2', wash: '#e3edf6', pill: '#eaf1f8', label: '#8aa6c8', ink: '#5b6676', soft: '#8f8476', flowers: '#f6c6cf' },
  pink: { accent: '#cf8799', wash: '#f9e7eb', pill: '#f9ecef', label: '#d495a5', ink: '#6f5560', soft: '#8f8476', flowers: '#f6c6cf' },
};
function laScene(p, P, f, t, dv, u, W) {
  const ph = t.photo, D = Math.round(f.photoH * (ph ? .9 : .7)), an = animalOf(dv);
  const sc = ph ? D / 330 : D / 200, Hs = ph ? D + 34 * u : 220 * sc + 18 * u, gy = Hs - 16 * u;
  const pcx = ph ? W / 2 - D * .14 : W / 2, ax = ph ? pcx + D / 2 + 8 * sc : W / 2, ay = gy - 150 * sc;
  const back = `<defs>${wcDefs(p)}<radialGradient id="${p}wa" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${P.wash}"/><stop offset=".7" stop-color="${P.wash}" stop-opacity=".7"/><stop offset="1" stop-color="${P.wash}" stop-opacity="0"/></radialGradient></defs>
    <ellipse cx="${(ph ? pcx + D * .1 : W / 2).toFixed(1)}" cy="${(Hs * .48).toFixed(1)}" rx="${(D * .82).toFixed(1)}" ry="${(Hs * .55).toFixed(1)}" fill="url(#${p}wa)" filter="url(#${p}w)"/>
    ${t.accents ? ground(p, W / 2, gy, Math.min(W * .92, D * 2.1 + 40), { flowers: P.flowers }) : `<ellipse cx="${W / 2}" cy="${gy}" rx="${(D * .9).toFixed(1)}" ry="${(12 * u).toFixed(1)}" fill="#e9e1d2" opacity=".75"/>`}`;
  const front = `<g transform="translate(${ax.toFixed(1)} ${ay.toFixed(1)}) scale(${sc.toFixed(3)})">${an.svg(p + 'a')}</g>`;
  return `<div style="position:relative;width:${W.toFixed(1)}px;height:${Hs.toFixed(1)}px;margin:0 auto">${svgBox(W, Hs, back)}
    ${ph ? `<div style="position:absolute;left:${(pcx - D / 2).toFixed(1)}px;top:${(gy - D - 4 * u).toFixed(1)}px;width:${D}px;z-index:1">${photoAt(f, D, `border:${(6 * u).toFixed(1)}px solid #fff;box-shadow:0 0 0 ${(2 * u).toFixed(1)}px ${P.accent}66,0 ${(8 * u).toFixed(1)}px ${(20 * u).toFixed(1)}px rgba(0,0,0,.08);`)}</div>` : ''}
    ${svgBox(W, Hs, front, 2)}</div>`;
}
const laTemplate = pal => (e, t, f, dv) => {
  const P = LA[pal], u = U(f), W = f.w - 72 - (t.border ? 24 : 0), p = `bsla${pal}`;
  return `${nameBlock(e, t, u, { kicker: 'Welcome to the world', kickColor: P.label, script: P.accent, last: P.ink, date: P.soft })}
    <div style="margin:auto 0;padding:${(10 * u).toFixed(1)}px 0">${laScene(p, P, f, t, dv, u, W)}</div>
    ${lowerBlock(e, t, u, { ...P, script: P.accent })}
    ${footer(e, t, 'Baby Card Printables · Little Animals', '#b8ad9e', u)}`;
};
const laDecor = pal => (t, f) => {
  const P = LA[pal], u = U(f), p = `bsld${pal}`, S = v => v * u;
  const sky = t.accents ? `${cloud(S(110), S(120), .9 * u)}${cloud(f.w - S(110), S(170), .62 * u)}${cloud(f.w * .55, S(70), .45 * u, .85)}
    ${crescent(f.w - S(96), S(86), 24 * u, '#f1d38e', `filter="url(#${p}w)"`)}
    ${[[70, 250, .8], [f.w / u - 60, 300, .7], [220, 80, .5], [f.w / u - 190, 64, .55], [60, 560, .5], [f.w / u - 50, 620, .6]].map(([x, y, s]) => spark(x * u, y * u, s * u, '#e8c46c')).join('')}
    ${[[160, 210], [f.w / u - 150, 240], [50, 420], [f.w / u - 40, 470]].map(([x, y]) => dot(x * u, y * u, 2.4 * u, '#c9d8e8')).join('')}` : '';
  return full(f, `<defs>${wcDefs(p)}</defs><rect width="${f.w}" height="${f.h}" fill="#fbf7f0"/>${t.border ? dashedBorder(f, '#e4dccf', u) : ''}${sky}`);
};

/* ---------- Welcome Balloons ---------- */
const BAL = { accent: '#6f8fb5', kraft: '#b08a62', pill: '#eef3f8', label: '#8aa3c2', ink: '#56606e', soft: '#8b8378',
  colors: [['#c4d7ea', '#8fadd0'], ['#f6ead6', '#dcc6a2'], ['#f6d9de', '#e0a9b4'], ['#d9e6cf', '#a8c096'], ['#b9cde4', '#7f9fc6']] };
function balloonScene(f, t, u, W) {
  const p = 'bsbal', ph = t.photo, D = Math.round(f.photoH * (ph ? .86 : .6)), bear = ANIMALS.bear;
  const sc = ph ? D / 360 : D / 230, Hs = ph ? D + 40 * u : 330 * sc + 20 * u, gy = Hs - 14 * u;
  const pcx = ph ? W / 2 + D * .16 : W / 2, bx = ph ? pcx - D / 2 - 22 * sc : W / 2, by = gy - 150 * sc;
  const hand = [bx + 46 * sc, by + 88 * sc], R = (ph ? D * .13 : D * .2);
  const spots = ph ? [[-.2, .2, 1], [.03, .08, 1.12], [-.01, .4, .9], [.21, .27, .96], [-.36, .4, .82]] : [[-.32, .18, 1], [0, .06, 1.12], [.3, .16, 1], [-.14, .36, .86], [.16, .36, .88]];
  const bs = spots.map(([dx, dy, k], i) => balloon(p, i, bx + dx * D * (ph ? 1 : 1.6), Math.max(R * k + 4, dy * Hs), R * k, ...BAL.colors[i]));
  const strings = bs.map(b => `<path d="M${b.knot[0].toFixed(1)} ${b.knot[1].toFixed(1)} C${(b.knot[0] + 10 * sc).toFixed(1)} ${((b.knot[1] + hand[1]) / 2).toFixed(1)} ${(hand[0] - 14 * sc).toFixed(1)} ${(hand[1] - 40 * sc).toFixed(1)} ${hand[0].toFixed(1)} ${hand[1].toFixed(1)}" fill="none" stroke="#a89b8a" stroke-width="1.3"/>`).join('');
  const back = `<defs>${wcDefs(p)}${bs.map(b => b.defs).join('')}</defs>
    <ellipse cx="${(W / 2).toFixed(1)}" cy="${gy}" rx="${(Math.min(W * .45, D * 1.05)).toFixed(1)}" ry="${(12 * u).toFixed(1)}" fill="#eee6da" filter="url(#${p}w)"/>
    ${strings}${bs.map(b => b.svg).join('')}`;
  const front = `<g transform="translate(${bx.toFixed(1)} ${by.toFixed(1)}) scale(${sc.toFixed(3)})">${bear.svg(p + 'a')}</g>
    <circle cx="${hand[0].toFixed(1)}" cy="${hand[1].toFixed(1)}" r="${(9 * sc).toFixed(1)}" fill="#c69a6e" stroke="#9c7350" stroke-width="1.2"/>`;
  return `<div style="position:relative;width:${W.toFixed(1)}px;height:${Hs.toFixed(1)}px;margin:0 auto">${svgBox(W, Hs, back)}
    ${ph ? `<div style="position:absolute;left:${(pcx - D / 2).toFixed(1)}px;top:${(gy - D - 6 * u).toFixed(1)}px;width:${D}px;z-index:1">${photoAt(f, D, `border:${(6 * u).toFixed(1)}px solid #fff;box-shadow:0 0 0 ${(1.5 * u).toFixed(1)}px ${BAL.kraft}88,0 ${(8 * u).toFixed(1)}px ${(22 * u).toFixed(1)}px rgba(0,0,0,.08);`)}</div>` : ''}
    ${svgBox(W, Hs, front, 2)}</div>`;
}
const balloonsTemplate = (e, t, f) => {
  const u = U(f), W = f.w - 72 - (t.border ? 24 : 0);
  return `${nameBlock(e, t, u, { kicker: 'Hello, little one', kickColor: BAL.kraft, script: BAL.accent, last: BAL.ink, date: BAL.soft })}
    <div style="margin:auto 0;padding:${(10 * u).toFixed(1)}px 0">${balloonScene(f, t, u, W)}</div>
    ${lowerBlock(e, t, u, { ...BAL, script: BAL.accent })}
    ${footer(e, t, 'Baby Card Printables · Welcome Balloons', '#b9ae9f', u)}`;
};
const balloonsDecor = (t, f) => {
  const u = U(f), p = 'bsbald';
  return full(f, `<defs>${wcDefs(p)}</defs><rect width="${f.w}" height="${f.h}" fill="#fdfaf5"/>
    ${t.border ? dashedBorder(f, '#e6dccd', u) : ''}
    ${t.accents ? `${cloud(f.w - 120 * u, 110 * u, .55 * u)}${cloud(110 * u, 90 * u, .45 * u, .9)}
      ${[[80, 230, .7], [f.w / u - 70, 260, .8], [f.w / u - 210, 70, .5], [240, 60, .5], [60, 640, .5], [f.w / u - 60, 700, .6]].map(([x, y, s]) => spark(x * u, y * u, s * u, '#d9b56c')).join('')}
      ${[[150, 200], [f.w / u - 150, 200], [40, 450], [f.w / u - 40, 500]].map(([x, y]) => dot(x * u, y * u, 2.4 * u, '#cfdae7')).join('')}` : ''}`);
};

/* ---------- Bow & Dots (blue / pink): scalloped oval on polka dots, with a ribbon ---------- */
const BOW = {
  blue: { bg: '#e4eef8', dots: '#c9dcef', ribbon: ['#a9c5e3', '#7fa3cc'], ink: '#5c6f87', script: '#6f8fb8', line: '#b9cde4' },
  pink: { bg: '#f8e7eb', dots: '#f0cdd6', ribbon: ['#f2c1cc', '#d98ea0'], ink: '#86606b', script: '#c9798d', line: '#ecc3cd' },
};
const bowGeo = f => { const u = U(f), cx = f.w / 2, cy = f.h * .53, rx = f.w * .41, ry = Math.min(f.h * .42, f.h * .53 - 40 * u); return { u, cx, cy, rx, ry, s: Math.min(f.w / 794, f.h / 1000) * 1.4 }; };
const bowTemplate = pal => (e, t, f) => {
  const P = BOW[pal], g = bowGeo(f), u = g.u, top = g.cy - g.ry + 118 * g.s, bot = g.cy + g.ry - 78 * u, H = bot - top;
  const first = nice(e.firstName), D = Math.round(Math.min(f.photoH * .56, H * .27));
  const s = statList(e, t).map(r => r[1]), pl = where(e, t);
  const rule = `<div style="width:${(120 * u).toFixed(1)}px;margin:${(10 * u).toFixed(1)}px auto;border-top:2px dotted ${P.line}"></div>`;
  return `<div style="position:absolute;left:${(g.cx - g.rx * .78).toFixed(1)}px;width:${(g.rx * 1.56).toFixed(1)}px;top:${top.toFixed(1)}px;height:${H.toFixed(1)}px;display:flex;flex-direction:column;justify-content:space-evenly;align-items:center;text-align:center;color:${P.ink}">
    ${t.photo ? `<div style="width:${D}px;margin-bottom:${(10 * u).toFixed(1)}px">${photoAt(f, D, `border:${(5 * u).toFixed(1)}px solid #fff;box-shadow:0 0 0 ${(2 * u).toFixed(1)}px ${P.line};`)}</div>` : ''}
    ${t.date && e.date ? `<div style="font-size:${(16 * u).toFixed(1)}px;letter-spacing:.22em">${e.date}${t.time && e.time ? ' · ' + e.time : ''}</div>` : ''}
    <div style="font-size:${(34 * u).toFixed(1)}px;letter-spacing:.14em;text-transform:uppercase;line-height:1.15">Welcome to<br>the world</div>
    ${t.name && (e.firstName || e.lastName) ? `<div style="font-family:'Dancing Script',cursive;font-weight:700;font-size:${fit(first, 116 * u, 7).toFixed(1)}px;line-height:1.05;color:${P.script}">${first}</div>
      ${e.lastName ? `<div style="font-size:${fit(e.lastName, 19 * u, 12).toFixed(1)}px;letter-spacing:.4em;text-transform:uppercase">${e.lastName}</div>` : ''}` : ''}
    ${t.quote && e.quote ? `<div style="font-style:italic;font-size:${(20 * u).toFixed(1)}px;line-height:1.35;max-width:${(g.rx * 1.2).toFixed(1)}px;margin-top:${(8 * u).toFixed(1)}px">${e.quote}</div>` : ''}
    ${rule}
    ${s.length ? `<div style="font-size:${(15 * u).toFixed(1)}px;letter-spacing:.22em;text-transform:uppercase">${s.filter(v => v !== (t.time && e.time)).join(' · ')}</div>` : ''}
    ${pl ? `<div style="font-size:${(15 * u).toFixed(1)}px;margin-top:${(4 * u).toFixed(1)}px">${pl}</div>` : ''}
    ${t.parents && e.parents ? `<div style="font-family:'Dancing Script',cursive;font-weight:600;font-size:${(32 * u).toFixed(1)}px;color:${P.script}">with love, ${nice(e.parents)}</div>` : ''}
  </div>
  ${(t.footer || (t.coords && e.coords)) ? `<div style="position:absolute;left:0;width:${f.w}px;top:${(f.h - 30 * u).toFixed(1)}px;text-align:center;font-size:${(9 * u).toFixed(1)}px;letter-spacing:.3em;text-transform:uppercase;color:${P.ink};opacity:.7">${[t.footer ? 'Baby Card Printables' : '', t.coords ? e.coords : ''].filter(Boolean).join(' · ')}</div>` : ''}`;
};
const bowDecor = pal => (t, f) => {
  const P = BOW[pal], g = bowGeo(f), p = `bsbow${pal}`, step = 34 * g.u;
  return full(f, `<defs>${wcDefs(p)}<pattern id="${p}pd" width="${step.toFixed(1)}" height="${step.toFixed(1)}" patternUnits="userSpaceOnUse">
      <circle cx="${(step / 4).toFixed(1)}" cy="${(step / 4).toFixed(1)}" r="${(4.2 * g.u).toFixed(1)}" fill="${P.dots}"/><circle cx="${(step * .75).toFixed(1)}" cy="${(step * .75).toFixed(1)}" r="${(4.2 * g.u).toFixed(1)}" fill="${P.dots}"/></pattern></defs>
    <rect width="${f.w}" height="${f.h}" fill="${P.bg}"/>${t.accents ? `<rect width="${f.w}" height="${f.h}" fill="url(#${p}pd)"/>` : ''}
    <path d="${scallopPath(g.cx, g.cy + 6 * g.u, g.rx, g.ry)}" fill="${P.ribbon[1]}" opacity=".12"/>
    <path d="${scallopPath(g.cx, g.cy, g.rx, g.ry)}" fill="#fff" stroke="${P.ribbon[0]}" stroke-width="2.2"/>
    ${t.border ? `<ellipse cx="${g.cx}" cy="${g.cy}" rx="${(g.rx - 22 * g.u).toFixed(1)}" ry="${(g.ry - 22 * g.u).toFixed(1)}" fill="none" stroke="${P.line}" stroke-width="1.6" stroke-dasharray="2 7" stroke-linecap="round"/>` : ''}
    ${bow(p, g.cx, g.cy - g.ry + 10 * g.u, g.s, ...P.ribbon)}`);
};

/* ---------- Sweet Elephants ---------- */
const EL = { accent: '#d9798f', pill: '#fbe1e6', label: '#d58ea0', ink: '#7a4f5a', soft: '#9a7b82', heart: '#f0a5b5' };
function elephantScene(f, t, u, W) {
  const p = 'bsel', ph = t.photo, D = Math.round(f.photoH * (ph ? .72 : .58)), el = ANIMALS.elephant;
  const m = ph ? D / 280 : D / 190, Hs = ph ? D + 150 * m : 240 * m, gy = Hs - 12 * u;
  const mx = W / 2 - (ph ? D * .5 + 20 * m : 95 * m), bx = W / 2 + (ph ? D * .52 + 10 * m : 105 * m), bm = m * .66;
  const hearts = [[0, -.18, 1.2, -8], [.08, -.34, .9, 10], [-.06, -.48, .75, -14], [.05, -.6, .6, 6]].map(([dx, dy, s, r]) =>
    heart(W / 2 + dx * D, gy + dy * (ph ? Hs * .55 : Hs), s * 1.6 * m, EL.heart, .9, r)).join('');
  const back = `<defs>${wcDefs(p)}</defs><ellipse cx="${(W / 2).toFixed(1)}" cy="${gy}" rx="${Math.min(W * .47, D * 1.25 + 80 * m).toFixed(1)}" ry="${(13 * u).toFixed(1)}" fill="#f3d6dc" filter="url(#${p}w)"/>${ph ? '' : hearts}`;
  const front = `<g transform="translate(${mx.toFixed(1)} ${(gy - 150 * m).toFixed(1)}) scale(${m.toFixed(3)})">${el.svg(p + 'm')}</g>
    <g transform="translate(${bx.toFixed(1)} ${(gy - 150 * bm).toFixed(1)}) scale(${bm.toFixed(3)})">${el.svg(p + 'b')}</g>
    ${t.accents ? `${heart(bx + 34 * bm, gy - 214 * bm, 1.2 * bm * 1.5, EL.accent, .95, 14)}` : ''}${ph ? hearts.replace(/opacity="\.9"/g, 'opacity=".75"') : ''}`;
  return `<div style="position:relative;width:${W.toFixed(1)}px;height:${Hs.toFixed(1)}px;margin:0 auto">${svgBox(W, Hs, back)}
    ${ph ? `<div style="position:absolute;left:${(W / 2 - D / 2).toFixed(1)}px;top:0;width:${D}px;z-index:1">${photoAt(f, D, `border:${(6 * u).toFixed(1)}px solid #fff;box-shadow:0 0 0 ${(2 * u).toFixed(1)}px ${EL.heart},0 ${(8 * u).toFixed(1)}px ${(20 * u).toFixed(1)}px rgba(160,60,90,.12);`)}</div>` : ''}
    ${svgBox(W, Hs, front, 2)}</div>`;
}
const elephantsTemplate = (e, t, f) => {
  const u = U(f), W = f.w - 72 - (t.border ? 24 : 0);
  return `${nameBlock(e, t, u, { kicker: 'A sweet little one has arrived', kickColor: EL.label, script: EL.accent, last: EL.ink, date: EL.soft })}
    <div style="margin:auto 0;padding:${(10 * u).toFixed(1)}px 0">${elephantScene(f, t, u, W)}</div>
    ${lowerBlock(e, t, u, { ...EL, script: EL.accent })}
    ${footer(e, t, 'Baby Card Printables · Sweet Elephants', '#c9a3ad', u)}`;
};
const elephantsDecor = (t, f) => {
  const u = U(f), p = 'bseld';
  return full(f, `<defs>${wcDefs(p)}<radialGradient id="${p}g" cx=".5" cy=".3" r=".8"><stop offset="0" stop-color="#fdf4f6"/><stop offset="1" stop-color="#f8e3e8"/></radialGradient></defs>
    <rect width="${f.w}" height="${f.h}" fill="url(#${p}g)"/>
    ${t.border ? dashedBorder(f, '#efc9d2', u) : ''}
    ${t.accents ? `${cloud(110 * u, 120 * u, .8 * u, 1, '#fff', '#f2d3da', '#f3dfe4')}${cloud(f.w - 115 * u, 165 * u, .6 * u, 1, '#fff', '#f2d3da', '#f3dfe4')}
      ${[[70, 260, .9, -10], [f.w / u - 70, 300, .7, 12], [f.w / u - 150, 420, .6, -6], [120, 470, .55, 8]].map(([x, y, s, r]) => heart(x * u, y * u, s * u * 1.4, '#f1b3c0', .8, r)).join('')}
      ${[[150, 210, .6], [f.w / u - 140, 230, .7], [50, 520, .5], [f.w / u - 50, 560, .6]].map(([x, y, s]) => spark(x * u, y * u, s * u, '#e9b9a0')).join('')}` : ''}`);
};

export const NEW_THEMES = {
  animals_blue: { name: 'Little Animals · Blue', desc: 'Clouds, watercolor wash & a cute animal', bg: '#fbf7f0', fg: '#6f655a', font: 'playful', shape: 'circle', filter: 'none', frame: '', pad: 36, fonts: ['script'] },
  animals_pink: { name: 'Little Animals · Pink', desc: 'Clouds, watercolor wash & a cute animal', bg: '#fbf7f0', fg: '#6f655a', font: 'playful', shape: 'circle', filter: 'none', frame: '', pad: 36, fonts: ['script'] },
  balloons:     { name: 'Welcome Balloons',      desc: 'A teddy holding a bunch of balloons',       bg: '#fdfaf5', fg: '#56606e', font: 'playful', shape: 'arch',   filter: 'none', frame: '', pad: 36, fonts: ['script'] },
  bow_blue:     { name: 'Bow & Dots · Blue',     desc: 'Polka dots, scalloped frame & a ribbon',    bg: '#e4eef8', fg: '#5c6f87', font: 'serif',   shape: 'circle', filter: 'none', frame: '', pad: 0,  fonts: ['script'] },
  bow_pink:     { name: 'Bow & Dots · Pink',     desc: 'Polka dots, scalloped frame & a ribbon',    bg: '#f8e7eb', fg: '#86606b', font: 'serif',   shape: 'circle', filter: 'none', frame: '', pad: 0,  fonts: ['script'] },
  elephants:    { name: 'Sweet Elephants',       desc: 'Two elephants, hearts & pink clouds',       bg: '#fbeef0', fg: '#7a4f5a', font: 'playful', shape: 'circle', filter: 'none', frame: '', pad: 36, fonts: ['script'] },
};
export const NEW_TEMPLATES = {
  animals_blue: laTemplate('blue'), animals_pink: laTemplate('pink'), balloons: balloonsTemplate,
  bow_blue: bowTemplate('blue'), bow_pink: bowTemplate('pink'), elephants: elephantsTemplate,
};
export const NEW_DECOR = {
  animals_blue: laDecor('blue'), animals_pink: laDecor('pink'), balloons: balloonsDecor,
  bow_blue: bowDecor('blue'), bow_pink: bowDecor('pink'), elephants: elephantsDecor,
};
