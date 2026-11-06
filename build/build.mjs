// npm run build — produit le dossier dist/ (fichiers statiques à héberger n'importe où).
// 1. copie app/ (interface)  2. convertit content/<lang>/*.md → dist/data/content.json
// 3. génère dist/sw.js avec la liste complète des fichiers à mettre en cache hors ligne.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { ROOT, LANGS, PAGES, listMonographIds, loadMonograph, loadPage } from './content.mjs';

const APP = path.join(ROOT, 'app');
const DIST = path.join(ROOT, 'dist');

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(path.join(DIST, 'data'), { recursive: true });

// 1. interface
for (const entry of fs.readdirSync(APP, { recursive: true, withFileTypes: true })) {
  if (!entry.isFile()) continue;
  const rel = path.relative(APP, path.join(entry.parentPath ?? entry.path, entry.name));
  if (rel === 'sw.template.js' || rel.endsWith('.svg.src')) continue;
  const dest = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(path.join(APP, rel), dest);
}

// 2. contenu
const strip = secs => secs.map(s => ({ id: s.id, level: s.level, title: s.title, titleHtml: s.titleHtml,
  html: s.html, text: s.text, children: strip(s.children) }));
const data = { generated: new Date().toISOString() };
let contentDate = '';
for (const lang of LANGS) {
  const L = { monographs: {}, pages: {}, order: [] };
  for (const id of listMonographIds(lang)) {
    const m = loadMonograph(lang, id);
    L.monographs[id] = {
      id, title: m.meta.title, last_revision: m.meta.last_revision, last_revision_label: m.meta.last_revision_label || '',
      source_url: m.meta.source_url, retrieved: m.meta.retrieved || '', sections: strip(m.sections), footerHtml: m.footerHtml,
    };
    if ((m.meta.retrieved || '') > contentDate) contentDate = m.meta.retrieved;
  }
  L.order = Object.keys(L.monographs).sort((a, b) =>
    L.monographs[a].title.localeCompare(L.monographs[b].title, lang, { sensitivity: 'base' }));
  for (const name of PAGES) {
    const p = loadPage(lang, name);
    L.pages[name] = { title: p.meta.title, html: p.html, source_url: p.meta.source_url || '' };
    if (name === 'centres') L.pages[name].sections = strip(p.sections);
  }
  data[lang] = L;
}
// Date du contenu affichée hors ligne (« contenu daté du … ») : date de publication (construction).
// CONTENT_DATE=AAAA-MM-JJ permet de la fixer.
data.contentDate = process.env.CONTENT_DATE || new Date().toISOString().slice(0, 10);
data.retrieved = contentDate; // date du dernier téléchargement depuis le site officiel
const json = JSON.stringify(data);
const contentHash = crypto.createHash('sha256').update(json).digest('hex').slice(0, 12);

fs.writeFileSync(path.join(DIST, 'data', 'content.json'), json);

// 3. service worker : tous les fichiers de dist/ + la racine « ./ »
const files = [];
for (const entry of fs.readdirSync(DIST, { recursive: true, withFileTypes: true })) {
  if (!entry.isFile()) continue;
  files.push(path.relative(DIST, path.join(entry.parentPath ?? entry.path, entry.name)).split(path.sep).join('/'));
}
files.sort();
const hash = crypto.createHash('sha256');
for (const f of files) hash.update(f).update(fs.readFileSync(path.join(DIST, f)));
const version = hash.digest('hex').slice(0, 12);
// la version est aussi inscrite dans content.json (l'application vérifie que le cache est complet)
data.version = version;
data.contentHash = contentHash;
fs.writeFileSync(path.join(DIST, 'data', 'content.json'), JSON.stringify(data));
const assets = ['./', ...files.map(f => './' + f)];
const sw = fs.readFileSync(path.join(APP, 'sw.template.js'), 'utf8')
  .replace('__VERSION__', version)
  .replace('__ASSETS__', JSON.stringify(assets, null, 2));
fs.writeFileSync(path.join(DIST, 'sw.js'), sw);
fs.writeFileSync(path.join(DIST, '.nojekyll'), '');

const kb = files.reduce((n, f) => n + fs.statSync(path.join(DIST, f)).size, 0) / 1024;
console.log(`✓ dist/ construit – version ${version}, ${assets.length} fichiers mis en cache hors ligne (${kb.toFixed(0)} Ko), contenu daté du ${data.contentDate}`);
