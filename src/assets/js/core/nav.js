/* Runs on every page. Phone menu niceties: close the dropdown on outside tap, Escape, or when a link is chosen.
   Also the older-Safari fixes: flex gap spacing, and a class for editor pages (instead of CSS :has). */
import { fixGap } from './compat.js';
fixGap(document.body);
if (document.getElementById('editor')) document.body.classList.add('editor-page');
const d = document.getElementById('nav-menu');
if (d) {
  document.addEventListener('click', e => { if (d.open && !d.contains(e.target)) d.open = false; });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && d.open) { d.open = false; d.querySelector('summary').focus(); } });
  d.addEventListener('click', e => { if (e.target.closest('nav a')) d.open = false; });
}
