-- Documentation du schéma déjà appliqué via le connecteur Supabase.
-- NE PAS réexécuter sur le projet actuel. Ne change aucun schéma exposé.
create table public.atelier_tlemcen_owners (user_id uuid primary key references auth.users(id) on delete cascade);
alter table public.atelier_tlemcen_owners enable row level security;
revoke all on public.atelier_tlemcen_owners from anon, authenticated;
grant select on public.atelier_tlemcen_owners to authenticated;
create policy atelier_owners_self on public.atelier_tlemcen_owners for select to authenticated using (user_id = (select auth.uid()));
create table public.atelier_tlemcen_content (id text primary key check (id='main'), content jsonb not null check (jsonb_typeof(content)='object' and octet_length(content::text)<200000), revision bigint not null default 1, updated_at timestamptz not null default now());
alter table public.atelier_tlemcen_content enable row level security;
revoke all on public.atelier_tlemcen_content from anon, authenticated;
grant select on public.atelier_tlemcen_content to anon, authenticated;
grant update(content, revision, updated_at) on public.atelier_tlemcen_content to authenticated;
create policy atelier_content_read on public.atelier_tlemcen_content for select to anon, authenticated using (true);
create policy atelier_content_owner_update on public.atelier_tlemcen_content for update to authenticated using (exists(select 1 from public.atelier_tlemcen_owners where user_id=(select auth.uid()))) with check (exists(select 1 from public.atelier_tlemcen_owners where user_id=(select auth.uid())));
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types) values ('atelier-tlemcen-images','atelier-tlemcen-images',true,5242880,ARRAY['image/jpeg','image/png','image/webp']);
create policy atelier_upload_owner on storage.objects for insert to authenticated with check (bucket_id='atelier-tlemcen-images' and (storage.foldername(name))[1]=(select auth.uid())::text and exists(select 1 from public.atelier_tlemcen_owners where user_id=(select auth.uid())));
create policy atelier_list_owner on storage.objects for select to authenticated using (bucket_id='atelier-tlemcen-images' and (storage.foldername(name))[1]=(select auth.uid())::text and exists(select 1 from public.atelier_tlemcen_owners where user_id=(select auth.uid())));
