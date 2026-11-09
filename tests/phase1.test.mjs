// Tests des calculateurs de la phase 1.   Lancer : npm test
//
// 1) EXEMPLES DE LA SPEC (« Phase 1 toxicology equations », 8 nov. 2026) : valeurs attendues
//    recopiées de la spec (tableaux et exemples), pas calculées par nous.
//    Quand la spec arrondit, la tolérance est celle de l'arrondi publié.
// 2) ÉCARTS CONNUS avec les tableaux publiés (signalés dans le rapport) : vérifiés avec leur tolérance.
// 3) CAS DE L'ÉQUIPE : valeurs attendues à calculer À LA MAIN (TODO tant que non remplies → « ignoré »).
import test from 'node:test';
import assert from 'node:assert/strict';
import * as F from '../app/calc/formulas.js';

const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg ?? ''} ${a} ≠ ${b} (± ${tol})`);
const H = h => new Date(Date.UTC(2026, 10, 8, 8) + h * 3600000);

// ---------------------------------------------------------------- 1) spec ---
test('Unités : éthanol 100 mg/dL = 21,7 mmol/L (spec)', () => near(F.toSI(100, F.CONV.ethanol), 21.7, 0.05));
test('Unités : facteurs de conversion = tableau de la spec', () => {
  assert.deepEqual([F.CONV.glucose, F.CONV.urea, F.CONV.ethanol, F.CONV.methanol, F.CONV.ethyleneGlycol, F.CONV.isopropanol, F.CONV.albumin, F.CONV.phosphate, F.CONV.ionCaMg, F.CONV.lactate],
    [18.0, 2.8, 4.6, 3.2, 6.2, 6.0, 0.1, 3.1, 2, 9.0]);
});
test('Hillier : 2,4 / 5,55 ≈ 0,43 par mmol/L (spec)', () => near(2.4 / 5.55, F.HILLIER_FACTOR, 0.005));

test('Dextrose 20 kg : tableau de la spec (0,25 et 0,5 g/kg)', () => {
  assert.deepEqual(F.dextroseBolus({ weightKg: 20, targetGPerKg: 0.25 }).volumes.map(v => v.ml), [100, 50, 20, 10]);
  assert.deepEqual(F.dextroseBolus({ weightKg: 20, targetGPerKg: 0.5 }).volumes.map(v => v.ml), [200, 100, 40, 20]);
});
test('Dextrose : au maximum de 25 g → 500, 250, 100, 50 mL et drapeau « plafond »', () => {
  const r = F.dextroseBolus({ weightKg: 80, targetGPerKg: 0.5 });
  assert.equal(r.doseG, 25); assert.equal(r.capped, true);
  assert.deepEqual(r.volumes.map(v => v.ml), [500, 250, 100, 50]);
});

test('Éthanol : g/mL par teneur = tableau de la spec (0,040 ; 0,079 ; 0,158 ; 0,316)', () => {
  [[5, 0.040], [10, 0.079], [20, 0.158], [40, 0.316]].forEach(([p, g]) => near(F.ethanolGPerMl(p), g, 0.0005, `${p} %`));
});
test('Éthanol : charge à 600 mg/kg = tableau de la spec (mL/kg et mL pour 70 kg)', () => {
  [[5, 15.2, 1063], [10, 7.6, 532], [20, 3.8, 266], [40, 1.9, 133]].forEach(([p, perKg, ml70]) => {
    const perKgCalc = 0.6 / F.ethanolGPerMl(p);
    near(perKgCalc, perKg, 0.05, `${p} % mL/kg`);
    near(perKgCalc * 70, ml70, 0.5, `${p} % 70 kg`);
  });
});
test('Éthanol : entretien = tableau de la spec (10 % IV et 40 % PO, mL/kg/h)', () => {
  [[66, 0.83, 0.21], [110, 1.4, 0.35]].forEach(([m, iv, po]) => {
    near(F.ethanolMaintenance({ weightKg: 1, mgPerKgH: m, percent: 10 }).mlPerKgH, iv, 0.01, `${m} IV`);
    near(F.ethanolMaintenance({ weightKg: 1, mgPerKgH: m, percent: 40 }).mlPerKgH, po, 0.005, `${m} PO`);
  });
  near(F.ethanolMaintenance({ weightKg: 1, mgPerKgH: 154, percent: 40 }).mlPerKgH, 0.49, 0.005, '154 PO');
});
test('Éthanol : la charge ne dépend pas de la consommation et diminue si éthanol présent', () => {
  const a = F.ethanolLoading({ weightKg: 70, targetMmol: 22, currentMmol: 0, percent: 10 });
  const b = F.ethanolLoading({ weightKg: 70, targetMmol: 22, currentMmol: 11, percent: 10 });
  near(b.g, a.g / 2, 1e-9);
  assert.equal(F.ethanolLoading({ weightKg: 70, targetMmol: 22, currentMmol: 25, percent: 10 }).g, 0);
});

test('Demi-vie : 400 puis 200 à 6 h d\'intervalle → t½ = 6 h (exemple de la spec)', () => {
  const r = F.elimination({ c1: 400, t1: H(0), c2: 200, t2: H(6) });
  near(r.halfLife, 6, 1e-9);
});
test('Demi-vie : concentration non décroissante → aucun résultat', () => {
  const r = F.elimination({ c1: 200, t1: H(0), c2: 250, t2: H(6) });
  assert.equal(r.ok, false); assert.deepEqual(r.errors, ['notFalling']);
});
test('Demi-vie : date 2 avant date 1 → aucun résultat', () => {
  assert.equal(F.elimination({ c1: 400, t1: H(6), c2: 200, t2: H(0) }).ok, false);
});
test('Demi-vie : 3e concentration, écart > 20 % → avertissement de non-linéarité', () => {
  const r = F.elimination({ c1: 400, t1: H(0), c2: 200, t2: H(6), c3: 150, t3: H(12) });
  assert.ok(r.warnings.includes('nonLinear'));
});
test('Ordre zéro : vitesse et temps jusqu\'à la cible', () => {
  const r = F.elimination({ order: 'zero', c1: 40, t1: H(0), c2: 32, t2: H(2), target: 20 });
  near(r.rate, 4, 1e-9); near(r.hoursToTarget, 3, 1e-9);
});

// ------------------------------------------------- 2) écarts connus (rapport) ---
test('ÉCART CONNU : charge à 22 mmol/L = 607,2 mg/kg (tableau : 600 mg/kg), soit +1,2 %', () => {
  const r = F.ethanolLoading({ weightKg: 70, targetMmol: 22, percent: 10 });
  near(r.mgPerKg, 607.2, 0.05);
  near(r.ml, 538, 0.5, '70 kg 10 % : 538 mL (tableau 532)');
});
test('ÉCART CONNU : entretien 154 mg/kg/h, 10 % IV = 1,95 mL/kg/h (AACT 1,96)', () => {
  near(F.ethanolMaintenance({ weightKg: 1, mgPerKgH: 154, percent: 10 }).mlPerKgH, 1.96, 0.02);
});
test('ÉCART CONNU : osmolalité, éthanol en mg/dL ÷ 4,6 × 1,25 = ÷ 3,68 (spec/MDCalc : ÷ 3,7)', () => {
  near(F.CONV.ethanol / F.ETHANOL_OSM_FACTOR, 3.7, 0.03);
});

// ---------------------------------------------------- validation des saisies ---
test('Lecture des nombres : virgule acceptée, texte et double virgule refusés', () => {
  assert.equal(F.parseNum('3,6'), 3.6);
  assert.ok(Number.isNaN(F.parseNum('abc')));
  assert.ok(Number.isNaN(F.parseNum('1,2,3')));
  assert.ok(Number.isNaN(F.parseNum('-5')));
  assert.equal(F.parseNum('-5', { allowNegative: true }), -5);
});

// ------------------------------------------------------- 3) cas de l'équipe ---
// Remplacer 'TODO' par la valeur calculée à la main. Unités SI.
const TEAM = [
  { n: 1, name: 'Trou anionique', fn: () => F.anionGap({ na: 138, cl: 102, hco3: 14 }).value, expected: 'TODO' },
  { n: 2, name: 'Trou anionique corrigé', fn: () => F.correctedAnionGap({ ag: 22, albumin: 25 }).value, expected: 'TODO' },
  { n: 3, name: 'Sodium corrigé (glucose 35 mmol/L)', fn: () => F.correctedSodium({ na: 128, glucose: 35 }).value, expected: 'TODO' },
  { n: 4, name: 'Osmolalité calculée avec éthanol 30 mmol/L', fn: () => F.osmolality({ na: 140, glucose: 6, urea: 5, ethanol: 30 }).calc, expected: 'TODO' },
  { n: 5, name: 'Écart osmolaire (mesurée 330)', fn: () => F.osmolality({ na: 140, glucose: 6, urea: 5, ethanol: 30, measured: 330 }).gap, expected: 'TODO' },
  { n: 6, name: 'SIG (Stewart)', fn: () => F.strongIonGap({ na: 140, k: 4, ica: 1.1, mg: 0.8, cl: 105, lactate: 3, hco3: 15, albumin: 35, phosphate: 1.2, ph: 7.25 }).sig, expected: 'TODO' },
  { n: 7, name: 'Dextrose 0,5 g/kg, 12 kg, mL de D10', fn: () => F.dextroseBolus({ weightKg: 12, targetGPerKg: 0.5 }).volumes[1].ml, expected: 'TODO' },
  { n: 8, name: 'Débit de glucose D10 à 30 mL/h, 8 kg (mg/kg/min)', fn: () => F.glucoseInfusionRate({ percent: 10, rateMlH: 30, weightKg: 8 }), expected: 'TODO' },
  { n: 9, name: 'Éthanol : charge 10 % IV, 60 kg, actuelle 5 mmol/L (mL)', fn: () => F.ethanolLoading({ weightKg: 60, targetMmol: 22, currentMmol: 5, percent: 10 }).ml, expected: 'TODO' },
  { n: 10, name: 'Éthanol : entretien moyen 20 % PO, 80 kg (mL/h)', fn: () => F.ethanolMaintenance({ weightKg: 80, mgPerKgH: 110, percent: 20 }).mlPerH, expected: 'TODO' },
  { n: 11, name: 'Demi-vie : 2,8 puis 1,9 à 8 h d\'intervalle (h)', fn: () => F.elimination({ c1: 2.8, t1: H(0), c2: 1.9, t2: H(8) }).halfLife, expected: 'TODO' },
  { n: 12, name: 'Ordre zéro : éthanol 60 → 48 mmol/L en 3 h, temps jusqu\'à 22 (h)', fn: () => F.elimination({ order: 'zero', c1: 60, t1: H(0), c2: 48, t2: H(3), target: 22 }).hoursToTarget, expected: 'TODO' },
];
for (const c of TEAM) {
  test(`Cas équipe n° ${c.n} : ${c.name}`, { skip: c.expected === 'TODO' ? 'valeur attendue à calculer à la main par l\'équipe (TODO)' : false },
    () => near(c.fn(), c.expected, 0.05));
}

// ------------------------------------------- décisions du 9 nov. 2026 (équipe) ---
test('Éthanol PO : biodisponibilité 90 % → dose × 1/0,9 (charge et entretien)', () => {
  const iv = F.ethanolLoading({ weightKg: 70, targetMmol: 22, percent: 40, route: 'IV' });
  const po = F.ethanolLoading({ weightKg: 70, targetMmol: 22, percent: 40, route: 'PO' });
  near(po.g / iv.g, 1 / 0.9, 1e-12); near(po.ml / iv.ml, 1 / 0.9, 1e-12);
  const miv = F.ethanolMaintenance({ weightKg: 70, mgPerKgH: 110, percent: 40, route: 'IV' });
  const mpo = F.ethanolMaintenance({ weightKg: 70, mgPerKgH: 110, percent: 40, route: 'PO' });
  near(mpo.mlPerH / miv.mlPerH, 1 / 0.9, 1e-12);
});
test('Consommations équivalentes : bière 341 mL, vin 142 mL, shot 43 mL, arrondi à ¼ ⅓ ½ ⅔ ¾', () => {
  assert.equal(F.drinkEquivalent(341, 5).value, 1);
  assert.equal(F.drinkEquivalent(142 * 2.5, 10).frac, '½');
  assert.equal(F.drinkEquivalent(43 * 3.3, 40).frac, '⅓');
  assert.equal(F.drinkEquivalent(100, 20), null); // 20 % : pas de consommation de référence
});
