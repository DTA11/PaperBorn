/* Monthly milestone card designs (5 styles). */
import { show, br } from '../../core/util.js';
import { photoHTML } from '../../core/photo.js';
import { svgLayer, sparkle, corners, starPath, heartPath } from '../../core/svg.js';

const nm = (s, base, chars) => Math.round(base * Math.min(1, chars / Math.max(String(s).length, 1)));
const statItems = (e, t) => [['Date', t.date && e.date], ['Weight', t.weight && e.weight], ['Height', t.height && e.height]].filter(r => r[1]);
const factItems = (e, t) => t.facts ? [['Loves', e.loves], ['New skill', e.skill], ['Fun fact', e.fun]].filter(r => r[1]) : [];
const brand = (t, cls, label = 'Baby Card Printables · Milestone') => t.footer ? `<div class="text-center text-[8pt] tracking-[4px] uppercase pt-2 ${cls}">${label}</div>` : '';
const bigNum = (e, f, extra = '') => `<div class="font-black" style="font-size:${nm(e.big, f.num, 2)}px;line-height:1.05;${extra}">${e.big}</div>`;
const hello = e => (e.big && e.big.length > 2); // words like "Hello" are set smaller

export const TEMPLATES = {
  classic: (e, t, f) => {
    const st = statItems(e, t), fc = factItems(e, t);
    return `
    <div class="text-center">
      <div class="text-[9pt] tracking-[6px] uppercase" style="color:#b5835a">Monthly milestone</div>
      ${show(t.name, e.babyName, `<div class="italic mt-1" style="font-size:${nm(e.babyName, 30, 14)}px">${e.babyName}</div>`)}
    </div>
    <div class="text-center">
      ${bigNum(e, f, 'color:#b5835a')}
      <div class="uppercase font-bold" style="font-size:18px;letter-spacing:.5em;margin-top:2px">${e.small}</div>
    </div>
    <div class="my-auto py-2">${photoHTML('border:5px solid #fff;box-shadow:0 0 0 1px #b5835a;', 1)}</div>
    <div>
      ${st.length ? `<div class="grid text-center py-2 border-t border-b" style="border-color:#b5835a99;grid-template-columns:repeat(${st.length},minmax(0,1fr))">${st.map(([l, v], i) => `<div class="px-1 ${i ? 'border-l' : ''}" style="border-color:#b5835a66"><span class="block text-[8pt] uppercase tracking-widest" style="color:#b5835a">${l}</span><span class="text-sm font-bold">${v}</span></div>`).join('')}</div>` : ''}
      ${show(t.note, e.note, `<div class="text-center italic text-sm mt-3 leading-snug">“${br(e.note)}”</div>`)}
      ${fc.length ? `<div class="mt-3 grid gap-1 text-xs" style="grid-template-columns:repeat(${fc.length},minmax(0,1fr))">${fc.map(([l, v]) => `<div class="text-center"><span class="block text-[7pt] uppercase tracking-widest" style="color:#b5835a">${l}</span>${v}</div>`).join('')}</div>` : ''}
    </div>
    ${brand(t, 'opacity-50')}`;
  },

  chalkboard: (e, t, f) => {
    const st = statItems(e, t), fc = factItems(e, t), D = Math.round(f.num * 1.45);
    return `
    <div class="text-center">
      ${show(t.name, e.babyName, `<div style="font-size:${nm(e.babyName, 46, 12)}px;line-height:1.1">${e.babyName}</div>`)}
      <div class="text-[15px] tracking-[5px] uppercase opacity-80">monthly milestone</div>
    </div>
    <div class="flex justify-center"><div style="width:${D}px;height:${D}px;border:3px dashed rgba(244,241,232,.8);border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center">
      <div style="font-size:${nm(e.big, f.num * .66, hello(e) ? 3.2 : 2)}px;line-height:1;font-weight:700">${e.big}</div>
      <div class="uppercase" style="font-size:22px;letter-spacing:.2em">${e.small}</div></div></div>
    <div class="my-auto py-2">${photoHTML('border:4px dashed rgba(244,241,232,.75);padding:0;', 1)}</div>
    <div>
      ${st.length ? `<div class="flex justify-center gap-3 flex-wrap">${st.map(([l, v]) => `<div class="px-4 py-1 text-center" style="border:2px dashed rgba(244,241,232,.6);border-radius:12px"><div class="text-[13px] uppercase tracking-widest opacity-70">${l}</div><div class="text-[22px] leading-tight">${v}</div></div>`).join('')}</div>` : ''}
      ${show(t.note, e.note, `<div class="text-center mt-3" style="font-size:24px;line-height:1.15">${br(e.note)}</div>`)}
      ${fc.length ? `<div class="mt-2 text-center text-[20px] leading-tight opacity-90">${fc.map(([l, v]) => `<span class="mx-2">★ ${l}: ${v}</span>`).join('')}</div>` : ''}
    </div>
    ${brand(t, 'opacity-50')}`;
  },

  pastel: (e, t, f) => {
    const st = statItems(e, t), fc = factItems(e, t), D = Math.round(f.num * 1.35), cols = ['#ffd9c7', '#d9ecf2', '#e7dff5'];
    return `
    <div class="text-center">
      <div class="text-[10pt] font-bold tracking-[4px] uppercase" style="color:#f08a6b">Monthly milestone</div>
      ${show(t.name, e.babyName, `<div class="font-bold" style="font-size:${nm(e.babyName, 34, 14)}px">${e.babyName}</div>`)}
    </div>
    <div class="flex justify-center"><div style="width:${D}px;height:${D}px;border-radius:50%;background:#f08a6b;color:#fff;border:6px solid #fff;box-shadow:0 0 0 4px #ffd9c7;display:flex;flex-direction:column;align-items:center;justify-content:center">
      <div class="font-bold" style="font-size:${nm(e.big, f.num * .9, hello(e) ? 3.2 : 2)}px;line-height:1">${e.big}</div>
      <div class="font-bold uppercase" style="font-size:15px;letter-spacing:.18em">${e.small}</div></div></div>
    <div class="my-auto py-2"><div class="mx-auto p-2 bg-white" style="border-radius:28px;width:fit-content;max-width:100%;box-shadow:0 8px 24px rgba(74,59,82,.12)">${photoHTML('', 1)}</div></div>
    <div>
      ${st.length ? `<div class="flex justify-center gap-2 flex-wrap">${st.map(([l, v], i) => `<span class="px-4 py-1.5 rounded-full text-sm font-bold" style="background:${cols[i % 3]}">${l}: ${v}</span>`).join('')}</div>` : ''}
      ${show(t.note, e.note, `<div class="text-center mt-3 px-4 py-3 bg-white text-sm leading-snug" style="border-radius:18px">${br(e.note)}</div>`)}
      ${fc.length ? `<div class="mt-3 flex justify-center gap-x-4 gap-y-1 flex-wrap text-xs font-semibold">${fc.map(([l, v]) => `<span><span style="color:#f08a6b">♥</span> ${l}: ${v}</span>`).join('')}</div>` : ''}
    </div>
    ${brand(t, 'opacity-50')}`;
  },

  scrapbook: (e, t, f) => {
    const st = statItems(e, t), fc = factItems(e, t);
    return `
    <div class="flex items-center justify-between gap-3">
      <div class="min-w-0">
        <div class="text-[18px] opacity-70 leading-none">my monthly milestone</div>
        ${show(t.name, e.babyName, `<div class="font-bold leading-tight" style="font-size:${nm(e.babyName, 52, 11)}px">${e.babyName}</div>`)}
      </div>
      <div class="shrink-0 text-center bg-white px-4 py-2" style="border:2px solid #8a6d43;box-shadow:4px 4px 0 rgba(138,109,67,.35)">
        <div class="font-bold" style="font-size:${nm(e.big, f.num * .62, hello(e) ? 3.5 : 2)}px;line-height:1.05">${e.big}</div>
        <div class="uppercase tracking-widest text-[13px] font-bold">${e.small}</div>
      </div>
    </div>
    <div class="my-auto py-3"><div class="relative mx-auto bg-white" style="width:fit-content;max-width:100%;padding:14px 14px 10px;box-shadow:0 8px 20px rgba(75,58,40,.28)">
      <div style="position:absolute;top:-14px;left:50%;margin-left:-55px;width:110px;height:28px;background:rgba(240,180,90,.8);z-index:3"></div>
      ${photoHTML('', .96)}
      <div class="text-center" style="font-size:26px;line-height:1.3;color:#4b3a28">${show(t.name, e.babyName, e.babyName) || '&nbsp;'}</div>
    </div></div>
    <div>
      ${st.length ? `<div class="flex justify-center gap-3 flex-wrap">${st.map(([l, v]) => `<div class="px-3 py-1 text-center" style="background:#fdf7e6;border:1.5px dashed #8a6d43"><span class="block text-[13px] uppercase tracking-widest opacity-70">${l}</span><span class="text-[22px] leading-tight font-bold">${v}</span></div>`).join('')}</div>` : ''}
      ${show(t.note, e.note, `<div class="mt-3 px-4 py-2 text-center bg-white" style="font-size:24px;line-height:1.15;border-left:6px solid #e8a34c">${br(e.note)}</div>`)}
      ${fc.length ? `<div class="mt-2 text-center leading-tight" style="font-size:20px">${fc.map(([l, v]) => `<span class="mx-2">✿ ${l}: ${v}</span>`).join('')}</div>` : ''}
    </div>
    ${brand(t, 'opacity-50')}`;
  },

  modern: (e, t, f) => {
    const st = statItems(e, t), fc = factItems(e, t);
    return `
    <div style="color:#fff">
      <div class="text-[9pt] font-black tracking-[5px] uppercase opacity-80">Milestone</div>
      ${show(t.name, e.babyName, `<div class="font-black uppercase leading-tight" style="font-size:${nm(e.babyName, 34, 14)}px;letter-spacing:-.01em">${e.babyName}</div>`)}
      <div class="flex items-end gap-3 mt-1">${bigNum(e, f, `font-size:${nm(e.big, f.num, hello(e) ? 3.4 : 2)}px;color:#f2b84b;letter-spacing:-.04em`)}<div class="font-black uppercase pb-3" style="font-size:22px;letter-spacing:.2em">${e.small}</div></div>
    </div>
    <div class="my-auto py-2">${photoHTML('border:4px solid #f7f1e8;', 1)}</div>
    <div>
      ${st.length ? `<div class="grid text-center" style="grid-template-columns:repeat(${st.length},minmax(0,1fr));gap:8px">${st.map(([l, v], i) => `<div class="py-2" style="background:${['#1f3a5f', '#e0603c', '#f2b84b'][i % 3]};color:${i % 3 === 2 ? '#1f3a5f' : '#fff'}"><span class="block text-[8pt] font-bold uppercase tracking-widest opacity-80">${l}</span><span class="text-sm font-black">${v}</span></div>`).join('')}</div>` : ''}
      ${show(t.note, e.note, `<div class="mt-3 text-sm font-semibold leading-snug">${br(e.note)}</div>`)}
      ${fc.length ? `<div class="mt-2 text-xs grid gap-1" style="grid-template-columns:repeat(${fc.length},minmax(0,1fr))">${fc.map(([l, v]) => `<div><span class="block text-[7pt] font-black uppercase tracking-widest" style="color:#e0603c">${l}</span>${v}</div>`).join('')}</div>` : ''}
    </div>
    ${brand(t, 'opacity-50')}`;
  },
};

const doodle = (f, color) => {
  const s = [[.12, .1, 16], [.9, .14, 12], [.08, .52, 10], [.93, .55, 14], [.14, .93, 12], [.88, .92, 16]]
    .map(([x, y, r]) => `<path d="${starPath(r)}" transform="translate(${(f.w * x).toFixed(0)} ${(f.h * y).toFixed(0)})" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" opacity=".7"/>`).join('');
  const h = [[.84, .3, 26]]
    .map(([x, y, r]) => `<path d="${heartPath(r)}" transform="translate(${(f.w * x).toFixed(0)} ${(f.h * y).toFixed(0)})" fill="none" stroke="${color}" stroke-width="2" opacity=".6"/>`).join('');
  return s + h;
};

export const DECOR = {
  classic: (t, f) => svgLayer(f,
    `<g fill="none" stroke="#b5835a" stroke-opacity=".18"><circle cx="${f.w - 40}" cy="40" r="150" stroke-width="2"/><circle cx="${f.w - 40}" cy="40" r="120" stroke-width="1"/><circle cx="40" cy="${f.h - 40}" r="150" stroke-width="2"/><circle cx="40" cy="${f.h - 40}" r="120" stroke-width="1"/></g>` +
    (t.accents ? corners(f, '<path d="M0 36V0H36" fill="none" stroke="#b5835a" stroke-width="1.6"/>', 24) : '')),

  chalkboard: (t, f) => svgLayer(f,
    `<defs><radialGradient id="cs"><stop offset="0" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
     <ellipse cx="${f.w * .32}" cy="${f.h * .38}" rx="${f.w * .55}" ry="${f.h * .32}" fill="url(#cs)"/><ellipse cx="${f.w * .75}" cy="${f.h * .78}" rx="${f.w * .45}" ry="${f.h * .22}" fill="url(#cs)"/>` +
    (t.accents ? doodle(f, '#f4f1e8') : '')),

  pastel: (t, f) => svgLayer(f,
    `<defs><radialGradient id="p1"><stop offset="0" stop-color="#ffd9c7"/><stop offset="1" stop-color="#ffd9c7" stop-opacity="0"/></radialGradient>
     <radialGradient id="p2"><stop offset="0" stop-color="#cfe7f0"/><stop offset="1" stop-color="#cfe7f0" stop-opacity="0"/></radialGradient>
     <radialGradient id="p3"><stop offset="0" stop-color="#e3d9f4"/><stop offset="1" stop-color="#e3d9f4" stop-opacity="0"/></radialGradient></defs>
     <circle cx="${f.w * .1}" cy="${f.h * .08}" r="${f.w * .55}" fill="url(#p1)"/><circle cx="${f.w * .95}" cy="${f.h * .55}" r="${f.w * .5}" fill="url(#p2)"/><circle cx="${f.w * .1}" cy="${f.h * .95}" r="${f.w * .5}" fill="url(#p3)"/>` +
    (t.accents ? [[.12, .2, 5, '#f08a6b'], [.88, .1, 6, '#8fc3d6'], [.9, .85, 5, '#b9a3e0'], [.07, .6, 4, '#f6c36b'], [.5, .04, 4, '#f08a6b'], [.52, .97, 5, '#8fc3d6']]
      .map(([x, y, r, c]) => `<circle cx="${f.w * x}" cy="${f.h * y}" r="${r}" fill="${c}"/>`).join('') + sparkle(f.w * .84, f.h * .3, 12, '#f6c36b') + sparkle(f.w * .14, f.h * .4, 10, '#f08a6b') : '')),

  scrapbook: (t, f) => svgLayer(f,
    `<defs><pattern id="dg" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.3" fill="#8a6d43" opacity=".28"/></pattern></defs><rect width="${f.w}" height="${f.h}" fill="url(#dg)"/>` +
    (t.accents ? `<g fill="#e8a34c" opacity=".9"><path d="${starPath(18)}" transform="translate(${f.w * .09} ${f.h * .3})"/></g><g fill="#d9604c" opacity=".85"><path d="${heartPath(34)}" transform="translate(${f.w * .91} ${f.h * .3})"/></g><g fill="#7da07a" opacity=".85"><path d="${starPath(14)}" transform="translate(${f.w * .91} ${f.h * .74})"/></g>` : '')),

  modern: (t, f) => svgLayer(f,
    `<rect width="${f.w}" height="${(f.h * .42).toFixed(0)}" fill="#1f3a5f"/>` +
    (t.accents ? `<circle cx="${f.w - 30}" cy="${f.h * .08}" r="${f.w * .2}" fill="#e0603c"/><circle cx="${f.w - 30}" cy="${f.h * .08}" r="${f.w * .12}" fill="#f2b84b"/><path d="M${f.w} ${f.h} V${f.h - 90} A90 90 0 0 0 ${f.w - 90} ${f.h} Z" fill="#8fb7a3"/>` : '')),
};
