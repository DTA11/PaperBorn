/* Big painted numbers (birthday age, milestone month) in four looks the user can pick: "Number style".
   `paths` are the digit outlines (several <path> elements); `inner` is the shaded fill drawn inside them.
   The edge is drawn as a wider copy underneath the fill, so digits made of overlapping pieces (like "1")
   never show a seam where the pieces meet. */
export const NUM_STYLES = [['auto', 'Matches the design'], ['watercolor', 'Watercolor (soft, hand-painted edge)'], ['smooth', 'Smooth'], ['bold', 'Bold color'], ['outline', 'Outline']];
export const numStyle = (dv, fallback) => { const s = dv && dv.numStyle; return s && s !== 'auto' ? s : fallback; };

export function styledNumber({ id, paths, inner, edge, sw, solid, light, style, wobble }) {
  if (style === 'bold') return `<g fill="${solid}">${paths}</g>`;
  if (style === 'outline') return `<g fill="${edge}" stroke="${edge}" stroke-width="${(sw * 2.4).toFixed(1)}" stroke-linejoin="round">${paths}</g><g fill="${light}">${paths}</g>`;
  const body = `<defs><clipPath id="${id}sc">${paths}</clipPath></defs>
    <g fill="${edge}" stroke="${edge}" stroke-width="${sw.toFixed(1)}" stroke-linejoin="round" opacity=".3">${paths}</g>
    <g clip-path="url(#${id}sc)">${inner}</g>`;
  return style === 'watercolor' && wobble ? `<g filter="url(#${wobble})">${body}</g>` : `<g>${body}</g>`;
}
