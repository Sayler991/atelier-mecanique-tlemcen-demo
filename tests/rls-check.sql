-- Exécuté avec succès via execute_sql ; transaction entièrement annulée.
-- Aucun compte utilisable, mot de passe ou membre de test persistant.
begin;
select set_config('atelier.test_user',gen_random_uuid()::text,true);
insert into auth.users(id,aud,role,is_anonymous) values (current_setting('atelier.test_user')::uuid,'authenticated','authenticated',true);
insert into public.atelier_tlemcen_owners(user_id) values (current_setting('atelier.test_user')::uuid);
set local role anon;
do $$ begin
 if (select count(*) from public.atelier_tlemcen_content where id='main')<>1 then raise exception 'FAIL anon read'; end if;
 begin update public.atelier_tlemcen_content set revision=999 where id='main'; raise exception 'FAIL anon write allowed'; exception when insufficient_privilege then null; end;
 begin insert into public.atelier_tlemcen_owners(user_id) values (gen_random_uuid()); raise exception 'FAIL anon membership write'; exception when insufficient_privilege then null; end;
end $$;
reset role;
select set_config('request.jwt.claim.sub',current_setting('atelier.test_user'),true);
set local role authenticated;
do $$ declare n integer; v jsonb; begin
 update public.atelier_tlemcen_content set content=jsonb_set(content,'{headline}','"TEST-OWNER-SAVE"'),revision=revision+1 where id='main' returning content into v;
 get diagnostics n=row_count; if n<>1 or v->>'headline'<>'TEST-OWNER-SAVE' then raise exception 'FAIL owner write'; end if;
 if (select content->>'headline' from public.atelier_tlemcen_content where id='main')<>'TEST-OWNER-SAVE' then raise exception 'FAIL owner reload'; end if;
 begin insert into public.atelier_tlemcen_owners(user_id) values(gen_random_uuid()); raise exception 'FAIL owner self-escalation'; exception when insufficient_privilege then null; end;
end $$;
reset role;
select set_config('request.jwt.claim.sub',gen_random_uuid()::text,true);
set local role authenticated;
do $$ declare n integer; begin
 update public.atelier_tlemcen_content set revision=999 where id='main'; get diagnostics n=row_count; if n<>0 then raise exception 'FAIL foreign authenticated write'; end if;
 if (select content->>'headline' from public.atelier_tlemcen_content where id='main')<>'TEST-OWNER-SAVE' then raise exception 'FAIL denied update damaged row'; end if;
 begin delete from public.atelier_tlemcen_content where id='main'; raise exception 'FAIL foreign delete'; exception when insufficient_privilege then null; end;
end $$;
reset role;
select 'PASS: anon read; anon write denied; owner save and reload; membership escalation denied; foreign authenticated update denied; delete denied' as result;
rollback;
