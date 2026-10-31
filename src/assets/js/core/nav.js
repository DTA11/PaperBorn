/* Runs on every page. Phone menu niceties: close the dropdown on outside tap, Escape, or when a link is chosen.
   Also the older-Safari fixes: flex gap spacing, and a class for editor pages (instead of CSS :has). */
import { fixGap } from './compat.js';
fixGap(document.body);
if (document.getElementById('editor')) document.body.classList.add('editor-page');
/* Seasonal links (data-season="xmas") show from 25 October to 6 January, then hide again by themselves. */
(() => {
  const now = new Date(), m = now.getMonth(), d = now.getDate();
  const xmas = (m === 9 && d >= 25) || m === 10 || m === 11 || (m === 0 && d <= 6) || /[?&]season=xmas\b/.test(location.search);
  if (xmas) Array.prototype.forEach.call(document.querySelectorAll('[data-season="xmas"]'), el => el.classList.add('season-on'));
})();
const d = document.getElementById('nav-menu');
if (d) {
  document.addEventListener('click', e => { if (d.open && !d.contains(e.target)) d.open = false; });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && d.open) { d.open = false; d.querySelector('summary').focus(); } });
  d.addEventListener('click', e => { if (e.target.closest('nav a')) d.open = false; });
}
