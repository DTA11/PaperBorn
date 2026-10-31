// Zero-dependency static site build: src/pages + src/partials + src/layout.html  ->  dist/
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { vendor, LIBS } from './vendor.mjs';

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
/* Last real change of a source file, from git (falls back to nothing, so the sitemap never claims every page changed today). */
const lastChange = file => {
  try { return execFileSync('git', ['log', '-1', '--format=%cs', '--', file], { cwd: ROOT, encoding: 'utf8' }).trim() || ''; } catch (_) { return ''; }
};
/* Structured data (JSON-LD) so search engines know what each page is. */
const ORG = () => ({ '@type': 'Organization', name: cfg.siteName, url: cfg.siteUrl + '/', logo: cfg.siteUrl + '/icon-512.png', email: cfg.contactEmail });
const SECTIONS = { guides: ['Guides', '/guides/'] };
function jsonLd(meta, urlPath, vars) {
  if (!urlPath || meta.noindex) return '';
  const url = cfg.siteUrl + urlPath, out = [];
  if (meta.schema === 'home') {
    out.push({ '@context': 'https://schema.org', '@type': 'WebSite', name: cfg.siteName, alternateName: 'babycardprintables.com', url: cfg.siteUrl + '/', description: vars.description, publisher: ORG() });
    out.push({ '@context': 'https://schema.org', ...ORG() });
  } else {
    const parts = urlPath.split('/').filter(Boolean), crumbs = [{ name: 'Home', item: cfg.siteUrl + '/' }];
    if (parts.length > 1 && SECTIONS[parts[0]]) crumbs.push({ name: SECTIONS[parts[0]][0], item: cfg.siteUrl + SECTIONS[parts[0]][1] });
    crumbs.push({ name: meta.h1 || meta.title || cfg.siteName, item: url });
    out.push({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.item })) });
  }
  if (meta.schema === 'app') out.push({ '@context': 'https://schema.org', '@type': 'WebApplication', name: meta.h1 || meta.title, url, description: vars.description,
    applicationCategory: meta.appCategory || 'DesignApplication', operatingSystem: 'Any (runs in the web browser)', browserRequirements: 'Requires JavaScript',
    isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, image: vars.ogImage, publisher: ORG() });
  if (meta.schema === 'article') out.push({ '@context': 'https://schema.org', '@type': 'Article', headline: meta.h1 || meta.title, description: vars.description, url,
    image: vars.ogImage, datePublished: meta.published, dateModified: meta.updated || meta.published, author: ORG(), publisher: ORG(), mainEntityOfPage: url });
  return out.map(o => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`).join('\n');
}

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

const FONTS_FULL = 'https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Cinzel:wght@400;700&family=Dancing+Script:wght@500;600;700&family=Fredoka:wght@400;600;700&family=Inter:wght@300;400;600;800&family=JetBrains+Mono:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&display=swap';

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
    fonts: '<link rel="stylesheet" href="/assets/css/fonts.css">',
    editorLibs: editor
      ? LIBS.map(l => `<script defer src="/assets/vendor/${l.out}"></script>`).join('\n') : '',   // only needed when downloading, so never block the first view
    moduleScript: editor ? `<script type="module" src="${meta.module}"></script>` : (meta.script ? `<script type="module" src="${meta.script}"></script>` : ''),
    analytics: cfg.analytics.plausibleDomain
      ? `<script defer data-domain="${cfg.analytics.plausibleDomain}" src="https://plausible.io/js/script.outbound-links.js"></script>\n<script>window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)}</script>` : '',
    adsScript: cfg.ads.enabled && cfg.ads.adsenseClient
      ? `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${cfg.ads.adsenseClient}" crossorigin="anonymous"></script>` : '',
    ogImage: cfg.siteUrl + (meta.ogImage || '/assets/img/og-default.png'),
  };
  vars.jsonld = jsonLd(meta, urlPath, vars);
  // page content first (it may use {{h1}} etc.), then wrap in the layout
  vars.content = expand(src, { ...vars, content: '' });
  const html = expand(layout, vars);

  const out = path.join(DIST, outRel);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  if (urlPath && !meta.noindex) sitemap.push([urlPath, lastChange(file)]);
}

copyDir(path.join(SRC, 'assets'), path.join(DIST, 'assets'));
if (process.env.SKIP_VENDOR) console.log('SKIP_VENDOR set: not downloading fonts/libraries (local testing only)');
else { const v = await vendor(DIST, { fontsUrl: FONTS_FULL }); console.log(`Self-hosted ${v.fonts} font files and ${v.libs} libraries`); }
for (const f of ['favicon.svg', 'favicon-32.png', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'site.webmanifest', 'googlebf3747b7a59ffb8d.html', 'ads.txt']) if (fs.existsSync(path.join(SRC, f))) fs.copyFileSync(path.join(SRC, f), path.join(DIST, f));

fs.writeFileSync(path.join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  sitemap.sort((a, b) => a[0].localeCompare(b[0])).map(([u, d]) => `  <url><loc>${cfg.siteUrl}${u}</loc>${d ? `<lastmod>${d}</lastmod>` : ''}</url>`).join('\n') + `\n</urlset>\n`);
fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${cfg.siteUrl}/sitemap.xml\n`);

console.log(`Built ${sitemap.length} pages -> dist/  (siteUrl: ${cfg.siteUrl})`);
