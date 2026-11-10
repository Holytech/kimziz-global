-- Declarative source. Apply to the dedicated Kimziz project only.
create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;
revoke all on public.admins from anon, authenticated;
grant select on public.admins to authenticated;
create policy "Admins can check own membership" on public.admins for select to authenticated
  using (user_id = (select auth.uid()));

create table public.documents (
  id text primary key,
  kind text not null check (kind in ('site','vehicle')),
  draft jsonb not null check (jsonb_typeof(draft) = 'object'),
  revision integer not null default 1 check (revision > 0),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null,
  check ((kind = 'site' and id = 'site') or (kind = 'vehicle' and id <> 'site'))
);
create index documents_kind_idx on public.documents(kind);
alter table public.documents enable row level security;
revoke all on public.documents from anon, authenticated;
grant select, insert, update on public.documents to authenticated;
create policy "Admins manage drafts" on public.documents for all to authenticated
  using (exists (select 1 from public.admins where user_id = (select auth.uid())))
  with check (exists (select 1 from public.admins where user_id = (select auth.uid())));

-- Public snapshots never contain the private draft.
create table public.publications (
  id text primary key references public.documents(id) on delete cascade,
  kind text not null check (kind in ('site','vehicle')),
  data jsonb not null check (jsonb_typeof(data) = 'object'),
  published_at timestamptz not null default now()
);
create index publications_kind_idx on public.publications(kind);
alter table public.publications enable row level security;
revoke all on public.publications from anon, authenticated;
grant select on public.publications to anon, authenticated;
grant insert, update, delete on public.publications to authenticated;
create policy "Public can read published content" on public.publications for select to anon, authenticated using (true);
create policy "Admins manage published content" on public.publications for all to authenticated
  using (exists (select 1 from public.admins where user_id = (select auth.uid())))
  with check (exists (select 1 from public.admins where user_id = (select auth.uid())));

create table public.media (
  id text primary key,
  url text not null check (url like 'https://res.cloudinary.com/%'),
  title text not null,
  alt text not null default '',
  resource_type text not null check (resource_type in ('image','video','raw')),
  bytes bigint not null check (bytes > 0),
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);
alter table public.media enable row level security;
revoke all on public.media from anon, authenticated;
grant select, insert, update on public.media to authenticated;
create policy "Admins manage media" on public.media for all to authenticated
  using (exists (select 1 from public.admins where user_id = (select auth.uid())))
  with check (exists (select 1 from public.admins where user_id = (select auth.uid())));

-- Atomic optimistic concurrency plus publication. Invoker rights preserve RLS.
create function public.save_document(p_id text, p_kind text, p_data jsonb, p_revision integer, p_action text)
returns integer language plpgsql security invoker set search_path = '' as $$
declare new_revision integer;
begin
  if not exists (select 1 from public.admins where user_id = (select auth.uid())) then
    raise exception 'Administrator access is required.';
  end if;
  if p_action not in ('save','publish','unpublish') then raise exception 'Invalid action'; end if;
  if p_kind = 'site' and p_action = 'unpublish' then raise exception 'Site cannot be unpublished'; end if;
  if p_revision = 0 then
    insert into public.documents(id,kind,draft,revision,updated_by)
    values(p_id,p_kind,p_data,1,(select auth.uid()))
    on conflict do nothing returning revision into new_revision;
  else
    update public.documents set draft=p_data,revision=revision+1,updated_at=now(),updated_by=(select auth.uid())
    where id=p_id and kind=p_kind and revision=p_revision returning revision into new_revision;
  end if;
  if new_revision is null then raise exception 'A newer version exists. Reload before saving.'; end if;
  if p_action = 'publish' then
    insert into public.publications(id,kind,data) values(p_id,p_kind,p_data)
    on conflict(id) do update set data=excluded.data,kind=excluded.kind,published_at=now();
  elsif p_action = 'unpublish' then
    delete from public.publications where id=p_id;
  end if;
  return new_revision;
end;
$$;
revoke all on function public.save_document(text,text,jsonb,integer,text) from public, anon;
grant execute on function public.save_document(text,text,jsonb,integer,text) to authenticated;
