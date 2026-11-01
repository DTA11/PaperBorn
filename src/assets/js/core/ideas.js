/* "Give me an idea": ready-made wording for message fields. No AI and no network: lists of good lines,
   picked in a shuffled order so the same idea doesn't come back until all have been shown.
   Tokens like {name} are filled in from the card; an idea whose token is empty is skipped. */
const order = {};
const cap = s => { const v = String(s || '').trim(); return v && v === v.toUpperCase() ? v.toLowerCase().replace(/(^|[\s-])(\p{L})/gu, (m, a, b) => a + b.toUpperCase()) : v; };

export function nextIdea(key, list, vals) {
  const fill = t => t.replace(/\{(\w+)\}/g, (_, k) => cap(vals[k]));
  const ok = list.filter(t => !(t.match(/\{(\w+)\}/g) || []).some(m => !String(vals[m.slice(1, -1)] || '').trim()));
  if (!ok.length) return '';
  const sig = ok.join('|');
  let o = order[key];
  if (!o || o.sig !== sig || !o.left.length) {
    const left = ok.map((_, i) => i);
    for (let i = left.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [left[i], left[j]] = [left[j], left[i]]; }
    if (o && o.sig === sig && left.length > 1 && left[left.length - 1] === o.last) left.unshift(left.pop());   // never the same twice in a row
    o = order[key] = { sig, left, last: o && o.last };
  }
  const i = o.left.pop(); o.last = i;
  return fill(ok[i]);
}

export const IDEA_ICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2V17h6v-.3c0-.8.4-1.5 1-2A7 7 0 0 0 12 2z"/></svg>';
