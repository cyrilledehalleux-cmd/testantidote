// Calculateur DigiFab – OUTIL DE DÉMONSTRATION, VÉRIFIER LE CALCUL.
//
// Formule retenue (choix de l'équipe) : MDCalc, « DigiFab® (Digoxin Immune Fab-Ovine)
// Dosing for Digoxin Poisoning » – https://www.mdcalc.com/calc/4036/digifab-dosing-digoxin-poisoning
// (page enregistrée dans source/mdcalc/) :
//   Nombre de fioles = [digoxinémie (ng/mL) × poids (kg)] ÷ 100
//   OU Nombre de fioles = [quantité ingérée (mg) ÷ 0,5 mg/fiole] × 80 % (biodisponibilité)
//   Toujours arrondir au nombre entier supérieur.
//   Conversion MDCalc : 1 ng/mL = 1,281 nmol/L ; 1 lb = 0,453592 kg.
//
// Contre-vérification : Guide canadien des antidotes, monographie « Anticorps spécifique
// de la digoxine », section Posologie (Dose pédiatrique / Dose adulte) :
//   Nombre théorique de fioles = (digoxinémie [nmol/L] × 0,00781) × poids (kg),
//   arrondir au nombre plus élevé suivant de fioles.
//   Sans atteinte hémodynamique : 25 % du nombre théorique, arrondi à la fiole supérieure.
//
// Bornes de saisie : celles de MDCalc (valeurs hors bornes = aucun résultat ;
// valeurs inhabituelles = résultat avec avertissement).

export const CONST = Object.freeze({
  NG_PER_ML_TO_NMOL_PER_L: 1.281, // MDCalc
  LB_TO_KG: 0.453592,              // MDCalc
  MG_PER_VIAL: 0.5,                // MDCalc
  BIOAVAILABILITY: 0.8,            // MDCalc
  DIVISOR: 100,                    // MDCalc / guide officiel (ng/mL)
  OFFICIAL_SI_FACTOR: 0.00781,     // guide officiel (nmol/L)
  OFFICIAL_PARTIAL_FRACTION: 0.25, // guide officiel, sans atteinte hémodynamique
});

// Bornes MDCalc (exprimées dans l'unité de calcul : ng/mL, kg, mg)
export const LIMITS = Object.freeze({
  level: { min: 0, max: 10, warnMax: 3, minExclusive: true },          // ng/mL
  weight: { min: 0.226796, max: 281.22704, warnMax: 226.796 },          // kg
  amount: { min: 0, max: 20, warnMax: 10, minExclusive: true },         // mg
});

export const UNITS = Object.freeze({
  level: ['nmol/L', 'ng/mL'],
  weight: ['kg', 'lb'],
  amount: ['mg', 'µg'],
});

/** Lit un nombre saisi (accepte la virgule décimale). Retourne NaN si invalide. */
export function parseNumber(raw) {
  if (typeof raw === 'number') return raw;
  if (raw == null) return NaN;
  const s = String(raw).trim().replace(/\s| /g, '').replace(',', '.');
  if (!/^\d+(\.\d+)?$|^\.\d+$/.test(s)) return NaN;
  return Number(s);
}

/** Arrondi à l'entier supérieur, sans être piégé par les erreurs d'arrondi binaire
 *  (ex. 1,0000000000000002 → 1 et non 2). */
export function ceilVials(x) {
  return Math.ceil(Math.round(x * 1e9) / 1e9);
}

function checkRange(name, valueInCalcUnit, display) {
  const L = LIMITS[name];
  const errs = [], warns = [];
  if (!Number.isFinite(valueInCalcUnit)) errs.push({ field: name, code: 'nan' });
  else if (L.minExclusive ? valueInCalcUnit <= L.min : valueInCalcUnit < L.min) errs.push({ field: name, code: 'min', display });
  else if (valueInCalcUnit > L.max) errs.push({ field: name, code: 'max', display });
  else if (valueInCalcUnit > L.warnMax) warns.push({ field: name, code: 'warn', display });
  return { errs, warns };
}

/**
 * Calcul par digoxinémie.
 * @param {{level:string|number, levelUnit:'nmol/L'|'ng/mL', weight:string|number, weightUnit:'kg'|'lb'}} input
 * @returns {{ok:boolean, errors:Array, warnings:Array, steps?:Array, vials?:number, ...}}
 */
export function bySerumLevel({ level, levelUnit = 'nmol/L', weight, weightUnit = 'kg' }) {
  const errors = [], warnings = [];
  if (!UNITS.level.includes(levelUnit)) errors.push({ field: 'level', code: 'unit' });
  if (!UNITS.weight.includes(weightUnit)) errors.push({ field: 'weight', code: 'unit' });
  const lv = parseNumber(level), wt = parseNumber(weight);
  if (!Number.isFinite(lv)) errors.push({ field: 'level', code: 'nan' });
  if (!Number.isFinite(wt)) errors.push({ field: 'weight', code: 'nan' });
  if (errors.length) return { ok: false, errors, warnings };

  const steps = [];
  const kg = weightUnit === 'lb' ? wt * CONST.LB_TO_KG : wt;
  if (weightUnit === 'lb') steps.push({ key: 'convWeight', from: wt, fromUnit: 'lb', factor: CONST.LB_TO_KG, to: kg, toUnit: 'kg' });
  const ng = levelUnit === 'nmol/L' ? lv / CONST.NG_PER_ML_TO_NMOL_PER_L : lv;
  if (levelUnit === 'nmol/L') steps.push({ key: 'convLevel', from: lv, fromUnit: 'nmol/L', factor: CONST.NG_PER_ML_TO_NMOL_PER_L, to: ng, toUnit: 'ng/mL' });

  for (const r of [checkRange('level', ng, { value: lv, unit: levelUnit }), checkRange('weight', kg, { value: wt, unit: weightUnit })]) {
    errors.push(...r.errs); warnings.push(...r.warns);
  }
  if (errors.length) return { ok: false, errors, warnings };

  const theoretical = (ng * kg) / CONST.DIVISOR;
  steps.push({ key: 'formulaLevel', levelNg: ng, kg, divisor: CONST.DIVISOR, result: theoretical });
  const vials = ceilVials(theoretical);
  steps.push({ key: 'ceil', from: theoretical, to: vials });

  // Contre-vérification : formule officielle en nmol/L
  const nmol = levelUnit === 'nmol/L' ? lv : lv * CONST.NG_PER_ML_TO_NMOL_PER_L;
  const officialTheoretical = nmol * CONST.OFFICIAL_SI_FACTOR * kg;
  const officialVials = ceilVials(officialTheoretical);
  const partialTheoretical = theoretical * CONST.OFFICIAL_PARTIAL_FRACTION;
  const partialVials = ceilVials(partialTheoretical);

  return {
    ok: true, errors, warnings, steps,
    theoretical, vials,
    input: { level: lv, levelUnit, weight: wt, weightUnit, levelNgPerMl: ng, levelNmolPerL: nmol, weightKg: kg },
    crossCheck: { nmol, kg, factor: CONST.OFFICIAL_SI_FACTOR, theoretical: officialTheoretical, vials: officialVials,
      agrees: officialVials === vials },
    partial: { fraction: CONST.OFFICIAL_PARTIAL_FRACTION, theoretical: partialTheoretical, vials: partialVials },
  };
}

/**
 * Calcul par quantité ingérée.
 * @param {{amount:string|number, amountUnit:'mg'|'µg'}} input
 */
export function byAmountIngested({ amount, amountUnit = 'mg' }) {
  const errors = [], warnings = [];
  if (!UNITS.amount.includes(amountUnit)) errors.push({ field: 'amount', code: 'unit' });
  const a = parseNumber(amount);
  if (!Number.isFinite(a)) errors.push({ field: 'amount', code: 'nan' });
  if (errors.length) return { ok: false, errors, warnings };
  const steps = [];
  const mg = amountUnit === 'µg' ? a / 1000 : a;
  if (amountUnit === 'µg') steps.push({ key: 'convAmount', from: a, fromUnit: 'µg', factor: 1000, to: mg, toUnit: 'mg' });
  const r = checkRange('amount', mg, { value: a, unit: amountUnit });
  errors.push(...r.errs); warnings.push(...r.warns);
  if (errors.length) return { ok: false, errors, warnings };
  const theoretical = (mg / CONST.MG_PER_VIAL) * CONST.BIOAVAILABILITY;
  steps.push({ key: 'formulaAmount', mg, mgPerVial: CONST.MG_PER_VIAL, bio: CONST.BIOAVAILABILITY, result: theoretical });
  const vials = ceilVials(theoretical);
  steps.push({ key: 'ceil', from: theoretical, to: vials });
  return { ok: true, errors, warnings, steps, theoretical, vials, input: { amount: a, amountUnit, mg } };
}
