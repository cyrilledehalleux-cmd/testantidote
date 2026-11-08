// Calculateurs de toxicologie – phase 1 (OUTILS DE DÉMONSTRATION – VÉRIFIER LE CALCUL).
// Source : « Phase 1 toxicology equations: spec for the app » (8 nov. 2026), décisions de l'équipe.
// Les références d'origine de chaque formule sont citées dans REFS (affichées sous chaque calculateur).
// Aucune IA dans l'application : uniquement de l'arithmétique déterministe, identique à chaque exécution.
// Toutes les valeurs sont stockées en unités SI ; les unités conventionnelles sont converties à la saisie.

// ------------------------------------------------------------------ unités ---
// « Conventionnel = SI × facteur » (tableau « Units » de la spec)
export const CONV = Object.freeze({
  glucose: 18.0,       // mg/dL
  urea: 2.8,           // BUN mg/dL (urée mmol/L × 2,8)
  ethanol: 4.6,        // mg/dL
  methanol: 3.2,       // mg/dL
  ethyleneGlycol: 6.2, // mg/dL
  isopropanol: 6.0,    // mg/dL
  albumin: 0.1,        // g/dL (SI : g/L)
  phosphate: 3.1,      // mg/dL
  ionCaMg: 2,          // mEq/L (Ca ionisé, Mg)
  lactate: 9.0,        // mg/dL
  electrolyte: 1,      // Na, K, Cl, HCO3 : mEq/L = mmol/L
});
export const LB_TO_KG = 0.453592;

/** Lit un nombre saisi (virgule ou point décimal ; signe « - » permis si allowNegative). NaN si invalide. */
export function parseNum(raw, { allowNegative = false } = {}) {
  if (typeof raw === 'number') return raw;
  if (raw == null) return NaN;
  const s = String(raw).trim().replace(/[\s ]/g, '').replace(',', '.').replace(/^[−–]/, '-');
  const re = allowNegative ? /^-?(\d+(\.\d+)?|\.\d+)$/ : /^(\d+(\.\d+)?|\.\d+)$/;
  return re.test(s) ? Number(s) : NaN;
}
export const isBlank = raw => raw == null || String(raw).trim() === '';
/** Valeur conventionnelle → SI */
export const toSI = (value, factor) => value / factor;

/** Arrondi à l'entier supérieur sans piège binaire (1,0000000000000002 → 1). */
export const ceilSafe = x => Math.ceil(Math.round(x * 1e9) / 1e9);

// ------------------------------------------------- 1–5. acide-base, osmolalité ---
export const AG_HIGH = 11;            // mmol/L (ère des électrodes sélectives ; Winter 1990, Lolekha 2001)
export const ALBUMIN_NORMAL = 40;     // g/L, fixe (MDCalc) ; Figge 1998 utilisait 44 g/L
export const AG_ALB_FACTOR = 0.25;    // Figge 1998 / Fencl 2000
export const HILLIER_FACTOR = 0.43;   // 2,4 mmol/L par 100 mg/dL au-delà de 100 mg/dL → 2,4 / 5,55
export const HILLIER_BASE = 5.6;      // mmol/L
export const HILLIER_NONLINEAR = 22;  // mmol/L : au-delà, la correction réelle peut être plus grande
export const ETHANOL_OSM_FACTOR = 1.25; // Purssell 2001 (pente de régression)
export const OSM_GAP_HIGH = 10;       // mOsm/kg (Lynd 2008)
// Intervalle résiduel de l'écart osmolaire avec la formule de Purssell (groupe de validation : 0,84 ± 5,65 ;
// environ 95 % entre −10 et +12) — utilisé pour l'incertitude de l'estimation d'alcool toxique.
export const OSM_GAP_RESIDUAL = Object.freeze({ low: -10, high: 12 });
export const STORY_NACL = 38;         // Story 2004
export const STORY_ALB_NORMAL = 42;   // g/L, Story 2004

/** Trou anionique : Na − (Cl + HCO3), sans K. */
export function anionGap({ na, cl, hco3 }) {
  const value = na - (cl + hco3);
  return { value, high: value > AG_HIGH };
}

/** Trou anionique corrigé pour l'albumine (Figge) : AG + 0,25 × (40 − albumine g/L). */
export function correctedAnionGap({ ag, albumin }) {
  const value = ag + AG_ALB_FACTOR * (ALBUMIN_NORMAL - albumin);
  return { value, high: value > AG_HIGH };
}

/** Sodium corrigé pour l'hyperglycémie (Hillier) : Na + 0,43 × (glucose − 5,6). */
export function correctedSodium({ na, glucose }) {
  const value = na + HILLIER_FACTOR * (glucose - HILLIER_BASE);
  return { value, nonLinear: glucose > HILLIER_NONLINEAR };
}

/** Osmolalité calculée (Purssell) : 2 Na + glucose + urée + 1,25 × éthanol ; écart = mesurée − calculée. */
export function osmolality({ na, glucose, urea, ethanol = 0, measured = null }) {
  const calc = 2 * na + glucose + urea + ETHANOL_OSM_FACTOR * ethanol;
  const gap = measured == null ? null : measured - calc;
  return { calc, gap, high: gap != null && gap > OSM_GAP_HIGH };
}

/**
 * Estimation d'alcool toxique à partir de l'écart osmolaire, SI tout l'écart était dû à un seul alcool,
 * en supposant 1 mOsm/kg par mmol/L d'alcool. Plage d'incertitude : écart résiduel de Purssell (−10 à +12).
 * (Hypothèse de calcul ajoutée pour l'application : à valider par l'équipe.)
 */
export function toxicAlcoholFromGap(gap) {
  const est = Math.max(0, gap);
  const low = Math.max(0, gap - OSM_GAP_RESIDUAL.high);
  const high = Math.max(0, gap - OSM_GAP_RESIDUAL.low);
  const row = factor => ({ mmol: est, mmolLow: low, mmolHigh: high, mgdl: est * factor, mgdlLow: low * factor, mgdlHigh: high * factor });
  return { methanol: row(CONV.methanol), ethyleneGlycol: row(CONV.ethyleneGlycol), isopropanol: row(CONV.isopropanol) };
}

/**
 * Trou ionique fort (Stewart ; Fencl 2000 éq. 2a et 2b, albumine en g/L).
 * SIDa = Na + K + 2 Ca ionisé + 2 Mg − Cl − lactate ;
 * SIDe = HCO3 + Alb × (0,123 pH − 0,631) + Phos × (0,309 pH − 0,469) ; SIG = SIDa − SIDe.
 */
export function strongIonGap({ na, k, ica, mg, cl, lactate, hco3, albumin, phosphate, ph }) {
  const sida = na + k + 2 * ica + 2 * mg - cl - lactate;
  const albTerm = albumin * (0.123 * ph - 0.631);
  const phosTerm = phosphate * (0.309 * ph - 0.469);
  const side = hco3 + albTerm + phosTerm;
  return { sida, side, albTerm, phosTerm, sig: sida - side };
}

/** Version simplifiée (Story 2004) : effet Na–Cl = Na − Cl − 38 ; effet albumine = 0,25 × (42 − alb) ;
 *  anions non mesurés = excès de base − effet Na–Cl − effet albumine. */
export function storyUnmeasuredAnions({ na, cl, albumin, be }) {
  const naCl = na - cl - STORY_NACL;
  const alb = AG_ALB_FACTOR * (STORY_ALB_NORMAL - albumin);
  return { naCl, alb, uma: be - naCl - alb };
}

// ---------------------------------------------------------------- dextrose ---
export const DEXTROSE_MAX_G = 25;
export const DEXTROSE_SOLUTIONS = Object.freeze([
  { id: 'D5', gPerMl: 0.05 },
  { id: 'D10', gPerMl: 0.10 },
  { id: 'D25', gPerMl: 0.25 },
  { id: 'D50', gPerMl: 0.50 },
]);
export const DEXTROSE_PRESETS = Object.freeze([0.25, 0.5]); // g/kg

/** Dose (g) = min(poids × cible, 25) ; volume (mL) = dose / concentration (g/mL). */
export function dextroseBolus({ weightKg, targetGPerKg }) {
  const raw = weightKg * targetGPerKg;
  const doseG = Math.min(raw, DEXTROSE_MAX_G);
  return {
    raw, doseG, capped: raw > DEXTROSE_MAX_G,
    volumes: DEXTROSE_SOLUTIONS.map(s => ({ id: s.id, gPerMl: s.gPerMl, ml: doseG / s.gPerMl })),
  };
}

/** Débit de glucose (mg/kg/min) = % × débit (mL/h) × 10 / (60 × poids kg). */
export function glucoseInfusionRate({ percent, rateMlH, weightKg }) {
  return (percent * rateMlH * 10) / (60 * weightKg);
}

// ----------------------------------------------------------------- éthanol ---
export const ETHANOL = Object.freeze({
  MMOL_TO_G_PER_L: 0.046, // mmol/L → g/L
  VD: 0.6,                // L/kg (AACT ; plage 0,6–0,7)
  DENSITY: 0.79,          // g/mL (AACT)
  TARGET_DEFAULT: 22,     // mmol/L (≈ 100 mg/dL)
  TARGET_LOW: 22, TARGET_HIGH: 33, // AACT : 22–33 mmol/L (100–150 mg/dL)
  IV_MAX_PERCENT: 10,     // au-delà : hyperosmolaire (souvent voie centrale dès 10 %)
  STRENGTHS: [5, 10, 20, 40],
  // mg/kg/h : AACT tableau 3 (adapté de McCoy 1979) ; 110 = « dose d'entretien moyenne » (texte AACT)
  MAINTENANCE: { nonDrinker: 66, average: 110, heavy: 154 },
});

/** g d'éthanol par mL pour une teneur (% v/v) : (% / 100) × 0,79 */
export const ethanolGPerMl = percent => (percent / 100) * ETHANOL.DENSITY;

/** Dose de charge : (cible − actuelle) × 0,046 × 0,6 × poids (g) ; volume = g / g par mL. */
export function ethanolLoading({ weightKg, targetMmol, currentMmol = 0, percent }) {
  const delta = targetMmol - currentMmol;
  const g = Math.max(0, delta) * ETHANOL.MMOL_TO_G_PER_L * ETHANOL.VD * weightKg;
  const gPerMl = ethanolGPerMl(percent);
  return { delta, g, gPerMl, ml: g / gPerMl, mgPerKg: (g * 1000) / weightKg, alreadyAtTarget: delta <= 0 };
}

/** Entretien : débit (mL/h) = mg/kg/h × poids / (1000 × g par mL). */
export function ethanolMaintenance({ weightKg, mgPerKgH, percent }) {
  const gPerMl = ethanolGPerMl(percent);
  const gPerH = (mgPerKgH * weightKg) / 1000;
  return { gPerH, gPerMl, mlPerH: gPerH / gPerMl, mlPerKgH: mgPerKgH / (1000 * gPerMl) };
}

// ------------------------------------------------- demi-vie, temps jusqu'à la cible ---
export const LINEARITY_TOLERANCE = 0.2; // écart > 20 % entre deux constantes → cinétique non linéaire
export const ETHANOL_ZERO_ORDER_TYPICAL = Object.freeze({ low: 3.3, high: 4.4 }); // mmol/L/h (15–20 mg/dL/h)

const hoursBetween = (a, b) => (b - a) / 3600000;

/**
 * Premier ordre : k = ln(C1/C2) / (t2 − t1) ; t½ = ln 2 / k ; temps jusqu'à la cible = ln(C2/Ccible) / k.
 * Ordre zéro : vitesse = (C1 − C2) / (t2 − t1) ; temps = (C2 − Ccible) / vitesse.
 * t1, t2, t3 : objets Date. Retourne { ok, errors, warnings, ... }.
 */
export function elimination({ order = 'first', c1, t1, c2, t2, target, c3 = null, t3 = null }) {
  const errors = [], warnings = [];
  if (!(c1 > 0) || !(c2 > 0)) errors.push('levelPositive');
  const dt = hoursBetween(t1, t2);
  if (!(dt > 0)) errors.push('timeOrder');
  if (errors.length) return { ok: false, errors, warnings };
  if (c2 >= c1) return { ok: false, errors: ['notFalling'], warnings };
  if (target != null && !(target > 0)) return { ok: false, errors: ['targetPositive'], warnings };

  const res = { ok: true, errors, warnings, order, dt };
  if (order === 'first') {
    res.k = Math.log(c1 / c2) / dt;
    res.halfLife = Math.LN2 / res.k;
  } else {
    res.rate = (c1 - c2) / dt;
  }
  if (target != null) {
    if (target >= c2) res.targetReached = true;
    else {
      res.hoursToTarget = order === 'first' ? Math.log(c2 / target) / res.k : (c2 - target) / res.rate;
      res.targetTime = new Date(t2.getTime() + res.hoursToTarget * 3600000);
    }
  }
  if (c3 != null && t3 != null) {
    const dt2 = hoursBetween(t2, t3);
    if (!(dt2 > 0) || !(c3 > 0) || c3 >= c2) warnings.push('thirdInvalid');
    else {
      const second = order === 'first' ? Math.log(c2 / c3) / dt2 : (c2 - c3) / dt2;
      const first = order === 'first' ? res.k : res.rate;
      res.second = second;
      res.linearityDiff = Math.abs(second - first) / first;
      if (res.linearityDiff > LINEARITY_TOLERANCE) warnings.push('nonLinear');
    }
  }
  return res;
}

// --------------------------------------------------- bornes de saisie (SI) ---
// Bornes de plausibilité de l'application (pas dans la spec) : une valeur hors bornes
// n'affiche AUCUN résultat. À valider par l'équipe.
export const BOUNDS = Object.freeze({
  na: [90, 200], k: [1, 12], cl: [50, 160], hco3: [1, 60], glucose: [0.5, 150], urea: [0.3, 150],
  ethanol: [0, 200], albumin: [5, 70], measured: [200, 600], ica: [0.2, 3], mg: [0.1, 5],
  lactate: [0, 40], phosphate: [0.1, 8], ph: [6.5, 8], be: [-40, 40],
  weight: [0.3, 300], dextroseTarget: [0.01, 2], ethanolTarget: [5, 60], ethanolCurrent: [0, 200],
  percent: [1, 96], rateMlH: [0.1, 2000], level: [0, 1e6],
});
