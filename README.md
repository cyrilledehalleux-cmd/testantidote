# Guide canadien des antidotes – démo (FR/EN)

**DÉMO – contenu non validé / DEMO – content not validated**

Preuve de concept d'une application web installable (PWA), bilingue, utilisable **hors ligne**,
reprenant les **44 monographies** du *Guide canadien des antidotes* (CIUSSS de la Capitale-Nationale), en français et en anglais,
avec un calculateur DigiFab de démonstration.

Navigation par 3 onglets en bas de l'écran : **Antidotes** (liste + recherche par nom ou synonyme),
**Outils** (calculateur DigiFab, abréviations, avis au lecteur, à propos) et **Centres antipoison**
(liste officielle des centres canadiens, avec bouton d'appel). Dans chaque monographie : bouton « Liste »,
« Tout ouvrir / Tout fermer » et une recherche dans la page (surlignage, résultat précédent / suivant).

- **Application en ligne :** https://cyrilledehalleux-cmd.github.io/testantidote/
- Aucun serveur, aucune base de données, aucun suivi des utilisateurs : uniquement des fichiers statiques.

## Organisation

| Dossier | Contenu |
|---|---|
| `content/fr/`, `content/en/` | **Le contenu** : un fichier Markdown par monographie et par langue. C'est le seul endroit à modifier pour changer un texte. |
| `content/GUIDE-EDITION.md` | Guide pas-à-pas pour les cliniciens (modifier, publier, annuler). |
| `source/html/` | Pages officielles téléchargées **sans modification** : monographies, page d'accueil du guide, page « Centres » (+ `manifest.json` : URL, date, empreinte SHA-256). |
| `source/mdcalc/` | Page MDCalc enregistrée (source de la formule du calculateur). |
| `scripts/` | Téléchargement, extraction HTML → Markdown, vérification, rapports (Python). |
| `app/` | L'interface de l'application (HTML/CSS/JavaScript, sans framework). |
| `build/` | Construction de `dist/` et vérification du contenu (Node.js). |
| `tests/` | Tests du calculateur et test hors ligne automatique. |
| `reports/` | Rapport d'extraction, différences, pages de relecture imprimables, résultats des tests. |

## Mettre à jour une monographie

Voir **[content/GUIDE-EDITION.md](content/GUIDE-EDITION.md)**. En résumé : modifier le fichier
dans `content/` sur GitHub (icône crayon) → *Commit changes* → publication automatique en ~2 minutes.

## Relancer l'extraction et la vérification (équipe technique)

Prérequis : Python 3 et Node.js 18+.

```bash
pip install -r requirements.txt
npm ci
```

```bash
python3 scripts/list_antidotes.py   # (si un antidote est ajouté/retiré sur le site) met à jour la liste depuis l'index officiel
npm run download   # télécharge les pages officielles dans source/html/ (le lien « Français » est suivi, jamais deviné)
npm run extract    # source/html/ → content/<lang>/*.md   (ATTENTION : écrase les modifications manuelles)
npm run build      # vérifie le contenu puis construit dist/
npm run verify     # compare le site et le contenu, mot pour mot → reports/verify-diff.txt doit être VIDE
npm run report     # reports/extraction-report.md + reports/review-fr.html / review-en.html
```

- `verify` compare le texte, la structure (titres, paragraphes, niveaux de listes) et la mise en forme
  (gras, italique, souligné, exposant, liens) du site avec le Markdown **et** avec ce qu'affiche réellement
  l'application (`dist/`). Après des modifications manuelles volontaires, des différences sont normales.
- Le texte n'est jamais retapé ni reformulé : il est produit par le script `scripts/extract.py`.

## Tester

```bash
npm run check         # erreurs de mise en forme du contenu (aussi exécuté avant chaque publication)
npm test              # calculateur : exemples MDCalc + validation des saisies + cas de l'équipe (TODO)
npm run build
npm run test:offline  # test hors ligne automatique dans Chromium (Playwright requis)
npm run serve         # essai local : http://localhost:8080/
```

Les **cas de test du calculateur** à calculer à la main par l'équipe sont dans `tests/digifab.test.mjs`
(valeurs `'TODO'` à remplacer ; tant qu'elles valent TODO, ces cas sont « ignorés », jamais « réussis »).

## Publier

La publication est automatique (GitHub Actions → GitHub Pages) à chaque modification de la branche `main` :
`npm run check` → `npm test` → `npm run build` → mise en ligne de `dist/`.
Si une étape échoue, rien n'est publié et la version précédente reste en ligne.

Le dossier `dist/` peut aussi être déposé tel quel sur n'importe quel hébergement statique
(serveur de l'établissement, Netlify, Cloudflare Pages…). Il doit être servi en **HTTPS**
(obligatoire pour le mode hors ligne).

## Calculateur DigiFab (démonstration)

- Formule **MDCalc** (choix de l'équipe) : fioles = [digoxinémie (ng/mL) × poids (kg)] ÷ 100,
  ou [quantité ingérée (mg) ÷ 0,5] × 80 % ; arrondi au nombre entier supérieur ; 1 ng/mL = 1,281 nmol/L.
- Unités SI par défaut (nmol/L, kg), au choix ng/mL, lb, mg, µg.
- Contre-vérification affichée avec la formule du guide officiel (nmol/L × 0,00781 × kg), et la règle
  des 25 % (sans atteinte hémodynamique) du guide officiel, section Posologie.
- Le calcul est dans `app/digifab.js` (constantes en tête de fichier, sources citées).
