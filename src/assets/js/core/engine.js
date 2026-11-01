/* Baby Card Printables editor engine.
   A generator is a plain definition object (see each generator def.js). The engine builds the sidebar from it,
   renders the live card, and provides undo/redo, saved looks, multi-page output, packs and PNG/PDF export. */
import { $, esc, clone, track } from './util.js';
import { fixGap } from './compat.js';
import { nextIdea, IDEA_ICON } from './ideas.js';
import { foldedPages, sheetFor } from './fold.js';
import { state, ctx, fmt } from './state.js';
import { FONTS, FONT_LABELS, loadFonts } from './fonts.js';
import { photo, setPhotoSource, clearPhoto, syncPhotoURL, bakeFrames, initPhotoDrag, SHAPE_LABELS, FILTER_LABELS } from './photo.js';
import { renderToCanvas, pageMM, addBleed, newPDF, addPageToPDF, downloadBlob } from './export.js';

let def;
const COLS = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3' };
const SPAN = { 1: 'col-span-1', 2: 'col-span-2', 3: 'col-span-3' };
const DEFAULT_ORNAMENTS = [['accents', 'Little decorations'], ['border', 'Border line'], ['crop', 'Cutting guides'], ['footer', 'Small footer text']];
const PCT = new Set(['brightness', 'contrast', 'zoom', 'offsetX', 'offsetY']);

/* ---------- State ---------- */
function freshState() {
  const th = def.themes[def.defaultTheme];
  return {
    theme: def.defaultTheme, colors: {}, format: def.defaultFormat, fontMode: th.font, bleed: false, page: 0,
    photo: { shape: th.shape || 'rectangle', filterMode: th.filter || 'none', brightness: 100, contrast: 110, zoom: 100, offsetX: 0, offsetY: 0 },
    toggles: { photo: true, accents: true, border: true, crop: false, footer: true, ...clone(def.defaults.toggles || {}), ...(th.toggles || {}) },
    data: { ...clone(def.defaults.data || {}), ...Object.fromEntries(Object.keys(sample()).map(k => [k, ''])) },
    edited: {},
  };
}
/* Example values: these fields start empty (so people can type straight away). Until a field has been edited, its
   example shows as grey placeholder text and on the card. Once edited, an empty field stays empty on the card. */
const sample = () => def.defaults.sample || {};
const isEmpty = v => v === undefined || v === null || String(v).trim() === '';
/* Fields that belong together (first + last name, mother + father): typing in one drops the example in both. */
/* No ?. or ?? in this file: older iPad Safari (before iPadOS 13.4) cannot read them and the whole editor would stop. */
const nn = (v, d) => (v === undefined || v === null ? d : v);
/* <dialog> fallback for Safari before 15.4: show/hide with the open attribute (CSS hides closed dialogs). */
const isOpen = d => d.hasAttribute('open');
function openDlg(d) {
  if (typeof d.showModal === 'function') { d.showModal(); return; }
  d.classList.add('dlg-fallback'); d.setAttribute('open', '');
}
function closeDlg(d) {
  if (typeof d.close === 'function') { d.close(); return; }
  d.removeAttribute('open'); d.dispatchEvent(new Event('close'));
}
const touched = k => { const ed = state.edited || {}; return !!ed[k] || (def.defaults.sampleGroups || []).some(g => g.includes(k) && g.some(x => ed[x])); };
const pick = () => ({ theme: state.theme, colors: state.colors, format: state.format, fontMode: state.fontMode, photo: state.photo, toggles: state.toggles, data: state.data, edited: state.edited });
const storeKey = () => `paperborn:${def.slug}:v1`;
const tplKey = () => `paperborn:${def.slug}:templates`;
const photoKey = () => `paperborn:${def.slug}:photo`;

/* The uploaded photo is kept too (a smaller JPEG copy in this browser only), so a refresh does not lose it. */
function savePhoto() {
  const s = photo.source; if (!s) return;
  for (const max of [1200, 800]) {          // second try is smaller in case browser storage is nearly full
    try {
      const k = Math.min(1, max / Math.max(s.width, s.height)), c = document.createElement('canvas');
      c.width = Math.round(s.width * k); c.height = Math.round(s.height * k);
      const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(s, 0, 0, c.width, c.height);
      localStorage.setItem(photoKey(), c.toDataURL('image/jpeg', 0.85)); return;
    } catch (_) {}
  }
  try { localStorage.removeItem(photoKey()); } catch (_) {}
}
async function loadPhoto() {
  let saved = null; try { saved = localStorage.getItem(photoKey()); } catch (_) {}
  if (saved) { await setPhotoSource(saved); if (photo.source) return; try { localStorage.removeItem(photoKey()); } catch (_) {} }
  clearPhoto();                                   // no sample picture: the card shows a "Tap to add a photo" spot
}

let saveTimer;
function scheduleSave() {
  commit();
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => { try { localStorage.setItem(storeKey(), JSON.stringify(pick())); } catch (_) {} }, 300);
}
function loadSaved() {
  try {
    const s = JSON.parse(localStorage.getItem(storeKey()) || 'null');
    if (!s) return;
    const d = freshState();
    if (s.data) {
      if (def.migrate) def.migrate(s.data);
      if (!s.edited) {                         // saves from before example text: keep what people really typed
        s.edited = {};
        for (const [k, v] of Object.entries(sample())) {
          if (s.data[k] === v) s.data[k] = '';
          else if (s.data[k] !== undefined) s.edited[k] = true;
        }
      }
    }
    Object.assign(state, d, s, { photo: { ...d.photo, ...s.photo }, toggles: { ...d.toggles, ...s.toggles }, data: { ...d.data, ...s.data }, edited: { ...s.edited }, colors: { ...s.colors }, page: 0, bleed: false });
    applyAlias(state.theme);
    if (!def.themes[state.theme]) state.theme = d.theme;
    if (!def.formats[state.format]) state.format = d.format;
    if (!FONTS[state.fontMode]) state.fontMode = d.fontMode;
  } catch (_) {}
}

/* ---------- Color choices ----------
   A design can offer colors (th.colors = { key: { name, dot, bg?, fg? } }, first one is the default). The choice is kept
   per design in state.colors and reaches the design as dv.color. Old design ids (e.g. "bow_pink") still work through
   def.aliases = { bow_pink: ['bow', 'pink'] } in saved cards, links and pins. */
function applyAlias(id) {
  const a = def.aliases && def.aliases[id];
  if (!a) return false;
  state.theme = a[0];
  if (a[1]) { state.colors = { ...(state.colors || {}) }; state.colors[a[0]] = a[1]; }
  return true;
}
function colorKey(id = state.theme) {
  const cs = def.themes[id] && def.themes[id].colors;
  if (!cs) return '';
  const k = (state.colors || {})[id];
  return k && cs[k] ? k : Object.keys(cs)[0];
}
function setColor(k) {
  state.colors = { ...(state.colors || {}), [state.theme]: k };
  syncForm(); refresh(); scheduleSave();
  track('color_changed', { generator: def.slug, theme: state.theme, color: k });
}
function colorRowHTML() {
  const cs = def.themes[state.theme].colors;
  if (!cs) return '';
  const cur = colorKey();
  return Object.entries(cs).map(([k, c]) => `<button type="button" data-color="${k}" class="color-dot${k === cur ? ' on' : ''}" aria-pressed="${k === cur}" aria-label="${esc(c.name)}" title="${esc(c.name)}"><i style="background:${c.dot}"></i><span>${esc(c.name)}</span></button>`).join('');
}

/* ---------- Undo / redo ---------- */
const hist = { past: [], future: [], last: '', timer: 0 };
function updateHistBtns() {
  $('btn-undo').disabled = !(hist.past.length || hist.timer);
  $('btn-redo').disabled = !hist.future.length;
}
function commit(now) {
  clearTimeout(hist.timer);
  const run = () => {
    hist.timer = 0;
    const s = JSON.stringify(pick());
    if (s !== hist.last) { hist.past.push(hist.last); if (hist.past.length > 100) hist.past.shift(); hist.last = s; hist.future = []; }
    updateHistBtns();
  };
  if (now) run(); else { hist.timer = setTimeout(run, 500); updateHistBtns(); }
}
function restore(s) { Object.assign(state, { edited: {} }, JSON.parse(s)); syncForm(); refresh(); scheduleSave(); }
function undo() { commit(true); if (!hist.past.length) return; hist.future.push(hist.last); hist.last = hist.past.pop(); restore(hist.last); updateHistBtns(); }
function redo() { commit(true); if (!hist.future.length) return; hist.past.push(hist.last); hist.last = hist.future.pop(); restore(hist.last); updateHistBtns(); }

/* ---------- Sidebar (built from the definition) ---------- */
function fieldHTML(fd) {
  const id = `f-${fd.key}`, span = SPAN[fd.span || 1];
  const lab = fd.label ? `<label class="lbl" for="${id}">${fd.label}</label>` : '';
  const common = `id="${id}" data-f="${fd.key}" class="inp ${fd.cls || ''}"`;
  const ph = `placeholder="${esc(nn(sample()[fd.key], nn(fd.ph, '')))}"${fd.key in sample() ? ` data-sample="${fd.key}"` : ''}${fd.autoPh ? ` data-autoph="${fd.autoPh}"` : ''}`;
  let ctl;
  switch (fd.type) {
    case 'textarea': ctl = `<textarea ${common} rows="${fd.rows || 4}" ${ph} maxlength="${fd.max || 3000}"></textarea>`; break;
    case 'select': ctl = `<select ${common}>${fd.options.map(([v, l]) => `<option value="${esc(v)}">${esc(l)}</option>`).join('')}</select>`; break;
    case 'readout': ctl = `<div class="inp text-zinc-300" data-readout="${fd.key}" data-empty="${esc(fd.empty || '—')}">—</div>`; break;
    case 'multicheck':
      ctl = `<div data-m="${fd.key}" class="grid grid-cols-2 gap-x-3 gap-y-1.5 max-h-56 overflow-y-auto pr-1">` +
        fd.options.map(([v, l]) => `<label class="chk"><input type="checkbox" data-mv="${esc(v)}" class="rounded">${esc(l)}</label>`).join('') + '</div>';
      break;
    case 'note': return `<p class="${span} text-zinc-500">${fd.text}</p>`;
    case 'placesearch':
      return `<div class="${span} min-w-0" data-place='${JSON.stringify(fd.keys)}'>${fd.label ? `<label class="lbl" for="place-q">${fd.label}</label>` : ''}
        <div class="flex gap-2"><input type="search" id="place-q" class="inp" placeholder="${esc(fd.ph || 'Hospital name and city')}" maxlength="120" autocomplete="off">
        <button type="button" data-place-go class="btn bg-indigo-600 hover:bg-indigo-500 text-white shrink-0">Search</button></div>
        <div data-place-status class="text-zinc-500 mt-1" aria-live="polite">Sends your search text to OpenStreetMap, only when you press Search.</div>
        <div data-place-results class="space-y-1 mt-1"></div></div>`;
    default: {
      const attrs = ['min', 'max', 'step'].filter(k => fd[k] !== undefined).map(k => `${k}="${fd[k]}"`).join(' ');
      const mode = fd.type === 'number' ? `inputmode="${fd.step && fd.step < 1 ? 'decimal' : 'numeric'}"` : '';
      ctl = `<input type="${fd.type || 'text'}" ${common} ${ph} ${attrs} ${mode} ${fd.maxlength ? `maxlength="${fd.maxlength}"` : ''}>`;
    }
  }
  const idea = def.ideas && def.ideas[fd.key] ? `<button type="button" class="idea-btn" data-idea="${fd.key}">${IDEA_ICON}<span>Give me an idea</span></button>` : '';
  return `<div class="${span} min-w-0">${lab}${ctl}${idea}</div>`;
}

/* "Give me an idea": fill the field with the next suggestion for this card, as if it had been typed. */
function giveIdea(key) {
  const { dv } = derive(), el = document.querySelector(`[data-f="${key}"]`);
  if (!el) return;
  const list = def.ideas[key](dv, state.theme) || [], shown = el.value || el.placeholder;
  let text = nextIdea(key, list, dv);
  if (text === shown) text = nextIdea(key, list, dv);                  // don't "suggest" what is already on the card
  if (!text) return;
  if (key in state.toggles && !state.toggles[key]) { state.toggles[key] = true; syncForm(); }
  el.value = text;
  el.dispatchEvent(new Event('input', { bubbles: true }));
  track('idea', { generator: def.slug, field: key });
}

function boxHTML(b) {
  const tg = (b.toggles || []).map(([k, l], i) =>
    `<label class="chk ${i === 0 ? 'font-bold text-white' : ''}"><input type="checkbox" data-t="${k}" class="rounded">${l}</label>`).join('');
  return `<div class="box">${tg ? `<div class="flex flex-wrap justify-between gap-x-3 gap-y-1">${tg}</div>` : ''}` +
    `<div class="grid ${COLS[b.cols || 1]} gap-2">${b.fields.map(fieldHTML).join('')}</div></div>`;
}

function range(label, key, min, max) {
  return `<div><div class="flex justify-between text-[10px] text-zinc-400"><span>${label}</span><span data-out="${key}"></span></div><input type="range" data-p="${key}" min="${min}" max="${max}" class="w-full"></div>`;
}

function buildControls() {
  let n = 0;
  const CHEV = '<svg class="w-4 h-4 text-zinc-500 transition group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
  /* Each section is a collapsible <details>; on phones only the ones marked "keep" start open. */
  const sec = (title, body, extra = '', keep = false) => `<details class="sec group" data-acc ${keep ? 'data-keep' : ''} open><summary class="flex justify-between items-center gap-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden"><h2 class="h2">${++n}. ${title}</h2><span class="flex items-center gap-3">${extra}${CHEV}</span></summary><div class="space-y-3 pt-3">${body}</div></details>`;
  let html = sec((def.ui && def.ui.themeTitle) || 'Design', '<div id="color-row" class="color-row" role="group" aria-label="Colors"></div><div id="style-grid" class="hidden lg:grid grid-cols-2 gap-2"></div><div id="style-strip" role="listbox" aria-label="Design"></div>',
    `<span class="text-[10px] text-zinc-500 font-mono">${Object.keys(def.themes).length} DESIGNS</span>`, true);

  for (const s of def.sections) html += sec(s.title, s.boxes.map(boxHTML).join(''), '', true);

  if (def.photo) {
    html += sec('Photo', `<div class="box">
      <div><label class="lbl" for="photo-file">Choose a photo</label>
        <input type="file" id="photo-file" accept="image/*" class="w-full text-zinc-300 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-white cursor-pointer"></div>
      <div class="grid grid-cols-2 gap-3">
        <div><label class="lbl" for="photo-shape">Photo shape</label><select id="photo-shape" data-p="shape" class="inp">${SHAPE_LABELS.map(([v, l]) => `<option value="${v}">${l}</option>`).join('')}</select></div>
        <div><label class="lbl" for="photo-look">Photo look</label><select id="photo-look" data-p="filterMode" class="inp">${FILTER_LABELS.map(([v, l]) => `<option value="${v}">${esc(l)}</option>`).join('')}</select></div>
      </div>
      <div class="space-y-2 pt-2 border-t border-zinc-800">
        ${range('Brightness', 'brightness', 50, 150)}${range('Contrast', 'contrast', 50, 200)}${range('Zoom', 'zoom', 100, 250)}
        <p class="text-zinc-500">Drag the photo in the preview to move it. Zoom in first to have room to move.</p>
        <button id="btn-photo-center" type="button" class="btn bg-zinc-800 hover:bg-zinc-700 text-white w-full">Center the photo</button>
      </div></div>`,
      `<label class="chk"><input type="checkbox" data-t="photo" class="rounded"><span class="text-[10px] uppercase tracking-wider font-bold">Show photo</span></label>`);
  }

  html += sec('Paper size &amp; font', `<div class="grid grid-cols-2 gap-3">
    <div><label class="lbl" for="paper-size">Paper size</label><select id="paper-size" data-a="format" class="inp">${Object.entries(def.formats).map(([k, f]) => `<option value="${k}">${f.label}</option>`).join('')}</select></div>
    <div><label class="lbl" for="font-pick">Font</label><select id="font-pick" data-a="fontMode" class="inp">${FONT_LABELS.map(([v, l]) => `<option value="${v}">${l}</option>`).join('')}</select></div></div>`);

  const orn = [...(def.ornaments || DEFAULT_ORNAMENTS), ...(def.extraOrnaments || [])];
  html += sec('Extras', `<div class="grid grid-cols-2 gap-2">` +
    orn.map(([k, l, wide]) => `<label class="chk box !space-y-0 ${wide ? 'col-span-2' : ''}"><input type="checkbox" data-t="${k}" class="rounded">${l}</label>`).join('') +
    `<label class="chk box !space-y-0 col-span-2"><input type="checkbox" data-o="bleed" class="rounded">Extra 3 mm edge for print shops (also called bleed)</label></div>`);
  if (def.pack) {
    html += sec(def.pack.title, `<p class="text-zinc-500">${def.pack.desc}</p>
      <div class="grid grid-cols-2 gap-2">${def.pack.options.map(([v, l, on]) => `<label class="chk box !space-y-0"><input type="checkbox" data-pack="${esc(v)}" ${on === false ? '' : 'checked'} class="rounded">${esc(l)}</label>`).join('')}</div>
      <button id="btn-pack" type="button" class="btn bg-zinc-800 hover:bg-zinc-700 text-white w-full">${def.pack.button || 'Download all (PDF)'}</button>`);
  }

  html += sec('Share &amp; Pinterest', `<p class="text-zinc-500">Make a tall picture of this card sized for Pinterest, or share the card straight from your phone.</p>
    <div class="grid grid-cols-2 gap-2"><button id="btn-pin" type="button" class="btn bg-zinc-800 hover:bg-zinc-700 text-white">Pinterest picture</button><button id="btn-share" type="button" class="btn bg-zinc-800 hover:bg-zinc-700 text-white">Share…</button></div>`);

  html += sec('Saved Looks', `<p class="text-zinc-500">Saves the look (design, paper size, font, photo settings and extras), not the text you typed.</p>
    <div class="flex gap-2"><input id="tpl-name" class="inp" placeholder="Name this look" aria-label="Name for this look" maxlength="30"><button id="btn-tpl-save" type="button" class="btn bg-indigo-600 hover:bg-indigo-500 text-white shrink-0">Save</button></div>
    <div id="tpl-list" class="space-y-2"></div>`);

  return html;
}

function buildStyleGrid() {
  const ids = Object.keys(def.themes);
  $('style-grid').innerHTML = ids.map((id, i) =>
    `<button type="button" data-style="${id}" class="style-btn"><span class="block text-xs">${i + 1}) ${def.themes[id].name}</span><span class="block text-[9px] text-zinc-500 mt-0.5">${def.themes[id].desc}</span></button>`).join('');
  $('style-grid').addEventListener('click', ev => { const b = ev.target.closest('[data-style]'); if (b) setTheme(b.dataset.style); });
  /* Phones and tablets: a row of design names to swipe through, plus swiping the card itself. */
  const strip = $('style-strip');
  strip.innerHTML = ids.map(id => `<button type="button" role="option" data-style="${id}"><i style="background:${def.themes[id].bg}"></i>${esc(def.themes[id].name)}</button>`).join('');
  strip.addEventListener('click', ev => { const b = ev.target.closest('[data-style]'); if (b) setTheme(b.dataset.style); });
  $('design-prev').addEventListener('click', () => stepTheme(-1));
  $('design-next').addEventListener('click', () => stepTheme(1));
  initSwipe();
}

function stepTheme(dir) {
  const ids = Object.keys(def.themes), i = ids.indexOf(state.theme), next = ids[(i + dir + ids.length) % ids.length];
  const s = $('sizer');
  s.style.transition = 'transform .13s ease-in, opacity .13s ease-in'; s.style.transform = `translateX(${-dir * 48}px)`; s.style.opacity = '0';
  setTimeout(() => {
    setTheme(next);
    s.style.transition = 'none'; s.style.transform = `translateX(${dir * 48}px)`; void s.offsetWidth;
    s.style.transition = 'transform .18s ease-out, opacity .18s ease-out'; s.style.transform = ''; s.style.opacity = '';
  }, 130);
  try { localStorage.setItem('paperborn:swiped', '1'); } catch (_) {}
  const h = $('design-hint'); if (h) h.style.display = 'none';
}
/* Swipe left/right on the preview to change the design (touch only; dragging the photo is left alone). */
function initSwipe() {
  const st = $('stage'); let t0 = null;
  st.addEventListener('touchstart', e => {
    t0 = e.touches.length === 1 && !e.target.closest('[data-phf]') ? { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() } : null;
  }, { passive: true });
  st.addEventListener('touchend', e => {
    if (!t0 || isDesktop()) return;
    const p = e.changedTouches[0], dx = p.clientX - t0.x, dy = p.clientY - t0.y; t0 = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.6) stepTheme(dx < 0 ? 1 : -1);
  }, { passive: true });
  try { if (localStorage.getItem('paperborn:swiped')) $('design-hint').style.display = 'none'; } catch (_) {}
}

function syncForm() {
  const ids0 = Object.keys(def.themes), strip = $('style-strip');
  if (strip) {
    strip.querySelectorAll('[data-style]').forEach(b => { const on = b.dataset.style === state.theme; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
    const cur = strip.querySelector('.on');                         // keep the chosen name in view without scrolling the page
    if (cur) { const l = cur.offsetLeft - strip.offsetLeft, r = l + cur.offsetWidth; if (l < strip.scrollLeft || r > strip.scrollLeft + strip.clientWidth) strip.scrollLeft = Math.max(0, l - 24); }
  }
  const cr = $('color-row'), dc = $('design-colors'), row = colorRowHTML();
  if (cr) { cr.innerHTML = row ? `<span class="color-lbl">Colors</span>${row}` : ''; cr.hidden = !row; }
  if (dc) { dc.innerHTML = row; dc.hidden = !row; }
  const dt = $('design-title'); if (dt) dt.textContent = `${ids0.indexOf(state.theme) + 1} / ${ids0.length} · ${def.themes[state.theme].name}`;
  document.querySelectorAll('[data-f]').forEach(el => { el.value = nn(state.data[el.dataset.f], ''); });
  document.querySelectorAll('[data-m]').forEach(box => {
    const sel = state.data[box.dataset.m] || [];
    box.querySelectorAll('[data-mv]').forEach(i => { i.checked = sel.includes(i.dataset.mv); });
  });
  document.querySelectorAll('[data-t]').forEach(el => { el.checked = !!state.toggles[el.dataset.t]; });
  document.querySelectorAll('[data-p]').forEach(el => { el.value = state.photo[el.dataset.p]; });
  document.querySelectorAll('[data-a]').forEach(el => { el.value = state[el.dataset.a]; });
  document.querySelectorAll('[data-o]').forEach(el => { el.checked = !!state[el.dataset.o]; });
  document.querySelectorAll('[data-out]').forEach(el => { el.textContent = state.photo[el.dataset.out] + (PCT.has(el.dataset.out) ? '%' : ''); });
  const ids = Object.keys(def.themes);
  document.querySelectorAll('.style-btn').forEach(b => {
    const on = b.dataset.style === state.theme;
    b.className = `style-btn p-3 border rounded-md text-left transition ${on ? 'border-indigo-500 bg-indigo-950/40 text-white font-bold' : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700'}` +
      (b.dataset.style === ids[ids.length - 1] && ids.length % 2 ? ' col-span-2' : '');
  });
}

function setTheme(id) {
  if (!def.themes[id]) {                                              // old design ids (links, saved looks) still work
    const a = def.aliases && def.aliases[id]; if (!a) return;
    id = a[0]; if (a[1]) state.colors = { ...(state.colors || {}), [a[0]]: a[1] };
  }
  const th = def.themes[id], prev = def.themes[state.theme];
  if (prev && prev.toggles && prev !== th) {                            // leaving a design that switched extras off: switch them back on
    const base = { photo: true, ...(def.defaults.toggles || {}) };
    for (const k of Object.keys(prev.toggles)) if (k in base) state.toggles[k] = base[k];
  }
  state.theme = id; state.fontMode = th.font;
  if (th.toggles) Object.assign(state.toggles, th.toggles);      // a design can switch extras off that it is not built around
  if (def.photo) { if (th.shape) state.photo.shape = th.shape; if (th.filter) state.photo.filterMode = th.filter; }
  syncForm(); refresh(); scheduleSave();
  track('theme_changed', { generator: def.slug, theme: id });
}

/* ---------- Rendering ---------- */
let rafId = 0;
const queueRender = () => { cancelAnimationFrame(rafId); rafId = requestAnimationFrame(renderCard); };
function refresh() { syncPhotoURL(); queueRender(); }

function derive() {
  const data = { ...state.data };
  for (const [k, v] of Object.entries(sample())) if (isEmpty(data[k]) && !touched(k)) data[k] = v;
  const dv = def.derive ? def.derive(data) : data;
  const e = {};
  for (const [k, v] of Object.entries(dv)) {
    e[k] = Array.isArray(v) ? v.map(x => esc(String(x))) : (v && typeof v === 'object') ? v : esc(String(nn(v, ''))).trim();
  }
  return { dv, e };
}

function updatePager(n) {
  const p = $('pager'); if (!p) return;
  p.classList.toggle('hidden', n <= 1);
  $('pager-label').textContent = `Page ${state.page + 1} of ${n}`;
  $('pager-prev').disabled = state.page <= 0;
  $('pager-next').disabled = state.page >= n - 1;
}

export function pageCount() {
  const { dv } = derive();
  return def.pageCount ? Math.max(1, def.pageCount(dv, state)) : 1;
}

export function renderCard() {
  const f = fmt(), th = def.themes[state.theme], t = state.toggles;
  const { dv, e } = derive();
  document.querySelectorAll('[data-readout]').forEach(el => { el.textContent = dv[el.dataset.readout] || el.dataset.empty; });
  document.querySelectorAll('[data-autoph]').forEach(el => { el.placeholder = dv[el.dataset.autoph] || ''; });
  document.querySelectorAll('[data-sample]').forEach(el => { el.placeholder = touched(el.dataset.sample) ? '' : sample()[el.dataset.sample]; });
  const n = def.pageCount ? Math.max(1, def.pageCount(dv, state)) : 1;
  state.page = Math.max(0, Math.min(state.page, n - 1));
  updatePager(n);

  dv.color = colorKey();
  const cc = th.colors ? th.colors[dv.color] : null, bg = (cc && cc.bg) || th.bg, fg = (cc && cc.fg) || th.fg;
  const pad = nn(th.pad, nn(def.pad, 40));
  const ch = def.chrome || {}, chromeFrame = ch.frame !== false, chromeCrop = ch.crop !== false;
  const el = $('card-target');
  el.style.cssText = `width:${f.w}px;height:${f.h}px;padding:${pad}px;background:${bg};color:${fg};font-family:${FONTS[state.fontMode]};`;
  const crop = chromeCrop && t.crop ? '<div class="crop-mark crop-tl"></div><div class="crop-mark crop-tr"></div><div class="crop-mark crop-bl"></div><div class="crop-mark crop-br"></div>' : '';
  const frame = chromeFrame && t.border && th.frame ? `<div style="position:absolute;top:16px;right:16px;bottom:16px;left:16px;border:${th.frame};pointer-events:none;z-index:5"></div>` : '';
  const dfn = def.decor && def.decor[state.theme], decor = nn(dfn ? dfn(t, f, e, dv, state.page) : '', '');
  const inner = def.templates[state.theme](e, t, f, dv, state.page);
  el.innerHTML = `${decor}${crop}${frame}<div class="relative z-10 h-full flex flex-col justify-between" style="padding:${chromeFrame && t.border ? 12 : 0}px">${inner}</div>`;
  if (def.photo) bakeFrames(el);
  fixGap(el);
  fitStage();
  updateMini();
}

/* Small floating copy of the card on phones/tablets. It shows only while the card is scrolled away AND the settings
   are still on screen, so it never covers the content below the editor. Tap it for a full-size preview; ✕ hides it
   until the real card has been on screen again. */
const mini = { on: false, hidden: false };
const isDesktop = () => matchMedia('(min-width:1024px)').matches;
const miniScale = () => { const f = fmt(); return Math.min(Math.min(innerWidth * 0.34, 160) / f.w, innerHeight * 0.26 / f.h); };
function cardCopy() {
  const c = $('card-target').cloneNode(true);
  c.removeAttribute('id'); c.style.transform = '';
  c.querySelectorAll('button[data-add-photo]').forEach(n => n.remove());
  c.querySelectorAll('[data-phf]').forEach(n => { n.removeAttribute('data-phf'); n.style.cursor = 'default'; });
  c.querySelectorAll('[id]').forEach(n => n.removeAttribute('id'));
  return c;
}
function updateMini() {
  const box = $('mini-preview'); if (!box) return;
  const show = mini.on && !mini.hidden && !isDesktop() && !isOpen($('big-preview'));
  box.classList.toggle('hidden', !show);
  if (!show) return;
  const f = fmt(), k = miniScale();
  const inner = $('mini-inner');
  inner.innerHTML = ''; inner.appendChild(cardCopy()); inner.style.transform = `scale(${k})`;
  const btn = $('mini-open'); btn.style.width = Math.round(f.w * k) + 'px'; btn.style.height = Math.round(f.h * k) + 'px';
}
function checkMini() {
  const box = $('mini-preview'); if (!box) return;
  const top = $('editor-bar').getBoundingClientRect().bottom, stage = $('stage').getBoundingClientRect();
  const cardGone = stage.bottom < top + 24;                                         // real card hidden under the toolbar
  if (!cardGone) mini.hidden = false;                                               // seeing the card again re-arms the ✕
  const controlsEnd = $('controls').getBoundingClientRect().bottom;
  const inSettings = controlsEnd > innerHeight - 4;                                // hide as soon as anything below the settings comes into view
  const on = cardGone && inSettings;
  if (on !== mini.on) { mini.on = on; updateMini(); }
}
function openBig() {
  const dlg = $('big-preview'), f = fmt(), inner = $('big-inner');
  openDlg(dlg); updateMini();
  const k = Math.min((innerWidth - 32) / f.w, (innerHeight - 110) / f.h, 1.5);
  inner.innerHTML = ''; inner.appendChild(cardCopy()); inner.style.transform = `scale(${k})`;
  $('big-sizer').style.width = Math.round(f.w * k) + 'px'; $('big-sizer').style.height = Math.round(f.h * k) + 'px';
  const n = pageCount();
  $('big-note').textContent = n > 1 ? `Page ${state.page + 1} of ${n}` : '';
}
function initMini() {
  const box = $('mini-preview'); if (!box) return;
  let raf = 0;
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; checkMini(); }); };
  addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll);
  $('mini-open').addEventListener('click', openBig);
  $('mini-close').addEventListener('click', () => { mini.hidden = true; updateMini(); });
  const dlg = $('big-preview');
  $('big-close').addEventListener('click', () => closeDlg(dlg));
  dlg.addEventListener('click', e => { if (e.target === dlg) closeDlg(dlg); });
  dlg.addEventListener('close', updateMini);
  const mq = matchMedia('(min-width:1024px)'); if (mq.addEventListener) mq.addEventListener('change', updateMini); else if (mq.addListener) mq.addListener(updateMini);
  checkMini();
}

function fitStage() {
  const f = fmt(), stage = $('stage');
  let s = (stage.clientWidth - 32) / f.w;
  if (matchMedia('(min-width:1024px)').matches) s = Math.min(s, (stage.clientHeight - 32) / f.h);
  else s = Math.min(s, (innerHeight * 0.55 - 32) / f.h); // phones: keep the preview short so the settings stay close
  s = Math.max(0.25, Math.min(1, s));
  $('sizer').style.width = f.w * s + 'px';
  $('sizer').style.height = f.h * s + 'px';
  $('card-scale').style.transform = `scale(${s})`;
  $('card-target').style.setProperty('--inv', String(+(1 / s).toFixed(3)));   // keeps preview-only buttons a constant size on screen
}

/* ---------- Export ---------- */
const slug = () => (def.fileName ? def.fileName(state.data) : def.slug).toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || def.slug;

async function capturePage(i, o = {}) {
  state.page = i; renderCard();
  for (const m of new Set([state.fontMode, ...(def.themes[state.theme].fonts || [])])) await loadFonts(m);
  const f = fmt(), bg = def.themes[state.theme].bg;
  const c = await renderToCanvas($('card-target'), f, bg, o.scale);
  return nn(o.bleed, state.bleed) ? addBleed(c, f, bg) : c;
}

async function withBusy(btn, label, fn) {
  const orig = btn.innerHTML, page = state.page; btn.disabled = true; btn.textContent = label;
  try { await fn(); }
  catch (err) { console.error(err); alert('Export failed. Try again, or use a smaller paper size.'); }
  finally { state.page = page; renderCard(); btn.disabled = false; btn.innerHTML = orig; }
}

/* ---------- Handing over a finished file ----------
   iPhone and iPad cannot download straight to Photos. The share sheet can (Save Image, Save to Files, Print), but iOS
   only opens it right after a tap, and making the file takes a moment. So on iOS a small "ready" window appears and
   its button opens the share sheet. Android and computers simply download. "Share" uses the same window everywhere. */
const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const ready = { url: '', file: null, kind: '' };
function deliver(blob, name, kind) {                       // kind: 'image' | 'pdf' | 'share'
  let file = null;
  try { file = new File([blob], name, { type: blob.type || (kind === 'pdf' ? 'application/pdf' : 'image/png') }); } catch (_) {}
  const canShare = !!(file && navigator.canShare && navigator.canShare({ files: [file] }));
  if (!isIOS() && !(kind === 'share' && canShare)) { downloadBlob(blob, name); return; }
  if (ready.url) URL.revokeObjectURL(ready.url);
  ready.url = URL.createObjectURL(blob); ready.file = file; ready.kind = kind;
  const pdf = kind === 'pdf';
  $('ready-title').textContent = pdf ? 'Your PDF is ready' : 'Your picture is ready';
  $('ready-preview').innerHTML = pdf
    ? `<svg width="56" height="68" viewBox="0 0 56 68" aria-hidden="true" style="display:block;margin:4px auto"><path d="M6 2h32l16 16v44a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4z" fill="#27272a" stroke="#71717a" stroke-width="2"/><path d="M38 2v16h16" fill="none" stroke="#71717a" stroke-width="2"/><text x="28" y="48" text-anchor="middle" font-size="13" font-weight="700" fill="#e4e4e7" font-family="system-ui,sans-serif">PDF</text></svg><div class="text-xs text-zinc-400" style="word-break:break-all">${esc(name)}</div>`
    : `<img src="${ready.url}" alt="Your card" style="display:block;margin:0 auto;max-width:100%;max-height:42vh;border-radius:6px;box-shadow:0 8px 24px rgba(0,0,0,.45);-webkit-touch-callout:default">`;
  const save = $('ready-save');
  save.style.display = canShare ? '' : 'none';
  save.textContent = kind === 'share' ? 'Share…' : pdf ? 'Save or print' : 'Save to Photos';
  $('ready-hint').textContent = canShare
    ? (kind === 'share' ? 'Send it in a message, or save it.' : pdf ? 'Then tap “Save to Files”, or “Print” to print it straight away.' : 'Then tap “Save Image”. You can also send it in a message.')
    : (pdf ? 'Open the PDF, then tap the share button to save or print it.' : 'Press and hold the picture, then tap “Save to Photos”.');
  const open = $('ready-open'); open.href = ready.url;
  openDlg($('ready-dialog'));
}
async function shareReady() {
  if (!ready.file) return;
  try {
    await navigator.share(ready.kind === 'share' ? { files: [ready.file], text: 'Made with babycardprintables.com' } : { files: [ready.file] });
    closeDlg($('ready-dialog'));
  } catch (e) { if (e.name !== 'AbortError') $('ready-hint').textContent = 'Sharing did not work here. Use “Open in a new tab” instead.'; }
}

/* PDF presets: standard = small file for screens and home printing; print = about 300 dpi with 3 mm bleed for print shops. */
const PDF_PRESETS = { standard: { scale: 2, quality: 0.85 }, print: { scale: 3, quality: 1, bleed: true } };

async function exportPDF(kind = 'print') {
  const o = { ...(PDF_PRESETS[kind] || PDF_PRESETS.print) }; o.bleed = nn(o.bleed, state.bleed);   // standard follows the bleed checkbox
  const [pw, ph] = pageMM(fmt(), o.bleed), n = pageCount();
  let pdf;
  for (let i = 0; i < n; i++) {
    const c = await capturePage(i, o);
    if (!pdf) pdf = newPDF(pw, ph);
    addPageToPDF(pdf, c, pw, ph, i === 0, o.quality);
  }
  deliver(pdf.output('blob'), `babycardprintables-${slug()}${kind === 'print' ? '-print' : ''}.pdf`, 'pdf');
  track('export', { generator: def.slug, format: 'pdf', kind, pages: n, theme: state.theme });
}

/* Folded greeting card: the design (as an A5 front) on one landscape sheet, plus a back and an inside with the message. */
async function exportFold() {
  const keep = state.format;
  if (def.formats.a5) state.format = 'a5';
  let front;
  try { front = await capturePage(state.page, { scale: 2.5, bleed: false }); } finally { state.format = keep; }
  const { dv } = derive(); dv.color = colorKey();
  const th = def.themes[state.theme], cc = th.colors ? th.colors[dv.color] : null, sheet = sheetFor(state.format);
  await loadFonts('script');
  const { pages, mm } = foldedPages(front, { sheet, bg: (cc && cc.bg) || th.bg, ink: (cc && cc.fg) || th.fg, body: FONTS[state.fontMode], script: FONTS.script,
    inside: def.fold.inside(dv, state.theme, state.toggles), brand: !!state.toggles.footer });
  const pdf = newPDF(mm[0], mm[1]);
  addPageToPDF(pdf, pages[0], mm[0], mm[1], true, 0.92); addPageToPDF(pdf, pages[1], mm[0], mm[1], false, 0.92);
  deliver(pdf.output('blob'), `babycardprintables-${slug()}-folded.pdf`, 'pdf');
  track('export', { generator: def.slug, format: 'pdf', kind: 'folded', sheet, theme: state.theme });
}

async function exportPNG() {
  const c = await capturePage(state.page);
  const blob = await new Promise(res => c.toBlob(res, 'image/png'));
  const n = pageCount();
  deliver(blob, `babycardprintables-${slug()}${n > 1 ? '-' + (state.page + 1) : ''}.png`, 'image');
  track('export', { generator: def.slug, format: 'png', theme: state.theme });
}

function roundRect(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }

async function makePin() {
  const c = await capturePage(state.page), W = 1000, H = 1500, pin = document.createElement('canvas');
  pin.width = W; pin.height = H; const g = pin.getContext('2d');
  const grd = g.createLinearGradient(0, 0, W, H); grd.addColorStop(0, '#a78bfa'); grd.addColorStop(1, '#6366f1');
  g.fillStyle = grd; g.fillRect(0, 0, W, H);
  const maxW = 820, maxH = 1000, k = Math.min(maxW / c.width, maxH / c.height), w = c.width * k, h = c.height * k, x = (W - w) / 2, y = 330 + (maxH - h) / 2;
  g.save(); g.shadowColor = 'rgba(0,0,0,.35)'; g.shadowBlur = 50; g.shadowOffsetY = 20; g.fillStyle = '#fff'; roundRect(g, x, y, w, h, 18); g.fill(); g.restore();
  g.save(); roundRect(g, x, y, w, h, 18); g.clip(); g.drawImage(c, x, y, w, h); g.restore();
  g.fillStyle = '#fff'; g.textAlign = 'center';
  g.font = '800 64px "DejaVu Sans", Arial, sans-serif'; g.fillText(def.pinTitle || 'Free printable baby cards', W / 2, 170);
  g.font = '400 36px "DejaVu Sans", Arial, sans-serif'; g.globalAlpha = .9; g.fillText('Edit, print and download in your browser', W / 2, 235);
  g.globalAlpha = 1; g.font = '700 44px "DejaVu Sans", Arial, sans-serif'; g.fillText('babycardprintables.com', W / 2, H - 90);
  return new Promise(res => pin.toBlob(res, 'image/png'));
}

async function exportPin() {
  deliver(await makePin(), `babycardprintables-${slug()}-pin.png`, 'image');
  track('export', { generator: def.slug, format: 'pin', theme: state.theme });
}

async function shareCard() {
  const c = await capturePage(state.page), blob = await new Promise(res => c.toBlob(res, 'image/png'));
  track('share', { generator: def.slug });
  deliver(blob, `babycardprintables-${slug()}.png`, 'share');   // the share sheet opens from the ready window's tap
}

async function exportPack() {
  const ids = [...document.querySelectorAll('[data-pack]:checked')].map(c => c.dataset.pack);
  if (!ids.length) { alert('Select at least one item.'); return; }
  const backup = JSON.stringify(pick()), [pw, ph] = pageMM(fmt(), state.bleed);
  let pdf, first = true;
  try {
    for (const id of ids) {
      def.pack.apply(state, id);
      syncPhotoURL();
      const n = pageCount();
      for (let i = 0; i < n; i++) {
        const c = await capturePage(i);
        if (!pdf) pdf = newPDF(pw, ph);
        addPageToPDF(pdf, c, pw, ph, first); first = false;
      }
    }
    deliver(pdf.output('blob'), `babycardprintables-${slug()}-pack.pdf`, 'pdf');
    track('export', { generator: def.slug, format: 'pack', items: ids.length });
  } finally {
    Object.assign(state, JSON.parse(backup)); state.page = 0; syncForm(); syncPhotoURL();
  }
}

/* ---------- Saved looks (templates) ---------- */
const getTpls = () => { try { return JSON.parse(localStorage.getItem(tplKey()) || '[]'); } catch (_) { return []; } };
const setTpls = a => { try { localStorage.setItem(tplKey(), JSON.stringify(a)); } catch (_) { alert('Could not save (browser storage is full or blocked).'); } };
function renderTemplates() {
  const list = getTpls();
  $('tpl-list').innerHTML = list.length ? list.map((t, i) =>
    `<div class="flex items-center justify-between gap-2 bg-zinc-900 border border-zinc-800 rounded p-2"><span class="truncate text-zinc-200">${esc(t.name)}</span>` +
    `<span class="flex gap-1 shrink-0"><button type="button" data-tpl-load="${i}" class="btn !py-1 !px-2 bg-zinc-800 text-white">Load</button><button type="button" data-tpl-del="${i}" aria-label="Delete saved look" class="btn !py-1 !px-2 text-zinc-400 hover:text-white">&#10005;</button></span></div>`).join('')
    : '<p class="text-zinc-500">No saved looks yet.</p>';
  fixGap($('tpl-list'));
}

/* ---------- Place search (OpenStreetMap Nominatim, only on button press) ---------- */
let placeHits = [];
const dms = (v, pos, neg) => `${Math.abs(v).toFixed(4)}° ${v >= 0 ? pos : neg}`;
function placeFields(h) {
  const a = h.address || {}, lat = +h.lat, lon = +h.lon;
  const town = a.city || a.town || a.village || a.municipality || a.suburb || a.county || '';
  const city = [town, a.country].filter(Boolean).join(', ');
  const name = h.name || (h.display_name || '').split(',')[0].trim();
  return { name, city, coords: `${dms(lat, 'N', 'S')}, ${dms(lon, 'E', 'W')}` };
}
async function placeSearch(box) {
  const q = box.querySelector('#place-q').value.trim(), st = box.querySelector('[data-place-status]'), out = box.querySelector('[data-place-results]');
  if (q.length < 3) { st.textContent = 'Type at least 3 characters, e.g. the hospital name and city.'; return; }
  st.textContent = 'Searching…'; out.innerHTML = '';
  const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 9000);
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=5&accept-language=en&q=${encodeURIComponent(q)}`, { signal: ctl.signal, headers: { Accept: 'application/json' } });
    if (!r.ok) throw new Error(r.status);
    placeHits = await r.json();
    if (!placeHits.length) { st.textContent = 'No match found. Try the full name with the city, or type the details below by hand.'; return; }
    st.textContent = 'Tap a result to fill the fields below:';
    out.innerHTML = placeHits.map((h, i) => `<button type="button" data-place-pick="${i}" class="block w-full text-left bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded p-2 text-zinc-200">${esc(h.display_name)}</button>`).join('');
  } catch (_) {
    st.textContent = 'Search is not available right now. You can type the details below by hand.';
  } finally { clearTimeout(timer); }
}
function placePick(box, i) {
  const h = placeHits[i]; if (!h) return;
  const k = JSON.parse(box.dataset.place), f = placeFields(h);
  for (const [slot, val] of [[k.name, f.name], [k.city, f.city], [k.coords, f.coords]]) if (slot) { state.data[slot] = val; state.edited[slot] = true; }
  syncForm(); queueRender(); scheduleSave(); commit(true);
  box.querySelector('[data-place-status]').textContent = 'Filled in. Check the details and edit if needed.';
  box.querySelector('[data-place-results]').innerHTML = '';
  track('place_search', { generator: def.slug });
}

/* ---------- Boot ---------- */
function bindEvents() {
  document.addEventListener('input', ev => {
    const el = ev.target, ds = el.dataset;
    if (ds.f !== undefined) { state.data[ds.f] = el.value; if (ds.f in sample()) state.edited[ds.f] = true; queueRender(); }
    else if (ds.mv !== undefined) {
      const box = el.closest('[data-m]');
      state.data[box.dataset.m] = [...box.querySelectorAll('[data-mv]:checked')].map(i => i.dataset.mv);
      state.page = 0; queueRender();
    } else if (ds.t !== undefined) { state.toggles[ds.t] = el.checked; queueRender(); }
    else if (ds.p !== undefined) {
      state.photo[ds.p] = el.type === 'range' ? +el.value : el.value;
      const out = document.querySelector(`[data-out="${ds.p}"]`);
      if (out) out.textContent = state.photo[ds.p] + (PCT.has(ds.p) ? '%' : '');
      refresh();
    } else if (ds.a !== undefined) { state[ds.a] = el.value; queueRender(); }
    else if (ds.o !== undefined) { state[ds.o] = el.checked; }
    else return;
    scheduleSave();
  });

  const pf = $('photo-file');
  if (pf) pf.addEventListener('change', async ev => {
    const file = ev.target.files[0]; if (!file) return;
    const url = URL.createObjectURL(file);
    try { await setPhotoSource(url); refresh(); savePhoto(); } finally { URL.revokeObjectURL(url); }
  });

  $('btn-undo').addEventListener('click', undo);
  $('btn-redo').addEventListener('click', redo);
  document.addEventListener('keydown', ev => {
    if (!(ev.ctrlKey || ev.metaKey)) return;
    const tag = ev.target.tagName, type = ev.target.type;
    if (tag === 'TEXTAREA' || (tag === 'INPUT' && ['text', 'number', 'date', 'time'].includes(type))) return; // keep native field undo
    const k = ev.key.toLowerCase();
    if (k === 'z') { ev.preventDefault(); ev.shiftKey ? redo() : undo(); }
    else if (k === 'y') { ev.preventDefault(); redo(); }
  });

  $('btn-reset').addEventListener('click', async () => {
    if (!confirm('Start over? Your details and photo on this card will be cleared. Saved looks are kept.')) return;
    Object.assign(state, freshState()); try { localStorage.removeItem(storeKey()); localStorage.removeItem(photoKey()); } catch (_) {}
    if ($('photo-file')) $('photo-file').value = '';
    syncForm();
    if (def.photo) clearPhoto();
    refresh(); commit(true);
  });

  const dlg = $('dl-dialog'), dlBtn = $('btn-download');
  const runDownload = kind => withBusy(dlBtn, 'Preparing…', () => kind === 'png' ? exportPNG() : kind === 'fold' ? exportFold() : exportPDF(kind));
  dlBtn.addEventListener('click', () => {
    $('dl-note').classList.toggle('hidden', !(def.photo && state.toggles.photo && !photo.source));
    const fb = dlg.querySelector('[data-dl="fold"]');                // folded card only where the maker offers it (not for posters or game sheets)
    if (fb) { const ok = !!(def.fold && def.fold.on(derive().dv)); fb.hidden = !ok; fb.style.display = ok ? '' : 'none';
      const sz = $('fold-size'); if (sz) sz.textContent = sheetFor(state.format) === 'letter' ? 'US Letter' : 'A4'; }
    openDlg(dlg);
  });
  dlg.addEventListener('click', e => { if (e.target === dlg || e.target.closest('[data-dl-cancel]')) closeDlg(dlg); });
  dlg.querySelectorAll('[data-dl]').forEach(b => b.addEventListener('click', () => { const kind = b.dataset.dl; closeDlg(dlg); runDownload(kind); }));
  if (def.photo) {
    initPhotoDrag($('card-target'), () => { scheduleSave(); });
    $('card-target').addEventListener('click', e => { if (e.target.closest('[data-add-photo]')) $('photo-file').click(); });
    $('btn-photo-center').addEventListener('click', () => { state.photo.offsetX = 0; state.photo.offsetY = 0; refresh(); scheduleSave(); });
  }
  const rd = $('ready-dialog');
  $('ready-save').addEventListener('click', shareReady);
  rd.addEventListener('click', e => { if (e.target === rd || e.target.closest('[data-ready-close]')) closeDlg(rd); });
  $('btn-pin').addEventListener('click', e => withBusy(e.currentTarget, 'Rendering…', exportPin));
  $('btn-share').addEventListener('click', e => withBusy(e.currentTarget, 'Preparing…', shareCard));
  const bp = $('btn-pack'); if (bp) bp.addEventListener('click', e => withBusy(e.currentTarget, 'Building…', exportPack));

  $('pager-prev').addEventListener('click', () => { state.page = Math.max(0, state.page - 1); renderCard(); });
  $('pager-next').addEventListener('click', () => { state.page += 1; renderCard(); });

  $('btn-tpl-save').addEventListener('click', () => {
    const name = $('tpl-name').value.trim();
    if (!name) { $('tpl-name').focus(); return; }
    const list = getTpls().filter(t => t.name !== name);
    list.push({ name, theme: state.theme, colors: clone(state.colors || {}), format: state.format, fontMode: state.fontMode, photo: clone(state.photo), toggles: clone(state.toggles) });
    setTpls(list); $('tpl-name').value = ''; renderTemplates();
  });
  document.addEventListener('click', ev => { const ib = ev.target.closest('[data-idea]'); if (ib) giveIdea(ib.dataset.idea); const cb = ev.target.closest('[data-color]'); if (cb) setColor(cb.dataset.color); });
  document.addEventListener('click', ev => {
    const go = ev.target.closest('[data-place-go]'), pick = ev.target.closest('[data-place-pick]');
    if (go) placeSearch(go.closest('[data-place]'));
    else if (pick) placePick(pick.closest('[data-place]'), +pick.dataset.placePick);
  });
  document.addEventListener('keydown', ev => {
    if (ev.key === 'Enter' && ev.target.id === 'place-q') { ev.preventDefault(); placeSearch(ev.target.closest('[data-place]')); }
  });
  document.addEventListener('click', ev => {
    const load = ev.target.closest('[data-tpl-load]'), del = ev.target.closest('[data-tpl-del]');
    if (load) {
      const t = getTpls()[+load.dataset.tplLoad];
      if (!t || !def.themes[t.theme] || !def.formats[t.format]) return;
      const d = freshState();
      Object.assign(state, { theme: t.theme, colors: { ...(state.colors || {}), ...(t.colors || {}) }, format: t.format, fontMode: FONTS[t.fontMode] ? t.fontMode : d.fontMode, photo: { ...d.photo, ...t.photo }, toggles: { ...d.toggles, ...t.toggles } });
      syncForm(); refresh(); scheduleSave();
    } else if (del) {
      const list = getTpls(), t = list[+del.dataset.tplDel];
      if (t && confirm(`Delete the saved look “${t.name}”?`)) { list.splice(+del.dataset.tplDel, 1); setTpls(list); renderTemplates(); }
    }
  });
  if (typeof window.ResizeObserver === 'function') new ResizeObserver(fitStage).observe($('stage')); else addEventListener('resize', fitStage);
  initMini();
}

export async function boot(definition) {
  def = definition; ctx.def = definition;
  Object.assign(state, freshState());
  loadSaved();
  /* Links can open a design and greeting directly, e.g. ?design=xmas_red&greeting=newyear (used by the holiday guide). */
  try {
    const q = new URLSearchParams(location.search), dz = q.get('design'), gr = q.get('greeting');
    if (dz && !def.themes[dz] && applyAlias(dz)) { const th = def.themes[state.theme]; state.fontMode = th.font; if (def.photo) { if (th.shape) state.photo.shape = th.shape; if (th.filter) state.photo.filterMode = th.filter; } }
    if (dz && def.themes[dz]) { state.theme = dz; state.fontMode = def.themes[dz].font; if (def.photo) { const th = def.themes[dz]; if (th.shape) state.photo.shape = th.shape; if (th.filter) state.photo.filterMode = th.filter; } }
    const cq = q.get('color'); if (cq && def.themes[state.theme].colors && def.themes[state.theme].colors[cq]) state.colors = { ...(state.colors || {}), [state.theme]: cq };
    if (gr && 'greeting' in state.data) state.data.greeting = gr;
  } catch (_) {}
  $('controls-inner').innerHTML = buildControls();
  setTimeout(() => fixGap($('editor')), 0);
  if (!matchMedia('(min-width:1024px)').matches) document.querySelectorAll('[data-acc]:not([data-keep])').forEach(d => { d.open = false; });
  buildStyleGrid();
  bindEvents();
  syncForm();
  renderCard();
  renderTemplates();
  hist.last = JSON.stringify(pick()); updateHistBtns();
  document.fonts.ready.then(queueRender);
  if (def.photo) { await loadPhoto(); refresh(); }
  track('editor_loaded', { generator: def.slug });
  window.__paperborn = { state, renderCard, pageCount, setTheme, exportPDF, exportPNG, exportPack, photo };
  window.ctxThemes = () => def.themes; window.ctxFormats = () => def.formats;  // handy for debugging/tests
}
