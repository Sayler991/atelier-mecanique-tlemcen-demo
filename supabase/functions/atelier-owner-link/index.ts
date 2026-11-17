// L'Atelier Mécanique — lien de connexion à usage unique pour l'espace propriétaire.
// Sécurité : l'appelant doit déjà être connecté (jeton d'accès Supabase) ET figurer dans
// public.atelier_tlemcen_owners. Le lien est généré uniquement pour SON propre e-mail
// (auth.admin.generateLink, type magiclink) ; aucun e-mail n'est envoyé.
// Le jeton (token_hash) est vérifié par /admin/ via POST /auth/v1/verify : à usage unique,
// expire selon la durée OTP du projet (1 h par défaut).
import { createClient } from "npm:@supabase/supabase-js@2";

const ADMIN_URL = "https://sayler991.github.io/atelier-mecanique-tlemcen-demo/admin/";
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "method" }, 405);
  const jwt = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
  if (!jwt) return json({ error: "unauthorized" }, 401);
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: u, error: ue } = await admin.auth.getUser(jwt);
  if (ue || !u?.user?.email) return json({ error: "unauthorized" }, 401);
  const { data: own } = await admin.from("atelier_tlemcen_owners").select("user_id").eq("user_id", u.user.id).maybeSingle();
  if (!own) return json({ error: "forbidden" }, 403);
  const { data, error } = await admin.auth.admin.generateLink({ type: "magiclink", email: u.user.email });
  if (error || !data?.properties?.hashed_token) return json({ error: "generate_failed" }, 500);
  return json({
    link: ADMIN_URL + "#connexion=" + data.properties.hashed_token,
    generated_at: new Date().toISOString(),
  });
});
