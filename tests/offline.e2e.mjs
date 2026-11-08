// Test hors ligne automatique (navigateur de bureau Chromium, via Playwright).
// Lancer : npm run build && npm run test:offline
//
// Déroulement :
//  1. copie dist/ dans un dossier temporaire et le sert sur http://localhost:<port>/testantidote/
//  2. première visite (en ligne) : attend que TOUT soit mis en cache par le service worker
//  3. ARRÊTE le serveur + met le navigateur hors ligne, ferme la page, la rouvre
//  4. ouvre chaque monographie dans les 2 langues, recherche, changement de langue, calculateur,
//     indicateur « hors ligne – contenu daté du … », pages Abréviations et Avis au lecteur
//  5. remet en ligne, publie une « nouvelle version » simulée, vérifie le bandeau
//     « Nouvelle version disponible – actualiser » et le rechargement sur la nouvelle version
// Écrit le résultat dans reports/offline-test-auto.json
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); } catch { playwright = require('/opt/node22/lib/node_modules/playwright'); }
const { chromium } = playwright;

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DIST = path.join(ROOT, 'dist');
if (!fs.existsSync(path.join(DIST, 'sw.js'))) { console.error('Lancer d\'abord : npm run build'); process.exit(1); }
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'antidotes-offline-'));
fs.cpSync(DIST, TMP, { recursive: true });
const data = JSON.parse(fs.readFileSync(path.join(TMP, 'data/content.json'), 'utf8'));
const PFX = data.cachePrefix || 'antidotes-';
// E2E_SUB=staging/ : teste la version de test, servie sous …/testantidote/staging/
const SUB = process.env.E2E_SUB || '';

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.svg': 'image/svg+xml' };
let requests = 0;
function startServer(port = 0) {
  return new Promise(resolve => {
    const srv = http.createServer((req, res) => {
      requests++;
      let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (!p.startsWith('/testantidote/' + SUB)) { res.writeHead(404); res.end(); return; }
      p = p.slice(('/testantidote/' + SUB).length - 1);
      if (p.endsWith('/')) p += 'index.html';
      const f = path.join(TMP, path.normalize(p));
      if (!f.startsWith(TMP) || !fs.existsSync(f)) { res.writeHead(404); res.end(); return; }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'max-age=600' });
      res.end(fs.readFileSync(f));
    });
    srv.listen(port, () => resolve(srv));
  });
}

const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok: !!ok, detail }); console.log(`${ok ? '✓' : '✗'} ${name}${detail ? ' – ' + detail : ''}`); };

let server = await startServer();
const port = server.address().port;
const BASE = `http://localhost:${port}/testantidote/${SUB}`;
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const errors = [];
let page = await context.newPage();
const watch = p => { p.on('pageerror', e => errors.push(e.message)); p.on('console', m => { if (m.type() === 'error') errors.push(m.text()); }); };
watch(page);

try {
  // --- 1re visite, en ligne ---
  await page.goto(BASE);
  await page.waitForSelector('#disclaimer[open]');
  check('Avis au lecteur affiché au premier lancement', await page.isVisible('#disclaimer'));
  await page.click('#disclaimer-ok');
  // attendre (par interrogations successives) que le service worker soit actif et le cache complet
  const nAssets = JSON.parse((fs.readFileSync(path.join(TMP, 'sw.js'), 'utf8').match(/const ASSETS = (\[[\s\S]*?\]);/) || [])[1]).length;
  for (let i = 0; i < 100; i++) {
    const ready = await page.evaluate(async ([v, n]) => {
      const reg = await navigator.serviceWorker.getRegistration();
      if (!reg?.active || !navigator.serviceWorker.controller) return false;
      if (!(await caches.keys()).includes(v)) return false;
      return (await (await caches.open(v)).keys()).length >= n;
    }, [PFX + data.version, nAssets]);
    if (ready) break;
    await page.waitForTimeout(200);
  }
  const swAssets = (fs.readFileSync(path.join(TMP, 'sw.js'), 'utf8').match(/const ASSETS = (\[[\s\S]*?\]);/) || [])[1];
  const assets = JSON.parse(swAssets);
  const cached = await page.evaluate(async name => (await (await caches.open(name)).keys()).map(r => r.url), PFX + data.version);
  const missing = assets.map(a => new URL(a, BASE).href).filter(u => !cached.includes(u));
  check(`Pré-cache complet au premier chargement (${assets.length} fichiers, sans avoir ouvert les pages)`, missing.length === 0, missing.join(', '));
  await page.goto(`${BASE}#/fr/tools`);
  await page.waitForFunction(() => /Disponible hors ligne/.test(document.querySelector('#app-info')?.textContent || ''), null, { timeout: 5000 })
    .then(() => check('Indication « Disponible hors ligne » (onglet Outils)', true))
    .catch(() => check('Indication « Disponible hors ligne » (onglet Outils)', false));

  // --- coupure réseau : serveur arrêté + navigateur hors ligne ---
  await new Promise(r => server.close(r));
  server.closeAllConnections?.();
  await context.setOffline(true);
  await page.close();
  page = await context.newPage();
  watch(page);
  const before = requests;
  await page.goto(BASE);
  await page.waitForSelector('#results a.row');
  check('Application rouverte sans réseau (serveur arrêté)', true);
  check('Aucune requête n\'atteint le serveur hors ligne', requests === before);
  check('Avis au lecteur non réaffiché après acceptation', !(await page.isVisible('#disclaimer')));
  const status = await page.textContent('#status');
  check('Indicateur « Hors ligne – contenu daté du … »', status.includes(`Hors ligne – contenu daté du ${data.contentDate}`), status.trim());

  // --- chaque monographie, dans les 2 langues ---
  for (const lang of ['fr', 'en']) {
    for (const id of data[lang].order) {
      const m = data[lang].monographs[id];
      await page.goto(`${BASE}#/${lang}/m/${id}`);
      await page.waitForFunction(t => document.querySelector('#mono-title')?.textContent === t, m.title, { timeout: 5000 }).catch(() => {});
      const title = await page.textContent('#mono-title');
      const count = await page.locator('details.sec').count();
      const expected = JSON.stringify(m.sections).match(/"level":/g).length;
      const nImg = (JSON.stringify(m.sections).match(/<img /g) || []).length;
      await page.click('#open-all');
      const txt = await page.textContent('#sections');
      const lastSec = m.sections[m.sections.length - 1];
      check(`[${lang}] ${m.title} : ouverte hors ligne, ${count} sections`, title === m.title && count === expected && txt.includes(lastSec.title),
        `${count}/${expected} sections, titre « ${title} »`);
    }
  }

  // --- barre d'onglets ---
  await page.goto(`${BASE}#/fr`);
  await page.waitForFunction(() => document.querySelector('#tabbar a')?.textContent === 'Antidotes' && document.documentElement.lang === 'fr');
  const tabs = await page.locator('#tabbar a').allTextContents();
  check('Barre du bas : Antidotes / Outils / Centres antipoison', tabs.join('|') === 'Antidotes|Outils|Centres antipoison', tabs.join(' | '));

  // --- recherche d'accueil : noms et synonymes (insensible aux accents) ---
  await page.goto(`${BASE}#/fr`);
  await page.fill('#q', 'fomepizole');
  await page.waitForFunction(() => document.querySelectorAll('#results a.row').length === 1);
  check('Accueil FR : « fomepizole » (sans accent) trouve « Fomépizole »', (await page.textContent('#results')).includes('Fomépizole'));
  await page.fill('#q', 'DIGOXINE');
  await page.waitForFunction(() => /digoxine/.test(document.querySelector('#results')?.textContent || '') && document.querySelectorAll('#results a.row').length === 1, null, { timeout: 5000 }).catch(() => {});
  check('Accueil FR : majuscules (« DIGOXINE »)', (await page.textContent('#results')).includes('Anticorps spécifique de la digoxine'));
  await page.fill('#q', 'hémodialyse');
  await page.waitForSelector('#results .empty');
  check('Accueil : recherche limitée aux noms et synonymes (texte non cherché)', true);
  await page.goto(`${BASE}#/en`);
  await page.fill('#q', 'antizol');
  await page.waitForFunction(() => document.querySelectorAll('#results a.row').length === 1);
  check('Accueil EN : par synonyme (« antizol » → Fomepizole)', (await page.textContent('#results')).includes('Fomepizole'));
  await page.click('#results a.row');
  await page.waitForFunction(() => document.querySelector('#mono-title')?.textContent === 'Fomepizole');

  // --- recherche dans la monographie ---
  await page.goto(`${BASE}#/fr/m/fomepizole`);
  await page.waitForFunction(() => document.querySelector('#mono-title')?.textContent === 'Fomépizole');
  await page.fill('#find', 'ACIDOSE METABOLIQUE');
  await page.waitForFunction(() => document.querySelectorAll('#sections mark').length > 0);
  const n = await page.locator('#sections mark').count();
  const c1 = await page.textContent('#find-count');
  await page.click('#find-next');
  const c2 = await page.textContent('#find-count');
  const visibleCurrent = await page.locator('#sections mark.current').isVisible();
  check('Recherche dans la page (sans accents) : surlignage, compteur, résultat suivant', n > 1 && c1.startsWith('1 /') && c2.startsWith('2 /') && visibleCurrent, `${n} surlignages, ${c1} → ${c2}`);
  await page.fill('#find', '');
  await page.waitForFunction(() => document.querySelectorAll('#sections mark').length === 0);
  check('Recherche dans la page : effacement', true);

  // --- bouton retour ---
  await page.click('.mono-tools .back');
  await page.waitForSelector('#q');
  check(`Bouton « Liste » : retour à la liste des antidotes (${data.fr.order.length})`, (await page.locator('#results a.row').count()) === data.fr.order.length);

  // --- centres antipoison ---
  for (const [lang, call] of [['fr', 'Appeler le centre'], ['en', 'Call centre']]) {
    await page.goto(`${BASE}#/${lang}/centres`);
    await page.waitForSelector('.centre');
    const nC = await page.locator('.centre').count();
    const tels = await page.locator('.centre a[href^="tel:"]').count();
    const first = await page.textContent('.centre a[href^="tel:"]');
    check(`Centres antipoison ${lang} hors ligne : ${nC} centres, ${tels} numéros`, nC === data[lang].pages.centres.sections.length && tels === nC && first.includes(call), first.trim());
  }

  // --- changement de langue en gardant l'antidote et la section ---
  await page.goto(`${BASE}#/fr/m/digoxin-specific-antibodies/4.2`);
  await page.waitForSelector('#mono-title');
  await page.click('#lang-btn');
  await page.waitForFunction(() => document.querySelector('#mono-title')?.textContent === 'Digoxin-Specific Antibodies');
  const h = await page.evaluate(() => location.hash);
  const open = await page.evaluate(() => document.querySelector('#s-4\\.2')?.open);
  check('Changement FR → EN : même antidote et même section ouverte', h.startsWith('#/en/m/digoxin-specific-antibodies/4') && open, h);

  // --- calculateur hors ligne ---
  await page.goto(`${BASE}#/fr/calc`);
  await page.fill('#weight', '65');
  await page.selectOption('#levelUnit', 'ng/mL');
  await page.fill('#level', '2,8');
  await page.waitForSelector('.result.ok .big');
  const big = await page.textContent('.result.ok .big');
  check('Calculateur hors ligne (exemple MDCalc : 2,8 ng/mL, 65 kg → 2 fioles)', big.trim() === '2 fioles', big);
  await page.fill('#level', '50');
  await page.waitForSelector('.result.err');
  check('Calculateur : saisie hors bornes → aucun résultat', (await page.locator('.result.ok').count()) === 0);
  await page.click('#lang-btn');
  await page.waitForSelector('#calc-out');
  check('Calculateur : valeurs conservées au changement de langue', (await page.inputValue('#weight')) === '65');

  // --- autres pages ---
  for (const [lang, name] of [['fr', 'abbreviations'], ['en', 'abbreviations'], ['fr', 'advice'], ['en', 'advice']]) {
    await page.goto(`${BASE}#/${lang}/p/${name}`);
    const t = await page.textContent('main h1');
    check(`Page ${lang}/${name} hors ligne`, t === data[lang].pages[name].title, t);
  }

  // --- retour en ligne + nouvelle version ---
  const swPath = path.join(TMP, 'sw.js');
  const newVersion = data.version + 'n';
  fs.writeFileSync(swPath, fs.readFileSync(swPath, 'utf8').replace(`const VERSION = '${data.version}'`, `const VERSION = '${newVersion}'`));
  const cj = JSON.parse(fs.readFileSync(path.join(TMP, 'data/content.json'), 'utf8'));
  cj.version = newVersion; cj.contentDate = '2099-01-01';
  fs.writeFileSync(path.join(TMP, 'data/content.json'), JSON.stringify(cj));
  server = await startServer(port);
  await context.setOffline(false);
  await page.goto(`${BASE}#/fr`);
  await page.evaluate(() => window.dispatchEvent(new Event('online')));
  await page.waitForSelector('#refresh-btn', { timeout: 20000 });
  const banner = await page.textContent('#status');
  check('Nouvelle version téléchargée en arrière-plan : bandeau affiché', banner.includes('Nouvelle version disponible – actualiser') && banner.includes('New version available – refresh'), banner.trim());
  await Promise.all([page.waitForNavigation(), page.click('#refresh-btn')]);
  await page.waitForSelector('#results a.row');
  const nowVersion = await page.evaluate(() => fetch('./data/content.json').then(r => r.json()).then(j => j.version));
  check('Après « Actualiser » : nouvelle version active', nowVersion === newVersion, nowVersion);

  check('Aucune erreur JavaScript', errors.length === 0, errors.join(' | '));
} catch (e) {
  check('Exécution du test', false, e.message);
} finally {
  await browser.close();
  server.close();
  fs.rmSync(TMP, { recursive: true, force: true });
}

const failed = results.filter(r => !r.ok);
fs.mkdirSync(path.join(ROOT, 'reports'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'reports/offline-test-auto.json'), JSON.stringify({
  date: new Date().toISOString(), browser: `Chromium ${browser.version()} (Playwright), bureau`, version: data.version,
  passed: results.length - failed.length, failed: failed.length, results }, null, 2) + '\n');
console.log(`\n${results.length - failed.length}/${results.length} vérifications réussies.`);
process.exit(failed.length ? 1 : 0);
