// npm run check — repère les erreurs de mise en forme AVANT de publier.
// Messages en français, pensés pour une personne qui n'est pas programmeuse.
import fs from 'node:fs';
import path from 'node:path';
import { CONTENT, LANGS, PAGES, ROOT, FOOTER_MARK, listMonographIds, loadMonograph, loadPage, md } from './content.mjs';

const errors = [];
const warnings = [];
const err = (file, line, msg) => errors.push(`✗ ${file}${line ? `, ligne ${line}` : ''} : ${msg}`);
const warn = (file, line, msg) => warnings.push(`! ${file}${line ? `, ligne ${line}` : ''} : ${msg}`);
const REQUIRED = ['id', 'title', 'source_url', 'last_revision'];

function lineChecks(file, raw) {
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  let inTable = false, tableCols = 0, tableStart = 0;
  lines.forEach((ln, i) => {
    const n = i + 1;
    if (/^#{1,6}[^#\s]/.test(ln)) err(file, n, `il manque une espace après les « # » du titre : « ${ln.slice(0, 40)} »`);
    if (/^#\s/.test(ln)) err(file, n, 'un titre « # » (un seul dièse) n\'est pas permis : utilisez « ## » pour une section, « ### » pour une sous-section');
    if (/^#{5,}\s/.test(ln)) warn(file, n, 'titre très profond (5 dièses ou plus)');
    // tableaux
    const isRow = /^\s*\|.*\|\s*$/.test(ln);
    if (isRow && !inTable) { inTable = true; tableStart = n; tableCols = ln.trim().slice(1, -1).split(/(?<!\\)\|/).length; }
    else if (isRow && inTable) {
      const cols = ln.trim().slice(1, -1).split(/(?<!\\)\|/).length;
      if (n === tableStart + 1 && !/^\s*\|(\s*:?-{3,}:?\s*\|)+\s*$/.test(ln))
        err(file, n, 'tableau : la 2e ligne doit être la ligne de séparation, par ex. « |---|---| »');
      if (cols !== tableCols) err(file, n, `tableau : ${cols} colonnes sur cette ligne, ${tableCols} dans l'en-tête (ligne ${tableStart})`);
    } else if (!isRow && inTable) {
      if (n - tableStart === 1) err(file, tableStart, 'tableau d\'une seule ligne (il manque la ligne de séparation « |---| »)');
      inTable = false;
      if (/\|/.test(ln) && ln.trim()) warn(file, n, 'ligne avec « | » juste après un tableau : début ou fin de ligne manquant ?');
    }
  });
}

function imageChecks(file, raw) {
  raw.replace(/\r\n/g, '\n').split('\n').forEach((ln, i) => {
    for (const m of ln.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) {
      const target = path.resolve(ROOT, path.dirname(file), m[1]);
      if (!fs.existsSync(target)) err(file, i + 1, `image introuvable : ${m[1]} (le fichier doit être dans content/images/)`);
    }
  });
}

function inlineChecks(file, sec) {
  const plain = sec.text;

  for (const tag of ['sup', 'sub', 'u', 'strong', 'em']) {
    const open = (sec.html.match(new RegExp(`<${tag}>`, 'g')) || []).length;
    const close = (sec.html.match(new RegExp(`</${tag}>`, 'g')) || []).length;
    if (open !== close) err(file, sec.line, `balise <${tag}> ouverte ${open} fois et fermée ${close} fois dans « ${sec.title} »`);
  }
}

function walk(secs, fn) { for (const s of secs) { fn(s); walk(s.children, fn); } }
function shape(secs) { return secs.map(s => `${s.level}(${shape(s.children)})`).join(','); }

// --- Monographies ---
const ids = {};
for (const lang of LANGS) {
  if (!fs.existsSync(path.join(CONTENT, lang))) { err(`content/${lang}`, 0, 'dossier manquant'); continue; }
  ids[lang] = listMonographIds(lang);
}
const all = [...new Set(Object.values(ids).flat())].sort();
const loaded = {};
for (const id of all) {
  loaded[id] = {};
  for (const lang of LANGS) {
    const f = `content/${lang}/${id}.md`;
    if (!ids[lang]?.includes(id)) { err(f, 0, `fichier manquant (il existe dans l'autre langue)`); continue; }
    let m;
    try { m = loadMonograph(lang, id); } catch (e) { err(f, 0, e.message); continue; }
    loaded[id][lang] = m;
    for (const k of REQUIRED) if (!m.meta[k]) err(f, 0, `en-tête : « ${k}: » manquant ou vide`);
    if (m.meta.id && m.meta.id !== id) err(f, 0, `en-tête : id « ${m.meta.id} » différent du nom du fichier « ${id} »`);
    if (m.meta.last_revision && !/^\d{4}-\d{2}-\d{2}$/.test(m.meta.last_revision))
      err(f, 0, `en-tête : last_revision « ${m.meta.last_revision} » doit être au format AAAA-MM-JJ (ex. 2026-10-23)`);
    else if (m.meta.last_revision && Number.isNaN(Date.parse(m.meta.last_revision))) err(f, 0, `date invalide « ${m.meta.last_revision} »`);
    if (!m.sections.length) err(f, 0, 'aucune section « ## » trouvée');
    if (m.beforeHtml.trim()) err(f, 0, 'du texte se trouve avant la première section « ## » : il ne sera pas affiché correctement');
    lineChecks(f, m.raw);
    imageChecks(f, m.raw);
    // « ** » visible dans le texte affiché alors que le fichier ne contient pas de « \*\* » (étoiles voulues)
    {
      const shown = []; walk(m.sections, x => shown.push(x.text));
      const literal = (shown.join('\n').match(/\*\*/g) || []).length;
      const escaped = (m.raw.match(/\\\*\\\*/g) || []).length;
      if (literal > escaped) err(f, 0, `« ** » affiché tel quel ${literal - escaped} fois : un gras n'est pas fermé (vérifiez que chaque gras a ses deux paires d'étoiles, sans espace à l'intérieur)`);
    }
    if ((m.raw.match(new RegExp(FOOTER_MARK.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length > 1)
      err(f, 0, 'la ligne du pied de page apparaît plusieurs fois');
    walk(m.sections, s => {
      if (s.level === 3 && s.parentLevel !== 2) err(f, s.line, `sous-section « ### ${s.title} » sans section « ## » au-dessus`);
      if (s.level > s.parentLevel + 1) err(f, s.line, `niveau de titre sauté avant « ${s.title} »`);
      if (!s.title.trim()) err(f, s.line, 'titre vide');
      if (!s.text.trim() && !s.children.length) err(f, s.line, `section vide : « ${s.title} »`);
      inlineChecks(f, s);
    });
  }
  const fr = loaded[id].fr, en = loaded[id].en;
  if (fr && en) {
    if (shape(fr.sections) !== shape(en.sections)) {
      const lf = []; walk(fr.sections, s => lf.push(`${s.id} ${s.title}`));
      const le = []; walk(en.sections, s => le.push(`${s.id} ${s.title}`));
      warn(`content/*/${id}.md`, 0, `les sections ne correspondent pas entre FR et EN (une section manque dans une langue ?) – le changement de langue ouvrira la monographie au début\n    FR : ${lf.join(' | ')}\n    EN : ${le.join(' | ')}`);
    }
    if (fr.meta.last_revision !== en.meta.last_revision)
      warn(`content/*/${id}.md`, 0, `dates de révision différentes : FR ${fr.meta.last_revision}, EN ${en.meta.last_revision}`);
  }
}

// --- Pages générales ---
for (const lang of LANGS) for (const name of PAGES) {
  const f = `content/${lang}/${name}.md`;
  if (!fs.existsSync(path.join(ROOT, f))) { err(f, 0, 'fichier manquant'); continue; }
  try {
    const p = loadPage(lang, name);
    if (!p.meta.title) err(f, 0, 'en-tête : « title: » manquant');
    if (!p.html.trim()) err(f, 0, 'page vide');
    lineChecks(f, p.raw);
  } catch (e) { err(f, 0, e.message); }
}

for (const w of warnings) console.log(w);
if (errors.length) {
  for (const e of errors) console.log(e);
  console.log(`\n${errors.length} erreur(s) à corriger avant de publier.`);
  process.exit(1);
}
console.log(`✓ Contenu vérifié : ${all.length} monographie(s) × ${LANGS.length} langues, ${PAGES.length} pages générales.` +
  (warnings.length ? ` ${warnings.length} avertissement(s) (non bloquant).` : ''));
