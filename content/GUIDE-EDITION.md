# Guide d'édition des monographies

Ce guide explique comment modifier le contenu de l'application **sans connaissances en programmation**.
Tout se fait dans le navigateur, sur le site GitHub. Aucun logiciel à installer.

---

## 1. Où se trouvent les textes ?

Chaque monographie existe en **deux fichiers**, un par langue :

| Monographie | Français | Anglais |
|---|---|---|
| Anticorps spécifique de la digoxine | `content/fr/digoxin-specific-antibodies.md` | `content/en/digoxin-specific-antibodies.md` |
| Fomépizole | `content/fr/fomepizole.md` | `content/en/fomepizole.md` |
| Physostigmine | `content/fr/physostigmine.md` | `content/en/physostigmine.md` |

Pages générales (dans chaque langue) : `advice.md` (Avis au lecteur), `abbreviations.md` (Abréviations), `about.md` (À propos).

> **Règle d'or :** si vous modifiez une phrase en français, faites la même modification dans le fichier anglais (et inversement). L'application ne traduit jamais rien.

## 2. Ouvrir et modifier un fichier

1. Allez sur la page du projet : **https://github.com/cyrilledehalleux-cmd/testantidote**
   (connectez-vous avec votre compte GitHub ; il faut avoir reçu l'accès au projet).
2. Cliquez sur le dossier **`content`**, puis **`fr`** (ou **`en`**), puis sur le fichier voulu.
3. Cliquez sur l'icône **crayon ✏️** (« Edit this file ») en haut à droite du texte.
4. Modifiez le texte directement.
5. Pour voir le rendu, cliquez sur l'onglet **Preview** en haut de la zone de texte.

## 3. Les 5 règles de mise en forme

Le fichier est du texte simple. Quelques symboles indiquent la mise en forme :

### Règle 1 – Les titres

```
## Posologie            ← une section (deux dièses, puis une espace)
### Dose adulte         ← une sous-section (trois dièses, puis une espace)
```

- Toujours **une espace** après les dièses : `## Posologie` et non `##Posologie`.
- Une sous-section `###` doit toujours se trouver sous une section `##`.
- Les sections doivent être **les mêmes, dans le même ordre**, en français et en anglais.

### Règle 2 – Le gras et l'italique

```
**Dose de charge :**    ← gras (deux étoiles de chaque côté)
*Clinical Toxicology*   ← italique (une étoile de chaque côté)
```

Ne mettez pas d'espace juste après les étoiles d'ouverture ni juste avant celles de fermeture :
`**Maximum :** 1500 mg` ✓ — `** Maximum : **1500 mg` ✗

Vous verrez parfois `<strong>…</strong>` (gras), `<em>…</em>` (italique), `<u>…</u>` (souligné),
`<sup>…</sup>` (exposant, ex. 95<sup>e</sup>) ou `<br>` (retour à la ligne). Ce sont de petites
balises nécessaires pour reproduire exactement le site : **laissez-les telles quelles**,
en gardant toujours la balise d'ouverture et celle de fermeture (`<u>` … `</u>`).

### Règle 3 – Les listes à puces

```
- Premier élément
- Deuxième élément
  - Sous-élément (deux espaces avant le tiret)
    - Sous-sous-élément (quatre espaces)
```

- Un tiret **suivi d'une espace** au début de la ligne.
- L'indentation (les espaces au début) indique le niveau. Respectez-la exactement.
- Laissez une ligne vide avant et après une liste.

### Règle 4 – Les paragraphes

Une **ligne vide** sépare deux paragraphes. Un simple retour à la ligne, sans ligne vide,
ne crée pas de nouveau paragraphe (utilisez `<br>` en fin de ligne si vous voulez forcer
un retour à la ligne à l'intérieur d'un paragraphe).

Une barre oblique inverse `\` devant un caractère (ex. `\*Dose pédiatrique`, `\[nmol/L\]`)
signifie « afficher ce caractère tel quel » : elle n'apparaît pas dans l'application. Ne la supprimez pas.

### Règle 5 – Les tableaux

```
| Produit | Concentration |
|---|---|
| Antizol | 1 g/ml |
```

- La 2e ligne `|---|---|` est obligatoire.
- Chaque ligne doit avoir **le même nombre de colonnes** (le même nombre de `|`).

## 4. Changer la date de révision

En haut de chaque fichier, entre les deux lignes `---`, se trouve l'en-tête :

```
---
id: fomepizole
title: Fomépizole
...
last_revision: 2026-10-23
last_revision_label: Dernière mise à jour
---
```

Remplacez la date après `last_revision:` par la nouvelle date, **au format AAAA-MM-JJ**
(année-mois-jour, ex. `2026-11-15`). Faites-le dans les deux langues.

Ne modifiez pas les lignes `id:` et `source_url:`, ni la ligne `<!-- pied de page / footer -->`
en bas du fichier (elle sépare la monographie du pied de page).

## 5. Publier

1. En bas de la page de modification (ou bouton vert **Commit changes…** en haut à droite),
   écrivez une courte description, par ex. « Fomépizole : nouvelle dose maximale ».
2. Laissez cochée l'option **Commit directly to the `main` branch**, puis cliquez sur **Commit changes**.
3. La publication est automatique et prend environ **2 minutes**. Pour la suivre : onglet **Actions** du projet.
   - ✅ coche verte : c'est en ligne. Les téléphones recevront le message
     « Nouvelle version disponible – actualiser ».
   - ❌ croix rouge : il y a une erreur de mise en forme. **Rien n'a été publié** ; l'ancienne
     version reste en ligne. Cliquez sur la croix, puis sur l'étape « Vérifier le contenu » :
     le message indique le fichier, la ligne et le problème (en français). Corrigez et publiez à nouveau.

## 6. Annuler une erreur

**Méthode simple (copier l'ancienne version) :**
1. Ouvrez le fichier sur GitHub, cliquez sur **History** (historique, en haut à droite du fichier).
2. Repérez la version d'avant l'erreur, cliquez sur les **…** puis **View file**.
3. Cliquez sur l'icône **Copy raw file** (copier), revenez au fichier actuel, cliquez sur le crayon,
   sélectionnez tout (Ctrl+A / Cmd+A), collez, puis **Commit changes**.

**Méthode GitHub Desktop / équipe technique :** une personne de l'équipe technique peut aussi
annuler une modification complète (« revert ») en une opération.

Rien n'est jamais perdu : toutes les versions précédentes restent dans l'historique.

## 7. En cas de doute

- Faites une petite modification à la fois, et vérifiez le résultat dans l'application.
- Si l'onglet **Preview** affiche quelque chose d'étrange (étoiles visibles, titre non reconnu),
  c'est souvent une espace manquante ou en trop autour de `**` ou après `##`.
