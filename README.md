# L’Atelier Mécanique — Tlemcen

Deux surfaces livrées : une vitrine responsive et un véritable client d’administration relié à Supabase Auth, PostgREST et Storage. **Le compte nominatif du propriétaire reste à activer** ; aucun compte arbitraire, mot de passe partagé ou contournement de connexion n’a été créé.

## Voir le site

1. Dézipper le dossier.
2. Double-cliquer sur `index.html` pour consulter la vitrine (contenu local de secours inclus).
3. Pour un aperçu complet avec administration et prévisualisation, installer Python 3 si nécessaire, puis lancer `python3 start.py` (Windows : double-cliquer sur `DEMARRER_WINDOWS.bat`).
4. Ouvrir `http://localhost:8817/` ; l’admin est à `http://localhost:8817/admin/`.

Internet est nécessaire pour synchroniser le contenu, se connecter, enregistrer et téléverser des photos. Sans connexion, la vitrine affiche sa version locale avec un message explicite. Ce message ne signifie pas que le contenu local est à jour. `content.json` documente le contenu initial ; modifier ce fichier seul ne modifie pas la base et ne régénère pas `config.js`.

Le zip ne contient ni serveur de base de données ni mot de passe. Il transporte les fichiers web, pas une copie indépendante de Supabase : toutes ses copies utilisent le même contenu distant.

## Activer le compte propriétaire — indispensable

Le projet Supabase existant `rvreusugrtiubqtafgbk` héberge des tables strictement préfixées et un bucket propre au garage. Aucune autre table métier ni configuration « exposed schemas » n’a été modifiée.

Le gestionnaire du projet doit :

1. Identifier le compte Supabase Auth nominatif autorisé (ou créer ce compte via une procédure sécurisée, avec mot de passe défini par le titulaire ; ne pas envoyer le mot de passe dans le chat).
2. Copier son UUID depuis Authentication > Users. Ne pas sélectionner un autre client par défaut.
3. Dans SQL Editor, exécuter uniquement :
   ```sql
   insert into public.atelier_tlemcen_owners(user_id)
   values ('UUID_DU_COMPTE_AUTORISE'::uuid)
   on conflict (user_id) do nothing;
   ```
4. Se connecter sur `/admin/` avec ce compte. Aucun e-mail n’est envoyé par le formulaire du site.

À la livraison, la table des propriétaires est volontairement vide : l’admin ne sera pas utilisable par le propriétaire tant que cette étape n’est pas faite. Il ne s’agit pas d’un faux écran : les appels Auth, contrôle de droits, chargement et enregistrement sont codés pour le backend réel ; le parcours de connexion d’un vrai propriétaire n’a pas été testé faute d’identité autorisée.

## Fonctionnalités

- Vitrine vert graphite et citron, illustration automobile originale, filtre à huile en relief CSS et engrenages à mouvement lent ; aucun moteur WebGL ni chargement 3D lourd.
- Animations de détail, arrêt manuel et `prefers-reduced-motion`. Aucun besoin de WebGL : le SVG et les pièces CSS restent visibles sans lui.
- Mise en page mobile, boutons Appeler et Itinéraire fixes sur petit écran, liens réels fournis/recoupés.
- Admin : textes, identité, contact, horaires, prestations masquées/visibles, photos, prévisualisation non enregistrée et sauvegarde avec détection de conflit de version.
- Photos : JPEG/PNG/WebP ≤5 Mo ; conversion WebP, largeur maximale 1600 px, métadonnées retirées ; attestation de droits et crédit obligatoires. L’envoi rend le fichier public ; « Enregistrer » le rend visible sur la vitrine. Retirer une photo masque son affichage, sans effacer le stockage (évite une suppression irréversible).
- Aucun avis, prix, équipe, logo officiel ou photo réelle inventé.

## Sécurité

`config.js` ne contient qu’une clé **publishable** prévue pour le navigateur. Aucune clé service_role ni jeton d’administration. RLS activée sur les deux tables. Visiteurs : lecture du contenu uniquement. Comptes authentifiés non membres : aucune écriture. Membres : mise à jour du contenu uniquement ; pas de création/suppression du singleton, pas de changement des membres. La table de membres n’est pas lisible anonymement. Uploads limités au bucket et au dossier UUID du membre. Pas d’écrasement ni de suppression depuis l’interface.

Les sessions ne sont pas persistées dans localStorage ; fermeture/rechargement de l’onglet exige une nouvelle connexion. Déconnexion pour 30 min d’inactivité, rafraîchissement des jetons en mémoire et déconnexion Supabase. Les textes sont rendus avec `textContent`, pas avec du HTML fourni par l’administrateur. Contrôle HTTPS sur les liens ; images limitées au stockage dédié.

## Vérifications et limites

Voir `docs/TESTS.md`. Tests de syntaxe JS, tests DOM unitaires et tests réels SQL/HTTP séparés. **Validation visuelle en cours séparément par le parent** : le connecteur navigateur de cette délégation n’a pas démarré (deux essais, erreur « daemon default didn't come up »). Les comptes rendus reçus seront ajoutés aux rapports locaux. Ne pas présenter ces tests comme un E2E navigateur complet ni comme une mesure de fluidité sur téléphone.

Les coordonnées sont sourcées dans `docs/sources.html`. Téléphone recoupé dans deux sources, horaires indicatifs dans une seule source ouverte. Instagram non confirmé ; photos réelles non récupérées avec droits. La galerie est masquée, prête à être alimentée. Validation du commerce et mentions légales de l’exploitant restent nécessaires avant publication officielle. `noindex,nofollow` est volontaire en démo.

## Démo GitHub Pages

Vitrine : https://sayler991.github.io/atelier-mecanique-tlemcen-demo/
Admin : https://sayler991.github.io/atelier-mecanique-tlemcen-demo/admin/
Code : https://github.com/Sayler991/atelier-mecanique-tlemcen-demo

La démo et le dépôt sont publiquement accessibles : ce n’est pas un espace privé. Un bandeau visible signale une maquette indépendante, non officielle et sans affiliation au garage ; toutes les pages portent `noindex,nofollow`. Les illustrations sont originales et aucune photo tierce n’est publiée. Le compte propriétaire reste à activer, indépendamment de la publication de la vitrine.

GitHub Pages n’applique pas les en-têtes personnalisés du serveur Python. Les pages embarquent donc aussi une politique CSP en meta et une politique de référent ; l’admin refuse de s’afficher dans une iframe. Un hébergement de production devra appliquer les en-têtes HTTP complets, dont frame-ancestors, côté serveur. Les droits des photos devront être confirmés avant tout ajout public.
