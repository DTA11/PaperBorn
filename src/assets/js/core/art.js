/* Small drawn pieces shared by the illustrated designs (clouds, balloons, bows, flowers, rainbows...).
   Everything is plain SVG so PNG/PDF downloads match the preview. Each helper returns an SVG fragment;
   ids are prefixed (p) so several drawings can live on one page. No <text> here: web fonts do not work
   inside SVG during download, so words always stay HTML. */

/* Soft watercolor edge + blur filters. Use as filter="url(#<p>w)" / "url(#<p>b)". */
export const wcDefs = p => `<filter id="${p}w" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="2" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="6" xChannelSelector="R" yChannelSelector="G"/></filter>
  <filter id="${p}b" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="12"/></filter>`;

export const cloud = (x, y, s, op = 1, fill = '#fff', line = '#d6e1ec', shadow = '#dfe7ef') => `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s})" opacity="${op}">
  <ellipse cx="0" cy="22" rx="62" ry="7" fill="${shadow}" opacity=".7"/>
  <path d="M-58 14 C-70 14 -72 -6 -54 -8 C-54 -26 -30 -32 -20 -18 C-14 -40 22 -42 26 -16 C40 -26 62 -14 54 4 C68 6 66 20 54 20 L-50 20 C-60 20 -64 14 -58 14Z" fill="${fill}" stroke="${line}" stroke-width="2"/></g>`;

export const spark = (x, y, s, c, op = .9) => `<path transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s})" d="M0 -10 Q0 0 10 0 Q0 0 0 10 Q0 0 -10 0 Q0 0 0 -10Z" fill="${c}" opacity="${op}"/>`;
export const dot = (x, y, r, c, op = 1) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${c}" opacity="${op}"/>`;

/* Crescent moon facing right, radius r */
export const crescent = (x, y, r, c, filter = '') => `<path transform="translate(${x.toFixed(1)} ${y.toFixed(1)})" d="M0 ${-r} A${r} ${r} 0 1 0 ${(r * .85).toFixed(1)} ${(r * .54).toFixed(1)} A${(r * .77).toFixed(1)} ${(r * .77).toFixed(1)} 0 1 1 0 ${-r}Z" fill="${c}" ${filter}/>`;

export const heart = (x, y, s, c, op = 1, rot = 0) => `<path transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot}) scale(${s})" d="M0 9 C-4 5 -12 0 -12 -5 C-12 -10 -6 -13 0 -8 C6 -13 12 -10 12 -5 C12 0 4 5 0 9Z" fill="${c}" opacity="${op}"/>`;

/* Grass tuft, leaf and five-petal flower */
export const tuft = (x, y, s = 1) => `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s})" fill="none" stroke-linecap="round">
  <path d="M0 0 C-2 -14 -8 -22 -14 -26" stroke="#8fb283" stroke-width="3"/><path d="M2 0 C2 -16 4 -26 2 -34" stroke="#a3c495" stroke-width="3"/>
  <path d="M4 0 C8 -12 14 -18 20 -20" stroke="#7fa673" stroke-width="3"/><path d="M-4 0 C-8 -8 -16 -12 -22 -12" stroke="#a9c79b" stroke-width="2.5"/></g>`;
export const leaf = (x, y, s = 1, rot = 0, c = '#a7c39a', vein = '#86a77a') => `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot}) scale(${s})"><path d="M0 0 C6 -14 22 -18 30 -16 C26 -6 14 4 0 0Z" fill="${c}"/><path d="M0 0 C10 -6 18 -10 28 -15" stroke="${vein}" stroke-width="1.2" fill="none"/></g>`;
export const flower = (x, y, s = 1, petal = '#f6c6cf', mid = '#f2c96a') => `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s})"><g fill="${petal}">
  <circle cx="0" cy="-5" r="4.2"/><circle cx="4.8" cy="-1.5" r="4.2"/><circle cx="3" cy="4" r="4.2"/><circle cx="-3" cy="4" r="4.2"/><circle cx="-4.8" cy="-1.5" r="4.2"/></g><circle r="2.6" fill="${mid}"/></g>`;

/* 70s daisy */
export const daisy = (x, y, s = 1, petal = '#fffaf0', mid = '#f2b134', line = '#5b2a14') => {
  let p = '';
  for (let i = 0; i < 8; i++) p += `<ellipse cx="0" cy="-15" rx="7" ry="13" transform="rotate(${i * 45})" fill="${petal}" stroke="${line}" stroke-width="1.6"/>`;
  return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s})">${p}<circle r="9" fill="${mid}" stroke="${line}" stroke-width="1.6"/></g>`;
};

/* Ground strip: soft wash, pebbles, grass, leaves and flowers centred on cx, width w */
export const ground = (p, cx, y, w, { flowers = '#f6c6cf', wash = '#e9e1d2' } = {}) => {
  const k = w / 420, X = v => cx + v * k;
  return `<ellipse cx="${cx}" cy="${y}" rx="${(w / 2).toFixed(1)}" ry="${(14 * k).toFixed(1)}" fill="${wash}" opacity=".75" filter="url(#${p}w)"/>
  <ellipse cx="${X(-150)}" cy="${y - 6 * k}" rx="${22 * k}" ry="${13 * k}" fill="#dcd5c8"/><ellipse cx="${X(-156)}" cy="${y - 11 * k}" rx="${8 * k}" ry="${4 * k}" fill="#efe9de"/>
  <ellipse cx="${X(-120)}" cy="${y}" rx="${14 * k}" ry="${9 * k}" fill="#d3cbbd"/><ellipse cx="${X(190)}" cy="${y - 3 * k}" rx="${16 * k}" ry="${10 * k}" fill="#dcd5c8"/>
  ${tuft(X(-182), y, k)}${tuft(X(-88), y + 2 * k, .8 * k)}${tuft(X(40), y, .9 * k)}${tuft(X(170), y + 2 * k, .85 * k)}
  ${leaf(X(-208), y + 2 * k, k, -20)}${leaf(X(156), y, k, 195)}${leaf(X(-64), y + 4 * k, .8 * k, -35)}
  ${flower(X(-196), y - 26 * k, k, flowers)}${flower(X(-78), y - 18 * k, .8 * k, flowers)}${flower(X(206), y - 20 * k, .9 * k, flowers)}`;
};

/* Balloon with highlight and knot; returns { defs, svg, knot:[x,y] } so strings can be drawn to it */
export const balloon = (p, i, x, y, r, c1, c2) => ({
  defs: `<radialGradient id="${p}bl${i}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></radialGradient>`,
  svg: `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><ellipse rx="${(r * .86).toFixed(1)}" ry="${r}" fill="url(#${p}bl${i})" filter="url(#${p}w)"/>
    <ellipse cx="${(-r * .32).toFixed(1)}" cy="${(-r * .4).toFixed(1)}" rx="${(r * .16).toFixed(1)}" ry="${(r * .26).toFixed(1)}" transform="rotate(25 ${(-r * .32).toFixed(1)} ${(-r * .4).toFixed(1)})" fill="#fff" opacity=".45"/>
    <path d="M${(-r * .1).toFixed(1)} ${(r + 6).toFixed(1)} L0 ${(r - 2).toFixed(1)} L${(r * .1).toFixed(1)} ${(r + 6).toFixed(1)}Z" fill="${c2}"/></g>`,
  knot: [x, y + r + 6],
});

/* Ribbon bow centred on (x,y); width about 150*s */
export const bow = (p, x, y, s, c1, c2) => `<defs><linearGradient id="${p}bw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
  <g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s})" filter="url(#${p}w)" stroke="${c2}" stroke-width="1.5" stroke-linejoin="round">
    <path d="M-4 6 C-14 30 -26 52 -40 74 L-26 72 L-20 86 C-8 60 0 34 4 10Z" fill="url(#${p}bw)"/>
    <path d="M4 6 C14 30 26 52 40 74 L26 72 L20 86 C8 60 0 34 -4 10Z" fill="url(#${p}bw)"/>
    <path d="M0 0 C-22 -32 -72 -34 -74 -6 C-76 20 -34 22 0 4Z" fill="url(#${p}bw)"/>
    <path d="M0 0 C22 -32 72 -34 74 -6 C76 20 34 22 0 4Z" fill="url(#${p}bw)"/>
    <path d="M-10 -2 C-28 -16 -52 -16 -58 -4" fill="none" stroke="${c2}" stroke-width="1.2" opacity=".6"/>
    <path d="M10 -2 C28 -16 52 -16 58 -4" fill="none" stroke="${c2}" stroke-width="1.2" opacity=".6"/>
    <ellipse cx="0" cy="2" rx="12" ry="11" fill="${c1}"/></g>`;

/* Scalloped oval outline (cx, cy, rx, ry) as a path */
export function scallopPath(cx, cy, rx, ry, n = 44) {
  const pts = Array.from({ length: n }, (_, i) => { const a = i / n * 2 * Math.PI; return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)]; });
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i <= n; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i % n], r = Math.hypot(x1 - x0, y1 - y0) / 2 * 1.08;
    d += `A${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  }
  return d + 'Z';
}

/* Watercolor rainbow arch: bands from outside in, centred at (cx, cy) on its base line */
export const rainbowArch = (p, cx, cy, r, bandW, colors) => colors.map((c, i) => {
  const rr = r - i * bandW - bandW / 2;
  return `<path d="M${(cx - rr).toFixed(1)} ${cy} A${rr.toFixed(1)} ${rr.toFixed(1)} 0 0 1 ${(cx + rr).toFixed(1)} ${cy}" fill="none" stroke="${c}" stroke-width="${(bandW * .92).toFixed(1)}" stroke-linecap="round" filter="url(#${p}w)"/>`;
}).join('');

/* Pampas grass plume and a leafy boho sprig, base at (x,y), pointing up then rotated */
export const pampas = (x, y, s, rot, c = '#e6cfae', stem = '#b89a73') => {
  let f = '';
  for (let i = 0; i < 16; i++) { const t = i / 15, yy = -40 - t * 120, w = 10 + Math.sin(t * Math.PI) * 18; f += `<path d="M0 ${yy.toFixed(1)} C${(-w).toFixed(1)} ${(yy + 6).toFixed(1)} ${(-w * .8).toFixed(1)} ${(yy + 20).toFixed(1)} ${(-w * 1.1).toFixed(1)} ${(yy + 26).toFixed(1)} M0 ${yy.toFixed(1)} C${w.toFixed(1)} ${(yy + 6).toFixed(1)} ${(w * .8).toFixed(1)} ${(yy + 20).toFixed(1)} ${(w * 1.1).toFixed(1)} ${(yy + 26).toFixed(1)}"/>`; }
  return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot}) scale(${s})"><path d="M0 0 C2 -60 -2 -120 0 -170" stroke="${stem}" stroke-width="2.4" fill="none"/>
    <g stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round" opacity=".9">${f}</g></g>`;
};
export const sprig = (x, y, s, rot, stem = '#8a9d74', leafC = '#a3b38c') => {
  let o = `<path d="M0 0 C6 -50 -4 -100 8 -170" fill="none" stroke="${stem}" stroke-width="2.5" stroke-linecap="round"/>`;
  for (let k = 1; k <= 6; k++) { const yy = -k * 26, sd = k % 2 ? 1 : -1, xx = sd * 13 + (k % 2 ? 2 : -2); o += `<ellipse cx="${xx}" cy="${yy}" rx="15" ry="5.5" fill="${leafC}" transform="rotate(${-sd * 35} ${xx} ${yy})"/>`; }
  return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot}) scale(${s})">${o}<ellipse cx="8" cy="-178" rx="12" ry="5" fill="${leafC}" transform="rotate(-90 8 -178)"/></g>`;
};

/* Fake newspaper column text: rows of grey bars of slightly varying length */
export function newsprint(w, lines, c = '#2b2118', lh = 9) {
  let o = '', seed = 7;
  const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;
  for (let i = 0; i < lines; i++) { const last = i === lines - 1 || rnd() < .12, len = last ? w * (.3 + rnd() * .4) : w * (.92 + rnd() * .08); o += `<rect x="0" y="${i * lh}" width="${len.toFixed(1)}" height="${(lh * .42).toFixed(1)}" rx="1" fill="${c}" opacity=".32"/>`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${lines * lh}" viewBox="0 0 ${w} ${lines * lh}" style="display:block">${o}</svg>`;
}
