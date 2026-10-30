/* Baby Card Printables editor engine.
   A generator is a plain definition object (see each generator def.js). The engine builds the sidebar from it,
   renders the live card, and provides undo/redo, saved looks, multi-page output, packs and PNG/PDF export. */
import { $, esc, clone, track } from './util.js';
import { state, ctx, fmt } from './state.js';
import { FONTS, FONT_LABELS, loadFonts } from './fonts.js';
import { photo, setPhotoSource, syncPhotoURL, SHAPE_LABELS, FILTER_LABELS } from './photo.js';
import { renderToCanvas, pageMM, addBleed, newPDF, addPageToPDF, downloadBlob } from './export.js';

let def;
const COLS = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3' };
const SPAN = { 1: 'col-span-1', 2: 'col-span-2', 3: 'col-span-3' };
const DEFAULT_ORNAMENTS = [['accents', 'Accents / icons'], ['border', 'Frame border'], ['crop', 'Crop marks'], ['footer', 'Archival stamp']];
const PCT = new Set(['brightness', 'contrast', 'zoom', 'offsetX', 'offsetY']);

/* ---------- State ---------- */
function freshState() {
  const th = def.themes[def.defaultTheme];
  return {
    theme: def.defaultTheme, format: def.defaultFormat, fontMode: th.font, bleed: false, page: 0,
    photo: { shape: th.shape || 'rectangle', filterMode: th.filter || 'none', brightness: 100, contrast: 110, zoom: 100, offsetX: 0, offsetY: 0 },
    toggles: { photo: true, accents: true, border: true, crop: false, footer: true, ...clone(def.defaults.toggles || {}) },
    data: clone(def.defaults.data || {}),
  };
}
const pick = () => ({ theme: state.theme, format: state.format, fontMode: state.fontMode, photo: state.photo, toggles: state.toggles, data: state.data });
const storeKey = () => `paperborn:${def.slug}:v1`;
const tplKey = () => `paperborn:${def.slug}:templates`;

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
    Object.assign(state, d, s, { photo: { ...d.photo, ...s.photo }, toggles: { ...d.toggles, ...s.toggles }, data: { ...d.data, ...s.data }, page: 0, bleed: false });
    if (!def.themes[state.theme]) state.theme = d.theme;
    if (!def.formats[state.format]) state.format = d.format;
    if (!FONTS[state.fontMode]) state.fontMode = d.fontMode;
  } catch (_) {}
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
function restore(s) { Object.assign(state, JSON.parse(s)); syncForm(); refresh(); scheduleSave(); }
function undo() { commit(true); if (!hist.past.length) return; hist.future.push(hist.last); hist.last = hist.past.pop(); restore(hist.last); updateHistBtns(); }
function redo() { commit(true); if (!hist.future.length) return; hist.past.push(hist.last); hist.last = hist.future.pop(); restore(hist.last); updateHistBtns(); }

/* ---------- Sidebar (built from the definition) ---------- */
function fieldHTML(fd) {
  const id = `f-${fd.key}`, span = SPAN[fd.span || 1];
  const lab = fd.label ? `<label class="lbl" for="${id}">${fd.label}</label>` : '';
  const common = `id="${id}" data-f="${fd.key}" class="inp ${fd.cls || ''}"`;
  const ph = `placeholder="${esc(fd.ph || '')}"`;
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
    default: {
      const attrs = ['min', 'max', 'step'].filter(k => fd[k] !== undefined).map(k => `${k}="${fd[k]}"`).join(' ');
      const mode = fd.type === 'number' ? `inputmode="${fd.step && fd.step < 1 ? 'decimal' : 'numeric'}"` : '';
      ctl = `<input type="${fd.type || 'text'}" ${common} ${ph} ${attrs} ${mode} ${fd.maxlength ? `maxlength="${fd.maxlength}"` : ''}>`;
    }
  }
  return `<div class="${span} min-w-0">${lab}${ctl}</div>`;
}

function boxHTML(b) {
  const tg = (b.toggles || []).map(([k, l], i) =>
    `<label class="chk ${i === 0 ? 'font-bold text-white' : ''}"><input type="checkbox" data-t="${k}" class="rounded">${l}</label>`).join('');
  return `<div class="box">${tg ? `<div class="flex justify-between gap-2">${tg}</div>` : ''}` +
    `<div class="grid ${COLS[b.cols || 1]} gap-2">${b.fields.map(fieldHTML).join('')}</div></div>`;
}

function range(label, key, min, max) {
  return `<div><div class="flex justify-between text-[10px] text-zinc-400"><span>${label}</span><span data-out="${key}"></span></div><input type="range" data-p="${key}" min="${min}" max="${max}" class="w-full"></div>`;
}

function buildControls() {
  let n = 0;
  const sec = (title, body, extra = '') => `<section class="sec"><div class="flex justify-between items-center"><h2 class="h2">${++n}. ${title}</h2>${extra}</div>${body}</section>`;
  let html = sec(def.ui?.themeTitle || 'Aesthetic Theme', '<div id="style-grid" class="grid grid-cols-2 gap-2"></div>',
    `<span class="text-[10px] text-zinc-500 font-mono">${Object.keys(def.themes).length} STYLES</span>`);

  if (def.photo) {
    html += sec('Photo Studio', `<div class="box">
      <div><label class="lbl" for="photo-file">Upload image</label>
        <input type="file" id="photo-file" accept="image/*" class="w-full text-zinc-300 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-white cursor-pointer"></div>
      <div class="grid grid-cols-2 gap-3">
        <div><label class="lbl">Frame shape</label><select data-p="shape" class="inp">${SHAPE_LABELS.map(([v, l]) => `<option value="${v}">${l}</option>`).join('')}</select></div>
        <div><label class="lbl">Colour filter</label><select data-p="filterMode" class="inp">${FILTER_LABELS.map(([v, l]) => `<option value="${v}">${esc(l)}</option>`).join('')}</select></div>
      </div>
      <div class="space-y-2 pt-2 border-t border-zinc-800">
        ${range('Brightness', 'brightness', 50, 150)}${range('Contrast', 'contrast', 50, 200)}${range('Zoom', 'zoom', 100, 250)}
        <div class="grid grid-cols-2 gap-2">${range('Offset X', 'offsetX', -40, 40)}${range('Offset Y', 'offsetY', -40, 40)}</div>
      </div></div>`,
      `<label class="chk"><input type="checkbox" data-t="photo" class="rounded"><span class="text-[10px] uppercase tracking-wider font-bold">Include</span></label>`);
  }

  html += sec('Paper &amp; Typography', `<div class="grid grid-cols-2 gap-3">
    <div><label class="lbl">Canvas size</label><select data-a="format" class="inp">${Object.entries(def.formats).map(([k, f]) => `<option value="${k}">${f.label}</option>`).join('')}</select></div>
    <div><label class="lbl">Font</label><select data-a="fontMode" class="inp">${FONT_LABELS.map(([v, l]) => `<option value="${v}">${l}</option>`).join('')}</select></div></div>`);

  for (const s of def.sections) html += sec(s.title, s.boxes.map(boxHTML).join(''));

  html += sec('My Templates', `<p class="text-zinc-500">Saves the look (style, size, font, photo settings, toggles), not the text you typed.</p>
    <div class="flex gap-2"><input id="tpl-name" class="inp" placeholder="Template name" maxlength="30"><button id="btn-tpl-save" type="button" class="btn bg-indigo-600 hover:bg-indigo-500 text-white shrink-0">Save</button></div>
    <div id="tpl-list" class="space-y-2"></div>`);

  if (def.pack) {
    html += sec(def.pack.title, `<p class="text-zinc-500">${def.pack.desc}</p>
      <div class="grid grid-cols-2 gap-2">${def.pack.options.map(([v, l, on]) => `<label class="chk box !space-y-0"><input type="checkbox" data-pack="${esc(v)}" ${on === false ? '' : 'checked'} class="rounded">${esc(l)}</label>`).join('')}</div>
      <button id="btn-pack" type="button" class="btn bg-zinc-800 hover:bg-zinc-700 text-white w-full">${def.pack.button || 'Download pack PDF'}</button>`);
  }

  const orn = [...(def.ornaments || DEFAULT_ORNAMENTS), ...(def.extraOrnaments || [])];
  html += `<section class="space-y-3 pb-5"><h2 class="h2">${++n}. Ornaments &amp; Print</h2><div class="grid grid-cols-2 gap-2">` +
    orn.map(([k, l, wide]) => `<label class="chk box !space-y-0 ${wide ? 'col-span-2' : ''}"><input type="checkbox" data-t="${k}" class="rounded">${l}</label>`).join('') +
    `<label class="chk box !space-y-0 col-span-2"><input type="checkbox" data-o="bleed" class="rounded">Add 3 mm print bleed (extends the background on export)</label></div></section>`;
  return html;
}

function buildStyleGrid() {
  const ids = Object.keys(def.themes);
  $('style-grid').innerHTML = ids.map((id, i) =>
    `<button type="button" data-style="${id}" class="style-btn"><span class="block text-xs">${i + 1}) ${def.themes[id].name}</span><span class="block text-[9px] text-zinc-500 mt-0.5">${def.themes[id].desc}</span></button>`).join('');
  $('style-grid').addEventListener('click', ev => { const b = ev.target.closest('[data-style]'); if (b) setTheme(b.dataset.style); });
}

function syncForm() {
  document.querySelectorAll('[data-f]').forEach(el => { el.value = state.data[el.dataset.f] ?? ''; });
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
  const th = def.themes[id];
  state.theme = id; state.fontMode = th.font;
  if (def.photo) { if (th.shape) state.photo.shape = th.shape; if (th.filter) state.photo.filterMode = th.filter; }
  syncForm(); refresh(); scheduleSave();
  track('theme_changed', { generator: def.slug, theme: id });
}

/* ---------- Rendering ---------- */
let rafId = 0;
const queueRender = () => { cancelAnimationFrame(rafId); rafId = requestAnimationFrame(renderCard); };
function refresh() { syncPhotoURL(); queueRender(); }

function derive() {
  const dv = def.derive ? def.derive(state.data) : { ...state.data };
  const e = {};
  for (const [k, v] of Object.entries(dv)) {
    e[k] = Array.isArray(v) ? v.map(x => esc(String(x))) : (v && typeof v === 'object') ? v : esc(String(v ?? '')).trim();
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
  const n = def.pageCount ? Math.max(1, def.pageCount(dv, state)) : 1;
  state.page = Math.max(0, Math.min(state.page, n - 1));
  updatePager(n);

  const pad = th.pad ?? def.pad ?? 40;
  const chromeFrame = def.chrome?.frame !== false, chromeCrop = def.chrome?.crop !== false;
  const el = $('card-target');
  el.style.cssText = `width:${f.w}px;height:${f.h}px;padding:${pad}px;background:${th.bg};color:${th.fg};font-family:${FONTS[state.fontMode]};`;
  const crop = chromeCrop && t.crop ? '<div class="crop-mark crop-tl"></div><div class="crop-mark crop-tr"></div><div class="crop-mark crop-bl"></div><div class="crop-mark crop-br"></div>' : '';
  const frame = chromeFrame && t.border && th.frame ? `<div style="position:absolute;inset:16px;border:${th.frame};pointer-events:none;z-index:5"></div>` : '';
  const decor = def.decor?.[state.theme]?.(t, f, e, dv, state.page) ?? '';
  const inner = def.templates[state.theme](e, t, f, dv, state.page);
  el.innerHTML = `${decor}${crop}${frame}<div class="relative z-10 h-full flex flex-col justify-between" style="padding:${chromeFrame && t.border ? 12 : 0}px">${inner}</div>`;
  fitStage();
}

function fitStage() {
  const f = fmt(), stage = $('stage');
  let s = (stage.clientWidth - 32) / f.w;
  if (matchMedia('(min-width:1024px)').matches) s = Math.min(s, (stage.clientHeight - 32) / f.h);
  s = Math.max(0.25, Math.min(1, s));
  $('sizer').style.width = f.w * s + 'px';
  $('sizer').style.height = f.h * s + 'px';
  $('card-scale').style.transform = `scale(${s})`;
}

/* ---------- Export ---------- */
const slug = () => (def.fileName ? def.fileName(state.data) : def.slug).toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || def.slug;

async function capturePage(i) {
  state.page = i; renderCard();
  await loadFonts(state.fontMode);
  const f = fmt(), bg = def.themes[state.theme].bg;
  const c = await renderToCanvas($('card-target'), f, bg);
  return state.bleed ? addBleed(c, f, bg) : c;
}

async function withBusy(btn, label, fn) {
  const orig = btn.textContent, page = state.page; btn.disabled = true; btn.textContent = label;
  try { await fn(); }
  catch (err) { console.error(err); alert('Export failed. Try again, or use a smaller paper size.'); }
  finally { state.page = page; renderCard(); btn.disabled = false; btn.textContent = orig; }
}

async function exportPDF() {
  const [pw, ph] = pageMM(fmt(), state.bleed), n = pageCount();
  let pdf;
  for (let i = 0; i < n; i++) {
    const c = await capturePage(i);
    if (!pdf) pdf = newPDF(pw, ph);
    addPageToPDF(pdf, c, pw, ph, i === 0);
  }
  pdf.save(`babycardprintables-${slug()}.pdf`);
  track('export', { generator: def.slug, format: 'pdf', pages: n, theme: state.theme });
}

async function exportPNG() {
  const c = await capturePage(state.page);
  const blob = await new Promise(res => c.toBlob(res, 'image/png'));
  const n = pageCount();
  downloadBlob(blob, `babycardprintables-${slug()}${n > 1 ? '-' + (state.page + 1) : ''}.png`);
  track('export', { generator: def.slug, format: 'png', theme: state.theme });
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
    pdf.save(`babycardprintables-${slug()}-pack.pdf`);
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
    `<span class="flex gap-1 shrink-0"><button type="button" data-tpl-load="${i}" class="btn !py-1 !px-2 bg-zinc-800 text-white">Load</button><button type="button" data-tpl-del="${i}" aria-label="Delete template" class="btn !py-1 !px-2 text-zinc-400 hover:text-white">&#10005;</button></span></div>`).join('')
    : '<p class="text-zinc-500">No saved templates yet.</p>';
}

/* ---------- Boot ---------- */
function bindEvents() {
  document.addEventListener('input', ev => {
    const el = ev.target, ds = el.dataset;
    if (ds.f !== undefined) { state.data[ds.f] = el.value; queueRender(); }
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
    try { await setPhotoSource(url); refresh(); } finally { URL.revokeObjectURL(url); }
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
    Object.assign(state, freshState()); try { localStorage.removeItem(storeKey()); } catch (_) {}
    if ($('photo-file')) $('photo-file').value = '';
    syncForm();
    if (def.photo) { await setPhotoSource(def.sampleImage); }
    refresh(); commit(true);
  });

  $('btn-pdf').addEventListener('click', e => withBusy(e.currentTarget, 'Generating…', exportPDF));
  $('btn-png').addEventListener('click', e => withBusy(e.currentTarget, 'Rendering…', exportPNG));
  const bp = $('btn-pack'); if (bp) bp.addEventListener('click', e => withBusy(e.currentTarget, 'Building…', exportPack));

  $('pager-prev').addEventListener('click', () => { state.page = Math.max(0, state.page - 1); renderCard(); });
  $('pager-next').addEventListener('click', () => { state.page += 1; renderCard(); });

  $('btn-tpl-save').addEventListener('click', () => {
    const name = $('tpl-name').value.trim();
    if (!name) { $('tpl-name').focus(); return; }
    const list = getTpls().filter(t => t.name !== name);
    list.push({ name, theme: state.theme, format: state.format, fontMode: state.fontMode, photo: clone(state.photo), toggles: clone(state.toggles) });
    setTpls(list); $('tpl-name').value = ''; renderTemplates();
  });
  document.addEventListener('click', ev => {
    const load = ev.target.closest('[data-tpl-load]'), del = ev.target.closest('[data-tpl-del]');
    if (load) {
      const t = getTpls()[+load.dataset.tplLoad];
      if (!t || !def.themes[t.theme] || !def.formats[t.format]) return;
      const d = freshState();
      Object.assign(state, { theme: t.theme, format: t.format, fontMode: FONTS[t.fontMode] ? t.fontMode : d.fontMode, photo: { ...d.photo, ...t.photo }, toggles: { ...d.toggles, ...t.toggles } });
      syncForm(); refresh(); scheduleSave();
    } else if (del) {
      const list = getTpls(), t = list[+del.dataset.tplDel];
      if (t && confirm(`Delete template “${t.name}”?`)) { list.splice(+del.dataset.tplDel, 1); setTpls(list); renderTemplates(); }
    }
  });
  new ResizeObserver(fitStage).observe($('stage'));
}

export async function boot(definition) {
  def = definition; ctx.def = definition;
  if (!def.sampleImage) def.sampleImage = '/assets/img/sample.svg';
  Object.assign(state, freshState());
  loadSaved();
  $('controls-inner').innerHTML = buildControls();
  buildStyleGrid();
  bindEvents();
  syncForm();
  renderCard();
  renderTemplates();
  hist.last = JSON.stringify(pick()); updateHistBtns();
  document.fonts.ready.then(queueRender);
  if (def.photo) { await setPhotoSource(def.sampleImage || '/assets/img/sample.svg'); refresh(); }
  track('editor_loaded', { generator: def.slug });
  window.__paperborn = { state, renderCard, pageCount, setTheme, exportPDF, exportPNG, exportPack, photo };
  window.ctxThemes = () => def.themes; window.ctxFormats = () => def.formats;  // handy for debugging/tests
}
