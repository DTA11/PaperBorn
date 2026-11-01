/* Baby-stats designs (11 styles). Each template returns the inner HTML of the card; each decor returns a background layer. */
import { show, prng } from '../../core/util.js';
import { state, fmt } from '../../core/state.js';
import { photoHTML, SHAPES } from '../../core/photo.js';
import { svgLayer, sparkle, corners, wavePath, barcode } from '../../core/svg.js';
import { daisy, spark, crescent, cloud } from '../../core/art.js';

/* ---------- Template helpers ---------- */
const stat = (label, val, sub, o = {}) => !val ? '' :
  `<div><span class="block text-[9pt] uppercase tracking-widest font-bold ${o.l || ''}">${label}</span>` +
  `<span class="${o.v || 'text-2xl font-bold uppercase'}">${val}</span>${sub ? `<span class="block text-xs ${o.s || ''}">${sub}</span>` : ''}</div>`;
const mono = (e, t, cls) => show(t.monogram, e.monogram,
  `<div class="w-12 h-12 shrink-0 rounded-full border flex items-center justify-center font-black tracking-tight ${cls}">${e.monogram}</div>`);
const footer = (e, t, label, cls = '') => (t.footer || (t.coords && e.coords))
  ? `<div class="flex justify-between gap-2 text-[8pt] tracking-widest uppercase pt-2 mt-4 border-t ${cls}"><span>${t.footer ? label : ''}</span><span>${t.coords ? e.coords : ''}</span></div>` : '';
const nm = (s, base, chars, f) => Math.round(base * Math.min(1, chars / Math.max(String(s).length, 1)) * (f.w < 700 ? .82 : 1));
const leader = (l, v) => v ? `<div class="flex items-baseline gap-1 text-xs"><span class="uppercase tracking-wider">${l}</span><span class="flex-1 border-b border-dotted border-current opacity-60"></span><span class="font-bold">${v}</span></div>` : '';
const statRow = (items, o = {}) => {
  const a = items.filter(r => r[1]);
  return a.length ? `<div class="grid text-center py-3 ${o.wrap || ''}" style="grid-template-columns:repeat(${a.length},minmax(0,1fr))">` +
    a.map(([l, v], i) => `<div class="px-1 ${i ? 'border-l ' + (o.div || '') : ''}"><span class="block text-[8pt] uppercase tracking-widest ${o.l || ''}">${l}</span><span class="${o.v || 'text-base font-bold'}">${v}</span></div>`).join('') + '</div>' : '';
};

/* SVG helpers (html2canvas renders inline SVG faithfully; no blur, clip-path or background-clip) */
const flourish = (c, w = 1.5) => `<g fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"><path d="M0 70V14Q0 0 14 0H70"/><path d="M10 52V20Q10 10 20 10H52"/><path d="M20 38Q20 20 38 20"/><circle cx="6" cy="6" r="3" fill="${c}"/></g>`;
const ruler = h => {
  let o = '';
  for (let i = 0; i <= h; i += 6) { const long = i % 30 === 0; o += `<line x1="${long ? 0 : 10}" y1="${i + .5}" x2="22" y2="${i + .5}" stroke="#0a0a0a" stroke-width="${long ? 1.5 : 1}"/>`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="${h + 1}" viewBox="0 0 22 ${h + 1}" style="flex:none">${o}</svg>`;
};
const branch = (c1, c2) => {
  let o = `<path d="M0 0C6 -50 -4 -100 8 -170" fill="none" stroke="${c1}" stroke-width="2.5" stroke-linecap="round"/>`;
  for (let k = 1; k <= 6; k++) { const y = -k * 26, s = k % 2 ? 1 : -1, x = s * 13 + (k % 2 ? 2 : -2); o += `<ellipse cx="${x}" cy="${y}" rx="15" ry="5.5" fill="${c2}" transform="rotate(${-s * 35} ${x} ${y})"/>`; }
  return o + `<ellipse cx="8" cy="-178" rx="12" ry="5" fill="${c2}" transform="rotate(-90 8 -178)"/>`;
};
const rainbow = () => `<div style="position:absolute;left:0;right:0;top:6px;display:flex;justify-content:center;pointer-events:none"><svg xmlns="http://www.w3.org/2000/svg" viewBox="-170 -170 340 180" width="340" height="180" style="display:block;max-width:100%">` +
  [[150, '#c2724f'], [126, '#e3c9a8'], [102, '#9caf88'], [78, '#e8b4a0']].map(([r, c]) => `<path d="M${-r} 0A${r} ${r} 0 0 1 ${r} 0" fill="none" stroke="${c}" stroke-width="22"/>`).join('') + '</svg></div>';
const sunRays = H => {
  const R0 = H / 2 + 8, R1 = H / 2 + 34, S = Math.round(R1 * 2 + 4), n = 24; let p = '';
  for (let i = 0; i < n; i++) {
    const a1 = i * 2 * Math.PI / n, a2 = (i + 1) * 2 * Math.PI / n, am = (a1 + a2) / 2, c = S / 2;
    p += `<polygon points="${(c + R0 * Math.cos(a1)).toFixed(1)},${(c + R0 * Math.sin(a1)).toFixed(1)} ${(c + R1 * Math.cos(am)).toFixed(1)},${(c + R1 * Math.sin(am)).toFixed(1)} ${(c + R0 * Math.cos(a2)).toFixed(1)},${(c + R0 * Math.sin(a2)).toFixed(1)}" fill="${i % 2 ? '#e8742c' : '#f2b134'}"/>`;
  }
  return `<div style="position:absolute;left:0;right:0;top:0;bottom:0;display:flex;align-items:center;justify-content:center;pointer-events:none"><svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}" style="display:block;flex:none">${p}</svg></div>`;
};
const sealSVG = s => {
  let p = '';
  for (let i = 0; i < 48; i++) { const a = i * Math.PI / 24, r = i % 2 ? 40 : 46; p += `${(50 + r * Math.sin(a)).toFixed(1)},${(50 - r * Math.cos(a)).toFixed(1)} `; }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 112" width="${s}" height="${Math.round(s * 1.12)}" style="position:absolute;left:0;top:0"><polygon points="34,78 28,110 42,100 50,108 52,80" fill="#8c1c1c"/><polygon points="66,78 72,110 58,100 50,108 48,80" fill="#a32424"/><polygon points="${p}" fill="#b8892b" stroke="#8a6a2a" stroke-width="1"/><circle cx="50" cy="50" r="32" fill="#a32424" stroke="#e8c872" stroke-width="2"/><circle cx="50" cy="50" r="27" fill="none" stroke="#e8c872" stroke-width=".8" stroke-dasharray="2 2"/></svg>`;
};
const bar = (label, val, pct) => !val ? '' :
  `<div><div class="flex justify-between text-[9pt]"><span class="text-cyan-500">${label}</span><span class="text-white font-bold">${val}</span></div><div class="h-2 border border-cyan-500/40 mt-1"><div class="h-full" style="width:${Math.max(4, Math.min(100, pct))}%;background:linear-gradient(90deg,#00ffcc,#22d3ee)"></div></div></div>`;
const hexSafe = css => state.photo.shape === 'hexagon' ? '' : css;

/* Approximate moon phase from the birth date (mean synodic month, ±1 day) */
function moonPhase(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  if (!m) return null;
  const syn = 29.530588853, days = (Date.UTC(+m[1], +m[2] - 1, +m[3], 12) - Date.UTC(2000, 0, 6, 18, 14)) / 864e5;
  const p = (((days % syn) + syn) % syn) / syn;
  const names = [[.03, 'New Moon'], [.22, 'Waxing Crescent'], [.28, 'First Quarter'], [.47, 'Waxing Gibbous'], [.53, 'Full Moon'], [.72, 'Waning Gibbous'], [.78, 'Last Quarter'], [.97, 'Waning Crescent'], [1.01, 'New Moon']];
  return { p, name: names.find(n => p < n[0])[1], illum: Math.round((1 - Math.cos(2 * Math.PI * p)) / 2 * 100) };
}
function moonSVG(p, r, lit, dark) {
  const waning = p > .5, q = waning ? 1 - p : p, k = Math.cos(2 * Math.PI * q);
  const d = `M0 ${-r}A${r} ${r} 0 0 1 0 ${r}A${(Math.abs(k) * r).toFixed(2)} ${r} 0 0 ${k > 0 ? 0 : 1} 0 ${-r}Z`;
  return `<circle r="${r}" fill="${dark}"/><path d="${d}" fill="${lit}"${waning ? ' transform="scale(-1 1)"' : ''}/>`;
}

/* ---------- Templates: (e = display strings, t = toggles, f = format) ---------- */
export const TEMPLATES = {
  playful: (e, t) => `
    <div class="text-center space-y-2">
      ${show(t.accents, 1, `<div class="flex justify-center gap-3 text-amber-400 text-xl"><span>★</span><span>☁</span><span>🧸</span><span>★</span></div>`)}
      ${mono(e, t, 'border-amber-300 text-amber-800 mx-auto bg-amber-50')}
      ${show(t.name, e.firstName || e.lastName, `<h1 class="text-5xl font-bold text-amber-900 tracking-wide">${e.firstName} ${e.lastName}</h1>`)}
      ${show(t.quote, e.quote, `<p class="text-sm text-amber-700/80 font-medium italic">“${e.quote}”</p>`)}
    </div>
    <div class="my-auto py-3"><div class="p-3 bg-white rounded-3xl shadow-xl border-4 border-amber-200/60 mx-auto" style="width:fit-content;max-width:100%">${photoHTML('', .72)}</div></div>
    <div class="grid grid-cols-2 gap-3 bg-amber-50/80 p-4 rounded-2xl border-2 border-dashed border-amber-200 text-center">
      <div>${show(t.date, e.date, `<span class="block text-[9pt] font-bold text-amber-800 uppercase tracking-wider">Birth date</span><span class="text-base font-bold">${e.date}</span>`)}
           ${show(t.time, e.time, `<span class="block text-xs text-amber-700">${e.time}</span>`)}</div>
      <div>${(t.weight || t.height) ? `<span class="block text-[9pt] font-bold text-amber-800 uppercase tracking-wider">Weight &amp; height</span>` : ''}
           <span class="text-base font-bold">${[t.weight && e.weight, t.height && e.height].filter(Boolean).join(' • ')}</span></div>
    </div>
    <div class="flex justify-between items-center gap-2 text-xs text-amber-900 font-semibold pt-3">
      <div>${show(t.location, e.city, `📍 ${e.city}`)}</div><div>${show(t.parents, e.parents, `❤️ ${e.parents}`)}</div><div>${show(t.zodiac, e.zodiac, `✨ ${e.zodiac}`)}</div>
    </div>
    ${footer(e, t, 'Baby Card Printables • Little details. Forever memories.', 'border-amber-200/60 text-amber-700/60 font-bold justify-center')}`,

  boho: (e, t, f) => `
    <div class="text-center">
      <div class="text-[11pt] tracking-[6px] uppercase" style="color:#c2724f">welcome little one</div>
      ${show(t.name, e.firstName || e.lastName, `<h1 class="italic leading-none" style="font-size:${nm(e.firstName, 84, 8, f)}px;color:#5a3a2a">${e.firstName}</h1><div class="uppercase" style="font-size:${nm(e.lastName, 20, 12, f)}px;letter-spacing:.3em;color:#7d9368">${e.lastName}</div>`)}
      ${show(t.date, e.date, `<div class="mt-1 text-sm tracking-[4px] uppercase" style="color:#c2724f">✦ ${e.date} ✦</div>`)}
    </div>
    <div class="my-auto relative py-3">
      ${t.photo ? rainbow() : ''}
      ${photoHTML('border:5px solid #f4ece1;box-shadow:0 0 0 2px #c2724f;', .8)}
    </div>
    <div class="text-center space-y-2">
      <div class="flex justify-center gap-2 flex-wrap">${[t.time && e.time, t.weight && e.weight, t.height && e.height, t.zodiac && e.zodiac].filter(Boolean).map(v => `<span class="px-3 py-1 rounded-full border text-sm" style="border-color:#c2724f">${v}</span>`).join('')}</div>
      ${show(t.location, e.location, `<div class="text-sm">${e.location}${e.city ? `, ${e.city}` : ''}</div>`)}
      ${show(t.parents, e.parents, `<div class="text-base" style="color:#c2724f">With love, ${e.parents}</div>`)}
      ${show(t.quote, e.quote, `<div class="text-lg italic">“${e.quote}”</div>`)}
    </div>
    ${footer(e, t, 'Baby Card Printables • Boho Botanical', 'border-[#c2724f]/40 text-[#c2724f]')}`,

  cyber: (e, t, f) => {
    const mp = t.moon ? moonPhase(e.dateISO) : null;
    const id = e.dateISO ? `ID-${e.dateISO.replace(/-/g, '')}-${(e.time || '0000').replace(':', '')}` : 'ID-UNKNOWN';
    return `
    <div class="flex justify-between items-start gap-3">
      <div class="min-w-0"><span class="text-[8pt] text-cyan-500 block tracking-widest">[BABYCARD//SUBJECT_RECORD]</span>
        ${show(t.name, e.firstName || e.lastName, `<h1 class="uppercase text-white cyber-glow leading-none font-bold mt-1" style="font-size:${nm(e.firstName + ' ' + e.lastName, 44, 14, f)}px">${e.firstName} ${e.lastName}</h1>`)}</div>
      <div class="text-right text-[8pt] text-cyan-500 shrink-0 leading-relaxed">${id}<br><span style="color:#4ade80">● ONLINE</span></div>
    </div>
    <div class="my-auto py-3 grid grid-cols-12 gap-4 items-center">
      <div class="col-span-6">${photoHTML(hexSafe('border:1px solid #00ffcc;box-shadow:0 0 18px rgba(0,255,204,.35);'), .95)}</div>
      <div class="col-span-6 space-y-4 text-xs">
        ${bar('MASS', t.weight && e.weight, +e.weightN / 50)}
        ${bar('LENGTH', t.height && e.height, +e.heightN / 60 * 100)}
        ${show(t.time, e.time, `<div><span class="text-cyan-500 text-[9pt] block">TIME_OF_ARRIVAL</span><span class="text-white font-bold text-sm">${e.time}</span></div>`)}
        ${show(t.zodiac, e.zodiac, `<div><span class="text-cyan-500 text-[9pt] block">SIGN</span><span class="text-white font-bold text-sm">${e.zodiac}</span></div>`)}
      </div>
    </div>
    <div class="border-t border-cyan-500/40 pt-2 space-y-2 text-xs">
      <div class="grid grid-cols-2 gap-2">
        ${show(t.date, e.date, `<div><span class="text-cyan-500 text-[9pt] block">TIME_STAMP</span><span class="text-white">${e.date}</span></div>`)}
        ${show(t.location, e.location, `<div><span class="text-cyan-500 text-[9pt] block">FACILITY</span><span class="text-white">${e.location}</span></div>`)}
        ${show(t.coords, e.coords, `<div><span class="text-cyan-500 text-[9pt] block">COORDINATES</span><span class="text-white">${e.coords}</span></div>`)}
        ${show(mp, 1, `<div><span class="text-cyan-500 text-[9pt] block">LUNAR_PHASE</span><span class="text-white">${mp ? mp.name + ' ' + mp.illum + '%' : ''}</span></div>`)}
      </div>
      ${show(t.parents, e.parents, `<div><span class="text-cyan-500 text-[9pt] block">GENETIC_ORIGIN</span><span class="text-white">${e.parents}</span></div>`)}
      ${show(t.quote, e.quote, `<div><span class="text-cyan-500 text-[9pt] block">LOG_NOTE</span><span class="text-white">${e.quote}</span></div>`)}
    </div>
    ${t.footer ? `<div class="flex justify-between items-center text-[8pt] text-cyan-600 border-t border-cyan-500/30 pt-2 mt-4"><span>BABYCARDPRINTABLES_v3.0</span>${barcode(110, 20, '#0891b2')}</div>` : ''}`;
  },

  editorial: (e, t, f) => {
    const lines = [t.weight && e.weight && `Weighing in at ${e.weight}`, t.height && e.height && `Standing ${e.height} tall`, t.zodiac && e.zodiac && `Born under ${e.zodiac}`, t.time && e.time && `Arrived at ${e.time}`].filter(Boolean);
    const nameHTML = show(t.name, e.firstName || e.lastName, `<div class="font-black uppercase leading-[.9]" style="font-size:${nm(e.firstName, 74, 8, f)}px;letter-spacing:-.02em;text-shadow:0 2px 10px rgba(0,0,0,.45)">${e.firstName}</div><div class="font-light uppercase" style="font-size:${nm(e.lastName, 26, 12, f)}px;letter-spacing:.35em;text-shadow:0 2px 8px rgba(0,0,0,.45)">${e.lastName}</div>`);
    return `
    <div class="text-center">
      <div class="font-black uppercase leading-none" style="font-size:${f.w < 700 ? 62 : 92}px;letter-spacing:-.03em">Paperborn</div>
      <div class="flex justify-between text-[8pt] uppercase tracking-[3px] border-y-2 border-black mt-1 py-1 px-1"><span>The Birth Issue</span><span>${t.date ? e.date : ''}</span><span>No. 1</span></div>
    </div>
    <div class="my-auto pt-3 relative">
      ${t.photo ? `<div class="relative">${photoHTML('', 1.3)}
        <div style="position:absolute;left:0;right:0;top:0;bottom:0;background:linear-gradient(180deg,rgba(0,0,0,0) 45%,rgba(0,0,0,.75) 100%);color:#fff;display:flex;flex-direction:column;justify-content:space-between;padding:14px">
          <div class="flex justify-between items-start gap-2">
            <span class="px-2 py-1 text-[8pt] font-bold uppercase tracking-widest" style="background:#d4202a">Exclusive</span>
            <div class="text-right text-[9pt] font-bold uppercase leading-snug" style="text-shadow:0 1px 4px rgba(0,0,0,.7)">${lines.map(l => `<div>${l}</div>`).join('')}</div>
          </div>
          <div>${nameHTML}</div>
        </div></div>` : nameHTML}
    </div>
    <div class="flex justify-between items-end gap-3 mt-3 text-xs">
      <div class="min-w-0 space-y-0.5">
        ${show(t.location, e.location, `<div class="font-bold uppercase tracking-wider">${e.location}${e.city ? `, ${e.city}` : ''}</div>`)}
        ${show(t.parents, e.parents, `<div>Parents: <strong>${e.parents}</strong></div>`)}
        ${show(t.quote, e.quote, `<div class="italic text-neutral-600">“${e.quote}”</div>`)}
      </div>
      <div class="shrink-0 text-center">${barcode(96, 34, '#0a0a0a')}<div class="text-[7pt] font-mono mt-0.5">${e.dateISO ? e.dateISO.replace(/-/g, '') : ''}</div></div>
    </div>
    ${(t.footer || t.coords) ? `<div class="pt-2 mt-3 border-t border-neutral-300 flex justify-between gap-2 text-[8pt] text-neutral-400 uppercase tracking-widest"><span>${t.footer ? 'Baby Card Printables • Editorial' : ''}</span><span>${t.coords ? e.coords : ''}</span></div>` : ''}`;
  },

  celestial: (e, t, f) => {
    const mp = t.moon ? moonPhase(e.dateISO) : null, [zn, zg] = (e.zodiac || '').split(' ');
    return `
    <div class="text-center">
      <div class="text-[8pt] tracking-[8px] uppercase" style="color:#e8c872">Written in the stars</div>
      ${show(t.name, e.firstName || e.lastName, `<h1 class="leading-none mt-2" style="font-size:${nm(e.firstName, 66, 9, f)}px;letter-spacing:.06em;text-shadow:0 0 18px rgba(232,200,114,.5)">${e.firstName}</h1><div class="uppercase mt-1" style="color:#e8c872;font-size:${nm(e.lastName, 20, 12, f)}px;letter-spacing:.5em">${e.lastName}</div>`)}
      ${show(t.date, e.date, `<div class="mt-2 text-[9pt] tracking-[5px] uppercase opacity-80">${e.date}${t.time && e.time ? ' · ' + e.time : ''}</div>`)}
    </div>
    <div class="my-auto py-3">${t.photo ? `<div class="mx-auto" style="padding:6px;width:fit-content;max-width:100%;border:2px solid #e8c872;border-radius:${SHAPES[state.photo.shape].radius}">${photoHTML('', .8)}</div>` : ''}</div>
    <div>
      <div class="flex justify-center items-center gap-8 mb-2">
        ${show(t.zodiac, zn, `<div class="text-center"><div style="font-size:38px;color:#e8c872;line-height:1">${zg || ''}</div><div class="text-[8pt] tracking-[4px] mt-1">${zn}</div></div>`)}
        ${mp ? `<div class="text-center"><svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="-22 -22 44 44" style="display:inline-block">${moonSVG(mp.p, 19, '#f3ecd8', '#1b1f45')}<circle r="19" fill="none" stroke="#e8c872" stroke-opacity=".7"/></svg><div class="text-[8pt] tracking-[3px] uppercase mt-1">${mp.name} · ${mp.illum}%</div></div>` : ''}
      </div>
      ${statRow([['Weight', t.weight && e.weight], ['Length', t.height && e.height]], { wrap: 'border-t border-b border-[#e8c872]/40', div: 'border-[#e8c872]/30', l: 'opacity-60', v: 'text-base font-bold' })}
      <div class="text-center text-xs space-y-1 mt-3 opacity-90">
        ${show(t.location, e.location, `<div>${e.location}${e.city ? ` • ${e.city}` : ''}</div>`)}
        ${show(t.parents, e.parents, `<div style="color:#e8c872" class="tracking-widest">${e.parents}</div>`)}
        ${show(t.quote, e.quote, `<div class="italic">“${e.quote}”</div>`)}
      </div>
    </div>
    ${footer(e, t, 'Baby Card Printables • Celestial', 'border-[#e8c872]/40 text-[#e8c872]')}`;
  },

  certificate: (e, t, f) => {
    const names = (e.parents || '').split(/\s*(?:&amp;|&|\band\b|,)\s*/i).filter(Boolean).slice(0, 2);
    const loc = t.location ? [e.location, e.city].filter(Boolean).join(', ') : '';
    const body = [
      `was born ${[t.date && e.date && `on <b>${e.date}</b>`, t.time && e.time && `at <b>${e.time}</b>`].filter(Boolean).join(' ')}`.trim(),
      [t.weight && e.weight && `weighing <b>${e.weight}</b>`, t.height && e.height && `measuring <b>${e.height}</b>`].filter(Boolean).join(' and '),
      loc && `at <b>${loc}</b>`,
      t.parents && e.parents && `to proud parents <b>${e.parents}</b>`,
    ].filter(l => l && l !== 'was born');
    return `
    <div class="text-center" style="padding-top:${t.border ? 10 : 0}px">
      <div class="text-[9pt] tracking-[8px] uppercase" style="color:#8a6a2a">✦ Official Record ✦</div>
      <h1 class="font-bold uppercase leading-tight" style="font-size:${f.w < 700 ? 24 : 32}px;letter-spacing:.1em">Certificate of Birth</h1>
      <div style="height:1px;background:#8a6a2a;width:140px;margin:8px auto"></div>
      <div class="italic text-sm">This is to certify that</div>
      ${show(t.name, e.firstName || e.lastName, `<div class="font-bold uppercase" style="font-size:${nm(e.firstName + ' ' + e.lastName, 34, 16, f)}px;letter-spacing:.06em;color:#5c3d0e">${[e.firstName, e.lastName].filter(Boolean).join(' ')}</div>`)}
      <div class="text-sm mt-1 leading-relaxed">${body.join('<br>')}</div>
    </div>
    <div class="my-auto py-2"><div style="width:62%;margin:0 auto">${photoHTML('border:3px double #8a6a2a;', .72)}</div></div>
    <div>
      <div class="flex items-end justify-between gap-4">
        <div class="flex-1 text-center"><div class="pt-1 text-[8pt] uppercase tracking-widest" style="border-top:1px solid #3a2c14">${names[0] || 'Parent'}</div></div>
        <div class="relative flex-none" style="width:84px;height:94px">${sealSVG(84)}<div style="position:absolute;left:0;top:0;width:84px;height:84px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:20px;letter-spacing:.05em">${e.monogram || 'PB'}</div></div>
        <div class="flex-1 text-center"><div class="pt-1 text-[8pt] uppercase tracking-widest" style="border-top:1px solid #3a2c14">${names[1] || 'Parent'}</div></div>
      </div>
      ${show(t.zodiac, e.zodiac, `<div class="text-center text-[8pt] tracking-widest uppercase mt-3 opacity-70">Born under the sign of ${e.zodiac}</div>`)}
      ${show(t.quote, e.quote, `<div class="text-center italic text-sm mt-2">“${e.quote}”</div>`)}
    </div>
    ${footer(e, t, 'Registered • Baby Card Printables', 'border-[#8a6a2a]/50 opacity-80')}`;
  },

  colorblock: (e, t, f) => {
    const big = (label, n, unit) => n ? `<div><div class="text-[8pt] font-black uppercase tracking-[3px]">${label}</div><div class="leading-none"><span class="font-black" style="font-size:${f.w < 700 ? 42 : 56}px">${n}</span><span class="font-bold text-lg ml-1">${unit}</span></div></div>` : '';
    return `
    <div>
      <div class="text-[9pt] font-black uppercase tracking-[5px]">Birth announcement</div>
      ${show(t.name, e.firstName || e.lastName, `<h1 class="font-black uppercase leading-[.88] mt-2" style="letter-spacing:-.03em"><span class="block" style="font-size:${nm(e.firstName, 78, 8, f)}px">${e.firstName}</span><span class="block" style="font-size:${nm(e.lastName, 78, 8, f)}px;color:#e0603c">${e.lastName}</span></h1>`)}
      ${show(t.date, e.date, `<span class="inline-block mt-4 px-4 py-1 rounded-full text-white font-bold text-sm" style="background:#1d2a44">${e.date}${t.time && e.time ? ' · ' + e.time : ''}</span>`)}
    </div>
    <div class="my-auto py-4 grid grid-cols-12 gap-4 items-center">
      <div class="col-span-7 pl-3 pb-3">${photoHTML('box-shadow:-12px 12px 0 #e0603c;', .95)}</div>
      <div class="col-span-5 space-y-4">
        ${big('Weight', t.weight && e.weightN, 'g')}${big('Height', t.height && e.heightN, 'cm')}
        ${stat('Sign', t.zodiac && e.zodiac, '', { v: 'text-sm font-bold uppercase' })}
      </div>
    </div>
    <div class="flex justify-between items-end gap-3 text-xs font-bold">
      <div class="min-w-0">${show(t.location, e.location, `<div class="uppercase tracking-wider">${e.location}${e.city ? `, ${e.city}` : ''}</div>`)}${show(t.quote, e.quote, `<div class="italic font-normal mt-0.5">“${e.quote}”</div>`)}</div>
      ${show(t.parents, e.parents, `<div class="text-right uppercase tracking-wider">${e.parents}</div>`)}
    </div>
    ${footer(e, t, 'Baby Card Printables • Color Block', 'border-[#1d2a44]/40')}`;
  },
};

/* ---------- Card-level decoration (behind the content) ---------- */
export const DECOR = {
  playful: t => !t.accents ? '' :
    `<div style="position:absolute;top:-80px;left:-80px;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(251,207,232,.85),rgba(251,207,232,0) 70%)"></div>
     <div style="position:absolute;bottom:-90px;right:-90px;width:340px;height:340px;border-radius:50%;background:radial-gradient(circle,rgba(186,230,253,.85),rgba(186,230,253,0) 70%)"></div>`,

  boho: (t, f) => !t.accents ? '' : svgLayer(f,
    `<g transform="translate(30 ${f.h - 34}) rotate(6) scale(.62)">${branch('#7d9368', '#9caf88')}</g>` +
    `<g transform="translate(${f.w - 30} ${f.h - 34}) rotate(-6) scale(-.62 .62)">${branch('#c2724f', '#e3c9a8')}</g>` +
    `<g transform="translate(30 34) rotate(186) scale(.62)">${branch('#c2724f', '#e8b4a0')}</g>` +
    `<g transform="translate(${f.w - 30} 34) rotate(-186) scale(-.62 .62)">${branch('#7d9368', '#9caf88')}</g>`),

  cyber: (t, f) => svgLayer(f,
    `<defs><pattern id="cg" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#00ffcc" stroke-opacity=".09"/></pattern>
     <pattern id="cs" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="1" fill="#000" fill-opacity=".28"/></pattern>
     <radialGradient id="cv" cx="50%" cy="50%" r="75%"><stop offset="60%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".7"/></radialGradient></defs>
     <rect width="${f.w}" height="${f.h}" fill="url(#cg)"/>` +
    (t.accents ? `<g fill="none" stroke="#00ffcc" stroke-opacity=".13">${[110, 180, 250, 320].map(r => `<circle cx="${f.w / 2}" cy="${f.h * .45}" r="${r}"/>`).join('')}<path d="M${f.w / 2} ${f.h * .45 - 330}V${f.h * .45 + 330}M${f.w / 2 - 330} ${f.h * .45}H${f.w / 2 + 330}"/></g>` +
      corners(f, '<path d="M0 34V0H34" fill="none" stroke="#00ffcc" stroke-width="2"/>', 22) : '') +
    `<rect width="${f.w}" height="${f.h}" fill="url(#cs)"/><rect width="${f.w}" height="${f.h}" fill="url(#cv)"/>`),

  celestial: (t, f) => {
    const r = prng(42), cx = f.w / 2, cy = f.h * .46; let s =
      `<defs><linearGradient id="cb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070a22"/><stop offset=".55" stop-color="#14154a"/><stop offset="1" stop-color="#241a52"/></linearGradient>
       <radialGradient id="cg2"><stop offset="0" stop-color="#e8c872" stop-opacity=".22"/><stop offset="1" stop-color="#e8c872" stop-opacity="0"/></radialGradient></defs>
       <rect width="${f.w}" height="${f.h}" fill="url(#cb)"/><circle cx="${cx}" cy="${cy}" r="${f.w * .45}" fill="url(#cg2)"/>`;
    if (t.accents) {
      for (let i = 0; i < 110; i++) {
        const x = r() * f.w, y = r() * f.h, k = r(), a = .25 + r() * .6, q = r();
        s += k > .88 ? sparkle(x, y, 3 + q * 5, '#f3ecd8', .5 + a / 2) : `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(.6 + q * 1.4).toFixed(1)}" fill="#f3ecd8" opacity="${a.toFixed(2)}"/>`;
      }
      [[.40, .14, -18, 1.0], [.33, .11, 24, 3.6]].forEach(([a, b, rot, ang]) => {
        const rx = f.w * a, ry = f.w * b;
        s += `<g transform="rotate(${rot} ${cx} ${cy})" fill="none" stroke="#e8c872" stroke-opacity=".3"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/><circle cx="${(cx + rx * Math.cos(ang)).toFixed(1)}" cy="${(cy + ry * Math.sin(ang)).toFixed(1)}" r="6" fill="#e8c872" stroke="none"/></g>`;
      });
      const u = Math.min(f.w / 794, f.h / 1123), W = f.w, H = f.h;
      const constel = pts => `<g stroke="#e8c872" stroke-opacity=".38" stroke-width="1"><path d="M${pts.map(([x, y]) => `${(x * W).toFixed(1)} ${(y * H).toFixed(1)}`).join('L')}" fill="none"/></g>` +
        pts.map(([x, y]) => `<circle cx="${(x * W).toFixed(1)}" cy="${(y * H).toFixed(1)}" r="${(2.6 * u).toFixed(1)}" fill="#f3ecd8"/>`).join('');
      s += `<defs><radialGradient id="cgm"><stop offset="0" stop-color="#f3e3b0" stop-opacity=".35"/><stop offset="1" stop-color="#f3e3b0" stop-opacity="0"/></radialGradient>
          <linearGradient id="cgs" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f3ecd8" stop-opacity="0"/><stop offset="1" stop-color="#f3ecd8" stop-opacity=".9"/></linearGradient></defs>
        <circle cx="${(W * .13).toFixed(1)}" cy="${(H * .1).toFixed(1)}" r="${(70 * u).toFixed(1)}" fill="url(#cgm)"/>${crescent(W * .13, H * .1, 30 * u, '#f3e3b0')}
        ${constel([[.7, .08], [.76, .12], [.83, .1], [.88, .16], [.82, .21]])}${constel([[.07, .7], [.13, .74], [.11, .81], [.18, .85]])}
        <path d="M${(W * .4).toFixed(1)} ${(H * .14).toFixed(1)}L${(W * .55).toFixed(1)} ${(H * .05).toFixed(1)}" stroke="url(#cgs)" stroke-width="${(2 * u).toFixed(1)}" stroke-linecap="round"/>
        ${cloud(W * .1, H - 40 * u, 1.1 * u, .9, '#1f2366', '#2d3285', '#151848')}${cloud(W * .9, H - 52 * u, .9 * u, .85, '#1f2366', '#2d3285', '#151848')}`;
    }
    return svgLayer(f, s);
  },

  certificate: (t, f) => {
    const w = f.w, h = f.h, m = 34;
    let s = `<g transform="translate(${w / 2} ${h / 2})" fill="none" stroke="#8a6a2a" opacity=".07">${[220, 190, 160, 130].map((r, i) => `<circle r="${r}" stroke-width="${i % 2 ? 1 : 4}"/>`).join('')}</g>`;
    if (t.border) {
      const waves = [0, Math.PI].flatMap(ph => [wavePath(m + 12, m, w - m - 12, m, 5, 26, ph), wavePath(m + 12, h - m, w - m - 12, h - m, 5, 26, ph), wavePath(m, m + 12, m, h - m - 12, 5, 26, ph), wavePath(w - m, m + 12, w - m, h - m - 12, 5, 26, ph)]);
      s += `<rect x="${m - 12}" y="${m - 12}" width="${w - 2 * m + 24}" height="${h - 2 * m + 24}" fill="none" stroke="#8a6a2a" stroke-width="3"/>
        <rect x="${m + 12}" y="${m + 12}" width="${w - 2 * m - 24}" height="${h - 2 * m - 24}" fill="none" stroke="#8a6a2a" stroke-width="1"/>
        <g fill="none" stroke="#8a6a2a" stroke-width="1" opacity=".85">${waves.map(d => `<path d="${d}"/>`).join('')}</g>` +
        corners(f, '<rect x="-5" y="-5" width="10" height="10" transform="rotate(45)" fill="#8a6a2a"/>', m);
    }
    return svgLayer(f, s);
  },

  colorblock: (t, f) => {
    if (!t.accents) return '';
    let dots = '';
    for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) dots += `<circle cx="${f.w * .55 + i * 16}" cy="${f.h * .30 + j * 16}" r="2.2"/>`;
    return svgLayer(f,
      `<circle cx="${f.w - 30}" cy="140" r="${f.w * .26}" fill="#f4b6a6"/>
       <path d="M0 ${f.h} V${f.h - 250} A250 250 0 0 1 250 ${f.h} Z" fill="#f2b84b"/>
       <rect x="${f.w - 64}" y="${f.h * .5}" width="64" height="${f.h * .28}" rx="32" fill="#8fb7a3"/>
       <polygon points="${f.w * .1},${f.h * .49} ${f.w * .1 + 58},${f.h * .49} ${f.w * .1 + 29},${f.h * .49 - 50}" fill="#1d2a44"/>
       <g fill="#1d2a44" opacity=".35">${dots}</g>
       <path d="M${f.w * .62} 72q14 -18 28 0t28 0t28 0t28 0" fill="none" stroke="#1d2a44" stroke-width="3" stroke-linecap="round"/>`);
  },
};
