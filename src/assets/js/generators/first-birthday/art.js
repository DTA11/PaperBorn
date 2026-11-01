/* Birthday pictures: party hat, cake with candle, bunting, confetti and the painted birthday number.
   Same rules as core/art.js: plain SVG strings, sizes in the caller's units, ids prefixed so several cards can share a page. */
import { DIGITS } from '../milestones/numerals.js';
import { prng } from '../../core/util.js';

/* Striped cone hat with a pompom. Drawn for the animals' shared pose box (head centre at 0,0, head about 115 wide). */
export const partyHat = (p, c1, c2, pom = '#fff6d8', rot = 14) => `<g transform="translate(10 -46) rotate(${rot})">
  <defs><clipPath id="${p}hc"><path d="M-26 0 L0 -66 L26 0Z"/></clipPath></defs>
  <path d="M-26 0 L0 -66 L26 0Z" fill="${c1}" stroke="${c2}" stroke-width="1.6" stroke-linejoin="round"/>
  <g clip-path="url(#${p}hc)" fill="${c2}" opacity=".55"><path d="M-40 -14 L40 -34 L40 -26 L-40 -6Z"/><path d="M-40 -38 L40 -58 L40 -50 L-40 -30Z"/></g>
  <g fill="#fff" opacity=".8"><circle cx="-8" cy="-22" r="2.4"/><circle cx="7" cy="-44" r="2"/><circle cx="10" cy="-12" r="2.2"/></g>
  <ellipse cx="0" cy="0" rx="30" ry="6" fill="${c2}"/>
  <circle cx="0" cy="-68" r="9" fill="${pom}" stroke="${c2}" stroke-width="1.4"/></g>`;

/* Hanging flag garland from (x1,y1) to (x2,y2), sagging by `sag`, n flags of height h */
export function bunting(x1, y1, x2, y2, sag, n, h, colors, line = '#b9ab98') {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 + sag;
  const pt = t => [(1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * mx + t * t * x2, (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * my + t * t * y2];
  let flags = '';
  for (let i = 0; i < n; i++) {
    const a = pt((i + .12) / n), b = pt((i + .88) / n), c = pt((i + .5) / n);
    flags += `<path d="M${a[0].toFixed(1)} ${a[1].toFixed(1)} L${b[0].toFixed(1)} ${b[1].toFixed(1)} L${c[0].toFixed(1)} ${(c[1] + h).toFixed(1)}Z" fill="${colors[i % colors.length]}" stroke="${line}" stroke-width=".8" stroke-linejoin="round"/>`;
  }
  return `<path d="M${x1} ${y1} Q${mx.toFixed(1)} ${(my * 2 - (y1 + y2) / 2).toFixed(1)} ${x2} ${y2}" fill="none" stroke="${line}" stroke-width="1.4"/>${flags}`;
}

/* Scattered confetti in a w×h box, thinned out inside `keep` boxes ([x,y,w,h], where the words go). */
export function confetti(w, h, n, colors, seed = 7, keep = [], s = 1) {
  const r = prng(seed);
  let out = '';
  for (let i = 0, tries = 0; i < n && tries < n * 6; tries++) {
    const x = r() * w, y = r() * h;
    if (keep.some(([kx, ky, kw, kh]) => x > kx && x < kx + kw && y > ky && y < ky + kh)) continue;
    const c = colors[i % colors.length], rot = Math.round(r() * 180), k = (.7 + r() * .6) * s, kind = i % 4;
    out += kind === 0 ? `<rect x="${(x - 5 * k).toFixed(1)}" y="${(y - 2.5 * k).toFixed(1)}" width="${(10 * k).toFixed(1)}" height="${(5 * k).toFixed(1)}" rx="${(1.2 * k).toFixed(1)}" fill="${c}" transform="rotate(${rot} ${x.toFixed(1)} ${y.toFixed(1)})"/>`
      : kind === 1 ? `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(3.4 * k).toFixed(1)}" fill="${c}"/>`
      : kind === 2 ? `<path d="M${(x - 8 * k).toFixed(1)} ${y.toFixed(1)} q${(4 * k).toFixed(1)} ${(-6 * k).toFixed(1)} ${(8 * k).toFixed(1)} 0 t${(8 * k).toFixed(1)} 0" fill="none" stroke="${c}" stroke-width="${(2.4 * k).toFixed(1)}" stroke-linecap="round" transform="rotate(${rot} ${x.toFixed(1)} ${y.toFixed(1)})"/>`
      : `<path d="M${x.toFixed(1)} ${(y - 5 * k).toFixed(1)} l${(4.5 * k).toFixed(1)} ${(8 * k).toFixed(1)} h${(-9 * k).toFixed(1)}Z" fill="${c}" transform="rotate(${rot} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
    i++;
  }
  return out;
}

/* Painted number (Fredoka outlines) with a soft watercolor fill. Returns { svg, w } for a number whose baseline
   sits at (x, y) and whose cap height is about `H`. `wf` is the watercolor filter id. */
export function paintedNumber(p, str, x, y, H, cols, edge, wf) {
  const ds = String(str).split('').map(c => DIGITS[c]).filter(Boolean);
  const F = H / .7, em = ds.reduce((a, d) => a + d.w, 0) / 1000, w = em * F;
  let xx = x;
  const paths = ds.map(d => { const o = `<path transform="translate(${xx.toFixed(1)} ${y.toFixed(1)}) scale(${(F / 1000).toFixed(4)})" d="${d.d}"/>`; xx += d.w / 1000 * F; return o; }).join('');
  const svg = `<defs><clipPath id="${p}nc">${paths}</clipPath>
    <linearGradient id="${p}ng" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="${cols[0]}"/><stop offset=".55" stop-color="${cols[1]}"/><stop offset="1" stop-color="${cols[2]}"/></linearGradient>
    <filter id="${p}nb" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${(H * .03).toFixed(1)}"/></filter></defs>
    <g filter="url(#${wf})"><g clip-path="url(#${p}nc)">
      <rect x="${(x - 10).toFixed(1)}" y="${(y - H * 1.1).toFixed(1)}" width="${(w + 20).toFixed(1)}" height="${(H * 1.2).toFixed(1)}" fill="url(#${p}ng)"/>
      <g filter="url(#${p}nb)" opacity=".6"><ellipse cx="${(x + w * .4).toFixed(1)}" cy="${(y - H * .75).toFixed(1)}" rx="${(w * .35).toFixed(1)}" ry="${(H * .12).toFixed(1)}" fill="${cols[0]}"/>
        <ellipse cx="${(x + w * .6).toFixed(1)}" cy="${(y - H * .3).toFixed(1)}" rx="${(w * .3).toFixed(1)}" ry="${(H * .15).toFixed(1)}" fill="${cols[2]}"/></g>
      <g fill="none" stroke="${edge}" stroke-width="${(H * .025).toFixed(1)}" opacity=".35">${paths}</g>
    </g></g>`;
  return { svg, w };
}

/* Two-tier cake on a stand with drips, sprinkles and a number candle. Origin at the bottom centre of the stand;
   about 300 wide and 330 tall at s = 1 (candle included). */
export function cake(p, s, P, number = '1') {
  const sp = prng(11), sprinkles = Array.from({ length: 26 }, (_, i) => {
    const tier = i % 2, x = (tier ? -70 : -110) + sp() * (tier ? 140 : 220), y = tier ? -200 + sp() * 50 : -110 + sp() * 60;
    return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="7" height="2.6" rx="1.3" fill="${P.sprinkles[i % P.sprinkles.length]}" transform="rotate(${Math.round(sp() * 180)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
  }).join('');
  const drips = (x0, x1, y, n) => { let d = `M${x0} ${y}`; const step = (x1 - x0) / n; for (let i = 0; i < n; i++) { const a = x0 + i * step, depth = 10 + (i * 37 % 13); d += ` L${(a + step * .2).toFixed(1)} ${y} Q${(a + step * .2).toFixed(1)} ${y + depth} ${(a + step * .5).toFixed(1)} ${y + depth} Q${(a + step * .8).toFixed(1)} ${y + depth} ${(a + step * .8).toFixed(1)} ${y}`; } return d + ` L${x1} ${y} L${x1} ${y - 14} L${x0} ${y - 14}Z`; };
  const D = DIGITS[String(number)[0]] || DIGITS['1'], cw = D.w * .09;
  return `<g transform="scale(${s})">
    <defs><linearGradient id="${p}ck" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${P.cake[1]}"/><stop offset=".35" stop-color="${P.cake[0]}"/><stop offset="1" stop-color="${P.cake[1]}"/></linearGradient>
      <linearGradient id="${p}c2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${P.cake2[1]}"/><stop offset=".35" stop-color="${P.cake2[0]}"/><stop offset="1" stop-color="${P.cake2[1]}"/></linearGradient>
      <radialGradient id="${p}fl" cx=".5" cy=".65" r=".6"><stop offset="0" stop-color="#fff7c8"/><stop offset=".55" stop-color="#ffd166"/><stop offset="1" stop-color="#f4a340" stop-opacity="0"/></radialGradient></defs>
    <ellipse cx="0" cy="-2" rx="150" ry="10" fill="#000" opacity=".06"/>
    <path d="M-40 0 L-24 -26 L24 -26 L40 0Z" fill="${P.stand[1]}"/><ellipse cx="0" cy="-28" rx="140" ry="12" fill="${P.stand[0]}" stroke="${P.stand[1]}" stroke-width="1.5"/>
    <rect x="-120" y="-130" width="240" height="100" rx="14" fill="url(#${p}ck)"/>
    <path d="${drips(-120, 120, -116, 8)}" fill="${P.icing}"/><rect x="-124" y="-136" width="248" height="22" rx="11" fill="${P.icing}"/>
    <g fill="${P.dots}">${[-90, -50, -10, 30, 70, 104].map((x, i) => `<circle cx="${x}" cy="${i % 2 ? -66 : -76}" r="5"/>`).join('')}</g>
    <rect x="-80" y="-212" width="160" height="78" rx="12" fill="url(#${p}c2)"/>
    <path d="${drips(-80, 80, -200, 6)}" fill="${P.icing}"/><rect x="-84" y="-218" width="168" height="20" rx="10" fill="${P.icing}"/>
    ${sprinkles}
    <g transform="translate(${(-cw / 2).toFixed(1)} -214) scale(.09)"><path d="${D.d}" fill="${P.candle}" stroke="#fff" stroke-width="30"/></g>
    <line x1="0" y1="-280" x2="0" y2="-292" stroke="#6b5a4a" stroke-width="2.4" stroke-linecap="round"/>
    <ellipse cx="0" cy="-306" rx="16" ry="24" fill="url(#${p}fl)"/><path d="M0 -322 C8 -310 8 -298 0 -292 C-8 -298 -8 -310 0 -322Z" fill="#ffb347"/><path d="M0 -312 C4 -306 4 -300 0 -296 C-4 -300 -4 -306 0 -312Z" fill="#fff4c2"/>
  </g>`;
}
