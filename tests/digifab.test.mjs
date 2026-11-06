// Tests du calculateur DigiFab.   Lancer : npm test
//
// 1) CAS DE L'ÉQUIPE (au moins 10) — les valeurs attendues doivent être calculées
//    À LA MAIN par l'équipe clinique, puis inscrites ici à la place de 'TODO'.
//    Tant qu'une valeur vaut 'TODO', le cas est signalé « ignoré » (skip), jamais réussi.
//    Ne pas recopier le résultat de l'application : le but est de la vérifier.
//
// 2) EXEMPLES PUBLIÉS PAR MDCALC (rubrique « Formula ») : valeurs attendues
//    recopiées de MDCalc, pas calculées par nous.
//
// 3) VALIDATION DES SAISIES : aucune valeur clinique, on vérifie seulement
//    qu'une saisie invalide ne produit jamais de résultat.
import test from 'node:test';
import assert from 'node:assert/strict';
import { bySerumLevel, byAmountIngested, parseNumber, ceilVials } from '../app/digifab.js';

const TEAM_CASES = [
  // mode: 'level' → level, levelUnit, weight, weightUnit ; mode: 'amount' → amount, amountUnit
  // expectedVials : nombre de fioles arrondi (entier) ; expectedTheoretical : avant arrondi (facultatif)
  { n: 1, mode: 'level', level: '3.6', levelUnit: 'nmol/L', weight: '65', weightUnit: 'kg', expectedVials: 'TODO', expectedTheoretical: 'TODO' },
  { n: 2, mode: 'level', level: '5', levelUnit: 'nmol/L', weight: '70', weightUnit: 'kg', expectedVials: 'TODO', expectedTheoretical: 'TODO' },
  { n: 3, mode: 'level', level: '10', levelUnit: 'nmol/L', weight: '80', weightUnit: 'kg', expectedVials: 'TODO', expectedTheoretical: 'TODO' },
  { n: 4, mode: 'level', level: '2.6', levelUnit: 'nmol/L', weight: '15', weightUnit: 'kg', expectedVials: 'TODO', expectedTheoretical: 'TODO' },
  { n: 5, mode: 'level', level: '7,5', levelUnit: 'nmol/L', weight: '8', weightUnit: 'kg', expectedVials: 'TODO', expectedTheoretical: 'TODO' },
  { n: 6, mode: 'level', level: '4', levelUnit: 'ng/mL', weight: '60', weightUnit: 'kg', expectedVials: 'TODO', expectedTheoretical: 'TODO' },
  { n: 7, mode: 'level', level: '2.8', levelUnit: 'ng/mL', weight: '143', weightUnit: 'lb', expectedVials: 'TODO', expectedTheoretical: 'TODO' },
  { n: 8, mode: 'level', level: '12', levelUnit: 'nmol/L', weight: '100', weightUnit: 'kg', expectedVials: 'TODO', expectedTheoretical: 'TODO' },
  { n: 9, mode: 'amount', amount: '4', amountUnit: 'mg', expectedVials: 'TODO', expectedTheoretical: 'TODO' },
  { n: 10, mode: 'amount', amount: '12.5', amountUnit: 'mg', expectedVials: 'TODO', expectedTheoretical: 'TODO' },
  { n: 11, mode: 'amount', amount: '750', amountUnit: 'µg', expectedVials: 'TODO', expectedTheoretical: 'TODO' },
  { n: 12, mode: 'level', level: '1.281', levelUnit: 'nmol/L', weight: '100', weightUnit: 'kg', expectedVials: 'TODO', expectedTheoretical: 'TODO' },
];

const run = c => c.mode === 'amount' ? byAmountIngested(c) : bySerumLevel(c);

for (const c of TEAM_CASES) {
  const label = `Cas équipe n° ${c.n} (${c.mode === 'amount' ? `${c.amount} ${c.amountUnit}` : `${c.level} ${c.levelUnit}, ${c.weight} ${c.weightUnit}`})`;
  const todo = c.expectedVials === 'TODO';
  test(label, { skip: todo ? 'valeur attendue à calculer à la main par l\'équipe (TODO)' : false }, () => {
    const r = run(c);
    assert.equal(r.ok, true, 'le calcul doit aboutir');
    assert.equal(r.vials, c.expectedVials);
    if (c.expectedTheoretical !== 'TODO' && c.expectedTheoretical != null)
      assert.ok(Math.abs(r.theoretical - c.expectedTheoretical) < 0.005, `théorique ${r.theoretical} ≠ ${c.expectedTheoretical}`);
  });
}

test('au moins 10 cas d\'équipe prévus', () => assert.ok(TEAM_CASES.length >= 10));

// --- Exemples publiés par MDCalc (rubrique Formula de la page) ---
test('MDCalc exemple 1 : 2,8 ng/mL, 65 kg → 1,82 → 2 fioles', () => {
  const r = bySerumLevel({ level: '2.8', levelUnit: 'ng/mL', weight: '65', weightUnit: 'kg' });
  assert.equal(r.ok, true);
  assert.equal(Math.round(r.theoretical * 100) / 100, 1.82);
  assert.equal(r.vials, 2);
});
test('MDCalc exemple 2 : 4 mg ingérés → 6,4 → 7 fioles', () => {
  const r = byAmountIngested({ amount: '4', amountUnit: 'mg' });
  assert.equal(r.ok, true);
  assert.equal(Math.round(r.theoretical * 10) / 10, 6.4);
  assert.equal(r.vials, 7);
});

// --- Validation des saisies : jamais de résultat pour une saisie invalide ---
const invalid = [
  ['vide', { level: '', weight: '70' }],
  ['texte', { level: 'abc', weight: '70' }],
  ['négatif', { level: '-2', weight: '70' }],
  ['zéro', { level: '0', weight: '70' }],
  ['poids zéro', { level: '3', weight: '0' }],
  ['poids absurde', { level: '3', weight: '900' }],
  ['digoxinémie au-delà des bornes MDCalc (> 10 ng/mL)', { level: '11', levelUnit: 'ng/mL', weight: '70' }],
  ['digoxinémie au-delà des bornes MDCalc (> 12,81 nmol/L)', { level: '13', levelUnit: 'nmol/L', weight: '70' }],
  ['unité inconnue', { level: '3', levelUnit: 'mmol/L', weight: '70' }],
  ['deux virgules', { level: '3,2,1', weight: '70' }],
  ['notation exponentielle', { level: '1e1', weight: '70' }],
];
for (const [name, inp] of invalid) {
  test(`saisie invalide (${name}) → aucun résultat`, () => {
    const r = bySerumLevel(inp);
    assert.equal(r.ok, false);
    assert.equal(r.vials, undefined);
    assert.ok(r.errors.length > 0);
  });
}
for (const [name, amount] of [['zéro', '0'], ['négatif', '-1'], ['> 20 mg', '25'], ['texte', 'x']]) {
  test(`quantité ingérée invalide (${name}) → aucun résultat`, () => {
    const r = byAmountIngested({ amount, amountUnit: 'mg' });
    assert.equal(r.ok, false);
    assert.equal(r.vials, undefined);
  });
}

test('virgule décimale acceptée', () => assert.equal(parseNumber('2,8'), 2.8));
test('arrondi supérieur sans erreur binaire', () => {
  assert.equal(ceilVials(1.0000000000000002), 1);
  assert.equal(ceilVials(1.01), 2);
});
test('valeur inhabituelle → résultat + avertissement', () => {
  const r = bySerumLevel({ level: '5', levelUnit: 'ng/mL', weight: '70' });
  assert.equal(r.ok, true);
  assert.ok(r.warnings.some(w => w.field === 'level'));
});
test('contre-vérification officielle (× 0,00781) présente', () => {
  const r = bySerumLevel({ level: '3.6', levelUnit: 'nmol/L', weight: '65' });
  assert.equal(typeof r.crossCheck.vials, 'number');
  assert.equal(typeof r.crossCheck.agrees, 'boolean');
});
