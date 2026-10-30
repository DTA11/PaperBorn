/* Baby shower game sheets: bingo, predictions, advice cards. One layout per game, coloured by theme tokens. */
import { esc, shuffle, prng } from '../../core/util.js';
import { theme } from '../../core/state.js';
import { svgLayer, sparkle, starPath, heartPath } from '../../core/svg.js';

const TITLES = { bingo: 'Baby Shower Bingo', predictions: 'Baby Predictions', advice: 'Advice for the New Parents' };
const title = (dv) => (dv.title || '').trim() || TITLES[dv.game] || TITLES.bingo;
const sz = (f, k) => Math.round(f.w * k);
const fit = (s, base, n) => Math.round(base * Math.min(1, n / Math.max(String(s).length, 1)));

function header(dv, f, th, small) {
  const T = title(dv), k = small ? .6 : 1;
  return `<div class="text-center" style="flex:none;padding-bottom:${small ? 6 : 12}px">
    <div style="font-size:${fit(T, sz(f, .075) * k, 18)}px;line-height:1.05;font-weight:800;color:${th.acc}">${esc(T)}</div>
    ${dv.honoree ? `<div style="font-size:${Math.round(sz(f, .03) * (small ? .8 : 1))}px;margin-top:4px;letter-spacing:.14em;text-transform:uppercase;opacity:.85">${esc(dv.honoree)}</div>` : ''}
  </div>`;
}

function bingo(dv, f, th, page) {
  const items = dv.list || [];
  const order = shuffle(items.slice(), (+dv.seed || 1) * 1000 + page * 7919 + 13).slice(0, 24);
  while (order.length < 24) order.push('');
  order.splice(12, 0, '__FREE__');
  const fs = Math.round(f.w / 38);
  const letters = 'BINGO'.split('').map(c => `<div style="display:flex;align-items:center;justify-content:center;background:${th.acc};color:${th.bg};font-weight:900;font-size:${Math.round(f.w / 20)}px;border-radius:8px">${c}</div>`).join('');
  const cells = order.map(s => {
    if (s === '__FREE__') return `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;background:${th.acc};color:${th.bg};border-radius:8px;text-align:center;font-weight:900;font-size:${Math.round(fs * 1.3)}px;line-height:1.05"><div style="font-size:${Math.round(fs * 1.6)}px;line-height:1">&#9733;</div>${esc(dv.free || 'FREE')}</div>`;
    const k = s.length > 20 ? .72 : s.length > 12 ? .86 : 1;
    return `<div style="display:flex;align-items:center;justify-content:center;text-align:center;background:${th.soft};border:2px solid ${th.line};border-radius:8px;padding:4px;overflow:hidden;font-size:${Math.round(fs * k)}px;line-height:1.12;font-weight:600;word-break:break-word">${esc(s)}</div>`;
  }).join('');
  return `${header(dv, f, th)}
  <div style="flex:1;min-height:0;display:flex;align-items:center;justify-content:center">
    <div style="height:100%;max-width:100%;aspect-ratio:5/5.7;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));grid-template-rows:.7fr repeat(5,1fr);gap:6px">${letters}${cells}</div>
  </div>
  <div class="text-center" style="flex:none;padding-top:8px;font-size:${Math.round(fs * .75)}px;letter-spacing:.2em;text-transform:uppercase;opacity:.6">Mark the gifts as they are opened · first to get 5 in a row wins</div>`;
}

const GRID = { 1: [1, 1], 2: [1, 2], 4: [2, 2] };

function cardsPage(dv, f, th, body) {
  const [cols, rows] = GRID[+dv.perPage] || GRID[1], n = cols * rows;
  const cells = Array.from({ length: n }, () => `<div style="min-height:0;min-width:0;display:flex;flex-direction:column;box-sizing:border-box;padding:${n === 1 ? 14 : 12}px;border:2px solid ${th.line};border-radius:14px;background:${th.soft}">${body(n)}</div>`).join('');
  return `<div style="flex:1;min-height:0;display:grid;grid-template-columns:repeat(${cols},minmax(0,1fr));grid-template-rows:repeat(${rows},minmax(0,1fr));gap:12px">${cells}</div>`;
}

function predictions(dv, f, th) {
  const rows = dv.promptList || [];
  return cardsPage(dv, f, th, n => `${header(dv, f, th, n > 1)}
    <div style="flex:1;min-height:0;display:flex;flex-direction:column;justify-content:space-between;gap:4px;font-size:${Math.round(sz(f, .026) * (n === 1 ? 1.1 : n === 2 ? .9 : .72))}px">
      ${rows.map(r => `<div style="display:flex;align-items:flex-end;gap:8px;flex:1;min-height:0"><span style="font-weight:700;white-space:nowrap">${esc(r)}</span><span style="flex:1;border-bottom:2px solid ${th.line};height:1px;margin-bottom:6px"></span></div>`).join('')}
    </div>`);
}

function advice(dv, f, th) {
  return cardsPage(dv, f, th, n => {
    const lines = n === 1 ? 11 : n === 2 ? 6 : 3, fs = Math.round(sz(f, .026) * (n === 1 ? 1.1 : n === 2 ? .9 : .72));
    return `${header(dv, f, th, n > 1)}
    <div style="flex:1;min-height:0;display:flex;flex-direction:column;justify-content:space-between;font-size:${fs}px">
      <div style="display:flex;align-items:flex-end;gap:8px;flex:none;padding-bottom:4px"><span style="font-weight:700">${esc(dv.advicePrompt || 'My advice:')}</span></div>
      ${Array.from({ length: lines }, () => `<div style="flex:1;min-height:0;border-bottom:2px solid ${th.line}"></div>`).join('')}
      <div style="display:flex;align-items:flex-end;gap:8px;flex:none;padding-top:8px"><span style="font-weight:700">From:</span><span style="flex:1;border-bottom:2px solid ${th.line};height:1px;margin-bottom:5px"></span></div>
    </div>`;
  });
}

function make() {
  return (e, t, f, dv, page) => {
    const th = theme();
    const g = dv.game === 'predictions' ? predictions : dv.game === 'advice' ? advice : bingo;
    return g(dv, f, th, page);
  };
}

export const TEMPLATES = { blossom: make(), confetti: make(), mono: make(), boho: make(), starry: make() };

const rnd = (seed, n, f) => { const r = prng(seed); return Array.from({ length: n }, () => [r() * f.w, r() * f.h, r()]); };

export const DECOR = {
  blossom: (t, f) => !t.accents ? '' : svgLayer(f, [[.06, .05, 54], [.95, .08, 40], [.04, .95, 44], [.96, .93, 58]].map(([x, y, r]) => {
    const cx = f.w * x, cy = f.h * y; let s = '';
    for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; s += `<circle cx="${(cx + Math.cos(a) * r * .5).toFixed(1)}" cy="${(cy + Math.sin(a) * r * .5).toFixed(1)}" r="${(r * .36).toFixed(1)}" fill="#f6b8cb" opacity=".75"/>`; }
    return s + `<circle cx="${cx}" cy="${cy}" r="${r * .22}" fill="#f7d774"/>`;
  }).join('')),
  confetti: (t, f) => !t.accents ? '' : svgLayer(f, rnd(5, 46, f).map(([x, y, r], i) => {
    const c = ['#ff6b6b', '#ffd166', '#4ecdc4', '#6c8cff', '#c77dff'][i % 5];
    return i % 3 === 0 ? `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${6 + r * 8}" height="${3 + r * 4}" fill="${c}" transform="rotate(${(r * 180).toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)})" opacity=".85"/>` : `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${3 + r * 4}" fill="${c}" opacity=".85"/>`;
  }).join('')),
  mono: (t, f) => !t.accents ? '' : svgLayer(f, `<rect x="14" y="14" width="${f.w - 28}" height="${f.h - 28}" fill="none" stroke="#111" stroke-width="2"/><rect x="20" y="20" width="${f.w - 40}" height="${f.h - 40}" fill="none" stroke="#111" stroke-width=".8"/>`),
  boho: (t, f) => !t.accents ? '' : svgLayer(f,
    `<g fill="#ead7bd"><path d="M0 ${f.h} V${f.h - 150} A110 150 0 0 1 220 ${f.h - 150} V${f.h} Z" opacity=".7"/><path d="M${f.w} 0 V150 A110 150 0 0 1 ${f.w - 220} 150 V0 Z" opacity=".7"/></g>
     <g fill="#c0714f" opacity=".75"><circle cx="${f.w - 70}" cy="${f.h - 70}" r="34"/></g><g fill="none" stroke="#7d8f69" stroke-width="3" opacity=".7"><path d="M60 40 Q80 80 60 120 M60 60 L40 75 M60 85 L82 98"/></g>`),
  starry: (t, f) => !t.accents ? '' : svgLayer(f, rnd(9, 40, f).map(([x, y, r], i) => i % 4 === 0 ? sparkle(x, y, 6 + r * 8, '#f5c76a', .9) : `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(1 + r * 2).toFixed(1)}" fill="#f8f2dc" opacity=".7"/>`).join('') + `<path d="M${f.w - 70} 70 a30 30 0 1 0 28 40 a24 24 0 1 1 -28 -40Z" fill="#f5c76a" opacity=".85"/>`),
};
