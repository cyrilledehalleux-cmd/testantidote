// Guide canadien des antidotes – démo. Application sans serveur, sans suivi.
// Le contenu clinique vient UNIQUEMENT de data/content.json, généré à partir de content/<lang>/*.md.
// Ce fichier ne contient que l'interface (libellés de boutons, navigation, recherche).
import { bySerumLevel, byAmountIngested, CONST, LIMITS } from './digifab.js';
import { renderPhase1, CALCS, CALC_INFO } from './calc/views.js';

const LANGS = ['fr', 'en'];
const DIGOXIN_ID = 'digoxin-specific-antibodies';
// Références d'origine du calculateur DigiFab (citations exactes ; le calcul a été vérifié avec MDCalc)
const DIGIFAB_REFS = {
  howland: 'Howland MA. Digoxin-Specific Antibody Fragments. In: Hoffman R, Howland MA, Lewin N et al. Goldfrank\'s Toxicologic Emergencies, Tenth Edition. McGraw-Hill Education / Medical; 2014.',
  lapostolle: 'Lapostolle F, Borron SW, Verdier C, Taboulet P, Guerrier G, Adnet F, Clemessy JL, Bismuth C, Baud FJ. Digoxin-specific Fab fragments as single first-line therapy in digitalis poisoning. Crit Care Med. 2008 Nov;36(11):3014-8. doi: 10.1097/CCM.0b013e31818b341c.',
  antman: 'Antman EM, Wenger TL, Butler VP Jr, Haber E, Smith TW. Treatment of 150 cases of Life-Threatening Digitalis Intoxication With Digoxin-Specific Fab Antibody Fragments: Final Report of a Multicenter Study. Circulation. 1990;81:1744-52.',
};
// calculateurs liés à une monographie (affichés en haut de la monographie)
const MONO_CALCS = {
  'digoxin-specific-antibodies': ['digifab'],
  dextrose: ['dextrose'],
  ethanol: ['ethanol'],
};

const UI = {
  fr: {
    appTitle: 'Guide canadien des antidotes', skip: 'Aller au contenu',
    switchTo: 'Switch to English', otherLang: 'EN', back: 'Retour', backList: 'Liste',
    backListLabel: 'Retour à la liste des antidotes',
    tabAntidotes: 'Antidotes', tabTools: 'Outils', tabCentres: 'Centres antipoison', nav: 'Navigation principale',
    tools: 'Calculateurs et outils', calc: 'Calculateur DigiFab', abbreviations: 'Abréviations', advice: 'Avis au lecteur', about: 'À propos',
    searchLabel: 'Rechercher un antidote', searchPh: 'Rechercher un antidote',
    noAntidote: q => `Aucun antidote ne correspond à « ${q} ».`,
    searchHint: 'La recherche porte sur le nom et les synonymes. Pour chercher dans le texte, ouvrez une monographie et utilisez sa barre de recherche.',
    synonym: 'Synonyme', count: n => `${n} antidote${n > 1 ? 's' : ''}`,
    findLabel: 'Rechercher dans cette monographie', findPh: 'Rechercher dans cette page',
    prev: 'Résultat précédent', next: 'Résultat suivant', clear: 'Effacer la recherche',
    found: (i, n) => n ? `${i} / ${n}` : '0',
    foundLong: (i, n) => n ? `Résultat ${i} sur ${n}` : 'Aucun résultat dans cette page',
    openAll: 'Tout ouvrir', closeAll: 'Tout fermer', official: 'Page officielle', opensNew: '(nouvel onglet)',
    calcFor: 'Calculateur de dose (démo)', notFound: 'Page introuvable.', home: 'Retour à l\'accueil',
    offline: d => `Hors ligne – contenu daté du ${d}`, update: 'Nouvelle version disponible', refresh: 'Actualiser',
    offlineReady: 'Disponible hors ligne', offlineNotReady: 'Préparation hors ligne en cours…',
    contentVersion: d => `Contenu du ${d}`, understood: 'J\'ai lu et je comprends', revision: 'Dernière mise à jour',
    noSw: 'Mode hors ligne non pris en charge par ce navigateur', demoTag: 'Démo',
    calcSub: 'Nombre de fioles – anticorps spécifiques de la digoxine',
    abbrSub: 'Abréviations et acronymes du guide', adviceSub: 'À lire avant utilisation', aboutSub: 'Les centres antipoison canadiens',
    appInfo: 'Application', centresSub: 'Source : Guide canadien des antidotes, page « Centres ».',
  },
  en: {
    appTitle: 'Canadian antidote guide', skip: 'Skip to content',
    switchTo: 'Passer en français', otherLang: 'FR', back: 'Back', backList: 'List',
    backListLabel: 'Back to the antidote list',
    tabAntidotes: 'Antidotes', tabTools: 'Tools', tabCentres: 'Poison centres', nav: 'Main navigation',
    tools: 'Calculators and tools', calc: 'DigiFab calculator', abbreviations: 'Abbreviations', advice: 'Advice to the reader', about: 'About',
    searchLabel: 'Search antidotes', searchPh: 'Search antidotes',
    noAntidote: q => `No antidote matches “${q}”.`,
    searchHint: 'Search covers names and synonyms. To search the text, open a monograph and use its search bar.',
    synonym: 'Synonym', count: n => `${n} antidote${n > 1 ? 's' : ''}`,
    findLabel: 'Search this monograph', findPh: 'Search this page',
    prev: 'Previous result', next: 'Next result', clear: 'Clear search',
    found: (i, n) => n ? `${i} / ${n}` : '0',
    foundLong: (i, n) => n ? `Result ${i} of ${n}` : 'No results on this page',
    openAll: 'Open all', closeAll: 'Close all', official: 'Official page', opensNew: '(new tab)',
    calcFor: 'Dose calculator (demo)', notFound: 'Page not found.', home: 'Back to home',
    offline: d => `Offline – content dated ${d}`, update: 'New version available', refresh: 'Refresh',
    offlineReady: 'Available offline', offlineNotReady: 'Preparing offline use…',
    contentVersion: d => `Content of ${d}`, understood: 'I have read and understand', revision: 'Last updated',
    noSw: 'Offline mode not supported by this browser', demoTag: 'Demo',
    calcSub: 'Number of vials – digoxin-specific antibodies',
    abbrSub: 'Guide abbreviations and acronyms', adviceSub: 'Read before use', aboutSub: 'Canadian poison centres',
    appInfo: 'App', centresSub: 'Source: Canadian antidote guide, “Centres” page.',
  },
};

const ICONS = {
  flask: '<svg aria-hidden="true" viewBox="0 0 24 24" width="26" height="26"><path d="M9 2.5h6M10 2.5v6.2L4.6 18.3A2.2 2.2 0 0 0 6.5 21.5h11a2.2 2.2 0 0 0 1.9-3.2L14 8.7V2.5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round" stroke-linecap="round"/><path d="M7.3 14h9.4l2 3.9a1.2 1.2 0 0 1-1 1.6H6.3a1.2 1.2 0 0 1-1-1.6z" fill="currentColor"/></svg>',
  tools: '<svg aria-hidden="true" viewBox="0 0 24 24" width="26" height="26"><rect x="4.5" y="2.5" width="15" height="19" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.9"/><rect x="7.5" y="5.5" width="9" height="4" rx="1" fill="currentColor"/><g fill="currentColor"><circle cx="8.6" cy="13" r="1.15"/><circle cx="12" cy="13" r="1.15"/><circle cx="15.4" cy="13" r="1.15"/><circle cx="8.6" cy="17" r="1.15"/><circle cx="12" cy="17" r="1.15"/><circle cx="15.4" cy="17" r="1.15"/></g></svg>',
  phone: '<svg aria-hidden="true" viewBox="0 0 24 24" width="26" height="26"><path d="M6.6 3.2 8.9 3a1.4 1.4 0 0 1 1.4.9l1.2 3.1a1.4 1.4 0 0 1-.4 1.6l-1.6 1.3a12 12 0 0 0 4.6 4.6l1.3-1.6a1.4 1.4 0 0 1 1.6-.4l3.1 1.2a1.4 1.4 0 0 1 .9 1.4l-.2 2.3a2.6 2.6 0 0 1-2.8 2.4C9.8 20.3 3.7 14.2 3.3 6a2.6 2.6 0 0 1 2.4-2.8z" fill="currentColor"/></svg>',
  chevronR: '<svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22"><path d="m9 5 7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  chevronL: '<svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22"><path d="m15 5-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  search: '<svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="m20 20-4.6-4.6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
  up: '<svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20"><path d="m6 15 6-6 6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  down: '<svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  close: '<svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
  web: '<svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
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
    partialShort: 'Sans atteinte hémodynamique (25 %)', tapHint: 'Touchez le résultat pour voir le détail du calcul.',
    partialLine: (t, f, r, v) => `${t} × ${f} = ${r} → ${v}`,
    seeMono: 'Indications, dose empirique (arrêt cardiaque), administration : voir la monographie, section Posologie.',
    sources: 'Références',
    srcLevel: 'Formule par digoxinémie, contre-vérification (× 0,00781) et règle des 25 % : Guide canadien des antidotes, « Anticorps spécifique de la digoxine », section Posologie.',
    srcAmount: 'Formule par quantité ingérée (0,5 mg de digoxine neutralisés par fiole ; biodisponibilité 80 %) :',
    errs: {
      nan: f => `${f} : entrez un nombre (ex. 3,6).`, unit: f => `${f} : unité non reconnue.`,
      min: (f, d) => `${f} : ${d} est trop bas pour ce calculateur.`,
      max: (f, d) => `${f} : ${d} dépasse les bornes du calculateur Aucun résultat affiché.`,
    },
    warn: (f, d) => `${f} : ${d} est une valeur inhabituelle. Vérifiez la saisie.`,
    fields: { level: 'Digoxinémie', weight: 'Poids', amount: 'Quantité ingérée' },
    limits: 'Bornes acceptées',
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
    partialShort: 'Without hemodynamic compromise (25%)', tapHint: 'Tap the result to see the calculation.',
    partialLine: (t, f, r, v) => `${t} × ${f} = ${r} → ${v}`,
    seeMono: 'Indications, empiric dose (cardiac arrest), administration: see the monograph, Dosage section.',
    sources: 'References',
    srcLevel: 'Formula by serum level, cross-check (× 0.00781) and 25% rule: Canadian antidote guide, “Digoxin-Specific Antibodies”, Dosage section.',
    srcAmount: 'Formula by amount ingested (0.5 mg of digoxin bound per vial; 80% bioavailability):',
    errs: {
      nan: f => `${f}: enter a number (e.g. 3.6).`, unit: f => `${f}: unknown unit.`,
      min: (f, d) => `${f}: ${d} is too low for this calculator.`,
      max: (f, d) => `${f}: ${d} is outside the calculator limits No result shown.`,
    },
    warn: (f, d) => `${f}: ${d} is an unusual value. Check the entry.`,
    fields: { level: 'Digoxin level', weight: 'Weight', amount: 'Amount ingested' },
    limits: 'Accepted limits',
  },
};

// ------------------------------------------------------------------ state ---
const state = {
  data: null,
  lang: 'fr',
  calc: { mode: 'level', level: '', levelUnit: 'nmol/L', weight: '', weightUnit: 'kg', amount: '', amountUnit: 'mg' },
  calcStore: {}, // valeurs saisies dans les calculateurs (conservées au changement de langue)
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

// ------------------------------------------------- recherche (repliage) ---
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

// --------------------------------------- recherche d'accueil : noms + synonymes ---
/** Synonymes d'une monographie : lignes de la section dont le titre contient « synonym ». */
const synCache = new Map();
function synonymsOf(m) {
  const key = state.lang + '/' + m.id;
  if (synCache.has(key)) return synCache.get(key);
  const sec = m.sections.find(s => foldStr(s.title).includes('synonym'));
  let list = [];
  if (sec) {
    // chaque élément de liste (ou ligne) de la section = un synonyme, avec sa mise en forme (ex. exposant « md »)
    const div = document.createElement('div');
    div.innerHTML = sec.html;
    const items = div.querySelectorAll('li');
    list = (items.length ? [...items] : [...div.children]).map(el => ({ text: el.textContent.trim(), html: el.innerHTML.trim() }))
      .filter(x => x.text);
  }
  synCache.set(key, list);
  return list;
}
function highlightHtml(html, tokens) {
  const div = document.createElement('div');
  div.innerHTML = html;
  markInDom(div, tokens);
  return div.innerHTML;
}

function searchAntidotes(q) {
  const tokens = tokensOf(q);
  const L = state.data[state.lang];
  const out = [];
  for (const id of L.order) {
    const m = L.monographs[id];
    if (!tokens.length) { out.push({ m }); continue; }
    const tf = foldStr(m.title);
    if (tokens.every(tk => tf.includes(tk))) { out.push({ m, rank: 0 }); continue; }
    const syn = synonymsOf(m).find(s => { const f = foldStr(s.text); return tokens.every(tk => f.includes(tk) || tf.includes(tk)); });
    if (syn) out.push({ m, syn, rank: 1 });
  }
  if (tokens.length) out.sort((a, b) => a.rank - b.rank);
  return { tokens, items: out };
}

// -------------------------------------------------------------- routage ---
// #/fr                    accueil (liste + recherche)      ?q=
// #/fr/m/<id>[/<section>] monographie                      ?q= (recherche dans la page)
// #/fr/tools              calculateurs et outils
// #/fr/calc               calculateur DigiFab
// #/fr/p/<page>           avis, abréviations, à propos
// #/fr/centres            centres antipoison
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

const TAB_OF = { home: 'antidotes', m: 'antidotes', tools: 'tools', calc: 'tools', p: 'tools', centres: 'centres' };

// --------------------------------------------------------------- rendu ---
function renderChrome(r, title, backHref) {
  const T = t();
  document.title = `${title ? title + ' – ' : ''}${T.appTitle} (${state.lang === 'fr' ? 'démo' : 'demo'})`;
  $('#skip-link').textContent = T.skip;
  $('#top-title').textContent = title || T.appTitle;
  const back = $('#top-back');
  if (backHref) { back.hidden = false; back.href = backHref; $('#top-back-label').textContent = T.back; }
  else back.hidden = true;
  const lb = $('#lang-btn');
  lb.textContent = T.otherLang;
  lb.lang = state.lang === 'fr' ? 'en' : 'fr';
  lb.setAttribute('aria-label', T.switchTo);
  // barre d'onglets du bas
  const tab = TAB_OF[r.view] || '';
  const tabs = [
    ['antidotes', `#/${state.lang}`, ICONS.flask, T.tabAntidotes],
    ['tools', `#/${state.lang}/tools`, ICONS.tools, T.tabTools],
    ['centres', `#/${state.lang}/centres`, ICONS.phone, T.tabCentres],
  ];
  const nav = $('#tabbar');
  nav.setAttribute('aria-label', T.nav);
  nav.innerHTML = `<ul>${tabs.map(([k, href, icon, label]) =>
    `<li><a href="${href}"${k === tab ? ' aria-current="page"' : ''}>${icon}<span>${esc(label)}</span></a></li>`).join('')}</ul>`;
  document.body.dataset.view = r.view;
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
  const info = $('#app-info');
  if (info) info.textContent = appInfoText();
}

function appInfoText() {
  const T = t();
  const parts = [T.contentVersion(state.data?.contentDate || '')];
  if (!('serviceWorker' in navigator)) parts.push(T.noSw);
  else parts.push(state.offlineReady ? `✓ ${T.offlineReady}` : T.offlineNotReady);
  return parts.join(' · ');
}

function render() {
  const r = parseHash();
  if (!r.lang) { go({ lang: state.lang, view: 'home' }, { replace: true }); return; }
  if (r.lang !== state.lang) setLang(r.lang);
  const main = $('#main');
  const T = t();
  const L = state.data[state.lang];
  if (r.view === 'home') { renderChrome(r, ''); renderHome(main, r); }
  else if (r.view === 'm' && L.monographs[r.arg]) { renderChrome(r, L.monographs[r.arg].title); renderMonograph(main, r); }
  else if (r.view === 'tools') { renderChrome(r, T.tools); renderTools(main); }
  else if (r.view === 'calc' && CALCS.includes(r.arg)) {
    renderChrome(r, CALC_INFO[r.arg][state.lang][0], `#/${state.lang}/tools`);
    renderPhase1(r.arg, main, { lang: state.lang, esc, fmt, store: state.calcStore });
  }
  else if (r.view === 'calc' && (!r.arg || r.arg === 'digifab')) { renderChrome(r, T.calc, `#/${state.lang}/tools`); renderCalc(main); }
  else if (r.view === 'p' && L.pages[r.arg] && r.arg !== 'centres') { renderChrome(r, L.pages[r.arg].title, `#/${state.lang}/tools`); renderPage(main, r); }
  else if (r.view === 'centres') { renderChrome(r, L.pages.centres?.title || T.tabCentres); renderCentres(main); }
  else { renderChrome(r, ''); renderNotFound(main); }
}

function renderNotFound(main) {
  main.innerHTML = `<h1>${esc(t().notFound)}</h1><p><a href="#/${state.lang}">${esc(t().home)}</a></p>`;
}

// --------------------------------------------------------------- accueil ---
function renderHome(main, r) {
  const T = t();
  main.innerHTML = `
    <div class="hero">
      <h1 class="sr-only">${esc(T.appTitle)}</h1>
      <form class="search" role="search" id="search-form">
        <label for="q" class="sr-only">${esc(T.searchLabel)}</label>
        ${ICONS.search}
        <input id="q" type="search" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="search"
          placeholder="${esc(T.searchPh)}" value="${esc(r.q)}" aria-describedby="search-hint">
      </form>
    </div>
    <div id="results" aria-live="polite"></div>
    <p class="hint center" id="search-hint">${esc(T.searchHint)}</p>`;
  const input = $('#q');
  const draw = () => { $('#results').innerHTML = antidoteListHtml(input.value); };
  let timer;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      history.replaceState(null, '', hashFor({ lang: state.lang, view: 'home', q: input.value.trim() ? input.value : '' }));
      draw();
    }, 100);
  });
  $('#search-form').addEventListener('submit', e => {
    e.preventDefault();
    const first = $('#results a.row');
    if (first && input.value.trim()) first.click(); else input.blur();
  });
  draw();
  if (r.q) input.focus();
  window.scrollTo(0, 0);
}

function antidoteListHtml(q) {
  const T = t();
  const { tokens, items } = searchAntidotes(q);
  if (!items.length) return `<p class="empty">${esc(T.noAntidote(q.trim()))}</p>`;
  const rows = items.map(({ m, syn }) => `
    <li><a class="row" href="#/${state.lang}/m/${m.id}">
      <span class="row-text"><span class="row-title">${tokens.length ? highlightText(m.title, tokens) : esc(m.title)}</span>
      ${syn ? `<span class="row-sub">${esc(T.synonym)} : ${highlightHtml(syn.html, tokens)}</span>` : ''}</span>
      ${ICONS.chevronR}</a></li>`).join('');
  return `<h2 class="sr-only">${esc(T.count(items.length))}</h2><ul class="rows">${rows}</ul>`;
}

// ---------------------------------------------------------- monographie ---
function sectionHtml(s, openSet) {
  const lvl = Math.min(s.level, 6);
  const open = openSet.has(s.id) ? ' open' : '';
  return `<details class="sec lvl${lvl}" id="s-${s.id}" data-sec="${s.id}"${open}>` +
    `<summary><h${lvl}>${s.titleHtml}</h${lvl}><span class="chev">${ICONS.down}</span></summary>` +
    `<div class="sec-body prose">${s.html}${s.children.map(c => sectionHtml(c, openSet)).join('')}</div></details>`;
}

function renderMonograph(main, r) {
  const T = t();
  const m = state.data[state.lang].monographs[r.arg];
  const openSet = new Set(state.pendingOpen || []);
  if (!state.pendingOpen) {
    openSet.add('1'); // « Points clés » ouvert par défaut, comme sur le site
    if (r.sec) { const p = r.sec.split('.'); for (let i = 1; i <= p.length; i++) openSet.add(p.slice(0, i).join('.')); }
  }
  state.pendingOpen = null;
  const findInit = r.q;
  main.innerHTML = `
    <div class="mono-bar">
      <div class="mono-tools">
        <a class="btn small back" href="#/${state.lang}" aria-label="${esc(T.backListLabel)}">${ICONS.chevronL}<span>${esc(T.backList)}</span></a>
        <button type="button" class="btn small" id="open-all">${esc(T.openAll)}</button>
        <button type="button" class="btn small" id="close-all">${esc(T.closeAll)}</button>
      </div>
      <form class="find" role="search" id="find-form">
        <label for="find" class="sr-only">${esc(T.findLabel)}</label>
        ${ICONS.search}
        <input id="find" type="search" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="search"
          placeholder="${esc(T.findPh)}" value="${esc(findInit)}">
        <span class="find-count" id="find-count" aria-hidden="true"></span>
        <button type="button" class="icon-btn" id="find-prev" aria-label="${esc(T.prev)}">${ICONS.up}</button>
        <button type="button" class="icon-btn" id="find-next" aria-label="${esc(T.next)}">${ICONS.down}</button>
        <span class="sr-only" id="find-status" aria-live="polite"></span>
      </form>
    </div>
    <h1 id="mono-title" class="mono-title">${esc(m.title)}</h1>
    <p class="meta"><span>${esc(m.last_revision_label || T.revision)} : <strong>${esc(m.last_revision)}</strong></span>
      <a href="${esc(m.source_url)}" target="_blank" rel="noopener">${esc(T.official)} ↗<span class="sr-only"> ${esc(T.opensNew)}</span></a></p>
    ${(MONO_CALCS[m.id] || []).map(id => {
      const href = id === 'digifab' ? `#/${state.lang}/calc` : `#/${state.lang}/calc/${id}`;
      const title = id === 'digifab' ? T.calcFor : CALC_INFO[id][state.lang][0];
      return `<p class="calc-link"><a class="row" href="${href}"><span class="row-text"><span class="row-title">${esc(title)}</span>` +
        `<span class="row-sub">${esc(T.tools)} – ${esc(T.demoTag.toLowerCase())}</span></span>${ICONS.chevronR}</a></p>`;
    }).join('')}
    <div id="sections"></div>
    ${m.footerHtml ? `<footer class="mono-foot prose">${m.footerHtml}</footer>` : ''}`;

  let bulk = false;
  const all = () => [...main.querySelectorAll('details.sec')];
  const setAll = o => { bulk = true; all().forEach(d => { d.open = o; }); setTimeout(() => { bulk = false; }, 50); };
  $('#open-all').addEventListener('click', () => setAll(true));
  $('#close-all').addEventListener('click', () => setAll(false));

  const drawSections = open => {
    $('#sections').innerHTML = m.sections.map(s => sectionHtml(s, open)).join('');
    all().forEach(d => d.addEventListener('toggle', () => {
      // ignorer les événements d'une page déjà quittée, ou d'un « tout ouvrir / tout fermer »
      if (bulk || !d.isConnected || parseHash().view !== 'm' || parseHash().arg !== m.id) return;
      if (d.open) history.replaceState(null, '', hashFor({ lang: state.lang, view: 'm', arg: m.id, sec: d.dataset.sec }));
    }));
  };
  drawSections(openSet);
  // images (ex. tableaux de doses) : un toucher les ouvre en grand (fonctionne aussi hors ligne)
  $('#sections').addEventListener('click', e => {
    const img = e.target.closest('.sec-body img');
    if (img) window.open(img.getAttribute('src'), '_blank', 'noopener');
  });

  // --- recherche dans la page ---
  const input = $('#find');
  let marks = [], cur = -1;
  const setCurrent = i => {
    marks.forEach(mk => mk.classList.remove('current'));
    cur = marks.length ? (i + marks.length) % marks.length : -1;
    $('#find-count').textContent = input.value.trim() ? T.found(cur + 1, marks.length) : '';
    $('#find-status').textContent = input.value.trim() ? T.foundLong(cur + 1, marks.length) : '';
    $('#find-form').classList.toggle('active', !!input.value.trim());
    $('#find-form').classList.toggle('none', !!input.value.trim() && !marks.length);
    if (cur < 0) return;
    const mk = marks[cur];
    mk.classList.add('current');
    let p = mk.parentElement;
    while (p && p !== main) { if (p.tagName === 'DETAILS') p.open = true; p = p.parentElement; }
    scrollWithHeader(mk, true);
  };
  const runFind = () => {
    const q = input.value;
    const open = new Set(all().filter(d => d.open).map(d => d.dataset.sec));
    bulk = true;
    drawSections(open);
    marks = [];
    if (q.trim()) {
      markInDom($('#sections'), tokensOf(q));
      marks = [...$('#sections').querySelectorAll('mark')];
      marks.forEach(mk => { let p = mk.parentElement; while (p && p !== main) { if (p.tagName === 'DETAILS') p.open = true; p = p.parentElement; } });
    }
    setTimeout(() => { bulk = false; }, 50);
    setCurrent(0);
  };
  let timer;
  input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(runFind, 150); });
  $('#find-form').addEventListener('submit', e => { e.preventDefault(); setCurrent(cur + 1); });
  input.addEventListener('keydown', e => { if (e.key === 'Enter' && e.shiftKey) { e.preventDefault(); setCurrent(cur - 1); } });
  $('#find-next').addEventListener('click', () => setCurrent(cur + 1));
  $('#find-prev').addEventListener('click', () => setCurrent(cur - 1));

  if (findInit) runFind();
  else if (r.sec) {
    const target = document.getElementById(`s-${r.sec}`);
    if (target) requestAnimationFrame(() => scrollWithHeader(target));
  } else window.scrollTo(0, 0);
}

function scrollWithHeader(el, center = false) {
  const top = ($('.topbar')?.offsetHeight || 0) + ($('.mono-bar')?.offsetHeight || 0);
  const rect = el.getBoundingClientRect();
  const avail = window.innerHeight - top - ($('#tabbar')?.offsetHeight || 0);
  const y = rect.top + window.scrollY - top - (center ? Math.max(8, avail / 2 - rect.height / 2) : 8);
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

// -------------------------------------------------------- outils, pages ---
function renderTools(main) {
  const T = t();
  const C = CALC_UI[state.lang];
  const P = state.data[state.lang].pages;
  const row = (href, title) => `<li><a class="row" href="${href}"><span class="row-text"><span class="row-title">${esc(title)}</span></span>${ICONS.chevronR}</a></li>`;
  main.innerHTML = `
    <h1 class="page-title">${esc(T.tools)}</h1>
    <h2 class="group-title">${esc(state.lang === 'fr' ? 'Calculateurs' : 'Calculators')}</h2>
    <ul class="rows">${row(`#/${state.lang}/calc`, T.calc)}
      ${CALCS.map(id => row(`#/${state.lang}/calc/${id}`, CALC_INFO[id][state.lang][0])).join('')}</ul>
    <h2 class="group-title">${esc(state.lang === 'fr' ? 'Références' : 'References')}</h2>
    <ul class="rows">
      ${row(`#/${state.lang}/p/abbreviations`, P.abbreviations.title)}
      ${row(`#/${state.lang}/p/advice`, P.advice.title)}
      ${row(`#/${state.lang}/p/about`, P.about.title)}
    </ul>
    <h2 class="group-title">${esc(T.appInfo)}</h2>
    <p class="card info" id="app-info">${esc(appInfoText())}</p>`;
  window.scrollTo(0, 0);
}

function renderPage(main, r) {
  const p = state.data[state.lang].pages[r.arg];
  main.innerHTML = `<h1 class="page-title">${esc(p.title)}</h1><div class="card prose page-body">${p.html}</div>
    <p class="src"><a href="${esc(p.source_url)}" target="_blank" rel="noopener">${esc(t().official)} ↗<span class="sr-only"> ${esc(t().opensNew)}</span></a></p>`;
  window.scrollTo(0, 0);
}

function renderCentres(main) {
  const T = t();
  const p = state.data[state.lang].pages.centres;
  if (!p) { renderNotFound(main); return; }
  // Une carte par centre (section « ## »), la note éventuelle (« ### ») sous le nom.
  // Les liens du contenu sont affichés en boutons : tel: = appeler, autres = site Web.
  const cards = p.sections.map(s => {
    const notes = s.children.map(c => `<p class="centre-note">${c.titleHtml}</p>`).join('');
    const body = s.html + s.children.map(c => c.html).join('');
    return `<li class="card centre"><h2>${s.titleHtml}</h2>${notes}<div class="centre-links">${body}</div></li>`;
  }).join('');
  main.innerHTML = `<h1 class="page-title">${esc(p.title)}</h1><ul class="centres">${cards}</ul>
    <p class="src">${esc(T.centresSub)} <a href="${esc(p.source_url)}" target="_blank" rel="noopener">${esc(T.official)} ↗<span class="sr-only"> ${esc(T.opensNew)}</span></a></p>`;
  main.querySelectorAll('.centre-links a').forEach(a => {
    const tel = a.getAttribute('href')?.startsWith('tel:');
    a.classList.add('btn', tel ? 'primary' : 'outline', 'centre-btn');
    a.insertAdjacentHTML('afterbegin', tel ? ICONS.phone : ICONS.web);
    if (!tel) { a.target = '_blank'; a.rel = 'noopener'; }
  });
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
    <div id="calc-out" aria-live="polite"></div>
    <p class="src">${esc(C.seeMono)} <a href="#/${state.lang}/m/${DIGOXIN_ID}/4">→</a></p>
    <details class="refs"><summary>${esc(C.sources)}</summary><ol>
      <li>${esc(C.srcLevel)}</li>
      <li>${esc(C.srcAmount)} ${esc(DIGIFAB_REFS.howland)}</li>
      <li>${esc(DIGIFAB_REFS.lapostolle)}</li>
      <li>${esc(DIGIFAB_REFS.antman)}</li></ol></details>`;

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
  const formulaHtml = `<strong>${esc(C.formula)}</strong><br><code>` + (level
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
  const crossWarn = level && !r.crossCheck.agrees ? `<p class="warnbox">⚠ ${esc(C.crossDiff)}</p>` : '';
  out.innerHTML = `${warns}${crossWarn}<div class="res-list">
      <details class="res-item"><summary><span class="res-title">${esc(C.result)}</span><span class="res-value">${esc(C.vials(r.vials))}</span><span class="chev" aria-hidden="true">⌄</span></summary>
        <div class="res-details"><p class="src">${esc(C.entered)} : ${esc(entered)}</p>
          <h3>${esc(C.steps)}</h3><ol class="steps">${stepHtml}</ol>
          <div class="formula">${formulaHtml}</div>${extra}</div></details>
      ${level ? `<div class="res-item static"><span class="res-title">${esc(C.partialShort)}</span><span class="res-value">${esc(C.vials(r.partial.vials))}</span></div>` : ''}
    </div><p class="hint">${esc(C.tapHint)}</p>`;
}

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
    if (e.data?.type === 'precached') checkOfflineReady();
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
    // service worker actif = pré-cache terminé (l'activation suit la mise en cache complète)
    const reg = await navigator.serviceWorker.getRegistration();
    const name = `${state.data?.cachePrefix || 'antidotes-'}${v}`;
    state.offlineReady = !!reg?.active && keys.includes(name) &&
      (await (await caches.open(name)).match('./data/content.json')) != null;
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
  // hauteur réelle de l'en-tête → barre d'outils de la monographie collée juste dessous
  const setTopH = () => document.documentElement.style.setProperty('--top-h', `${$('.topbar').offsetHeight}px`);
  setTopH();
  if ('ResizeObserver' in window) new ResizeObserver(setTopH).observe($('.topbar'));
  else window.addEventListener('resize', setTopH);
  if (state.data.staging) {
    document.body.classList.add('staging');
    $('.demo-banner').innerHTML = '<strong>VERSION DE TEST – non approuvée</strong> <span aria-hidden="true">/</span> <span lang="en">TEST VERSION – not approved</span> · DÉMO / DEMO';
  }
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
    const top = ($('.topbar')?.offsetHeight || 0) + ($('.mono-bar')?.offsetHeight || 0) + 4;
    let visible = null;
    for (const d of document.querySelectorAll('details.sec')) {
      const rect = d.getBoundingClientRect();
      if (rect.bottom > top) {
        visible = d.dataset.sec;
        if (rect.top >= top || !d.open) break;
      }
    }
    // sections identiques dans les deux langues ? sinon (section absente d'une langue sur le site officiel),
    // on ouvre la monographie au début plutôt que dans une section qui ne correspondrait pas
    const same = state.data.fr.monographs[r.arg]?.shape === state.data.en.monographs[r.arg]?.shape;
    state.pendingOpen = same ? opened : null;
    next.sec = same ? (visible || r.sec) : null;
    next.q = '';
  }
  if (r.view === 'home') next.q = '';
  const dlgOpen = $('#disclaimer').open;
  setLang(other);
  go(next);
  if (dlgOpen) showDisclaimer(true);
}

init();
