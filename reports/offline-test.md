# Test hors ligne / Offline test

## 1. Test automatique – navigateur de bureau (Chromium) ✅

- **Date :** 2026-11-06 · **Navigateur :** Chromium 153 (Playwright), fenêtre 1280 × 900
- **Script :** `tests/offline.e2e.mjs` (`npm run build && npm run test:offline`)
- **Résultat :** **28 / 28 vérifications réussies** (détail : `reports/offline-test-auto.json`)

Méthode : première visite en ligne, puis **arrêt complet du serveur** et navigateur mis hors ligne
(équivalent de « réseau désactivé » dans les outils de développement). La page est fermée puis rouverte.

| Vérification | Résultat |
|---|---|
| Avis au lecteur affiché au premier lancement | ✅ |
| Pré-cache **complet** dès la première visite (12 fichiers : pages, contenu FR + EN, icônes, calculateur) sans avoir ouvert les monographies | ✅ |
| Indication « Disponible hors ligne » dans le menu | ✅ |
| Application rouverte sans réseau, serveur arrêté ; aucune requête réseau | ✅ |
| Avis au lecteur non réaffiché après acceptation | ✅ |
| Indicateur « Hors ligne – contenu daté du AAAA-MM-JJ » | ✅ |
| Les 3 monographies en français, toutes les sections (18 chacune) | ✅ |
| Les 3 monographies en anglais, toutes les sections (18 chacune) | ✅ |
| Recherche FR « fomepizole » → « Fomépizole » (sans accent) | ✅ |
| Recherche FR « ACIDOSE METABOLIQUE » (sans accents, majuscules) | ✅ |
| Recherche EN par synonyme « antizol » | ✅ |
| Résultat de recherche → surlignage dans la monographie | ✅ |
| Changement FR → EN : même antidote, même section ouverte | ✅ |
| Calculateur hors ligne (exemple MDCalc 2,8 ng/mL, 65 kg → 2 fioles) | ✅ |
| Calculateur : saisie hors bornes → aucun résultat | ✅ |
| Calculateur : valeurs conservées au changement de langue | ✅ |
| Pages Abréviations et Avis au lecteur, FR et EN | ✅ |
| Retour en ligne : nouvelle version téléchargée en arrière-plan, bandeau « Nouvelle version disponible – actualiser / New version available – refresh » | ✅ |
| Bouton « Actualiser » → nouvelle version active | ✅ |
| Aucune erreur JavaScript | ✅ |

Un défaut trouvé par ce test a été corrigé : après « Tout ouvrir », une navigation rapide vers une autre
monographie pouvait ramener l'affichage sur la monographie précédente.

## 2. Test sur le site publié (GitHub Pages) ✅

- **Date :** 2026-11-06 · **Adresse :** https://cyrilledehalleux-cmd.github.io/testantidote/
- **Navigateur :** Chromium (Playwright), émulation téléphone Pixel 7, **profil persistant**
  (le navigateur est entièrement fermé puis rouvert entre les étapes, comme une application installée).

| Vérification | Résultat |
|---|---|
| Première visite : 12 fichiers en cache, menu « ✓ Disponible hors ligne » | ✅ |
| Navigateur fermé, hors ligne, rouvert : bandeau « Hors ligne – contenu daté du 2026-11-06 » | ✅ |
| Les 3 monographies FR + EN hors ligne (18 sections chacune) | ✅ |
| Recherche et calculateur hors ligne | ✅ |
| Aucune erreur JavaScript | ✅ |

**Test du guide d'édition (étape 6 du plan)** – modification d'une phrase, publication, annulation :

| Étape | Résultat |
|---|---|
| Ajout de « [TEST D’ÉDITION – à annuler] » dans `content/fr/fomepizole.md` (Dose pédiatrique, dose de charge) ; `npm run check` OK | ✅ |
| Publication automatique (GitHub Actions) réussie en ~1 min | ✅ |
| Copie « installée » : bandeau « Nouvelle version disponible – actualiser / New version available – refresh » ; « Actualiser » charge la nouvelle version | ✅ |
| La phrase modifiée s'affiche, **y compris hors ligne** | ✅ |
| Annulation (retour au texte d'origine), republication, mise à jour reçue par la copie installée | ✅ |
| Après annulation, `scripts/verify.py` : contenu de nouveau identique au site (diff vide) | ✅ |

Un défaut du **script de test** (et non de l'application) a été trouvé sur le site publié : il passait hors
ligne avant la fin de la mise en cache. Le test attend maintenant que le cache soit complet, et l'indicateur
« Disponible hors ligne » de l'application exige un service worker actif.

## 3. Test sur téléphones – à faire par l'équipe ⏳

Ce test nécessite de vrais appareils : il ne peut pas être fait automatiquement depuis l'environnement
de développement. Lien de l'application : **https://cyrilledehalleux-cmd.github.io/testantidote/**

### Installation

- **iPhone (Safari)** : ouvrir le lien dans **Safari** → bouton Partager → **Sur l'écran d'accueil** → Ajouter.
- **Android (Chrome)** : ouvrir le lien dans **Chrome** → menu ⋮ → **Installer l'application**
  (ou « Ajouter à l'écran d'accueil »).
- Après l'ouverture, attendre que le menu (☰) indique **« ✓ Disponible hors ligne »**.

### Liste de contrôle (cocher pour chaque appareil)

| # | Étape | iPhone (modèle / iOS : ____ ) | Android (modèle / version : ____ ) |
|---|---|---|---|
| 1 | Installer depuis l'écran d'accueil ; l'icône apparaît | ☐ | ☐ |
| 2 | Ouvrir l'application ; accepter l'avis au lecteur ; le menu indique « Disponible hors ligne » | ☐ | ☐ |
| 3 | Activer le **mode avion** ; **fermer complètement** l'application (balayer) ; la rouvrir | ☐ | ☐ |
| 4 | Le bandeau « Hors ligne – contenu daté du … » s'affiche | ☐ | ☐ |
| 5 | Ouvrir les 3 monographies en **français**, « Tout ouvrir » sur chacune | ☐ | ☐ |
| 6 | Passer en **anglais** (bouton EN) : même antidote, même section ; ouvrir les 3 monographies | ☐ | ☐ |
| 7 | Recherche : « fomepizole », « antizol », « digoxinemie » | ☐ | ☐ |
| 8 | Calculateur : 65 kg, 3,6 nmol/L → résultat et étapes affichés | ☐ | ☐ |
| 9 | Pages Abréviations et Avis au lecteur (menu ☰) | ☐ | ☐ |
| 10 | Désactiver le mode avion ; après une nouvelle publication, le bandeau « Nouvelle version disponible – actualiser » apparaît ; « Actualiser » charge la nouvelle version | ☐ | ☐ |

Remarques connues :
- Sur iPhone, l'application installée sur l'écran d'accueil et Safari ont **chacun leur propre copie**
  hors ligne : tester depuis l'icône de l'écran d'accueil.
- iOS peut effacer les données hors ligne d'une application web **non utilisée pendant plusieurs semaines** ;
  il suffit alors de l'ouvrir une fois avec du réseau.

Observations : _____________________________________________
