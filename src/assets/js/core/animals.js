/* Little Animals: cute standing animals drawn as SVG (no image files).
   Every animal shares one pose box: origin at the centre of the head, head about 95 wide, feet resting at y ≈ 150.
   svg(prefix, { xmas }) — with xmas the animal wears a knitted Christmas sweater.
   hatAt: transform for hats placed on the head (party hat, Santa hat); noHat: the animal already wears something on its head.
   Gradient ids are prefixed per animal so several can share a page (preview, mini preview, export). */

const OUT = 'stroke-width="1.4" stroke-linejoin="round"';
const HS = .82;                                   // head size relative to the old sitting animals
const head = inner => `<g transform="scale(${HS})">${inner}</g>`;

/* Shared face: eyes with highlights, brows, cheeks and a little smile. */
const face = ({ ex = 24, ey = -6, cheek = '#f1a7b5', cy = 14, cx = 38, line = '#7d889b', smile = 'M-8 22 C-4 27 4 27 8 22', brows = true } = {}) => `
  <ellipse cx="${-ex}" cy="${ey}" rx="6.5" ry="8.5" fill="#3b3a45"/><ellipse cx="${ex}" cy="${ey}" rx="6.5" ry="8.5" fill="#3b3a45"/>
  <circle cx="${-ex + 2}" cy="${ey - 3}" r="2.6" fill="#fff"/><circle cx="${ex + 2}" cy="${ey - 3}" r="2.6" fill="#fff"/>
  <circle cx="${-ex - 2}" cy="${ey + 4}" r="1.2" fill="#fff" opacity=".8"/><circle cx="${ex - 2}" cy="${ey + 4}" r="1.2" fill="#fff" opacity=".8"/>
  ${brows ? `<path d="M${-ex - 8} ${ey - 14} C${-ex - 4} ${ey - 18} ${-ex + 4} ${ey - 18} ${-ex + 8} ${ey - 15} M${ex - 8} ${ey - 15} C${ex - 4} ${ey - 18} ${ex + 4} ${ey - 18} ${ex + 8} ${ey - 14}" stroke="${line}" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".55"/>` : ''}
  <ellipse cx="${-cx}" cy="${cy}" rx="10" ry="7" fill="${cheek}" opacity=".55"/><ellipse cx="${cx}" cy="${cy}" rx="10" ry="7" fill="${cheek}" opacity=".55"/>
  ${smile ? `<path d="${smile}" stroke="${line}" stroke-width="1.8" fill="none" stroke-linecap="round"/>` : ''}`;

const grad = (id, a, b, c = b) => `<radialGradient id="${id}" cx=".42" cy=".35" r=".8"><stop offset="0" stop-color="${a}"/><stop offset=".7" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></radialGradient>`;

/* Christmas sweater colours, one look per animal: [knit, band, pattern] */
const KNIT = {
  red:   ['#c8424b', '#f4ead8', '#3f7a52'],
  green: ['#4d8a5d', '#f4ead8', '#c8424b'],
  cream: ['#f1e6d2', '#c8424b', '#4d8a5d'],
  blue:  ['#5f86a8', '#f4ead8', '#c8424b'],
  mustard: ['#d9a441', '#f4ead8', '#b8423f'],
};

/* Standing body: two legs, a pear-shaped body and two arms hanging at the sides.
   T = top of the body (lower for long necks). With `knit` the body wears a sweater with a Fair Isle band. */
function stand(p, { fill, line, belly, paw = fill, pad, legs = fill, knit, T = 34, toes, hooves }) {
  const L = T + 12, top = knit ? knit[0] : fill;
  const torso = `M-20 ${T} C-38 ${T + 6} -46 ${T + 36} -44 96 C-43 114 -26 122 0 122 C26 122 43 114 44 96 C46 ${T + 36} 38 ${T + 6} 20 ${T} C8 ${T - 4} -8 ${T - 4} -20 ${T}Z`;
  const leg = sx => `<path d="M${sx * 32} 102 C${sx * 34} 122 ${sx * 33} 138 ${sx * 31} 146 L${sx * 11} 146 C${sx * 10} 134 ${sx * 9} 118 ${sx * 8} 108Z" fill="${legs}" stroke="${line}" ${OUT}/>`;
  const foot = sx => hooves
    ? `<path d="M${sx * 33} 140 C${sx * 34} 148 ${sx * 32} 151 ${sx * 21} 151 C${sx * 11} 151 ${sx * 9} 148 ${sx * 10} 140Z" fill="${hooves}"/>`
    : `<ellipse cx="${sx * 22}" cy="146" rx="15" ry="7.5" fill="${paw}" stroke="${line}" stroke-width="1.2"/>`;
  const arm = sx => {
    const d = `M${sx * 34} ${L} C${sx * 47} ${L + 12} ${sx * 53} ${L + 30} ${sx * 50} ${L + 48}`;
    return `<path d="${d}" stroke="${line}" stroke-width="19" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${top}" stroke-width="16.2" fill="none" stroke-linecap="round"/>
      ${knit ? `<path d="M${sx * 51.5} ${L + 38} L${sx * 50.5} ${L + 45}" stroke="${knit[1]}" stroke-width="16.2" stroke-linecap="butt"/>` : ''}
      <circle cx="${sx * 50}" cy="${L + 52}" r="8.6" fill="${paw}" stroke="${line}" stroke-width="1.2"/>`;
  };
  let wear = '';
  if (knit) {
    const [, band, pat] = knit, by = Math.max(T + 26, 64);
    let zig = `M-50 ${by + 3}`, dots = '';
    for (let x = -50; x < 50; x += 10) { zig += ` L${x + 5} ${by + 12} L${x + 10} ${by + 3}`; dots += `<circle cx="${x + 5}" cy="${by + 3.5}" r="1.8"/>`; }
    wear = `<defs><clipPath id="${p}kc"><path d="${torso}"/></clipPath></defs>
      <g clip-path="url(#${p}kc)"><rect x="-50" y="${by - 4}" width="100" height="22" fill="${band}"/>
        <path d="${zig}" fill="none" stroke="${pat}" stroke-width="2.6" stroke-linejoin="round"/><g fill="${pat}">${dots}</g>
        <rect x="-50" y="${by - 6}" width="100" height="2.4" fill="${pat}" opacity=".7"/><rect x="-50" y="${by + 17}" width="100" height="2.4" fill="${pat}" opacity=".7"/>
        <rect x="-50" y="110" width="100" height="14" fill="${band}"/>
        <g stroke="${top}" stroke-width="1.2" opacity=".35">${[-36, -28, -20, -12, -4, 4, 12, 20, 28, 36].map(x => `<path d="M${x} 111 V123"/>`).join('')}</g>
        <g fill="${band}" opacity=".9"><circle cx="-24" cy="${T + 18}" r="2"/><circle cx="22" cy="${T + 20}" r="2"/><circle cx="0" cy="${T + 14}" r="1.8"/><circle cx="-30" cy="100" r="1.8"/><circle cx="30" cy="98" r="1.8"/></g>
      </g><path d="${torso}" fill="none" stroke="${line}" ${OUT}/>
      <ellipse cx="0" cy="${T + 1}" rx="22" ry="6.5" fill="${band}" stroke="${line}" stroke-width="1"/>`;
  }
  const pads = pad ? `<g fill="${pad}"><ellipse cx="-22" cy="147.5" rx="6" ry="3.2"/><ellipse cx="22" cy="147.5" rx="6" ry="3.2"/></g>` : '';
  const nails = toes ? `<g fill="${toes}">${[-30, -22, -14, 14, 22, 30].map((x, i) => `<ellipse cx="${x}" cy="${i % 3 === 1 ? 150 : 149}" rx="3.4" ry="2.4"/>`).join('')}</g>` : '';
  return `${leg(-1)}${leg(1)}${foot(-1)}${foot(1)}${pads}${nails}
    <path d="${torso}" fill="${top}" stroke="${line}" ${OUT}/>
    ${knit ? wear : `<ellipse cx="0" cy="${(T + 122) / 2 + 6}" rx="25" ry="${(122 - T) / 2 - 12}" fill="${belly}" opacity=".85"/>`}
    ${arm(-1)}${arm(1)}`;
}

/* Knitted scarf around the neck at height y, tails hanging on the right */
const scarf = (y, c1 = '#c8424b', c2 = '#f4ead8', w = 26) => `<path d="M${-w} ${y - 4} C${-w / 2} ${y + 6} ${w / 2} ${y + 6} ${w} ${y - 4} L${w + 2} ${y + 6} C${w / 2} ${y + 16} ${-w / 2} ${y + 16} ${-w - 2} ${y + 6}Z" fill="${c1}" stroke="#8f2e36" stroke-width="1.2" stroke-linejoin="round"/>
  <path d="M${w - 12} ${y + 8} C${w - 8} ${y + 26} ${w - 10} ${y + 40} ${w - 14} ${y + 50} L${w - 2} ${y + 52} C${w + 2} ${y + 40} ${w + 4} ${y + 24} ${w + 2} ${y + 6}Z" fill="${c1}" stroke="#8f2e36" stroke-width="1.2" stroke-linejoin="round"/>
  <g stroke="${c2}" stroke-width="3"><path d="M${w - 11} ${y + 22} L${w + 2} ${y + 21}"/><path d="M${w - 12} ${y + 34} L${w + 1} ${y + 34}"/></g>
  <g stroke="#8f2e36" stroke-width="1.6" stroke-linecap="round"><path d="M${w - 12} ${y + 51} v5 M${w - 8} ${y + 51} v6 M${w - 4} ${y + 52} v5"/></g>`;

/* Bow tie at (0,y) */
const tie = (y, c = '#9fc2dd', d = '#7fa6c6') => `<g transform="translate(0 ${y}) scale(1.35)"><path d="M0 0 C-14 -9 -18 8 0 0 C14 -9 18 8 0 0Z" fill="${c}" stroke="${d}" stroke-width="1"/><circle r="3" fill="${d}"/></g>`;

export const ANIMALS = {
  elephant: {
    name: 'Elephant',
    svg: (p, o = {}) => `<defs>${grad(p + 's', '#d5dbe5', '#b3bdcc', '#9eaabd')}${grad(p + 'b', '#c9d0dc', '#9aa6b9')}
      <radialGradient id="${p}e" cx=".55" cy=".45" r=".6"><stop offset="0" stop-color="#f7d4da"/><stop offset="1" stop-color="#eab3be"/></radialGradient></defs>
      <path d="M40 104 C56 106 62 96 60 88" stroke="#9eaabd" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M60 88 l-3 -6 l6 1Z" fill="#8d99ac"/>
      ${stand(p, { fill: `url(#${p}b)`, line: '#97a3b6', belly: '#cdd4df', paw: '#bcc5d2', legs: `url(#${p}b)`, toes: '#f7f4ee', knit: o.xmas && KNIT.blue })}
      ${head(`<g transform="rotate(-12 -56 -4)"><ellipse cx="-56" cy="-4" rx="44" ry="50" fill="url(#${p}b)" stroke="#97a3b6" ${OUT}/><ellipse cx="-52" cy="-1" rx="29" ry="35" fill="url(#${p}e)"/></g>
      <g transform="rotate(12 56 -4)"><ellipse cx="56" cy="-4" rx="44" ry="50" fill="url(#${p}b)" stroke="#97a3b6" ${OUT}/><ellipse cx="52" cy="-1" rx="29" ry="35" fill="url(#${p}e)"/></g>
      <ellipse cx="0" cy="0" rx="58" ry="55" fill="url(#${p}s)" stroke="#97a3b6" ${OUT}/>
      <path d="M-6 -54 C-10 -64 -2 -70 2 -64 M4 -55 C6 -68 16 -66 12 -58" stroke="#9aa6b9" stroke-width="3" fill="none" stroke-linecap="round"/>
      ${face({ smile: 'M-30 24 C-26 30 -20 30 -17 26', line: '#7d889b' })}
      <path d="M-14 14 C-16 34 -12 48 -2 56 C10 66 30 66 40 54 C46 46 40 38 33 42 C26 48 16 48 12 40 C9 32 12 22 13 14Z" fill="url(#${p}s)" stroke="#97a3b6" ${OUT}/>
      <g stroke="#9aa6b9" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8"><path d="M-12 28 C-6 31 4 31 11 28"/><path d="M-10 39 C-4 43 5 44 11 41"/><path d="M-2 49 C2 54 8 56 12 54"/></g>`)}`,
  },

  bunny: {
    name: 'Bunny',
    svg: (p, o = {}) => `<defs>${grad(p + 's', '#fffdf9', '#f3ece2', '#e6dccd')}</defs>
      <circle cx="40" cy="112" r="13" fill="#fffdf9" stroke="#cdbfae" ${OUT}/>
      ${stand(p, { fill: `url(#${p}s)`, line: '#cdbfae', belly: '#fffdf9', paw: '#f6f0e7', pad: '#f4c3cc', knit: o.xmas && KNIT.green })}
      ${head(`<g transform="rotate(-10 -24 -60)"><path d="M-24 -40 C-44 -80 -40 -130 -24 -134 C-8 -130 -4 -80 -14 -40Z" fill="url(#${p}s)" stroke="#cdbfae" ${OUT}/><path d="M-22 -50 C-34 -82 -32 -116 -24 -120 C-16 -116 -14 -82 -16 -50Z" fill="#f4c3cc"/></g>
      <g transform="rotate(14 24 -60)"><path d="M14 -40 C4 -80 8 -130 24 -134 C40 -130 44 -80 24 -40Z" fill="url(#${p}s)" stroke="#cdbfae" ${OUT}/><path d="M16 -50 C14 -82 16 -116 24 -120 C32 -116 34 -82 22 -50Z" fill="#f4c3cc"/></g>
      <ellipse cx="0" cy="0" rx="56" ry="52" fill="url(#${p}s)" stroke="#cdbfae" ${OUT}/>
      ${face({ ey: -4, smile: '', line: '#a8998a' })}
      <path d="M-6 10 C-6 6 6 6 6 10 C6 14 2 16 0 16 C-2 16 -6 14 -6 10Z" fill="#ec9fae"/>
      <path d="M0 16 V22 M0 22 C-4 27 -10 27 -12 23 M0 22 C4 27 10 27 12 23" stroke="#a8998a" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      <g fill="#c8b9a7"><circle cx="-18" cy="18" r="1.3"/><circle cx="-22" cy="22" r="1.3"/><circle cx="18" cy="18" r="1.3"/><circle cx="22" cy="22" r="1.3"/></g>`)}`,
  },

  bear: {
    name: 'Teddy bear',
    svg: (p, o = {}) => `<defs>${grad(p + 's', '#dcb48b', '#c49a70', '#ad845d')}</defs>
      ${stand(p, { fill: `url(#${p}s)`, line: '#9c7652', belly: '#ecd6bb', paw: '#c9a27a', pad: '#ecd2b4', knit: o.xmas && KNIT.red })}
      ${head(`<circle cx="-44" cy="-40" r="20" fill="url(#${p}s)" stroke="#9c7652" ${OUT}/><circle cx="-44" cy="-40" r="11" fill="#ecd2b4"/>
      <circle cx="44" cy="-40" r="20" fill="url(#${p}s)" stroke="#9c7652" ${OUT}/><circle cx="44" cy="-40" r="11" fill="#ecd2b4"/>
      <ellipse cx="0" cy="0" rx="58" ry="54" fill="url(#${p}s)" stroke="#9c7652" ${OUT}/>
      <ellipse cx="0" cy="18" rx="26" ry="20" fill="#f0dcc2"/>
      ${face({ ey: -8, cy: 10, cx: 40, cheek: '#eb9d9d', smile: '', line: '#8a6a4c' })}
      <path d="M-9 10 C-9 4 9 4 9 10 C9 15 3 17 0 17 C-3 17 -9 15 -9 10Z" fill="#5a4234"/><ellipse cx="-3" cy="8" rx="3" ry="1.6" fill="#fff" opacity=".6"/>
      <path d="M0 17 V24 M0 24 C-4 29 -10 29 -12 25 M0 24 C4 29 10 29 12 25" stroke="#7a5a40" stroke-width="1.6" fill="none" stroke-linecap="round"/>`)}
      ${o.xmas ? '' : tie(48)}`,
  },

  /* Long neck, small head held high, hooves */
  giraffe: {
    name: 'Giraffe',
    hatAt: 'translate(0 -21) scale(.78)',
    svg: (p, o = {}) => {
      const k = o.xmas && KNIT.mustard;
      return `<defs>${grad(p + 's', '#f8e2a8', '#f0cd84', '#e3b968')}</defs>
      <path d="M38 104 C54 108 62 98 60 88" stroke="#e0b465" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M60 88 C56 82 60 76 64 80 C68 84 64 90 60 88Z" fill="#a9774a"/>
      <path d="M-13 -6 C-14 24 -17 48 -21 70 L21 70 C17 48 14 24 13 -6Z" fill="url(#${p}s)" stroke="#c99a52" ${OUT}/>
      <g fill="#dca25a" opacity=".85"><path d="M-10 24 C-6 20 0 22 -1 28 C-3 33 -10 31 -10 24Z"/><path d="M4 38 C9 35 13 40 11 45 C8 49 2 46 4 38Z"/><path d="M-12 50 C-8 47 -3 50 -5 55 C-8 59 -13 56 -12 50Z"/></g>
      <path d="M7 -10 C12 10 15 34 17 56" stroke="#b07e44" stroke-width="5" fill="none" stroke-linecap="round" opacity=".55"/>
      ${stand(p, { fill: `url(#${p}s)`, line: '#c99a52', belly: '#f8e7bf', paw: '#f0cd84', legs: `url(#${p}s)`, hooves: '#8d6845', T: 64, knit: k })}
      ${k ? '' : `<g fill="#dca25a" opacity=".85"><path d="M-36 80 C-30 74 -22 78 -24 86 C-28 92 -38 88 -36 80Z"/><path d="M26 76 C34 72 40 80 36 86 C30 90 24 84 26 76Z"/><path d="M-28 118 C-24 114 -18 116 -19 121 C-22 125 -29 123 -28 118Z"/><path d="M20 124 C25 121 29 126 27 130 C23 134 18 130 20 124Z"/></g>`}
      <g transform="translate(0 -18) scale(.74)">
        <path d="M-24 -46 L-28 -76 M24 -46 L28 -76" stroke="#d8a95c" stroke-width="7" stroke-linecap="round"/><circle cx="-28" cy="-78" r="7" fill="#a9774a"/><circle cx="28" cy="-78" r="7" fill="#a9774a"/>
        <g transform="rotate(-30 -56 -26)"><ellipse cx="-56" cy="-26" rx="22" ry="11" fill="url(#${p}s)" stroke="#c99a52" ${OUT}/><ellipse cx="-54" cy="-26" rx="13" ry="5.5" fill="#f2c0b0"/></g>
        <g transform="rotate(30 56 -26)"><ellipse cx="56" cy="-26" rx="22" ry="11" fill="url(#${p}s)" stroke="#c99a52" ${OUT}/><ellipse cx="54" cy="-26" rx="13" ry="5.5" fill="#f2c0b0"/></g>
        <path d="M-50 -4 C-50 -38 -28 -54 0 -54 C28 -54 50 -38 50 -4 C50 14 40 30 34 40 C26 52 14 58 0 58 C-14 58 -26 52 -34 40 C-40 30 -50 14 -50 -4Z" fill="url(#${p}s)" stroke="#c99a52" ${OUT}/>
        <g fill="#dca25a" opacity=".85"><path d="M-38 -28 C-32 -38 -20 -34 -22 -24 C-26 -16 -38 -18 -38 -28Z"/><path d="M26 -36 C34 -40 42 -30 38 -24 C32 -20 24 -26 26 -36Z"/></g>
        <ellipse cx="0" cy="30" rx="30" ry="24" fill="#f9e9c6" stroke="#d9b06a" stroke-width="1.2"/>
        <g fill="#b48654"><ellipse cx="-9" cy="24" rx="3" ry="4"/><ellipse cx="9" cy="24" rx="3" ry="4"/></g>
        ${face({ ey: -12, cy: 6, cx: 36, cheek: '#efa18a', smile: 'M-10 38 C-5 43 5 43 10 38', line: '#9b7448' })}
      </g>`;
    },
  },

  lion: {
    name: 'Lion',
    svg: (p, o = {}) => `<defs>${grad(p + 's', '#f7d8a4', '#efc283', '#e2ab68')}${grad(p + 'm', '#e7a960', '#d58f45', '#c47c35')}</defs>
      <path d="M40 106 C60 110 70 98 66 86" stroke="#e0a95e" stroke-width="4.5" fill="none" stroke-linecap="round"/><path d="M66 86 C58 78 62 68 70 72 C78 68 80 80 72 84Z" fill="#c9823c"/>
      ${stand(p, { fill: `url(#${p}s)`, line: '#c48a45', belly: '#f8e2bd', paw: '#f2cb92', pad: '#f6d3b7', knit: o.xmas && KNIT.green })}
      ${head(`<g fill="url(#${p}m)" stroke="#b97536" stroke-width="1.2">${Array.from({ length: 14 }, (_, i) => { const a = i / 14 * Math.PI * 2; return `<circle cx="${(Math.cos(a) * 58).toFixed(1)}" cy="${(Math.sin(a) * 56 - 2).toFixed(1)}" r="22"/>`; }).join('')}</g>
      <ellipse cx="0" cy="-2" rx="64" ry="62" fill="url(#${p}m)"/>
      <circle cx="-38" cy="-38" r="14" fill="url(#${p}s)" stroke="#c48a45" ${OUT}/><circle cx="-38" cy="-38" r="7" fill="#f2c0a4"/>
      <circle cx="38" cy="-38" r="14" fill="url(#${p}s)" stroke="#c48a45" ${OUT}/><circle cx="38" cy="-38" r="7" fill="#f2c0a4"/>
      <ellipse cx="0" cy="0" rx="48" ry="46" fill="url(#${p}s)" stroke="#c48a45" ${OUT}/>
      <ellipse cx="-11" cy="18" rx="14" ry="11" fill="#fbecd3"/><ellipse cx="11" cy="18" rx="14" ry="11" fill="#fbecd3"/>
      ${face({ ex: 20, ey: -8, cy: 10, cx: 32, cheek: '#ef9b88', smile: '', line: '#9a6a3a' })}
      <path d="M-7 8 C-7 3 7 3 7 8 C7 12 2 14 0 14 C-2 14 -7 12 -7 8Z" fill="#b3684a"/>
      <path d="M0 14 V19 M0 19 C-4 24 -9 24 -11 20 M0 19 C4 24 9 24 11 20" stroke="#9a6a3a" stroke-width="1.6" fill="none" stroke-linecap="round"/>`)}`,
  },

  fox: {
    name: 'Fox',
    svg: (p, o = {}) => `<defs>${grad(p + 's', '#f6b47c', '#ec9a5c', '#de864a')}</defs>
      <path d="M30 116 C78 126 100 82 84 50 C78 40 64 44 68 56 C76 80 62 98 30 98Z" fill="url(#${p}s)" stroke="#c97a44" ${OUT}/>
      <path d="M84 50 C78 40 64 44 68 56 C70 62 76 66 80 64 C88 60 88 54 84 50Z" fill="#fff8ef"/>
      ${stand(p, { fill: `url(#${p}s)`, line: '#c97a44', belly: '#fff4e6', paw: '#5f4636', legs: '#6b4c3a', knit: o.xmas && KNIT.cream })}
      ${head(`<path d="M-50 -24 L-46 -78 L-12 -48Z" fill="url(#${p}s)" stroke="#c97a44" ${OUT}/><path d="M-44 -34 L-43 -66 L-22 -48Z" fill="#5a4234"/>
      <path d="M50 -24 L46 -78 L12 -48Z" fill="url(#${p}s)" stroke="#c97a44" ${OUT}/><path d="M44 -34 L43 -66 L22 -48Z" fill="#5a4234"/>
      <path d="M-56 -4 C-56 -36 -30 -54 0 -54 C30 -54 56 -36 56 -4 C56 26 30 46 0 48 C-30 46 -56 26 -56 -4Z" fill="url(#${p}s)" stroke="#c97a44" ${OUT}/>
      <path d="M-54 6 C-40 6 -24 14 -10 26 C-6 36 6 36 10 26 C24 14 40 6 54 6 C50 30 28 46 0 48 C-28 46 -50 30 -54 6Z" fill="#fff8ef"/>
      ${face({ ex: 22, ey: -10, cy: 8, cx: 38, cheek: '#f08a76', smile: '', line: '#9b6440' })}
      <path d="M-6 24 C-6 20 6 20 6 24 C6 28 2 30 0 30 C-2 30 -6 28 -6 24Z" fill="#3b3a45"/>
      <path d="M0 30 V34 M0 34 C-3 38 -8 38 -10 35 M0 34 C3 38 8 38 10 35" stroke="#9b6440" stroke-width="1.6" fill="none" stroke-linecap="round"/>`)}`,
  },

  dino: {
    name: 'Little dinosaur',
    svg: (p, o = {}) => `<defs>${grad(p + 's', '#c9e0b7', '#a9c99a', '#93b886')}</defs>
      <path d="M36 100 C66 108 90 104 100 88 C98 104 80 126 36 122Z" fill="url(#${p}s)" stroke="#7fa173" ${OUT}/>
      <g fill="#f2c27b" stroke="#d9a65d" stroke-width="1.2"><path d="M54 104 L66 94 L68 108Z"/><path d="M72 102 L86 92 L84 106Z"/></g>
      ${stand(p, { fill: `url(#${p}s)`, line: '#7fa173', belly: '#f4ecc8', paw: '#b3d1a3', legs: `url(#${p}s)`, toes: '#f8f4e8', knit: o.xmas && KNIT.red })}
      ${o.xmas ? '' : `<g stroke="#e3d6a6" stroke-width="1.4" fill="none"><path d="M-18 70 C-6 67 6 67 18 70"/><path d="M-22 84 C-8 81 8 81 22 84"/><path d="M-22 98 C-8 95 8 95 22 98"/></g>`}
      ${head(`<g fill="#f2c27b" stroke="#d9a65d" stroke-width="1.2"><path d="M-10 -54 L0 -72 L10 -54Z"/><path d="M14 -50 L28 -64 L32 -44Z"/><path d="M34 -36 L52 -44 L50 -24Z"/></g>
      <ellipse cx="0" cy="0" rx="58" ry="54" fill="url(#${p}s)" stroke="#7fa173" ${OUT}/>
      <g fill="#8fb37f" opacity=".55"><circle cx="-30" cy="-34" r="5"/><circle cx="-18" cy="-42" r="3.5"/><circle cx="34" cy="-30" r="4"/></g>
      ${face({ ey: -8, cy: 12, cx: 38, cheek: '#f2a39a', smile: 'M-16 22 C-8 32 8 32 16 22', line: '#5f8155' })}
      <g fill="#6f9364"><ellipse cx="-6" cy="8" rx="2" ry="1.5"/><ellipse cx="6" cy="8" rx="2" ry="1.5"/></g>`)}`,
  },

  /* ---- Christmas woodland friends (Christmas design only) ---- */
  reindeer: {
    name: 'Reindeer',
    noHat: true,
    svg: (p, o = {}) => `<defs>${grad(p + 's', '#c99a74', '#ae7f5a', '#966a48')}</defs>
      <path d="M36 102 C44 96 52 100 48 108 C44 112 38 110 36 102Z" fill="#f5ede2" stroke="#8a6346" stroke-width="1.2"/>
      ${stand(p, { fill: `url(#${p}s)`, line: '#8a6346', belly: '#efe0cc', paw: '#ae7f5a', legs: `url(#${p}s)`, hooves: '#5a4234', knit: o.xmas !== false && KNIT.red })}
      ${head(`<g fill="none" stroke="#8a6346" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
        <path d="M-26 -46 C-34 -70 -50 -84 -58 -106 M-40 -72 C-56 -74 -66 -82 -72 -92 M-50 -90 C-44 -104 -42 -112 -44 -122"/>
        <path d="M26 -46 C34 -70 50 -84 58 -106 M40 -72 C56 -74 66 -82 72 -92 M50 -90 C44 -104 42 -112 44 -122"/></g>
      <g fill="none" stroke="#b58b66" stroke-width="3" stroke-linecap="round" opacity=".7"><path d="M-28 -52 C-36 -72 -48 -84 -56 -102"/><path d="M28 -52 C36 -72 48 -84 56 -102"/></g>
      <g transform="rotate(-28 -56 -18)"><ellipse cx="-58" cy="-18" rx="22" ry="10" fill="url(#${p}s)" stroke="#8a6346" ${OUT}/><ellipse cx="-56" cy="-18" rx="13" ry="5" fill="#f2c0b0"/></g>
      <g transform="rotate(28 56 -18)"><ellipse cx="58" cy="-18" rx="22" ry="10" fill="url(#${p}s)" stroke="#8a6346" ${OUT}/><ellipse cx="56" cy="-18" rx="13" ry="5" fill="#f2c0b0"/></g>
      <ellipse cx="0" cy="0" rx="54" ry="52" fill="url(#${p}s)" stroke="#8a6346" ${OUT}/>
      <ellipse cx="0" cy="24" rx="28" ry="20" fill="#efe0cc"/>
      <path d="M-14 -50 C-6 -40 6 -40 14 -50" stroke="#966a48" stroke-width="3" fill="none" stroke-linecap="round"/>
      ${face({ ey: -8, cy: 10, cx: 38, cheek: '#ef9b88', smile: 'M-8 34 C-4 38 4 38 8 34', line: '#7a5a40' })}
      <circle cx="0" cy="20" r="10" fill="#d23c45"/><circle cx="-3" cy="16" r="3" fill="#fff" opacity=".7"/>`)}
      ${scarf(40, '#3f7a52', '#f4ead8', 24)}`,
  },

  owl: {
    name: 'Owl',
    noHat: true,
    svg: (p, o = {}) => `<defs>${grad(p + 's', '#c7b29a', '#a98f75', '#927a62')}${grad(p + 'f', '#fbf3e6', '#f1e3cc', '#e6d4b8')}</defs>
      <g fill="#e39a4a" stroke="#b9772f" stroke-width="1.2"><path d="M-24 144 l-6 7 h8 l2 -5 l2 5 h8 l-4 -7Z"/><path d="M24 144 l-6 7 h8 l2 -5 l2 5 h8 l-4 -7Z"/></g>
      <path d="M-50 -10 C-60 30 -60 110 -30 140 C-10 152 10 152 30 140 C60 110 60 30 50 -10 C40 -50 -40 -50 -50 -10Z" fill="url(#${p}s)" stroke="#7d6650" ${OUT}/>
      <path d="M-30 50 C-34 80 -28 120 0 132 C28 120 34 80 30 50 C20 40 -20 40 -30 50Z" fill="url(#${p}f)"/>
      <g fill="none" stroke="#c7a984" stroke-width="1.8" stroke-linecap="round">${[64, 80, 96, 112].map((y, i) => [-14, 0, 14].map(x => `<path d="M${x - 5 + (i % 2) * 7} ${y} q5 5 10 0"/>`).join('')).join('')}</g>
      <path d="M-50 30 C-74 54 -70 100 -46 116 C-40 90 -38 60 -50 30Z" fill="#8a725b" stroke="#7d6650" ${OUT}/>
      <path d="M50 30 C74 54 70 100 46 116 C40 90 38 60 50 30Z" fill="#8a725b" stroke="#7d6650" ${OUT}/>
      <path d="M-44 -34 L-50 -66 L-22 -42Z M44 -34 L50 -66 L22 -42Z" fill="url(#${p}s)" stroke="#7d6650" ${OUT}/>
      <circle cx="-22" cy="-4" r="22" fill="url(#${p}f)" stroke="#d8c3a4" stroke-width="1.2"/><circle cx="22" cy="-4" r="22" fill="url(#${p}f)" stroke="#d8c3a4" stroke-width="1.2"/>
      <circle cx="-22" cy="-4" r="10" fill="#3b3a45"/><circle cx="22" cy="-4" r="10" fill="#3b3a45"/>
      <circle cx="-18" cy="-8" r="3.6" fill="#fff"/><circle cx="26" cy="-8" r="3.6" fill="#fff"/>
      <ellipse cx="-42" cy="18" rx="8" ry="5" fill="#f1a7b5" opacity=".55"/><ellipse cx="42" cy="18" rx="8" ry="5" fill="#f1a7b5" opacity=".55"/>
      <path d="M-6 12 L0 26 L6 12 C2 9 -2 9 -6 12Z" fill="#e39a4a" stroke="#b9772f" stroke-width="1"/>
      ${o.xmas !== false ? scarf(34, '#c8424b', '#f4ead8', 34) : ''}`,
  },

  hedgehog: {
    name: 'Hedgehog',
    svg: (p, o = {}) => {
      const sp = [];
      for (let i = 0; i < 19; i++) {                         // spikes around the head and down the back
        const a = Math.PI * (.92 + i / 18 * 1.16), r1 = 54, r2 = 74 + (i % 2) * 8;
        const x1 = Math.cos(a - .14) * r1, y1 = Math.sin(a - .14) * r1, x2 = Math.cos(a) * r2, y2 = Math.sin(a) * r2, x3 = Math.cos(a + .14) * r1, y3 = Math.sin(a + .14) * r1;
        sp.push(`M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)} L${x3.toFixed(1)} ${y3.toFixed(1)}Z`);
      }
      return `<defs>${grad(p + 's', '#f6e3cc', '#ecd2b2', '#ddbd98')}${grad(p + 'q', '#9b7a5c', '#7d5f45', '#664c37')}</defs>
      <path d="M-46 40 C-62 70 -60 110 -40 122 L40 122 C60 110 62 70 46 40Z" fill="url(#${p}q)" stroke="#5a4234" ${OUT}/>
      ${stand(p, { fill: `url(#${p}s)`, line: '#b08d6a', belly: '#fbf1e2', paw: '#8a6a50', legs: '#c9a682', knit: o.xmas !== false && KNIT.green })}
      ${head(`<path d="${sp.join(' ')}" fill="url(#${p}q)" stroke="#5a4234" stroke-width="1.2" stroke-linejoin="round"/>
      <ellipse cx="0" cy="-6" rx="60" ry="52" fill="url(#${p}q)"/>
      <circle cx="-40" cy="-30" r="11" fill="url(#${p}s)" stroke="#b08d6a" ${OUT}/><circle cx="40" cy="-30" r="11" fill="url(#${p}s)" stroke="#b08d6a" ${OUT}/>
      <path d="M-50 4 C-50 -26 -26 -38 0 -38 C26 -38 50 -26 50 4 C50 28 30 44 0 48 C-30 44 -50 28 -50 4Z" fill="url(#${p}s)" stroke="#b08d6a" ${OUT}/>
      ${face({ ex: 22, ey: 0, cy: 18, cx: 34, cheek: '#f08a8a', smile: '', line: '#8a6a50' })}
      <ellipse cx="0" cy="26" rx="8" ry="6" fill="#3b3a45"/><ellipse cx="-2" cy="24" rx="2.5" ry="1.4" fill="#fff" opacity=".6"/>
      <path d="M0 32 V36 M0 36 C-3 40 -8 40 -10 37 M0 36 C3 40 8 40 10 37" stroke="#8a6a50" stroke-width="1.6" fill="none" stroke-linecap="round"/>`)}`;
    },
  },

  mouse: {
    name: 'Mouse',
    svg: (p, o = {}) => `<defs>${grad(p + 's', '#d9d6d2', '#bdb8b2', '#a8a29b')}</defs>
      <path d="M36 112 C70 124 86 100 74 84 C66 74 56 82 64 90" stroke="#e7a9b4" stroke-width="4" fill="none" stroke-linecap="round"/>
      ${stand(p, { fill: `url(#${p}s)`, line: '#958e86', belly: '#f1ede8', paw: '#f2c4cc', knit: o.xmas !== false && KNIT.red })}
      ${o.xmas !== false ? scarf(38, '#3f7a52', '#f4ead8', 24) : ''}
      ${head(`<circle cx="-50" cy="-40" r="32" fill="url(#${p}s)" stroke="#958e86" ${OUT}/><circle cx="-48" cy="-38" r="20" fill="#f4c3cc"/>
      <circle cx="50" cy="-40" r="32" fill="url(#${p}s)" stroke="#958e86" ${OUT}/><circle cx="48" cy="-38" r="20" fill="#f4c3cc"/>
      <ellipse cx="0" cy="2" rx="52" ry="50" fill="url(#${p}s)" stroke="#958e86" ${OUT}/>
      ${face({ ey: -4, cy: 14, cx: 34, cheek: '#f1a7b5', smile: '', line: '#7d766f' })}
      <ellipse cx="0" cy="14" rx="6" ry="4.6" fill="#e58a9c"/>
      <path d="M0 19 V23 M0 23 C-4 27 -9 27 -11 24 M0 23 C4 27 9 27 11 24" stroke="#7d766f" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      <g stroke="#a39c94" stroke-width="1.2" stroke-linecap="round"><path d="M-14 16 L-34 12 M-14 20 L-34 22 M14 16 L34 12 M14 20 L34 22"/></g>`)}`,
  },

  /* Christmas only: a little elf in a green suit, pointy hat with a bell and pointy ears */
  elf: {
    name: 'Little elf',
    noHat: true,
    svg: p => `<defs>${grad(p + 'k', '#ffe8d6', '#f9d2b6', '#efbd9b')}${grad(p + 'g', '#7cbf7f', '#57a05f', '#448a4d')}${grad(p + 'h', '#6fb873', '#4c9a55', '#3c8045')}</defs>
      ${stand(p, { fill: `url(#${p}g)`, line: '#3d7a46', belly: '#9fd3a0', paw: `url(#${p}k)`, legs: '#d64545', hooves: '#7a4a2c' })}
      <path d="M-42 104 H42" stroke="#3d2b1f" stroke-width="7" stroke-linecap="round"/><rect x="-8" y="98" width="16" height="12" rx="2" fill="#f2c94c" stroke="#b8902e" stroke-width="1.4"/>
      <path d="M-30 34 L-22 46 L-12 36 L-4 48 L4 36 L12 48 L22 36 L30 46 L36 36 Z" fill="#d64545" stroke="#a83232" stroke-width="1.4" stroke-linejoin="round"/>
      ${head(`<path d="M-50 -12 C-70 -18 -92 -32 -106 -52 C-100 -22 -80 4 -50 16Z" fill="url(#${p}k)" stroke="#d9a07c" ${OUT}/>
      <path d="M50 -12 C70 -18 92 -32 106 -52 C100 -22 80 4 50 16Z" fill="url(#${p}k)" stroke="#d9a07c" ${OUT}/>
      <ellipse cx="0" cy="0" rx="56" ry="54" fill="url(#${p}k)" stroke="#d9a07c" ${OUT}/>
      <path d="M-40 -34 C-30 -24 -16 -22 -8 -30 C0 -22 12 -22 20 -30" fill="none" stroke="#b07a52" stroke-width="3" stroke-linecap="round" opacity=".7"/>
      ${face({ cheek: '#f39aa8', line: '#9a6a4f', smile: 'M-10 22 C-5 29 5 29 10 22' })}
      <path d="M-58 -30 C-46 -86 6 -122 58 -112 C80 -108 96 -94 102 -78 C88 -88 72 -90 60 -84 C42 -74 32 -54 58 -32 Z" fill="url(#${p}h)" stroke="#3d7a46" ${OUT}/>
      <path d="M-40 -60 C-24 -88 8 -104 40 -102" stroke="#9fd3a0" stroke-width="4" fill="none" stroke-linecap="round" opacity=".55"/>
      <rect x="-64" y="-42" width="126" height="18" rx="9" fill="#d64545" stroke="#a83232" stroke-width="1.4"/>
      <circle cx="104" cy="-74" r="10" fill="#f2c94c" stroke="#b8902e" stroke-width="1.4"/><path d="M98 -72 H110" stroke="#b8902e" stroke-width="1.6"/>`)}`,
  },
};

export const ANIMAL_ORDER = ['elephant', 'bunny', 'bear', 'giraffe', 'lion', 'fox', 'dino'];
/* Christmas · Little Animals: woodland friends in knitted sweaters, then the little elf */
export const XMAS_ORDER = ['reindeer', 'fox', 'bear', 'bunny', 'owl', 'hedgehog', 'mouse', 'elf'];

/* A different animal for each milestone (newborn = 0, 1-12 months, 18 months, 2 and 3 years). */
export function animalFor(choice, milestone) {
  if (ANIMALS[choice]) return choice;
  const steps = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '18', '24', '36'];
  const i = Math.max(0, steps.indexOf(String(milestone)));
  return ANIMAL_ORDER[i % ANIMAL_ORDER.length];
}
