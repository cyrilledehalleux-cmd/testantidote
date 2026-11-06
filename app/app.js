// Guide canadien des antidotes – démo. Application sans serveur, sans suivi.
// Le contenu clinique vient UNIQUEMENT de data/content.json, généré à partir de content/<lang>/*.md.
// Ce fichier ne contient que l'interface (libellés de boutons, navigation, recherche).
import { bySerumLevel, byAmountIngested, CONST, LIMITS } from './digifab.js';

const LANGS = ['fr', 'en'];
const DIGOXIN_ID = 'digoxin-specific-antibodies';

const UI = {
  fr: {
    appTitle: 'Guide canadien des antidotes', skip: 'Aller au contenu', menu: 'Menu',
    switchTo: 'Switch to English', otherLang: 'EN',
    home: 'Accueil', calc: 'Calculateur DigiFab', abbreviations: 'Abréviations', advice: 'Avis au lecteur', about: 'À propos',
    searchLabel: 'Rechercher un antidote ou un terme', searchPh: 'Rechercher (nom, synonyme, texte)…',
    antidotes: 'Antidotes', results: (n, q) => `${n} résultat${n > 1 ? 's' : ''} pour « ${q} »`,
    noResults: q => `Aucun résultat pour « ${q} ».`, inName: 'Nom de l\'antidote',
    openAll: 'Tout ouvrir', closeAll: 'Tout fermer', official: 'Page officielle', opensNew: '(nouvel onglet)',
    calcFor: 'Calculateur de dose (démo)', notFound: 'Page introuvable.', back: 'Retour à l\'accueil',
    offline: d => `Hors ligne – contenu daté du ${d}`, update: 'Nouvelle version disponible', refresh: 'Actualiser',
    offlineReady: 'Disponible hors ligne', offlineNotReady: 'Préparation hors ligne en cours…',
    contentVersion: d => `Contenu du ${d}`, understood: 'J\'ai lu et je comprends', revision: 'Dernière mise à jour',
    noSw: 'Mode hors ligne non pris en charge par ce navigateur',
  },
  en: {
    appTitle: 'Canadian antidote guide', skip: 'Skip to content', menu: 'Menu',
    switchTo: 'Passer en français', otherLang: 'FR',
    home: 'Home', calc: 'DigiFab calculator', abbreviations: 'Abbreviations', advice: 'Advice to the reader', about: 'About',
    searchLabel: 'Search an antidote or a term', searchPh: 'Search (name, synonym, text)…',
    antidotes: 'Antidotes', results: (n, q) => `${n} result${n > 1 ? 's' : ''} for “${q}”`,
    noResults: q => `No results for “${q}”.`, inName: 'Antidote name',
    openAll: 'Open all', closeAll: 'Close all', official: 'Official page', opensNew: '(new tab)',
    calcFor: 'Dose calculator (demo)', notFound: 'Page not found.', back: 'Back to home',
    offline: d => `Offline – content dated ${d}`, update: 'New version available', refresh: 'Refresh',
    offlineReady: 'Available offline', offlineNotReady: 'Preparing offline use…',
    contentVersion: d => `Content of ${d}`, understood: 'I have read and understand', revision: 'Last updated',
    noSw: 'Offline mode not supported by this browser',
  },
};

const CALC_UI = {
  fr: {
    title: 'Calculateur DigiFab (anticorps spécifiques de la digoxine)',
    banner: 'Outil de démonstration – vérifier le calcul', bannerOther: 'Demo tool – verify the calculation',
    mode: 'Données disponibles', modeLevel: 'Digoxinémie', modeAmount: 'Quantité ingérée',
    weight: 'Poids du patient', level: 'Digoxinémie (obtenue 6 h ou plus après l\'ingestion)', amount: 'Quantité de digoxine ingérée',
    formula: 'Formule', enter: 'Entrez les valeurs pour obtenir le calcul.',
    result: 'Nombre de fioles', vials: n => `${n} fiole${n > 1 ? 's' : ''}`,
    steps: 'Étapes du calcul', entered: 'Valeurs saisies',
    convWeight: (a, f, b) => `Poids : ${a} lb × ${f} = ${b} kg`,
    convLevel: (a, f, b) => `Digoxinémie : ${a} nmol/L ÷ ${f} = ${b} ng/mL`,
    convAmount: (a, f, b) => `Quantité : ${a} µg ÷ ${f} = ${b} mg`,
    formulaLevel: (l, k, d, r) => `(${l} ng/mL × ${k} kg) ÷ ${d} = ${r} fiole (non arrondi)`,
    formulaAmount: (m, v, b, r) => `(${m} mg ÷ ${v} mg/fiole) × ${b} = ${r} fiole (non arrondi)`,
    ceil: (a, b) => `Arrondi au nombre entier supérieur : ${a} → ${b}`,
    cross: 'Contre-vérification – formule du guide officiel (nmol/L)',
    crossLine: (n, f, k, r, v) => `(${n} nmol/L × ${f}) × ${k} kg = ${r} → ${v}`,
    crossDiff: 'Attention : l\'arrondi de la formule officielle diffère. Vérifiez le calcul.',
    crossSame: 'Même nombre de fioles avec la formule officielle.',
    partial: 'Sans atteinte hémodynamique – 25 % du nombre théorique (guide officiel)',
    partialLine: (t, f, r, v) => `${t} × ${f} = ${r} → ${v}`,
    seeMono: 'Indications, dose empirique (arrêt cardiaque), administration : voir la monographie, section Posologie.',
    sources: 'Sources', srcMd: 'Formule : MDCalc, « DigiFab Dosing for Digoxin Poisoning » (consulté le 2026-11-06).',
    srcOff: 'Contre-vérification et règle des 25 % : Guide canadien des antidotes, « Anticorps spécifique de la digoxine », section Posologie.',
    errs: {
      nan: f => `${f} : entrez un nombre (ex. 3,6).`, unit: f => `${f} : unité non reconnue.`,
      min: (f, d) => `${f} : ${d} est trop bas pour ce calculateur.`,
      max: (f, d) => `${f} : ${d} dépasse les bornes du calculateur (bornes MDCalc). Aucun résultat affiché.`,
    },
    warn: (f, d) => `${f} : ${d} est une valeur inhabituelle. Vérifiez la saisie.`,
    fields: { level: 'Digoxinémie', weight: 'Poids', amount: 'Quantité ingérée' },
    limits: 'Bornes acceptées (MDCalc)',
  },
  en: {
    title: 'DigiFab calculator (digoxin-specific antibodies)',
    banner: 'Demo tool – verify the calculation', bannerOther: 'Outil de démonstration – vérifier le calcul',
    mode: 'Available data', modeLevel: 'Serum digoxin level', modeAmount: 'Amount ingested',
    weight: 'Patient weight', level: 'Serum digoxin level (obtained 6 h or more after ingestion)', amount: 'Amount of digoxin ingested',
    formula: 'Formula', enter: 'Enter values to see the calculation.',
    result: 'Number of vials', vials: n => `${n} vial${n > 1 ? 's' : ''}`,
    steps: 'Calculation steps', entered: 'Values entered',
    convWeight: (a, f, b) => `Weight: ${a} lb × ${f} = ${b} kg`,
    convLevel: (a, f, b) => `Digoxin level: ${a} nmol/L ÷ ${f} = ${b} ng/mL`,
    convAmount: (a, f, b) => `Amount: ${a} µg ÷ ${f} = ${b} mg`,
    formulaLevel: (l, k, d, r) => `(${l} ng/mL × ${k} kg) ÷ ${d} = ${r} vial (unrounded)`,
    formulaAmount: (m, v, b, r) => `(${m} mg ÷ ${v} mg/vial) × ${b} = ${r} vial (unrounded)`,
    ceil: (a, b) => `Rounded up to the next whole number: ${a} → ${b}`,
    cross: 'Cross-check – official guide formula (nmol/L)',
    crossLine: (n, f, k, r, v) => `(${n} nmol/L × ${f}) × ${k} kg = ${r} → ${v}`,
    crossDiff: 'Warning: the official formula rounds to a different number. Check the calculation.',
    crossSame: 'Same number of vials with the official formula.',
    partial: 'Without hemodynamic compromise – 25% of the theoretical dose (official guide)',
    partialLine: (t, f, r, v) => `${t} × ${f} = ${r} → ${v}`,
    seeMono: 'Indications, empiric dose (cardiac arrest), administration: see the monograph, Dosage section.',
    sources: 'Sources', srcMd: 'Formula: MDCalc, “DigiFab Dosing for Digoxin Poisoning” (accessed 2026-11-06).',
    srcOff: 'Cross-check and 25% rule: Canadian antidote guide, “Digoxin-Specific Antibodies”, Dosage section.',
    errs: {
      nan: f => `${f}: enter a number (e.g. 3.6).`, unit: f => `${f}: unknown unit.`,
      min: (f, d) => `${f}: ${d} is too low for this calculator.`,
      max: (f, d) => `${f}: ${d} is outside the calculator limits (MDCalc limits). No result shown.`,
    },
    warn: (f, d) => `${f}: ${d} is an unusual value. Check the entry.`,
    fields: { level: 'Digoxin level', weight: 'Weight', amount: 'Amount ingested' },
    limits: 'Accepted limits (MDCalc)',
  },
};

// ------------------------------------------------------------------ state ---
const state = {
  data: null,
  lang: 'fr',
  calc: { mode: 'level', level: '', levelUnit: 'nmol/L', weight: '', weightUnit: 'kg', amount: '', amountUnit: 'mg' },
  pendingOpen: null, // sections à rouvrir après changement de langue
  swReg: null,
  offlineReady: false,
};

const $ = (sel, el = document) => el.querySelector(sel);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const t = () => UI[state.lang];

function storage(kind) {
  try { const s = window[kind]; const k = '__t'; s.setItem(k, '1'); s.removeItem(k); return s; } catch { return null; }
}
const local = storage('localStorage');

// ------------------------------------------------------------- recherche ---
// Insensible aux accents et à la casse : « fomepizole » trouve « Fomépizole ».
function foldChar(ch) {
  return ch.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
    .replace(/[’‘`´]/g, "'").replace(/ /g, ' ').replace(/œ/g, 'oe').replace(/æ/g, 'ae');
}
/** Retourne { folded, map } : map[i] = index dans le texte d'origine du i-ème caractère replié. */
function fold(text) {
  let folded = '';
  const map = [];
  let i = 0;
  for (const ch of text) {
    const f = foldChar(ch);
    for (let k = 0; k < f.length; k++) { folded += f[k]; map.push(i); }
    i += ch.length;
  }
  map.push(i);
  return { folded, map };
}
const foldStr = s => fold(s).folded;
const tokensOf = q => foldStr(q).split(/\s+/).filter(Boolean);

function findRanges(text, tokens) {
  const { folded, map } = fold(text);
  const ranges = [];
  for (const tok of tokens) {
    let p = 0;
    while ((p = folded.indexOf(tok, p)) !== -1) {
      ranges.push([map[p], map[p + tok.length]]);
      p += tok.length;
    }
  }
  ranges.sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const r of ranges) {
    if (merged.length && r[0] <= merged[merged.length - 1][1]) merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], r[1]);
    else merged.push([...r]);
  }
  return merged;
}

function highlightText(text, tokens) {
  const ranges = findRanges(text, tokens);
  let out = '', last = 0;
  for (const [a, b] of ranges) { out += esc(text.slice(last, a)) + '<mark>' + esc(text.slice(a, b)) + '</mark>'; last = b; }
  return out + esc(text.slice(last));
}

function snippet(text, tokens, width = 70) {
  const ranges = findRanges(text, tokens);
  if (!ranges.length) return esc(text.slice(0, width * 2)) + (text.length > width * 2 ? '…' : '');
  const start = Math.max(0, ranges[0][0] - width);
  const end = Math.min(text.length, ranges[0][1] + width);
  const piece = text.slice(start, end).replace(/\s+/g, ' ');
  return (start > 0 ? '…' : '') + highlightText(piece, tokens) + (end < text.length ? '…' : '');
}

function flatSections(secs, trail = []) {
  const out = [];
  for (const s of secs) {
    const path = [...trail, s.title];
    out.push({ ...s, path });
    out.push(...flatSections(s.children, path));
  }
  return out;
}

function search(q) {
  const tokens = tokensOf(q);
  if (!tokens.length) return { tokens, groups: [] };
  const L = state.data[state.lang];
  const groups = [];
  for (const id of L.order) {
    const m = L.monographs[id];
    const titleF = foldStr(m.title);
    const titleHit = tokens.every(tk => titleF.includes(tk));
    const hits = [];
    for (const s of flatSections(m.sections)) {
      const hay = foldStr(s.title + '\n' + s.text);
      const all = tokens.every(tk => hay.includes(tk) || titleF.includes(tk));
      const some = tokens.some(tk => hay.includes(tk));
      if (all && some) {
        const count = tokens.reduce((n, tk) => n + (hay.split(tk).length - 1), 0);
        hits.push({ s, count });
      }
    }
    if (titleHit || hits.length) groups.push({ m, titleHit, hits });
  }
  groups.sort((a, b) => (b.titleHit - a.titleHit) || (b.hits.length - a.hits.length));
  return { tokens, groups };
}

// -------------------------------------------------------------- routage ---
function parseHash() {
  const h = decodeURI(location.hash.replace(/^#\/?/, ''));
  const [pathPart, query = ''] = h.split('?');
  const parts = pathPart.split('/').filter(Boolean);
  const params = new URLSearchParams(query);
  let lang = parts[0];
  if (!LANGS.includes(lang)) lang = null;
  return { lang, view: parts[1] || 'home', arg: parts[2] || null, sec: parts[3] || null, q: params.get('q') || '' };
}

function hashFor(r) {
  let h = `#/${r.lang}`;
  if (r.view && r.view !== 'home') h += `/${r.view}`;
  if (r.arg) h += `/${r.arg}`;
  if (r.sec) h += `/${r.sec}`;
  if (r.q) h += `?q=${encodeURIComponent(r.q)}`;
  return h;
}

function go(r, { replace = false } = {}) {
  const h = hashFor(r);
  if (replace) { history.replaceState(null, '', h); render(); }
  else if (location.hash === h) render();
  else location.hash = h;
}

function setLang(lang) {
  state.lang = lang;
  document.documentElement.lang = lang;
  local?.setItem('lang', lang);
}

// --------------------------------------------------------------- rendu ---
function renderChrome() {
  const T = t();
  document.title = `${T.appTitle} – ${state.lang === 'fr' ? 'démo' : 'demo'}`;
  $('#skip-link').textContent = T.skip;
  $('#menu-btn-label').textContent = T.menu;
  $('#brand').textContent = T.appTitle;
  $('#brand').href = `#/${state.lang}`;
  const lb = $('#lang-btn');
  lb.textContent = T.otherLang;
  lb.lang = state.lang === 'fr' ? 'en' : 'fr';
  lb.setAttribute('aria-label', T.switchTo);
  const r = parseHash();
  const items = [
    ['home', `#/${state.lang}`, T.home],
    ['calc', `#/${state.lang}/calc`, T.calc],
    ['abbreviations', `#/${state.lang}/p/abbreviations`, T.abbreviations],
    ['advice', `#/${state.lang}/p/advice`, T.advice],
    ['about', `#/${state.lang}/p/about`, T.about],
  ];
  const cur = r.view === 'p' ? r.arg : r.view;
  $('#menu-list').innerHTML = items.map(([k, href, label]) =>
    `<li><a href="${href}"${k === cur ? ' aria-current="page"' : ''}>${esc(label)}</a></li>`).join('');
  renderStatus();
}

function renderStatus() {
  const T = t();
  const d = state.data?.contentDate || '';
  let html = '';
  if (!navigator.onLine) html += `<p class="pill" role="status"><span>⚠ ${esc(T.offline(d))}</span></p>`;
  if (state.swReg?.waiting && navigator.serviceWorker?.controller) {
    html += `<p class="pill update" role="status"><span>${esc(UI.fr.update)} – ${esc(UI.fr.refresh.toLowerCase())} / <span lang="en">${esc(UI.en.update)} – ${esc(UI.en.refresh.toLowerCase())}</span></span>` +
      `<button type="button" class="btn small primary" id="refresh-btn">${esc(T.refresh)}</button></p>`;
  }
  $('#status').innerHTML = html;
  $('#refresh-btn')?.addEventListener('click', applyUpdate);
  const foot = [T.contentVersion(d)];
  if (!('serviceWorker' in navigator)) foot.push(T.noSw);
  else foot.push(state.offlineReady ? `✓ ${T.offlineReady}` : T.offlineNotReady);
  $('#menu-foot').textContent = foot.join(' · ');
}

function render() {
  const r = parseHash();
  if (!r.lang) { go({ lang: state.lang, view: 'home' }, { replace: true }); return; }
  if (r.lang !== state.lang) setLang(r.lang);
  renderChrome();
  closeMenu();
  const main = $('#main');
  if (r.view === 'home') renderHome(main, r);
  else if (r.view === 'm') renderMonograph(main, r);
  else if (r.view === 'calc') renderCalc(main);
  else if (r.view === 'p') renderPage(main, r);
  else renderNotFound(main);
}

function renderNotFound(main) {
  main.innerHTML = `<h1>${esc(t().notFound)}</h1><p><a href="#/${state.lang}">${esc(t().back)}</a></p>`;
}

const SEARCH_ICON = '<svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M20 20l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

function renderHome(main, r) {
  const T = t();
  main.innerHTML = `
    <h1 class="sr-only">${esc(T.appTitle)}</h1>
    <form class="search" role="search" id="search-form">
      <label for="q" class="sr-only">${esc(T.searchLabel)}</label>
      ${SEARCH_ICON}
      <input id="q" type="search" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="search"
        placeholder="${esc(T.searchPh)}" value="${esc(r.q)}">
    </form>
    <div id="results" aria-live="polite"></div>`;
  const input = $('#q');
  const draw = () => {
    const q = input.value;
    $('#results').innerHTML = q.trim() ? resultsHtml(q) : listHtml();
  };
  let timer;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      history.replaceState(null, '', hashFor({ lang: state.lang, view: 'home', q: input.value.trim() ? input.value : '' }));
      draw();
    }, 120);
  });
  $('#search-form').addEventListener('submit', e => { e.preventDefault(); input.blur(); });
  draw();
  if (r.q) input.focus();
}

function listHtml() {
  const T = t();
  const L = state.data[state.lang];
  const items = L.order.map(id => {
    const m = L.monographs[id];
    return `<li><a class="card" href="#/${state.lang}/m/${id}"><div class="t">${esc(m.title)}</div>` +
      `<div class="s">${esc(m.last_revision_label || T.revision)} : ${esc(m.last_revision)}</div></a></li>`;
  }).join('');
  return `<h2>${esc(T.antidotes)}</h2><ul class="list">${items}</ul>
    <div class="home-links">
      <a class="card" href="#/${state.lang}/calc"><div class="t">${esc(T.calc)}</div><div class="s">${esc(CALC_UI[state.lang].banner)}</div></a>
      <a class="card" href="#/${state.lang}/p/abbreviations"><div class="t">${esc(T.abbreviations)}</div></a>
      <a class="card" href="#/${state.lang}/p/advice"><div class="t">${esc(T.advice)}</div></a>
    </div>`;
}

function resultsHtml(q) {
  const T = t();
  const { tokens, groups } = search(q);
  const n = groups.reduce((k, g) => k + Math.max(g.hits.length, g.titleHit ? 1 : 0), 0);
  if (!groups.length) return `<p class="results-head">${esc(T.noResults(q.trim()))}</p>`;
  const qp = encodeURIComponent(q.trim());
  const body = groups.map(g => {
    const base = `#/${state.lang}/m/${g.m.id}`;
    const hits = g.hits.slice(0, 8).map(({ s }) =>
      `<li><a class="card" href="${base}/${s.id}?q=${qp}"><div class="t">${highlightText(s.path.join(' › '), tokens)}</div>` +
      `<div class="snippet">${snippet(s.text, tokens)}</div></a></li>`).join('');
    const more = g.hits.length > 8 ? `<li class="s">+ ${g.hits.length - 8}</li>` : '';
    return `<section class="result-group"><h2><a href="${base}?q=${qp}">${highlightText(g.m.title, tokens)}</a></h2>` +
      (g.titleHit && !g.hits.length ? `<ul><li><a class="card" href="${base}"><div class="s">${esc(T.inName)}</div></a></li></ul>` : '') +
      `<ul>${hits}${more}</ul></section>`;
  }).join('');
  return `<p class="results-head">${esc(T.results(n, q.trim()))}</p>${body}`;
}

function sectionHtml(s, openSet) {
  const lvl = Math.min(s.level, 6);
  const open = openSet.has(s.id) ? ' open' : '';
  return `<details class="sec lvl${lvl}" id="s-${s.id}" data-sec="${s.id}"${open}>` +
    `<summary><h${lvl}>${s.titleHtml}</h${lvl}></summary>` +
    `<div class="sec-body prose">${s.html}${s.children.map(c => sectionHtml(c, openSet)).join('')}</div></details>`;
}

function renderMonograph(main, r) {
  const T = t();
  const L = state.data[state.lang];
  const m = L.monographs[r.arg];
  if (!m) { renderNotFound(main); return; }
  const openSet = new Set(state.pendingOpen || []);
  if (!state.pendingOpen) {
    openSet.add('1'); // « Points clés » ouvert par défaut, comme sur le site
    if (r.sec) { const p = r.sec.split('.'); for (let i = 1; i <= p.length; i++) openSet.add(p.slice(0, i).join('.')); }
  }
  state.pendingOpen = null;
  main.innerHTML = `
    <div class="mono-head">
      <h1 id="mono-title">${esc(m.title)}</h1>
      <div class="tools">
        <button type="button" class="btn small wide-only" id="open-all">${esc(T.openAll)}</button>
        <button type="button" class="btn small wide-only" id="close-all">${esc(T.closeAll)}</button>
        <button type="button" class="btn small narrow-only" id="toggle-all"></button>
      </div>
    </div>
    <p class="meta"><span>${esc(m.last_revision_label || T.revision)} : <strong>${esc(m.last_revision)}</strong></span>
      <a href="${esc(m.source_url)}" target="_blank" rel="noopener">${esc(T.official)} ↗<span class="sr-only"> ${esc(T.opensNew)}</span></a></p>
    ${m.id === DIGOXIN_ID ? `<p class="calc-link"><a href="#/${state.lang}/calc">→ ${esc(T.calcFor)}</a></p>` : ''}
    <div id="sections">${m.sections.map(s => sectionHtml(s, openSet)).join('')}</div>
    ${m.footerHtml ? `<footer class="mono-foot prose">${m.footerHtml}</footer>` : ''}`;

  const all = () => [...main.querySelectorAll('details.sec')];
  const toggleBtn = $('#toggle-all');
  const syncToggle = () => { toggleBtn.textContent = all().every(d => d.open) ? T.closeAll : T.openAll; };
  let bulk = false;
  const setAll = o => { bulk = true; all().forEach(d => { d.open = o; }); syncToggle(); setTimeout(() => { bulk = false; }, 50); };
  $('#open-all').addEventListener('click', () => setAll(true));
  $('#close-all').addEventListener('click', () => setAll(false));
  toggleBtn.addEventListener('click', () => setAll(!all().every(d => d.open)));
  syncToggle();
  main.querySelectorAll('details.sec').forEach(d => d.addEventListener('toggle', () => {
    // ignorer les événements d'une page déjà quittée, ou d'un « tout ouvrir / tout fermer »
    if (!d.isConnected || parseHash().view !== 'm' || parseHash().arg !== m.id) return;
    syncToggle();
    if (bulk) return;
    if (d.open) history.replaceState(null, '', hashFor({ lang: state.lang, view: 'm', arg: m.id, sec: d.dataset.sec, q: parseHash().q }));
  }));

  if (r.q) {
    const tokens = tokensOf(r.q);
    const first = markInDom($('#sections'), tokens);
    // ouvrir les sections contenant un résultat
    main.querySelectorAll('mark').forEach(mk => {
      let p = mk.parentElement;
      while (p && p !== main) { if (p.tagName === 'DETAILS') p.open = true; p = p.parentElement; }
    });
    const target = r.sec ? document.getElementById(`s-${r.sec}`) : null;
    const scrollTo = (target && target.querySelector('mark')) || first || target;
    if (scrollTo) requestAnimationFrame(() => scrollTo.scrollIntoView({ block: 'center' }));
  } else if (r.sec) {
    const target = document.getElementById(`s-${r.sec}`);
    if (target) requestAnimationFrame(() => scrollWithHeader(target));
  } else {
    window.scrollTo(0, 0);
  }
}

function scrollWithHeader(el) {
  const head = $('.mono-head');
  const offset = 56 + (head ? head.offsetHeight : 0) + 8;
  const y = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo(0, Math.max(0, y));
}

/** Surligne les termes dans le DOM (texte seulement), retourne le premier <mark>. */
function markInDom(root, tokens) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  let first = null;
  for (const node of nodes) {
    const text = node.nodeValue;
    const ranges = findRanges(text, tokens);
    if (!ranges.length) continue;
    const frag = document.createDocumentFragment();
    let last = 0;
    for (const [a, b] of ranges) {
      frag.append(text.slice(last, a));
      const mk = document.createElement('mark');
      mk.textContent = text.slice(a, b);
      frag.append(mk);
      if (!first) first = mk;
      last = b;
    }
    frag.append(text.slice(last));
    node.replaceWith(frag);
  }
  return first;
}

function renderPage(main, r) {
  const p = state.data[state.lang].pages[r.arg];
  if (!p) { renderNotFound(main); return; }
  main.innerHTML = `<h1>${esc(p.title)}</h1><div class="prose">${p.html}</div>
    <p class="src"><a href="${esc(p.source_url)}" target="_blank" rel="noopener">${esc(t().official)} ↗<span class="sr-only"> ${esc(t().opensNew)}</span></a></p>`;
  window.scrollTo(0, 0);
}

// --------------------------------------------------------- calculateur ---
function fmt(x, max = 4) {
  return new Intl.NumberFormat(state.lang === 'fr' ? 'fr-CA' : 'en-CA', { maximumFractionDigits: max, useGrouping: false }).format(x);
}

function renderCalc(main) {
  const C = CALC_UI[state.lang];
  const s = state.calc;
  const opt = (vals, cur) => vals.map(v => `<option value="${esc(v)}"${v === cur ? ' selected' : ''}>${esc(v)}</option>`).join('');
  main.innerHTML = `
    <h1>${esc(C.title)}</h1>
    <p class="calc-banner" role="note">⚠ ${esc(C.banner)} <span aria-hidden="true">/</span> <span lang="${state.lang === 'fr' ? 'en' : 'fr'}">${esc(C.bannerOther)}</span></p>
    <form id="calc-form" novalidate>
      <fieldset>
        <legend>${esc(C.mode)}</legend>
        <div class="radio-row">
          <label><input type="radio" name="mode" value="level"${s.mode === 'level' ? ' checked' : ''}> ${esc(C.modeLevel)}</label>
          <label><input type="radio" name="mode" value="amount"${s.mode === 'amount' ? ' checked' : ''}> ${esc(C.modeAmount)}</label>
        </div>
        <div id="level-fields"${s.mode === 'level' ? '' : ' hidden'}>
          <div class="field">
            <label for="weight">${esc(C.weight)}</label>
            <div class="row">
              <input id="weight" name="weight" inputmode="decimal" autocomplete="off" value="${esc(s.weight)}" aria-describedby="weight-hint">
              <select id="weightUnit" name="weightUnit" aria-label="${esc(C.weight)} – unité">${opt(['kg', 'lb'], s.weightUnit)}</select>
            </div>
            <p class="hint" id="weight-hint"></p>
          </div>
          <div class="field">
            <label for="level">${esc(C.level)}</label>
            <div class="row">
              <input id="level" name="level" inputmode="decimal" autocomplete="off" value="${esc(s.level)}" aria-describedby="level-hint">
              <select id="levelUnit" name="levelUnit" aria-label="${esc(C.fields.level)} – unité">${opt(['nmol/L', 'ng/mL'], s.levelUnit)}</select>
            </div>
            <p class="hint" id="level-hint"></p>
          </div>
        </div>
        <div id="amount-fields"${s.mode === 'amount' ? '' : ' hidden'}>
          <div class="field">
            <label for="amount">${esc(C.amount)}</label>
            <div class="row">
              <input id="amount" name="amount" inputmode="decimal" autocomplete="off" value="${esc(s.amount)}" aria-describedby="amount-hint">
              <select id="amountUnit" name="amountUnit" aria-label="${esc(C.fields.amount)} – unité">${opt(['mg', 'µg'], s.amountUnit)}</select>
            </div>
            <p class="hint" id="amount-hint"></p>
          </div>
        </div>
      </fieldset>
    </form>
    <div class="formula" id="formula"></div>
    <div id="calc-out" aria-live="polite"></div>
    <p class="src">${esc(C.seeMono)} <a href="#/${state.lang}/m/${DIGOXIN_ID}/4">→</a></p>
    <p class="src"><strong>${esc(C.sources)}</strong><br>${esc(C.srcMd)}
      <a href="https://www.mdcalc.com/calc/4036/digifab-dosing-digoxin-poisoning" target="_blank" rel="noopener">MDCalc ↗</a><br>${esc(C.srcOff)}</p>`;

  const form = $('#calc-form');
  const update = () => {
    const fd = new FormData(form);
    for (const k of Object.keys(state.calc)) if (fd.has(k)) state.calc[k] = String(fd.get(k));
    $('#level-fields').hidden = state.calc.mode !== 'level';
    $('#amount-fields').hidden = state.calc.mode !== 'amount';
    drawCalc();
  };
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  form.addEventListener('submit', e => e.preventDefault());
  drawCalc();
  window.scrollTo(0, 0);
}

function limitText(field, unit) {
  const L = LIMITS[field];
  let min = L.min, max = L.max;
  if (field === 'level' && unit === 'nmol/L') { min *= CONST.NG_PER_ML_TO_NMOL_PER_L; max *= CONST.NG_PER_ML_TO_NMOL_PER_L; }
  if (field === 'weight' && unit === 'lb') { min /= CONST.LB_TO_KG; max /= CONST.LB_TO_KG; }
  if (field === 'amount' && unit === 'µg') { min *= 1000; max *= 1000; }
  const lo = L.minExclusive ? `> ${fmt(min, 2)}` : `≥ ${fmt(min, 2)}`;
  return `${CALC_UI[state.lang].limits} : ${lo} ${unit} ; ≤ ${fmt(max, 2)} ${unit}`;
}

function drawCalc() {
  const C = CALC_UI[state.lang];
  const s = state.calc;
  const level = s.mode === 'level';
  $('#formula').innerHTML = `<strong>${esc(C.formula)} (MDCalc)</strong><br><code>` + (level
    ? (state.lang === 'fr' ? 'Fioles = [digoxinémie (ng/mL) × poids (kg)] ÷ 100' : 'Vials = [digoxin level (ng/mL) × weight (kg)] ÷ 100')
      + `</code><br><code>1 ng/mL = ${fmt(CONST.NG_PER_ML_TO_NMOL_PER_L)} nmol/L ; 1 lb = ${fmt(CONST.LB_TO_KG, 6)} kg</code>`
    : (state.lang === 'fr' ? 'Fioles = [quantité ingérée (mg) ÷ 0,5 mg/fiole] × 80 %' : 'Vials = [amount ingested (mg) ÷ 0.5 mg/vial] × 80%') + '</code>')
    + `<br>${state.lang === 'fr' ? 'Toujours arrondir au nombre entier supérieur.' : 'Always round up to the next whole number.'}`;
  if (level) {
    $('#weight-hint').textContent = limitText('weight', s.weightUnit);
    $('#level-hint').textContent = limitText('level', s.levelUnit);
  } else {
    $('#amount-hint').textContent = limitText('amount', s.amountUnit);
  }
  const out = $('#calc-out');
  const filled = level ? (s.level.trim() && s.weight.trim()) : s.amount.trim();
  ['weight', 'level', 'amount'].forEach(f => $(`#${f}`)?.removeAttribute('aria-invalid'));
  if (!filled) { out.innerHTML = `<div class="result empty">${esc(C.enter)}</div>`; return; }
  const r = level ? bySerumLevel(s) : byAmountIngested(s);
  const dispOf = e => e.display ? `${fmt(e.display.value)} ${e.display.unit}` : '';
  if (!r.ok) {
    r.errors.forEach(e => $(`#${e.field}`)?.setAttribute('aria-invalid', 'true'));
    out.innerHTML = `<div class="result err" role="alert"><ul>${r.errors.map(e =>
      `<li>${esc(C.errs[e.code](C.fields[e.field], dispOf(e)))}</li>`).join('')}</ul></div>`;
    return;
  }
  const warns = r.warnings.map(w => `<p class="warnbox">⚠ ${esc(C.warn(C.fields[w.field], dispOf(w)))}</p>`).join('');
  const stepHtml = r.steps.map(st => {
    if (st.key === 'convWeight') return C.convWeight(fmt(st.from), fmt(st.factor, 6), fmt(st.to));
    if (st.key === 'convLevel') return C.convLevel(fmt(st.from), fmt(st.factor), fmt(st.to));
    if (st.key === 'convAmount') return C.convAmount(fmt(st.from), fmt(st.factor), fmt(st.to));
    if (st.key === 'formulaLevel') return C.formulaLevel(fmt(st.levelNg), fmt(st.kg), st.divisor, fmt(st.result));
    if (st.key === 'formulaAmount') return C.formulaAmount(fmt(st.mg), fmt(st.mgPerVial), fmt(st.bio * 100) + ' %', fmt(st.result));
    if (st.key === 'ceil') return C.ceil(fmt(st.from), st.to);
    return '';
  }).map(x => `<li><code>${esc(x)}</code></li>`).join('');
  const entered = level
    ? `${C.fields.weight} : ${fmt(r.input.weight)} ${r.input.weightUnit} · ${C.fields.level} : ${fmt(r.input.level)} ${r.input.levelUnit}`
    : `${C.fields.amount} : ${fmt(r.input.amount)} ${r.input.amountUnit}`;
  let extra = '';
  if (level) {
    const cc = r.crossCheck, p = r.partial;
    extra = `<h3>${esc(C.cross)}</h3><p><code>${esc(C.crossLine(fmt(cc.nmol), fmt(cc.factor, 5), fmt(cc.kg), fmt(cc.theoretical), C.vials(cc.vials)))}</code></p>
      ${cc.agrees ? `<p>✓ ${esc(C.crossSame)}</p>` : `<p class="warnbox">⚠ ${esc(C.crossDiff)}</p>`}
      <h3>${esc(C.partial)}</h3><p><code>${esc(C.partialLine(fmt(r.theoretical), fmt(p.fraction, 2), fmt(p.theoretical), C.vials(p.vials)))}</code></p>`;
  }
  out.innerHTML = `<div class="result ok">
      <div>${esc(C.result)} (MDCalc)</div>
      <div class="big">${esc(C.vials(r.vials))}</div>
      ${warns}
      <p class="src">${esc(C.entered)} : ${esc(entered)}</p>
      <h3>${esc(C.steps)}</h3><ol class="steps">${stepHtml}</ol>
      ${extra}
    </div>`;
}

// ---------------------------------------------------------------- menu ---
function openMenu() { $('#menu').hidden = false; $('#menu-btn').setAttribute('aria-expanded', 'true'); $('#menu a')?.focus(); }
function closeMenu() { $('#menu').hidden = true; $('#menu-btn').setAttribute('aria-expanded', 'false'); }

// -------------------------------------------------------- avis au lecteur ---
const DISCLAIMER_KEY = 'disclaimer-accepted-v1';
let disclaimerSeen = false;
function showDisclaimer(force = false) {
  if (!force && (disclaimerSeen || local?.getItem(DISCLAIMER_KEY))) return;
  const p = state.data[state.lang].pages.advice;
  $('#disclaimer-title').textContent = p.title;
  $('#disclaimer-content').innerHTML = p.html;
  $('#disclaimer-ok').textContent = t().understood;
  const dlg = $('#disclaimer');
  if (typeof dlg.showModal === 'function') { if (!dlg.open) dlg.showModal(); } else dlg.setAttribute('open', '');
}

// --------------------------------------------------------- hors ligne ---
async function registerSW() {
  if (!('serviceWorker' in navigator)) { renderStatus(); return; }
  let userAskedRefresh = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (userAskedRefresh) location.reload(); });
  navigator.serviceWorker.addEventListener('message', e => {
    if (e.data?.type === 'precached') { state.offlineReady = true; renderStatus(); }
  });
  window.applyUpdate = () => {
    userAskedRefresh = true;
    if (state.swReg?.waiting) state.swReg.waiting.postMessage({ type: 'SKIP_WAITING' });
    else location.reload();
  };
  try {
    const reg = await navigator.serviceWorker.register('./sw.js');
    state.swReg = reg;
    const track = w => w && w.addEventListener('statechange', () => {
      if (w.state === 'installed' || w.state === 'activated') checkOfflineReady();
      renderStatus();
    });
    track(reg.installing);
    reg.addEventListener('updatefound', () => track(reg.installing));
    window.addEventListener('online', () => { reg.update().catch(() => {}); renderStatus(); });
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') reg.update().catch(() => {}); });
    setInterval(() => reg.update().catch(() => {}), 30 * 60 * 1000);
    await checkOfflineReady();
  } catch (e) {
    console.warn('Service worker non enregistré', e);
  }
  renderStatus();
}
function applyUpdate() { window.applyUpdate?.(); }

async function checkOfflineReady() {
  try {
    const keys = await caches.keys();
    const v = state.data?.version;
    state.offlineReady = keys.includes(`antidotes-${v}`) &&
      (await (await caches.open(`antidotes-${v}`)).match('./data/content.json')) != null;
  } catch { state.offlineReady = false; }
  renderStatus();
}

// ----------------------------------------------------------------- init ---
async function init() {
  const saved = local?.getItem('lang');
  const r = parseHash();
  setLang(r.lang || (LANGS.includes(saved) ? saved : 'fr'));
  try {
    const res = await fetch('./data/content.json');
    state.data = await res.json();
  } catch (e) {
    $('#main').innerHTML = '<p class="loading">Contenu indisponible. Reconnectez-vous une première fois pour installer le guide. / Content unavailable. Connect once to install the guide.</p>';
    return;
  }
  $('#menu-btn').addEventListener('click', () => ($('#menu').hidden ? openMenu() : closeMenu()));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#menu').hidden) { closeMenu(); $('#menu-btn').focus(); } });
  $('#lang-btn').addEventListener('click', switchLang);
  $('#disclaimer-ok').addEventListener('click', () => {
    disclaimerSeen = true;
    local?.setItem(DISCLAIMER_KEY, new Date().toISOString());
    $('#disclaimer').close?.();
    $('#disclaimer').removeAttribute('open');
  });
  $('#disclaimer').addEventListener('cancel', e => { if (!local?.getItem(DISCLAIMER_KEY) && !disclaimerSeen) e.preventDefault(); });
  window.addEventListener('hashchange', () => {
    render();
    if (parseHash().view === 'p' && parseHash().arg === 'advice') { /* page affichée */ }
    $('#main').focus({ preventScroll: true });
  });
  window.addEventListener('online', renderStatus);
  window.addEventListener('offline', renderStatus);
  window.addEventListener('beforeprint', () => document.querySelectorAll('details.sec').forEach(d => { d.dataset.wasOpen = d.open; d.open = true; }));
  window.addEventListener('afterprint', () => document.querySelectorAll('details.sec').forEach(d => { d.open = d.dataset.wasOpen === 'true'; }));
  render();
  showDisclaimer();
  registerSW();
}

/** Changer de langue en restant sur le même antidote et la même section. */
function switchLang() {
  const r = parseHash();
  const other = state.lang === 'fr' ? 'en' : 'fr';
  const next = { ...r, lang: other };
  if (r.view === 'm') {
    const opened = [...document.querySelectorAll('details.sec[open]')].map(d => d.dataset.sec);
    // section visible en haut de l'écran
    const head = $('.mono-head');
    const top = 56 + (head ? head.offsetHeight : 0) + 4;
    let visible = null;
    for (const d of document.querySelectorAll('details.sec')) {
      const rect = d.getBoundingClientRect();
      if (rect.bottom > top) {
        // descendre dans la sous-section ouverte visible la plus précise
        visible = d.dataset.sec;
        if (rect.top >= top || !d.open) break;
      }
    }
    state.pendingOpen = opened;
    next.sec = visible || r.sec;
    next.q = '';
  }
  const dlgOpen = $('#disclaimer').open;
  setLang(other);
  go(next);
  if (dlgOpen) showDisclaimer(true);
}

init();
