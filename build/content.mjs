// Lecture des fichiers de contenu (content/<lang>/*.md).
// Partagé par build.mjs (construction) et check.mjs (vérification avant publication).
import fs from 'node:fs';
import path from 'node:path';
import MarkdownIt from 'markdown-it';

export const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
export const CONTENT = path.join(ROOT, 'content');
export const LANGS = ['fr', 'en'];
export const PAGES = ['advice', 'abbreviations', 'about', 'centres'];
export const FOOTER_MARK = '<!-- pied de page / footer -->';

// Même configuration que scripts/verify.py : CommonMark + tableaux + HTML simple.
export const md = new MarkdownIt('commonmark', { html: true }).enable('table');

/** En-tête « clé: valeur » entre deux lignes « --- ». */
export function parseFrontmatter(text, file) {
  text = text.replace(/^﻿/, '').replace(/\r\n/g, '\n');
  const lines = text.split('\n');
  if (lines[0].trim() !== '---') throw new Error(`${file} : la première ligne doit être « --- »`);
  const meta = {};
  for (let i = 1; i < lines.length; i++) {
    const s = lines[i];
    if (s.trim() === '---') return { meta, body: lines.slice(i + 1).join('\n'), bodyLine: i + 2 };
    if (!s.trim()) continue;
    const m = /^([a-z_]+):[ ]?(.*)$/.exec(s);
    if (!m) throw new Error(`${file}, ligne ${i + 1} : en-tête mal formé « ${s} » (attendu « clé: valeur »)`);
    meta[m[1]] = m[2].trim();
  }
  throw new Error(`${file} : en-tête non fermé (il manque la deuxième ligne « --- »)`);
}

function textOf(html) {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|li|h[1-6]|tr|td|th)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/[ \t\r\f]+/g, ' ')
    .replace(/\n\s*\n+/g, '\n')
    .trim();
}

/**
 * Découpe un corps Markdown en arbre de sections (## puis ### puis ####).
 * Chaque section : { id, level, title, titleHtml, html (contenu propre), text, children, line }
 */
export function parseSections(body, bodyLine = 1) {
  const env = {};
  const tokens = md.parse(body, env);
  const root = { level: 1, children: [], tokens: [] };
  const stack = [root];
  const before = []; // contenu avant le premier titre
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.type === 'heading_open') {
      const level = Number(t.tag.slice(1));
      const inline = tokens[i + 1];
      while (stack.length > 1 && stack[stack.length - 1].level >= level) stack.pop();
      const parent = stack[stack.length - 1];
      const sec = {
        level,
        titleHtml: md.renderer.render([inline], md.options, env),
        title: textOf(md.renderer.render([inline], md.options, env)),
        tokens: [],
        children: [],
        line: t.map ? t.map[0] + bodyLine : null,
        parentLevel: parent.level,
      };
      parent.children.push(sec);
      stack.push(sec);
      i += 2; // heading_open, inline, heading_close
      continue;
    }
    const cur = stack[stack.length - 1];
    (cur === root ? before : cur.tokens).push(t);
  }
  const finish = (secs, prefix) => secs.map((s, n) => {
    const id = prefix ? `${prefix}.${n + 1}` : `${n + 1}`;
    const html = md.renderer.render(s.tokens, md.options, env);
    const out = { id, level: s.level, title: s.title, titleHtml: s.titleHtml, html, text: textOf(html),
      line: s.line, parentLevel: s.parentLevel, children: finish(s.children, id) };
    return out;
  });
  return { sections: finish(root.children, ''), beforeHtml: md.renderer.render(before, md.options, env) };
}

/** HTML complet tel qu'affiché par l'application (utilisé par scripts/verify.py). */
export function composeHtml(sections) {
  return sections.map(s => `<h${s.level}>${s.titleHtml}</h${s.level}>${s.html}${composeHtml(s.children)}`).join('');
}

export function listMonographIds(lang) {
  const dir = path.join(CONTENT, lang);
  return fs.readdirSync(dir).filter(f => f.endsWith('.md') && !PAGES.includes(f.slice(0, -3)) && f !== 'GUIDE-EDITION.md')
    .map(f => f.slice(0, -3)).sort();
}

export function loadMonograph(lang, id) {
  const file = path.join(CONTENT, lang, `${id}.md`);
  const raw = fs.readFileSync(file, 'utf8');
  const { meta, body, bodyLine } = parseFrontmatter(raw, path.relative(ROOT, file));
  const idx = body.indexOf(FOOTER_MARK);
  const main = idx >= 0 ? body.slice(0, idx) : body;
  const foot = idx >= 0 ? body.slice(idx + FOOTER_MARK.length) : '';
  const { sections, beforeHtml } = parseSections(main, bodyLine);
  return { file: path.relative(ROOT, file), raw, meta, body: main, sections, beforeHtml,
    footerHtml: foot.trim() ? md.render(foot) : '' };
}

export function loadPage(lang, name) {
  const file = path.join(CONTENT, lang, `${name}.md`);
  const raw = fs.readFileSync(file, 'utf8');
  const { meta, body } = parseFrontmatter(raw, path.relative(ROOT, file));
  return { file: path.relative(ROOT, file), raw, meta, body, html: md.render(body), sections: parseSections(body).sections };
}
