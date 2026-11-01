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

/* Share row: the phone's own share sheet where there is one, and "Copy link" everywhere. */
(() => {
  const url = (document.querySelector('link[rel="canonical"]') || {}).href || location.href;
  const nat = document.querySelector('[data-share-native]');
  if (nat && navigator.share) {
    nat.hidden = false;
    nat.addEventListener('click', () => { navigator.share({ title: document.title, url }).catch(() => {}); });
  }
  const copy = document.querySelector('[data-copy-link]');
  if (copy) copy.addEventListener('click', () => {
    const label = copy.querySelector('span'), done = () => { label.textContent = 'Link copied'; setTimeout(() => { label.textContent = 'Copy link'; }, 1800); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, () => prompt('Copy this link:', url));
    else prompt('Copy this link:', url);
  });
})();

/* "Save" to Pinterest on the example pictures in guides: each picture is wrapped so the button can sit on it. */
(() => {
  const page = (document.querySelector('link[rel="canonical"]') || {}).href || location.href;
  Array.prototype.forEach.call(document.querySelectorAll('.seasonal-cards > a'), a => {
    const img = a.querySelector('img'); if (!img) return;
    const box = document.createElement('div'); box.className = 'pin-wrap';
    a.parentNode.insertBefore(box, a); box.appendChild(a);
    const pin = document.createElement('a');
    pin.className = 'pin-it'; pin.target = '_blank'; pin.rel = 'noopener'; pin.setAttribute('aria-label', 'Save this picture to Pinterest');
    pin.setAttribute('data-umami-event', 'pin_image');
    pin.href = 'https://www.pinterest.com/pin/create/button/?url=' + encodeURIComponent(page) + '&media=' + encodeURIComponent(img.src) + '&description=' + encodeURIComponent(img.alt || document.title);
    pin.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.3 2.5C6.9 2.5 4 6.2 4 9.4c0 1.9.7 3.6 2.3 4.2.3.1.5 0 .6-.3l.2-.9c.1-.3 0-.4-.2-.7-.5-.6-.8-1.3-.8-2.3 0-3 2.2-5.6 5.8-5.6 3.2 0 4.9 1.9 4.9 4.5 0 3.4-1.5 6.3-3.7 6.3-1.2 0-2.1-1-1.8-2.3.3-1.5 1-3.1 1-4.2 0-1-.5-1.8-1.6-1.8-1.3 0-2.3 1.3-2.3 3.1 0 1.1.4 1.9.4 1.9l-1.5 6.3c-.4 1.9-.1 4.2 0 4.4l.3.1c.1-.2 1.6-2 2.1-3.9l.9-3.3c.4.8 1.7 1.6 3 1.6 3.9 0 6.6-3.6 6.6-8.4 0-3.6-3.1-7-7.7-7z" fill="currentColor"/></svg>Save';
    box.appendChild(pin);
  });
})();
