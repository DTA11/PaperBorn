"""Makes the 1200x630 share pictures in src/assets/img/og/ (shown by Pinterest, Facebook, WhatsApp, Google Discover).
Dev-only helper, not part of the site build. Needs Python Playwright with Chromium and the site running locally:
  SKIP_VENDOR=1 node scripts/build.mjs && python3 -m http.server 8081 --directory dist
  python3 scripts/make-og-images.py [http://localhost:8081]
For the fonts to match, copy Fredoka and Dancing Script into dist/assets/fonts first (the normal build downloads them)."""
import base64, os, sys
from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:8081'
OUT = os.path.join(os.path.dirname(__file__), '..', 'src', 'assets', 'img', 'og')

# page -> (headline, sub line, background, text colour, [(generator, design, extra JS before the shot)])
PICS = {
    'home': ('Free printable baby cards', 'Birth cards · milestone cards · flashcards · shower games', '#f6efe6', '#3b2f52',
             [('baby-stats', 'animals', ''), ('milestones', 'animals', "document.querySelector('[data-color=pink]').click()"), ('shower-games', 'blossom', '')]),
    'baby-stats': ('Baby stats card maker', '20 designs in many colors · free PDF & PNG', '#f4eee6', '#3b3552',
                   [('baby-stats', 'scandi', ''), ('baby-stats', 'stork', "document.querySelector('[data-color=pink]').click()"), ('baby-stats', 'clothesline', '')]),
    'milestones': ('Monthly milestone cards', 'Newborn to 3 years · cute animals · free printable', '#f6f0e8', '#3e4a63',
                   [('milestones', 'animals', "sel('#f-milestone','1');document.querySelector('[data-color=blue]').click()"), ('milestones', 'animals', "sel('#f-milestone','3');document.querySelector('[data-color=pink]').click()"), ('milestones', 'animals', "sel('#f-milestone','6');document.querySelector('[data-color=sage]').click()")]),
    'flashcards': ('High-contrast baby flashcards', 'Black & white and red · free printable PDF', '#f1f1f1', '#111111',
                   [('flashcards', 'bw', ''), ('flashcards', 'rw', '')]),
    'shower-games': ('Baby shower games', 'Bingo with unique boards · predictions · advice cards', '#f7eef0', '#5a3b4b',
                     [('shower-games', 'blossom', ''), ('shower-games', 'blossom', "sel('#f-game','predictions')")]),
    'first-birthday': ('First birthday invitations', 'Invitations · one year poster · thank-you cards · free', '#fbf1ec', '#5b3d4a',
                       [('first-birthday', 'animals', ''), ('first-birthday', 'cake', "sel('#f-card','poster')"), ('first-birthday', 'balloons', "sel('#f-card','thanks')")]),
    'christmas': ("Baby's first Christmas cards", 'Christmas & New Year · free printable', '#7a1424', '#fbefdc',
                  [('baby-stats', 'xmas_animals', "sel('#f-greeting','first')"), ('baby-stats', 'xmas_red', "sel('#f-greeting','merry')"), ('baby-stats', 'newyear', "sel('#f-greeting','newyear')")]),
}

HELP = "window.sel=(q,v)=>{const e=document.querySelector(q); if(e){e.value=v; e.dispatchEvent(new Event('input',{bubbles:true}));}};"

def card_png(pg, gen, design, js):
    pg.goto(f'{BASE}/generators/{gen}/'); pg.evaluate('localStorage.clear()'); pg.reload(); pg.wait_for_timeout(1200)
    pg.evaluate(HELP)
    if pg.locator('[data-t="photo"]').count(): pg.locator('[data-t="photo"]').first.uncheck()
    pg.evaluate(f"window.__paperborn.setTheme('{design}')")
    if js: pg.evaluate(js)
    pg.wait_for_timeout(700)
    pg.evaluate("(()=>{const s=document.getElementById('card-scale');s.style.transform='none'})()"); pg.wait_for_timeout(200)
    return base64.b64encode(pg.locator('#card-target').screenshot()).decode()

with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME') or None, args=['--no-sandbox'])
    pg = b.new_page(viewport={'width': 1600, 'height': 1400})
    for name, (head, sub, bg, ink, cards) in PICS.items():
        shots = [card_png(pg, *c) for c in cards]
        n = len(shots)
        imgs = ''.join(f'<img src="data:image/png;base64,{s}" style="position:absolute;height:{470 - 24 * (n - 1 - i) if n > 2 else 500}px;'
                       f'left:{545 + i * (172 if n > 2 else 260)}px;top:{75 + (n - 1 - i) * 14 if n > 2 else 65}px;transform:rotate({(i - (n - 1) / 2) * 5}deg);'
                       f'box-shadow:0 18px 40px rgba(0,0,0,.28);border-radius:6px">' for i, s in enumerate(shots))
        html = f"""<div id="og" style="position:relative;width:1200px;height:630px;overflow:hidden;background:{bg};font-family:'Fredoka',system-ui,sans-serif">
          <div style="position:absolute;left:64px;top:0;bottom:0;width:470px;display:flex;flex-direction:column;justify-content:center;color:{ink}">
            <div style="font-size:20px;letter-spacing:.32em;text-transform:uppercase;opacity:.75">Free printable</div>
            <div style="font-family:'Dancing Script',cursive;font-weight:700;font-size:74px;line-height:1.02;margin-top:10px">{head}</div>
            <div style="font-size:24px;line-height:1.35;margin-top:18px;opacity:.85">{sub}</div>
            <div style="margin-top:34px;font-size:22px;font-weight:600;letter-spacing:.04em">babycardprintables.com</div>
          </div>{imgs}</div>"""
        pg.goto(f'{BASE}/'); pg.wait_for_timeout(400)   # a site page, so the self-hosted fonts are available
        pg.evaluate("h => { document.body.innerHTML = h; document.body.style.margin = '0'; document.body.style.background = '#fff'; scrollTo(0, 0); }", html); pg.wait_for_timeout(700)
        path = os.path.join(OUT, f'{name}.jpg'); os.makedirs(OUT, exist_ok=True)
        pg.locator('#og').screenshot(path=path, type='jpeg', quality=84)
        print('wrote', path)
    b.close()
