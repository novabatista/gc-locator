-- gcs table: holds all Growth Group records
create table if not exists gcs (
  id            text primary key,
  name          text not null,
  sector_id     text not null,
  sheet_id      text,
  address_text  text,
  data          jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists gcs_sector_id_idx on gcs (sector_id);

-- Auto-update updated_at on row changes
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists gcs_set_updated_at on gcs;
create trigger gcs_set_updated_at
before update on gcs
for each row execute function set_updated_at();

-- RLS
alter table gcs enable row level security;

drop policy if exists "gcs_public_read"  on gcs;
drop policy if exists "gcs_authed_write" on gcs;

create policy "gcs_public_read"
  on gcs for select
  using (true);

create policy "gcs_authed_write"
  on gcs for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
