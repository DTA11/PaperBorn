/* Six storybook birth card designs: Scandi Doodle, Stork Delivery, Oh Baby Lettering, Little Line Friends, Clothesline
   and Floral Fox. Each offers colors (dv.color). Pictures are SVG drawn here; words are HTML so they keep the page fonts
   in downloads. Same rules as illustrated.js: sizes scale with the paper (u = 1 on A4), inline styles only. */
import { U, fit, nice, statList, where, photoAt, svgBox, full, footer, lowerBlock } from './illustrated.js';
import { wcDefs, cloud, spark, dot, heart, leaf } from '../../core/art.js';

const px = v => v.toFixed(1) + 'px';
const n1 = v => v.toFixed(1);
const SCRIPT = "'Dancing Script',cursive";
const pal = (P, dv, d) => P[dv && dv.color] || P[d];
const cw = (f, t, pad) => f.w - pad * 2 - (t.border ? 24 : 0) - 2;   // content width inside the card padding (and the border frame)
const MONTHS = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
const monthOf = dv => { const m = /^\d{4}-(\d{2})/.exec(dv.dateISO || ''); return m ? MONTHS[+m[1] - 1] : 'HELLO'; };

/* Headline wording shared by several designs ("auto" = the design's own) */
export const HEADLINES = [['auto', 'Matches the design'], ['welcome', 'Welcome baby'], ['hello', 'Hello baby'], ['ohbaby', 'Oh baby'],
  ['girl', 'It’s a girl!'], ['boy', 'It’s a boy!'], ['delivery', 'Special delivery'], ['star', 'Little star'], ['mylittle', 'My little baby']];
const HEAD = { welcome: ['Welcome', 'baby'], hello: ['Hello', 'baby'], ohbaby: ['Oh', 'baby'], girl: ['It’s a', 'girl!'], boy: ['It’s a', 'boy!'],
  delivery: ['Special', 'delivery'], star: ['Little', 'star'], mylittle: ['My little', 'baby'] };
const headline = (dv, auto) => HEAD[dv.headline] || HEAD[auto];

/* ---------- Characters: one set of shapes, drawn flat (Scandi Doodle) or as a line drawing (Line Friends) ----------
   Origin at the bottom centre (where it sits), about 240 tall. c = { B body, B2 darker body, L light parts, A accent,
   P cheeks, D dark details, S stroke attributes ('' when flat) }. */
export const CHARACTERS = [['auto', 'Matches the design'], ['elephant', 'Elephant'], ['whale', 'Whale'], ['fox', 'Fox'], ['bunny', 'Bunny'], ['bear', 'Bear']];
const eyes = (x1, x2, y, c, w = 9) => `<path d="M${x1 - w} ${y} Q${x1} ${y + 7} ${x1 + w} ${y} M${x2 - w} ${y} Q${x2} ${y + 7} ${x2 + w} ${y}" fill="none" stroke="${c.D}" stroke-width="3" stroke-linecap="round"/>`;
const cheeks = (x1, x2, y, c, r = 8) => `<g fill="${c.P}" opacity=".75"><ellipse cx="${x1}" cy="${y}" rx="${r}" ry="${r * .7}"/><ellipse cx="${x2}" cy="${y}" rx="${r}" ry="${r * .7}"/></g>`;
/* A little bow tie centred at (x, y), worn at the neck */
const bowTie = (x, y, c) => `<g transform="translate(${x} ${y})">
  <path d="M-3 0 C-10 -8 -22 -14 -26 -9 C-29 -4 -29 4 -26 9 C-22 14 -10 8 -3 0Z" fill="${c.A}" ${c.S}/>
  <path d="M3 0 C10 -8 22 -14 26 -9 C29 -4 29 4 26 9 C22 14 10 8 3 0Z" fill="${c.A}" ${c.S}/>
  <rect x="-6" y="-7" width="12" height="14" rx="4" fill="${c.A}" ${c.S}/></g>`;
const DRAW = {
  elephant: c => `
    <path d="M58 -40 C82 -40 90 -24 82 -14" fill="none" stroke="${c.line ? c.D : c.B2}" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="0" cy="-58" rx="70" ry="58" fill="${c.B}" ${c.S}/>
    <rect x="-52" y="-44" width="36" height="44" rx="16" fill="${c.B}" ${c.S}/><rect x="16" y="-44" width="36" height="44" rx="16" fill="${c.B}" ${c.S}/>
    <g fill="${c.L}" ${c.S}><ellipse cx="-34" cy="-3" rx="13" ry="5"/><ellipse cx="34" cy="-3" rx="13" ry="5"/></g>
    <ellipse cx="-74" cy="-152" rx="46" ry="54" fill="${c.B}" ${c.S}/><ellipse cx="74" cy="-152" rx="46" ry="54" fill="${c.B}" ${c.S}/>
    <ellipse cx="-72" cy="-150" rx="32" ry="40" fill="${c.line ? c.P : c.A}" ${c.line ? c.S : ''}/><ellipse cx="72" cy="-150" rx="32" ry="40" fill="${c.line ? c.P : c.A}" ${c.line ? c.S : ''}/>
    <g fill="${c.line ? c.A : '#fff'}" opacity="${c.line ? 1 : .6}">${[[-82, -166, 4.5], [-64, -172, 3.5], [-86, -142, 4], [-66, -150, 5], [-78, -124, 3.5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/><circle cx="${-x}" cy="${y}" r="${r}"/>`).join('')}</g>
    <circle cx="0" cy="-150" r="56" fill="${c.B}" ${c.S}/>
    <path d="M-12 -124 C-14 -96 -10 -76 4 -70 C18 -64 28 -74 24 -84 C20 -92 12 -88 12 -82" fill="none" stroke="${c.line ? '#222' : c.B2}" stroke-width="${c.line ? 3 : 22}" stroke-linecap="round" opacity="${c.line ? 1 : .0}"/>
    <path d="M-14 -126 C-16 -96 -12 -76 2 -70 C16 -64 28 -72 26 -84 C24 -92 14 -92 12 -84 L10 -96 C10 -110 12 -118 14 -126Z" fill="${c.line ? c.B : c.B2}" ${c.S}/>
    <g stroke="${c.line ? '#222' : c.B2}" stroke-width="2" stroke-linecap="round" fill="none" opacity=".8"><path d="M-12 -108 C-6 -106 4 -106 10 -108"/><path d="M-11 -96 C-5 -94 4 -94 10 -96"/></g>
    ${eyes(-22, 22, -160, c, 8)}${cheeks(-34, 34, -138, c, 8)}
    <path d="M-8 -206 C-4 -218 4 -218 6 -206" fill="none" stroke="${c.line ? '#222' : c.B2}" stroke-width="3" stroke-linecap="round"/>`,
  whale: c => `
    <path d="M-96 -58 C-124 -72 -146 -96 -136 -112 C-122 -106 -112 -96 -104 -86 C-114 -110 -108 -132 -92 -130 C-88 -112 -88 -96 -84 -82Z" fill="${c.B}" ${c.S}/>
    <path d="M-104 -48 C-104 -118 -20 -150 52 -126 C98 -110 118 -76 116 -44 C114 -12 84 0 4 0 C-66 0 -104 -14 -104 -48Z" fill="${c.B}" ${c.S}/>
    <path d="M-96 -40 C-60 -46 40 -46 112 -40 C108 -14 82 0 4 0 C-60 0 -92 -16 -96 -40Z" fill="${c.L}" ${c.S}/>
    <g stroke="${c.line ? '#222' : c.B2}" stroke-width="2.5" stroke-linecap="round" opacity=".7"><path d="M-40 -32 L-40 -12"/><path d="M-10 -34 L-10 -10"/><path d="M20 -34 L20 -10"/><path d="M50 -32 L50 -12"/><path d="M78 -30 L78 -14"/></g>
    <path d="M10 -84 C2 -100 18 -104 22 -92" fill="${c.B2}" ${c.S}/>
    ${eyes(64, 999, -72, c, 8)}${cheeks(80, 999, -56, c, 9)}
    <g fill="${c.A}" ${c.S}><path d="M38 -150 C30 -168 34 -184 38 -192 C42 -184 46 -168 38 -150Z"/><path d="M20 -146 C8 -158 4 -172 6 -180 C14 -172 22 -162 20 -146Z"/><path d="M56 -146 C68 -158 72 -172 70 -180 C62 -172 54 -162 56 -146Z"/></g>`,
  fox: c => `
    <path d="M40 -10 C100 -10 130 -50 118 -96 C110 -126 82 -128 80 -104 C78 -84 96 -64 70 -44 C60 -36 48 -34 40 -34Z" fill="${c.B}" ${c.S}/>
    <path d="M92 -42 C110 -52 122 -76 118 -96 C110 -126 82 -128 80 -104 C96 -96 104 -70 92 -42Z" fill="${c.L}" ${c.S}/>
    <path d="M0 -168 C54 -168 74 -60 62 0 L-62 0 C-74 -60 -54 -168 0 -168Z" fill="${c.B}" ${c.S}/>
    <path d="M0 -122 C26 -112 32 -40 0 0 C-32 -40 -26 -112 0 -122Z" fill="${c.L}" ${c.S}/>
    <path d="M-60 -246 L-30 -196 L-70 -196Z" fill="${c.B}" ${c.S}/><path d="M60 -246 L30 -196 L70 -196Z" fill="${c.B}" ${c.S}/>
    <path d="M-58 -232 L-40 -202 L-64 -202Z" fill="${c.B2}"/><path d="M58 -232 L40 -202 L64 -202Z" fill="${c.B2}"/>
    <path d="M-74 -198 C-50 -148 -24 -118 0 -110 C24 -118 50 -148 74 -198 C46 -214 20 -220 0 -220 C-20 -220 -46 -214 -74 -198Z" fill="${c.B}" ${c.S}/>
    <path d="M-74 -198 C-56 -160 -30 -128 0 -110 C-6 -134 -20 -152 -48 -160 C-58 -170 -66 -184 -74 -198Z" fill="${c.L}" ${c.S}/>
    <path d="M74 -198 C56 -160 30 -128 0 -110 C6 -134 20 -152 48 -160 C58 -170 66 -184 74 -198Z" fill="${c.L}" ${c.S}/>
    <ellipse cx="0" cy="-112" rx="9" ry="7" fill="${c.D}"/>
    ${eyes(-24, 24, -170, c, 8)}${cheeks(-36, 36, -148, c, 7)}`,
  bunny: c => `
    <g transform="rotate(-10 -20 -190)"><ellipse cx="-20" cy="-236" rx="17" ry="54" fill="${c.B}" ${c.S}/><ellipse cx="-20" cy="-232" rx="8" ry="40" fill="${c.P}" opacity=".8"/></g>
    <g transform="rotate(12 20 -190)"><ellipse cx="20" cy="-236" rx="17" ry="54" fill="${c.B}" ${c.S}/><ellipse cx="20" cy="-232" rx="8" ry="40" fill="${c.P}" opacity=".8"/></g>
    <circle cx="58" cy="-26" r="16" fill="${c.L}" ${c.S}/>
    <ellipse cx="0" cy="-62" rx="62" ry="62" fill="${c.B}" ${c.S}/>
    <ellipse cx="0" cy="-48" rx="36" ry="40" fill="${c.L}" ${c.S}/>
    <ellipse cx="-34" cy="-6" rx="24" ry="12" fill="${c.B}" ${c.S}/><ellipse cx="34" cy="-6" rx="24" ry="12" fill="${c.B}" ${c.S}/>
    <circle cx="0" cy="-150" r="52" fill="${c.B}" ${c.S}/>
    <path d="M-6 -136 L6 -136 L0 -128Z" fill="${c.P}"/><path d="M0 -128 C-4 -120 -12 -120 -14 -124 M0 -128 C4 -120 12 -120 14 -124" fill="none" stroke="${c.D}" stroke-width="2" stroke-linecap="round"/>
    ${eyes(-22, 22, -152, c, 8)}${cheeks(-32, 32, -134, c, 8)}
    ${c.tie ? bowTie(0, -99, c) : `<g transform="translate(-26 -196) rotate(-18)"><path d="M0 0 C-16 -14 -30 -4 -26 8 C-22 18 -8 10 0 0 C8 10 22 18 26 8 C30 -4 16 -14 0 0Z" fill="${c.A}" ${c.S}/><circle r="5" fill="${c.A}" ${c.S}/></g>`}`,
  bear: c => `
    <circle cx="-42" cy="-196" r="20" fill="${c.B}" ${c.S}/><circle cx="42" cy="-196" r="20" fill="${c.B}" ${c.S}/>
    <circle cx="-42" cy="-196" r="10" fill="${c.L}"/><circle cx="42" cy="-196" r="10" fill="${c.L}"/>
    <ellipse cx="0" cy="-64" rx="68" ry="64" fill="${c.B}" ${c.S}/>
    <path d="M-66 -78 C-40 -66 40 -66 66 -78" fill="none" stroke="${c.A}" stroke-width="${c.line ? 3 : 0}"/>
    <g fill="${c.A}">${[-44, -22, 0, 22, 44].map((x, i) => `<path transform="translate(${x} ${i % 2 ? -50 : -58}) scale(.55)" d="M0 9 C-4 5 -12 0 -12 -5 C-12 -10 -6 -13 0 -8 C6 -13 12 -10 12 -5 C12 0 4 5 0 9Z"/>`).join('')}</g>
    <ellipse cx="-36" cy="-6" rx="26" ry="13" fill="${c.B}" ${c.S}/><ellipse cx="36" cy="-6" rx="26" ry="13" fill="${c.B}" ${c.S}/>
    <circle cx="0" cy="-150" r="56" fill="${c.B}" ${c.S}/>
    <ellipse cx="0" cy="-130" rx="26" ry="19" fill="${c.L}" ${c.S}/>
    <ellipse cx="0" cy="-138" rx="9" ry="6.5" fill="${c.D}"/><path d="M0 -132 V-124 M0 -124 C-5 -118 -11 -119 -13 -122 M0 -124 C5 -118 11 -119 13 -122" fill="none" stroke="${c.D}" stroke-width="2" stroke-linecap="round"/>
    ${eyes(-22, 22, -160, c, 8)}${cheeks(-36, 36, -138, c, 8)}${c.tie ? bowTie(0, -95, c) : ''}`,
};
const FLAT = { elephant: ['#c4c7cf', '#a9adb8', '#eef0f3'], whale: ['#8fb3d3', '#6e95ba', '#e3eef7'], fox: ['#e98d4e', '#b9612b', '#fff6ec'], bunny: ['#efe5d8', '#d9c9b4', '#fffaf3'], bear: ['#cb9c6e', '#a9774c', '#efd9bd'] };
/* tie = true: a bow tie at the neck instead of a bow on the head (used for the blue colors) */
export function character(kind, mode, A, P = '#f4a3b4', tie = false) {
  const k = DRAW[kind] ? kind : 'elephant';
  const c = mode === 'line'
    ? { B: '#fff', B2: '#fff', L: '#fff', A, P, D: '#222', S: 'stroke="#222" stroke-width="3" stroke-linejoin="round"', line: true }
    : { B: FLAT[k][0], B2: FLAT[k][1], L: FLAT[k][2], A, P, D: '#3b3a45', S: '', line: false };
  c.tie = tie;
  return DRAW[k](c);
}

/* ---------- 1. Scandi Doodle: flat animal, name and a flag garland spelling the birth month ---------- */
const SC = {
  mustard: { name: 'Mustard & teal', flags: ['#e8b04b', '#5f9ea0', '#e97f63', '#2f3e5c'], ink: '#2f3e5c', soft: '#6b7280', accent: '#e8b04b', bg: '#fffdf8', dots: ['#e8b04b', '#e97f63', '#5f9ea0'] },
  pink:    { name: 'Blush', flags: ['#f1a7b5', '#f6d3a5', '#c9a3c7', '#e57f95'], ink: '#7b4a5a', soft: '#8b7a80', accent: '#e57f95', bg: '#fffafa', dots: ['#f1a7b5', '#f6d3a5', '#c9a3c7'] },
  blue:    { name: 'Blue', flags: ['#8fb3d3', '#f6d3a5', '#2f4f74', '#e8b04b'], ink: '#2f4f74', soft: '#6b7684', accent: '#5d87b4', bg: '#fbfdff', dots: ['#8fb3d3', '#e8b04b', '#2f4f74'] },
};
function monthBunting(word, W, u, P) {
  const n = word.length, fw = Math.min(46 * u, (W * .82) / n), x0 = W / 2 - fw * n / 2, x1 = W / 2 + fw * n / 2, y0 = 6 * u, sag = 18 * u, h = fw * 1.15;
  const pt = t => [(1 - t) * (1 - t) * (x0 - 14 * u) + 2 * (1 - t) * t * (W / 2) + t * t * (x1 + 14 * u), (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * (y0 + sag * 2) + t * t * y0];
  let svg = `<path d="M${n1(x0 - 14 * u)} ${n1(y0)} Q${n1(W / 2)} ${n1(y0 + sag * 2)} ${n1(x1 + 14 * u)} ${n1(y0)}" fill="none" stroke="${P.ink}" stroke-width="1.4" opacity=".6"/>`, txt = '';
  for (let i = 0; i < n; i++) {
    const ta = (i + .08) / n * .86 + .07, tb = (i + .92) / n * .86 + .07, tc = (i + .5) / n * .86 + .07;
    const a = pt(ta), b = pt(tb), c = pt(tc);
    svg += `<path d="M${n1(a[0])} ${n1(a[1])} L${n1(b[0])} ${n1(b[1])} L${n1(c[0])} ${n1(c[1] + h)}Z" fill="${P.flags[i % P.flags.length]}"/>`;
    txt += `<span style="position:absolute;left:${px(c[0] - fw / 2)};top:${px(c[1] + h * .1)};width:${px(fw)};text-align:center;font-weight:700;font-size:${px(fw * .42)};color:#fff">${word[i]}</span>`;
  }
  return `<div style="position:relative;width:${px(W)};height:${px(y0 + sag + h + 4 * u)};margin:0 auto">${svgBox(W, y0 + sag + h + 4 * u, svg)}${txt}</div>`;
}
const scandiTemplate = (e, t, f, dv) => {
  const P = pal(SC, dv, 'mustard'), u = U(f), W = cw(f, t, 40), first = nice(e.firstName);
  const D = Math.round(f.photoH * .8), s = (t.photo ? .85 : 1.55) * f.photoH / 440, Hs = (t.photo ? D : 262 * s) + 10 * u;
  const pic = t.photo
    ? `<div style="position:relative;width:${px(W)};height:${px(Hs)};margin:0 auto"><div style="position:absolute;left:${px(W / 2 - D / 2 - 40 * u)};top:0;width:${D}px">${photoAt(f, D, `border:${px(6 * u)} solid #fff;box-shadow:0 0 0 ${px(2 * u)} ${P.accent};`)}</div>
        ${svgBox(W, Hs, `<g transform="translate(${n1(W / 2 + D * .4)} ${n1(Hs - 4 * u)}) scale(${s.toFixed(3)})">${character(dv.animal, 'flat', P.accent, undefined, dv.color === 'blue')}</g>`, 2)}</div>`
    : `<div style="position:relative;width:${px(W)};height:${px(Hs)};margin:0 auto">${svgBox(W, Hs, `<g transform="translate(${n1(W / 2)} ${n1(Hs - 4 * u)}) scale(${s.toFixed(3)})">${character(dv.animal, 'flat', P.accent, undefined, dv.color === 'blue')}</g>`)}</div>`;
  const stats = statList(e, t).map(r => r[1]);
  return `<div style="text-align:center;color:${P.ink}">${t.date && e.date ? `<div style="font-size:${px(14 * u)};letter-spacing:.34em;text-transform:uppercase;color:${P.soft}">${e.date}</div>` : ''}</div>
    <div style="margin:auto 0;padding-top:${px(8 * u)}">${pic}</div>
    <div style="text-align:center;color:${P.ink}">
      ${t.name && first ? `<div style="font-weight:600;font-size:${px(fit(first, 92 * u, 8))};line-height:1.05">${first}</div>` : ''}
      ${t.name && e.lastName ? `<div style="font-size:${px(fit(e.lastName, 17 * u, 14))};letter-spacing:.42em;text-transform:uppercase;color:${P.soft}">${e.lastName}</div>` : ''}
      <div style="margin:${px(10 * u)} 0 ${px(6 * u)}">${monthBunting(monthOf(dv), W, u, P)}</div>
      ${stats.length ? `<div style="font-size:${px(16 * u)};letter-spacing:.14em;text-transform:uppercase">${stats.join(` <span style="color:${P.accent}">♥</span> `)}</div>` : ''}
      ${where(e, t) ? `<div style="font-size:${px(15 * u)};color:${P.soft};margin-top:${px(8 * u)}">${where(e, t)}</div>` : ''}
      ${t.parents && e.parents ? `<div style="font-family:${SCRIPT};font-weight:600;font-size:${px(32 * u)};color:${P.accent};margin-top:${px(4 * u)}">with love, ${nice(e.parents)}</div>` : ''}
      ${t.quote && e.quote ? `<div style="font-size:${px(16 * u)};font-style:italic;color:${P.soft}">“${e.quote}”</div>` : ''}
    </div>${footer(e, t, 'Baby Card Printables · Scandi Doodle', P.soft, u)}`;
};
const scandiDecor = (t, f, e, dv) => {
  const P = pal(SC, dv, 'mustard'), u = U(f);
  const doodles = t.accents ? [[70, 120, 0], [f.w / u - 80, 150, 1], [110, 420, 2], [f.w / u - 100, 460, 0], [60, 700, 1], [f.w / u - 60, 760, 2], [230, 70, 1], [f.w / u - 230, 60, 2]]
    .map(([x, y, k], i) => i % 3 === 0 ? spark(x * u, y * u, .9 * u, P.dots[k]) : i % 3 === 1 ? heart(x * u, y * u, .8 * u, P.dots[k], .9, (i * 17) % 30 - 15) : dot(x * u, y * u, 4 * u, P.dots[k])).join('') : '';
  return full(f, `<rect width="${f.w}" height="${f.h}" fill="${P.bg}"/>${t.border ? `<rect x="${n1(18 * u)}" y="${n1(18 * u)}" width="${n1(f.w - 36 * u)}" height="${n1(f.h - 36 * u)}" fill="none" stroke="${P.ink}" stroke-opacity=".25" stroke-width="1.2"/>` : ''}${doodles}`);
};

/* ---------- 2. Stork Delivery: a stork flying in with the baby bundle ---------- */
const ST = {
  mint:  { sky: ['#eef8f5', '#d9efe8'], bundle: ['#9bd6ca', '#6fb5a7'], accent: '#3f8f82', ink: '#35524d', soft: '#6b8580', pill: '#ffffff' },
  pink:  { sky: ['#fdf1f4', '#f7dde5'], bundle: ['#f4b4c3', '#de8aa0'], accent: '#c9637f', ink: '#6b4552', soft: '#8e7179', pill: '#ffffff' },
  blue:  { sky: ['#f0f6fc', '#dce9f6'], bundle: ['#a9c8ea', '#7aa3d2'], accent: '#4d79ad', ink: '#3b4f6b', soft: '#6f7f94', pill: '#ffffff' },
  sunny: { sky: ['#fffaf0', '#fbecc8'], bundle: ['#f6cc78', '#e2a94a'], accent: '#c98a2b', ink: '#5e4a2c', soft: '#87765d', pill: '#ffffff' },
};
function stork(P) {   // flying right, ~ 360 wide; origin at the bundle's bottom
  return `<g transform="translate(-150 -250)">
    <path d="M36 118 L-40 150 M44 122 L-30 162" stroke="#e5893b" stroke-width="5" stroke-linecap="round"/>
    <path d="M30 86 C70 60 150 60 190 84 C206 94 206 112 186 118 C140 132 70 130 30 112 C18 106 18 94 30 86Z" fill="#fff" stroke="#c9ced6" stroke-width="2"/>
    <path d="M64 88 C70 30 110 -14 176 -30 C206 -38 230 -30 236 -20 C214 -14 196 -2 182 14 C200 6 214 6 222 12 C200 20 184 34 172 48 C186 44 196 46 202 52 C176 60 156 76 140 92Z" fill="#fff" stroke="#c9ced6" stroke-width="2" stroke-linejoin="round"/>
    <path d="M176 -30 C206 -38 230 -30 236 -20 C214 -14 196 -2 182 14 C200 6 214 6 222 12 C200 20 184 34 172 48 C186 44 196 46 202 52 C190 56 178 62 168 70 C168 40 172 4 176 -30Z" fill="#2f3440"/>
    <path d="M86 70 C104 40 130 18 160 6" fill="none" stroke="#dfe3e8" stroke-width="2" stroke-linecap="round"/>
    <path d="M186 96 C214 88 236 64 246 40" fill="none" stroke="#fff" stroke-width="16" stroke-linecap="round"/><path d="M186 96 C214 88 236 64 246 40" fill="none" stroke="#c9ced6" stroke-width="2" stroke-dasharray="0" opacity=".0"/>
    <circle cx="252" cy="34" r="20" fill="#fff" stroke="#c9ced6" stroke-width="2"/>
    <path d="M266 30 L332 52 L268 44Z" fill="#f0a04b" stroke="#d98634" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M250 28 Q256 33 262 28" fill="none" stroke="#2f3440" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M298 44 C298 90 270 130 270 160" fill="none" stroke="#b49a7a" stroke-width="2.2"/><path d="M298 44 C310 92 300 130 292 160" fill="none" stroke="#b49a7a" stroke-width="2.2"/>
    <path d="M240 168 C250 150 300 148 316 166 C334 190 330 236 300 250 C276 258 238 252 228 230 C218 206 226 182 240 168Z" fill="${P.bundle[0]}" stroke="${P.bundle[1]}" stroke-width="2"/>
    <path d="M246 170 C262 186 296 184 312 168" fill="none" stroke="${P.bundle[1]}" stroke-width="2"/>
    <circle cx="276" cy="166" r="22" fill="#fbe0cf" stroke="#e8bfa6" stroke-width="1.5"/><path d="M262 160 C268 146 286 146 292 156" fill="#e7b48f"/>
    <path d="M266 168 Q270 171 274 168 M280 168 Q284 171 288 168" fill="none" stroke="#5a4a44" stroke-width="2" stroke-linecap="round"/><circle cx="264" cy="176" r="4" fill="#f4a3a3" opacity=".7"/><circle cx="290" cy="176" r="4" fill="#f4a3a3" opacity=".7"/>
    <path d="M234 168 C226 152 236 140 248 150 C252 140 266 142 262 156" fill="${P.bundle[0]}" stroke="${P.bundle[1]}" stroke-width="2"/>
  </g>`;
}
const storkTemplate = (e, t, f, dv) => {
  const P = pal(ST, dv, 'mint'), u = U(f), W = cw(f, t, 40), [h1, h2] = headline(dv, 'delivery'), first = nice(e.firstName);
  const k = f.photoH / 440, D = Math.round(f.photoH * .78), Hs = t.photo ? D + 40 * u : 380 * k;
  const birdS = (t.photo ? .74 : 1.3) * k;
  const art = `<defs>${wcDefs('bsst')}</defs>${t.photo ? '' : `${cloud(W * .2, Hs * .82, .9 * u)}${cloud(W * .82, Hs * .9, .7 * u)}`}
    <g transform="translate(${n1(t.photo ? W / 2 - D * .55 : W / 2 + 10 * u)} ${n1(t.photo ? D * .62 : Hs * .98)}) scale(${birdS.toFixed(3)})">${stork(P)}</g>`;
  const pic = `<div style="position:relative;width:${px(W)};height:${px(Hs)};margin:0 auto">
    ${t.photo ? `<div style="position:absolute;left:${px(W / 2 - D / 2 + 50 * u)};top:${px(30 * u)};width:${D}px">${photoAt(f, D, `border:${px(7 * u)} solid #fff;box-shadow:0 ${px(8 * u)} ${px(24 * u)} rgba(0,0,0,.1);`)}</div>` : ''}${svgBox(W, Hs, art, 2)}</div>`;
  return `<div style="text-align:center">
      <div style="font-family:${SCRIPT};font-weight:700;font-size:${px(fit(h1 + ' ' + h2, 92 * u, 14))};line-height:1.05;color:${P.accent}">${h1} ${h2}</div></div>
    <div style="margin:auto 0;padding:${px(6 * u)} 0">${pic}</div>
    <div style="text-align:center;color:${P.ink}">
      ${t.name && first ? `<div style="font-weight:600;font-size:${px(fit(first + ' ' + (e.lastName || ''), 46 * u, 18))};letter-spacing:.16em;text-transform:uppercase">${first}${e.lastName ? ' ' + nice(e.lastName) : ''}</div>` : ''}
      ${t.date && e.date ? `<div style="font-size:${px(15 * u)};letter-spacing:.3em;text-transform:uppercase;color:${P.soft};margin:${px(4 * u)} 0 ${px(12 * u)}">${e.date}</div>` : ''}
      ${lowerBlock(e, t, u, { pill: P.pill, label: P.accent, ink: P.ink, soft: P.soft, script: P.accent })}
    </div>${footer(e, t, 'Baby Card Printables · Stork Delivery', P.soft, u)}`;
};
const storkDecor = (t, f, e, dv) => {
  const P = pal(ST, dv, 'mint'), u = U(f), p = 'bsstd';
  return full(f, `<defs><linearGradient id="${p}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.sky[0]}"/><stop offset="1" stop-color="${P.sky[1]}"/></linearGradient></defs>
    <rect width="${f.w}" height="${f.h}" fill="url(#${p}g)"/>
    ${t.accents ? `${cloud(90 * u, 110 * u, .7 * u)}${cloud(f.w - 100 * u, 70 * u, .55 * u)}${cloud(f.w - 70 * u, f.h * .58, .5 * u, .9)}${cloud(70 * u, f.h * .66, .45 * u, .9)}
      ${[[150, 60], [f.w / u - 190, 140], [60, 300], [f.w / u - 50, 330]].map(([x, y], i) => spark(x * u, y * u, (.6 + i % 2 * .2) * u, '#f3d07a')).join('')}` : ''}
    ${t.border ? `<rect x="${n1(18 * u)}" y="${n1(18 * u)}" width="${n1(f.w - 36 * u)}" height="${n1(f.h - 36 * u)}" rx="${n1(16 * u)}" fill="none" stroke="${P.accent}" stroke-opacity=".4" stroke-width="1.5" stroke-dasharray="6 6"/>` : ''}`);
};

/* ---------- 3. Oh Baby Lettering: big script on watercolor stripes or dots ---------- */
const LT = {
  pink:  { kind: 'waves', c: ['#f6b7b2', '#f9cfc8'], ink: '#2b2024', accent: '#d9706c', soft: '#7a6668', panel: '#fffaf8' },
  sunny: { kind: 'stripes', c: ['#f6d98c', '#fae6b3'], ink: '#2b2420', accent: '#c99328', soft: '#7a6f5e', panel: '#fffdf6' },
  lilac: { kind: 'dots', c: ['#c9b6e6', '#f3b9c9'], ink: '#2d2433', accent: '#9a7cc7', soft: '#776c80', panel: '#fdfbff' },
  mint:  { kind: 'waves', c: ['#a9dccd', '#cdeee3'], ink: '#1f2b28', accent: '#4f9f8a', soft: '#66807a', panel: '#f9fffd' },
};
const letteringTemplate = (e, t, f, dv) => {
  const P = pal(LT, dv, 'pink'), u = U(f), [h1, h2] = headline(dv, 'ohbaby'), first = nice(e.firstName), D = Math.round(f.photoH * .5), hk = t.photo ? .72 : 1;
  const stats = statList(e, t).map(r => r[1]);
  return `<div style="text-align:center;padding-top:${px(30 * u)}">
      <div style="font-family:${SCRIPT};font-weight:700;color:${P.ink};line-height:.9;font-size:${px(fit(h1, 150 * u * hk, 6))};transform:rotate(-4deg)">${h1}</div>
      <div style="font-family:${SCRIPT};font-weight:700;color:${P.ink};line-height:.95;font-size:${px(fit(h2, 190 * u * hk, 5))};transform:rotate(-4deg);margin-left:${px(60 * u)}">${h2}</div></div>
    ${t.photo ? `<div style="margin:auto 0;padding:${px(8 * u)} 0"><div style="width:${D}px;margin:0 auto">${photoAt(f, D, `border:${px(7 * u)} solid ${P.panel};box-shadow:0 ${px(8 * u)} ${px(22 * u)} rgba(0,0,0,.12);`)}</div></div>` : '<div style="margin:auto 0"></div>'}
    <div style="background:${P.panel};border-radius:${px(18 * u)};padding:${px(22 * u)} ${px(26 * u)};box-shadow:0 ${px(10 * u)} ${px(30 * u)} rgba(0,0,0,.08);text-align:center;color:${P.ink};max-width:${px(560 * u)};margin:0 auto;width:100%;box-sizing:border-box">
      ${t.name && first ? `<div style="font-weight:700;font-size:${px(fit(first, 44 * u, 12))};letter-spacing:.2em;text-transform:uppercase">${first}</div>` : ''}
      ${t.name && e.lastName ? `<div style="font-size:${px(fit(e.lastName, 16 * u, 16))};letter-spacing:.4em;text-transform:uppercase;color:${P.soft}">${e.lastName}</div>` : ''}
      ${t.date && e.date ? `<div style="font-size:${px(15 * u)};letter-spacing:.28em;color:${P.accent};margin-top:${px(8 * u)}">${e.date}</div>` : ''}
      ${stats.length ? `<div style="font-size:${px(16 * u)};letter-spacing:.12em;text-transform:uppercase;margin-top:${px(8 * u)}">${stats.join(' · ')}</div>` : ''}
      ${where(e, t) ? `<div style="font-size:${px(14 * u)};color:${P.soft};margin-top:${px(6 * u)}">${where(e, t)}</div>` : ''}
      ${t.parents && e.parents ? `<div style="font-family:${SCRIPT};font-weight:600;font-size:${px(30 * u)};color:${P.accent};margin-top:${px(4 * u)}">with love, ${nice(e.parents)}</div>` : ''}
      ${t.quote && e.quote ? `<div style="font-size:${px(15 * u)};font-style:italic;color:${P.soft}">“${e.quote}”</div>` : ''}
    </div>${footer(e, t, 'Baby Card Printables · Oh Baby', P.soft, u)}`;
};
const letteringDecor = (t, f, e, dv) => {
  const P = pal(LT, dv, 'pink'), u = U(f), p = 'bslt' + (dv.color || '');
  let pat = '';
  if (P.kind === 'dots') {
    for (let y = 30 * u, r = 0; y < f.h; y += 64 * u, r++) for (let x = (r % 2 ? 40 : 8) * u; x < f.w; x += 64 * u) pat += `<rect x="${n1(x)}" y="${n1(y)}" width="${n1(22 * u)}" height="${n1(34 * u)}" rx="${n1(11 * u)}" fill="${P.c[(r + Math.round(x / 64)) % 2]}" opacity=".8"/>`;
  } else {
    const step = (P.kind === 'stripes' ? 70 : 64) * u, bw = step * .46;
    for (let y = 0, i = 0; y < f.h + step; y += step, i++) {
      const amp = P.kind === 'waves' ? 14 * u : 0, seg = f.w / 4;
      let d = `M-20 ${n1(y)}`; for (let k = 0; k < 5; k++) d += ` Q${n1(k * seg + seg / 2 - 20)} ${n1(y + (k % 2 ? -amp : amp))} ${n1((k + 1) * seg - 20)} ${n1(y)}`;
      pat += `<path d="${d}" fill="none" stroke="${P.c[i % 2]}" stroke-width="${n1(bw)}" stroke-linecap="round" opacity=".85"/>`;
    }
  }
  return full(f, `<defs>${wcDefs(p)}</defs><rect width="${f.w}" height="${f.h}" fill="#fff"/>${t.accents ? `<g filter="url(#${p}w)">${pat}</g>` : ''}
    ${t.border ? `<rect x="${n1(14 * u)}" y="${n1(14 * u)}" width="${n1(f.w - 28 * u)}" height="${n1(f.h - 28 * u)}" fill="none" stroke="${P.ink}" stroke-opacity=".5" stroke-width="1.5"/>` : ''}`);
};

/* ---------- 4. Little Line Friends: a simple line drawing with rosy cheeks and tall headline ---------- */
const LF = {
  red:   { accent: '#c0392b', cheek: '#f4a7b9', ink: '#1f1f1f', soft: '#6b6b6b' },
  blush: { accent: '#d98ea0', cheek: '#f4b4c2', ink: '#2a2226', soft: '#7a6d72' },
  navy:  { accent: '#34507a', cheek: '#f4b4c2', ink: '#1d2433', soft: '#6b7280' },
};
const lineTemplate = (e, t, f, dv) => {
  const P = pal(LF, dv, 'red'), u = U(f), W = cw(f, t, 44), [h1, h2] = headline(dv, 'welcome'), first = nice(e.firstName);
  const k = f.photoH / 440, s = (t.photo ? 1 : 1.75) * k, Hs = 272 * s, D = Math.round(f.photoH * .7);
  const stats = statList(e, t).map(r => r[1]);
  const tall = (txt, size, color, weight) => `<div style="font-family:'Inter',sans-serif;font-weight:${weight};font-size:${px(size)};line-height:1;letter-spacing:.02em;text-transform:uppercase;color:${color};transform:scaleY(1.45);transform-origin:left top;margin-bottom:${px(size * .5)}">${txt}</div>`;
  const pic = `<div style="position:relative;width:${px(W)};height:${px(t.photo ? Math.max(D, Hs) : Hs)};margin:0 auto">
    ${t.photo ? `<div style="position:absolute;left:${px(W * .1)};top:0;width:${D}px">${photoAt(f, D, `border:${px(3 * u)} solid ${P.ink};`)}</div>` : ''}
    ${svgBox(W, t.photo ? Math.max(D, Hs) : Hs, `<g transform="translate(${n1(t.photo ? W * .78 : W / 2)} ${n1((t.photo ? Math.max(D, Hs) : Hs) - 2)}) scale(${s.toFixed(3)})">${character(['bunny', 'bear', 'elephant', 'whale', 'fox'].includes(dv.animal) ? dv.animal : 'bunny', 'line', P.accent, P.cheek, dv.color === 'navy')}</g>`, 2)}</div>`;
  return `<div style="padding:${px(14 * u)} ${px(10 * u)} 0">${tall(h1, fit(h1, 46 * u, 10), P.ink, 300)}${tall(h2, fit(h2, 92 * u, 6), P.accent, 600)}</div>
    <div style="margin:auto 0">${pic}</div>
    <div style="text-align:center;color:${P.ink};border-top:1.5px solid ${P.ink};padding-top:${px(14 * u)}">
      ${t.name && first ? `<div style="font-family:${SCRIPT};font-weight:700;font-size:${px(fit(first, 74 * u, 9))};line-height:1.05">${first}${e.lastName ? ` <span style="font-family:'Inter',sans-serif;font-weight:300;font-size:${px(18 * u)};letter-spacing:.4em;text-transform:uppercase">${e.lastName}</span>` : ''}</div>` : ''}
      ${[t.date && e.date, ...stats].filter(Boolean).length ? `<div style="font-size:${px(14 * u)};letter-spacing:.24em;text-transform:uppercase;margin-top:${px(6 * u)}">${[t.date && e.date, ...stats].filter(Boolean).join(` <span style="color:${P.accent}">♥</span> `)}</div>` : ''}
      ${where(e, t) ? `<div style="font-size:${px(14 * u)};color:${P.soft};margin-top:${px(6 * u)}">${where(e, t)}</div>` : ''}
      ${t.parents && e.parents ? `<div style="font-size:${px(15 * u)};letter-spacing:.2em;text-transform:uppercase;margin-top:${px(6 * u)}">with love, ${e.parents}</div>` : ''}
      ${t.quote && e.quote ? `<div style="font-size:${px(15 * u)};font-style:italic;color:${P.soft};margin-top:${px(2 * u)}">“${e.quote}”</div>` : ''}
    </div>${footer(e, t, 'Baby Card Printables · Line Friends', P.soft, u)}`;
};
const lineDecor = (t, f, e, dv) => {
  const P = pal(LF, dv, 'red'), u = U(f);
  return full(f, `<rect width="${f.w}" height="${f.h}" fill="#ffffff"/>${t.accents ? [[f.w - 90 * u, 90 * u], [f.w - 140 * u, 150 * u], [f.w - 60 * u, 190 * u]].map(([x, y], i) => heart(x, y, (1 - i * .2) * u * 1.3, i === 1 ? P.cheek : P.accent, .9, i * 12 - 10)).join('') : ''}
    ${t.border ? `<rect x="${n1(16 * u)}" y="${n1(16 * u)}" width="${n1(f.w - 32 * u)}" height="${n1(f.h - 32 * u)}" fill="none" stroke="${P.ink}" stroke-width="1.5"/>` : ''}`);
};

/* ---------- 5. Clothesline: little clothes pegged on a line ---------- */
const CL = {
  green:  { items: ['#b8dba0', '#a9c8e8', '#f6d58b', '#f3b9c5'], ink: '#3f4a3a', accent: '#6b9b52', soft: '#7a8273', bg: '#fbfaf4', pill: '#eef5e6' },
  pink:   { items: ['#f3b9c5', '#f9dcc4', '#d9c4ea', '#f6d58b'], ink: '#5a3f47', accent: '#d07a90', soft: '#857379', bg: '#fdf8f6', pill: '#fbebef' },
  blue:   { items: ['#a9c8e8', '#f6d58b', '#b8dba0', '#c9d6f0'], ink: '#3b4a5e', accent: '#5f8fc4', soft: '#727d8c', bg: '#f8fafc', pill: '#e9f1fa' },
  yellow: { items: ['#f6d58b', '#b8dba0', '#f3b9c5', '#a9c8e8'], ink: '#54482e', accent: '#c99a2e', soft: '#857a62', bg: '#fffcf3', pill: '#fbf2da' },
};
const OUTL = 'stroke="#4b4b4b" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"';
const peg = (x, y) => `<rect x="${x - 3.5}" y="${y - 12}" width="7" height="22" rx="2" fill="#d9b48a" stroke="#9c7a55" stroke-width="1.2"/>`;
const onesie = c => `<path d="M-40 0 L-62 18 L-52 40 L-36 32 L-36 108 C-36 120 -18 124 -10 114 L0 104 L10 114 C18 124 36 120 36 108 L36 32 L52 40 L62 18 L40 0 C30 12 -30 12 -40 0Z" fill="${c}" ${OUTL}/>
  <path d="M-16 4 C-8 14 8 14 16 4" fill="none" ${OUTL}/><g fill="#fff" opacity=".7"><circle cx="-14" cy="50" r="4"/><circle cx="10" cy="64" r="4"/><circle cx="-6" cy="82" r="4"/><circle cx="16" cy="40" r="3"/></g>
  <path transform="translate(0 66) scale(.9)" d="M0 9 C-4 5 -12 0 -12 -5 C-12 -10 -6 -13 0 -8 C6 -13 12 -10 12 -5 C12 0 4 5 0 9Z" fill="#fff"/>`;
const sock = c => `<path d="M-12 0 L12 0 L12 46 C12 52 16 56 24 58 C36 61 38 76 26 78 L-6 78 C-14 78 -14 70 -12 62Z" fill="${c}" ${OUTL}/><path d="M-12 12 L12 12" ${OUTL}/><path d="M-12 22 L12 22" stroke="#fff" stroke-width="3" opacity=".7"/>`;
const bib = c => `<path d="M-14 0 C-14 10 14 10 14 0 C30 4 38 22 34 44 C30 66 14 76 0 76 C-14 76 -30 66 -34 44 C-38 22 -30 4 -14 0Z" fill="${c}" ${OUTL}/><path d="M-14 0 C-12 16 12 16 14 0" fill="#fff" ${OUTL}/><circle cx="0" cy="46" r="10" fill="#fff" opacity=".7"/>`;
const hat = c => `<path d="M-28 30 C-28 4 -16 -6 0 -6 C16 -6 28 4 28 30Z" fill="${c}" ${OUTL}/><rect x="-32" y="26" width="64" height="12" rx="6" fill="#fff" ${OUTL}/><circle cx="0" cy="-10" r="8" fill="#fff" ${OUTL}/>`;
const clotheslineTemplate = (e, t, f, dv) => {
  const P = pal(CL, dv, 'green'), u = U(f), W = cw(f, t, 40), [h1, h2] = headline(dv, 'hello'), first = nice(e.firstName);
  const k = f.photoH / 440 * 1.3, Hs = 260 * k + (t.photo ? 30 * u : 0), y0 = 22 * k, sag = 26 * k;
  const lineY = x => y0 + sag * (1 - Math.pow((2 * x / W) - 1, 2));
  const hang = (x, draw, c, sc = 1, rot = 0) => { const y = lineY(x); return `${peg(x - 14 * sc * k, y)}${peg(x + 14 * sc * k, y)}<g transform="translate(${n1(x)} ${n1(y - 2)}) rotate(${rot}) scale(${(sc * k).toFixed(3)})">${draw(c)}</g>`; };
  const D = Math.round(f.photoH * .6);
  const items = t.photo
    ? `${hang(W * .12, sock, P.items[1], 1, 4)}${hang(W * .86, bib, P.items[3], 1.1, -3)}`
    : `${hang(W * .12, sock, P.items[1], 1.1, 4)}${hang(W * .27, sock, P.items[1], 1.1, -3)}${hang(W * .5, onesie, P.items[0], 1.5)}${hang(W * .73, bib, P.items[3], 1.3, 3)}${hang(W * .9, hat, P.items[2], 1.1, -4)}`;
  const art = `<path d="M-6 ${n1(y0)} Q${n1(W / 2)} ${n1(y0 + sag * 2)} ${n1(W + 6)} ${n1(y0)}" fill="none" stroke="#8a7a68" stroke-width="2"/>${items}`;
  const photo = t.photo ? `<div style="position:absolute;left:${px(W / 2 - D / 2 - 10 * u)};top:${px(lineY(W / 2) + 2)};width:${px(D + 20 * u)};background:#fff;padding:${px(10 * u)} ${px(10 * u)} ${px(34 * u)};box-shadow:0 ${px(6 * u)} ${px(18 * u)} rgba(0,0,0,.12);transform:rotate(-2deg);box-sizing:border-box;z-index:1">${photoAt(f, D)}</div>
    ${svgBox(W, Hs, `${peg(W / 2 - D * .32, lineY(W / 2 - D * .32) + 4)}${peg(W / 2 + D * .32, lineY(W / 2 + D * .32) + 4)}`, 3)}` : '';
  const stats = statList(e, t).map(r => r[1]);
  return `<div style="text-align:center;color:${P.ink}">
      <div style="font-family:${SCRIPT};font-weight:700;font-size:${px(fit(h1 + ' ' + h2, 88 * u, 11))};line-height:1.05;color:${P.accent}">${h1} ${h2}</div></div>
    <div style="margin:auto 0;padding:${px(6 * u)} 0"><div style="position:relative;width:${px(W)};height:${px(t.photo ? lineY(W / 2) + D + 60 * u : Hs)};margin:0 auto">${svgBox(W, t.photo ? lineY(W / 2) + D + 60 * u : Hs, art)}${photo}</div></div>
    <div style="text-align:center;color:${P.ink}">
      ${t.name && first ? `<div style="font-weight:600;font-size:${px(fit(first, 56 * u, 10))};line-height:1.1">${first}</div>` : ''}
      ${t.name && e.lastName ? `<div style="font-size:${px(fit(e.lastName, 16 * u, 16))};letter-spacing:.4em;text-transform:uppercase;color:${P.soft}">${e.lastName}</div>` : ''}
      ${t.date && e.date ? `<div style="font-size:${px(15 * u)};letter-spacing:.28em;color:${P.accent};margin:${px(6 * u)} 0 ${px(10 * u)}">${e.date}</div>` : ''}
      ${lowerBlock(e, t, u, { pill: P.pill, label: P.accent, ink: P.ink, soft: P.soft, script: P.accent })}
    </div>${footer(e, t, 'Baby Card Printables · Clothesline', P.soft, u)}`;
};
const clotheslineDecor = (t, f, e, dv) => {
  const P = pal(CL, dv, 'green'), u = U(f), p = 'bscl';
  return full(f, `<defs>${wcDefs(p)}</defs><rect width="${f.w}" height="${f.h}" fill="${P.bg}"/>
    ${t.accents ? `<g filter="url(#${p}w)" opacity=".35">${[[90, 160, 46, 0], [f.w / u - 110, 520, 54, 1], [80, f.h / u - 220, 40, 2], [f.w / u - 90, 110, 30, 3]].map(([x, y, r, i]) => `<circle cx="${n1(x * u)}" cy="${n1(y * u)}" r="${n1(r * u)}" fill="${P.items[i]}"/>`).join('')}</g>
      ${[[150, 70], [f.w / u - 160, 230], [50, 480], [f.w / u - 50, 640]].map(([x, y], i) => spark(x * u, y * u, .6 * u, P.accent, .6)).join('')}` : ''}
    ${t.border ? `<rect x="${n1(18 * u)}" y="${n1(18 * u)}" width="${n1(f.w - 36 * u)}" height="${n1(f.h - 36 * u)}" rx="${n1(8 * u)}" fill="none" stroke="${P.ink}" stroke-opacity=".3" stroke-width="1.2" stroke-dasharray="4 5"/>` : ''}`);
};

/* ---------- 6. Floral Fox: a watercolor flower wreath around a sleepy fox ---------- */
const FX = {
  blue:   { flower: ['#7fb0de', '#4f86c2'], small: '#f3b0bf', leaf: ['#7fb36a', '#5e9a4d'], heart: '#e9727f', ink: '#3d4a5a', accent: '#4f86c2', soft: '#76808c', pill: '#eaf2fa', bg: '#fdfdfb' },
  pink:   { flower: ['#f2a7ba', '#d9738f'], small: '#a9c8ea', leaf: ['#8dbb78', '#6a9d58'], heart: '#e9727f', ink: '#5a3d47', accent: '#d9738f', soft: '#86737a', pill: '#fbecf0', bg: '#fffcfb' },
  autumn: { flower: ['#f0a85c', '#d27a32'], small: '#f3d27a', leaf: ['#a3a65a', '#7c8040'], heart: '#c9563c', ink: '#53402e', accent: '#c96a2c', soft: '#87776a', pill: '#f8eddf', bg: '#fffaf3' },
};
const flower5 = (x, y, r, c, mid = '#f6d36b') => `<g transform="translate(${n1(x)} ${n1(y)})">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="${n1(-r * .55)}" rx="${n1(r * .38)}" ry="${n1(r * .55)}" fill="${c[0]}" stroke="${c[1]}" stroke-width="1" transform="rotate(${a})"/>`).join('')}<circle r="${n1(r * .25)}" fill="${mid}"/></g>`;
function wreath(cx, cy, R, P, s) {
  let out = '';
  for (let i = 0; i < 26; i++) {
    const a = i / 26 * Math.PI * 2 + .1, x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R, deg = a * 180 / Math.PI;
    out += leaf(x, y, .9 * s, deg + (i % 2 ? 40 : -50), P.leaf[i % 2], P.leaf[1]);
  }
  [[-.3, 1], [.5, .9], [1.25, 1.1], [2.1, .85], [2.8, 1], [3.6, .9], [4.4, 1.05], [5.3, .95]].forEach(([a, k], i) => {
    out += flower5(cx + Math.cos(a) * R, cy + Math.sin(a) * R, 18 * s * k, P.flower);
    out += `<circle cx="${n1(cx + Math.cos(a + .35) * (R + 10 * s))}" cy="${n1(cy + Math.sin(a + .35) * (R + 10 * s))}" r="${n1(5 * s)}" fill="${P.small}"/>`;
    if (i % 2) out += heart(cx + Math.cos(a - .3) * (R - 16 * s), cy + Math.sin(a - .3) * (R - 16 * s), .7 * s, P.heart, .9, i * 10);
  });
  return out;
}
const foxTemplate = (e, t, f, dv) => {
  const P = pal(FX, dv, 'blue'), u = U(f), W = cw(f, t, 40), first = nice(e.firstName);
  const k = f.photoH / 440 * 1.22, R = 150 * k, Hs = R * 2 + 70 * k, cx = W / 2, cy = Hs / 2, D = Math.round(R * 1.42);
  const art = `<defs>${wcDefs('bsfx')}</defs><circle cx="${n1(cx)}" cy="${n1(cy)}" r="${n1(R * .86)}" fill="${P.pill}" opacity=".6"/>
    <g filter="url(#bsfxw)">${wreath(cx, cy, R, P, k)}</g>
    ${t.photo ? '' : `<g transform="translate(${n1(cx)} ${n1(cy + R * .62)}) scale(${(.92 * k).toFixed(3)})">${character('fox', 'flat', P.heart)}</g>`}`;
  const front = t.photo ? svgBox(W, Hs, `<g transform="translate(${n1(cx + R * .7)} ${n1(cy + R * 1.02)}) scale(${(.42 * k).toFixed(3)})">${character('fox', 'flat', P.heart)}</g>`, 2) : '';
  return `<div style="text-align:center;color:${P.ink}">
      <div style="font-size:${px(14 * u)};letter-spacing:.38em;text-transform:uppercase;color:${P.accent}">Welcome little one</div>
      ${t.name && first ? `<div style="font-family:${SCRIPT};font-weight:700;font-size:${px(fit(first, 112 * u, 7))};line-height:1.1;color:${P.ink}">${first}</div>` : ''}
      ${t.name && e.lastName ? `<div style="font-size:${px(fit(e.lastName, 18 * u, 14))};letter-spacing:.42em;text-transform:uppercase;color:${P.soft}">${e.lastName}</div>` : ''}
      ${t.date && e.date ? `<div style="font-size:${px(14 * u)};letter-spacing:.3em;color:${P.soft};margin-top:${px(6 * u)}">${e.date}</div>` : ''}</div>
    <div style="margin:auto 0;padding:${px(6 * u)} 0"><div style="position:relative;width:${px(W)};height:${px(Hs)};margin:0 auto">${svgBox(W, Hs, art)}
      ${t.photo ? `<div style="position:absolute;left:${px(cx - D / 2)};top:${px(cy - D / 2)};width:${D}px;z-index:1">${photoAt(f, D, `border:${px(5 * u)} solid #fff;`)}</div>` : ''}${front}</div></div>
    ${lowerBlock(e, t, u, { pill: P.pill, label: P.accent, ink: P.ink, soft: P.soft, script: P.accent })}
    ${footer(e, t, 'Baby Card Printables · Floral Fox', P.soft, u)}`;
};
const foxDecor = (t, f, e, dv) => {
  const P = pal(FX, dv, 'blue'), u = U(f);
  return full(f, `<rect width="${f.w}" height="${f.h}" fill="${P.bg}"/>
    ${t.accents ? [[60, 80], [f.w / u - 60, 100], [40, f.h / u - 120], [f.w / u - 50, f.h / u - 90]].map(([x, y], i) => flower5(x * u, y * u, 16 * u, P.flower) + leaf(x * u + 14 * u, y * u + 10 * u, .8 * u, i * 90 + 20, P.leaf[0], P.leaf[1])).join('') : ''}
    ${t.border ? `<rect x="${n1(18 * u)}" y="${n1(18 * u)}" width="${n1(f.w - 36 * u)}" height="${n1(f.h - 36 * u)}" rx="${n1(12 * u)}" fill="none" stroke="${P.accent}" stroke-opacity=".35" stroke-width="1.2"/>` : ''}`);
};

/* ---------- Registry ---------- */
const colorsOf = (P, dotKey, names) => Object.fromEntries(Object.entries(P).map(([k, c]) => [k, { name: names[k] || (k[0].toUpperCase() + k.slice(1)), dot: dotKey(c), bg: c.bg }]));
export const STORY_THEMES = {
  scandi:      { name: 'Scandi Doodle', desc: 'Flat doodle animal & birth month flags', bg: '#fffdf8', fg: '#2f3e5c', font: 'playful', shape: 'circle', filter: 'none', frame: '', pad: 40, fonts: ['script'],
    colors: colorsOf(SC, c => c.flags[0], { mustard: 'Mustard & teal', pink: 'Blush', blue: 'Blue' }) },
  stork:       { name: 'Stork Delivery', desc: 'A stork flying in with the baby', bg: '#eef8f5', fg: '#35524d', font: 'playful', shape: 'circle', filter: 'none', frame: '', pad: 40, fonts: ['script'],
    colors: colorsOf(ST, c => c.bundle[0], {}) },
  lettering:   { name: 'Oh Baby Lettering', desc: 'Big script on watercolor stripes', bg: '#ffffff', fg: '#2b2024', font: 'playful', shape: 'circle', filter: 'none', frame: '', pad: 44, fonts: ['script'],
    colors: colorsOf(LT, c => c.c[0], {}) },
  line:        { name: 'Little Line Friends', desc: 'Simple line drawing with rosy cheeks', bg: '#ffffff', fg: '#1f1f1f', font: 'sans', shape: 'circle', filter: 'grayscale', frame: '', pad: 44, fonts: ['script'],
    colors: colorsOf(LF, c => c.accent, {}) },
  clothesline: { name: 'Clothesline', desc: 'Little clothes pegged on a line', bg: '#fbfaf4', fg: '#3f4a3a', font: 'playful', shape: 'rectangle', filter: 'none', frame: '', pad: 40, fonts: ['script'],
    colors: colorsOf(CL, c => c.items[0], {}) },
  fox:         { name: 'Floral Fox', desc: 'Watercolor flower wreath & a sleepy fox', bg: '#fdfdfb', fg: '#3d4a5a', font: 'playful', shape: 'circle', filter: 'none', frame: '', pad: 40, fonts: ['script'],
    colors: colorsOf(FX, c => c.flower[0], { autumn: 'Autumn' }) },
};
export const STORY_TEMPLATES = { scandi: scandiTemplate, stork: storkTemplate, lettering: letteringTemplate, line: lineTemplate, clothesline: clotheslineTemplate, fox: foxTemplate };
export const STORY_DECOR = { scandi: scandiDecor, stork: storkDecor, lettering: letteringDecor, line: lineDecor, clothesline: clotheslineDecor, fox: foxDecor };
