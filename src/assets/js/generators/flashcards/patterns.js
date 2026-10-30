/* High-contrast flashcard patterns. Each draws into a 100x100 viewBox: (ink, accent, bg) -> svg inner markup. */
import { starPath, wavePath } from '../../core/svg.js';

const f1 = n => (+n).toFixed(1);
/* Polygon of the unit square (0..100) clipped to a <= x+y <= b (for diagonal bands) */
function band(a, b) {
  let pts = [[0, 0], [100, 0], [100, 100], [0, 100]];
  const clip = (P, keep, edge) => {
    const out = [];
    for (let i = 0; i < P.length; i++) {
      const p = P[i], q = P[(i + 1) % P.length], dp = keep(p), dq = keep(q);
      if (dp >= 0) out.push(p);
      if ((dp >= 0) !== (dq >= 0)) { const t = dp / (dp - dq); out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]); }
    }
    return out;
  };
  pts = clip(pts, p => p[0] + p[1] - a);
  pts = clip(pts, p => b - (p[0] + p[1]));
  return pts.length > 2 ? `<polygon points="${pts.map(p => p.map(f1).join(',')).join(' ')}" />` : '';
}

export const PATTERNS = {
  checker: ['Checkerboard', (c) => { let s = ''; for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) if ((i + j) % 2) s += `<rect x="${i * 25}" y="${j * 25}" width="25" height="25" fill="${c}"/>`; return s; }],
  vstripes: ['Vertical stripes', (c) => [0, 20, 40, 60, 80].map(x => `<rect x="${x}" y="0" width="10" height="100" fill="${c}"/>`).join('')],
  hstripes: ['Horizontal stripes', (c) => [0, 20, 40, 60, 80].map(y => `<rect x="0" y="${y}" width="100" height="10" fill="${c}"/>`).join('')],
  diagonal: ['Diagonal stripes', (c) => `<g fill="${c}">${[0, 40, 80, 120, 160].map(a => band(a + 10, a + 30)).join('')}</g>`],
  zigzag: ['Zigzag', (c) => [14, 38, 62, 86].map(y => { let p = ''; for (let i = 0; i <= 8; i++) p += `${f1(i * 12.5)},${y + (i % 2 ? 8 : -8)} `; return `<polyline points="${p}" fill="none" stroke="${c}" stroke-width="6" stroke-linejoin="miter"/>`; }).join('')],
  bullseye: ['Bullseye', (c, a, bg) => [48, 38, 28, 18, 8].map((r, i) => `<circle cx="50" cy="50" r="${r}" fill="${i % 2 ? bg : (i === 4 ? a : c)}"/>`).join('')],
  spiral: ['Spiral', (c) => { let d = ''; const T = Math.PI * 2 * 4.5; for (let t = 0; t <= T; t += .1) { const r = 46 * t / T; d += `${t ? 'L' : 'M'}${f1(50 + r * Math.cos(t))} ${f1(50 + r * Math.sin(t))}`; } return `<path d="${d}" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round"/>`; }],
  dots: ['Polka dots', (c) => { let s = ''; for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) s += `<circle cx="${10 + i * 20}" cy="${10 + j * 20}" r="7" fill="${c}"/>`; return s; }],
  bigdot: ['Big dot', (c, a) => `<circle cx="50" cy="50" r="38" fill="${a}"/>`],
  triangles: ['Triangles', (c) => { let s = ''; for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { const x = i * 25, y = j * 25; s += (i + j) % 2 === 0 ? `<polygon points="${x},${y + 25} ${x + 25},${y + 25} ${x + 12.5},${y}" fill="${c}"/>` : `<polygon points="${x},${y} ${x + 25},${y} ${x + 12.5},${y + 25}" fill="${c}"/>`; } return s; }],
  stars: ['Stars', (c, a) => { let s = ''; [17, 50, 83].forEach((x, i) => [17, 50, 83].forEach((y, j) => { s += `<path d="${starPath(14)}" transform="translate(${x} ${y})" fill="${(i + j) % 2 ? c : a}"/>`; })); return s; }],
  waves: ['Waves', (c) => [12, 31, 50, 69, 88].map(y => `<path d="${wavePath(2, y, 98, y, 5, 24, 0)}" fill="none" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/>`).join('')],
  plus: ['Plus signs', (c) => { let s = ''; [17, 50, 83].forEach(x => [17, 50, 83].forEach(y => { s += `<rect x="${x - 12}" y="${y - 3.5}" width="24" height="7" fill="${c}"/><rect x="${x - 3.5}" y="${y - 12}" width="7" height="24" fill="${c}"/>`; })); return s; }],
  face: ['Smiley face', (c) => `<circle cx="50" cy="50" r="42" fill="none" stroke="${c}" stroke-width="5"/><circle cx="36" cy="40" r="6" fill="${c}"/><circle cx="64" cy="40" r="6" fill="${c}"/><path d="M28 58Q50 82 72 58" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round"/>`],
  eyes: ['Big eyes', (c, a, bg) => [28, 72].map(x => `<circle cx="${x}" cy="50" r="22" fill="${bg}" stroke="${c}" stroke-width="4"/><circle cx="${x + 4}" cy="50" r="11" fill="${a}"/>`).join('')],
  sunburst: ['Sunburst', (c) => { let s = ''; for (let k = 0; k < 16; k++) { const a1 = k * Math.PI / 8, a2 = a1 + Math.PI / 16, R = 48; s += `<path d="M50 50L${f1(50 + R * Math.cos(a1))} ${f1(50 + R * Math.sin(a1))}A${R} ${R} 0 0 1 ${f1(50 + R * Math.cos(a2))} ${f1(50 + R * Math.sin(a2))}Z" fill="${c}"/>`; } return s; }],
  diamonds: ['Diamonds', (c, a, bg) => [48, 38, 28, 18, 8].map((r, i) => `<polygon points="50,${50 - r} ${50 + r},50 50,${50 + r} ${50 - r},50" fill="${i % 2 ? bg : (i === 4 ? a : c)}"/>`).join('')],
};

export const PATTERN_OPTIONS = Object.entries(PATTERNS).map(([id, [name]]) => [id, name]);
export const DEFAULT_PATTERNS = ['checker', 'vstripes', 'bullseye', 'spiral', 'dots', 'bigdot'];

export function patternSVG(id, ink, accent, bg) {
  const p = PATTERNS[id]; if (!p) return '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" style="display:block;width:100%;height:100%">${p[1](ink, accent, bg)}</svg>`;
}
