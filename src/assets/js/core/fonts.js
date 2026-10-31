export const FONTS = {
  sans: "'Inter', sans-serif", serif: "'Playfair Display', Georgia, serif", playful: "'Fredoka', sans-serif",
  handwritten: "'Caveat', cursive", vintage: "'Cinzel', serif", mono: "'JetBrains Mono', monospace",
};
export const FONT_LABELS = [
  ['serif', 'Elegant'], ['sans', 'Clean and modern'], ['playful', 'Rounded and playful'],
  ['handwritten', 'Handwritten'], ['vintage', 'Classic capitals'], ['mono', 'Typewriter'],
];
/* Make sure the chosen web font is really loaded before drawing/exporting. */
export async function loadFonts(mode) {
  const fam = FONTS[mode] || FONTS.sans;
  try {
    await Promise.all([...['400', '700', '900'].map(w => document.fonts.load(`${w} 16px ${fam}`)), document.fonts.load(`italic 400 16px ${fam}`)]);
  } catch (_) {}
  try { await document.fonts.ready; } catch (_) {}
}
