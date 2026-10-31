export const $ = id => document.getElementById(id);
const nn = (v, d) => (v === undefined || v === null ? d : v);   // like ?? (kept simple for older iPad Safari)
export const esc = s => String(nn(s, '')).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const show = (flag, val, html) => (flag && val ? html : '');
export const clone = o => JSON.parse(JSON.stringify(o));
export const br = s => String(nn(s, '')).replace(/\n/g, '<br>');

/* Small deterministic PRNG (seed must be a positive integer) */
export const prng = seed => { seed = Math.max(1, Math.floor(Math.abs(seed)) % 2147483646); return () => (seed = seed * 16807 % 2147483647) / 2147483647; };
export function shuffle(arr, seed) {
  const r = prng(seed), a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/* Privacy-friendly event tracking (no-op unless Plausible is installed) */
export const track = (name, props) => { try { if (window.plausible) window.plausible(name, { props }); } catch (_) {} };

export const slugify = s => (String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')) || 'card';
