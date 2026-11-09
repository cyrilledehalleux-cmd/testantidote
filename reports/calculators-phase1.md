# Calculateurs de la phase 1 – rapport de vérification

Source des formules : *Phase 1 toxicology equations: spec for the app* (8 nov. 2026).
Code : `app/calc/formulas.js` (formules et constantes, sources en commentaire) et `app/calc/views.js` (affichage).
Tests : `tests/phase1.test.mjs` (`npm test`).

En ligne sur le lien officiel depuis le 9 nov. 2026 (décision de l'équipe : phase de test, publication directe).

## 1. Écarts entre la formule et les valeurs publiées (formule conservée telle quelle)

Mention affichée dans les calculateurs concernés (éthanol, osmolalité) :
« Le résultat peut différer légèrement des doses publiées (arrondis et conversions d'unités SI). »

| Calcul | Formule de la spec | Valeur publiée | Écart | Cause |
|---|---|---|---|---|
| Éthanol, dose de charge à la cible 22 mmol/L | 22 × 0,046 × 0,6 = **607,2 mg/kg** → 70 kg, 10 % : **538 mL** ; 40 % : 134,5 mL | 600 mg/kg (AACT) → 532 mL ; 133 mL | **+1,2 %** | 22 mmol/L × 0,046 = 1,012 g/L (et non 1,0 g/L) |
| Éthanol, entretien buveur chronique, 10 % IV | 154 / (100 × 0,79) = **1,95 mL/kg/h** | 1,96 (AACT, tableau 3) | −0,5 % | arrondi ou densité différente dans l'AACT |
| Éthanol, entretien 43 % PO (AACT) | 0,19 et 0,45 mL/kg/h | 0,2 et 0,46 | ≤ 2,5 % | arrondis de l'AACT |
| Éthanol, charge orale 43 % | 1,77 mL/kg | 1,8 (AACT) | 1,7 % | arrondi |
| Osmolalité, éthanol saisi en mg/dL | mg/dL ÷ 4,6 × 1,25 = **÷ 3,68** | ÷ 3,7 (spec « conventional input », MDCalc) | 0,5 % | l'application convertit d'abord en SI (÷ 4,6) puis applique 1,25 |
| Sodium corrigé (Hillier) | 0,43 au-delà de 5,6 mmol/L | 2,4 / 5,55 = 0,432 au-delà de 5,55 | < 0,1 mmol/L | arrondis de la conversion |

Toutes les autres valeurs de la spec sont reproduites exactement (tests) : tableau du dextrose (20 kg et plafond de 25 g),
teneurs en g/mL, charges à 600 mg/kg, entretien 66 et 110 mg/kg/h, entretien 40 % PO, éthanol 100 mg/dL = 21,7 mmol/L,
demi-vie 400 → 200 en 6 h = 6 h.

## 2. Choix faits par l'application, absents de la spec – À VALIDER

1. **Estimation d'alcool toxique d'après l'écart osmolaire** (la spec dit « kept, as an estimate with its uncertainty shown »
   sans donner la formule). Choix : concentration estimée (mmol/L) = écart osmolaire (1 mOsm/kg par mmol/L), convertie en mg/dL
   avec les facteurs de la spec (méthanol 3,2 ; éthylène glycol 6,2 ; isopropanol 6,0) ; plage d'incertitude = écart résiduel
   normal de Purssell (environ −10 à +12) : de (écart − 12) à (écart + 10), minimum 0. Affichée seulement si l'écart est > 0.
2. **Bornes de saisie** (une valeur hors bornes n'affiche aucun résultat), en SI :
   Na 90–200 ; K 1–12 ; Cl 50–160 ; HCO3 1–60 ; glucose 0,5–150 ; urée 0,3–150 ; éthanol 0–200 (mmol/L) ;
   albumine 5–70 g/L ; osmolalité mesurée 200–600 mOsm/kg ; Ca ionisé 0,2–3 ; Mg 0,1–5 ; lactate 0–40 ; phosphate 0,1–8 ;
   pH 6,5–8 ; excès de base −40 à +40 ; poids 0,3–300 kg ; dextrose (autre) 0,01–2 g/kg ;
   éthanol cible 5–60 et actuel 0–200 mmol/L ; teneur 1–96 % ; débit 0,1–2000 mL/h.
3. **Arrondi à l'affichage** : résultats à 1 décimale (doses en g à 2 décimales, k à 4) ; les calculs ne sont jamais arrondis.
   La spec ne précise pas d'arrondi.
4. **Poids en kg ou lb** (comme le calculateur DigiFab ; la spec indique kg).
5. **Textes en français** : traduits par Claude à partir de la spec anglaise (notes, avertissements, hypothèses). À relire.
6. **Demi-vie** : choix de la substance limité à « Éthanol » (ordre zéro présélectionné) ou « Autre » ; unité des concentrations
   au choix (affichage seulement) ; la vitesse typique de l'éthanol (3,3–4,4 mmol/L/h) n'est affichée qu'en mmol/L ou mg/dL.
7. **Liens depuis les monographies** : Dextrose → dextrose ; Éthanol → éthanol, osmolalité, demi-vie ; Fomépizole → osmolalité.

## 3. Cas à calculer à la main par l'équipe

`tests/phase1.test.mjs`, section « cas de l'équipe » : 12 cas (un ou plusieurs par calculateur), valeurs attendues `'TODO'`.
Tant qu'une valeur vaut `'TODO'`, le cas est « ignoré », jamais « réussi ».

## 4. Décisions de l'équipe du 9 nov. 2026 (appliquées)

- **Éthanol PO : biodisponibilité 90 %** (remplace « biodisponibilité 1 » de la spec) : dose de charge et entretien
  × 1/0,9 (≈ 1,111) par voie orale. L'avertissement « éthanolémie probablement plus basse par voie orale » est retiré.
- **Teneurs** : 5 % (bière), 10 % (vin), 20 %, 40 % (spiritueux). **Consommations équivalentes** affichées sous les volumes :
  bière 341 mL, verre de vin 142 mL, shot 43 mL ; arrondi au plus proche de ¼, ⅓, ½, ⅔, ¾ (aucune pour 20 % et « autre »).
- **Entretien** : débit pour la consommation choisie ; au toucher, débits pour non-buveur, moyenne et buveur chronique.
- **Résultats compacts** : valeur et repère (normal / élevé) seulement ; détail du calcul au toucher.
- **Stewart** : SIG, SIDa et SIDe affichés ensemble.
- **Demi-vie** : saisie par jour (avant-hier à demain) + heure ; graphique (concentrations, courbe, cible, point prévu).
- **DigiFab** (référence exacte à confirmer – PDF à venir, voir section 5) : MDCalc n'est plus cité dans l'application. Références affichées : Guide canadien des antidotes (Posologie) pour la
  formule par digoxinémie, la contre-vérification et la règle des 25 % ; Howland MA, *Goldfrank's Toxicologic Emergencies*,
  10e éd. (2014) pour la formule par quantité ingérée ; Lapostolle 2008 et Antman 1990. Ces trois citations proviennent de la
  liste de références de MDCalc : **à confirmer par l'équipe** (le texte de ces ouvrages n'a pas été consulté).
- **Liens monographie → calculateur** : Anticorps spécifique de la digoxine → DigiFab ; Dextrose → dextrose ; Insuline régulière → dextrose ; Éthanol → éthanol.
  Aucun lien vers le trou anionique / osmolalité ni vers la demi-vie (accessibles par l'onglet Outils).

## 5. Validation de l'équipe (9 nov. 2026)

| Point | Décision |
|---|---|
| Estimation d'alcool toxique d'après l'écart osmolaire | **Retirée** du calculateur pour l'instant |
| Bornes de saisie | Validées ; teneur en éthanol acceptée **jusqu'à 100 %** |
| Arrondi à l'affichage | Validé |
| Poids | kg par défaut, lb conservé |
| Textes français | Validés |
| Écran de demi-vie | Validé ; avertissement si éthanol + premier ordre : « Premier ordre sélectionné. Éthanol : utiliser l'ordre zéro » |
| Références DigiFab | Validées pour l'instant. **En attente : PDF de la référence exacte à fournir par Cyrille** |

Autres changements demandés le même jour :

- **Dextrose** : choix de la solution (D5, **D10 – préférée en pédiatrie, par défaut**, D25, D50) ; le résultat est le
  **volume (mL) de la solution choisie** ; au toucher : tableau des 4 solutions (0,25 g/kg et 0,5 g/kg ou dose choisie).
- **Éthanol** : 10 % libellé « vin ou IV » ; en IV, pas de consommations équivalentes ni de nom de breuvage dans le résultat,
  et « * Voie centrale à privilégier » dans le détail (charge et entretien).
- **Repères** : seule une valeur anormale est mise en évidence (rouge) ; une valeur normale affiche
  « normal – voir détails » sans couleur (trou anionique, trou anionique corrigé, écart osmolaire).

## 6. Dextrose : perfusion et insuline à haute dose (9 nov. 2026)

- Section « débit de glucose en perfusion » retirée ; la perfusion est intégrée au calcul principal.
- Doses : bolus 0,25 g/kg, bolus 0,5 g/kg, **perfusion 0,5 g/kg/h – insuline haute dose** (encadrée en rouge),
  bolus autre (g/kg), perfusion autre (g/kg/h).
- Perfusion : résultat = **débit en mL/h de la solution choisie** (g/h = g/kg/h × poids ; mL/h = g/h ÷ g/mL) ;
  équivalent en mg/kg/min dans le détail ; badge « voie centrale » si la solution choisie dépasse 10 %.
- Option 0,5 g/kg/h : badge « insuline haute dose » et, au toucher, l'explication (dose élevée réservée au patient traité
  par insuline à haute dose pour une cardiotoxicité).
- **Extraits de la monographie Dextrose** affichés au toucher (indication, dose de maintien pédiatrique et adulte,
  mise en garde, surveillance aux 30 min, osmolarité maximale en périphérie, glycosurie, sevrage, durée après l'insuline) :
  ils sont lus dans la monographie elle-même (texte identique au guide, mis à jour avec elle) ;
  `tests/dextrose-quotes.test.mjs` vérifie qu'ils sont trouvés en français et en anglais.
- Lien ajouté : monographie **Insuline régulière → Dextrose**.
- Plafond de 25 g : s'applique aux bolus seulement (pas à la perfusion).
