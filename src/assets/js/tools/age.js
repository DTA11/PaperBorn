// Baby age and due-date calculator. Runs entirely in the browser; nothing is stored or sent.
const $ = id => document.getElementById(id);
const DAY = 86400000;
const parse = v => { const [y, m, d] = v.split('-').map(Number); return new Date(y, m - 1, d); };
const fmt = d => d.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

function months(from, to) {
  let m = (to.getFullYear() - from.getFullYear()) * 12 + to.getMonth() - from.getMonth();
  let a = new Date(from.getFullYear(), from.getMonth() + m, from.getDate());
  if (a > to) { m--; a = new Date(from.getFullYear(), from.getMonth() + m, from.getDate()); }
  return { m, d: Math.round((to - a) / DAY) };
}

function age() {
  const b = $('birth').value; if (!b) { $('age-out').textContent = ''; return; }
  const from = parse(b), now = new Date(); const to = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (to < from) { $('age-out').textContent = 'That date is in the future.'; return; }
  const days = Math.round((to - from) / DAY), { m, d } = months(from, to), w = Math.floor(days / 7);
  $('age-out').innerHTML = `<strong>${m} month${m === 1 ? '' : 's'}${d ? ` and ${d} day${d === 1 ? '' : 's'}` : ''}</strong><br><span class="text-zinc-400">${w} week${w === 1 ? '' : 's'} (${days} days) old</span><br><span class="text-zinc-400">Next monthly milestone card: month ${m + 1}</span>`;
}

function due() {
  const v = $('lmp').value; if (!v) { $('due-out').textContent = ''; return; }
  const lmp = parse(v), due = new Date(lmp.getTime() + 280 * DAY), now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()), left = Math.round((due - today) / DAY);
  const gest = Math.round((today - lmp) / DAY), gw = Math.floor(gest / 7), gd = gest % 7;
  $('due-out').innerHTML = `<strong>Estimated due date: ${fmt(due)}</strong><br><span class="text-zinc-400">${gest >= 0 && gest <= 300 ? `Now ${gw} weeks ${gd} days pregnant. ` : ''}${left >= 0 ? `${left} days to go.` : `${-left} days past the estimate.`}</span><br><span class="text-zinc-500 text-xs">An estimate based on a 280-day pregnancy. Only your midwife or doctor can confirm a date.</span>`;
}

$('birth').addEventListener('input', age);
$('lmp').addEventListener('input', due);
age(); due();
