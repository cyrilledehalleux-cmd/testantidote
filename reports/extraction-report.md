# Rapport d'extraction / Extraction report

Généré le 2026-11-06 par `scripts/report.py`.

Source : pages officielles du *Guide canadien des antidotes* (CIUSSS de la Capitale-Nationale), téléchargées telles quelles dans `source/html/` (voir `source/html/manifest.json` : URL, date, SHA-256).

## Vérification automatique / Automatic verification

- Pages comparées : **14**, identiques : **14**.
- Application construite (`dist/`) également vérifiée : **oui**.
- `reports/verify-diff.txt` : **vide (aucune différence)**.
- Éléments d'interface du site retirés (et seulement ceux-ci) :
  - bouton : Imprimer
  - bouton : Open all
  - bouton : Ouvrir tout
  - bouton : Print
  - ligne de date : Dernière mise à jour : 2025-03-05
  - ligne de date : Dernière mise à jour : 2026-07-22
  - ligne de date : Dernière mise à jour : 2026-10-23
  - ligne de date : Last updated : 2023-02-01
  - ligne de date : Last updated : 2026-07-22
  - ligne de date : Last updated : 2026-10-23
  - logos des centres antipoison (images externes, 7 par langue)
  - « + » d'affichage devant un titre
- La date « Last updated / Dernière mise à jour » est retirée du texte et comparée séparément avec `last_revision` dans l'en-tête du fichier.
- Méthode : texte du site (bloc principal) et texte du Markdown rendu (moteur CommonMark) comparés ligne par ligne avec le type de ligne (titre et niveau, paragraphe, liste et niveau d'imbrication), puis comparaison de la mise en forme (gras, italique, souligné, exposant, liens). Les espaces de mise en page HTML (espaces multiples, tabulations, retours de ligne dans le code source) sont fusionnés des deux côtés comme le fait un navigateur ; les espaces insécables sont conservés.

## Monographies / Monographs

### Fomépizole / Fomepizole

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/fomepizole.md` | `content/en/fomepizole.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/fomepizole | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/fomepizole |
| Dernière révision | 2026-10-23 | 2026-10-23 |
| Sections (##) | 11 | 11 |
| Sous-sections (###) | 7 | 7 |
| Caractères (texte affiché) | 9779 | 8986 |
| Identique au site | oui | oui |

**Sections, dans l'ordre d'origine :**

| # | FR | EN |
|---|---|---|
| 1 | Points clés | Key points |
| 2 | Synonymes et autres appellations | Synonyms and other terms |
| 3 | Indications | Indications |
| 4 | Posologie | Dosage |
| 4.1 | ↳ Dose pédiatrique | ↳ Pediatric Dose |
| 4.2 | ↳ Dose adulte | ↳ Adult Dose |
| 4.3 | ↳ Insuffisance rénale | ↳ Renal Impairment |
| 4.4 | ↳ Insuffisance hépatique | ↳ Hepatic Impairment |
| 4.5 | ↳ Patient hémodialysé | ↳ Hemodialysis Patient |
| 4.6 | ↳ Grossesse | ↳ Pregnancy |
| 4.7 | ↳ Patient obèse ou avec un surplus de poids | ↳ Obese or Overweight Patient |
| 5 | Effets indésirables | Adverse effects |
| 6 | Surveillance clinique | Monitoring |
| 7 | Fin du traitement | End of treatment |
| 8 | Particularités reliées à l’administration | Special Notes on Administration |
| 9 | Produits disponibles | Available products |
| 10 | Quantité requise pour traiter un patient de 70 kg pendant 24 heures | Amount required to treat a person weighing 70kg during 24 hours |
| 11 | Références | References |

**Anomalies :** aucune.

### Anticorps spécifique de la digoxine / Digoxin-Specific Antibodies

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/digoxin-specific-antibodies.md` | `content/en/digoxin-specific-antibodies.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/anticorps-specifique-de-la-digoxine | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/digoxin-specific-antibodies |
| Dernière révision | 2025-03-05 | 2023-02-01 |
| Sections (##) | 11 | 11 |
| Sous-sections (###) | 7 | 7 |
| Caractères (texte affiché) | 12792 | 11115 |
| Identique au site | oui | oui |

**Sections, dans l'ordre d'origine :**

| # | FR | EN |
|---|---|---|
| 1 | Points clés | Key points |
| 2 | Synonymes et autres appellations | Synonyms and other terms |
| 3 | Indications | Indications |
| 4 | Posologie | Dosage |
| 4.1 | ↳ Dose pédiatrique | ↳ Pediatric Dose |
| 4.2 | ↳ Dose adulte | ↳ Adult Dose |
| 4.3 | ↳ Insuffisance rénale | ↳ Renal Impairment |
| 4.4 | ↳ Insuffisance hépatique | ↳ Hepatic Impairment |
| 4.5 | ↳ Patient hémodialysé | ↳ Hemodialysis Patient |
| 4.6 | ↳ Grossesse | ↳ Pregnancy |
| 4.7 | ↳ Patient obèse ou avec un surplus de poids | ↳ Obese or Overweight Patient |
| 5 | Effets indésirables | Adverse effects |
| 6 | Surveillance clinique | Monitoring |
| 7 | Fin du traitement | End of treatment |
| 8 | Particularités reliées à l’administration | Special Notes on Administration |
| 9 | Produits disponibles | Available products |
| 10 | Quantité requise pour traiter un patient de 70 kg pendant 24 heures | Amount required to treat a person weighing 70kg during 24 hours |
| 11 | Références | References |

**Anomalies :** 
- Dates de révision différentes : FR 2025-03-05, EN 2023-02-01.

### Physostigmine / Physostigmine

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/physostigmine.md` | `content/en/physostigmine.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/physostigmine | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/physostigmine |
| Dernière révision | 2026-07-22 | 2026-07-22 |
| Sections (##) | 11 | 11 |
| Sous-sections (###) | 7 | 7 |
| Caractères (texte affiché) | 8221 | 7234 |
| Identique au site | oui | oui |

**Sections, dans l'ordre d'origine :**

| # | FR | EN |
|---|---|---|
| 1 | Points clés | Key points |
| 2 | Synonymes et autres appellations | Synonyms and other terms |
| 3 | Indications | Indications |
| 4 | Posologie | Dosage |
| 4.1 | ↳ Dose pédiatrique | ↳ Pediatric Dose |
| 4.2 | ↳ Dose adulte | ↳ Adult Dose |
| 4.3 | ↳ Insuffisance rénale | ↳ Renal Impairment |
| 4.4 | ↳ Insuffisance hépatique | ↳ Hepatic Impairment |
| 4.5 | ↳ Patient hémodialysé | ↳ Hemodialysis Patient |
| 4.6 | ↳ Grossesse | ↳ Pregnancy |
| 4.7 | ↳ Patient obèse ou avec un surplus de poids | ↳ Obese or Overweight Patient |
| 5 | Effets indésirables | Adverse effects |
| 6 | Surveillance clinique | Monitoring |
| 7 | Fin du traitement | End of treatment |
| 8 | Particularités reliées à l’administration | Special Notes on Administration |
| 9 | Produits disponibles | Available products |
| 10 | Quantité requise pour traiter un patient de 70 kg pendant 24 heures | Amount required to treat a person weighing 70kg during 24 hours |
| 11 | Références | References |

**Anomalies :** aucune.

## Pages générales / General pages

| Fichier | Titre | Caractères | Identique au site | Anomalies |
|---|---|---|---|---|
| `content/en/advice.md` | Advice to the reader | 1253 | oui | aucune |
| `content/en/about.md` | About us | 454 | oui | aucune |
| `content/en/abbreviations.md` | Abbreviations and acronyms | 946 | oui | aucune |
| `content/fr/advice.md` | Avis au lecteur | 1063 | oui | aucune |
| `content/fr/about.md` | À propos de nous | 514 | oui | aucune |
| `content/fr/abbreviations.md` | Abréviations et acronymes | 1048 | oui | aucune |
| `content/fr/centres.md` | Centres | 661 | oui | aucune |
| `content/en/centres.md` | Centres | 560 | oui | aucune |

## Calculateur / Calculator

- La page officielle *Anticorps spécifique de la digoxine / Digoxin-Specific Antibodies*, section **Posologie / Dosage** (Dose pédiatrique et Dose adulte), donne explicitement les formules : nmol/L × 0,00781 × poids (kg) et [ng/mL × poids (kg)] ÷ 100, arrondi à la fiole supérieure.
- À la demande de l'utilisateur, le calculateur applique la formule de **MDCalc** (DigiFab Dosing for Digoxin Poisoning, page enregistrée dans `source/mdcalc/`) : fioles = [digoxinémie (ng/mL) × poids (kg)] ÷ 100, ou (quantité ingérée en mg ÷ 0,5 mg/fiole) × 80 % ; conversion 1 ng/mL = 1,281 nmol/L (constante de MDCalc). Unités SI par défaut (nmol/L, kg).
- Le résultat de la formule officielle en nmol/L (× 0,00781) est affiché en contre-vérification ; un avertissement apparaît si les deux arrondis diffèrent.
- Cas de test : `tests/digifab.test.mjs` (valeurs attendues à calculer à la main par l'équipe : TODO).

