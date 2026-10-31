/* Phone menu niceties: close the dropdown on outside tap, Escape, or when a link is chosen. */
const d = document.getElementById('nav-menu');
if (d) {
  document.addEventListener('click', e => { if (d.open && !d.contains(e.target)) d.open = false; });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && d.open) { d.open = false; d.querySelector('summary').focus(); } });
  d.addEventListener('click', e => { if (e.target.closest('nav a')) d.open = false; });
}
