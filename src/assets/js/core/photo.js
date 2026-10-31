/* Photo pipeline.
   html2canvas ignores CSS filter and clip-path, so filters are baked into pixels
   (preview === export) and the hexagon mask is drawn on a canvas. */
import { state, fmt } from './state.js';

export const SHAPES = { // ratio = width/height, radius = CSS border-radius (percentages are safe for html2canvas)
  rectangle: { ratio: null, radius: '0' },
  circle:    { ratio: 1,    radius: '50%' },
  oval:      { ratio: 0.75, radius: '50%' },
  arch:      { ratio: 0.75, radius: '50% 50% 0 0 / 37.5% 37.5% 0 0' },
  hexagon:   { ratio: 1,    radius: '0' },
  rounded:   { ratio: 0.75, radius: '16px' },
};
export const SHAPE_LABELS = [['rectangle', 'Rectangle'], ['circle', 'Circle'], ['oval', 'Oval'], ['arch', 'Arch'], ['hexagon', 'Hexagon'], ['rounded', 'Soft rounded']];
export const FILTER_LABELS = [['none', 'Natural colour'], ['grayscale', 'High-contrast B&W'], ['sepia', 'Soft sepia'], ['warm', 'Warm sunlight'], ['cool', 'Cool midnight'], ['dither', 'Vintage dither']];

export const photo = { source: null, srcId: 0, url: '', key: '', canvas: null, bake: { key: '', url: '' } };

export async function loadSource(src) {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = src;
  await img.decode();
  const nw = img.naturalWidth || 900, nh = img.naturalHeight || 1200;
  const max = 1600, s = Math.min(1, max / Math.max(nw, nh));
  const c = document.createElement('canvas');
  c.width = Math.round(nw * s); c.height = Math.round(nh * s);
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); // browsers apply EXIF orientation here
  return c;
}

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
export function applyFilters(src, p) {
  const c = document.createElement('canvas'); c.width = src.width; c.height = src.height;
  const ctx = c.getContext('2d'); ctx.drawImage(src, 0, 0);
  const im = ctx.getImageData(0, 0, c.width, c.height), d = im.data;
  const b = p.brightness / 100, k = p.contrast / 100, mode = p.filterMode, W = c.width;
  for (let i = 0; i < d.length; i += 4) {
    let r = (d[i] * b - 128) * k + 128, g = (d[i + 1] * b - 128) * k + 128, bl = (d[i + 2] * b - 128) * k + 128;
    if (mode === 'grayscale' || mode === 'dither') {
      let y = .299 * r + .587 * g + .114 * bl;
      if (mode === 'grayscale') y = (y - 128) * 1.15 + 128;
      else { const px = (i / 4) % W, py = ((i / 4) / W) | 0; y = y > (BAYER[(py & 3) * 4 + (px & 3)] + .5) * 16 ? 255 : 0; }
      r = g = bl = y;
    } else if (mode === 'sepia') {
      const tr = .393 * r + .769 * g + .189 * bl, tg = .349 * r + .686 * g + .168 * bl, tb = .272 * r + .534 * g + .131 * bl;
      r += (tr - r) * .6; g += (tg - g) * .6; bl += (tb - bl) * .6;
    } else if (mode === 'warm') { r = r * 1.08 + 6; bl = bl * .88; }
    else if (mode === 'cool')   { r *= .88; g *= .98; bl = bl * 1.1 + 6; }
    d[i] = r; d[i + 1] = g; d[i + 2] = bl; // Uint8ClampedArray clamps
  }
  ctx.putImageData(im, 0, 0);
  return c;
}

function buildPhotoURL() {
  const p = state.photo;
  const filtered = applyFilters(photo.source, p);
  photo.canvas = filtered;
  if (p.shape !== 'hexagon') return filtered.toDataURL('image/jpeg', 0.92);
  const S = 1000, c = document.createElement('canvas'); c.width = c.height = S;
  const ctx = c.getContext('2d');
  ctx.beginPath();
  [[.25, 0], [.75, 0], [1, .5], [.75, 1], [.25, 1], [0, .5]].forEach(([x, y], i) => ctx[i ? 'lineTo' : 'moveTo'](x * S, y * S));
  ctx.closePath(); ctx.clip();
  const cover = Math.max(S / filtered.width, S / filtered.height), z = p.zoom / 100;
  ctx.translate(S / 2, S / 2); ctx.scale(z, z); ctx.translate(p.offsetX / 100 * S, p.offsetY / 100 * S);
  ctx.drawImage(filtered, -filtered.width * cover / 2, -filtered.height * cover / 2, filtered.width * cover, filtered.height * cover);
  return c.toDataURL('image/png');
}

/* Rebuild the processed photo URL when the inputs changed (cheap no-op otherwise). */
export function syncPhotoURL() {
  if (!photo.source) { photo.url = ''; photo.key = ''; return; }
  const p = state.photo;
  const key = [photo.srcId, p.brightness, p.contrast, p.filterMode, p.shape === 'hexagon' ? [p.zoom, p.offsetX, p.offsetY] : ''].join('|');
  if (key !== photo.key) { photo.url = buildPhotoURL(); photo.key = key; }
}

export async function setPhotoSource(src) {
  try { photo.source = await loadSource(src); photo.srcId++; photo.key = ''; }
  catch (err) { console.warn('Photo failed to load:', err); photo.source = null; }
}

/* Photo frame HTML. hMul scales the frame height relative to the format's photoH. */
export function photoHTML(extraStyle = '', hMul = 1) {
  if (!state.toggles.photo) return '';
  const f = fmt(), sh = SHAPES[state.photo.shape] || SHAPES.rectangle, p = state.photo;
  const H = Math.round((f.photoH || 360) * hMul);
  const size = sh.ratio ? `width:${Math.round(H * sh.ratio)}px;height:${H}px;max-width:100%;` : `width:100%;height:${H}px;`;
  const base = `${size}margin-inline:auto;position:relative;overflow:hidden;border-radius:${sh.radius};touch-action:none;cursor:grab;${extraStyle}`;
  if (!photo.url) return `<div style="${base}display:flex;align-items:center;justify-content:center;border:1px dashed currentColor;opacity:.5;font-size:11px;text-align:center;padding:8px">Upload a photo</div>`;
  // Non-hexagon photos are cropped on a canvas by bakeFrames() after layout, so the preview and the export use identical pixels
  // (html2canvas does not reproduce object-fit + transform reliably). The hexagon is already baked in buildPhotoURL().
  const bakeAttr = p.shape === 'hexagon' ? '' : ' data-ph';
  return `<div data-phf style="${base}"><img${bakeAttr} src="${photo.url}" alt="Baby portrait" draggable="false" style="width:100%;height:100%;object-fit:cover;display:block;-webkit-user-drag:none"></div>`;
}

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
/* How far (in % of the frame) the picture may move before an edge of the frame would show. */
function limits(w, h) {
  const src = photo.canvas, z = Math.max(1, state.photo.zoom / 100), sc = Math.max(w / src.width, h / src.height) * z;
  return { x: Math.max(0, (src.width * sc - w) / 2) / w * 100, y: Math.max(0, (src.height * sc - h) / 2) / h * 100, sc };
}

function bakeImg(img) {
  const fr = img.parentElement, w = fr.clientWidth, h = fr.clientHeight, src = photo.canvas, p = state.photo;
  if (!src || !w || !h) return;
  const L = limits(w, h), ox = clamp(p.offsetX, -L.x, L.x), oy = clamp(p.offsetY, -L.y, L.y);
  const key = [photo.srcId, photo.key, w, h, p.zoom, ox.toFixed(2), oy.toFixed(2)].join('|');
  if (photo.bake.key !== key) {
    const S = Math.min(2, 2400 / Math.max(w, h)), c = document.createElement('canvas');
    c.width = Math.round(w * S); c.height = Math.round(h * S);
    const g = c.getContext('2d'); g.imageSmoothingQuality = 'high';
    const dw = src.width * L.sc, dh = src.height * L.sc;
    g.drawImage(src, ((w - dw) / 2 + ox / 100 * w) * S, ((h - dh) / 2 + oy / 100 * h) * S, dw * S, dh * S);
    photo.bake = { key, url: c.toDataURL('image/jpeg', 0.92) };
  }
  img.src = photo.bake.url; img.style.objectFit = 'fill';
}

/* Crop every photo frame inside root. Call after the card HTML is in the DOM. */
export function bakeFrames(root) { root.querySelectorAll('img[data-ph]').forEach(bakeImg); }

/* Drag the picture inside its frame (mouse, pen or touch). onCommit runs once when the drag ends. */
export function initPhotoDrag(host, onCommit) {
  let d = null;
  const live = fr => {
    const img = fr.querySelector('img'); if (!img) return;
    if (img.hasAttribute('data-ph')) bakeImg(img); else { syncPhotoURL(); img.src = photo.url; }
  };
  host.addEventListener('pointerdown', e => {
    const fr = e.target.closest('[data-phf]');
    if (!fr || !photo.source || e.button > 0) return;
    const r = fr.getBoundingClientRect(), L0 = state.photo.shape === 'hexagon' ? { x: 40, y: 40 } : limits(fr.clientWidth, fr.clientHeight);
    d = { fr, id: e.pointerId, x: e.clientX, y: e.clientY, ox: clamp(state.photo.offsetX, -L0.x, L0.x), oy: clamp(state.photo.offsetY, -L0.y, L0.y), k: r.width / fr.clientWidth || 1, w: fr.clientWidth, h: fr.clientHeight };
    try { fr.setPointerCapture(e.pointerId); } catch (_) {}
    fr.style.cursor = 'grabbing'; e.preventDefault();
  });
  host.addEventListener('pointermove', e => {
    if (!d || e.pointerId !== d.id) return;
    const p = state.photo, hex = p.shape === 'hexagon', L = hex ? { x: 40, y: 40 } : limits(d.w, d.h);
    p.offsetX = Math.round(clamp(d.ox + (e.clientX - d.x) / d.k / d.w * 100, -L.x, L.x) * 10) / 10;
    p.offsetY = Math.round(clamp(d.oy + (e.clientY - d.y) / d.k / d.h * 100, -L.y, L.y) * 10) / 10;
    live(d.fr);
  });
  const end = e => {
    if (!d || e.pointerId !== d.id) return;
    d.fr.style.cursor = 'grab'; const moved = d.ox !== state.photo.offsetX || d.oy !== state.photo.offsetY; d = null;
    if (moved) onCommit();
  };
  host.addEventListener('pointerup', end); host.addEventListener('pointercancel', end);
}
