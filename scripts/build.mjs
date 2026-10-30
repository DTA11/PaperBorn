// Zero-dependency static site build: src/pages + src/partials + src/layout.html  ->  dist/
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'site.config.json'), 'utf8'));
if (process.env.SITE_URL) cfg.siteUrl = process.env.SITE_URL;
cfg.siteUrl = cfg.siteUrl.replace(/\/+$/, '');

const read = p => fs.readFileSync(p, 'utf8');
const layout = read(path.join(SRC, 'layout.html'));
const partial = n => read(path.join(SRC, 'partials', n + '.html'));
const today = new Date().toISOString().slice(0, 10);

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(d =>
    d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]);
}
function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const f of walk(from)) {
    const out = path.join(to, path.relative(from, f));
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.copyFileSync(f, out);
  }
}

const adHTML = name => {
  const slot = cfg.ads.slots[name] || '';
  return `<aside class="ad-slot ad-${name}" aria-label="Advertisement"><span class="ad-label">Advertisement</span>` +
    `<ins class="adsbygoogle" style="display:block" data-ad-client="${cfg.ads.adsenseClient}" data-ad-slot="${slot}" data-ad-format="auto" data-full-width-responsive="false"></ins></aside>`;
};

function expand(html, vars) {
  let out = html;
  for (let i = 0; i < 5; i++) {                      // partials may include partials
    out = out.replace(/\{\{>\s*([\w-]+)\s*\}\}/g, (_, n) => partial(n));
  }
  out = out.replace(/\{\{ad\s+([\w-]+)\s*\}\}/g, (_, n) => cfg.ads.enabled ? adHTML(n) : '');
  out = out.replace(/\{\{(\w+)\}\}/g, (m, k) => {
    if (!(k in vars)) throw new Error(`Unknown token ${m}`);
    return vars[k];
  });
  return out;
}

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

const FONTS_FULL = 'https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Cinzel:wght@400;700&family=Fredoka:wght@400;600;700&family=Inter:wght@300;400;600;800&family=JetBrains+Mono:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&display=swap';
const FONTS_BASE = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap';

const pagesDir = path.join(SRC, 'pages');
const sitemap = [];

for (const file of walk(pagesDir)) {
  let src = read(file);
  let meta = {};
  const m = src.match(/^\s*<!--meta\s*([\s\S]*?)-->/);
  if (m) { meta = JSON.parse(m[1]); src = src.slice(m[0].length); }

  const rel = path.relative(pagesDir, file).replace(/\\/g, '/');          // e.g. generators/baby-stats/index.html
  let outRel, urlPath;
  if (rel === '404.html') { outRel = '404.html'; urlPath = null; }
  else if (rel.endsWith('/index.html') || rel === 'index.html') { outRel = rel; urlPath = '/' + rel.replace(/index\.html$/, ''); }
  else { const base = rel.replace(/\.html$/, ''); outRel = base + '/index.html'; urlPath = '/' + base + '/'; }

  const editor = !!meta.module;
  const vars = {
    siteName: cfg.siteName, tagline: cfg.tagline, siteUrl: cfg.siteUrl, contactEmail: cfg.contactEmail,
    year: String(new Date().getFullYear()),
    title: meta.title || cfg.siteName,
    fullTitle: meta.fullTitle || (meta.title ? `${meta.title} | ${cfg.siteName}` : `${cfg.siteName} - ${cfg.tagline}`),
    description: meta.description || cfg.tagline,
    canonical: urlPath ? cfg.siteUrl + urlPath : cfg.siteUrl + '/',
    robotsMeta: meta.noindex || !urlPath ? '<meta name="robots" content="noindex">' : '',
    h1: meta.h1 || meta.title || '',
    lead: meta.lead || '',
    fonts: `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="${editor ? FONTS_FULL : FONTS_BASE}" rel="stylesheet">`,
    editorLibs: editor
      ? '<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>\n<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>' : '',
    moduleScript: editor ? `<script type="module" src="${meta.module}"></script>` : '',
    analytics: cfg.analytics.plausibleDomain
      ? `<script defer data-domain="${cfg.analytics.plausibleDomain}" src="https://plausible.io/js/script.outbound-links.js"></script>\n<script>window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)}</script>` : '',
    adsScript: cfg.ads.enabled && cfg.ads.adsenseClient
      ? `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${cfg.ads.adsenseClient}" crossorigin="anonymous"></script>` : '',
    ogImage: cfg.siteUrl + (meta.ogImage || '/assets/img/og-default.svg'),
  };
  // page content first (it may use {{h1}} etc.), then wrap in the layout
  vars.content = expand(src, { ...vars, content: '' });
  const html = expand(layout, vars);

  const out = path.join(DIST, outRel);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  if (urlPath && !meta.noindex) sitemap.push(urlPath);
}

copyDir(path.join(SRC, 'assets'), path.join(DIST, 'assets'));
for (const f of ['favicon.svg']) if (fs.existsSync(path.join(SRC, f))) fs.copyFileSync(path.join(SRC, f), path.join(DIST, f));

fs.writeFileSync(path.join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  sitemap.sort().map(u => `  <url><loc>${cfg.siteUrl}${u}</loc><lastmod>${today}</lastmod></url>`).join('\n') + `\n</urlset>\n`);
fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${cfg.siteUrl}/sitemap.xml\n`);

console.log(`Built ${sitemap.length} pages -> dist/  (siteUrl: ${cfg.siteUrl})`);
