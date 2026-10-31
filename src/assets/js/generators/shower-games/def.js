/* Baby shower games: bingo (unique boards), predictions, advice cards. */
import { TEMPLATES, DECOR } from './templates.js';

const THEMES = {
  blossom:  { name: 'Blossom',  desc: 'Soft pink florals',   bg: '#fff5f7', fg: '#5a3a46', acc: '#e0668c', soft: '#ffe6ee', line: '#f1b2c6', font: 'playful', frame: '2px solid #f1b2c6' },
  confetti: { name: 'Confetti', desc: 'Bright party mix',    bg: '#ffffff', fg: '#2b2d42', acc: '#ef5350', soft: '#fff7d6', line: '#ffd166', font: 'playful', frame: '' },
  mono:     { name: 'Mono Line', desc: 'Ink-saving black & white', bg: '#ffffff', fg: '#111111', acc: '#111111', soft: '#ffffff', line: '#111111', font: 'sans', frame: '' },
  boho:     { name: 'Boho',     desc: 'Terracotta & sand',   bg: '#f6ecdd', fg: '#5b4331', acc: '#b9633f', soft: '#fbf4e8', line: '#c9a27c', font: 'serif', frame: '' },
  starry:   { name: 'Starry Night', desc: 'Navy with gold stars', bg: '#1b2347', fg: '#f8f2dc', acc: '#f5c76a', soft: '#27315e', line: '#7f8bc9', font: 'sans', frame: '' },
};

const GIFTS = ['Onesie', 'Baby bottles', 'Pacifier', 'Stroller', 'Diapers', 'Wipes', 'Blanket', 'Bibs', 'Rattle', 'Teddy bear', 'Baby monitor', 'Burp cloths', 'Socks', 'Sun hat', 'Mittens', 'Crib sheets', 'Bath tub', 'Hooded towel', 'Lotion', 'Picture books', 'Swaddle', 'Car seat toy', 'Play mat', 'Mobile', 'Night light', 'Diaper bag', 'Teether', 'Gift card'];
const PROMPTS = ['Baby’s name:', 'Birth date:', 'Birth time:', 'Weight:', 'Length:', 'Hair color:', 'Eye color:', 'Your name:'];

const lines = s => String(s || '').split('\n').map(x => x.trim()).filter(Boolean);

function derive(d) {
  const list = lines(d.items), n = list.length;
  return { ...d, list, promptList: lines(d.prompts), itemCount: d.game !== 'bingo' ? 'Not used for this game' : n >= 24 ? `${n} items (enough for unique boards)` : `${n} items: add ${24 - n} more` };
}

export default {
  slug: 'shower-games', pinTitle: 'Baby shower games',
  name: 'Baby Shower Games',
  fileName: () => 'baby-shower-game',
  themes: THEMES,
  defaultTheme: 'blossom',
  ui: { themeTitle: 'Party Theme' },
  formats: {
    a4:       { label: 'A4 (210×297 mm)',       w: 794, h: 1123, mm: [210, 297] },
    usletter: { label: 'US Letter (8.5×11 in)', w: 816, h: 1056, mm: [215.9, 279.4] },
    a5:       { label: 'A5 (148×210 mm)',       w: 559, h: 794,  mm: [148, 210] },
  },
  defaultFormat: 'a4',
  photo: false,
  pad: 40,
  ornaments: [['accents', 'Little decorations'], ['border', 'Border line'], ['crop', 'Cutting guides']],
  defaults: {
    toggles: { accents: true, border: false, crop: false },
    data: { game: 'bingo', title: '', honoree: 'for Emma & Jake', cardCount: '6', seed: '1', free: 'FREE', items: GIFTS.join('\n'), prompts: PROMPTS.join('\n'), perPage: '2', advicePrompt: 'My advice for the parents-to-be:' },
  },
  sections: [{
    title: 'Game',
    boxes: [
      { cols: 2, fields: [
        { key: 'game', type: 'select', label: 'Game', span: 2, options: [['bingo', 'Gift bingo (unique boards)'], ['predictions', 'Baby predictions'], ['advice', 'Advice cards']] },
        { key: 'title', type: 'text', label: 'Title (optional)', span: 2, ph: 'Baby Shower Bingo', maxlength: 40 },
        { key: 'honoree', type: 'text', label: 'Subtitle', span: 2, ph: 'for Emma & Jake', maxlength: 44 },
        { key: 'cardCount', type: 'number', label: 'Number of sheets', min: 1, max: 60, step: 1 },
        { key: 'perPage', type: 'select', label: 'Cards per sheet', options: [['1', '1'], ['2', '2'], ['4', '4']] } ] },
    ],
  }, {
    title: 'Bingo',
    boxes: [
      { fields: [
        { key: 'items', type: 'textarea', rows: 8, label: 'Bingo items (one per line, 24 or more)', max: 1500 },
        { key: 'itemCount', type: 'readout', label: 'Items entered' },
        { key: 'free', type: 'text', label: 'Center square text', ph: 'FREE', maxlength: 10 },
        { key: 'seed', type: 'number', label: 'Shuffle number (change it for different boards)', min: 1, max: 9999, step: 1 } ] },
    ],
  }, {
    title: 'Predictions &amp; advice',
    boxes: [
      { fields: [
        { key: 'prompts', type: 'textarea', rows: 6, label: 'Prediction lines (one per line)', max: 600 },
        { key: 'advicePrompt', type: 'text', label: 'Advice card prompt', maxlength: 50 } ] },
    ],
  }],
  pack: {
    title: 'All Designs in One PDF',
    desc: 'One PDF with the current game in every design you tick.',
    button: 'Download all designs (PDF)',
    options: Object.entries(THEMES).map(([id, th]) => [id, th.name]),
    apply(state, id) { state.theme = id; },
  },
  pageCount: (dv) => Math.max(1, Math.min(60, Math.round(+dv.cardCount) || 1)),
  derive,
  templates: TEMPLATES,
  decor: DECOR,
};
