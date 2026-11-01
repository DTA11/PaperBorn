/* Monthly milestone card generator definition */
import { TEMPLATES, DECOR } from './templates.js';
import { LA_THEMES, LA_TEMPLATES, LA_DECOR } from './little-animals.js';
import { ANIMALS, ANIMAL_ORDER } from '../../core/animals.js';

const THEMES = {
  ...LA_THEMES,
  classic:    { name: 'Classic Numeral',  desc: 'Warm cream & a big serif numeral', bg: '#fbf6ee', fg: '#3d2b1f', font: 'serif',       shape: 'circle',  filter: 'none', frame: '1px solid rgba(181,131,90,.6)' },
  chalkboard: { name: 'Chalkboard',       desc: 'Hand-lettered chalk on slate',     bg: '#243832', fg: '#f4f1e8', font: 'handwritten', shape: 'rounded', filter: 'none', frame: '3px dashed rgba(244,241,232,.55)' },
  pastel:     { name: 'Pastel Sticker',   desc: 'Soft colors & a round badge',     bg: '#fff4ec', fg: '#4a3b52', font: 'playful',     shape: 'rounded', filter: 'none', frame: '3px solid #ffd9c7' },
  scrapbook:  { name: 'Scrapbook',        desc: 'Polaroid, washi tape & dots',      bg: '#ecdcc0', fg: '#4b3a28', font: 'handwritten', shape: 'rectangle', filter: 'warm', frame: '2px dashed #8a6d43' },
  modern:     { name: 'Modern Color',    desc: 'Bold navy band & bright blocks',   bg: '#f7f1e8', fg: '#1f3a5f', font: 'sans',        shape: 'arch',    filter: 'none', frame: '' },
};

const MILESTONES = [['0', 'Newborn'], ...Array.from({ length: 12 }, (_, i) => [String(i + 1), `${i + 1} Month${i ? 's' : ''}`]), ['18', '18 Months'], ['24', '2 Years'], ['36', '3 Years'], ['custom', 'Write my own']];

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
  slug: 'milestones', pinTitle: 'Baby milestone cards',
  name: 'Milestone Cards',
  fileName: d => `${d.babyName || 'baby'}-milestone`,
  themes: THEMES,
  defaultTheme: 'animals_blue',
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
    data: { milestone: '3', date: '2026-10-10', animal: 'auto' },
    sample: { babyName: 'Aurelia', customBig: '100', customSmall: 'DAYS', weightG: '5800', heightCm: '61',
              note: 'Smiles at everyone and loves bath time!', loves: 'Bath time & lullabies', skill: 'Rolling over', fun: 'Giggles at the dog' },
    sampleGroups: [['customBig', 'customSmall'], ['weightG', 'heightCm'], ['loves', 'skill', 'fun']],
  },
  ornaments: [['accents', 'Little doodles'], ['border', 'Border line'], ['crop', 'Cutting guides'], ['footer', 'Small footer text']],
  sections: [{
    title: 'Milestone details',
    boxes: [
      { fields: [{ type: 'note', text: 'Grey text is only an example and stays on the card until you type your own. Untick a line to leave it off.' }] },
      { toggles: [['name', 'Baby name']], fields: [{ key: 'babyName', type: 'text', ph: 'Baby name', maxlength: 30 }] },
      { cols: 2, fields: [
        { key: 'milestone', type: 'select', label: 'Milestone', span: 2, options: MILESTONES },
        { key: 'animal', type: 'select', label: 'Animal (Little Animals designs)', span: 2, options: [['auto', 'A different one each month'], ...ANIMAL_ORDER.map(k => [k, ANIMALS[k].name])] },
        { key: 'customBig', type: 'text', label: 'Your big text', ph: '100', maxlength: 6 },
        { key: 'customSmall', type: 'text', label: 'Your small text', ph: 'DAYS', maxlength: 14 } ] },
      { toggles: [['date', 'Date'], ['weight', 'Weight']], cols: 2, fields: [
        { key: 'date', type: 'date', label: 'Date', min: '1900-01-01' },
        { key: 'weightG', type: 'number', label: 'Weight (grams)', min: 300, max: 25000, step: 1, ph: '5800' } ] },
      { toggles: [['height', 'Height']], fields: [{ key: 'heightCm', type: 'number', label: 'Height (cm)', min: 20, max: 130, step: 0.5, ph: '61' }] },
      { toggles: [['note', 'This month I…']], fields: [{ key: 'note', type: 'textarea', rows: 3, ph: 'Smiles at everyone and loves bath time!', max: 140 }] },
      { toggles: [['facts', 'Favorites']], fields: [
        { key: 'loves', type: 'text', label: 'Loves', ph: 'Bath time', maxlength: 36 },
        { key: 'skill', type: 'text', label: 'New skill', ph: 'Rolling over', maxlength: 36 },
        { key: 'fun', type: 'text', label: 'Fun fact', ph: 'Giggles at the dog', maxlength: 36 } ] },
    ],
  }],
  pack: {
    title: 'Monthly Set in One PDF',
    desc: 'One PDF with a card for each month you tick, using your photo and design. Tip: switch off Date, Weight and Height first if they differ per month.',
    button: 'Download milestone set (PDF)',
    options: MILESTONES.filter(m => m[0] !== 'custom' && +m[0] <= 12).map(([v, l]) => [v, l]),
    apply(state, id) { state.data.milestone = id; },
  },
  /* "Give me an idea" for the note, matched to the baby's age */
  ideas: {
    note: dv => {
      const m = +dv.milestone;
      if (dv.milestone === '0') return ['Sleeps a lot and loves cuddles.', 'Brand new and already so loved.', 'Hello, world! I love being held.', 'Tiny, sleepy and perfect.', 'Loves milk, naps and snuggles.'];
      if (m <= 3) return ['Smiles at everyone and loves bath time!', 'My first real smile!', 'I can hold my head up all by myself.', 'Loves tummy time (sometimes).', 'Coos and gurgles all day long.', 'Found my hands and I love them.', 'Starting to sleep longer at night.', 'Follows faces and toys with my eyes.'];
      if (m <= 6) return ['Rolled over for the first time!', 'Giggles at peekaboo.', 'Discovered my toes!', 'Tried my first food: banana!', 'Grabs everything and puts it in my mouth.', 'Laughing out loud!', 'Sitting up with a little help.', 'Blowing raspberries all day.'];
      if (m <= 9) return ['Sitting up all by myself!', 'First tooth is here!', 'On the move: crawling everywhere!', 'Loves clapping and waving bye-bye.', 'Says “mama” and “dada”.', 'Pulling myself up to stand.', 'Loves splashing in the bath.', 'Exploring every cupboard.'];
      if (m <= 12) return ['Took my first steps!', 'Cruising along the furniture.', 'Loves books and turning pages.', 'Says my first words.', 'Happy first birthday to me!', 'Feeding myself (messily!).', 'Dancing to every song.', 'Waves hello to everyone.'];
      return ['Running everywhere!', 'Loves stacking blocks and knocking them down.', 'Learning new words every day.', 'Favorite word: “no”!', 'Big helper around the house.', 'Loves the park and the swings.', 'Can name all the animals in my book.', 'Climbing on everything.'];
    },
  },
  derive,
  templates: { ...LA_TEMPLATES, ...TEMPLATES },
  decor: { ...LA_DECOR, ...DECOR },
};
