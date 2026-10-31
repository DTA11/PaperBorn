/* Fixes for older Safari (iPads and iPhones before iOS 14.5).
   Those versions ignore "gap" spacing in flex rows, so menu links, buttons and card details touch.
   When that is the case, copy each flex container's gap into margins on its children.
   Modern browsers skip all of this (flexGap is true). Add ?nogap to a URL to force it on for testing. */
export const flexGap = (() => {
  try {
    if (/[?&]nogap\b/.test(location.search)) return false;
    const d = document.createElement('div');
    d.style.cssText = 'display:flex;flex-direction:column;row-gap:1px;position:absolute;visibility:hidden';
    d.appendChild(document.createElement('div')); d.appendChild(document.createElement('div'));
    document.body.appendChild(d);
    const ok = d.scrollHeight === 1;
    d.parentNode.removeChild(d);
    return ok;
  } catch (_) { return true; }
})();

export function fixGap(root) {
  if (flexGap || !root) return;
  const els = [root].concat(Array.prototype.slice.call(root.querySelectorAll('*')));
  for (const el of els) {
    const cs = getComputedStyle(el);
    if (cs.display !== 'flex' && cs.display !== 'inline-flex') continue;
    const cg = parseFloat(cs.columnGap) || 0, rg = parseFloat(cs.rowGap) || 0;
    if (!cg && !rg) continue;
    const col = cs.flexDirection.indexOf('column') === 0, wrap = cs.flexWrap !== 'nowrap';
    const kids = Array.prototype.filter.call(el.children, k => {
      const s = getComputedStyle(k); return s.display !== 'none' && s.position !== 'absolute' && s.position !== 'fixed';
    });
    kids.forEach((k, i) => {
      const last = i === kids.length - 1;
      if (col) { if (rg && !last) k.style.marginBottom = rg + 'px'; return; }
      if (cg && !last) k.style.marginRight = cg + 'px';
      if (wrap && rg) k.style.marginBottom = rg + 'px';
    });
  }
}
