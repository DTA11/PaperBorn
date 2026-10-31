/* Baby stats generator definition */
import { THEMES } from './themes.js';
import { TEMPLATES, DECOR } from './templates.js';
import { NEW_THEMES, NEW_TEMPLATES, NEW_DECOR } from './illustrated.js';
import { REDESIGN_THEMES, REDESIGN_TEMPLATES, REDESIGN_DECOR } from './redesigns.js';
import { HOLIDAY_THEMES, HOLIDAY_TEMPLATES, HOLIDAY_DECOR, GREETINGS } from './holiday.js';
import { ANIMALS, ANIMAL_ORDER } from '../../core/animals.js';

/* New illustrated designs first, then the originals (four of them redesigned, same ids so saved cards keep working). */
const ALL_THEMES = { ...NEW_THEMES, ...HOLIDAY_THEMES, ...Object.fromEntries(Object.entries(THEMES).map(([k, v]) => [k, REDESIGN_THEMES[k] || v])) };

/* ---------- Derived values: calendar date, grams, cm, zodiac ---------- */
function fmtDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  if (!m) return '';
  return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]))
    .toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).toUpperCase();
}
function zodiacOf(iso) {
  const m = /^\d{4}-(\d{2})-(\d{2})$/.exec(iso || '');
  if (!m) return '';
  const mo = +m[1], da = +m[2];
  const starts = [[1, 20, 'AQUARIUS', '♒'], [2, 19, 'PISCES', '♓'], [3, 21, 'ARIES', '♈'], [4, 20, 'TAURUS', '♉'],
    [5, 21, 'GEMINI', '♊'], [6, 21, 'CANCER', '♋'], [7, 23, 'LEO', '♌'], [8, 23, 'VIRGO', '♍'],
    [9, 23, 'LIBRA', '♎'], [10, 23, 'SCORPIO', '♏'], [11, 22, 'SAGITTARIUS', '♐'], [12, 22, 'CAPRICORN', '♑']];
  let sign = ['CAPRICORN', '♑'];               // Dec 22 – Jan 19
  for (const [sm, sd, name, sym] of starts) if (mo > sm || (mo === sm && da >= sd)) sign = [name, sym];
  return `${sign[0]} ${sign[1]}︎`;
}
const initials = (a, b) => [a, b].map(s => (String(s || '').trim()[0] || '')).join('').toUpperCase();
function derived(d) {
  const g = parseFloat(d.weightG), c = parseFloat(d.heightCm);
  const parents = [d.mother, d.father].map(s => String(s || '').trim()).filter(Boolean).join(' & ');
  return { ...d, monogram: String(d.monogram || '').trim().toUpperCase() || initials(d.firstName, d.lastName), parents, dateISO: d.date || '', weightN: g > 0 ? Math.round(g) : '', heightN: c > 0 ? +c.toFixed(1) : '', date: fmtDate(d.date), time: d.time || '', zodiac: zodiacOf(d.date),
    weight: g > 0 ? `${Math.round(g)} G` : '', weightSub: '',
    height: c > 0 ? `${+c.toFixed(1)} CM` : '', heightSub: '' };
}

export default {
  slug: 'baby-stats', pinTitle: 'Printable baby birth card',
  name: 'Baby Stats',
  fileName: d => d.firstName || 'baby-stats',
  themes: ALL_THEMES,
  defaultTheme: 'animals_blue',
  formats: {
    a4:        { label: 'A4 Poster (210×297 mm)', w: 794, h: 1123, mm: [210, 297],     photoH: 440 },
    a5:        { label: 'A5 Card (148×210 mm)',   w: 559, h: 794,  mm: [148, 210],     photoH: 320 },
    usletter:  { label: 'US Letter (8.5×11 in)',  w: 816, h: 1056, mm: [215.9, 279.4], photoH: 420 },
    frame8x10: { label: '8×10 Frame',             w: 768, h: 960,  mm: [203.2, 254],   photoH: 380 },
    square:    { label: 'Square (210×210 mm)',    w: 800, h: 800,  mm: [210, 210],     photoH: 250 },
  },
  defaultFormat: 'a4',
  photo: true,
  defaults: {
    toggles: { name: true, monogram: true, date: true, time: true, weight: true, height: true, location: true, city: true, coords: true, parents: true, zodiac: true, moon: true, quote: true },
    data: { monogram: '', date: '2026-10-10', time: '08:42', animal: 'elephant', greeting: 'auto' },
    sample: { firstName: 'AURELIA', lastName: 'VALENTINE', weightG: '3450', heightCm: '51', location: 'City General Hospital', city: 'Your City, Country',
              coords: '45.0000° N, 15.0000° E', mother: 'EMMA', father: 'MARK', quote: 'Little miracle, endless love.' },
    sampleGroups: [['firstName', 'lastName'], ['mother', 'father'], ['weightG', 'heightCm'], ['location', 'city', 'coords']],
  },
  extraOrnaments: [['moon', 'Moon on the birth date (Celestial and Cyber designs)', true]],
  /* Older saves had one "parents" field ("EMMA & MARK"); split it into mother and father. */
  migrate(d) {
    if (d.parents === undefined || d.mother !== undefined) return;
    const p = String(d.parents).trim();
    if (p && p !== 'EMMA & MARK') { const [m, ...f] = p.split(/\s*(?:&|\+|\band\b)\s*/i); d.mother = m || ''; d.father = f.join(' & '); }
    if (d.monogram === 'AV') d.monogram = '';
    delete d.parents;
  },
  sections: [{
    title: 'Details',
    boxes: [
      { fields: [{ type: 'note', text: 'Grey text is only an example and stays on the card until you type your own. Untick a line to leave it off.' }] },
      { toggles: [['name', 'Baby name'], ['monogram', 'Initials']], cols: 3, fields: [
        { key: 'firstName', type: 'text', label: 'First name', span: 2, maxlength: 40 },
        { key: 'monogram', type: 'text', label: 'Initials', autoPh: 'monogram', maxlength: 3, cls: 'text-center uppercase font-bold' },
        { key: 'lastName', type: 'text', label: 'Last name', span: 3, maxlength: 40 },
        { type: 'note', span: 3, text: 'Initials are made from the name. Type in the box only to change them.' } ] },
      { toggles: [['date', 'Birth date'], ['time', 'Time']], cols: 2, fields: [
        { key: 'date', type: 'date', label: 'Date of birth', min: '1900-01-01' },
        { key: 'time', type: 'time', label: 'Time (24 h)' } ] },
      { toggles: [['weight', 'Weight'], ['height', 'Height']], cols: 2, fields: [
        { key: 'weightG', type: 'number', label: 'Weight (grams)', min: 300, max: 7000, step: 1, ph: '3450' },
        { key: 'heightCm', type: 'number', label: 'Height (cm)', min: 20, max: 70, step: 0.5, ph: '51' } ] },
      { toggles: [['location', 'Hospital name'], ['city', 'City / address'], ['coords', 'Map coordinates']], cols: 2, fields: [
        { type: 'placesearch', label: 'Find hospital address', span: 2, ph: 'Hospital name and city', keys: { name: 'location', city: 'city', coords: 'coords' } },
        { key: 'location', type: 'text', ph: 'Medical center', span: 2, maxlength: 60 },
        { key: 'city', type: 'text', ph: 'City, Country', maxlength: 60 },
        { key: 'coords', type: 'text', ph: '45.0000° N, 15.0000° E', maxlength: 40 } ] },
      { toggles: [['parents', 'Parents']], cols: 2, fields: [
        { key: 'mother', type: 'text', label: 'Mother', maxlength: 24 },
        { key: 'father', type: 'text', label: 'Father', maxlength: 24 } ] },
      { fields: [{ key: 'animal', type: 'select', label: 'Animal (Little Animals and Christmas designs)', options: ANIMAL_ORDER.map(k => [k, ANIMALS[k].name]) }] },
      { fields: [{ key: 'greeting', type: 'select', label: 'Greeting (Christmas and New Year designs)', options: GREETINGS }] },
      { toggles: [['zodiac', 'Star sign']], fields: [
        { key: 'zodiac', type: 'readout', label: 'Star sign (filled in for you)', empty: 'Pick a birth date' } ] },
      { toggles: [['quote', 'Short message']], fields: [ { key: 'quote', type: 'text', ph: 'Little miracle, endless love.', maxlength: 90 } ] },
    ],
  }],
  pack: {
    title: 'All Designs in One PDF',
    desc: 'One PDF with a page for each design you tick, using your details and the paper size above.',
    button: 'Download all designs (PDF)',
    options: Object.entries(ALL_THEMES).map(([id, th]) => [id, th.name]),
    apply(state, id) { const th = ALL_THEMES[id]; state.theme = id; state.fontMode = th.font; state.photo.shape = th.shape; state.photo.filterMode = th.filter; },
  },
  derive: derived,
  /* Hospital name and city are separate switches; the designs only know one "location" switch, so adapt here:
     whichever of the two is switched on takes the place the design reserves for the hospital (Playful only has a city slot). */
  templates: Object.fromEntries(Object.entries({ ...NEW_TEMPLATES, ...HOLIDAY_TEMPLATES, ...TEMPLATES, ...REDESIGN_TEMPLATES }).map(([id, fn]) => [id, (e, t, f, dv, pg) => {
    const hos = t.location ? e.location : '', city = t.city ? e.city : '';
    const e2 = id === 'playful' ? { ...e, location: hos, city: city || hos }
      : { ...e, location: hos || city, city: hos ? city : '' };
    return fn(e2, { ...t, location: !!(hos || city) }, f, dv, pg);
  }])),
  decor: { ...DECOR, ...NEW_DECOR, ...HOLIDAY_DECOR, ...REDESIGN_DECOR },
};
