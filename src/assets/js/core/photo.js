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

export const photo = { source: null, srcId: 0, url: '', key: '' };

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
  const base = `${size}margin-inline:auto;position:relative;overflow:hidden;border-radius:${sh.radius};${extraStyle}`;
  if (!photo.url) return `<div style="${base}display:flex;align-items:center;justify-content:center;border:1px dashed currentColor;opacity:.5;font-size:11px;text-align:center;padding:8px">Upload a photo</div>`;
  const tf = p.shape === 'hexagon' ? '' : `transform:scale(${p.zoom / 100}) translate(${p.offsetX}%, ${p.offsetY}%);`;
  return `<div style="${base}"><img src="${photo.url}" alt="Baby portrait" style="width:100%;height:100%;object-fit:cover;display:block;${tf}"></div>`;
}
