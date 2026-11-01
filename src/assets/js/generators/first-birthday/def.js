/* First birthday maker: party invitation, "one year" poster and thank-you card (also for birthdays 2 to 5). */
import { THEMES, TEMPLATES, DECOR } from './templates.js';
import { ANIMALS, ANIMAL_ORDER } from '../../core/animals.js';
import { NUM_STYLES } from '../../core/numbers.js';

const AGES = { 1: ['one', 'First', '1st'], 2: ['two', 'Second', '2nd'], 3: ['three', 'Third', '3rd'], 4: ['four', 'Fourth', '4th'], 5: ['five', 'Fifth', '5th'] };

function fmtDate(iso, weekday) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  if (!m) return '';
  return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]))
    .toLocaleDateString('en-GB', { ...(weekday ? { weekday: 'long' } : {}), day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}
function rsvpBy(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  if (!m) return '';
  return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3] - 14)).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', timeZone: 'UTC' });
}
const grams = v => { const g = parseFloat(v); return g > 0 ? `${Math.round(g)} g` : ''; };
const cm = v => { const c = parseFloat(v); return c > 0 ? `${+c.toFixed(1)} cm` : ''; };

function derive(d) {
  const a = AGES[d.age] ? String(d.age) : '1', [word, ord, short] = AGES[a];
  return { ...d, ageNum: a, ageWord: word, ordWord: ord, ordShort: short,
    partyDate: fmtDate(d.partyDate, true), rsvpBy: rsvpBy(d.partyDate), born: d.birthDate ? `Born ${fmtDate(d.birthDate)}` : '',
    birthW: grams(d.birthW), birthL: cm(d.birthL), nowW: grams(d.nowW), nowL: cm(d.nowL) };
}

export default {
  slug: 'first-birthday', pinTitle: 'First birthday printables',
  name: 'First Birthday',
  fileName: d => `${d.firstName || 'first'}-birthday-${d.card || 'invite'}`,
  themes: THEMES,
  defaultTheme: 'animals',
  aliases: { animals_pink: ['animals', 'pink'], animals_blue: ['animals', 'blue'], animals_sage: ['animals', 'sage'] },
  ui: { themeTitle: 'Design' },
  formats: {
    a5:       { label: 'A5 (148×210 mm)',          w: 559, h: 794,  mm: [148, 210],     photoH: 300 },
    p5x7:     { label: '5×7 in invitation',        w: 480, h: 672,  mm: [127, 177.8],   photoH: 260 },
    a4:       { label: 'A4 poster (210×297 mm)',   w: 794, h: 1123, mm: [210, 297],     photoH: 420 },
    usletter: { label: 'US Letter (8.5×11 in)',    w: 816, h: 1056, mm: [215.9, 279.4], photoH: 400 },
    square:   { label: 'Square (210×210 mm)',      w: 800, h: 800,  mm: [210, 210],     photoH: 300 },
  },
  defaultFormat: 'a5',
  photo: true,
  defaults: {
    toggles: { photo: false, stats: true, facts: true, border: false },
    data: { card: 'invite', age: '1', numStyle: 'auto', animal: 'elephant', partyDate: '2026-03-14', birthDate: '2025-03-10' },
    sample: { firstName: 'Mila', inviteTop: 'Please join us to celebrate', partyTime: '3 – 6 pm', place: 'Our home', address: '12 Garden Street, Your City',
      rsvp: 'RSVP to Emma by 1 March', birthW: '3450', birthL: '51', nowW: '9800', nowL: '75', firstWord: 'Mama', food: 'Banana', toy: 'Little bunny',
      song: 'Twinkle Twinkle', teeth: '6', cando: 'Clap, wave and walk', message: 'Thank you for celebrating with us and for the lovely gift!', from: 'Emma & Mark' },
  },
  sections: [{
    title: 'Card',
    boxes: [
      { fields: [{ type: 'note', text: 'Grey text is only an example and stays on the card until you type your own. Clear a line to leave it off.' }] },
      { cols: 2, fields: [
        { key: 'card', type: 'select', label: 'What are you making?', span: 2, options: [['invite', 'Party invitation'], ['poster', 'One year poster (then and now)'], ['thanks', 'Thank-you card']] },
        { key: 'firstName', type: 'text', label: 'Child’s first name', maxlength: 24 },
        { key: 'age', type: 'select', label: 'Turning', options: Object.entries(AGES).map(([k, v]) => [k, `${k} (${v[1].toLowerCase()} birthday)`]) } ] },
      { fields: [{ key: 'animal', type: 'select', label: 'Animal (Party Animals designs)', options: ANIMAL_ORDER.map(k => [k, ANIMALS[k].name]) }] },
      { fields: [{ key: 'numStyle', type: 'select', label: 'Number style', options: NUM_STYLES }] },
    ],
  }, {
    title: 'Invitation',
    boxes: [
      { cols: 2, fields: [
        { key: 'inviteTop', type: 'text', label: 'Top line', span: 2, maxlength: 40 },
        { key: 'partyDate', type: 'date', label: 'Party date' },
        { key: 'partyTime', type: 'text', label: 'Time', maxlength: 24 },
        { key: 'place', type: 'text', label: 'Place', span: 2, maxlength: 44 },
        { key: 'address', type: 'text', label: 'Address', span: 2, maxlength: 60 },
        { key: 'rsvp', type: 'text', label: 'RSVP line', span: 2, maxlength: 56 } ] },
    ],
  }, {
    title: 'One year poster',
    boxes: [
      { fields: [{ key: 'birthDate', type: 'date', label: 'Date of birth', min: '2000-01-01' }] },
      { toggles: [['stats', 'Then and now']], cols: 2, fields: [
        { key: 'birthW', type: 'number', label: 'Weight at birth (g)', min: 300, max: 7000, step: 1 },
        { key: 'birthL', type: 'number', label: 'Length at birth (cm)', min: 20, max: 70, step: .5 },
        { key: 'nowW', type: 'number', label: 'Weight now (g)', min: 3000, max: 30000, step: 1 },
        { key: 'nowL', type: 'number', label: 'Height now (cm)', min: 40, max: 130, step: .5 } ] },
      { toggles: [['facts', 'Favorites and firsts']], cols: 2, fields: [
        { key: 'firstWord', type: 'text', label: 'First word', maxlength: 24 },
        { key: 'food', type: 'text', label: 'Favorite food', maxlength: 24 },
        { key: 'toy', type: 'text', label: 'Favorite toy', maxlength: 24 },
        { key: 'song', type: 'text', label: 'Favorite song', maxlength: 28 },
        { key: 'teeth', type: 'text', label: 'Teeth', maxlength: 10 },
        { key: 'cando', type: 'text', label: 'I can…', maxlength: 32 } ] },
    ],
  }, {
    title: 'Thank-you card',
    boxes: [
      { fields: [
        { key: 'message', type: 'textarea', rows: 3, label: 'Message', max: 160 },
        { key: 'from', type: 'text', label: 'From', ph: 'Emma & Mark', maxlength: 32 } ] },
    ],
  }],
  pack: {
    title: 'All Designs in One PDF',
    desc: 'One PDF with the current card in every design you tick.',
    button: 'Download all designs (PDF)',
    options: Object.entries(THEMES).map(([id, th]) => [id, th.name]),
    apply(state, id) { const th = THEMES[id]; state.theme = id; state.fontMode = th.font; },
  },
  /* "Give me an idea" wording. {rsvpBy} is two weeks before the party. */
  ideas: {
    inviteTop: () => ['Please join us to celebrate', 'You are invited to', 'Come and celebrate', 'Help us celebrate', 'Join the fun for',
      'Let’s party for', 'Grab a cupcake and celebrate', 'Come party with us for', 'Join us for a little party for', 'Save the date for'],
    rsvp: () => ['RSVP to {from} by {rsvpBy}', 'Please let us know by {rsvpBy}', 'RSVP by {rsvpBy} · No gifts, please', 'RSVP by {rsvpBy} · Your presence is our present',
      'Kindly reply by {rsvpBy}', 'RSVP to {from} · Little ones welcome', 'Let us know if you can come by {rsvpBy}'],
    message: () => ['Thank you for celebrating with us and for the lovely gift!', 'Thank you for making {firstName}’s birthday so special. We loved having you there!',
      'Thank you for the beautiful gift and for being part of our little one’s first year.', 'Your gift made {firstName} smile. Thank you for celebrating with us!',
      'Thank you for coming! {firstName} had the best day.', 'We are so grateful for you. Thank you for the lovely present and all the love.',
      'Thank you for helping us celebrate one amazing year!', 'Big thanks for the party fun and the thoughtful gift!',
      'Thank you for being part of {firstName}’s story. We hope to see you again soon.'],
  },
  /* Folded card for the invitation and the thank-you card (not the poster) */
  fold: {
    on: dv => dv.card !== 'poster',
    inside(dv) {
      const from = String(dv.from || '').trim();
      if (dv.card === 'thanks') return { heading: 'Thank you!', text: '', sign: from ? `Love, ${from}` : '' };
      return { heading: 'We can’t wait to celebrate with you!', text: [dv.rsvp].filter(Boolean).join('\n'), sign: from ? `Love, ${from}` : '' };
    },
  },
  derive,
  templates: TEMPLATES,
  decor: DECOR,
};
