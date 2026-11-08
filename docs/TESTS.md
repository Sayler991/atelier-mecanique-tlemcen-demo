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

- Compte nominatif propriétaire : à activer. Aucun mot de passe choisi ou envoyé ; outil Vault indisponible dans cette délégation.
- Connexion réelle du propriétaire, enregistrement puis rechargement dans un vrai navigateur et téléversement réel d’une photo autorisée : non testés.
- Captures ordinateur/mobile/admin : non produites. Le connecteur navigateur a échoué deux fois au démarrage avec « daemon default didn't come up ». Aucun contournement par sessions ou CDP.
- Fluidité sur vrai téléphone, rendu visuel final, test double-clic dans un vrai navigateur : non mesurés. Les fichiers sont autonomes en termes d’assets, et le code prévoit le mode `file://`, mais il ne faut pas dire « ouverture double-clic testée ».
- Publication GitHub Pages en cours pour la maquette indépendante ; la vérification HTTP publique sera ajoutée après déploiement. Ne pas confondre cette démo avec un site officiel du commerce.

## Contrôles statiques complémentaires

Six groupes réussis : HTML sans IDs dupliqués, fichiers locaux présents, SVG XML valides, huit routes du serveur local en HTTP 200 avec CSP/nosniff, règles mobile et mouvement réduit présentes. Poids total des ressources web des deux surfaces : environ 61 ko non compressés (hors photos ajoutées plus tard). Ce poids n’est pas une mesure de performance navigateur.
