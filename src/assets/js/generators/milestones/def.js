/* Monthly milestone card generator definition */
import { TEMPLATES, DECOR } from './templates.js';

const THEMES = {
  classic:    { name: 'Classic Numeral',  desc: 'Warm cream & a big serif numeral', bg: '#fbf6ee', fg: '#3d2b1f', font: 'serif',       shape: 'circle',  filter: 'none', frame: '1px solid rgba(181,131,90,.6)' },
  chalkboard: { name: 'Chalkboard',       desc: 'Hand-lettered chalk on slate',     bg: '#243832', fg: '#f4f1e8', font: 'handwritten', shape: 'rounded', filter: 'none', frame: '3px dashed rgba(244,241,232,.55)' },
  pastel:     { name: 'Pastel Sticker',   desc: 'Soft colours & a round badge',     bg: '#fff4ec', fg: '#4a3b52', font: 'playful',     shape: 'rounded', filter: 'none', frame: '3px solid #ffd9c7' },
  scrapbook:  { name: 'Scrapbook',        desc: 'Polaroid, washi tape & dots',      bg: '#ecdcc0', fg: '#4b3a28', font: 'handwritten', shape: 'rectangle', filter: 'warm', frame: '2px dashed #8a6d43' },
  modern:     { name: 'Modern Colour',    desc: 'Bold navy band & bright blocks',   bg: '#f7f1e8', fg: '#1f3a5f', font: 'sans',        shape: 'arch',    filter: 'none', frame: '' },
};

const MILESTONES = [['0', 'Newborn'], ...Array.from({ length: 12 }, (_, i) => [String(i + 1), `${i + 1} Month${i ? 's' : ''}`]), ['18', '18 Months'], ['24', '2 Years'], ['36', '3 Years'], ['custom', 'Custom text']];

function fmtDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  if (!m) return '';
  return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).toUpperCase();
}

function derive(d) {
  let big = '', small = '';
  if (d.milestone === 'custom') { big = d.customBig || ''; small = d.customSmall || ''; }
  else {
    const n = +d.milestone;
    if (n === 0) { big = 'Hello'; small = 'little one'; }
    else if (n >= 24) { big = String(n / 12); small = n / 12 === 1 ? 'YEAR' : 'YEARS'; }
    else { big = String(n); small = n === 1 ? 'MONTH' : 'MONTHS'; }
  }
  const g = parseFloat(d.weightG), c = parseFloat(d.heightCm);
  return { ...d, big, small, date: fmtDate(d.date), weight: g > 0 ? `${Math.round(g)} G` : '', height: c > 0 ? `${+c.toFixed(1)} CM` : '' };
}

export default {
  slug: 'milestones',
  name: 'Milestone Cards',
  fileName: d => `${d.babyName || 'baby'}-milestone`,
  themes: THEMES,
  defaultTheme: 'classic',
  formats: {
    a5:       { label: 'A5 Card (148×210 mm)',  w: 559, h: 794,  mm: [148, 210],     photoH: 215, num: 120 },
    a4:       { label: 'A4 Poster (210×297 mm)', w: 794, h: 1123, mm: [210, 297],     photoH: 370, num: 200 },
    usletter: { label: 'US Letter (8.5×11 in)', w: 816, h: 1056, mm: [215.9, 279.4], photoH: 340, num: 190 },
    p5x7:     { label: '5×7 in Print',          w: 480, h: 672,  mm: [127, 177.8],   photoH: 90, num: 76 },
  },
  pad: 32,
  defaultFormat: 'a5',
  photo: true,
  defaults: {
    toggles: { name: true, date: true, weight: true, height: true, note: true, facts: true },
    data: { babyName: 'Aurelia', milestone: '3', customBig: '100', customSmall: 'DAYS', date: '2026-10-10', weightG: '5800', heightCm: '61',
            note: 'Smiles at everyone and loves bath time!', loves: 'Bath time & lullabies', skill: 'Rolling over', fun: 'Giggles at the dog' },
  },
  ornaments: [['accents', 'Accents / doodles'], ['border', 'Frame border'], ['crop', 'Crop marks'], ['footer', 'Small footer label']],
  sections: [{
    title: 'Milestone details',
    boxes: [
      { toggles: [['name', 'Baby name']], fields: [{ key: 'babyName', type: 'text', ph: 'Baby name', maxlength: 30 }] },
      { cols: 2, fields: [
        { key: 'milestone', type: 'select', label: 'Milestone', span: 2, options: MILESTONES },
        { key: 'customBig', type: 'text', label: 'Custom big text', ph: '100', maxlength: 6 },
        { key: 'customSmall', type: 'text', label: 'Custom small text', ph: 'DAYS', maxlength: 14 } ] },
      { toggles: [['date', 'Date'], ['weight', 'Weight']], cols: 2, fields: [
        { key: 'date', type: 'date', label: 'Date', min: '1900-01-01' },
        { key: 'weightG', type: 'number', label: 'Weight (grams)', min: 300, max: 25000, step: 1, ph: '5800' } ] },
      { toggles: [['height', 'Height']], fields: [{ key: 'heightCm', type: 'number', label: 'Height (cm)', min: 20, max: 130, step: 0.5, ph: '61' }] },
      { toggles: [['note', 'This month I…']], fields: [{ key: 'note', type: 'textarea', rows: 3, ph: 'Smiles at everyone and loves bath time!', max: 140 }] },
      { toggles: [['facts', 'Favourites']], fields: [
        { key: 'loves', type: 'text', label: 'Loves', ph: 'Bath time', maxlength: 36 },
        { key: 'skill', type: 'text', label: 'New skill', ph: 'Rolling over', maxlength: 36 },
        { key: 'fun', type: 'text', label: 'Fun fact', ph: 'Giggles at the dog', maxlength: 36 } ] },
    ],
  }],
  pack: {
    title: 'Milestone Set',
    desc: 'One PDF with a card for each month you tick, using your photo and theme. Tip: switch off Date, Weight and Height first if they differ per month.',
    button: 'Download milestone set (PDF)',
    options: MILESTONES.filter(m => m[0] !== 'custom' && +m[0] <= 12).map(([v, l]) => [v, l]),
    apply(state, id) { state.data.milestone = id; },
  },
  derive,
  templates: TEMPLATES,
  decor: DECOR,
};
