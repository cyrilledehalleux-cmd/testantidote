// Écrans des calculateurs de la phase 1 (acide-base / osmolalité, dextrose, éthanol, demi-vie).
// Les formules et constantes sont dans formulas.js ; ce fichier ne fait que l'affichage.
// Présentation : chaque résultat montre seulement la valeur (et son repère normal / élevé) ;
// un toucher sur le résultat déplie le détail du calcul, sur la même page.
import * as F from './formulas.js';

export const CALCS = ['acidbase', 'dextrose', 'ethanol', 'kinetics'];

export const CALC_INFO = {
  acidbase: { fr: ['Trou anionique, osmolalité, sodium corrigé'], en: ['Anion gap, osmolality, corrected sodium'] },
  dextrose: { fr: ['Dextrose – bolus'], en: ['Dextrose – bolus'] },
  ethanol: { fr: ['Éthanol – charge et entretien'], en: ['Ethanol – loading and maintenance'] },
  kinetics: { fr: ['Demi-vie et temps jusqu\'à la cible'], en: ['Half-life and time to target'] },
};

// Références (citations reprises de la spec de l'équipe, 8 nov. 2026)
const REFS = {
  acidbase: [
    'Winter SD, Pearson JR, Gabow PA, Schultz AL, Lepoff RB. The fall of the serum anion gap. Arch Intern Med 1990;150:311–3.',
    'Lolekha PH, Vanavanan S, Lolekha S. Update on value of the anion gap in clinical diagnosis and laboratory evaluation. Clin Chim Acta 2001;307:33–6.',
    'Figge J, Jabor A, Kazda A, Fencl V. Anion gap and hypoalbuminemia. Crit Care Med 1998;26:1807–10.',
    'Fencl V, Jabor A, Kazda A, Figge J. Diagnosis of metabolic acid-base disturbances in critically ill patients. Am J Respir Crit Care Med 2000;162:2246–51.',
    'Stewart PA. Modern quantitative acid-base chemistry. Can J Physiol Pharmacol 1983;61:1444–61.',
    'Kellum JA, Kramer DJ, Pinsky MR. Strong ion gap: a methodology for exploring unexplained anions. J Crit Care 1995;10:51–5.',
    'Story DA, Morimatsu H, Bellomo R. Strong ions, weak acids and base excess: a simplified Fencl–Stewart approach. Br J Anaesth 2004;92:54–60.',
    'Hillier TA, Abbott RD, Barrett EJ. Hyponatremia: evaluating the correction factor for hyperglycemia. Am J Med 1999;106:399–403.',
    'Purssell RA, Pudek M, Brubacher J, Abu-Laban RB. Derivation and validation of a formula to calculate the contribution of ethanol to the osmolal gap. Ann Emerg Med 2001;38:653–9.',
    'Garrard A, Sollee DR, Butterfield RC, et al. Validation of a pre-existing formula to calculate the contribution of ethanol to the osmolar gap. Clin Toxicol 2012;50:562–6.',
    'Khajuria A, Krahn J. Osmolality revisited: deriving and validating the best formula for calculated osmolality. Clin Biochem 2005;38:514–9.',
    'Krahn J, Khajuria A. Osmolality gaps: diagnostic accuracy and long-term variability. Clin Chem 2006;52:737–9.',
    'Lynd LD, Richardson KJ, Purssell RA, et al. An evaluation of the osmole gap as a screening test for toxic alcohol poisoning. BMC Emerg Med 2008;8:5.',
    'Borron SW. Acid-base balance in the poisoned patient. In: Brent J et al., eds. Critical Care Toxicology, 2nd ed. Springer, 2017, ch. 15.',
  ],
  dextrose: [
    'Lilien LD, Pildes RS, Srinivasan G, Voora S, Yeh TF. Treatment of neonatal hypoglycemia with minibolus and intravenous glucose infusion. J Pediatr 1980;97:295–8.',
    'Moore C, Woollard M. Dextrose 10% or 50% in the treatment of hypoglycaemia out of hospital? Emerg Med J 2005;22:512–5.',
  ],
  ethanol: [
    'Barceloux DG, Krenzelok EP, Olson K, Watson W. AACT practice guidelines on the treatment of ethylene glycol poisoning. J Toxicol Clin Toxicol 1999;37:537–60.',
    'Barceloux DG, Bond GR, Krenzelok EP, Cooper H, Vale JA. AACT practice guidelines on the treatment of methanol poisoning. J Toxicol Clin Toxicol 2002;40:415–46.',
    'Lister D, Tierney M, Dickinson G. Ethanol dosing in methanol or ethylene glycol poisoning. Can J Hosp Pharm 2005;58:142–7.',
    'McCoy HG, Cipolle RJ, Ehlers SM, Sawchuk RJ, Zaske DE. Severe methanol poisoning: application of a pharmacokinetic model for ethanol therapy and hemodialysis. Am J Med 1979;67:804–7.',
  ],
  kinetics: [
    'Rowland M, Tozer TN. Clinical Pharmacokinetics and Pharmacodynamics, 5th ed. Wolters Kluwer, 2019.',
    'Winter\'s Basic Clinical Pharmacokinetics.',
  ],
};

// ------------------------------------------------------------- outils communs ---
let ctx; // { lang, esc, fmt, store }
const tr = (fr, en) => (ctx.lang === 'fr' ? fr : en);
const $ = (s, el = document) => el.querySelector(s);
const f1 = x => ctx.fmt(x, 1);
const f2 = x => ctx.fmt(x, 2);
const dec = (x, d) => ctx.fmt(x, d); // nombre avec d décimales max (virgule en français)

const U = {
  mmol: { u: 'mmol/L', f: 1 }, meq: { u: 'mEq/L', f: 1 },
  glucose: [{ u: 'mmol/L', f: 1 }, { u: 'mg/dL', f: F.CONV.glucose }],
  urea: [{ u: 'mmol/L', f: 1, label: () => tr('urée mmol/L', 'urea mmol/L') }, { u: 'mg/dL', f: F.CONV.urea, label: () => tr('BUN mg/dL', 'BUN mg/dL') }],
  ethanol: [{ u: 'mmol/L', f: 1 }, { u: 'mg/dL', f: F.CONV.ethanol }],
  albumin: [{ u: 'g/L', f: 1 }, { u: 'g/dL', f: F.CONV.albumin }],
  phosphate: [{ u: 'mmol/L', f: 1 }, { u: 'mg/dL', f: F.CONV.phosphate }],
  caMg: [{ u: 'mmol/L', f: 1 }, { u: 'mEq/L', f: F.CONV.ionCaMg }],
  lactate: [{ u: 'mmol/L', f: 1 }, { u: 'mg/dL', f: F.CONV.lactate }],
  weight: [{ u: 'kg', f: 1 }, { u: 'lb', f: 1 / F.LB_TO_KG }],
};
U.electrolyte = [U.mmol, U.meq];

function store(id, defaults) {
  ctx.store[id] = ctx.store[id] || { ...defaults };
  return ctx.store[id];
}

/** Champ numérique + unité. units : [{u, f, label?}] ; SI = valeur / f. */
function numField(S, key, label, units, { hint = '', optional = false, neg = false } = {}) {
  const unitKey = key + 'Unit';
  if (units && !S[unitKey]) S[unitKey] = units[0].u;
  const sel = units && units.length > 1
    ? `<select id="${key}Unit" name="${unitKey}" aria-label="${ctx.esc(label)} – ${tr('unité', 'unit')}">${units.map(x =>
      `<option value="${x.u}"${x.u === S[unitKey] ? ' selected' : ''}>${ctx.esc(x.label ? x.label() : x.u)}</option>`).join('')}</select>`
    : units ? `<span class="unit-fixed">${ctx.esc(units[0].label ? units[0].label() : units[0].u)}</span>` : '';
  return `<div class="field"><label for="${key}">${ctx.esc(label)}${optional ? ` <span class="opt">(${tr('facultatif', 'optional')})</span>` : ''}</label>
    <div class="row"><input id="${key}" name="${key}" inputmode="${neg ? 'text' : 'decimal'}" autocomplete="off" value="${ctx.esc(S[key] ?? '')}">${sel}</div>
    ${hint ? `<p class="hint">${hint}</p>` : ''}</div>`;
}

/** Lit un champ : { blank } ou { si, raw, unit, converted } ou { error }. */
function read(S, key, label, units, boundsKey, { neg = false } = {}) {
  const raw = S[key];
  if (F.isBlank(raw)) return { blank: true };
  const v = F.parseNum(raw, { allowNegative: neg });
  if (!Number.isFinite(v)) return { error: tr(`${label} : entrez un nombre.`, `${label}: enter a number.`) };
  const unit = units ? (units.find(x => x.u === S[key + 'Unit']) || units[0]) : { f: 1, u: '' };
  const si = v / unit.f;
  const b = F.BOUNDS[boundsKey];
  if (b && (si < b[0] || si > b[1])) {
    const lo = dec(b[0] * unit.f, 2), hi = dec(b[1] * unit.f, 2);
    return { error: tr(`${label} : ${dec(v, 4)} ${unit.u} est hors des bornes acceptées (${lo} à ${hi} ${unit.u}). Aucun résultat affiché.`,
      `${label}: ${dec(v, 4)} ${unit.u} is outside the accepted range (${lo} to ${hi} ${unit.u}). No result shown.`) };
  }
  return { si, raw: v, unit: unit.u, converted: unit.f !== 1 };
}

const banner = () => `<p class="calc-banner" role="note">⚠ ${tr('Outil de démonstration – vérifier le calcul', 'Demo tool – verify the calculation')}</p>`;
const discrepancy = () => `<p class="note-small">ⓘ ${tr('Le résultat peut différer légèrement des doses publiées (arrondis et conversions d\'unités SI).', 'Results may differ slightly from published doses (rounding and SI unit conversions).')}</p>`;
const refsHtml = id => `<details class="refs"><summary>${tr('Références', 'References')}</summary><ol>${REFS[id].map(r => `<li>${ctx.esc(r)}</li>`).join('')}</ol>
  <p class="note-small">${tr('Formules et décisions : spécification de l\'équipe « Phase 1 toxicology equations » (8 nov. 2026).', 'Formulas and decisions: team specification “Phase 1 toxicology equations” (8 Nov 2026).')}</p></details>`;
const errorsHtml = errs => `<div class="result err" role="alert"><ul>${errs.map(e => `<li>${ctx.esc(e)}</li>`).join('')}</ul></div>`;
const step = s => `<li><code>${ctx.esc(s)}</code></li>`;
const convLine = (label, r) => r && r.converted ? step(`${label} : ${dec(r.raw, 4)} ${r.unit} → ${dec(r.si, 4)} (SI)`) : '';
// Seule une valeur anormale est mise en évidence ; une valeur normale reste discrète (« normal – voir détails »).
const badge = (high, highText) => high
  ? `<span class="badge high">${ctx.esc(highText)}</span>`
  : `<span class="badge plain">${ctx.esc(tr('normal – voir détails', 'normal – see details'))}</span>`;

/**
 * Résultat compact : une ligne (titre + valeur + repère), le détail se déplie au toucher.
 * key : identifiant pour garder l'état ouvert/fermé quand les valeurs changent.
 */
function resItem(key, title, valueHtml, detailsHtml, { extra = '' } = {}) {
  const open = ctx.openRes.has(key) ? ' open' : '';
  return `<details class="res-item" data-key="${key}"${open}>
    <summary><span class="res-title">${title}</span><span class="res-value">${valueHtml}</span>${extra}<span class="chev" aria-hidden="true">⌄</span></summary>
    <div class="res-details">${detailsHtml}</div></details>`;
}
const pendingItem = (title, missing) => `<div class="res-item pending"><span class="res-title">${title}</span>
  <span class="res-value">—</span><span class="res-missing">${ctx.esc(tr('Entrez', 'Enter'))} ${ctx.esc(missing)}</span></div>`;

function bind(main, S, draw) {
  const form = $('#calc-form', main);
  const update = () => {
    const fd = new FormData(form);
    for (const [k, v] of fd.entries()) S[k] = String(v);
    form.querySelectorAll('input[type=checkbox]').forEach(cb => { S[cb.name] = cb.checked ? '1' : ''; });
    form.querySelectorAll('[data-show-if]').forEach(el => {
      const [k, v] = el.dataset.showIf.split('=');
      el.hidden = v ? S[k] !== v : !S[k];
    });
    draw();
  };
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  form.addEventListener('submit', e => e.preventDefault());
  // mémoriser quels résultats sont dépliés (le contenu est redessiné à chaque saisie)
  main.addEventListener('toggle', e => {
    const d = e.target;
    if (d.classList?.contains('res-item') && d.dataset.key) {
      if (d.open) ctx.openRes.add(d.dataset.key); else ctx.openRes.delete(d.dataset.key);
    }
  }, true);
  update();
}

// ================================================ 1–5. acide-base et osmolalité ===
function renderAcidBase(main) {
  const S = store('acidbase', {});
  const advanced = !!S.advanced;
  main.innerHTML = `
    <h1 class="page-title">${CALC_INFO.acidbase[ctx.lang][0]}</h1>
    ${banner()}
    <div class="with-jump">
      <form id="calc-form" novalidate>
        <fieldset><legend>${tr('Biochimie', 'Chemistry')}</legend>
          <div class="grid2">
            ${numField(S, 'na', 'Na', U.electrolyte)}
            ${numField(S, 'cl', 'Cl', U.electrolyte)}
            ${numField(S, 'hco3', 'HCO3', U.electrolyte)}
            ${numField(S, 'glucose', tr('Glucose', 'Glucose'), U.glucose)}
            ${numField(S, 'urea', tr('Urée / BUN', 'Urea / BUN'), U.urea)}
            ${numField(S, 'ethanol', tr('Éthanol', 'Ethanol'), U.ethanol, { optional: true, hint: tr('0 si non mesuré', '0 if not measured') })}
            ${numField(S, 'albumin', tr('Albumine', 'Albumin'), U.albumin)}
            ${numField(S, 'measured', tr('Osmolalité mesurée', 'Measured osmolality'), [{ u: 'mOsm/kg', f: 1 }], { hint: tr('Point de congélation', 'Freezing point') })}
          </div>
        </fieldset>
        <label class="toggle"><input type="checkbox" name="advanced"${advanced ? ' checked' : ''}> ${tr('Avancé : Stewart', 'Advanced: Stewart')}</label>
        <fieldset data-show-if="advanced"${advanced ? '' : ' hidden'}><legend>Stewart</legend>
          <div class="grid2">
            ${numField(S, 'k', 'K', U.electrolyte)}
            ${numField(S, 'ica', tr('Ca ionisé', 'Ionized Ca'), U.caMg)}
            ${numField(S, 'mg', 'Mg', U.caMg)}
            ${numField(S, 'lactate', tr('Lactate', 'Lactate'), U.lactate)}
            ${numField(S, 'phosphate', tr('Phosphate', 'Phosphate'), U.phosphate)}
            ${numField(S, 'ph', 'pH', null)}
            ${numField(S, 'be', tr('Excès de base', 'Base excess'), U.electrolyte, { optional: true, neg: true, hint: tr('Version simplifiée (Story 2004)', 'Simplified version (Story 2004)') })}
          </div>
        </fieldset>
      </form>
      <a class="jump-btn" href="#calc-out" id="jump-btn"><span>${tr('Résultats', 'Results')} ↓</span></a>
    </div>
    <h2 class="results-title" id="results-title" tabindex="-1">${tr('Résultats', 'Results')}</h2>
    <div id="calc-out" aria-live="polite"></div>
    ${discrepancy()}
    ${refsHtml('acidbase')}`;
  $('#jump-btn', main).addEventListener('click', e => {
    e.preventDefault();
    const el = $('#results-title');
    const top = ($('.topbar')?.offsetHeight || 0) + 8;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - top, behavior: 'smooth' });
    el.focus({ preventScroll: true });
  });
  bind(main, S, () => drawAcidBase(S));
  window.scrollTo(0, 0);
}

function drawAcidBase(S) {
  const L = {
    na: ['Na', U.electrolyte, 'na'], cl: ['Cl', U.electrolyte, 'cl'], hco3: ['HCO3', U.electrolyte, 'hco3'],
    glucose: [tr('glucose', 'glucose'), U.glucose, 'glucose'], urea: [tr('urée', 'urea'), U.urea, 'urea'],
    ethanol: [tr('éthanol', 'ethanol'), U.ethanol, 'ethanol'], albumin: [tr('albumine', 'albumin'), U.albumin, 'albumin'],
    measured: [tr('osmolalité mesurée', 'measured osmolality'), null, 'measured'],
    k: ['K', U.electrolyte, 'k'], ica: [tr('Ca ionisé', 'ionized Ca'), U.caMg, 'ica'], mg: ['Mg', U.caMg, 'mg'],
    lactate: [tr('lactate', 'lactate'), U.lactate, 'lactate'], phosphate: [tr('phosphate', 'phosphate'), U.phosphate, 'phosphate'], ph: ['pH', null, 'ph'],
    be: [tr('excès de base', 'base excess'), U.electrolyte, 'be'],
  };
  const ADV = ['k', 'ica', 'mg', 'lactate', 'phosphate', 'ph', 'be'];
  const v = {}, errs = [];
  for (const [k, [label, units, b]] of Object.entries(L)) {
    if (!S.advanced && ADV.includes(k)) { v[k] = { blank: true }; continue; }
    v[k] = read(S, k, label, units, b, { neg: k === 'be' });
    if (v[k].error) errs.push(v[k].error);
  }
  const out = $('#calc-out');
  if (errs.length) { out.innerHTML = errorsHtml(errs); return; }
  const has = (...ks) => ks.every(k => !v[k].blank);
  const missing = (...ks) => ks.filter(k => v[k].blank).map(k => L[k][0]).join(', ');
  const conv = ks => ks.map(k => convLine(L[k][0], v[k])).join('');
  const hi = F.AG_HIGH, items = [];
  const highTxt = n => tr(`élevé (> ${n})`, `high (> ${n})`);

  // 1. trou anionique
  let ag = null;
  const tAG = tr('Trou anionique', 'Anion gap');
  if (has('na', 'cl', 'hco3')) {
    ag = F.anionGap({ na: v.na.si, cl: v.cl.si, hco3: v.hco3.si });
    items.push(resItem('ag', tAG, `${f1(ag.value)} <small>mmol/L</small>`, `
      <ol class="steps">${conv(['na', 'cl', 'hco3'])}${step(`AG = Na − (Cl + HCO3) = ${f2(v.na.si)} − (${f2(v.cl.si)} + ${f2(v.hco3.si)}) = ${f2(ag.value)}`)}</ol>
      <p class="note-small">${tr('Sans K (Winter 1990, Lolekha 2001). Électrodes sélectives : normal 3–11 (Winter) ou 5–12 mmol/L (Lolekha) ; l\'ancien 12 ± 4 vient de la photométrie de flamme. L\'intervalle de référence dépend de l\'analyseur de votre laboratoire.',
        'Without K (Winter 1990, Lolekha 2001). Ion-selective electrodes: normal 3–11 (Winter) or 5–12 mmol/L (Lolekha); the old 12 ± 4 came from flame photometry. Reference range depends on your laboratory\'s analyzer.')}</p>`,
      { extra: badge(ag.high, highTxt(hi)) }));
  } else items.push(pendingItem(tAG, missing('na', 'cl', 'hco3')));

  // 2. trou anionique corrigé
  const tAGc = tr('Trou anionique corrigé (albumine)', 'Albumin-corrected anion gap');
  if (ag && has('albumin')) {
    const c = F.correctedAnionGap({ ag: ag.value, albumin: v.albumin.si });
    items.push(resItem('agc', tAGc, `${f1(c.value)} <small>mmol/L</small>`, `
      <ol class="steps">${conv(['albumin'])}${step(`AGcorr = AG + ${dec(0.25, 2)} × (40 − ${tr('albumine', 'albumin')}) = ${f2(ag.value)} + ${dec(0.25, 2)} × (40 − ${f2(v.albumin.si)}) = ${f2(c.value)}`)}</ol>
      <p class="note-small">${tr('Figge. Albumine normale fixée à 40 g/L (comme MDCalc) ; Figge 1998 utilisait 44 g/L : la correction de l\'application est donc légèrement plus petite que l\'originale.', 'Figge. Normal albumin fixed at 40 g/L; Figge 1998 used 44 g/L, so the app\'s correction is slightly smaller than the original.')}</p>`,
      { extra: badge(c.high, highTxt(hi)) }));
  } else items.push(pendingItem(tAGc, missing('na', 'cl', 'hco3', 'albumin')));

  // 4. sodium corrigé
  const tNa = tr('Sodium corrigé (Hillier)', 'Corrected sodium (Hillier)');
  if (has('na', 'glucose')) {
    const n = F.correctedSodium({ na: v.na.si, glucose: v.glucose.si });
    items.push(resItem('na', tNa, `${f1(n.value)} <small>mmol/L</small>`, `
      <ol class="steps">${conv(['glucose'])}${step(`Na corr = Na + ${dec(0.43, 2)} × (${tr('glucose', 'glucose')} − ${dec(5.6, 1)}) = ${f2(v.na.si)} + ${dec(0.43, 2)} × (${f2(v.glucose.si)} − ${dec(5.6, 1)}) = ${f2(n.value)}`)}</ol>
      ${n.nonLinear ? `<p class="warnbox">⚠ ${tr('Glucose > 22 mmol/L (400 mg/dL) : la correction réelle peut être plus grande (facteur ≈ 4,0 au-delà selon Hillier).', 'Glucose > 22 mmol/L (400 mg/dL): true correction may be larger (factor ≈ 4.0 above it per Hillier).')}</p>` : ''}
      <p class="note-small">${tr('2,4 mmol/L par 100 mg/dL au-delà de 100 mg/dL, converti : 2,4 / 5,55 = 0,43 par mmol/L au-delà de 5,6 mmol/L.', '2.4 mmol/L per 100 mg/dL above 100 mg/dL, converted: 2.4 / 5.55 = 0.43 per mmol/L above 5.6 mmol/L.')}</p>`,
      { extra: n.nonLinear ? `<span class="badge warn">${tr('glucose > 22 : voir détail', 'glucose > 22: see details')}</span>` : '' }));
  } else items.push(pendingItem(tNa, missing('na', 'glucose')));

  // 5. osmolalité et écart osmolaire
  const tOsm = tr('Osmolalité calculée', 'Calculated osmolality'), tGap = tr('Écart osmolaire', 'Osmole gap');
  if (has('na', 'glucose', 'urea')) {
    const eth = v.ethanol.blank ? 0 : v.ethanol.si;
    const o = F.osmolality({ na: v.na.si, glucose: v.glucose.si, urea: v.urea.si, ethanol: eth, measured: v.measured.blank ? null : v.measured.si });
    const osmSteps = `<ol class="steps">${conv(['glucose', 'urea', 'ethanol'])}
        ${step(`Osm calc = 2 Na + ${tr('glucose', 'glucose')} + ${tr('urée', 'urea')} + ${dec(1.25, 2)} × ${tr('éthanol', 'ethanol')} = 2 × ${f2(v.na.si)} + ${f2(v.glucose.si)} + ${f2(v.urea.si)} + ${dec(1.25, 2)} × ${f2(eth)} = ${f2(o.calc)}`)}</ol>
        ${v.ethanol.blank ? `<p class="note-small">${tr('Éthanol non entré : compté comme 0.', 'Ethanol not entered: counted as 0.')}</p>` : ''}
        <p class="note-small">${tr('Purssell 2001 : 1,25 = pente de régression (effet de chaque mmol/L d\'éthanol). Na non corrigé pour le glucose dans cette formule.', 'Purssell 2001: 1.25 = regression slope (effect of each mmol/L of ethanol). Na not corrected for glucose in this formula.')}</p>`;
    items.push(resItem('osm', tOsm, `${f1(o.calc)} <small>mOsm/kg</small>`, osmSteps));
    if (o.gap != null) {
      items.push(resItem('gap', tGap, `${f1(o.gap)} <small>mOsm/kg</small>`, `
        <ol class="steps">${step(`${tr('Écart', 'Gap')} = ${tr('mesurée', 'measured')} − ${tr('calculée', 'calculated')} = ${f2(v.measured.si)} − ${f2(o.calc)} = ${f2(o.gap)}`)}</ol>
        <p class="note-small">${tr('Écart normal avec cette formule : environ −10 à +12 (Purssell) ; seuil > 10 : sensibilité 0,85–1,0 mais spécificité 0,22–0,5 (Lynd 2008). Un écart normal n\'exclut pas un alcool toxique ; les seuils dépendent du laboratoire (dérive de 12 mOsm/kg en 8 ans, Krahn 2006). Osmolalité mesurée par point de congélation seulement (la pression de vapeur manque les alcools volatils).',
          'Normal gap with this formula: about −10 to +12 (Purssell); threshold > 10: sensitivity 0.85–1.0 but specificity 0.22–0.5 (Lynd 2008). A normal gap does not exclude a toxic alcohol; cut-offs depend on the laboratory (12 mOsm/kg drift over 8 years, Krahn 2006). Measured osmolality by freezing point only (vapor pressure misses volatile alcohols).')}</p>`,
        { extra: badge(o.high, tr(`élevé (> ${F.OSM_GAP_HIGH})`, `elevated (> ${F.OSM_GAP_HIGH})`)) }));
    } else items.push(pendingItem(tGap, L.measured[0]));
  } else {
    items.push(pendingItem(tOsm, missing('na', 'glucose', 'urea')));
    items.push(pendingItem(tGap, missing('na', 'glucose', 'urea', 'measured')));
  }

  // 3. Stewart (avancé)
  if (S.advanced) {
    const tS = 'Stewart';
    const need = ['na', 'k', 'ica', 'mg', 'cl', 'lactate', 'hco3', 'albumin', 'phosphate', 'ph'];
    if (has(...need)) {
      const g = F.strongIonGap({ na: v.na.si, k: v.k.si, ica: v.ica.si, mg: v.mg.si, cl: v.cl.si, lactate: v.lactate.si,
        hco3: v.hco3.si, albumin: v.albumin.si, phosphate: v.phosphate.si, ph: v.ph.si });
      items.push(resItem('sig', tS,
        `<span class="trio"><span><small>SIG</small> ${f1(g.sig)}</span><span><small>SIDa</small> ${f1(g.sida)}</span><span><small>SIDe</small> ${f1(g.side)}</span></span> <small>mEq/L</small>`, `
        <ol class="steps">${conv(['ica', 'mg', 'lactate', 'phosphate'])}
          ${step(`SIDa = Na + K + 2 Ca + 2 Mg − Cl − lactate = ${f2(v.na.si)} + ${f2(v.k.si)} + 2 × ${f2(v.ica.si)} + 2 × ${f2(v.mg.si)} − ${f2(v.cl.si)} − ${f2(v.lactate.si)} = ${f2(g.sida)}`)}
          ${step(`SIDe = HCO3 + Alb × (${dec(0.123, 3)} pH − ${dec(0.631, 3)}) + Phos × (${dec(0.309, 3)} pH − ${dec(0.469, 3)}) = ${f2(v.hco3.si)} + ${f2(g.albTerm)} + ${f2(g.phosTerm)} = ${f2(g.side)}`)}
          ${step(`SIG = SIDa − SIDe = ${f2(g.sida)} − ${f2(g.side)} = ${f2(g.sig)}`)}</ol>
        <p class="note-small">${tr('Fencl 2000, équations 2a et 2b, albumine en g/L (Kellum 1995 imprime « g/dL » : erreur d\'un facteur 10). SIG normalement ≈ 0 ; patients de soins intensifs avec anions non mesurés connus : 4,6 et 9,6 mEq/L en moyenne (Kellum).', 'Fencl 2000, equations 2a and 2b, albumin in g/L (Kellum 1995 prints “g/dL”: a 10-fold error). SIG normally ≈ 0; ICU patients with known unmeasured anions averaged 4.6 and 9.6 mEq/L (Kellum).')}</p>`));
    } else items.push(pendingItem(tS, missing(...need)));
    if (has('na', 'cl', 'albumin', 'be')) {
      const s = F.storyUnmeasuredAnions({ na: v.na.si, cl: v.cl.si, albumin: v.albumin.si, be: v.be.si });
      items.push(resItem('story', tr('Anions non mesurés (Story)', 'Unmeasured anions (Story)'), `${f1(s.uma)} <small>mEq/L</small>`, `
        <ol class="steps">${step(`${tr('Effet Na–Cl', 'Na–Cl effect')} = Na − Cl − 38 = ${f2(v.na.si)} − ${f2(v.cl.si)} − 38 = ${f2(s.naCl)}`)}
          ${step(`${tr('Effet albumine', 'Albumin effect')} = ${dec(0.25, 2)} × (42 − ${f2(v.albumin.si)}) = ${f2(s.alb)}`)}
          ${step(`${tr('Anions non mesurés', 'Unmeasured anions')} = ${tr('EB', 'BE')} − ${tr('effet Na–Cl', 'Na–Cl effect')} − ${tr('effet albumine', 'albumin effect')} = ${f2(v.be.si)} − ${f2(s.naCl)} − ${f2(s.alb)} = ${f2(s.uma)}`)}</ol>
        <p class="note-small">Story 2004.</p>`));
    }
  }
  out.innerHTML = `<div class="res-list">${items.join('')}</div><p class="hint">${tr('Touchez un résultat pour voir le détail du calcul.', 'Tap a result to see the calculation.')}</p>`;
}

// ================================================================ dextrose ===
function renderDextrose(main) {
  const S = store('dextrose', { target: '0.25', solution: F.DEXTROSE_DEFAULT_SOLUTION });
  main.innerHTML = `
    <h1 class="page-title">${CALC_INFO.dextrose[ctx.lang][0]}</h1>
    ${banner()}
    <form id="calc-form" novalidate>
      <fieldset><legend>${tr('Bolus', 'Bolus')}</legend>
        ${numField(S, 'weight', tr('Poids', 'Weight'), U.weight)}
        <p class="field-label">${tr('Dose cible', 'Target dose')}</p>
        <div class="radio-row">
          ${['0.25', '0.5', 'free'].map(x => `<label><input type="radio" name="target" value="${x}"${S.target === x ? ' checked' : ''}> ${x === 'free' ? tr('Autre', 'Other') : dec(Number(x), 2) + ' g/kg'}</label>`).join('')}
        </div>
        <div data-show-if="target=free"${S.target === 'free' ? '' : ' hidden'}>${numField(S, 'free', tr('Dose cible (autre)', 'Target dose (other)'), [{ u: 'g/kg', f: 1 }])}</div>
        <p class="field-label">${tr('Solution', 'Solution')}</p>
        <div class="radio-row">
          ${F.DEXTROSE_SOLUTIONS.map(x => `<label><input type="radio" name="solution" value="${x.id}"${S.solution === x.id ? ' checked' : ''}> ${x.id.replace('D', 'D')} %${x.id === 'D10' ? ` <span class="muted">(${tr('préférée en pédiatrie', 'preferred in pediatrics')})</span>` : ''}</label>`).join('').replace(/D(\d+) %/g, 'D$1')}
        </div>
      </fieldset>
      <details class="sub"${S.girOpen ? ' open' : ''}><summary>${tr('Débit de glucose en perfusion (facultatif)', 'Glucose infusion rate (optional)')}</summary>
        <div class="grid2">
          ${numField(S, 'pct', tr('Concentration de dextrose', 'Dextrose concentration'), [{ u: '%', f: 1 }])}
          ${numField(S, 'rate', tr('Débit', 'Rate'), [{ u: 'mL/h', f: 1 }])}
        </div>
        <div id="gir-out" aria-live="polite"></div>
      </details>
    </form>
    <div id="calc-out" aria-live="polite"></div>
    ${refsHtml('dextrose')}`;
  $('details.sub', main).addEventListener('toggle', e => { S.girOpen = e.target.open ? '1' : ''; });
  bind(main, S, () => drawDextrose(S));
  window.scrollTo(0, 0);
}

function drawDextrose(S) {
  const out = $('#calc-out'), gir = $('#gir-out');
  const w = read(S, 'weight', tr('Poids', 'Weight'), U.weight, 'weight');
  // débit de glucose
  const pct = read(S, 'pct', tr('Concentration', 'Concentration'), null, 'percent');
  const rate = read(S, 'rate', tr('Débit', 'Rate'), null, 'rateMlH');
  const ge = [w, pct, rate].filter(x => x.error).map(x => x.error);
  if (ge.length) gir.innerHTML = errorsHtml(ge);
  else if (w.blank || pct.blank || rate.blank) gir.innerHTML = `<p class="muted">${tr('Entrez le poids, la concentration et le débit.', 'Enter weight, concentration and rate.')}</p>`;
  else {
    const g = F.glucoseInfusionRate({ percent: pct.si, rateMlH: rate.si, weightKg: w.si });
    gir.innerHTML = resItem('gir', tr('Débit de glucose', 'Glucose infusion rate'), `${f2(g)} <small>mg/kg/min</small>`,
      `<ol class="steps">${step(`GIR = % × ${tr('débit', 'rate')} × 10 / (60 × ${tr('poids', 'weight')}) = ${dec(pct.si, 2)} × ${dec(rate.si, 2)} × 10 / (60 × ${f2(w.si)}) = ${f2(g)}`)}</ol>`);
  }
  // bolus
  if (w.error) { out.innerHTML = errorsHtml([w.error]); return; }
  let free = null;
  if (S.target === 'free') {
    free = read(S, 'free', tr('Dose cible', 'Target dose'), [{ u: 'g/kg', f: 1 }], 'dextroseTarget');
    if (free.error) { out.innerHTML = errorsHtml([free.error]); return; }
  }
  if (w.blank || (free && free.blank)) { out.innerHTML = `<div class="result empty">${tr('Entrez le poids pour obtenir le calcul.', 'Enter the weight to see the calculation.')}</div>`; return; }
  const col2 = 0.25, col3 = free ? free.si : 0.5;
  const a = F.dextroseBolus({ weightKg: w.si, targetGPerKg: col2 }), b = F.dextroseBolus({ weightKg: w.si, targetGPerKg: col3 });
  const sel = S.target === '0.25' ? 2 : 3;
  const chosen = sel === 2 ? a : b, chosenT = sel === 2 ? col2 : col3;
  const head = (t, d) => `${dec(t, 3)} g/kg<br><span class="muted">${dec(d.doseG, 2)} g${d.capped ? ' (max)' : ''}</span>`;
  const rows = F.DEXTROSE_SOLUTIONS.map((s, i) => `<tr${s.id === S.solution ? ' class="hl"' : ''}><th scope="row">${s.id}${s.id === 'D10' ? ` <span class="tag">${tr('pédiatrie', 'pediatrics')}</span>` : ''}</th>` +
    `<td${sel === 2 ? ' class="sel"' : ''}>${f1(a.volumes[i].ml)}</td><td${sel === 3 ? ' class="sel"' : ''}>${f1(b.volumes[i].ml)}</td></tr>`).join('');
  const capped = [a, b].some(d => d.capped);
  const si = F.DEXTROSE_SOLUTIONS.findIndex(x => x.id === S.solution);
  const solIdx = si < 0 ? 1 : si, sol = F.DEXTROSE_SOLUTIONS[solIdx];
  const mainMl = chosen.volumes[solIdx].ml;
  out.innerHTML = `<div class="res-list">${resItem('dex', `${tr('Volume à administrer', 'Volume to give')} <small class="muted">${dec(chosenT, 3)} g/kg</small>`,
    `${f1(mainMl)} <small>mL ${tr('de', 'of')}</small> ${sol.id}`, `
    <div class="table-wrap"><table class="calc-table dex"><thead><tr><th>mL</th><th>${head(col2, a)}</th><th>${head(col3, b)}</th></tr></thead><tbody>${rows}</tbody></table></div>
      <ol class="steps">${convLine(tr('Poids', 'Weight'), w)}${step(`${tr('Dose', 'Dose')} (g) = min(${tr('poids', 'weight')} × ${tr('cible', 'target')}, 25) = min(${f2(w.si)} × ${dec(chosenT, 3)}, 25) = ${dec(chosen.doseG, 3)}`)}
        ${step(`mL = ${tr('dose', 'dose')} (g) / ${tr('concentration', 'concentration')} (g/mL) = ${dec(chosen.doseG, 3)} / ${dec(sol.gPerMl, 2)} = ${f1(mainMl)}`)}</ol>
      ${capped ? `<p class="warnbox">⚠ ${tr(`Plafond de ${F.DEXTROSE_MAX_G} g appliqué (poids × dose cible > ${F.DEXTROSE_MAX_G} g).`, `${F.DEXTROSE_MAX_G} g cap applied (weight × target > ${F.DEXTROSE_MAX_G} g).`)}</p>` : ''}
      <p>• ${tr('Préférer D10 en périphérie et chez l\'enfant ; D50 est hypertonique et irritant ; nouveau-nés : D10 seulement.', 'Prefer D10 peripherally and in children; D50 is hypertonic and irritant; neonates: D10 only.')}</p>
      <p>• ${tr('Recontrôler la glycémie 10–15 min après le bolus.', 'Recheck glucose 10–15 min after the bolus.')}</p>
      <p class="note-small">${tr('0,2–0,25 g/kg : dose néonatale (Lilien 1980, mini-bolus de 2 mL/kg de D10). D10 vs D50 chez l\'adulte : même délai de récupération, moins de glucose avec D10 (Moore & Woollard 2005). 0,5 g/kg : pratique de réanimation pédiatrique (PALS).', '0.2–0.25 g/kg: neonatal dose (Lilien 1980, 2 mL/kg D10 mini-bolus). D10 vs D50 in adults: same recovery time, less glucose with D10 (Moore & Woollard 2005). 0.5 g/kg: pediatric resuscitation practice (PALS).')}</p>`,
    { extra: `<span class="res-sub">${dec(chosen.doseG, 2)} g ${tr('de dextrose', 'of dextrose')}</span>${capped ? `<span class="badge warn">${tr(`plafond ${F.DEXTROSE_MAX_G} g`, `${F.DEXTROSE_MAX_G} g cap`)}</span>` : ''}` })}</div>
    <p class="hint">${tr('Touchez le résultat pour voir toutes les solutions et le détail du calcul.', 'Tap the result to see all solutions and the calculation.')}</p>`;
}

// ================================================================= éthanol ===
const DRINK_NAME = {
  beer: n => tr(n > 1 ? 'bières' : 'bière', n > 1 ? 'beers' : 'beer'),
  wine: n => tr(n > 1 ? 'verres de vin' : 'verre de vin', n > 1 ? 'glasses of wine' : 'glass of wine'),
  shot: n => tr(n > 1 ? 'shots' : 'shot', n > 1 ? 'shots' : 'shot'),
};
// libellés des teneurs dans le formulaire (le résultat ne nomme pas de breuvage)
const STRENGTH_LABEL = { 5: () => tr('bière', 'beer'), 10: () => tr('vin ou IV', 'wine or IV'), 40: () => tr('spiritueux', 'spirits') };

function drinksText(ml, percent, perHour = false) {
  const d = F.drinkEquivalent(ml, percent);
  if (!d) return '';
  const num = d.whole === 0 && !d.frac ? tr('moins de ¼', 'less than ¼') : `${d.whole || ''}${d.whole && d.frac ? ' ' : ''}${d.frac}`;
  return `≈ ${num} ${DRINK_NAME[d.id](d.value)}${perHour ? '/h' : ''} <span class="muted">(${d.servingMl} mL)</span>`;
}

function renderEthanol(main) {
  const S = store('ethanol', { target: String(F.ETHANOL.TARGET_DEFAULT), current: '0', strength: '10', route: 'IV', history: 'average' });
  main.innerHTML = `
    <h1 class="page-title">${CALC_INFO.ethanol[ctx.lang][0]}</h1>
    ${banner()}
    <p class="hint">${tr('Méthanol, éthylène glycol ; patient sans dialyse (les centres de dialyse utilisent le fomépizole).', 'Methanol, ethylene glycol; patient without dialysis (dialysis centres use fomepizole).')}</p>
    <form id="calc-form" novalidate>
      <fieldset><legend>${tr('Patient et cible', 'Patient and target')}</legend>
        ${numField(S, 'weight', tr('Poids', 'Weight'), U.weight)}
        ${numField(S, 'target', tr('Éthanolémie cible', 'Target ethanol level'), U.ethanol, { hint: tr('AACT : 22–33 mmol/L (100–150 mg/dL)', 'AACT: 22–33 mmol/L (100–150 mg/dL)') })}
        ${numField(S, 'current', tr('Éthanolémie actuelle', 'Current ethanol level'), U.ethanol, { hint: tr('0 si aucun éthanol', '0 if none') })}
      </fieldset>
      <fieldset><legend>${tr('Produit et voie', 'Product and route')}</legend>
        <p class="field-label">${tr('Teneur (% v/v)', 'Strength (% v/v)')}</p>
        <div class="radio-row">${[...F.ETHANOL.STRENGTHS.map(String), 'free'].map(x => `<label><input type="radio" name="strength" value="${x}"${S.strength === x ? ' checked' : ''}> ${x === 'free' ? tr('Autre', 'Other') : `${x} %${STRENGTH_LABEL[x] ? ` <span class="muted">(${STRENGTH_LABEL[x]()})</span>` : ''}`}</label>`).join('')}</div>
        <div data-show-if="strength=free"${S.strength === 'free' ? '' : ' hidden'}>${numField(S, 'pct', tr('Teneur (autre)', 'Strength (other)'), [{ u: '% v/v', f: 1 }])}</div>
        <p class="field-label">${tr('Voie', 'Route')}</p>
        <div class="radio-row">${[['IV', 'IV'], ['PO', tr('PO (orale)', 'PO (oral)')]].map(([x, l]) => `<label><input type="radio" name="route" value="${x}"${S.route === x ? ' checked' : ''}> ${l}</label>`).join('')}</div>
        <p class="field-label">${tr('Consommation d\'alcool habituelle (entretien)', 'Drinking history (maintenance)')}</p>
        <div class="radio-row">${[['nonDrinker', tr('Non-buveur', 'Non-drinker')], ['average', tr('Moyenne', 'Average')], ['heavy', tr('Buveur chronique important', 'Chronic heavy drinker')]].map(([x, l]) => `<label><input type="radio" name="history" value="${x}"${S.history === x ? ' checked' : ''}> ${l}</label>`).join('')}</div>
      </fieldset>
    </form>
    <div id="calc-out" aria-live="polite"></div>
    ${discrepancy()}
    ${refsHtml('ethanol')}`;
  bind(main, S, () => drawEthanol(S));
  window.scrollTo(0, 0);
}

function drawEthanol(S) {
  const out = $('#calc-out');
  const w = read(S, 'weight', tr('Poids', 'Weight'), U.weight, 'weight');
  const tg = read(S, 'target', tr('Éthanolémie cible', 'Target ethanol level'), U.ethanol, 'ethanolTarget');
  const cu = S.current === '' ? { si: 0, blank: false } : read(S, 'current', tr('Éthanolémie actuelle', 'Current ethanol level'), U.ethanol, 'ethanolCurrent');
  const pct = S.strength === 'free' ? read(S, 'pct', tr('Teneur', 'Strength'), null, 'ethanolPercent') : { si: Number(S.strength) };
  const errs = [w, tg, cu, pct].filter(x => x.error).map(x => x.error);
  if (errs.length) { out.innerHTML = errorsHtml(errs); return; }
  if (w.blank || tg.blank || pct.blank) { out.innerHTML = `<div class="result empty">${tr('Entrez le poids et la cible pour obtenir le calcul.', 'Enter weight and target to see the calculation.')}</div>`; return; }
  const p = pct.si, kg = w.si, route = S.route;
  const L = F.ethanolLoading({ weightKg: kg, targetMmol: tg.si, currentMmol: cu.si, percent: p, route });
  const HIST = [['nonDrinker', tr('non-buveur', 'non-drinker')], ['average', tr('moyenne', 'average')], ['heavy', tr('buveur chronique important', 'chronic heavy drinker')]];
  const mgkgh = F.ETHANOL.MAINTENANCE[S.history];
  const M = F.ethanolMaintenance({ weightKg: kg, mgPerKgH: mgkgh, percent: p, route });
  const histName = HIST.find(h => h[0] === S.history)[1];
  const warns = [];
  if (route === 'IV' && p > F.ETHANOL.IV_MAX_PERCENT) warns.push(tr(`IV à plus de ${F.ETHANOL.IV_MAX_PERCENT} % : solution hyperosmolaire (le 10 % nécessite souvent une voie centrale).`, `IV above ${F.ETHANOL.IV_MAX_PERCENT}%: hyperosmolar (10% often needs a central line).`));
  if (tg.si < F.ETHANOL.TARGET_LOW || tg.si > F.ETHANOL.TARGET_HIGH) warns.push(tr('Cible hors de l\'intervalle AACT (22–33 mmol/L).', 'Target outside the AACT range (22–33 mmol/L).'));
  const bioStep = route === 'PO' ? ` / ${dec(F.ETHANOL.ORAL_BIOAVAILABILITY, 1)} (${tr('biodisponibilité orale 90 %', 'oral bioavailability 90%')})` : '';
  const prod = `${dec(p, 2)} % ${route}`;
  const ivNote = route === 'IV' ? `<p class="warnbox">* ${tr('Voie centrale à privilégier.', 'Central line preferred.')}</p>` : '';

  const loadValue = L.alreadyAtTarget ? '0 <small>mL</small>' : `${f1(L.ml)} <small>mL</small>`;
  // consommations équivalentes : seulement par voie orale
  const loadDrinks = L.alreadyAtTarget || route === 'IV' ? '' : drinksText(L.ml, p);
  const maintDrinks = route === 'IV' ? '' : drinksText(M.mlPerH, p, true);
  const loadDetails = `${L.alreadyAtTarget ? `<p>${tr('Éthanolémie actuelle ≥ cible : pas de dose de charge.', 'Current level ≥ target: no loading dose.')}</p>` : `<p>${f2(L.g)} g ${tr('d\'éthanol', 'of ethanol')} · ${dec(L.mgPerKg, 0)} mg/kg · ${f2(L.ml / kg)} mL/kg</p>`}
    <ol class="steps">${convLine(tr('Poids', 'Weight'), w)}${convLine(tr('Cible', 'Target'), tg)}${convLine(tr('Actuelle', 'Current'), cu)}
      ${step(`g = (${tr('cible', 'target')} − ${tr('actuelle', 'current')}) × ${dec(0.046, 3)} × ${dec(0.6, 1)} × ${tr('poids', 'weight')}${bioStep} = (${f2(tg.si)} − ${f2(cu.si)}) × ${dec(0.046, 3)} × ${dec(0.6, 1)} × ${f2(kg)}${route === 'PO' ? ` / ${dec(0.9, 1)}` : ''} = ${f2(L.g)}`)}
      ${step(`g/mL = (${dec(p, 2)} / 100) × ${dec(0.79, 2)} = ${dec(L.gPerMl, 4)}`)}
      ${step(`mL = ${f2(L.g)} / ${dec(L.gPerMl, 4)} = ${f1(L.ml)}`)}</ol>
    ${ivNote}
    <p class="note-small">${tr('La dose de charge ne dépend pas de la consommation habituelle ; elle est réduite si de l\'éthanol est déjà présent (AACT). Voie orale : dose × 1/0,9 (biodisponibilité 90 %).', 'The loading dose does not depend on drinking history; it is reduced if ethanol is already present (AACT). Oral route: dose × 1/0.9 (90% bioavailability).')}</p>`;

  const range = HIST.map(([id, name]) => {
    const m = F.ethanolMaintenance({ weightKg: kg, mgPerKgH: F.ETHANOL.MAINTENANCE[id], percent: p, route });
    return `<tr${id === S.history ? ' class="hl"' : ''}><th scope="row">${name}</th><td>${F.ETHANOL.MAINTENANCE[id]}</td><td>${f1(m.mlPerH)}</td></tr>`;
  }).join('');
  const maintDetails = `${ivNote}<p>${tr('Débit recommandé selon la consommation habituelle', 'Recommended rate by drinking history')} (${prod}) :</p>
    <div class="table-wrap"><table class="calc-table"><thead><tr><th></th><th>mg/kg/h</th><th>mL/h</th></tr></thead><tbody>${range}</tbody></table></div>
    <p>${f2(M.gPerH)} g/h · ${f2(M.mlPerKgH)} mL/kg/h</p>
    <ol class="steps">${step(`mL/h = mg/kg/h × ${tr('poids', 'weight')} / 1000${route === 'PO' ? ` / ${dec(0.9, 1)}` : ''} / (g/mL) = ${mgkgh} × ${f2(kg)} / 1000${route === 'PO' ? ` / ${dec(0.9, 1)}` : ''} / ${dec(M.gPerMl, 4)} = ${f1(M.mlPerH)}`)}</ol>
    <p class="note-small">${tr('66 et 154 mg/kg/h : AACT, tableau 3 (adapté de McCoy 1979) ; 110 mg/kg/h : « dose d\'entretien moyenne » du texte AACT.', '66 and 154 mg/kg/h: AACT Table 3 (adapted from McCoy 1979); 110 mg/kg/h: AACT “average maintenance dose” in the text.')}</p>
    <h4>${tr('Surveillance (AACT 2002)', 'Monitoring (AACT 2002)')}</h4>
    <p>• ${tr('Éthanolémie aux 1–2 h jusqu\'à 22–33 mmol/L, puis aux 2–4 h.', 'Ethanol level every 1–2 h until in the 22–33 mmol/L range, then every 2–4 h.')}</p>
    <p>• ${tr('Glycémie fréquente chez le jeune enfant.', 'Check glucose often in young children.')}</p>
    <p>• ${tr('Doses = guide initial : l\'élimination varie beaucoup d\'un patient à l\'autre.', 'Doses are an initial guide: elimination varies widely.')}</p>`;

  out.innerHTML = `${warns.map(x => `<p class="warnbox">⚠ ${ctx.esc(x)}</p>`).join('')}
    <div class="res-list">
      ${resItem('load', `${tr('Dose de charge', 'Loading dose')} <small class="muted">${ctx.esc(prod)}</small>`, loadValue, loadDetails, { extra: loadDrinks ? `<span class="res-sub">${loadDrinks}</span>` : '' })}
      ${resItem('maint', `${tr('Entretien', 'Maintenance')} <small class="muted">${ctx.esc(histName)}</small>`, `${f1(M.mlPerH)} <small>mL/h</small>`, maintDetails, { extra: maintDrinks ? `<span class="res-sub">${maintDrinks}</span>` : '' })}
    </div>
    <p class="hint">${tr('Touchez un résultat pour voir le détail du calcul.', 'Tap a result to see the calculation.')}</p>`;
}

// ============================================================ cinétique ===
// Saisie de l'heure : jour (relatif à aujourd'hui) + heure. Plus fiable sur téléphone qu'un champ date-heure.
const DAYS = [-3, -2, -1, 0, 1];
function dayLabel(d) {
  const named = { '-2': tr('Avant-hier', 'Day before yesterday'), '-1': tr('Hier', 'Yesterday'), 0: tr('Aujourd\'hui', 'Today'), 1: tr('Demain', 'Tomorrow') }[d];
  const date = new Date(); date.setDate(date.getDate() + d);
  const s = new Intl.DateTimeFormat(ctx.lang === 'fr' ? 'fr-CA' : 'en-CA', { day: 'numeric', month: 'short' }).format(date);
  return named || s;
}
function levelRow(S, n) {
  const day = S['d' + n] ?? '0';
  return `<div class="level-row">
    <div class="field"><label for="c${n}">${tr('Concentration', 'Level')} ${n}</label><div class="row"><input id="c${n}" name="c${n}" inputmode="decimal" autocomplete="off" value="${ctx.esc(S['c' + n] ?? '')}"></div></div>
    <div class="field"><label for="d${n}">${tr('Jour', 'Day')} ${n}</label><div class="row"><select id="d${n}" name="d${n}">${DAYS.map(d => `<option value="${d}"${String(d) === day ? ' selected' : ''}>${ctx.esc(dayLabel(d))}</option>`).join('')}</select></div></div>
    <div class="field"><label for="h${n}">${tr('Heure', 'Time')} ${n}</label><div class="row"><input id="h${n}" name="h${n}" type="time" value="${ctx.esc(S['h' + n] ?? '')}"></div></div></div>`;
}
function readTime(S, n) {
  const h = S['h' + n];
  if (!h) return null;
  const m = /^(\d{1,2}):(\d{2})/.exec(h);
  if (!m) return 'invalid';
  const d = new Date(); d.setHours(Number(m[1]), Number(m[2]), 0, 0); d.setDate(d.getDate() + Number(S['d' + n] ?? 0));
  return d;
}

function renderKinetics(main) {
  const S = store('kinetics', { substance: 'other', order: 'first', unit: 'mmol/L' });
  const units = ['mmol/L', 'mg/dL', 'mg/L', 'µmol/L', 'µg/mL', tr('autre', 'other')];
  main.innerHTML = `
    <h1 class="page-title">${CALC_INFO.kinetics[ctx.lang][0]}</h1>
    ${banner()}
    <form id="calc-form" novalidate>
      <fieldset><legend>${tr('Substance et cinétique', 'Substance and kinetics')}</legend>
        <div class="radio-row">${[['other', tr('Autre substance', 'Other substance')], ['ethanol', tr('Éthanol', 'Ethanol')]].map(([x, l]) => `<label><input type="radio" name="substance" value="${x}"${S.substance === x ? ' checked' : ''}> ${l}</label>`).join('')}</div>
        <p class="field-label">${tr('Cinétique', 'Kinetics')}</p>
        <div class="radio-row">${[['first', tr('Premier ordre', 'First order')], ['zero', tr('Ordre zéro', 'Zero order')]].map(([x, l]) => `<label><input type="radio" name="order" value="${x}"${S.order === x ? ' checked' : ''}> ${l}</label>`).join('')}</div>
        <div class="field"><label for="unit">${tr('Unité (la même pour toutes les concentrations)', 'Unit (same for all levels)')}</label>
          <div class="row"><select id="unit" name="unit">${units.map(u => `<option${u === S.unit ? ' selected' : ''}>${ctx.esc(u)}</option>`).join('')}</select></div></div>
      </fieldset>
      <fieldset><legend>${tr('Concentrations', 'Levels')}</legend>
        ${levelRow(S, 1)}${levelRow(S, 2)}
        ${numField(S, 'target', tr('Concentration cible', 'Target level'), null)}
        <label class="toggle"><input type="checkbox" name="third"${S.third ? ' checked' : ''}> ${tr('3e concentration (vérifier la linéarité)', '3rd level (check linearity)')}</label>
        <div data-show-if="third"${S.third ? '' : ' hidden'}>${levelRow(S, 3)}</div>
      </fieldset>
    </form>
    <div id="calc-out" aria-live="polite"></div>
    <div id="chart"></div>
    <details class="refs"><summary>${tr('Hypothèses', 'Assumptions')}</summary>
      <p>• ${tr('Concentrations prélevées après l\'absorption et la distribution ; aucun changement de clairance entre elles (dialyse débutée ou arrêtée, antidote donné).', 'Levels drawn after absorption and distribution; no change in clearance between them (dialysis started or stopped, antidote given).')}</p>
      <p>• ${tr('Premier ordre : ne pas utiliser pour l\'éthanol, ni pour la phénytoïne et le salicylate à doses toxiques (saturation : ordre zéro ou Michaelis–Menten).', 'First order: do not use for ethanol, or for phenytoin and salicylate at toxic levels (saturation: zero order or Michaelis–Menten).')}</p>
      <p>• ${tr('Éthanol : élimination typique ≈ 3,3–4,4 mmol/L/h (15–20 mg/dL/h), plus élevée chez le buveur chronique.', 'Ethanol: typical elimination ≈ 3.3–4.4 mmol/L/h (15–20 mg/dL/h), higher in chronic drinkers.')}</p></details>
    ${refsHtml('kinetics')}`;
  // éthanol → ordre zéro présélectionné
  const form = $('#calc-form', main);
  form.addEventListener('change', e => {
    if (e.target.name === 'substance') {
      const order = e.target.value === 'ethanol' ? 'zero' : 'first';
      form.querySelector(`input[name=order][value=${order}]`).checked = true;
      S.order = order;
    }
  }, true);
  bind(main, S, () => drawKinetics(S));
  window.scrollTo(0, 0);
}

function drawKinetics(S) {
  const out = $('#calc-out'), chart = $('#chart');
  chart.innerHTML = '';
  const unit = S.unit;
  const errs = [];
  const num = (k, label) => { const r = read(S, k, label, null, 'level'); if (r.error) errs.push(r.error); return r; };
  const time = (n, label) => { const t = readTime(S, n); if (t === 'invalid') { errs.push(tr(`${label} : heure invalide.`, `${label}: invalid time.`)); return null; } return t; };
  const c1 = num('c1', tr('Concentration 1', 'Level 1')), c2 = num('c2', tr('Concentration 2', 'Level 2')), tg = num('target', tr('Cible', 'Target'));
  const t1 = time(1, tr('Heure 1', 'Time 1')), t2 = time(2, tr('Heure 2', 'Time 2'));
  let c3 = null, t3 = null;
  if (S.third) { c3 = num('c3', tr('Concentration 3', 'Level 3')); t3 = time(3, tr('Heure 3', 'Time 3')); }
  if (errs.length) { out.innerHTML = errorsHtml(errs); return; }
  if (c1.blank || c2.blank || !t1 || !t2) { out.innerHTML = `<div class="result empty">${tr('Entrez deux concentrations avec leur jour et heure.', 'Enter two levels with their day and time.')}</div>`; return; }
  const use3 = c3 && !c3.blank && t3;
  const r = F.elimination({ order: S.order, c1: c1.si, t1, c2: c2.si, t2, target: tg.blank ? null : tg.si,
    c3: use3 ? c3.si : null, t3: use3 ? t3 : null });
  if (!r.ok) {
    const msg = { levelPositive: tr('Les concentrations doivent être > 0.', 'Levels must be > 0.'), timeOrder: tr('L\'heure 2 doit être après l\'heure 1 (vérifiez le jour).', 'Time 2 must be after time 1 (check the day).'),
      notFalling: tr('Concentration non décroissante : absorption ou redistribution encore en cours.', 'Level not falling: absorption or redistribution still ongoing.'),
      targetPositive: tr('La cible doit être > 0.', 'Target must be > 0.') };
    out.innerHTML = errorsHtml(r.errors.map(e => msg[e])); return;
  }
  const dateFmt = new Intl.DateTimeFormat(ctx.lang === 'fr' ? 'fr-CA' : 'en-CA', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  const steps = [step(`Δt = ${f2(r.dt)} h`)];
  const items = [];
  const w = [];
  if (S.order === 'first') {
    steps.push(step(`k = ln(C1 / C2) / Δt = ln(${dec(c1.si, 4)} / ${dec(c2.si, 4)}) / ${f2(r.dt)} = ${dec(r.k, 4)} h⁻¹`));
    steps.push(step(`t½ = ln 2 / k = ${dec(0.693, 3)} / ${dec(r.k, 4)} = ${f2(r.halfLife)} h`));
  } else {
    steps.push(step(`${tr('Vitesse', 'Rate')} = (C1 − C2) / Δt = (${dec(c1.si, 4)} − ${dec(c2.si, 4)}) / ${f2(r.dt)} = ${dec(r.rate, 4)} ${unit}/h`));
  }
  let targetLine = '';
  if (r.targetReached) targetLine = `<p>${tr('La cible est déjà atteinte (≥ concentration 2).', 'Target already reached (≥ level 2).')}</p>`;
  else if (r.hoursToTarget != null) {
    steps.push(step(S.order === 'first'
      ? `t = ln(C2 / ${tr('cible', 'target')}) / k = ln(${dec(c2.si, 4)} / ${dec(tg.si, 4)}) / ${dec(r.k, 4)} = ${f2(r.hoursToTarget)} h`
      : `t = (C2 − ${tr('cible', 'target')}) / ${tr('vitesse', 'rate')} = (${dec(c2.si, 4)} − ${dec(tg.si, 4)}) / ${dec(r.rate, 4)} = ${f2(r.hoursToTarget)} h`));
  }
  if (S.order === 'first' && S.substance === 'ethanol') w.push(tr('Premier ordre sélectionné. Éthanol : utiliser l\'ordre zéro (élimination saturée).', 'First order selected. Ethanol: use zero order (saturated elimination).'));
  if (r.warnings.includes('thirdInvalid')) w.push(tr('3e concentration ignorée : elle doit être > 0, plus basse que la 2e et prise après elle.', '3rd level ignored: it must be > 0, lower than the 2nd and drawn after it.'));
  let lin = '';
  if (r.linearityDiff != null) {
    const name = S.order === 'first' ? 'k' : tr('vitesse', 'rate');
    steps.push(step(`${name} (2→3) = ${dec(r.second, 4)} ; ${tr('écart', 'difference')} = ${dec(r.linearityDiff * 100, 1)} %`));
    if (r.warnings.includes('nonLinear')) w.push(tr(`Les deux valeurs de ${name} diffèrent de plus de 20 % : élimination probablement pas ${S.order === 'first' ? 'de premier ordre' : 'd\'ordre zéro'}.`, `The two ${name} values differ by more than 20%: elimination probably not ${S.order === 'first' ? 'first' : 'zero'} order.`));
    else lin = `<span class="badge ok">${tr('linéarité vérifiée', 'linearity checked')}</span>`;
  }
  let typical = '';
  if (S.order === 'zero' && S.substance === 'ethanol' && (unit === 'mmol/L' || unit === 'mg/dL')) {
    const lo = unit === 'mmol/L' ? F.ETHANOL_ZERO_ORDER_TYPICAL.low : 15, hi = unit === 'mmol/L' ? F.ETHANOL_ZERO_ORDER_TYPICAL.high : 20;
    typical = `<p class="note-small">${tr('Typique pour l\'éthanol', 'Typical for ethanol')} : ${dec(lo, 1)}–${dec(hi, 1)} ${unit}/h</p>`;
  }
  const details = `<ol class="steps">${steps.join('')}</ol>${targetLine}${typical}`;
  if (S.order === 'first') items.push(resItem('t12', tr('Demi-vie', 'Half-life'), `${f1(r.halfLife)} <small>h</small>`, details, { extra: lin }));
  else items.push(resItem('rate', tr('Vitesse d\'élimination', 'Elimination rate'), `${f2(r.rate)} <small>${ctx.esc(unit)}/h</small>`, details, { extra: lin }));
  if (r.hoursToTarget != null) items.push(resItem('ttt', tr('Cible atteinte', 'Target reached'), `${ctx.esc(dateFmt.format(r.targetTime))}`, details,
    { extra: `<span class="res-sub">${tr('dans', 'in')} ${f1(r.hoursToTarget)} h ${tr('après la concentration 2', 'after level 2')}</span>` }));
  else if (r.targetReached) items.push(`<div class="res-item pending"><span class="res-title">${tr('Cible', 'Target')}</span><span class="res-missing">${tr('déjà atteinte', 'already reached')}</span></div>`);
  out.innerHTML = `${w.map(x => `<p class="warnbox">⚠ ${ctx.esc(x)}</p>`).join('')}<div class="res-list">${items.join('')}</div>`;
  chart.innerHTML = kineticsChart({ order: S.order, r, pts: [[t1, c1.si], [t2, c2.si], ...(use3 && !r.warnings.includes('thirdInvalid') ? [[t3, c3.si]] : [])], target: tg.blank ? null : tg.si, unit, t0: t1, dateFmt });
}

/** Graphique SVG : concentrations entrées (points), courbe d'élimination ajustée sur C1–C2, cible (pointillé)
 *  et point où la cible est prévue. Une seule série → pas de légende ; tableau équivalent pour lecteurs d'écran. */
function kineticsChart({ order, r, pts, target, unit, t0, dateFmt }) {
  const W = 340, H = 220, m = { l: 44, r: 14, t: 14, b: 36 };
  const pw = W - m.l - m.r, ph = H - m.t - m.b;
  const hrs = d => (d - t0) / 3600000;
  const c1 = pts[0][1];
  const conc = h => order === 'first' ? c1 * Math.exp(-r.k * h) : Math.max(0, c1 - r.rate * h);
  const xEnd = Math.max(...pts.map(p => hrs(p[0])), r.hoursToTarget != null ? hrs(r.targetTime) : 0) * 1.08 || 1;
  const yMax = Math.max(c1, ...pts.map(p => p[1]), target || 0) * 1.1;
  const nice = (max, n) => { const raw = max / n, p10 = 10 ** Math.floor(Math.log10(raw)); const s = [1, 2, 2.5, 5, 10].find(x => x * p10 >= raw) * p10; return s; };
  const xs = h => m.l + (h / xEnd) * pw, ys = c => m.t + ph - (c / yMax) * ph;
  const xStep = nice(xEnd, 5), yStep = nice(yMax, 4);
  let grid = '';
  for (let y = 0; y <= yMax + 1e-9; y += yStep) grid += `<line class="grid" x1="${m.l}" x2="${W - m.r}" y1="${ys(y)}" y2="${ys(y)}"/><text class="tick" x="${m.l - 6}" y="${ys(y) + 4}" text-anchor="end">${dec(y, 2)}</text>`;
  for (let x = 0; x <= xEnd + 1e-9; x += xStep) grid += `<text class="tick" x="${xs(x)}" y="${H - m.b + 16}" text-anchor="middle">${dec(x, 1)}</text>`;
  let path = '';
  const N = 80;
  for (let i = 0; i <= N; i++) { const h = (xEnd * i) / N; path += `${i ? 'L' : 'M'}${xs(h).toFixed(1)},${ys(conc(h)).toFixed(1)}`; }
  const tgt = target != null && target < yMax ? `<line class="target" x1="${m.l}" x2="${W - m.r}" y1="${ys(target)}" y2="${ys(target)}"/><text class="tick lab" x="${W - m.r}" y="${ys(target) - 5}" text-anchor="end">${tr('cible', 'target')} ${dec(target, 2)}</text>` : '';
  const dots = pts.map((p, i) => `<circle class="dot" cx="${xs(hrs(p[0]))}" cy="${ys(p[1])}" r="5"><title>C${i + 1} : ${dec(p[1], 4)} ${unit} – ${dateFmt.format(p[0])}</title></circle>`).join('');
  const pred = r.hoursToTarget != null ? `<circle class="pred" cx="${xs(hrs(r.targetTime))}" cy="${ys(target)}" r="6"><title>${tr('Cible prévue', 'Predicted target')} : ${dateFmt.format(r.targetTime)}</title></circle>
    <text class="tick lab" x="${Math.min(xs(hrs(r.targetTime)), W - m.r - 4)}" y="${ys(target) + 18}" text-anchor="end">${dateFmt.format(r.targetTime)}</text>` : '';
  const rows = pts.map((p, i) => `<tr><td>C${i + 1}</td><td>${dateFmt.format(p[0])}</td><td>${dec(p[1], 4)}</td></tr>`).join('') +
    (r.hoursToTarget != null ? `<tr><td>${tr('cible prévue', 'predicted target')}</td><td>${dateFmt.format(r.targetTime)}</td><td>${dec(target, 4)}</td></tr>` : '');
  return `<figure class="kchart">
    <figcaption>${tr('Concentration', 'Level')} (${ctx.esc(unit)}) – ${order === 'first' ? tr('premier ordre', 'first order') : tr('ordre zéro', 'zero order')}</figcaption>
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${tr('Courbe d\'élimination', 'Elimination curve')}">
      ${grid}<line class="axis" x1="${m.l}" x2="${W - m.r}" y1="${ys(0)}" y2="${ys(0)}"/>
      <text class="tick" x="${m.l + pw / 2}" y="${H - 4}" text-anchor="middle">${tr('heures depuis la concentration 1', 'hours since level 1')}</text>
      ${tgt}<path class="curve" d="${path}"/>${dots}${pred}
    </svg>
    <div class="sr-only"><table><caption>${tr('Valeurs du graphique', 'Chart values')}</caption><tr><th></th><th>${tr('Heure', 'Time')}</th><th>${ctx.esc(unit)}</th></tr>${rows}</table></div>
  </figure>`;
}

// ------------------------------------------------------------- point d'entrée ---
export function renderPhase1(id, main, context) {
  ctx = context;
  ctx.openRes = ctx.openRes || new Set();
  ({ acidbase: renderAcidBase, dextrose: renderDextrose, ethanol: renderEthanol, kinetics: renderKinetics })[id](main);
}
