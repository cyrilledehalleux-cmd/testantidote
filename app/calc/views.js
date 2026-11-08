// Écrans des calculateurs de la phase 1 (acide-base / osmolalité, dextrose, éthanol, demi-vie).
// Les formules et constantes sont dans formulas.js ; ce fichier ne fait que l'affichage.
import * as F from './formulas.js';

export const CALCS = ['acidbase', 'dextrose', 'ethanol', 'kinetics'];

export const CALC_INFO = {
  acidbase: { fr: ['Trou anionique, osmolalité, sodium corrigé', 'Trou anionique (± albumine), osmolalité et écart osmolaire, sodium corrigé, Stewart'],
    en: ['Anion gap, osmolality, corrected sodium', 'Anion gap (± albumin), osmolality and osmole gap, corrected sodium, Stewart'] },
  dextrose: { fr: ['Dextrose – bolus', 'Dose en g et volumes de D5, D10, D25, D50'], en: ['Dextrose – bolus', 'Dose in g and volumes of D5, D10, D25, D50'] },
  ethanol: { fr: ['Éthanol – charge et entretien', 'Méthanol, éthylène glycol ; patient sans dialyse'], en: ['Ethanol – loading and maintenance', 'Methanol, ethylene glycol; patient without dialysis'] },
  kinetics: { fr: ['Demi-vie et temps jusqu\'à la cible', 'À partir de deux concentrations datées'], en: ['Half-life and time to target', 'From two timed concentrations'] },
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
let ctx; // { lang, esc, fmt, store, icons }
const tr = (fr, en) => (ctx.lang === 'fr' ? fr : en);
const $ = (s, el = document) => el.querySelector(s);
const f1 = x => ctx.fmt(x, 1);
const f2 = x => ctx.fmt(x, 2);
const f3 = x => ctx.fmt(x, 3);

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

/**
 * Lit un champ : { blank, si, error } ; error = message si non numérique ou hors bornes.
 */
function read(S, key, label, units, boundsKey, { neg = false } = {}) {
  const raw = S[key];
  if (F.isBlank(raw)) return { blank: true };
  const v = F.parseNum(raw, { allowNegative: neg });
  if (!Number.isFinite(v)) return { error: tr(`${label} : entrez un nombre.`, `${label}: enter a number.`) };
  const unit = units ? (units.find(x => x.u === S[key + 'Unit']) || units[0]) : { f: 1, u: '' };
  const si = v / unit.f;
  const b = F.BOUNDS[boundsKey];
  if (b && (si < b[0] || si > b[1])) {
    const lo = ctx.fmt(b[0] * unit.f, 2), hi = ctx.fmt(b[1] * unit.f, 2);
    return { error: tr(`${label} : ${ctx.fmt(v, 4)} ${unit.u} est hors des bornes acceptées (${lo} à ${hi} ${unit.u}). Aucun résultat affiché.`,
      `${label}: ${ctx.fmt(v, 4)} ${unit.u} is outside the accepted range (${lo} to ${hi} ${unit.u}). No result shown.`) };
  }
  return { si, raw: v, unit: unit.u, converted: unit.f !== 1 };
}

const banner = () => `<p class="calc-banner" role="note">⚠ ${tr('Outil de démonstration – vérifier le calcul', 'Demo tool – verify the calculation')} <span aria-hidden="true">/</span> <span lang="${ctx.lang === 'fr' ? 'en' : 'fr'}">${tr('Demo tool – verify the calculation', 'Outil de démonstration – vérifier le calcul')}</span></p>`;
const discrepancy = () => `<p class="note-small">ⓘ ${tr('Le résultat peut différer légèrement des doses publiées (arrondis et conversions d\'unités SI).', 'Results may differ slightly from published doses (rounding and SI unit conversions).')}</p>`;
const refsHtml = id => `<details class="refs"><summary>${tr('Références', 'References')}</summary><ol>${REFS[id].map(r => `<li>${ctx.esc(r)}</li>`).join('')}</ol>
  <p class="note-small">${tr('Formules et décisions : spécification de l\'équipe « Phase 1 toxicology equations » (8 nov. 2026).', 'Formulas and decisions: team specification “Phase 1 toxicology equations” (8 Nov 2026).')}</p></details>`;
const errorsHtml = errs => `<div class="result err" role="alert"><ul>${errs.map(e => `<li>${ctx.esc(e)}</li>`).join('')}</ul></div>`;
const card = (title, body, cls = '') => `<section class="calc-card ${cls}"><h3>${title}</h3>${body}</section>`;
const flag = (on, text) => on ? ` <span class="flag-high">${ctx.esc(text)}</span>` : '';
const step = s => `<li><code>${ctx.esc(s)}</code></li>`;
const convLine = (label, r, factor) => r && r.converted ? step(`${label} : ${ctx.fmt(r.raw, 4)} ${r.unit} → ${ctx.fmt(r.si, 4)} (SI)`) : '';

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
  update();
}

// ================================================ 1–5. acide-base et osmolalité ===
function renderAcidBase(main) {
  const S = store('acidbase', {});
  const advanced = !!S.advanced;
  main.innerHTML = `
    <h1 class="page-title">${CALC_INFO.acidbase[ctx.lang][0]}</h1>
    ${banner()}
    <form id="calc-form" novalidate>
      <fieldset><legend>${tr('Biochimie', 'Chemistry')}</legend>
        <p class="hint">${tr('Une seule saisie pour les cinq calculs. Remplissez ce que vous avez : chaque résultat s\'affiche dès que ses valeurs sont entrées.', 'One entry for all five calculations. Fill in what you have: each result appears as soon as its values are entered.')}</p>
        <div class="grid2">
          ${numField(S, 'na', 'Na', U.electrolyte)}
          ${numField(S, 'cl', 'Cl', U.electrolyte)}
          ${numField(S, 'hco3', 'HCO3', U.electrolyte)}
          ${numField(S, 'glucose', tr('Glucose', 'Glucose'), U.glucose)}
          ${numField(S, 'urea', tr('Urée / BUN', 'Urea / BUN'), U.urea)}
          ${numField(S, 'ethanol', tr('Éthanol', 'Ethanol'), U.ethanol, { optional: true, hint: tr('0 si non mesuré', '0 if not measured') })}
          ${numField(S, 'albumin', tr('Albumine', 'Albumin'), U.albumin)}
          ${numField(S, 'measured', tr('Osmolalité mesurée', 'Measured osmolality'), [{ u: 'mOsm/kg', f: 1 }], { hint: tr('Méthode par point de congélation', 'Freezing-point method') })}
        </div>
      </fieldset>
      <label class="toggle"><input type="checkbox" name="advanced"${advanced ? ' checked' : ''}> ${tr('Avancé : Stewart (trou ionique fort)', 'Advanced: Stewart (strong ion gap)')}</label>
      <fieldset data-show-if="advanced"${advanced ? '' : ' hidden'}><legend>Stewart</legend>
        <div class="grid2">
          ${numField(S, 'k', 'K', U.electrolyte)}
          ${numField(S, 'ica', tr('Ca ionisé', 'Ionized Ca'), U.caMg)}
          ${numField(S, 'mg', 'Mg', U.caMg)}
          ${numField(S, 'lactate', tr('Lactate', 'Lactate'), U.lactate)}
          ${numField(S, 'phosphate', tr('Phosphate', 'Phosphate'), U.phosphate)}
          ${numField(S, 'ph', 'pH', null)}
          ${numField(S, 'be', tr('Excès de base', 'Base excess'), U.electrolyte, { optional: true, neg: true, hint: tr('Pour la version simplifiée (Story 2004)', 'For the simplified version (Story 2004)') })}
        </div>
      </fieldset>
    </form>
    <div id="calc-out" aria-live="polite"></div>
    ${discrepancy()}
    ${refsHtml('acidbase')}`;
  bind(main, S, () => drawAcidBase(S));
  window.scrollTo(0, 0);
}

function drawAcidBase(S) {
  const L = {
    na: ['Na', U.electrolyte, 'na'], cl: ['Cl', U.electrolyte, 'cl'], hco3: ['HCO3', U.electrolyte, 'hco3'],
    glucose: [tr('Glucose', 'Glucose'), U.glucose, 'glucose'], urea: [tr('Urée', 'Urea'), U.urea, 'urea'],
    ethanol: [tr('Éthanol', 'Ethanol'), U.ethanol, 'ethanol'], albumin: [tr('Albumine', 'Albumin'), U.albumin, 'albumin'],
    measured: [tr('Osmolalité mesurée', 'Measured osmolality'), null, 'measured'],
    k: ['K', U.electrolyte, 'k'], ica: [tr('Ca ionisé', 'Ionized Ca'), U.caMg, 'ica'], mg: ['Mg', U.caMg, 'mg'],
    lactate: ['Lactate', U.lactate, 'lactate'], phosphate: ['Phosphate', U.phosphate, 'phosphate'], ph: ['pH', null, 'ph'],
    be: [tr('Excès de base', 'Base excess'), U.electrolyte, 'be'],
  };
  const v = {}, errs = [];
  for (const [k, [label, units, b]] of Object.entries(L)) {
    if (!S.advanced && ['k', 'ica', 'mg', 'lactate', 'phosphate', 'ph', 'be'].includes(k)) { v[k] = { blank: true }; continue; }
    v[k] = read(S, k, label, units, b, { neg: k === 'be' });
    if (v[k].error) errs.push(v[k].error);
  }
  const out = $('#calc-out');
  if (errs.length) { out.innerHTML = errorsHtml(errs); return; }
  const has = (...ks) => ks.every(k => !v[k].blank);
  const need = (...ks) => `<p class="muted">${tr('Entrez', 'Enter')} : ${ks.filter(k => v[k].blank).map(k => L[k][0]).join(', ')}</p>`;
  const conv = ks => ks.map(k => convLine(L[k][0], v[k])).join('');
  const cards = [];

  // 1. trou anionique
  let ag = null;
  if (has('na', 'cl', 'hco3')) {
    ag = F.anionGap({ na: v.na.si, cl: v.cl.si, hco3: v.hco3.si });
    cards.push(card(tr('Trou anionique', 'Anion gap'), `
      <p class="res">${f1(ag.value)} mmol/L${flag(ag.high, tr(`élevé (> ${F.AG_HIGH})`, `high (> ${F.AG_HIGH})`))}</p>
      <ol class="steps">${conv(['na', 'cl', 'hco3'])}${step(`AG = Na − (Cl + HCO3) = ${f2(v.na.si)} − (${f2(v.cl.si)} + ${f2(v.hco3.si)}) = ${f2(ag.value)}`)}</ol>
      <p class="note-small">${tr(`Sans K (Winter 1990, Lolekha 2001). Électrodes sélectives : normal 3–11 (Winter) ou 5–12 mmol/L (Lolekha) ; l'ancien 12 ± 4 vient de la photométrie de flamme. L'intervalle de référence dépend de l'analyseur de votre laboratoire.`,
        `Without K (Winter 1990, Lolekha 2001). Ion-selective electrodes: normal 3–11 (Winter) or 5–12 mmol/L (Lolekha); the old 12 ± 4 came from flame photometry. Reference range depends on your laboratory's analyzer.`)}</p>`));
  } else cards.push(card(tr('Trou anionique', 'Anion gap'), need('na', 'cl', 'hco3'), 'pending'));

  // 2. trou anionique corrigé
  if (ag && has('albumin')) {
    const c = F.correctedAnionGap({ ag: ag.value, albumin: v.albumin.si });
    cards.push(card(tr('Trou anionique corrigé pour l\'albumine (Figge)', 'Albumin-corrected anion gap (Figge)'), `
      <p class="res">${f1(c.value)} mmol/L${flag(c.high, tr(`élevé (> ${F.AG_HIGH})`, `high (> ${F.AG_HIGH})`))}</p>
      <ol class="steps">${conv(['albumin'])}${step(`AGcorr = AG + 0,25 × (40 − ${tr('albumine', 'albumin')}) = ${f2(ag.value)} + 0,25 × (40 − ${f2(v.albumin.si)}) = ${f2(c.value)}`.replace(/0,25/g, ctx.fmt(0.25, 2)))}</ol>
      <p class="note-small">${tr('Albumine normale fixée à 40 g/L (comme MDCalc). Figge 1998 utilisait 44 g/L : la correction de l\'application est donc légèrement plus petite que l\'originale.', 'Normal albumin fixed at 40 g/L (as MDCalc). Figge 1998 used 44 g/L, so the app\'s correction is slightly smaller than the original.')}</p>`));
  } else cards.push(card(tr('Trou anionique corrigé pour l\'albumine (Figge)', 'Albumin-corrected anion gap (Figge)'), need('na', 'cl', 'hco3', 'albumin'), 'pending'));

  // 4. sodium corrigé
  if (has('na', 'glucose')) {
    const n = F.correctedSodium({ na: v.na.si, glucose: v.glucose.si });
    cards.push(card(tr('Sodium corrigé pour l\'hyperglycémie (Hillier)', 'Sodium corrected for hyperglycemia (Hillier)'), `
      <p class="res">${f1(n.value)} mmol/L</p>
      <ol class="steps">${conv(['glucose'])}${step(`Na corr = Na + 0,43 × (${tr('glucose', 'glucose')} − 5,6) = ${f2(v.na.si)} + 0,43 × (${f2(v.glucose.si)} − 5,6) = ${f2(n.value)}`.replace(/0,43/g, ctx.fmt(0.43, 2)).replace(/5,6\)/g, ctx.fmt(5.6, 1) + ')'))}</ol>
      ${n.nonLinear ? `<p class="warnbox">⚠ ${tr('Glucose > 22 mmol/L (400 mg/dL) : la correction réelle peut être plus grande (facteur ≈ 4,0 au-delà selon Hillier).', 'Glucose > 22 mmol/L (400 mg/dL): true correction may be larger (factor ≈ 4.0 above it per Hillier).')}</p>` : ''}
      <p class="note-small">${tr('2,4 mmol/L par 100 mg/dL au-delà de 100 mg/dL, converti : 2,4 / 5,55 = 0,43 par mmol/L au-delà de 5,6 mmol/L.', '2.4 mmol/L per 100 mg/dL above 100 mg/dL, converted: 2.4 / 5.55 = 0.43 per mmol/L above 5.6 mmol/L.')}</p>`));
  } else cards.push(card(tr('Sodium corrigé pour l\'hyperglycémie (Hillier)', 'Sodium corrected for hyperglycemia (Hillier)'), need('na', 'glucose'), 'pending'));

  // 5. osmolalité et écart osmolaire
  if (has('na', 'glucose', 'urea')) {
    const eth = v.ethanol.blank ? 0 : v.ethanol.si;
    const o = F.osmolality({ na: v.na.si, glucose: v.glucose.si, urea: v.urea.si, ethanol: eth, measured: v.measured.blank ? null : v.measured.si });
    let alc = '';
    if (o.gap != null && o.gap > 0) {
      const t = F.toxicAlcoholFromGap(o.gap);
      const row = (name, r) => `<tr><th scope="row">${name}</th><td>${f1(r.mmol)} <span class="muted">(${f1(r.mmolLow)}–${f1(r.mmolHigh)})</span></td><td>${f1(r.mgdl)} <span class="muted">(${f1(r.mgdlLow)}–${f1(r.mgdlHigh)})</span></td></tr>`;
      alc = `<h4>${tr('Estimation d\'alcool toxique d\'après l\'écart', 'Toxic alcohol estimate from the gap')}</h4>
        <p class="note-small">${tr('Seulement si tout l\'écart était dû à un seul alcool (1 mOsm/kg par mmol/L). Entre parenthèses : plage tenant compte de l\'écart résiduel normal (Purssell : environ −10 à +12). Ne remplace pas un dosage.', 'Only if the whole gap were due to a single alcohol (1 mOsm/kg per mmol/L). In brackets: range allowing for the normal residual gap (Purssell: about −10 to +12). Does not replace a measured level.')}</p>
        <div class="table-wrap"><table class="calc-table"><thead><tr><th></th><th>mmol/L</th><th>mg/dL</th></tr></thead><tbody>
        ${row(tr('Méthanol', 'Methanol'), t.methanol)}${row(tr('Éthylène glycol', 'Ethylene glycol'), t.ethyleneGlycol)}${row('Isopropanol', t.isopropanol)}</tbody></table></div>`;
    }
    cards.push(card(tr('Osmolalité calculée et écart osmolaire', 'Calculated osmolality and osmole gap'), `
      <p class="res">${tr('Calculée', 'Calculated')} : ${f1(o.calc)} mOsm/kg</p>
      ${o.gap != null ? `<p class="res">${tr('Écart osmolaire', 'Osmole gap')} : ${f1(o.gap)} mOsm/kg${flag(o.high, tr(`élevé (> ${F.OSM_GAP_HIGH})`, `elevated (> ${F.OSM_GAP_HIGH})`))}</p>` : `<p class="muted">${tr('Entrez l\'osmolalité mesurée pour l\'écart osmolaire.', 'Enter measured osmolality for the osmole gap.')}</p>`}
      <ol class="steps">${conv(['glucose', 'urea', 'ethanol'])}
        ${step(`Osm calc = 2 Na + ${tr('glucose', 'glucose')} + ${tr('urée', 'urea')} + 1,25 × ${tr('éthanol', 'ethanol')} = 2 × ${f2(v.na.si)} + ${f2(v.glucose.si)} + ${f2(v.urea.si)} + 1,25 × ${f2(eth)} = ${f2(o.calc)}`.replace(/1,25/g, ctx.fmt(1.25, 2)))}
        ${o.gap != null ? step(`${tr('Écart', 'Gap')} = ${tr('mesurée', 'measured')} − ${tr('calculée', 'calculated')} = ${f2(v.measured.si)} − ${f2(o.calc)} = ${f2(o.gap)}`) : ''}</ol>
      ${v.ethanol.blank ? `<p class="note-small">${tr('Éthanol non entré : compté comme 0.', 'Ethanol not entered: counted as 0.')}</p>` : ''}
      ${alc}
      <p class="note-small">${tr('Na non corrigé pour le glucose dans cette formule. 1,25 = pente de Purssell 2001 (effet de chaque mmol/L d\'éthanol), non ajustée pour annuler l\'écart. Écart normal avec cette formule : environ −10 à +12 (Purssell) ; seuil > 10 : sensibilité 0,85–1,0 mais spécificité 0,22–0,5 (Lynd 2008). Un écart normal n\'exclut pas un alcool toxique ; les seuils dépendent du laboratoire (dérive de 12 mOsm/kg en 8 ans, Krahn 2006). Osmolalité mesurée par point de congélation seulement (la pression de vapeur manque les alcools volatils).',
        'Na not corrected for glucose in this formula. 1.25 = Purssell 2001 slope (effect of each mmol/L of ethanol), not tuned to cancel the gap. Normal gap with this formula: about −10 to +12 (Purssell); threshold > 10: sensitivity 0.85–1.0 but specificity 0.22–0.5 (Lynd 2008). A normal gap does not exclude a toxic alcohol; cut-offs depend on the laboratory (12 mOsm/kg drift over 8 years, Krahn 2006). Measured osmolality by freezing point only (vapor pressure misses volatile alcohols).')}</p>`));
  } else cards.push(card(tr('Osmolalité calculée et écart osmolaire', 'Calculated osmolality and osmole gap'), need('na', 'glucose', 'urea'), 'pending'));

  // 3. Stewart (avancé)
  if (S.advanced) {
    if (has('na', 'k', 'ica', 'mg', 'cl', 'lactate', 'hco3', 'albumin', 'phosphate', 'ph')) {
      const g = F.strongIonGap({ na: v.na.si, k: v.k.si, ica: v.ica.si, mg: v.mg.si, cl: v.cl.si, lactate: v.lactate.si,
        hco3: v.hco3.si, albumin: v.albumin.si, phosphate: v.phosphate.si, ph: v.ph.si });
      cards.push(card(tr('Trou ionique fort (Stewart)', 'Strong ion gap (Stewart)'), `
        <p class="res">SIG : ${f1(g.sig)} mEq/L</p>
        <ol class="steps">${conv(['ica', 'mg', 'lactate', 'phosphate'])}
          ${step(`SIDa = Na + K + 2 Ca + 2 Mg − Cl − lactate = ${f2(v.na.si)} + ${f2(v.k.si)} + 2 × ${f2(v.ica.si)} + 2 × ${f2(v.mg.si)} − ${f2(v.cl.si)} − ${f2(v.lactate.si)} = ${f2(g.sida)}`)}
          ${step(`SIDe = HCO3 + Alb × (0,123 pH − 0,631) + Phos × (0,309 pH − 0,469) = ${f2(v.hco3.si)} + ${f2(g.albTerm)} + ${f2(g.phosTerm)} = ${f2(g.side)}`.replace(/0,123/, ctx.fmt(0.123, 3)).replace(/0,631/, ctx.fmt(0.631, 3)).replace(/0,309/, ctx.fmt(0.309, 3)).replace(/0,469/, ctx.fmt(0.469, 3)))}
          ${step(`SIG = SIDa − SIDe = ${f2(g.sida)} − ${f2(g.side)} = ${f2(g.sig)}`)}</ol>
        <p class="note-small">${tr('Fencl 2000, équations 2a et 2b, albumine en g/L (Kellum 1995 imprime « g/dL » : erreur d\'un facteur 10). SIG normalement ≈ 0 ; patients de soins intensifs avec anions non mesurés connus : 4,6 et 9,6 mEq/L en moyenne (Kellum).', 'Fencl 2000, equations 2a and 2b, albumin in g/L (Kellum 1995 prints “g/dL”: a 10-fold error). SIG normally ≈ 0; ICU patients with known unmeasured anions averaged 4.6 and 9.6 mEq/L (Kellum).')}</p>`));
    } else cards.push(card(tr('Trou ionique fort (Stewart)', 'Strong ion gap (Stewart)'), need('na', 'k', 'ica', 'mg', 'cl', 'lactate', 'hco3', 'albumin', 'phosphate', 'ph'), 'pending'));
    if (has('na', 'cl', 'albumin', 'be')) {
      const s = F.storyUnmeasuredAnions({ na: v.na.si, cl: v.cl.si, albumin: v.albumin.si, be: v.be.si });
      cards.push(card(tr('Version simplifiée (Story 2004)', 'Simplified version (Story 2004)'), `
        <p class="res">${tr('Anions non mesurés', 'Unmeasured anions')} : ${f1(s.uma)} mEq/L</p>
        <ol class="steps">${step(`${tr('Effet Na–Cl', 'Na–Cl effect')} = Na − Cl − 38 = ${f2(v.na.si)} − ${f2(v.cl.si)} − 38 = ${f2(s.naCl)}`)}
          ${step(`${tr('Effet albumine', 'Albumin effect')} = 0,25 × (42 − ${f2(v.albumin.si)}) = ${f2(s.alb)}`.replace(/0,25/, ctx.fmt(0.25, 2)))}
          ${step(`${tr('Anions non mesurés', 'Unmeasured anions')} = ${tr('EB', 'BE')} − ${tr('effet Na–Cl', 'Na–Cl effect')} − ${tr('effet albumine', 'albumin effect')} = ${f2(v.be.si)} − ${f2(s.naCl)} − ${f2(s.alb)} = ${f2(s.uma)}`)}</ol>`));
    }
  }
  out.innerHTML = cards.join('');
}

// ================================================================ dextrose ===
function renderDextrose(main) {
  const S = store('dextrose', { target: '0.25' });
  main.innerHTML = `
    <h1 class="page-title">${CALC_INFO.dextrose[ctx.lang][0]}</h1>
    ${banner()}
    <form id="calc-form" novalidate>
      <fieldset><legend>${tr('Bolus', 'Bolus')}</legend>
        ${numField(S, 'weight', tr('Poids', 'Weight'), U.weight)}
        <p class="field-label">${tr('Dose cible', 'Target dose')}</p>
        <div class="radio-row">
          ${['0.25', '0.5', 'free'].map(x => `<label><input type="radio" name="target" value="${x}"${S.target === x ? ' checked' : ''}> ${x === 'free' ? tr('Autre', 'Other') : ctx.fmt(Number(x), 2) + ' g/kg'}</label>`).join('')}
        </div>
        <div data-show-if="target=free"${S.target === 'free' ? '' : ' hidden'}>${numField(S, 'free', tr('Dose cible (autre)', 'Target dose (other)'), [{ u: 'g/kg', f: 1 }])}</div>
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
    <div class="notes"><p>• ${tr('Préférer D10 en périphérie et chez l\'enfant ; D50 est hypertonique et irritant ; nouveau-nés : D10 seulement.', 'Prefer D10 peripherally and in children; D50 is hypertonic and irritant; neonates: D10 only.')}</p>
      <p>• ${tr('Recontrôler la glycémie 10–15 min après le bolus.', 'Recheck glucose 10–15 min after the bolus.')}</p>
      <p class="note-small">${tr('0,2–0,25 g/kg : dose néonatale (Lilien 1980, mini-bolus de 2 mL/kg de D10). D10 vs D50 chez l\'adulte : même délai de récupération, moins de glucose avec D10 (Moore & Woollard 2005). 0,5 g/kg : pratique de réanimation pédiatrique (PALS).', '0.2–0.25 g/kg: neonatal dose (Lilien 1980, 2 mL/kg D10 mini-bolus). D10 vs D50 in adults: same recovery time, less glucose with D10 (Moore & Woollard 2005). 0.5 g/kg: pediatric resuscitation practice (PALS).')}</p></div>
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
    gir.innerHTML = `<p class="res">${f2(g)} mg/kg/min</p><ol class="steps">${step(`GIR = % × ${tr('débit', 'rate')} × 10 / (60 × ${tr('poids', 'weight')}) = ${ctx.fmt(pct.si, 2)} × ${ctx.fmt(rate.si, 2)} × 10 / (60 × ${f2(w.si)}) = ${f2(g)}`)}</ol>`;
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
  const head = (t, d) => `${tr('mL pour', 'mL for')} ${ctx.fmt(t, 3)} g/kg<br><span class="muted">(${f1(w.si)} kg = ${ctx.fmt(d.doseG, 2)} g${d.capped ? ' – max' : ''})</span>`;
  const rows = F.DEXTROSE_SOLUTIONS.map((s, i) => `<tr${s.id === 'D10' ? ' class="hl"' : ''}><th scope="row">${s.id} <span class="muted">(${ctx.fmt(s.gPerMl, 2)} g/mL)</span>${s.id === 'D10' ? `<br><span class="tag">${tr('pédiatrie', 'pediatrics')}</span>` : ''}</th>` +
    `<td${sel === 2 ? ' class="sel"' : ''}>${f1(a.volumes[i].ml)}</td><td${sel === 3 ? ' class="sel"' : ''}>${f1(b.volumes[i].ml)}</td></tr>`).join('');
  const capped = [a, b].some(d => d.capped);
  out.innerHTML = `<div class="result ok">
    <div>${tr('Dose retenue', 'Selected dose')}</div>
    <div class="big">${ctx.fmt((sel === 2 ? a : b).doseG, 2)} g</div>
    ${capped ? `<p class="warnbox">⚠ ${tr(`Plafond de ${F.DEXTROSE_MAX_G} g appliqué (poids × dose cible > ${F.DEXTROSE_MAX_G} g).`, `${F.DEXTROSE_MAX_G} g cap applied (weight × target > ${F.DEXTROSE_MAX_G} g).`)}</p>` : ''}
    <div class="table-wrap"><table class="calc-table dex"><thead><tr><th>${tr('Solution', 'Solution')}</th><th>${head(col2, a)}</th><th>${head(col3, b)}</th></tr></thead><tbody>${rows}</tbody></table></div>
    <ol class="steps">${convLine(tr('Poids', 'Weight'), w)}${step(`${tr('Dose', 'Dose')} (g) = min(${tr('poids', 'weight')} × ${tr('cible', 'target')}, 25) = min(${f2(w.si)} × ${ctx.fmt((sel === 2 ? col2 : col3), 3)}, 25) = ${ctx.fmt((sel === 2 ? a : b).doseG, 3)}`)}
      ${step(`mL = ${tr('dose', 'dose')} (g) / ${tr('concentration', 'concentration')} (g/mL)`)}</ol></div>`;
}

// ================================================================= éthanol ===
function renderEthanol(main) {
  const S = store('ethanol', { target: String(F.ETHANOL.TARGET_DEFAULT), current: '0', strength: '10', route: 'IV', history: 'average' });
  main.innerHTML = `
    <h1 class="page-title">${CALC_INFO.ethanol[ctx.lang][0]}</h1>
    ${banner()}
    <p class="hint">${CALC_INFO.ethanol[ctx.lang][1]}. ${tr('Les patients dialysés reçoivent du fomépizole : pas de débit pendant la dialyse ici.', 'Dialysis centres use fomepizole: no dialysis rates here.')}</p>
    <form id="calc-form" novalidate>
      <fieldset><legend>${tr('Patient et cible', 'Patient and target')}</legend>
        ${numField(S, 'weight', tr('Poids', 'Weight'), U.weight)}
        ${numField(S, 'target', tr('Éthanolémie cible', 'Target ethanol level'), U.ethanol, { hint: tr('AACT : 22–33 mmol/L (100–150 mg/dL)', 'AACT: 22–33 mmol/L (100–150 mg/dL)') })}
        ${numField(S, 'current', tr('Éthanolémie actuelle', 'Current ethanol level'), U.ethanol, { hint: tr('0 si aucun éthanol', '0 if none') })}
      </fieldset>
      <fieldset><legend>${tr('Produit et voie', 'Product and route')}</legend>
        <p class="field-label">${tr('Teneur (% v/v)', 'Strength (% v/v)')}</p>
        <div class="radio-row">${[...F.ETHANOL.STRENGTHS.map(String), 'free'].map(x => `<label><input type="radio" name="strength" value="${x}"${S.strength === x ? ' checked' : ''}> ${x === 'free' ? tr('Autre', 'Other') : x + ' %'}</label>`).join('')}</div>
        <div data-show-if="strength=free"${S.strength === 'free' ? '' : ' hidden'}>${numField(S, 'pct', tr('Teneur (autre)', 'Strength (other)'), [{ u: '% v/v', f: 1 }])}</div>
        <p class="field-label">${tr('Voie', 'Route')}</p>
        <div class="radio-row">${[['IV', 'IV'], ['PO', tr('PO (orale)', 'PO (oral)')]].map(([x, l]) => `<label><input type="radio" name="route" value="${x}"${S.route === x ? ' checked' : ''}> ${l}</label>`).join('')}</div>
        <p class="field-label">${tr('Consommation d\'alcool habituelle (entretien)', 'Drinking history (maintenance)')}</p>
        <div class="radio-row">${[['nonDrinker', tr('Non-buveur', 'Non-drinker')], ['average', tr('Moyenne', 'Average')], ['heavy', tr('Buveur chronique important', 'Chronic heavy drinker')]].map(([x, l]) => `<label><input type="radio" name="history" value="${x}"${S.history === x ? ' checked' : ''}> ${l}</label>`).join('')}</div>
      </fieldset>
    </form>
    <div id="calc-out" aria-live="polite"></div>
    <div class="notes"><h3>${tr('Surveillance (AACT 2002)', 'Monitoring (AACT 2002)')}</h3>
      <p>• ${tr('Éthanolémie aux 1–2 h jusqu\'à 22–33 mmol/L, puis aux 2–4 h.', 'Ethanol level every 1–2 h until in the 22–33 mmol/L range, then every 2–4 h.')}</p>
      <p>• ${tr('Glycémie fréquente chez le jeune enfant.', 'Check glucose often in young children.')}</p>
      <p>• ${tr('Doses = guide initial : l\'élimination varie beaucoup d\'un patient à l\'autre.', 'Doses are an initial guide: elimination varies widely.')}</p></div>
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
  let pct = S.strength === 'free' ? read(S, 'pct', tr('Teneur', 'Strength'), null, 'percent') : { si: Number(S.strength) };
  const errs = [w, tg, cu, pct].filter(x => x.error).map(x => x.error);
  if (errs.length) { out.innerHTML = errorsHtml(errs); return; }
  if (w.blank || tg.blank || pct.blank) { out.innerHTML = `<div class="result empty">${tr('Entrez le poids et la cible pour obtenir le calcul.', 'Enter weight and target to see the calculation.')}</div>`; return; }
  const p = pct.si, kg = w.si;
  const L = F.ethanolLoading({ weightKg: kg, targetMmol: tg.si, currentMmol: cu.si, percent: p });
  const mgkgh = F.ETHANOL.MAINTENANCE[S.history];
  const M = F.ethanolMaintenance({ weightKg: kg, mgPerKgH: mgkgh, percent: p });
  const warns = [];
  if (S.route === 'IV' && p > F.ETHANOL.IV_MAX_PERCENT) warns.push(tr(`IV à plus de ${F.ETHANOL.IV_MAX_PERCENT} % : solution hyperosmolaire (le 10 % nécessite souvent une voie centrale).`, `IV above ${F.ETHANOL.IV_MAX_PERCENT}%: hyperosmolar (10% often needs a central line).`));
  if (tg.si < F.ETHANOL.TARGET_LOW || tg.si > F.ETHANOL.TARGET_HIGH) warns.push(tr('Cible hors de l\'intervalle AACT (22–33 mmol/L).', 'Target outside the AACT range (22–33 mmol/L).'));
  const oral = S.route === 'PO' ? `<p class="warnbox">ⓘ ${tr('Par voie orale, l\'éthanolémie atteinte sera probablement un peu plus basse qu\'en IV : doser et ajuster à la cible.', 'Oral dosing will likely reach a slightly lower ethanol level than IV; check the level and titrate to target.')}</p>` : '';
  const hist = { nonDrinker: tr('non-buveur', 'non-drinker'), average: tr('moyenne', 'average'), heavy: tr('buveur chronique important', 'chronic heavy drinker') }[S.history];
  out.innerHTML = `
    ${warns.map(x => `<p class="warnbox">⚠ ${ctx.esc(x)}</p>`).join('')}
    <div class="result ok"><div>${tr('Dose de charge', 'Loading dose')} – ${ctx.fmt(p, 2)} % ${S.route}</div>
      ${L.alreadyAtTarget ? `<p class="big">0 mL</p><p>${tr('Éthanolémie actuelle ≥ cible : pas de dose de charge.', 'Current level ≥ target: no loading dose.')}</p>`
        : `<div class="big">${f1(L.ml)} mL</div><p>${f2(L.g)} g ${tr('d\'éthanol', 'of ethanol')} · ${ctx.fmt(L.mgPerKg, 0)} mg/kg · ${f2(L.ml / kg)} mL/kg</p>`}
      <ol class="steps">${convLine(tr('Poids', 'Weight'), w)}${convLine(tr('Cible', 'Target'), tg)}${convLine(tr('Actuelle', 'Current'), cu)}
        ${step(`${tr('Charge', 'Load')} (g) = (${tr('cible', 'target')} − ${tr('actuelle', 'current')}) × 0,046 × 0,6 × ${tr('poids', 'weight')} = (${f2(tg.si)} − ${f2(cu.si)}) × 0,046 × 0,6 × ${f2(kg)} = ${f2(L.g)}`.replace(/0,046/g, ctx.fmt(0.046, 3)).replace(/0,6 /g, ctx.fmt(0.6, 1) + ' '))}
        ${step(`g/mL = (${ctx.fmt(p, 2)} / 100) × 0,79 = ${ctx.fmt(L.gPerMl, 4)}`.replace('0,79', ctx.fmt(0.79, 2)))}
        ${step(`mL = ${f2(L.g)} / ${ctx.fmt(L.gPerMl, 4)} = ${f1(L.ml)}`)}</ol>
      <p class="note-small">${tr('La dose de charge ne dépend pas de la consommation habituelle ; elle est réduite si de l\'éthanol est déjà présent (AACT).', 'The loading dose does not depend on drinking history; it is reduced if ethanol is already present (AACT).')}</p>
      ${oral}</div>
    <div class="result ok"><div>${tr('Entretien', 'Maintenance')} – ${hist} (${mgkgh} mg/kg/h)</div>
      <div class="big">${f1(M.mlPerH)} mL/h</div><p>${f2(M.gPerH)} g/h · ${f2(M.mlPerKgH)} mL/kg/h</p>
      <ol class="steps">${step(`mL/h = mg/kg/h × ${tr('poids', 'weight')} / (1000 × g/mL) = ${mgkgh} × ${f2(kg)} / (1000 × ${ctx.fmt(M.gPerMl, 4)}) = ${f1(M.mlPerH)}`)}</ol>
      <p class="note-small">${tr('66 et 154 mg/kg/h : AACT, tableau 3 (adapté de McCoy 1979) ; 110 mg/kg/h : « dose d\'entretien moyenne » du texte AACT.', '66 and 154 mg/kg/h: AACT Table 3 (adapted from McCoy 1979); 110 mg/kg/h: AACT “average maintenance dose” in the text.')}</p>
      ${oral}</div>`;
}

// ============================================================ cinétique ===
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
        <div class="field"><label for="unit">${tr('Unité des concentrations (la même pour toutes)', 'Concentration unit (same for all)')}</label>
          <div class="row"><select id="unit" name="unit">${units.map(u => `<option${u === S.unit ? ' selected' : ''}>${ctx.esc(u)}</option>`).join('')}</select></div></div>
      </fieldset>
      <fieldset><legend>${tr('Concentrations datées', 'Timed levels')}</legend>
        ${levelRow(S, 1)}${levelRow(S, 2)}
        ${numField(S, 'target', tr('Concentration cible', 'Target level'), null)}
        <label class="toggle"><input type="checkbox" name="third"${S.third ? ' checked' : ''}> ${tr('3e concentration (vérifier la linéarité)', '3rd level (check linearity)')}</label>
        <div data-show-if="third"${S.third ? '' : ' hidden'}>${levelRow(S, 3)}</div>
      </fieldset>
    </form>
    <div id="calc-out" aria-live="polite"></div>
    <div class="notes"><h3>${tr('Hypothèses', 'Assumptions')}</h3>
      <p>• ${tr('Concentrations prélevées après l\'absorption et la distribution ; aucun changement de clairance entre elles (dialyse débutée ou arrêtée, antidote donné).', 'Levels drawn after absorption and distribution; no change in clearance between them (dialysis started or stopped, antidote given).')}</p>
      <p>• ${tr('Premier ordre : ne pas utiliser pour l\'éthanol, ni pour la phénytoïne et le salicylate à doses toxiques (saturation : ordre zéro ou Michaelis–Menten).', 'First order: do not use for ethanol, or for phenytoin and salicylate at toxic levels (saturation: zero order or Michaelis–Menten).')}</p>
      <p>• ${tr('Éthanol : élimination typique ≈ 3,3–4,4 mmol/L/h (15–20 mg/dL/h), plus élevée chez le buveur chronique.', 'Ethanol: typical elimination ≈ 3.3–4.4 mmol/L/h (15–20 mg/dL/h), higher in chronic drinkers.')}</p></div>
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

function levelRow(S, n) {
  return `<div class="level-row"><div class="field"><label for="c${n}">${tr('Concentration', 'Level')} ${n}</label><div class="row"><input id="c${n}" name="c${n}" inputmode="decimal" autocomplete="off" value="${ctx.esc(S['c' + n] ?? '')}"></div></div>
    <div class="field"><label for="t${n}">${tr('Date et heure', 'Date and time')} ${n}</label><div class="row"><input id="t${n}" name="t${n}" type="datetime-local" value="${ctx.esc(S['t' + n] ?? '')}"></div></div></div>`;
}

function drawKinetics(S) {
  const out = $('#calc-out');
  const unit = S.unit;
  const errs = [];
  const num = (k, label) => { const r = read(S, k, label, null, 'level'); if (r.error) errs.push(r.error); return r; };
  const time = (k, label) => { if (!S[k]) return null; const d = new Date(S[k]); if (Number.isNaN(d.getTime())) { errs.push(tr(`${label} : date invalide.`, `${label}: invalid date.`)); return null; } return d; };
  const c1 = num('c1', tr('Concentration 1', 'Level 1')), c2 = num('c2', tr('Concentration 2', 'Level 2')), tg = num('target', tr('Cible', 'Target'));
  const t1 = time('t1', tr('Date 1', 'Date 1')), t2 = time('t2', tr('Date 2', 'Date 2'));
  let c3 = null, t3 = null;
  if (S.third) { c3 = num('c3', tr('Concentration 3', 'Level 3')); t3 = time('t3', tr('Date 3', 'Date 3')); }
  if (errs.length) { out.innerHTML = errorsHtml(errs); return; }
  if (c1.blank || c2.blank || !t1 || !t2) { out.innerHTML = `<div class="result empty">${tr('Entrez deux concentrations avec leur date et heure.', 'Enter two levels with their date and time.')}</div>`; return; }
  const r = F.elimination({ order: S.order, c1: c1.si, t1, c2: c2.si, t2, target: tg.blank ? null : tg.si,
    c3: c3 && !c3.blank && t3 ? c3.si : null, t3: c3 && !c3.blank ? t3 : null });
  if (!r.ok) {
    const msg = { levelPositive: tr('Les concentrations doivent être > 0.', 'Levels must be > 0.'), timeOrder: tr('La date 2 doit être après la date 1.', 'Date 2 must be after date 1.'),
      notFalling: tr('Concentration non décroissante : absorption ou redistribution encore en cours.', 'Level not falling: absorption or redistribution still ongoing.'),
      targetPositive: tr('La cible doit être > 0.', 'Target must be > 0.') };
    out.innerHTML = errorsHtml(r.errors.map(e => msg[e])); return;
  }
  const dateFmt = new Intl.DateTimeFormat(ctx.lang === 'fr' ? 'fr-CA' : 'en-CA', { dateStyle: 'medium', timeStyle: 'short' });
  const lines = [], steps = [];
  steps.push(step(`Δt = ${f2(r.dt)} h`));
  if (S.order === 'first') {
    lines.push(`<div class="big">t½ = ${f1(r.halfLife)} h</div><p>k = ${ctx.fmt(r.k, 4)} h⁻¹</p>`);
    steps.push(step(`k = ln(C1 / C2) / Δt = ln(${ctx.fmt(c1.si, 4)} / ${ctx.fmt(c2.si, 4)}) / ${f2(r.dt)} = ${ctx.fmt(r.k, 4)} h⁻¹`));
    steps.push(step(`t½ = ln 2 / k = 0,693 / ${ctx.fmt(r.k, 4)} = ${f2(r.halfLife)} h`.replace('0,693', ctx.fmt(0.693, 3))));
  } else {
    lines.push(`<div class="big">${f2(r.rate)} ${ctx.esc(unit)}/h</div><p>${tr('Vitesse d\'élimination (ordre zéro)', 'Elimination rate (zero order)')}</p>`);
    steps.push(step(`${tr('Vitesse', 'Rate')} = (C1 − C2) / Δt = (${ctx.fmt(c1.si, 4)} − ${ctx.fmt(c2.si, 4)}) / ${f2(r.dt)} = ${ctx.fmt(r.rate, 4)} ${unit}/h`));
    if (S.substance === 'ethanol' && (unit === 'mmol/L' || unit === 'mg/dL')) {
      const lo = unit === 'mmol/L' ? F.ETHANOL_ZERO_ORDER_TYPICAL.low : 15, hi = unit === 'mmol/L' ? F.ETHANOL_ZERO_ORDER_TYPICAL.high : 20;
      lines.push(`<p class="muted">${tr('Typique pour l\'éthanol', 'Typical for ethanol')} : ${ctx.fmt(lo, 1)}–${ctx.fmt(hi, 1)} ${unit}/h</p>`);
    }
  }
  if (r.targetReached) lines.push(`<p>${tr('La cible est déjà atteinte (≥ concentration 2).', 'Target already reached (≥ level 2).')}</p>`);
  else if (r.hoursToTarget != null) {
    lines.push(`<p class="res">${tr('Temps jusqu\'à la cible', 'Time to target')} : ${f1(r.hoursToTarget)} h ${tr('après la concentration 2', 'after level 2')}<br>${tr('Heure prévue', 'Expected at')} : <strong>${ctx.esc(dateFmt.format(r.targetTime))}</strong></p>`);
    steps.push(step(S.order === 'first'
      ? `t = ln(C2 / ${tr('cible', 'target')}) / k = ln(${ctx.fmt(c2.si, 4)} / ${ctx.fmt(tg.si, 4)}) / ${ctx.fmt(r.k, 4)} = ${f2(r.hoursToTarget)} h`
      : `t = (C2 − ${tr('cible', 'target')}) / ${tr('vitesse', 'rate')} = (${ctx.fmt(c2.si, 4)} − ${ctx.fmt(tg.si, 4)}) / ${ctx.fmt(r.rate, 4)} = ${f2(r.hoursToTarget)} h`));
  }
  const w = [];
  if (S.order === 'first' && S.substance === 'ethanol') w.push(tr('Éthanol : utiliser l\'ordre zéro (élimination saturée).', 'Ethanol: use zero order (saturated elimination).'));
  if (r.warnings.includes('thirdInvalid')) w.push(tr('3e concentration ignorée : elle doit être > 0, plus basse que la 2e et datée après elle.', '3rd level ignored: it must be > 0, lower than the 2nd and dated after it.'));
  if (r.linearityDiff != null) {
    const name = S.order === 'first' ? 'k' : tr('vitesse', 'rate');
    steps.push(step(`${name} (2→3) = ${ctx.fmt(r.second, 4)} ; ${tr('écart', 'difference')} = ${ctx.fmt(r.linearityDiff * 100, 1)} %`));
    if (r.warnings.includes('nonLinear')) w.push(tr(`Les deux valeurs de ${name} diffèrent de plus de 20 % : élimination probablement pas ${S.order === 'first' ? 'de premier ordre' : 'd\'ordre zéro'}.`, `The two ${name} values differ by more than 20%: elimination probably not ${S.order === 'first' ? 'first' : 'zero'} order.`));
    else lines.push(`<p>✓ ${tr('Linéarité vérifiée (écart ≤ 20 %).', 'Linearity checked (difference ≤ 20%).')}</p>`);
  }
  out.innerHTML = `${w.map(x => `<p class="warnbox">⚠ ${ctx.esc(x)}</p>`).join('')}<div class="result ok">${lines.join('')}<ol class="steps">${steps.join('')}</ol></div>`;
}

// ------------------------------------------------------------- point d'entrée ---
export function renderPhase1(id, main, context) {
  ctx = context;
  ({ acidbase: renderAcidBase, dextrose: renderDextrose, ethanol: renderEthanol, kinetics: renderKinetics })[id](main);
}
