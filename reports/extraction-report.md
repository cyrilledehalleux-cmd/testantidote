# Rapport d'extraction / Extraction report

Généré le 2026-11-06 par `scripts/report.py`.

Source : pages officielles du *Guide canadien des antidotes* (CIUSSS de la Capitale-Nationale), téléchargées telles quelles dans `source/html/` (voir `source/html/manifest.json` : URL, date, SHA-256).

## Vérification automatique / Automatic verification

- Pages comparées : **96**, identiques : **96**.
- Application construite (`dist/`) également vérifiée : **oui**.
- `reports/verify-diff.txt` : **vide (aucune différence)**.
- Éléments d'interface du site retirés (et seulement ceux-ci) :
  - bloc <style> (mise en forme CSS)
  - bouton : Imprimer
  - bouton : Open all
  - bouton : Ouvrir tout
  - bouton : Print
  - ligne de date : Dernière mise à jour : 2021-09-28
  - ligne de date : Dernière mise à jour : 2022-04-25
  - ligne de date : Dernière mise à jour : 2022-09-12
  - ligne de date : Dernière mise à jour : 2022-11-15
  - ligne de date : Dernière mise à jour : 2022-12-13
  - ligne de date : Dernière mise à jour : 2022-12-14
  - ligne de date : Dernière mise à jour : 2023-01-16
  - ligne de date : Dernière mise à jour : 2023-02-01
  - ligne de date : Dernière mise à jour : 2024-02-27
  - ligne de date : Dernière mise à jour : 2024-06-10
  - ligne de date : Dernière mise à jour : 2024-07-29
  - ligne de date : Dernière mise à jour : 2024-09-05
  - ligne de date : Dernière mise à jour : 2024-10-17
  - ligne de date : Dernière mise à jour : 2024-11-18
  - ligne de date : Dernière mise à jour : 2025-03-05
  - ligne de date : Dernière mise à jour : 2025-09-10
  - ligne de date : Dernière mise à jour : 2025-10-17
  - ligne de date : Dernière mise à jour : 2026-02-10
  - ligne de date : Dernière mise à jour : 2026-02-23
  - ligne de date : Dernière mise à jour : 2026-04-16
  - ligne de date : Dernière mise à jour : 2026-05-27
  - ligne de date : Dernière mise à jour : 2026-07-22
  - ligne de date : Dernière mise à jour : 2026-08-13
  - ligne de date : Dernière mise à jour : 2026-08-25
  - ligne de date : Dernière mise à jour : 2026-10-22
  - ligne de date : Dernière mise à jour : 2026-10-23
  - ligne de date : Last updated : 2021-08-30
  - ligne de date : Last updated : 2021-08-31
  - ligne de date : Last updated : 2022-06-23
  - ligne de date : Last updated : 2022-11-25
  - ligne de date : Last updated : 2022-11-28
  - ligne de date : Last updated : 2022-12-13
  - ligne de date : Last updated : 2022-12-14
  - ligne de date : Last updated : 2023-01-16
  - ligne de date : Last updated : 2023-02-01
  - ligne de date : Last updated : 2023-08-16
  - ligne de date : Last updated : 2024-02-26
  - ligne de date : Last updated : 2024-02-27
  - ligne de date : Last updated : 2024-06-10
  - ligne de date : Last updated : 2024-09-05
  - ligne de date : Last updated : 2024-09-16
  - ligne de date : Last updated : 2024-10-17
  - ligne de date : Last updated : 2025-09-10
  - ligne de date : Last updated : 2025-10-17
  - ligne de date : Last updated : 2026-02-10
  - ligne de date : Last updated : 2026-02-23
  - ligne de date : Last updated : 2026-04-16
  - ligne de date : Last updated : 2026-05-27
  - ligne de date : Last updated : 2026-07-22
  - ligne de date : Last updated : 2026-08-13
  - ligne de date : Last updated : 2026-08-25
  - ligne de date : Last updated : 2026-10-23
  - logos des centres antipoison (images externes, 7 par langue)
  - « + » d'affichage devant un titre
- La date « Last updated / Dernière mise à jour » est retirée du texte et comparée séparément avec `last_revision` dans l'en-tête du fichier.
- Méthode : texte du site (bloc principal) et texte du Markdown rendu (moteur CommonMark) comparés ligne par ligne avec le type de ligne (titre et niveau, paragraphe, liste et niveau d'imbrication), puis comparaison de la mise en forme (gras, italique, souligné, exposant, liens). Les espaces de mise en page HTML (espaces multiples, tabulations, retours de ligne dans le code source) sont fusionnés des deux côtés comme le fait un navigateur ; les espaces insécables sont conservés.

## Monographies / Monographs

### Acétylcystéine / Acetylcysteine

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/acetylcysteine.md` | `content/en/acetylcysteine.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/acetylcysteine | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/acetylcysteine |
| Dernière révision | 2026-02-23 | 2024-02-26 |
| Sections (##) | 11 | 11 |
| Sous-sections (###) | 7 | 7 |
| Caractères (texte affiché) | 17631 | 16126 |
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
- Dates de révision différentes : FR 2026-02-23, EN 2024-02-26.

### Acétate de sodium / Sodium Acetate

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/sodium-acetate.md` | `content/en/sodium-acetate.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/acetate-de-sodium | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/sodium-acetate |
| Dernière révision | 2026-02-23 | 2021-08-30 |
| Sections (##) | 11 | 11 |
| Sous-sections (###) | 7 | 7 |
| Caractères (texte affiché) | 8518 | 7495 |
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
- Dates de révision différentes : FR 2026-02-23, EN 2021-08-30.

### Charbon de bois activé / Activated Charcoal

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/activated-charcoal.md` | `content/en/activated-charcoal.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/charbon-de-bois-active | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/activated-charcoal |
| Dernière révision | 2026-02-10 | 2026-02-10 |
| Sections (##) | 11 | 11 |
| Sous-sections (###) | 7 | 7 |
| Caractères (texte affiché) | 8698 | 7836 |
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

### Atropine / Atropine

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/atropine.md` | `content/en/atropine.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/atropine | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/atropine |
| Dernière révision | 2022-12-13 | 2022-12-13 |
| Sections (##) | 11 | 11 |
| Sous-sections (###) | 7 | 7 |
| Caractères (texte affiché) | 13037 | 11923 |
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

### Barbituriques / Barbiturates

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/barbiturates.md` | `content/en/barbiturates.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/barbituriques | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/barbiturates |
| Dernière révision | 2024-02-27 | 2024-02-27 |
| Sections (##) | 11 | 11 |
| Sous-sections (###) | 7 | 7 |
| Caractères (texte affiché) | 10186 | 9528 |
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

### Benzodiazépines / Benzodiazepines

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/benzodiazepines.md` | `content/en/benzodiazepines.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/benzodiazepines | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/benzodiazepines |
| Dernière révision | 2026-10-23 | 2026-10-23 |
| Sections (##) | 11 | 11 |
| Sous-sections (###) | 7 | 7 |
| Caractères (texte affiché) | 7911 | 6917 |
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
- [EN] Titre <h4> vide ignoré

### Bromocriptine / Bromocriptine

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/bromocriptine.md` | `content/en/bromocriptine.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/bromocriptine | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/bromocriptine |
| Dernière révision | 2024-02-27 | 2024-02-26 |
| Sections (##) | 11 | 11 |
| Sous-sections (###) | 7 | 7 |
| Caractères (texte affiché) | 5521 | 4674 |
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
- Dates de révision différentes : FR 2024-02-27, EN 2024-02-26.

### Calcium (chlorure) / Calcium (Chloride)

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/calcium-chloride.md` | `content/en/calcium-chloride.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/calcium-chlorure | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/calcium-chloride |
| Dernière révision | 2026-04-16 | 2026-04-16 |
| Sections (##) | 11 | 11 |
| Sous-sections (###) | 7 | 7 |
| Caractères (texte affiché) | 7046 | 6087 |
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

### Calcium (gluconate) / Calcium (Gluconate)

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/calcium-gluconate.md` | `content/en/calcium-gluconate.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/calcium-gluconate | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/calcium-gluconate |
| Dernière révision | 2026-04-16 | 2026-04-16 |
| Sections (##) | 11 | 11 |
| Sous-sections (###) | 7 | 7 |
| Caractères (texte affiché) | 13526 | 11703 |
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

### Agents chélateurs (excluant la Déféroxamine) / Chelating agents (excluding Deferoxamine)

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/chelating-agents-excluding-deferoxamine.md` | `content/en/chelating-agents-excluding-deferoxamine.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/agents-chelateurs-excluant-la-deferoxamine | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/chelating-agents-excluding-deferoxamine |
| Dernière révision | 2022-11-15 | 2022-06-23 |
| Sections (##) | 10 | 9 |
| Sous-sections (###) | 0 | 0 |
| Caractères (texte affiché) | 3696 | 3378 |
| Identique au site | oui | oui |

**Sections, dans l'ordre d'origine :**

| # | FR | EN |
|---|---|---|
| 1 | Points clés | Key points |
| 2 | Synonymes et autres appellations | Synonyms and other terms |
| 3 | Indications | Indications |
| 4 | Posologie | Dosage |
| 5 | Effets indésirables | Monitoring |
| 6 | Surveillance clinique | End of treatment |
| 7 | Fin du traitement | Special Notes on Administration |
| 8 | Particularités reliées à l’administration | Available products |
| 9 | Produits disponibles | Amount required to treat a person weighing 70kg during 24 hours |
| 10 | Quantité requise pour traiter un patient de 70 kg pendant 24 heures | *(manquante)* |

**Anomalies :** 
- La structure des sections diffère entre FR et EN (voir la liste ci-dessous).
- Dates de révision différentes : FR 2022-11-15, EN 2022-06-23.

### Cyproheptadine / Cyproheptadine

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/cyproheptadine.md` | `content/en/cyproheptadine.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/cyproheptadine | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/cyproheptadine |
| Dernière révision | 2021-09-28 | 2026-02-23 |
| Sections (##) | 11 | 11 |
| Sous-sections (###) | 7 | 7 |
| Caractères (texte affiché) | 4619 | 3880 |
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
- Dates de révision différentes : FR 2021-09-28, EN 2026-02-23.

### Dantrolène / Dantrolene

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/dantrolene.md` | `content/en/dantrolene.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/dantrolene | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/dantrolene |
| Dernière révision | 2024-10-17 | 2024-10-17 |
| Sections (##) | 11 | 11 |
| Sous-sections (###) | 7 | 6 |
| Caractères (texte affiché) | 5546 | 4409 |
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
| 4.6 | ↳ Grossesse | ↳ Obese or Overweight Patient |
| 4.7 | ↳ Patient obèse ou avec un surplus de poids | ↳ Adverse effects |
| 5 | Effets indésirables | Monitoring |
| 6 | Surveillance clinique | End of treatment |
| 7 | Fin du traitement | Special Notes on Administration |
| 8 | Particularités reliées à l’administration | Available products |
| 9 | Produits disponibles | Amount required to treat a person weighing 70kg during 24 hours |
| 10 | Quantité requise pour traiter un patient de 70 kg pendant 24 heures | References |
| 11 | Références | *(manquante)* |

**Anomalies :** 
- La structure des sections diffère entre FR et EN (voir la liste ci-dessous).

### Déféroxamine / Deferoxamine

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/deferoxamine.md` | `content/en/deferoxamine.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/deferoxamine | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/deferoxamine |
| Dernière révision | 2021-09-28 | 2021-08-31 |
| Sections (##) | 11 | 11 |
| Sous-sections (###) | 7 | 7 |
| Caractères (texte affiché) | 7879 | 6778 |
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
- Dates de révision différentes : FR 2021-09-28, EN 2021-08-31.

### Dextrose / Dextrose

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/dextrose.md` | `content/en/dextrose.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/dextrose | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/dextrose |
| Dernière révision | 2024-07-29 | 2024-09-16 |
| Sections (##) | 11 | 11 |
| Sous-sections (###) | 7 | 7 |
| Caractères (texte affiché) | 8470 | 7417 |
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
- Dates de révision différentes : FR 2024-07-29, EN 2024-09-16.

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

### Diphenhydramine / Diphenhydramine

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/diphenhydramine.md` | `content/en/diphenhydramine.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/diphenhydramine | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/diphenhydramine |
| Dernière révision | 2022-12-14 | 2022-12-14 |
| Sections (##) | 10 | 10 |
| Sous-sections (###) | 7 | 7 |
| Caractères (texte affiché) | 5371 | 4806 |
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

**Anomalies :** aucune.

### Éthanol / Ethanol

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/ethanol.md` | `content/en/ethanol.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/ethanol | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/ethanol |
| Dernière révision | 2026-02-10 | 2026-02-10 |
| Sections (##) | 11 | 11 |
| Sous-sections (###) | 7 | 7 |
| Caractères (texte affiché) | 9465 | 8367 |
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

### Flumazénil / Flumazenil

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/flumazenil.md` | `content/en/flumazenil.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/flumazenil | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/flumazenil |
| Dernière révision | 2023-01-16 | 2022-12-13 |
| Sections (##) | 11 | 11 |
| Sous-sections (###) | 7 | 7 |
| Caractères (texte affiché) | 5721 | 4904 |
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
- Dates de révision différentes : FR 2023-01-16, EN 2022-12-13.

### Acide folique / Folic acid

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/folic-acid.md` | `content/en/folic-acid.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/acide-folique | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/folic-acid |
| Dernière révision | 2022-04-25 | 2022-12-13 |
| Sections (##) | 11 | 11 |
| Sous-sections (###) | 7 | 7 |
| Caractères (texte affiché) | 5171 | 4721 |
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
- Dates de révision différentes : FR 2022-04-25, EN 2022-12-13.

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

### Glucagon / Glucagon

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/glucagon.md` | `content/en/glucagon.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/glucagon | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/glucagon |
| Dernière révision | 2026-08-25 | 2026-08-25 |
| Sections (##) | 11 | 11 |
| Sous-sections (###) | 6 | 6 |
| Caractères (texte affiché) | 6319 | 5606 |
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
| 4.6 | ↳ Patient obèse ou avec un surplus de poids | ↳ Obese or Overweight Patient |
| 5 | Effets indésirables | Adverse effects |
| 6 | Surveillance clinique | Monitoring |
| 7 | Fin du traitement | End of treatment |
| 8 | Particularités reliées à l’administration | Special Notes on Administration |
| 9 | Produits disponibles | Available products |
| 10 | Quantité requise pour traiter un patient de 70 kg pendant 24 heures | Amount required to treat a person weighing 70kg during 24 hours |
| 11 | Références | References |

**Anomalies :** aucune.

### Hydroxocobalamine / Hydroxocobalamin

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/hydroxocobalamin.md` | `content/en/hydroxocobalamin.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/hydroxocobalamine | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/hydroxocobalamin |
| Dernière révision | 2024-11-18 | 2026-02-23 |
| Sections (##) | 11 | 11 |
| Sous-sections (###) | 7 | 7 |
| Caractères (texte affiché) | 9205 | 8248 |
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
- Dates de révision différentes : FR 2024-11-18, EN 2026-02-23.

### Insuline régulière / Insulin Regular

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/insulin-regular.md` | `content/en/insulin-regular.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/insuline-reguliere | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/insulin-regular |
| Dernière révision | 2026-10-22 | 2026-04-16 |
| Sections (##) | 11 | 11 |
| Sous-sections (###) | 7 | 7 |
| Caractères (texte affiché) | 11223 | 10064 |
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
- Dates de révision différentes : FR 2026-10-22, EN 2026-04-16.

### Leucovorine calcique / Leucovorin Calcium

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/leucovorin-calcium.md` | `content/en/leucovorin-calcium.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/leucovorine-calcique | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/leucovorin-calcium |
| Dernière révision | 2024-09-05 | 2024-09-05 |
| Sections (##) | 11 | 11 |
| Sous-sections (###) | 7 | 7 |
| Caractères (texte affiché) | 11828 | 9946 |
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

### Lévocarnitine / Levocarnitine

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/levocarnitine.md` | `content/en/levocarnitine.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/levocarnitine | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/levocarnitine |
| Dernière révision | 2023-01-16 | 2023-01-16 |
| Sections (##) | 11 | 11 |
| Sous-sections (###) | 7 | 7 |
| Caractères (texte affiché) | 6270 | 5379 |
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

### Émulsion lipidique / Lipid Emulsion

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/lipid-emulsion.md` | `content/en/lipid-emulsion.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/emulsion-lipidique | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/lipid-emulsion |
| Dernière révision | 2026-08-13 | 2026-08-13 |
| Sections (##) | 11 | 11 |
| Sous-sections (###) | 7 | 7 |
| Caractères (texte affiché) | 9414 | 8656 |
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

### Bleu de méthylène / Methylene Blue

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/methylene-blue.md` | `content/en/methylene-blue.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/bleu-de-methylene | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/methylene-blue |
| Dernière révision | 2026-05-27 | 2026-05-27 |
| Sections (##) | 11 | 11 |
| Sous-sections (###) | 7 | 7 |
| Caractères (texte affiché) | 8546 | 7795 |
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

### Naloxone (en extrahospitalier) / Naloxone (extrahospital administration)

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/naloxone-extrahospital-administration.md` | `content/en/naloxone-extrahospital-administration.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/naloxone-en-extrahospitalier | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/naloxone-extrahospital-administration |
| Dernière révision | 2024-06-10 | 2024-06-10 |
| Sections (##) | 11 | 11 |
| Sous-sections (###) | 7 | 7 |
| Caractères (texte affiché) | 14151 | 12459 |
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

### Naloxone (en centre hospitalier) / Naloxone (in-hospital administration)

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/naloxone-hospital-administration.md` | `content/en/naloxone-hospital-administration.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/naloxone-en-centre-hospitalier | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/naloxone-hospital-administration |
| Dernière révision | 2025-09-10 | 2025-09-10 |
| Sections (##) | 11 | 11 |
| Sous-sections (###) | 7 | 7 |
| Caractères (texte affiché) | 13927 | 12038 |
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

### Octréotide / Octreotide

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/octreotide.md` | `content/en/octreotide.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/octreotide | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/octreotide |
| Dernière révision | 2025-10-17 | 2025-10-17 |
| Sections (##) | 11 | 11 |
| Sous-sections (###) | 7 | 7 |
| Caractères (texte affiché) | 8048 | 6994 |
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

### Oxygène / Oxygen

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/oxygen.md` | `content/en/oxygen.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/oxygene | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/oxygen |
| Dernière révision | 2021-09-28 | 2021-08-31 |
| Sections (##) | 8 | 8 |
| Sous-sections (###) | 7 | 7 |
| Caractères (texte affiché) | 3845 | 3125 |
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
| 8 | Références | References |

**Anomalies :** 
- Dates de révision différentes : FR 2021-09-28, EN 2021-08-31.

### Phentolamine / Phentolamine

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/phentolamine.md` | `content/en/phentolamine.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/phentolamine | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/phentolamine |
| Dernière révision | 2021-09-28 | 2022-11-25 |
| Sections (##) | 11 | 11 |
| Sous-sections (###) | 7 | 7 |
| Caractères (texte affiché) | 4843 | 3938 |
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
- Dates de révision différentes : FR 2021-09-28, EN 2022-11-25.

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

### Polyéthylène glycol / Polyethylene glycol

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/polyethylene-glycol.md` | `content/en/polyethylene-glycol.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/polyethylene-glycol | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/polyethylene-glycol |
| Dernière révision | 2022-09-12 | 2022-12-13 |
| Sections (##) | 11 | 11 |
| Sous-sections (###) | 7 | 7 |
| Caractères (texte affiché) | 5476 | 4717 |
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
- Dates de révision différentes : FR 2022-09-12, EN 2022-12-13.

### Pralidoxime / Pralidoxime

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/pralidoxime.md` | `content/en/pralidoxime.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/pralidoxime | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/pralidoxime |
| Dernière révision | 2021-09-28 | 2026-02-10 |
| Sections (##) | 11 | 11 |
| Sous-sections (###) | 7 | 7 |
| Caractères (texte affiché) | 6440 | 5294 |
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
- Dates de révision différentes : FR 2021-09-28, EN 2026-02-10.

### Protamine / Protamine

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/protamine.md` | `content/en/protamine.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/protamine | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/protamine |
| Dernière révision | 2024-02-27 | 2024-02-26 |
| Sections (##) | 11 | 11 |
| Sous-sections (###) | 7 | 7 |
| Caractères (texte affiché) | 11705 | 10245 |
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
- Dates de révision différentes : FR 2024-02-27, EN 2024-02-26.
- [FR] Paragraphe vide (ou seulement des espaces) ignoré
- [FR] Paragraphe vide (ou seulement des espaces) ignoré
- [EN] Paragraphe vide (ou seulement des espaces) ignoré
- [EN] Paragraphe vide (ou seulement des espaces) ignoré

### Pyridoxine / Pyridoxine

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/pyridoxine.md` | `content/en/pyridoxine.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/pyridoxine | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/pyridoxine |
| Dernière révision | 2021-09-28 | 2022-11-28 |
| Sections (##) | 11 | 11 |
| Sous-sections (###) | 7 | 7 |
| Caractères (texte affiché) | 7051 | 6043 |
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
- Dates de révision différentes : FR 2021-09-28, EN 2022-11-28.

### Rivastigmine / Rivastigmine

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/rivastigmine.md` | `content/en/rivastigmine.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/rivastigmine | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/rivastigmine |
| Dernière révision | 2026-07-22 | 2026-07-22 |
| Sections (##) | 11 | 11 |
| Sous-sections (###) | 7 | 7 |
| Caractères (texte affiché) | 8289 | 7103 |
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

### Bicarbonate de sodium / Sodium Bicarbonate

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/sodium-bicarbonate.md` | `content/en/sodium-bicarbonate.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/bicarbonate-de-sodium | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/sodium-bicarbonate |
| Dernière révision | 2022-09-12 | 2022-11-28 |
| Sections (##) | 11 | 11 |
| Sous-sections (###) | 7 | 7 |
| Caractères (texte affiché) | 11822 | 10726 |
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
- Dates de révision différentes : FR 2022-09-12, EN 2022-11-28.

### Chlorure de sodium à 3% / Sodium Chloride (3%)

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/sodium-chloride-3.md` | `content/en/sodium-chloride-3.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/chlorure-de-sodium-3 | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/sodium-chloride-3 |
| Dernière révision | 2021-09-28 | 2023-08-16 |
| Sections (##) | 11 | 11 |
| Sous-sections (###) | 7 | 7 |
| Caractères (texte affiché) | 4247 | 3489 |
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
- Dates de révision différentes : FR 2021-09-28, EN 2023-08-16.

### Thiosulfate de sodium / Sodium Thiosulfate

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/sodium-thiosulfate.md` | `content/en/sodium-thiosulfate.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/thiosulfate-de-sodium | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/sodium-thiosulfate |
| Dernière révision | 2021-09-28 | 2022-12-13 |
| Sections (##) | 11 | 11 |
| Sous-sections (###) | 7 | 7 |
| Caractères (texte affiché) | 5742 | 4759 |
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
- Dates de révision différentes : FR 2021-09-28, EN 2022-12-13.

### Sirop d'ipéca / Syrup of Ipecac

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/syrup-ipecac.md` | `content/en/syrup-ipecac.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/sirop-dipeca | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/syrup-ipecac |
| Dernière révision | 2021-09-28 | 2021-08-31 |
| Sections (##) | 3 | 3 |
| Sous-sections (###) | 0 | 0 |
| Caractères (texte affiché) | 1056 | 567 |
| Identique au site | oui | oui |

**Sections, dans l'ordre d'origine :**

| # | FR | EN |
|---|---|---|
| 1 | Points clés | Key points |
| 2 | Synonymes et autres appellations | Synonyms and other terms |
| 3 | Références | References |

**Anomalies :** 
- Dates de révision différentes : FR 2021-09-28, EN 2021-08-31.

### Thiamine / Thiamine

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/thiamine.md` | `content/en/thiamine.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/thiamine | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/thiamine |
| Dernière révision | 2021-09-28 | 2021-08-31 |
| Sections (##) | 11 | 11 |
| Sous-sections (###) | 7 | 7 |
| Caractères (texte affiché) | 4968 | 4123 |
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
- Dates de révision différentes : FR 2021-09-28, EN 2021-08-31.

### Vitamine K1 / Vitamin K1

| | FR | EN |
|---|---|---|
| Fichier | `content/fr/vitamin-k1.md` | `content/en/vitamin-k1.md` |
| Source | https://www.ciusss-capitalenationale.gouv.qc.ca/antidotes/vitamine-k1 | https://www.ciusss-capitalenationale.gouv.qc.ca/en/antidotes/vitamin-k1 |
| Dernière révision | 2023-02-01 | 2026-02-23 |
| Sections (##) | 11 | 11 |
| Sous-sections (###) | 7 | 7 |
| Caractères (texte affiché) | 6654 | 5723 |
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
- Dates de révision différentes : FR 2023-02-01, EN 2026-02-23.

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

