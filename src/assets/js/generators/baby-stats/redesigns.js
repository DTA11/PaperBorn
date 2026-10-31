/* Redesigned birth card designs: Editorial (magazine cover), Victorian Gazette (The Daily Cuddle),
   Boho Botanical (watercolor rainbow), Cyber Tech Sheet (neon HUD). Same rules as illustrated.js:
   pictures are SVG, words are HTML, inline styles only, sizes scale with the paper (u = 1 on A4). */
import { photoHTML } from '../../core/photo.js';
import { barcode } from '../../core/svg.js';
import { wcDefs, rainbowArch, pampas, sprig, dot, spark, newsprint } from '../../core/art.js';

const U = f => Math.min(f.w / 794, f.h / 1123);
const n1 = v => v.toFixed(1);
const fit = (s, base, chars) => base * Math.min(1, chars / Math.max(String(s || '').replace(/&\w+;/g, '&').length, 1));
const cap1 = w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
const nice = s => { const v = String(s || '').trim(), bare = v.replace(/&\w+;/g, ''); return v && bare === bare.toUpperCase() ? v.split(/(\s+|-)/).map(w => /\w/.test(w) ? cap1(w) : w).join('') : v; };
const where = (e, t) => t.location ? [e.location, e.city].filter(Boolean).join(', ') : '';
const fullName = e => [e.firstName, e.lastName].filter(Boolean).join(' ');
const photoAt = (f, size, style = '') => photoHTML(style, size / (f.photoH || 360));
const svgAbs = (w, h, inner, style = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n1(w)} ${n1(h)}" width="${n1(w)}" height="${n1(h)}" style="position:absolute;left:0;top:0;pointer-events:none;${style}">${inner}</svg>`;
const full = (f, inner) => svgAbs(f.w, f.h, inner);
const contentW = (f, t, pad) => f.w - 2 * pad - (t.border ? 24 : 0);
function footer(e, t, label, color, u, font = '') {
  if (!(t.footer || (t.coords && e.coords))) return '';
  return `<div style="display:flex;justify-content:space-between;gap:8px;font-size:${n1(9.5 * u)}px;letter-spacing:.22em;text-transform:uppercase;color:${color};padding-top:${n1(8 * u)}px;${font}"><span>${t.footer ? label : ''}</span><span>${t.coords ? e.coords : ''}</span></div>`;
}

/* ---------- Editorial: fashion-magazine cover (giant name masthead, photo in front, red panels, vertical title) ----------
   Laid out in fractions of the card so every paper size keeps the same look. Absolute boxes ignore the card padding (pad 0). */
const ED = { wine: '#8e1b2c', rose: '#d9a3a3', paper: '#f3ede4', ink: '#2a1d1d', soft: '#6e5b57', cream: '#f8efe6' };
const edGeo = f => ({ u: U(f), w: f.w, h: f.h,
  photo: { x: f.w * .27, y: f.h * .17, w: f.w * .47, h: f.h * .6 },
  panel: { x: f.w * .45, y: f.h * .3, w: f.w * .5, h: f.h * .54 },
  rose: { x: f.w * .19, y: f.h * .42, w: f.w * .3, h: f.h * .3 } });
const caps = (sz, extra = '') => `font-size:${n1(sz)}px;letter-spacing:.2em;text-transform:uppercase;${extra}`;
const at = (x, y, w, inner, extra = '') => `<div style="position:absolute;left:${n1(x)}px;top:${n1(y)}px;${w ? `width:${n1(w)}px;` : ''}${extra}">${inner}</div>`;
const editorial = (e, t, f) => {
  const g = edGeo(f), u = g.u, W = f.w, H = f.h, parts = [];
  const mast = (t.name && e.firstName ? e.firstName : 'BABY').toUpperCase();
  const len = mast.replace(/&\w+;/g, '&').length;
  const ms = Math.min(H * .19, W * .94 / (len * .74));                              // masthead fills the width
  parts.push(at(W * .03, H * .025, W * .94, mast, `font-weight:900;font-size:${n1(ms)}px;line-height:.82;letter-spacing:-.01em;color:${ED.wine};white-space:nowrap;text-align:center`));
  const mBot = H * .025 + ms * .82;
  parts.push(at(W * .05, mBot + 8 * u, W * .2, `The Arrival Issue<br><span style="opacity:.7">Nº 01</span>`, caps(9.5 * u, `color:${ED.ink};line-height:1.6`)));
  if (t.date && e.date) parts.push(at(W * .76, mBot + 8 * u, W * .19, `${e.date}${t.time && e.time ? `<br><span style="opacity:.7">${e.time}</span>` : ''}`, caps(9.5 * u, `color:${ED.ink};line-height:1.6;text-align:right`)));
  /* big photo, in front of the masthead */
  const ph = { ...g.photo, y: Math.max(H * .1, mBot - ms * .14) };              // tucks in front of the bottom of the masthead
  ph.h = Math.min(H * .84 - ph.y, H * .64);
  parts.push(at(ph.x, ph.y, ph.w, t.photo ? photoHTML(`box-shadow:0 ${n1(14 * u)}px ${n1(30 * u)}px rgba(60,10,20,.22);`, ph.h / (f.photoH || 360), `background:${ED.cream};color:${ED.ink}`)
    : `<div style="height:${n1(ph.h)}px;background:linear-gradient(160deg,${ED.rose},${ED.wine})"></div>`, 'z-index:1'));
  /* vertical last name up the left side */
  if (t.name && e.lastName) {
    const vs = Math.min(fit(e.lastName, 78 * u, 9), W * .14);
    parts.push(at(W * .045, H * .73, H * .5, nice(e.lastName), `font-style:italic;font-size:${n1(vs)}px;line-height:1;color:${ED.wine};white-space:nowrap;transform:rotate(-90deg);transform-origin:0 0`));
  }
  /* left column text under the vertical title */
  const where2 = where(e, t);
  const story = [t.weight && e.weight && `weighing ${e.weight}`, t.height && e.height && `measuring ${e.height}`].filter(Boolean).join(' and ');
  parts.push(at(W * .05, H * .755, W * .2, `<div style="${caps(9 * u, `font-weight:700;color:${ED.wine}`)}">A study in<br>new beginnings</div>
    <div style="font-size:${n1(10.5 * u)}px;line-height:1.45;color:${ED.soft};margin-top:${n1(6 * u)}px">${[story && `Arrived ${story}`, where2 && `at ${where2}`].filter(Boolean).join(' ')}${story || where2 ? '.' : ''}</div>`));
  /* small inset of the photo, bottom left */
  if (t.photo && t.accents) {                                                     // sits just above the footer line on every paper size
    const iw = Math.min(W * .15, H * .11), ih = iw * .9;
    const inset = photoHTML(`border:${n1(3 * u)}px solid ${ED.cream};box-shadow:0 0 0 1px ${ED.wine};`, ih / (f.photoH || 360));
    if (inset.indexOf('data-ph-empty') < 0) parts.push(at(W * .05, H - 34 * u - ih, iw, inset, ''));   // the small copy only appears once there is a photo
  }
  /* stats on the red panel, right of the photo */
  const stats = [['Weight', t.weight && e.weight], ['Length', t.height && e.height], ['Time', t.time && e.time], ['Sign', t.zodiac && e.zodiac]].filter(r => r[1]);
  if (stats.length) parts.push(at(W * .765, H * .52, W * .17, `<div style="width:${n1(24 * u)}px;border-top:1px solid ${ED.cream};margin-bottom:${n1(10 * u)}px"></div>` + stats.map(([l, v]) =>
    `<div style="margin-bottom:${n1(9 * u)}px"><div style="${caps(8.5 * u, 'opacity:.75')}">${l}</div><div style="${caps(12.5 * u, 'letter-spacing:.08em;font-weight:700')}">${v}</div></div>`).join(''), `color:${ED.cream}`));
  /* bottom right: headline + parents */
  parts.push(at(W * .5, H * .862, W * .45, `<div style="font-size:${n1(19 * u)}px;letter-spacing:.14em;text-transform:uppercase;line-height:1.25;color:${ED.wine}">Welcome to<br>the world.</div>
    ${t.parents && e.parents ? `<div style="${caps(9 * u, `color:${ED.ink};margin-top:${n1(6 * u)}px`)}">— with love, ${e.parents}</div>` : ''}
    ${t.quote && e.quote ? `<div style="font-style:italic;font-size:${n1(12 * u)}px;color:${ED.soft};margin-top:${n1(3 * u)}px">“${e.quote}”</div>` : ''}`, 'text-align:right'));
  if (t.footer || (t.coords && e.coords)) parts.push(at(W * .05, H - 26 * u, W * .9, `<span>${t.footer ? 'Baby Card Printables · Editions' : ''}</span><span>${t.coords ? e.coords : ''}</span>`,
    caps(8 * u, `color:${ED.soft};display:flex;justify-content:space-between;opacity:.8`)));
  return `<div style="position:absolute;left:0;top:0;width:${W}px;height:${H}px;color:${ED.ink}">${parts.join('')}</div>`;
};
const editorialDecor = (t, f) => {
  const g = edGeo(f), r = (o, c, extra = '') => `<rect x="${n1(o.x)}" y="${n1(o.y)}" width="${n1(o.w)}" height="${n1(o.h)}" fill="${c}" ${extra}/>`;
  return full(f, `<rect width="${f.w}" height="${f.h}" fill="${ED.paper}"/>${r(g.panel, ED.wine)}${t.accents ? r(g.rose, ED.rose, 'opacity=".85"') : ''}
    ${t.accents ? `<line x1="${n1(f.w * .05)}" y1="${n1(f.h * .845)}" x2="${n1(f.w * .22)}" y2="${n1(f.h * .845)}" stroke="${ED.wine}" stroke-width="1"/>` : ''}
    ${t.border ? `<rect x="12" y="12" width="${f.w - 24}" height="${f.h - 24}" fill="none" stroke="${ED.ink}" stroke-opacity=".5" stroke-width="1"/>` : ''}`);
};

/* ---------- Victorian Gazette: The Daily Cuddle ---------- */
const VG = { ink: '#2b2118', soft: '#5a4a3a' };
const leaderRow = (l, v, u) => v ? `<div style="display:flex;align-items:baseline;gap:4px;font-size:${n1(13 * u)}px;margin-top:${n1(5 * u)}px"><span style="text-transform:uppercase;letter-spacing:.08em">${l}</span><span style="flex:1;border-bottom:1px dotted ${VG.ink};opacity:.6"></span><b>${v}</b></div>` : '';
const vintage = (e, t, f) => {
  const u = U(f), W = contentW(f, t, 40), gap = 18 * u, c1 = (W - gap) * 1.25 / 2.25, c2 = W - gap - c1, D = Math.round(f.photoH * .72);
  const ear = (h, b) => `<div style="flex:none;width:${n1(W * .2)}px;border:1px solid ${VG.ink};padding:${n1(4 * u)}px ${n1(6 * u)}px;font-size:${n1(9.5 * u)}px;line-height:1.3;text-align:center"><b style="letter-spacing:.15em">${h}</b><br><i>${b}</i></div>`;
  const nm = fullName(e);
  return `
    <div style="text-align:center;color:${VG.ink}">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:${n1(10 * u)}px">
        ${ear('WEATHER', 'Sunny, with a chance of naps')}
        <div style="min-width:0">
          <div style="font-weight:700;font-size:${n1(W * .6 / 9.6)}px;line-height:1;letter-spacing:.02em;white-space:nowrap">The Daily Cuddle</div>
          <div style="font-style:italic;font-size:${n1(11 * u)}px;margin-top:${n1(4 * u)}px">“All the news that’s fit to cuddle” · Est. ${e.dateISO ? e.dateISO.slice(0, 4) : 'today'}</div>
        </div>
        ${ear('PRICE', 'One big cuddle')}
      </div>
      <div style="display:flex;justify-content:space-between;border-top:3px double ${VG.ink};border-bottom:1px solid ${VG.ink};margin-top:${n1(8 * u)}px;padding:${n1(3 * u)}px ${n1(4 * u)}px;font-size:${n1(9.5 * u)}px;letter-spacing:.16em;text-transform:uppercase">
        <span>Vol. I</span><span>${t.location && e.city ? e.city : 'Home Edition'}</span><span>${t.date ? e.date : ''}</span><span>Special Birth Edition</span></div>
      <div style="font-size:${n1(10 * u)}px;letter-spacing:.4em;text-transform:uppercase;margin-top:${n1(10 * u)}px">✦ Extra! Extra! ✦</div>
      <div style="font-weight:700;text-transform:uppercase;font-size:${n1(fit('A STAR IS BORN!', 60 * u, 15))}px;line-height:1.05">A Star Is Born!</div>
      ${t.name && nm ? `<div style="font-style:italic;font-size:${n1(fit(nm, 21 * u, 22))}px;margin-top:${n1(2 * u)}px">${nice(e.firstName)} ${nice(e.lastName)} arrives; family overjoyed</div>` : ''}
      <div style="font-size:${n1(9 * u)}px;letter-spacing:.25em;text-transform:uppercase;margin-top:${n1(4 * u)}px;opacity:.75">By our nursery correspondent</div>
    </div>
    <div style="display:flex;gap:${n1(gap)}px;align-items:flex-start;margin:${n1(10 * u)}px 0;color:${VG.ink};border-top:1px solid ${VG.ink};padding-top:${n1(10 * u)}px">
      <div style="width:${n1(c1)}px;flex:none">
        ${t.photo ? `<div style="border:3px double ${VG.ink};padding:${n1(4 * u)}px">${photoAt(f, D)}</div>
          <div style="font-style:italic;font-size:${n1(11 * u)}px;text-align:center;margin-top:${n1(4 * u)}px">Our newest reader${t.time && e.time ? `, pictured shortly after ${e.time}` : ''}.</div>` : ''}
        <div style="margin-top:${n1(8 * u)}px">${newsprint(c1, t.photo ? 9 : 20, VG.ink, 9 * u)}</div>
      </div>
      <div style="width:${n1(c2)}px;flex:none;border-left:1px solid ${VG.ink};padding-left:${n1(gap * .8)}px;box-sizing:border-box">
        <div style="font-weight:700;font-size:${n1(13 * u)}px;letter-spacing:.2em;text-transform:uppercase;border-bottom:2px solid ${VG.ink};padding-bottom:${n1(2 * u)}px">Vital Statistics</div>
        ${leaderRow('Arrived', t.time && e.time, u)}${leaderRow('Weight', t.weight && e.weight, u)}${leaderRow('Length', t.height && e.height, u)}${leaderRow('Sign', t.zodiac && e.zodiac, u)}${leaderRow('Place', t.location && e.location, u)}
        ${t.parents && e.parents ? `<p style="font-size:${n1(12.5 * u)}px;font-style:italic;line-height:1.35;margin-top:${n1(8 * u)}px">Proud parents ${e.parents} report that mother and baby are in excellent spirits.</p>` : ''}
        ${t.accents ? `<div style="border:2px solid ${VG.ink};text-align:center;padding:${n1(6 * u)}px;margin-top:${n1(10 * u)}px">
          <div style="font-weight:700;letter-spacing:.3em;font-size:${n1(14 * u)}px">WANTED</div>
          <div style="font-size:${n1(11.5 * u)}px;line-height:1.35">Sleep, in any amount.<br><i>Reward: endless hugs.</i></div></div>` : ''}
        <div style="margin-top:${n1(8 * u)}px">${newsprint(c2 - gap * .8, 11, VG.ink, 9 * u)}</div>
      </div>
    </div>
    ${t.quote && e.quote ? `<div style="border:4px double ${VG.ink};text-align:center;font-style:italic;padding:${n1(6 * u)}px ${n1(12 * u)}px;font-size:${n1(15 * u)}px;color:${VG.ink}">“${e.quote}”</div>` : ''}
    ${footer(e, t, 'Baby Card Printables · The Daily Cuddle', VG.soft, u)}`;
};
const flourish = c => `<g fill="none" stroke="${c}" stroke-width="2.4" stroke-linecap="round"><path d="M0 70V14Q0 0 14 0H70"/><path d="M10 52V20Q10 10 20 10H52"/><path d="M20 38Q20 20 38 20"/><circle cx="6" cy="6" r="3" fill="${c}"/></g>`;
const vintageDecor = (t, f) => {
  const p = 'bsvg', m = 24;
  const corners = [[m, m, 1, 1], [f.w - m, m, -1, 1], [m, f.h - m, 1, -1], [f.w - m, f.h - m, -1, -1]].map(([x, y, sx, sy]) => `<g transform="translate(${x} ${y}) scale(${sx * .5} ${sy * .5})">${flourish(VG.ink)}</g>`).join('');
  return full(f, `<defs>${wcDefs(p)}<radialGradient id="${p}v" cx="50%" cy="50%" r="72%"><stop offset="55%" stop-color="#8a5a1a" stop-opacity="0"/><stop offset="100%" stop-color="#8a5a1a" stop-opacity=".38"/></radialGradient></defs>
    <rect width="${f.w}" height="${f.h}" fill="#f1e6cc"/><rect width="${f.w}" height="${f.h}" fill="url(#${p}v)"/>
    <line x1="0" y1="${f.h * .5}" x2="${f.w}" y2="${f.h * .5}" stroke="#8a5a1a" stroke-opacity=".08" stroke-width="2"/>
    ${t.accents ? `      <circle cx="${f.w * .15}" cy="${f.h * .12}" r="${f.w * .05}" fill="#8a5a1a" opacity=".05" filter="url(#${p}w)"/>${corners}` : ''}
    ${t.border ? `<rect x="10" y="10" width="${f.w - 20}" height="${f.h - 20}" fill="none" stroke="${VG.ink}" stroke-width="3"/><rect x="16" y="16" width="${f.w - 32}" height="${f.h - 32}" fill="none" stroke="${VG.ink}" stroke-width="1"/>` : ''}`);
};

/* ---------- Boho Botanical: watercolor rainbow, pampas and sprigs ---------- */
const BH = { terra: '#c2724f', sage: '#8a9d74', sand: '#e3c9a8', blush: '#e8b4a0', mustard: '#d9a54a', brown: '#5a3a2a', bg: '#f6eee4' };
const boho = (e, t, f) => {
  const u = U(f), W = contentW(f, t, 36), p = 'bsbh', D = f.photoH * .95;
  const r = Math.min(W * .43, D * 1.02), band = r * .1, Hs = r + 26 * u, base = Hs - 14 * u;
  const PH = Math.round(r - band * 5.2) * 2 * .98;
  const first = nice(e.firstName), pl = where(e, t);
  const stats = [t.time && e.time, t.weight && e.weight, t.height && e.height, t.zodiac && e.zodiac].filter(Boolean);
  const scene = `<defs>${wcDefs(p)}</defs>
    ${rainbowArch(p, W / 2, base, r, band, [BH.terra, BH.mustard, BH.blush, BH.sand, BH.sage])}
    ${t.accents ? `${pampas(W / 2 - r - 6 * u, base + 4 * u, .62 * u * (f.photoH / 440) * 1.6, -14)}${pampas(W / 2 + r + 6 * u, base + 4 * u, .62 * u * (f.photoH / 440) * 1.6, 14)}
      ${sprig(W / 2 - r + band, base + 2 * u, .5 * u * (f.photoH / 440) * 1.4, -38, BH.sage, '#a3b38c')}${sprig(W / 2 + r - band, base + 2 * u, .5 * u * (f.photoH / 440) * 1.4, 38, BH.sage, '#a3b38c')}` : ''}
    <line x1="${n1(W / 2 - r - 30 * u)}" y1="${n1(base + 1)}" x2="${n1(W / 2 + r + 30 * u)}" y2="${n1(base + 1)}" stroke="${BH.terra}" stroke-opacity=".35" stroke-width="1.5"/>`;
  return `
    <div style="text-align:center;color:${BH.brown}">
      <div style="font-size:${n1(14 * u)}px;letter-spacing:.42em;text-transform:uppercase;color:${BH.terra}">Welcome little one</div>
      ${t.name && (e.firstName || e.lastName) ? `<div style="font-family:'Dancing Script',cursive;font-weight:700;font-size:${n1(fit(first, 124 * u, 7))}px;line-height:1.1">${first}</div>
        ${e.lastName ? `<div style="font-size:${n1(fit(e.lastName, 21 * u, 12))}px;letter-spacing:.4em;text-transform:uppercase;color:${BH.sage}">${e.lastName}</div>` : ''}` : ''}
      ${t.date && e.date ? `<div style="font-size:${n1(15 * u)}px;letter-spacing:.3em;text-transform:uppercase;color:${BH.terra};margin-top:${n1(6 * u)}px">✦ ${e.date} ✦</div>` : ''}
    </div>
    <div style="margin:auto 0;padding:${n1(10 * u)}px 0"><div style="position:relative;width:${n1(W)}px;height:${n1(Hs)}px;margin:0 auto">${svgAbs(W, Hs, scene)}
      ${t.photo ? `<div style="position:absolute;left:${n1(W / 2 - PH * .4)}px;width:${n1(PH * .8)}px;top:${n1(base - PH * .9)}px;z-index:1">${photoAt(f, PH * .9, `border:${n1(5 * u)}px solid ${BH.bg};box-shadow:0 0 0 ${n1(2 * u)}px ${BH.terra};`)}</div>` : ''}</div></div>
    <div style="text-align:center;color:${BH.brown}">
      ${stats.length ? `<div style="display:flex;justify-content:center;flex-wrap:wrap;gap:${n1(8 * u)}px">${stats.map(v => `<span style="border:1.5px solid ${BH.terra};border-radius:999px;padding:${n1(5 * u)}px ${n1(16 * u)}px;font-size:${n1(17 * u)}px;white-space:nowrap">${v}</span>`).join('')}</div>` : ''}
      ${pl ? `<div style="font-size:${n1(15.5 * u)}px;margin-top:${n1(10 * u)}px">${pl}</div>` : ''}
      ${t.parents && e.parents ? `<div style="font-family:'Dancing Script',cursive;font-weight:600;font-size:${n1(34 * u)}px;line-height:1.2;color:${BH.terra}">with love, ${nice(e.parents)}</div>` : ''}
      ${t.quote && e.quote ? `<div style="font-style:italic;font-size:${n1(17 * u)}px">“${e.quote}”</div>` : ''}
    </div>
    ${footer(e, t, 'Baby Card Printables · Boho Botanical', '#c49a82', u)}`;
};
const bohoDecor = (t, f) => {
  const u = U(f), p = 'bsbhd', S = v => v * u;
  return full(f, `<defs>${wcDefs(p)}</defs><rect width="${f.w}" height="${f.h}" fill="${BH.bg}"/>
    ${t.border ? `<rect x="${S(18)}" y="${S(18)}" width="${f.w - S(36)}" height="${f.h - S(36)}" rx="${S(10)}" fill="none" stroke="${BH.terra}" stroke-opacity=".55" stroke-width="1.2" stroke-dasharray="5 5"/>` : ''}
    ${t.accents ? `${sprig(S(36), f.h - S(36), .62 * u, 6)}${sprig(f.w - S(36), f.h - S(36), .62 * u, -6, BH.terra, BH.sand)}
      ${sprig(S(36), S(36), .5 * u, 174, BH.terra, BH.blush)}${sprig(f.w - S(36), S(36), .5 * u, -174)}
      <circle cx="${f.w - S(120)}" cy="${S(150)}" r="${S(22)}" fill="${BH.mustard}" opacity=".55" filter="url(#${p}w)"/>
      ${[[90, 300], [f.w / u - 80, 340], [140, 560], [f.w / u - 120, 600], [60, 700], [f.w / u - 60, 760]].map(([x, y], i) => dot(S(x), S(y), S(3), [BH.terra, BH.sage, BH.mustard][i % 3], .6)).join('')}` : ''}`);
};

/* ---------- Cyber Tech Sheet: neon HUD ---------- */
const CY = { c: '#00ffcc', c2: '#22d3ee', m: '#ff2bd6', bg: '#04070f', txt: '#c8fff4', g: '#4ade80' };
function moonPhaseName(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || ''); if (!m) return '';
  const syn = 29.530588853, d = (Date.UTC(+m[1], +m[2] - 1, +m[3], 12) - Date.UTC(2000, 0, 6, 18, 14)) / 864e5, p = (((d % syn) + syn) % syn) / syn;
  const names = [[.03, 'New Moon'], [.22, 'Waxing Crescent'], [.28, 'First Quarter'], [.47, 'Waxing Gibbous'], [.53, 'Full Moon'], [.72, 'Waning Gibbous'], [.78, 'Last Quarter'], [.97, 'Waning Crescent'], [1.01, 'New Moon']];
  return `${names.find(n => p < n[0])[1]} ${Math.round((1 - Math.cos(2 * Math.PI * p)) / 2 * 100)}%`;
}
function hud(S, u) {
  const c = S / 2, r1 = S * .47, r2 = S * .42; let ticks = '';
  for (let i = 0; i < 72; i++) { const a = i * 5 * Math.PI / 180, long = i % 6 === 0, ra = r1 - (long ? 10 : 5) * u; ticks += `<line x1="${n1(c + Math.cos(a) * r1)}" y1="${n1(c + Math.sin(a) * r1)}" x2="${n1(c + Math.cos(a) * ra)}" y2="${n1(c + Math.sin(a) * ra)}"/>`; }
  const arc = (r, a0, a1) => `M${n1(c + r * Math.cos(a0))} ${n1(c + r * Math.sin(a0))} A${n1(r)} ${n1(r)} 0 0 1 ${n1(c + r * Math.cos(a1))} ${n1(c + r * Math.sin(a1))}`;
  return `<g fill="none"><circle cx="${c}" cy="${c}" r="${n1(r1)}" stroke="${CY.c}" stroke-opacity=".35"/><g stroke="${CY.c}" stroke-opacity=".6">${ticks}</g>
    <circle cx="${c}" cy="${c}" r="${n1(r2)}" stroke="${CY.c2}" stroke-opacity=".3" stroke-dasharray="3 6"/>
    <path d="${arc(r1 + 6 * u, -2.3, -1.1)}" stroke="${CY.m}" stroke-width="${n1(3 * u)}"/><path d="${arc(r1 + 6 * u, .6, 1.5)}" stroke="${CY.c}" stroke-width="${n1(3 * u)}"/>
    <path d="M${c} ${n1(c - r1 - 12 * u)}V${n1(c - r1 + 6 * u)}M${c} ${n1(c + r1 - 6 * u)}V${n1(c + r1 + 12 * u)}M${n1(c - r1 - 12 * u)} ${c}H${n1(c - r1 + 6 * u)}M${n1(c + r1 - 6 * u)} ${c}H${n1(c + r1 + 12 * u)}" stroke="${CY.c}" stroke-width="1.5"/></g>`;
}
const tile = (label, val, u, barPct, color = CY.c) => !val ? '' : `<div style="position:relative;border:1px solid rgba(0,255,204,.35);background:rgba(0,255,204,.05);padding:${n1(8 * u)}px ${n1(10 * u)}px">
  <div style="position:absolute;left:-1px;top:-1px;width:${n1(10 * u)}px;height:${n1(10 * u)}px;border-left:2px solid ${color};border-top:2px solid ${color}"></div>
  <div style="position:absolute;right:-1px;bottom:-1px;width:${n1(10 * u)}px;height:${n1(10 * u)}px;border-right:2px solid ${color};border-bottom:2px solid ${color}"></div>
  <div style="font-size:${n1(10.5 * u)}px;letter-spacing:.18em;color:${color}">${label}</div>
  <div style="font-size:${n1(fit(val, 24 * u, 9))}px;font-weight:700;color:#fff;text-shadow:0 0 10px rgba(0,255,204,.45);white-space:nowrap">${val}</div>
  ${barPct !== undefined ? `<div style="height:${n1(5 * u)}px;margin-top:${n1(5 * u)}px;background:rgba(0,255,204,.12)"><div style="height:100%;width:${Math.max(4, Math.min(100, barPct)).toFixed(0)}%;background:linear-gradient(90deg,${CY.m},${CY.c})"></div></div>` : ''}</div>`;
const cyber = (e, t, f) => {
  const u = U(f), W = contentW(f, t, 40), D = Math.round(f.photoH * .7), S = D * 1.32, colL = Math.max(S, W * .5);
  const id = e.dateISO ? `ID-${e.dateISO.replace(/-/g, '')}-${(e.time || '0000').replace(':', '')}` : 'ID-UNKNOWN';
  const nm = fullName(e), mp = t.moon ? moonPhaseName(e.dateISO) : '';
  const cell = (l, v) => v ? `<div style="border-left:2px solid ${CY.m};padding-left:${n1(8 * u)}px"><div style="font-size:${n1(9.5 * u)}px;letter-spacing:.18em;color:${CY.c2}">${l}</div><div style="font-size:${n1(13 * u)}px;color:#fff">${v}</div></div>` : '';
  const cells = [cell('TIME_STAMP', t.date && e.date), cell('FACILITY', t.location && e.location), cell('COORDINATES', t.coords && e.coords), cell('LUNAR_PHASE', mp), cell('GENETIC_ORIGIN', t.parents && e.parents), cell('LOG_NOTE', t.quote && e.quote)].filter(Boolean);
  return `
    <div style="color:${CY.txt}">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:${n1(10.5 * u)}px;letter-spacing:.14em">
        <span style="border:1px solid ${CY.c};color:${CY.c};padding:${n1(3 * u)}px ${n1(8 * u)}px">[ NEW_ARRIVAL // 001 ]</span>
        <span style="text-align:right;color:${CY.c2}">${id}<br><span style="color:${CY.g}">● SYSTEM ONLINE</span></span></div>
      ${t.name && nm ? `<div style="font-weight:700;text-transform:uppercase;color:#fff;font-size:${n1(fit(nm, 56 * u, 13))}px;line-height:1.05;margin-top:${n1(14 * u)}px;text-shadow:-2px 0 ${CY.m},2px 0 ${CY.c},0 0 16px rgba(0,255,204,.55)">${e.firstName}<br>${e.lastName}</div>` : ''}
      <div style="font-size:${n1(11 * u)}px;letter-spacing:.24em;color:${CY.c};margin-top:${n1(6 * u)}px">&gt; SUBJECT SUCCESSFULLY DEPLOYED${t.date && e.date ? ' · ' + e.date : ''}</div>
    </div>
    <div style="display:flex;align-items:center;gap:${n1(16 * u)}px;margin:${n1(10 * u)}px 0">
      <div style="position:relative;flex:none;width:${n1(colL)}px;height:${n1(S)}px">
        ${t.accents ? `<div style="position:absolute;left:${n1((colL - S) / 2)}px;top:0;width:${n1(S)}px;height:${n1(S)}px">${svgAbs(S, S, hud(S, u))}</div>` : ''}
        ${t.photo ? `<div style="position:absolute;left:${n1((colL - D) / 2)}px;top:${n1((S - D) / 2)}px;width:${D}px">${photoAt(f, D, 'box-shadow:0 0 22px rgba(0,255,204,.35);')}</div>` : ''}
        ${t.accents ? `<div style="position:absolute;left:0;width:100%;bottom:0;text-align:center;font-size:${n1(9.5 * u)}px;letter-spacing:.3em;color:${CY.m}">SCAN COMPLETE · 100%</div>` : ''}
      </div>
      <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:${n1(10 * u)}px">
        ${tile('MASS', t.weight && e.weight, u, +e.weightN / 50)}${tile('LENGTH', t.height && e.height, u, +e.heightN / 60 * 100)}
        ${tile('TIME_OF_ARRIVAL', t.time && e.time, u, undefined, CY.m)}${tile('SIGN', t.zodiac && e.zodiac, u, undefined, CY.c2)}
      </div>
    </div>
    ${cells.length ? `<div style="display:grid;grid-template-columns:1fr 1fr;gap:${n1(10 * u)}px ${n1(16 * u)}px;border:1px solid rgba(0,255,204,.3);background:rgba(4,7,15,.72);padding:${n1(10 * u)}px">${cells.join('')}</div>` : ''}
    ${t.footer ? `<div style="display:flex;justify-content:space-between;align-items:center;font-size:${n1(9.5 * u)}px;color:#0891b2;border-top:1px solid rgba(0,255,204,.3);padding-top:${n1(6 * u)}px;margin-top:${n1(8 * u)}px"><span>BABYCARDPRINTABLES_v4.0</span>${barcode(Math.round(110 * u), Math.round(18 * u), '#0891b2')}</div>` : ''}`;
};
const cyberDecor = (t, f) => {
  const p = 'bscy', hz = f.h * .74, vx = f.w / 2; let floor = '';
  for (let i = -12; i <= 12; i++) floor += `<line x1="${n1(vx + i * f.w * .03)}" y1="${n1(hz)}" x2="${n1(vx + i * f.w * .22)}" y2="${f.h}"/>`;
  for (let k = 1; k <= 9; k++) { const y = hz + (f.h - hz) * Math.pow(k / 9, 1.9); floor += `<line x1="0" y1="${n1(y)}" x2="${f.w}" y2="${n1(y)}"/>`; }
  const corner = (x, y, sx, sy) => `<path transform="translate(${x} ${y}) scale(${sx} ${sy})" d="M0 38V0H38" fill="none" stroke="${CY.c}" stroke-width="2"/>`;
  return full(f, `<defs><pattern id="${p}g" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="${CY.c}" stroke-opacity=".08"/></pattern>
      <pattern id="${p}s" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="1" fill="#000" fill-opacity=".28"/></pattern>
      <linearGradient id="${p}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${CY.m}" stop-opacity=".55"/><stop offset="1" stop-color="${CY.c}" stop-opacity=".35"/></linearGradient>
      <linearGradient id="${p}h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${CY.m}" stop-opacity="0"/><stop offset="1" stop-color="${CY.m}" stop-opacity=".22"/></linearGradient>
      <radialGradient id="${p}v" cx="50%" cy="45%" r="75%"><stop offset="60%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".7"/></radialGradient></defs>
    <rect width="${f.w}" height="${f.h}" fill="${CY.bg}"/><rect width="${f.w}" height="${n1(hz)}" fill="url(#${p}g)"/>
    ${t.accents ? `<rect y="${n1(hz - f.h * .12)}" width="${f.w}" height="${n1(f.h * .12)}" fill="url(#${p}h)"/><g stroke="url(#${p}f)" stroke-width="1.2">${floor}</g>
      <line x1="0" y1="${n1(hz)}" x2="${f.w}" y2="${n1(hz)}" stroke="${CY.m}" stroke-width="2" stroke-opacity=".8"/>
      ${corner(22, 22, 1, 1)}${corner(f.w - 22, 22, -1, 1)}${corner(22, f.h - 22, 1, -1)}${corner(f.w - 22, f.h - 22, -1, -1)}` : ''}
    ${t.border ? `<rect x="12" y="12" width="${f.w - 24}" height="${f.h - 24}" fill="none" stroke="${CY.c}" stroke-opacity=".6"/>` : ''}
    <rect width="${f.w}" height="${f.h}" fill="url(#${p}s)"/><rect width="${f.w}" height="${f.h}" fill="url(#${p}v)"/>`);
};

export const REDESIGN_THEMES = {
  editorial: { name: 'Editorial Cover', desc: 'Fashion-magazine cover: giant name & red panels', bg: '#f3ede4', fg: '#2a1d1d', font: 'serif', shape: 'rectangle', filter: 'none', frame: '', pad: 0 },
  vintage:   { name: 'Victorian Gazette', desc: 'The Daily Cuddle: headlines & columns', bg: '#f1e6cc', fg: '#2b2118', font: 'vintage', shape: 'rectangle', filter: 'sepia', frame: '', pad: 40 },
  boho:      { name: 'Boho Botanical', desc: 'Watercolor rainbow, pampas & terracotta', bg: '#f6eee4', fg: '#5a3a2a', font: 'playful', shape: 'arch', filter: 'warm', frame: '', pad: 36, fonts: ['script'] },
  cyber:     { name: 'Cyber Tech Sheet', desc: 'Neon HUD, data tiles & grid floor', bg: '#04070f', fg: '#c8fff4', font: 'mono', shape: 'hexagon', filter: 'cool', frame: '', pad: 40 },
};
export const REDESIGN_TEMPLATES = { editorial, vintage, boho, cyber };
export const REDESIGN_DECOR = { editorial: editorialDecor, vintage: vintageDecor, boho: bohoDecor, cyber: cyberDecor };
