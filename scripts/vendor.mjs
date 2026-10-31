/* Self-hosts third-party files at build time, so visitors never contact Google or a CDN:
   - Google Fonts (latin + latin-ext only) -> /assets/fonts + /assets/css/fonts.css
   - html2canvas and jsPDF -> /assets/vendor
   Fails the build loudly if a download fails (Netlify then keeps serving the previous deploy). */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const KEEP = new Set(['latin', 'latin-ext']);

export const LIBS = [
  { url: 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', out: 'html2canvas-1.4.1.min.js' },
  { url: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', out: 'jspdf-2.5.1.umd.min.js' },
];

async function get(fetchFn, url, asText) {
  const res = await fetchFn(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`Download failed (${res.status}): ${url}`);
  return asText ? res.text() : Buffer.from(await res.arrayBuffer());
}

export async function vendor(dist, { fontsUrl, libs = LIBS, fetchFn = fetch } = {}) {
  const vendorDir = path.join(dist, 'assets/vendor'), fontDir = path.join(dist, 'assets/fonts'), cssDir = path.join(dist, 'assets/css');
  for (const d of [vendorDir, fontDir, cssDir]) fs.mkdirSync(d, { recursive: true });

  for (const l of libs) {
    const buf = await get(fetchFn, l.url, false);
    if (buf.length < 10000 || buf.slice(0, 1).toString() === '<') throw new Error(`Unexpected content for ${l.url}`);
    fs.writeFileSync(path.join(vendorDir, l.out), buf);
  }

  const css = await get(fetchFn, fontsUrl, true);
  const blocks = [...css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*(@font-face\s*\{[^}]*\})/g)].filter(m => KEEP.has(m[1]));
  if (!blocks.length) throw new Error('No font-face blocks found in the fonts stylesheet');
  let out = '';
  for (const [, subset, block] of blocks) {
    const url = /url\(([^)]+)\)/.exec(block)?.[1].replace(/['"]/g, '');
    if (!url) continue;
    const fam = (/font-family:\s*'?([^';]+)'?/.exec(block)?.[1] || 'font').trim().replace(/\s+/g, '-').toLowerCase();
    const wt = /font-weight:\s*(\d+)/.exec(block)?.[1] || '400', st = /font-style:\s*(\w+)/.exec(block)?.[1] || 'normal';
    const buf = await get(fetchFn, url, false);
    if (buf.length < 500) throw new Error(`Font file too small: ${url}`);
    const name = `${fam}-${wt}-${st}-${subset}-${crypto.createHash('sha1').update(buf).digest('hex').slice(0, 8)}.woff2`;
    fs.writeFileSync(path.join(fontDir, name), buf);
    out += block.replace(/url\([^)]+\)/, `url(/assets/fonts/${name})`) + '\n';
  }
  fs.writeFileSync(path.join(cssDir, 'fonts.css'), out);
  return { fonts: blocks.length, libs: libs.length };
}
