/* Export helpers: html2canvas capture, print bleed, PDF page sizes. html2canvas and jsPDF are loaded as globals. */
export const BLEED_MM = 3;

export async function renderToCanvas(el, f, bg) {
  const scale = Math.min(3, Math.sqrt(16e6 / (f.w * f.h))); // stay under mobile canvas-size limits
  return window.html2canvas(el, {
    scale, useCORS: true, logging: false, backgroundColor: bg,
    width: f.w, height: f.h, windowWidth: Math.max(f.w, innerWidth),
    onclone: doc => { const s = doc.getElementById('card-scale'); if (s) s.style.transform = 'none'; },
  });
}

export const pageMM = (f, bleed) => { const [w, h] = f.mm, b = bleed ? BLEED_MM * 2 : 0; return [w + b, h + b]; };

export function addBleed(c, f, bg) {
  const b = Math.round(BLEED_MM * c.width / f.mm[0]);
  const o = document.createElement('canvas'); o.width = c.width + 2 * b; o.height = c.height + 2 * b;
  const x = o.getContext('2d'); x.fillStyle = bg; x.fillRect(0, 0, o.width, o.height); x.drawImage(c, b, b);
  return o;
}

export const newPDF = (pw, ph) => new window.jspdf.jsPDF({ orientation: pw > ph ? 'landscape' : 'portrait', unit: 'mm', format: [pw, ph] });

export function addPageToPDF(pdf, canvas, pw, ph, first) {
  if (!first) pdf.addPage([pw, ph], pw > ph ? 'landscape' : 'portrait');
  pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, pw, ph, undefined, 'FAST');
}

export function downloadBlob(blob, name) {
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: name });
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
