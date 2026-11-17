# Vérifications — 8 novembre 2026 (Africa/Algiers)

## Réels, backend de production isolé

- Tables `public.atelier_tlemcen_content` et `public.atelier_tlemcen_owners`, RLS activée, bucket `atelier-tlemcen-images` créé.
- Test SQL `tests/rls-check.sql` exécuté : lecture anonyme autorisée ; écriture anonyme refusée ; membre autorisé à enregistrer et relire ; autre compte authentifié filtré (0 ligne modifiée) ; auto-attribution de droits et suppression refusées. Le contenu reste intact après une tentative refusée.
- Fixtures transactionnelles sans mot de passe, entièrement annulées par ROLLBACK. Aucun compte de test ni membre persistant.
- Sept contrôles HTTP Supabase réussis avec la seule clé publique, vers 15 h 48 (Africa/Algiers) : lecture 200, PATCH/POST/DELETE anonymes 401, lecture/ajout de membres 401, relecture finale 200 identique. Résultats bruts dans `tests/http-results.json` (horodatage machine au format ISO UTC).
- Les anciennes règles Storage ont été inspectées en lecture seule : elles sont limitées au bucket `images` et ne donnent pas accès au bucket du garage.
- Advisor sécurité exécuté : aucune alerte portant sur les nouveaux objets. Des alertes préexistantes concernent d’autres schémas (fonctions SECURITY DEFINER exécutables) et la protection des mots de passe compromis désactivée à l’échelle du projet. Elles n’ont pas été changées pour ne pas modifier les autres sites.
  - https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable
  - https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable
  - https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection

## Unitaires — pas des tests navigateur

- Syntaxe `site.js` et `admin/admin.js` : `node --check` réussi.
- Syntaxe serveur Python : compilation réussie.
- Neuf groupes de tests DOM via jsdom réussis (`tests/dom-results.json`) : rendu, pause, connexion et garde propriétaire simulées, édition/sauvegarde et rechargement simulés, conflit, refus non-membre, contenu hostile, mode hors ligne.
- Auth et API de ces tests DOM sont des doublures locales : ils ne prouvent PAS la connexion d’un vrai propriétaire ni un E2E complet contre Supabase.
- Pour reproduire les tests DOM : installer `jsdom@26.1.0`, définir `NODE_PATH` vers son dossier node_modules et lancer `node tests/dom-check.cjs`. Les tests n’ouvrent pas de navigateur.
- Le test HTTP `node tests/http-check.mjs` utilise le vrai backend. Les écritures négatives sont volontairement refusées ; aucun formulaire client n’est transmis au garage.

## Non validé / reste à faire

- Compte nominatif propriétaire : à activer. Le parent a réellement exécuté Vault list : aucun contact ni login disponible. Offre d’adresse e-mail présentée à l’utilisateur, en attente de réponse. Aucun compte à créer avant sa réponse ; aucun mot de passe choisi ou envoyé.
- Connexion réelle du propriétaire, enregistrement puis rechargement dans un vrai navigateur et téléversement réel d’une photo autorisée : non testés.
- Captures ordinateur/mobile/admin : produites par le contrôle computerUse du parent, voir la section visuelle ci-dessous. Les deux échecs initiaux du connecteur navigateur de cette délégation ne décrivent pas le résultat de ce contrôle séparé.
- Fluidité sur vrai téléphone : non mesurée. Ouverture des fichiers locaux `file://` vérifiée dans Chrome, avec inspection visuelle ordinateur et largeur mobile 390 px ; aucune observation d’un geste de double-clic n’est revendiquée. Pas de validation visuelle du déploiement distant dans ce rapport.
- Démo publique GitHub Pages construite et vérifiée : https://sayler991.github.io/atelier-mecanique-tlemcen-demo/ ; admin à /admin/. Dix routes publiques HTTP 200, empreintes identiques aux fichiers testés et CORS Supabase compatible avec l’origine Pages. Rapport dans tests/deployment-results.json. Ne pas confondre cette démo avec un site officiel du commerce.

## Contrôles statiques complémentaires

Six groupes réussis : HTML sans IDs dupliqués, fichiers locaux présents, SVG XML valides, huit routes du serveur local en HTTP 200 avec CSP/nosniff, règles mobile et mouvement réduit présentes. Poids total des ressources web des deux surfaces : environ 61 ko non compressés (hors photos ajoutées plus tard). Ce poids n’est pas une mesure de performance navigateur.

## Recherche d’identité et essai de compte éphémère

- Skill Vault relu ; aucun outil Vault exposé dans cette délégation. Le parent a ensuite exécuté Vault list et confirmé qu’aucun contact ni login n’était disponible. Aucune adresse ni aucun mot de passe recherché dans des fichiers de secrets. Offre d’adresse e-mail présentée ; réponse utilisateur attendue avant toute création de compte.
- Le compte GitHub courant est vérifié comme Sayler991 (identifiant public 341092644). Recherche strictement sur `auth.identities.provider=github` et cet identifiant : aucune correspondance Supabase existante. Aucun autre compte client n’a été attribué au garage.
- Essai officiel `supabase.auth.signInAnonymously()` sans e-mail ni mot de passe : refus 422 `anonymous_provider_disabled`. Aucun utilisateur créé, aucune session à révoquer. Le paramétrage Auth partagé n’a pas été modifié.
- Besoin restant précis : un UUID Supabase Auth confirmé comme celui de Younes/propriétaire, ou une adresse de connexion vérifiée avec une création de compte sécurisée. L’activation exige l’ajout de ce seul UUID à `atelier_tlemcen_owners`. Aucun e-mail ne sera envoyé sans accord spécifique.

## Publication vérifiée

Un seul push effectué. Commit déployé : `4edbb87566a99f201aaad4da2f4d3cc92145c3db`. Build GitHub Pages `built`, sans erreur. HTTPS actif. Dépôt public : https://github.com/Sayler991/atelier-mecanique-tlemcen-demo . La documentation du zip contient les résultats postdéploiement et peut être plus récente que le premier commit publié.

## Contrôle visuel Chrome — rapport computerUse reçu le 8 novembre 2026 à 16 h 06 (Africa/Algiers)

Contrôles effectués via les fichiers locaux `file://`, pas via le serveur HTTP :

- Vitrine ordinateur : rendu inspecté, aucun débordement visible.
- Vitrine à largeur mobile 390 px : rendu inspecté, aucun débordement visible.
- Écran de connexion admin : présentation responsive inspectée ; aucune authentification effectuée.
- Pause et reprise des animations : fonctionnelles.
- Ancres de navigation et FAQ : fonctionnelles.
- Captures PNG présentes et incluses dans le zip : `screens/desktop.png`, `screens/mobile.png`, `screens/admin.png`.

Chrome a renvoyé `ERR_CONNECTION_REFUSED` sur `http://localhost:8817/` malgré un port signalé occupé. Les précédents contrôles HTTP de ce serveur avaient bien renvoyé 200 depuis le shell ; cette différence de contexte ne constitue pas un succès navigateur sur localhost et sa cause n’est pas établie. Les URL GitHub Pages ont été vérifiées séparément par HTTP.

Ce rapport ne prouve ni un parcours E2E propriétaire contre Supabase, ni un téléversement réel, ni la fluidité sur un téléphone physique. L’accès nominatif reste en attente de la réponse utilisateur à l’offre d’adresse e-mail.
