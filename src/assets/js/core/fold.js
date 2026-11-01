/* Folded greeting card: one landscape sheet (A4 or US Letter), printed on both sides and folded in half.
   Page 1 (outside): back on the left, the card design as the front on the right.
   Page 2 (inside):  left side left empty (for a photo or a drawing), message on the right.
   Print both sides, "flip on short edge", then fold along the middle. */

export const SHEETS = { a4: [297, 210], letter: [279.4, 215.9] };
export const sheetFor = format => format === 'usletter' || /^en-(US|CA)|^es-(US|MX)|^fr-CA/.test(navigator.language || '') ? 'letter' : 'a4';

const lum = hex => { const m = /^#?([0-9a-f]{6})$/i.exec(hex || ''); if (!m) return 1; const n = parseInt(m[1], 16); return (.299 * (n >> 16 & 255) + .587 * (n >> 8 & 255) + .114 * (n & 255)) / 255; };

function canvas(w, h, fill) {
  const c = document.createElement('canvas'); c.width = Math.round(w); c.height = Math.round(h);
  const g = c.getContext('2d'); g.fillStyle = fill; g.fillRect(0, 0, c.width, c.height);
  return [c, g];
}
function wrap(g, text, maxW) {
  const out = [];
  for (const para of String(text || '').split('\n')) {
    let line = '';
    for (const w of para.split(/\s+/).filter(Boolean)) {
      const t = line ? line + ' ' + w : w;
      if (g.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t;
    }
    if (line) out.push(line);
  }
  return out;
}
const heartPath = (g, x, y, s) => {
  g.beginPath(); g.moveTo(x, y + 9 * s);
  g.bezierCurveTo(x - 4 * s, y + 5 * s, x - 12 * s, y, x - 12 * s, y - 5 * s);
  g.bezierCurveTo(x - 12 * s, y - 10 * s, x - 6 * s, y - 13 * s, x, y - 8 * s);
  g.bezierCurveTo(x + 6 * s, y - 13 * s, x + 12 * s, y - 10 * s, x + 12 * s, y - 5 * s);
  g.bezierCurveTo(x + 12 * s, y, x + 4 * s, y + 5 * s, x, y + 9 * s); g.fill();
};

/* front: canvas of the card design. o: { sheet, bg, ink, body (font family), script, inside: { heading, text, sign }, brand } */
/* The card's own background color, read from the design's left edge, so the back and inside always match the front */
function edgeColor(front, fallback) {
  try {
    const d = front.getContext('2d').getImageData(Math.round(front.width * .015), Math.round(front.height * .55), 1, 1).data;
    return '#' + [d[0], d[1], d[2]].map(v => v.toString(16).padStart(2, '0')).join('');
  } catch (_) { return fallback; }
}

export function foldedPages(front, o) {
  o = { ...o, bg: edgeColor(front, o.bg) };
  const [SW, SH] = SHEETS[o.sheet] || SHEETS.a4, pw = SW / 2;
  const k = front.width / 148;                                  // px per mm, taken from the front picture
  const W = SW * k, H = SH * k, P = pw * k, mm = v => v * k;
  const dark = lum(o.bg) < .45, paper = dark ? '#ffffff' : o.bg, ink = dark ? o.bg : o.ink;

  /* Outside: back | front */
  const [out, g] = canvas(W, H, o.bg);
  const s = Math.min(P / front.width, H / front.height), fw = front.width * s, fh = front.height * s;
  g.drawImage(front, P + (P - fw) / 2, (H - fh) / 2, fw, fh);
  g.fillStyle = o.ink; g.globalAlpha = .55; heartPath(g, P / 2, H * .5, mm(.9));
  g.globalAlpha = .75; g.textAlign = 'center';
  g.font = `600 ${mm(5.5)}px ${o.script}`; g.fillText('made with love', P / 2, H * .5 + mm(13));
  if (o.brand) { g.globalAlpha = .5; g.font = `500 ${mm(2.4)}px ${o.body}`; g.fillText('babycardprintables.com', P / 2, H - mm(10)); }
  g.globalAlpha = .35; g.fillStyle = o.ink;                     // short fold marks at the top and bottom edge only
  g.fillRect(P - mm(.15), 0, mm(.3), mm(5)); g.fillRect(P - mm(.15), H - mm(5), mm(.3), mm(5));
  g.globalAlpha = 1;

  /* Inside: empty left | message right */
  const [inn, h] = canvas(W, H, paper);
  const x0 = P + mm(16), cw = P - mm(32), cx = P + P / 2;
  h.fillStyle = ink; h.textAlign = 'center';
  let y = mm(40);
  const t = o.inside || {};
  if (t.heading) {
    h.font = `700 ${mm(11)}px ${o.script}`;
    for (const l of wrap(h, t.heading, cw)) { h.fillText(l, cx, y); y += mm(12); }
    y += mm(4);
  }
  if (t.text) {
    h.globalAlpha = .85; h.font = `400 ${mm(4.6)}px ${o.body}`;
    for (const l of wrap(h, t.text, cw)) { h.fillText(l, cx, y); y += mm(7); }
    h.globalAlpha = 1; y += mm(6);
  }
  const signY = H - mm(30), gap = mm(11);                       // writing lines for a handwritten note
  h.strokeStyle = ink; h.globalAlpha = .22; h.lineWidth = mm(.3);
  for (let ly = Math.max(y + mm(6), mm(70)); ly < signY - mm(10); ly += gap) { h.beginPath(); h.moveTo(x0, ly); h.lineTo(x0 + cw, ly); h.stroke(); }
  h.globalAlpha = 1;
  if (t.sign) { h.font = `600 ${mm(7)}px ${o.script}`; for (const [i, l] of wrap(h, t.sign, cw).entries()) h.fillText(l, cx, signY + i * mm(8)); }
  return { pages: [out, inn], mm: [SW, SH] };
}
