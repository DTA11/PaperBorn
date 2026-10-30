/* Generic SVG helpers shared by all generators.
   (html2canvas renders inline SVG faithfully; it ignores blur, clip-path and background-clip.) */
import { prng } from './util.js';

export const svgLayer = (f, inner) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${f.w} ${f.h}" width="${f.w}" height="${f.h}" style="position:absolute;left:0;top:0;pointer-events:none">${inner}</svg>`;

export const sparkle = (x, y, r, fill, op = 1) =>
  `<path d="M${x.toFixed(1)} ${(y - r).toFixed(1)}Q${x.toFixed(1)} ${y.toFixed(1)} ${(x + r).toFixed(1)} ${y.toFixed(1)}Q${x.toFixed(1)} ${y.toFixed(1)} ${x.toFixed(1)} ${(y + r).toFixed(1)}Q${x.toFixed(1)} ${y.toFixed(1)} ${(x - r).toFixed(1)} ${y.toFixed(1)}Q${x.toFixed(1)} ${y.toFixed(1)} ${x.toFixed(1)} ${(y - r).toFixed(1)}Z" fill="${fill}" opacity="${op.toFixed(2)}"/>`;

export const corners = (f, inner, m = 26) => [[m, m, 1, 1], [f.w - m, m, -1, 1], [m, f.h - m, 1, -1], [f.w - m, f.h - m, -1, -1]]
  .map(([x, y, sx, sy]) => `<g transform="translate(${x} ${y}) scale(${sx} ${sy})">${inner}</g>`).join('');

export const wavePath = (x1, y1, x2, y2, amp, wl, ph) => {
  const L = Math.hypot(x2 - x1, y2 - y1), nx = -(y2 - y1) / L, ny = (x2 - x1) / L, n = Math.ceil(L / 3);
  let d = '';
  for (let i = 0; i <= n; i++) {
    const t = i / n, o = amp * Math.sin(2 * Math.PI * (t * L) / wl + ph);
    d += `${i ? 'L' : 'M'}${(x1 + (x2 - x1) * t + nx * o).toFixed(1)} ${(y1 + (y2 - y1) * t + ny * o).toFixed(1)}`;
  }
  return d;
};

export const barcode = (w, h, c) => {
  const r = prng(7); let x = 0, out = '';
  while (x < w) { const bw = 1 + Math.floor(r() * 3); if (r() > .3) out += `<rect x="${x}" y="0" width="${bw}" height="${h}" fill="${c}"/>`; x += bw + 1 + Math.floor(r() * 2); }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${out}</svg>`;
};

/* Five-point star path centred on (0,0) with outer radius r */
export const starPath = (r, inner = .45) => {
  let d = '';
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * inner : r; d += `${i ? 'L' : 'M'}${(rr * Math.cos(a)).toFixed(2)} ${(rr * Math.sin(a)).toFixed(2)}`; }
  return d + 'Z';
};
export const heartPath = s => `M0 ${s * .35}C${-s * .1} ${s * .2} ${-s * .5} ${-s * .05} ${-s * .5} ${-s * .3}C${-s * .5} ${-s * .55} ${-s * .15} ${-s * .65} 0 ${-s * .35}C${s * .15} ${-s * .65} ${s * .5} ${-s * .55} ${s * .5} ${-s * .3}C${s * .5} ${-s * .05} ${s * .1} ${s * .2} 0 ${s * .35}Z`;
