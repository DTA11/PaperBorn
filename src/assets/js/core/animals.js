/* Little Animals: cute sitting animals drawn as SVG (no image files).
   Every animal shares one pose box: origin at the centre of the head, head about 115 wide, feet resting at y ≈ 150.
   Gradient ids are prefixed per animal so several can share a page (preview, mini preview, export). */

const OUT = 'stroke-width="1.4" stroke-linejoin="round"';

/* Shared face: eyes with highlights, brows, cheeks and a little smile. */
const face = ({ ex = 24, ey = -6, cheek = '#f1a7b5', cy = 14, cx = 38, line = '#7d889b', smile = 'M-8 22 C-4 27 4 27 8 22', brows = true } = {}) => `
  <ellipse cx="${-ex}" cy="${ey}" rx="6.5" ry="8.5" fill="#3b3a45"/><ellipse cx="${ex}" cy="${ey}" rx="6.5" ry="8.5" fill="#3b3a45"/>
  <circle cx="${-ex + 2}" cy="${ey - 3}" r="2.6" fill="#fff"/><circle cx="${ex + 2}" cy="${ey - 3}" r="2.6" fill="#fff"/>
  <circle cx="${-ex - 2}" cy="${ey + 4}" r="1.2" fill="#fff" opacity=".8"/><circle cx="${ex - 2}" cy="${ey + 4}" r="1.2" fill="#fff" opacity=".8"/>
  ${brows ? `<path d="M${-ex - 8} ${ey - 14} C${-ex - 4} ${ey - 18} ${-ex + 4} ${ey - 18} ${-ex + 8} ${ey - 15} M${ex - 8} ${ey - 15} C${ex - 4} ${ey - 18} ${ex + 4} ${ey - 18} ${ex + 8} ${ey - 14}" stroke="${line}" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".55"/>` : ''}
  <ellipse cx="${-cx}" cy="${cy}" rx="10" ry="7" fill="${cheek}" opacity=".55"/><ellipse cx="${cx}" cy="${cy}" rx="10" ry="7" fill="${cheek}" opacity=".55"/>
  ${smile ? `<path d="${smile}" stroke="${line}" stroke-width="1.8" fill="none" stroke-linecap="round"/>` : ''}`;

const grad = (id, a, b, c = b) => `<radialGradient id="${id}" cx=".42" cy=".35" r=".8"><stop offset="0" stop-color="${a}"/><stop offset=".7" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></radialGradient>`;

/* Sitting body with two back feet and two front paws. */
const body = (fill, line, belly, paw, pad) => `
  <path d="M-44 28 C-78 62 -76 132 -30 140 L30 140 C76 132 78 62 44 28 C24 18 -24 18 -44 28Z" fill="${fill}" stroke="${line}" ${OUT}/>
  <ellipse cx="0" cy="108" rx="34" ry="28" fill="${belly}" opacity=".85"/>
  <ellipse cx="-56" cy="128" rx="24" ry="16" fill="${paw}" stroke="${line}" stroke-width="1.2"/><ellipse cx="56" cy="128" rx="24" ry="16" fill="${paw}" stroke="${line}" stroke-width="1.2"/>
  <g fill="${paw}" stroke="${line}" stroke-width="1.2"><ellipse cx="-24" cy="136" rx="20" ry="15"/><ellipse cx="24" cy="136" rx="20" ry="15"/></g>
  ${pad ? `<g fill="${pad}"><ellipse cx="-24" cy="139" rx="8" ry="6"/><ellipse cx="24" cy="139" rx="8" ry="6"/>
    <circle cx="-33" cy="131" r="3"/><circle cx="-24" cy="128" r="3"/><circle cx="-15" cy="131" r="3"/><circle cx="15" cy="131" r="3"/><circle cx="24" cy="128" r="3"/><circle cx="33" cy="131" r="3"/></g>` : ''}`;

export const ANIMALS = {
  elephant: {
    name: 'Elephant',
    svg: p => `<defs>${grad(p + 's', '#d5dbe5', '#b3bdcc', '#9eaabd')}${grad(p + 'b', '#c9d0dc', '#9aa6b9')}
      <radialGradient id="${p}e" cx=".55" cy=".45" r=".6"><stop offset="0" stop-color="#f7d4da"/><stop offset="1" stop-color="#eab3be"/></radialGradient></defs>
      <path d="M52 108 C70 104 78 92 74 84" stroke="#9eaabd" stroke-width="5" fill="none" stroke-linecap="round"/>
      <g transform="rotate(-12 -56 -4)"><ellipse cx="-56" cy="-4" rx="44" ry="50" fill="url(#${p}b)" stroke="#97a3b6" ${OUT}/><ellipse cx="-52" cy="-1" rx="29" ry="35" fill="url(#${p}e)"/></g>
      <g transform="rotate(12 56 -4)"><ellipse cx="56" cy="-4" rx="44" ry="50" fill="url(#${p}b)" stroke="#97a3b6" ${OUT}/><ellipse cx="52" cy="-1" rx="29" ry="35" fill="url(#${p}e)"/></g>
      ${body(`url(#${p}b)`, '#97a3b6', '#cdd4df', '#bcc5d2')}
      <g fill="#f7f4ee"><ellipse cx="-32" cy="144" rx="4" ry="3"/><ellipse cx="-24" cy="146" rx="4" ry="3"/><ellipse cx="-16" cy="144" rx="4" ry="3"/><ellipse cx="16" cy="144" rx="4" ry="3"/><ellipse cx="24" cy="146" rx="4" ry="3"/><ellipse cx="32" cy="144" rx="4" ry="3"/></g>
      <ellipse cx="0" cy="0" rx="58" ry="55" fill="url(#${p}s)" stroke="#97a3b6" ${OUT}/>
      <path d="M-6 -54 C-10 -64 -2 -70 2 -64 M4 -55 C6 -68 16 -66 12 -58" stroke="#9aa6b9" stroke-width="3" fill="none" stroke-linecap="round"/>
      ${face({ smile: 'M-30 24 C-26 30 -20 30 -17 26', line: '#7d889b' })}
      <path d="M-14 14 C-16 34 -12 48 -2 56 C10 66 30 66 40 54 C46 46 40 38 33 42 C26 48 16 48 12 40 C9 32 12 22 13 14Z" fill="url(#${p}s)" stroke="#97a3b6" ${OUT}/>
      <g stroke="#9aa6b9" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8"><path d="M-12 28 C-6 31 4 31 11 28"/><path d="M-10 39 C-4 43 5 44 11 41"/><path d="M-2 49 C2 54 8 56 12 54"/></g>`,
  },

  bunny: {
    name: 'Bunny',
    svg: p => `<defs>${grad(p + 's', '#fffdf9', '#f3ece2', '#e6dccd')}</defs>
      <circle cx="62" cy="122" r="16" fill="#fffdf9" stroke="#cdbfae" ${OUT}/>
      <g transform="rotate(-10 -24 -60)"><path d="M-24 -40 C-44 -80 -40 -130 -24 -134 C-8 -130 -4 -80 -14 -40Z" fill="url(#${p}s)" stroke="#cdbfae" ${OUT}/><path d="M-22 -50 C-34 -82 -32 -116 -24 -120 C-16 -116 -14 -82 -16 -50Z" fill="#f4c3cc"/></g>
      <g transform="rotate(14 24 -60)"><path d="M14 -40 C4 -80 8 -130 24 -134 C40 -130 44 -80 24 -40Z" fill="url(#${p}s)" stroke="#cdbfae" ${OUT}/><path d="M16 -50 C14 -82 16 -116 24 -120 C32 -116 34 -82 22 -50Z" fill="#f4c3cc"/></g>
      ${body(`url(#${p}s)`, '#cdbfae', '#fffdf9', '#f6f0e7', '#f4c3cc')}
      <ellipse cx="0" cy="0" rx="56" ry="52" fill="url(#${p}s)" stroke="#cdbfae" ${OUT}/>
      ${face({ ey: -4, smile: '', line: '#a8998a' })}
      <path d="M-6 10 C-6 6 6 6 6 10 C6 14 2 16 0 16 C-2 16 -6 14 -6 10Z" fill="#ec9fae"/>
      <path d="M0 16 V22 M0 22 C-4 27 -10 27 -12 23 M0 22 C4 27 10 27 12 23" stroke="#a8998a" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      <g fill="#c8b9a7"><circle cx="-18" cy="18" r="1.3"/><circle cx="-22" cy="22" r="1.3"/><circle cx="18" cy="18" r="1.3"/><circle cx="22" cy="22" r="1.3"/></g>`,
  },

  bear: {
    name: 'Teddy bear',
    svg: p => `<defs>${grad(p + 's', '#dcb48b', '#c49a70', '#ad845d')}</defs>
      <circle cx="-44" cy="-40" r="20" fill="url(#${p}s)" stroke="#9c7652" ${OUT}/><circle cx="-44" cy="-40" r="11" fill="#ecd2b4"/>
      <circle cx="44" cy="-40" r="20" fill="url(#${p}s)" stroke="#9c7652" ${OUT}/><circle cx="44" cy="-40" r="11" fill="#ecd2b4"/>
      ${body(`url(#${p}s)`, '#9c7652', '#ecd6bb', '#c9a27a', '#ecd2b4')}
      <ellipse cx="0" cy="0" rx="58" ry="54" fill="url(#${p}s)" stroke="#9c7652" ${OUT}/>
      <ellipse cx="0" cy="18" rx="26" ry="20" fill="#f0dcc2"/>
      ${face({ ey: -8, cy: 10, cx: 40, cheek: '#eb9d9d', smile: '', line: '#8a6a4c' })}
      <path d="M-9 10 C-9 4 9 4 9 10 C9 15 3 17 0 17 C-3 17 -9 15 -9 10Z" fill="#5a4234"/><ellipse cx="-3" cy="8" rx="3" ry="1.6" fill="#fff" opacity=".6"/>
      <path d="M0 17 V24 M0 24 C-4 29 -10 29 -12 25 M0 24 C4 29 10 29 12 25" stroke="#7a5a40" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      <g transform="translate(0 46)"><path d="M0 0 C-16 -10 -20 8 0 0 C16 -10 20 8 0 0Z" fill="#9fc2dd" stroke="#7fa6c6" stroke-width="1"/><circle r="3.4" fill="#86aed0"/></g>`,
  },

  giraffe: {
    name: 'Giraffe',
    svg: p => `<defs>${grad(p + 's', '#f8e2a8', '#f0cd84', '#e3b968')}</defs>
      <path d="M52 108 C72 106 80 96 78 84" stroke="#e0b465" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="78" cy="82" r="5" fill="#a9774a"/>
      <path d="M-24 -46 L-28 -76 M24 -46 L28 -76" stroke="#d8a95c" stroke-width="7" stroke-linecap="round"/><circle cx="-28" cy="-78" r="7" fill="#a9774a"/><circle cx="28" cy="-78" r="7" fill="#a9774a"/>
      <g transform="rotate(-30 -56 -26)"><ellipse cx="-56" cy="-26" rx="22" ry="11" fill="url(#${p}s)" stroke="#c99a52" ${OUT}/><ellipse cx="-54" cy="-26" rx="13" ry="5.5" fill="#f2c0b0"/></g>
      <g transform="rotate(30 56 -26)"><ellipse cx="56" cy="-26" rx="22" ry="11" fill="url(#${p}s)" stroke="#c99a52" ${OUT}/><ellipse cx="54" cy="-26" rx="13" ry="5.5" fill="#f2c0b0"/></g>
      ${body(`url(#${p}s)`, '#c99a52', '#f8e7bf', '#e9c47c')}
      <g fill="#dca25a" opacity=".85"><path d="M-48 72 C-40 64 -30 70 -32 80 C-38 88 -50 82 -48 72Z"/><path d="M36 64 C46 60 54 70 48 78 C40 82 32 74 36 64Z"/><path d="M-60 104 C-54 98 -46 104 -48 110 C-54 116 -62 112 -60 104Z"/><path d="M50 98 C58 96 62 106 56 110 C48 112 46 102 50 98Z"/></g>
      <g fill="#8d6845"><ellipse cx="-24" cy="148" rx="13" ry="4"/><ellipse cx="24" cy="148" rx="13" ry="4"/></g>
      <ellipse cx="0" cy="0" rx="52" ry="54" fill="url(#${p}s)" stroke="#c99a52" ${OUT}/>
      <g fill="#dca25a" opacity=".85"><path d="M-40 -28 C-34 -38 -22 -34 -24 -24 C-28 -16 -40 -18 -40 -28Z"/><path d="M28 -36 C36 -40 44 -30 40 -24 C34 -20 26 -26 28 -36Z"/></g>
      <ellipse cx="0" cy="24" rx="32" ry="22" fill="#f9e9c6" stroke="#d9b06a" stroke-width="1.2"/>
      <g fill="#b48654"><ellipse cx="-9" cy="20" rx="3" ry="4"/><ellipse cx="9" cy="20" rx="3" ry="4"/></g>
      ${face({ ey: -10, cy: 6, cx: 40, cheek: '#efa18a', smile: 'M-10 32 C-5 37 5 37 10 32', line: '#9b7448' })}`,
  },

  lion: {
    name: 'Lion',
    svg: p => `<defs>${grad(p + 's', '#f7d8a4', '#efc283', '#e2ab68')}${grad(p + 'm', '#e7a960', '#d58f45', '#c47c35')}</defs>
      <path d="M52 108 C74 110 84 96 80 84" stroke="#e0a95e" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M80 84 C72 76 76 66 84 70 C92 66 94 78 86 82Z" fill="#c9823c"/>
      <g fill="url(#${p}m)" stroke="#b97536" stroke-width="1.2">${Array.from({ length: 14 }, (_, i) => { const a = i / 14 * Math.PI * 2; return `<circle cx="${(Math.cos(a) * 58).toFixed(1)}" cy="${(Math.sin(a) * 56 - 2).toFixed(1)}" r="22"/>`; }).join('')}</g>
      <ellipse cx="0" cy="-2" rx="64" ry="62" fill="url(#${p}m)"/>
      <circle cx="-38" cy="-38" r="14" fill="url(#${p}s)" stroke="#c48a45" ${OUT}/><circle cx="-38" cy="-38" r="7" fill="#f2c0a4"/>
      <circle cx="38" cy="-38" r="14" fill="url(#${p}s)" stroke="#c48a45" ${OUT}/><circle cx="38" cy="-38" r="7" fill="#f2c0a4"/>
      ${body(`url(#${p}s)`, '#c48a45', '#f8e2bd', '#f2cb92', '#f6d3b7')}
      <ellipse cx="0" cy="0" rx="48" ry="46" fill="url(#${p}s)" stroke="#c48a45" ${OUT}/>
      <ellipse cx="-11" cy="18" rx="14" ry="11" fill="#fbecd3"/><ellipse cx="11" cy="18" rx="14" ry="11" fill="#fbecd3"/>
      ${face({ ex: 20, ey: -8, cy: 10, cx: 32, cheek: '#ef9b88', smile: '', line: '#9a6a3a' })}
      <path d="M-7 8 C-7 3 7 3 7 8 C7 12 2 14 0 14 C-2 14 -7 12 -7 8Z" fill="#b3684a"/>
      <path d="M0 14 V19 M0 19 C-4 24 -9 24 -11 20 M0 19 C4 24 9 24 11 20" stroke="#9a6a3a" stroke-width="1.6" fill="none" stroke-linecap="round"/>`,
  },

  fox: {
    name: 'Fox',
    svg: p => `<defs>${grad(p + 's', '#f6b47c', '#ec9a5c', '#de864a')}</defs>
      <path d="M40 120 C90 130 110 80 92 52 C86 44 74 48 78 60 C86 84 72 104 40 104Z" fill="url(#${p}s)" stroke="#c97a44" ${OUT}/>
      <path d="M92 52 C86 44 74 48 78 60 C80 66 84 68 88 66 C94 62 96 56 92 52Z" fill="#fff8ef"/>
      <path d="M-50 -24 L-46 -78 L-12 -48Z" fill="url(#${p}s)" stroke="#c97a44" ${OUT}/><path d="M-44 -34 L-43 -66 L-22 -48Z" fill="#5a4234"/>
      <path d="M50 -24 L46 -78 L12 -48Z" fill="url(#${p}s)" stroke="#c97a44" ${OUT}/><path d="M44 -34 L43 -66 L22 -48Z" fill="#5a4234"/>
      ${body(`url(#${p}s)`, '#c97a44', '#fff4e6', '#5f4636')}
      <path d="M-56 -4 C-56 -36 -30 -54 0 -54 C30 -54 56 -36 56 -4 C56 26 30 46 0 48 C-30 46 -56 26 -56 -4Z" fill="url(#${p}s)" stroke="#c97a44" ${OUT}/>
      <path d="M-54 6 C-40 6 -24 14 -10 26 C-6 36 6 36 10 26 C24 14 40 6 54 6 C50 30 28 46 0 48 C-28 46 -50 30 -54 6Z" fill="#fff8ef"/>
      ${face({ ex: 22, ey: -10, cy: 8, cx: 38, cheek: '#f08a76', smile: '', line: '#9b6440' })}
      <path d="M-6 24 C-6 20 6 20 6 24 C6 28 2 30 0 30 C-2 30 -6 28 -6 24Z" fill="#3b3a45"/>
      <path d="M0 30 V34 M0 34 C-3 38 -8 38 -10 35 M0 34 C3 38 8 38 10 35" stroke="#9b6440" stroke-width="1.6" fill="none" stroke-linecap="round"/>`,
  },

  dino: {
    name: 'Little dinosaur',
    svg: p => `<defs>${grad(p + 's', '#c9e0b7', '#a9c99a', '#93b886')}</defs>
      <path d="M44 104 C80 112 108 104 116 88 C112 102 92 124 46 128Z" fill="url(#${p}s)" stroke="#7fa173" ${OUT}/>
      <g fill="#f2c27b" stroke="#d9a65d" stroke-width="1.2">
        <path d="M-10 -54 L0 -72 L10 -54Z"/><path d="M14 -50 L28 -64 L32 -44Z"/><path d="M34 -36 L52 -44 L50 -24Z"/>
        <path d="M60 52 L76 46 L72 64Z"/><path d="M78 78 L94 76 L86 92Z"/><path d="M98 92 L112 90 L104 104Z"/></g>
      ${body(`url(#${p}s)`, '#7fa173', '#f4ecc8', '#b3d1a3')}
      <g stroke="#e3d6a6" stroke-width="1.4" fill="none"><path d="M-26 96 C-10 92 10 92 26 96"/><path d="M-30 110 C-10 106 10 106 30 110"/><path d="M-26 124 C-10 120 10 120 26 124"/></g>
      <g fill="#f8f4e8"><path d="M-36 146 l3 -6 l3 6Z"/><path d="M-26 148 l3 -6 l3 6Z"/><path d="M-16 146 l3 -6 l3 6Z"/><path d="M10 146 l3 -6 l3 6Z"/><path d="M20 148 l3 -6 l3 6Z"/><path d="M30 146 l3 -6 l3 6Z"/></g>
      <ellipse cx="0" cy="0" rx="58" ry="54" fill="url(#${p}s)" stroke="#7fa173" ${OUT}/>
      <g fill="#8fb37f" opacity=".55"><circle cx="-30" cy="-34" r="5"/><circle cx="-18" cy="-42" r="3.5"/><circle cx="34" cy="-30" r="4"/></g>
      ${face({ ey: -8, cy: 12, cx: 38, cheek: '#f2a39a', smile: 'M-16 22 C-8 32 8 32 16 22', line: '#5f8155' })}
      <g fill="#6f9364"><ellipse cx="-6" cy="8" rx="2" ry="1.5"/><ellipse cx="6" cy="8" rx="2" ry="1.5"/></g>`,
  },
  /* Christmas only (not in ANIMAL_ORDER): a little elf in a green suit, pointy hat with a bell and pointy ears */
  elf: {
    name: 'Little elf',
    svg: p => `<defs>${grad(p + 'k', '#ffe8d6', '#f9d2b6', '#efbd9b')}${grad(p + 'g', '#7cbf7f', '#57a05f', '#448a4d')}${grad(p + 'h', '#6fb873', '#4c9a55', '#3c8045')}</defs>
      ${body(`url(#${p}g)`, '#3d7a46', '#9fd3a0', '#a0673f')}
      <path d="M-30 96 H30" stroke="#3d2b1f" stroke-width="7" stroke-linecap="round"/><rect x="-8" y="90" width="16" height="12" rx="2" fill="#f2c94c" stroke="#b8902e" stroke-width="1.4"/>
      <path d="M-44 34 L-34 48 L-22 36 L-10 50 L0 38 L10 50 L22 36 L34 48 L44 34 Z" fill="#d64545" stroke="#a83232" stroke-width="1.4" stroke-linejoin="round"/>
      <path d="M-50 -12 C-70 -18 -92 -32 -106 -52 C-100 -22 -80 4 -50 16Z" fill="url(#${p}k)" stroke="#d9a07c" ${OUT}/>
      <path d="M50 -12 C70 -18 92 -32 106 -52 C100 -22 80 4 50 16Z" fill="url(#${p}k)" stroke="#d9a07c" ${OUT}/>
      <ellipse cx="0" cy="0" rx="56" ry="54" fill="url(#${p}k)" stroke="#d9a07c" ${OUT}/>
      <path d="M-40 -34 C-30 -24 -16 -22 -8 -30 C0 -22 12 -22 20 -30" fill="none" stroke="#b07a52" stroke-width="3" stroke-linecap="round" opacity=".7"/>
      ${face({ cheek: '#f39aa8', line: '#9a6a4f', smile: 'M-10 22 C-5 29 5 29 10 22' })}
      <path d="M-58 -30 C-46 -86 6 -122 58 -112 C80 -108 96 -94 102 -78 C88 -88 72 -90 60 -84 C42 -74 32 -54 58 -32 Z" fill="url(#${p}h)" stroke="#3d7a46" ${OUT}/>
      <path d="M-40 -60 C-24 -88 8 -104 40 -102" stroke="#9fd3a0" stroke-width="4" fill="none" stroke-linecap="round" opacity=".55"/>
      <rect x="-64" y="-42" width="126" height="18" rx="9" fill="#d64545" stroke="#a83232" stroke-width="1.4"/>
      <circle cx="104" cy="-74" r="10" fill="#f2c94c" stroke="#b8902e" stroke-width="1.4"/><path d="M98 -72 H110" stroke="#b8902e" stroke-width="1.6"/>`,
  },
};

export const ANIMAL_ORDER = ['elephant', 'bunny', 'bear', 'giraffe', 'lion', 'fox', 'dino'];

/* A different animal for each milestone (newborn = 0, 1-12 months, 18 months, 2 and 3 years). */
export function animalFor(choice, milestone) {
  if (ANIMALS[choice]) return choice;
  const steps = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '18', '24', '36'];
  const i = Math.max(0, steps.indexOf(String(milestone)));
  return ANIMAL_ORDER[i % ANIMAL_ORDER.length];
}
