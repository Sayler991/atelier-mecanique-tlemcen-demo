# Lien de connexion directe à l’espace propriétaire

- Compte propriétaire activé : `admin.atelier@example.com` (inscrit dans `public.atelier_tlemcen_owners`). Le mot de passe n’est pas dans ce dépôt.
- Fonction Supabase `atelier-owner-link` (`supabase/functions/atelier-owner-link/index.ts`) : appelée par un propriétaire **déjà connecté**, elle génère côté serveur (`auth.admin.generateLink`, type `magiclink`) un lien pour **son propre** compte. Non connecté → 401 ; compte non propriétaire → 403. Aucun e-mail n’est envoyé.
- Format du lien : `https://sayler991.github.io/atelier-mecanique-tlemcen-demo/admin/#connexion=<token_hash>`. Le jeton est dans le fragment (`#`), donc jamais envoyé à GitHub Pages ; `/admin/` le retire aussitôt de l’adresse puis l’échange une seule fois via `POST /auth/v1/verify`.
- Usage unique, expiration selon la durée OTP du projet (1 h par défaut). Aucune modification de la configuration Auth (liste des URL de redirection) n’est nécessaire.
