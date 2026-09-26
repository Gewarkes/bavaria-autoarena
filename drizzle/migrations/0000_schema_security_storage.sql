create type public.app_role as enum ('admin');
create type public.vehicle_status as enum ('verfuegbar','reserviert','verkauft');
create type public.fuel_type as enum ('benzin','diesel','hybrid','elektro','gas');
create type public.gearbox as enum ('schaltung','automatik');
create type public.tax_status as enum ('differenz','regel');
create type public.lead_status as enum ('neu','kontaktiert','termin','angebot','abgeschlossen','abgelehnt');

create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  brand text not null, model text not null, variant text,
  title text not null,
  price_eur integer not null check (price_eur > 0),
  first_registration date not null,
  mileage_km integer not null check (mileage_km >= 0),
  power_kw integer, power_ps integer,
  fuel fuel_type not null, transmission gearbox not null,
  body_type text not null, color text,
  tax_status tax_status not null default 'differenz',
  hu_until text, previous_owners smallint,
  features text[] not null default '{}',
  description text,
  images jsonb not null default '[]',
  status vehicle_status not null default 'verfuegbar',
  is_highlight boolean not null default false,
  is_demo boolean not null default false,
  envkv_required boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.vehicles (status, created_at desc);
create index on public.vehicles (brand, model);
create index on public.vehicles (price_eur);

create table public.trade_in_requests (
  id uuid primary key default gen_random_uuid(),
  brand text not null, model text not null, first_registration_year smallint not null,
  mileage_km integer not null, fuel text, transmission text, engine_variant text,
  accident_status text not null check (accident_status in ('unfallfrei','repariert','unfall')),
  hu_until text, previous_owners text, service_book text,
  condition_exterior text, condition_interior text,
  damage_notes text,
  financing_active boolean,
  photo_paths text[] not null default '{}',
  intent text not null check (intent in ('inzahlung','verkaufen','bewerten')),
  desired_vehicle_id uuid references public.vehicles(id),
  first_name text not null, last_name text not null,
  phone text, email text,
  zip text, contact_channel text,
  marketing_opt_in boolean not null default false,
  privacy_notice_version text not null,
  status lead_status not null default 'neu',
  internal_notes text,
  internal_valuation_eur integer,
  created_at timestamptz not null default now(),
  check (phone is not null or email is not null)
);
create index on public.trade_in_requests (status, created_at desc);

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references public.vehicles(id) on delete set null,
  kind text not null check (kind in ('probefahrt','anfrage','rueckruf','finanzierung','kontakt')),
  name text not null, phone text, email text, message text,
  privacy_notice_version text not null,
  status lead_status not null default 'neu',
  internal_notes text,
  created_at timestamptz not null default now(),
  check (phone is not null or email is not null)
);
create index on public.inquiries (status, created_at desc);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author text not null, text text not null, rating smallint check (rating between 1 and 5),
  source text not null default 'mobile.de', approved_at date,
  is_visible boolean not null default false, sort_order integer not null default 0
);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  unique (user_id, role)
);

-- Data API grants (required; RLS still decides row access)
grant select on public.vehicles to anon;
grant select, insert, update, delete on public.vehicles to authenticated;
grant all on public.vehicles to service_role;
grant select, update, delete on public.trade_in_requests to authenticated;
grant all on public.trade_in_requests to service_role;
grant select, update, delete on public.inquiries to authenticated;
grant all on public.inquiries to service_role;
grant select on public.testimonials to anon;
grant select, insert, update, delete on public.testimonials to authenticated;
grant all on public.testimonials to service_role;
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

create or replace function public.set_updated_at() returns trigger language plpgsql set search_path = public
as $$ begin new.updated_at = now(); return new; end $$;
create trigger vehicles_updated_at before update on public.vehicles for each row execute function public.set_updated_at();

create or replace function public.check_lead_rate_limit() returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if new.email is not null and (select count(*) from public.trade_in_requests where lower(email) = lower(new.email) and created_at > now() - interval '1 hour') >= 3
  then raise exception 'rate_limited'; end if;
  if (select count(*) from public.trade_in_requests where created_at > now() - interval '1 hour') >= 30
  then raise exception 'rate_limited'; end if;
  return new;
end $$;
create trigger trade_in_rate_limit before insert on public.trade_in_requests for each row execute function public.check_lead_rate_limit();

alter table public.vehicles enable row level security;
alter table public.trade_in_requests enable row level security;
alter table public.inquiries enable row level security;
alter table public.testimonials enable row level security;
alter table public.user_roles enable row level security;

create policy "public reads available vehicles" on public.vehicles for select to anon, authenticated
  using (status <> 'verkauft' or public.has_role(auth.uid(),'admin'));
create policy "admin writes vehicles" on public.vehicles for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create policy "anyone submits trade-in" on public.trade_in_requests for insert to anon, authenticated with check (true);
create policy "admin reads trade-in" on public.trade_in_requests for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin updates trade-in" on public.trade_in_requests for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin deletes trade-in" on public.trade_in_requests for delete to authenticated using (public.has_role(auth.uid(),'admin'));

create policy "anyone submits inquiry" on public.inquiries for insert to anon, authenticated with check (true);
create policy "admin reads inquiries" on public.inquiries for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin updates inquiries" on public.inquiries for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin deletes inquiries" on public.inquiries for delete to authenticated using (public.has_role(auth.uid(),'admin'));

create policy "public reads visible testimonials" on public.testimonials for select to anon, authenticated
  using (is_visible or public.has_role(auth.uid(),'admin'));
create policy "admin writes testimonials" on public.testimonials for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create policy "admins read roles" on public.user_roles for select to authenticated using (public.has_role(auth.uid(),'admin'));

revoke insert on public.trade_in_requests from anon, authenticated;
grant insert (brand, model, first_registration_year, mileage_km, fuel, transmission, engine_variant, accident_status, hu_until, previous_owners, service_book, condition_exterior, condition_interior, damage_notes, financing_active, photo_paths, intent, desired_vehicle_id, first_name, last_name, phone, email, zip, contact_channel, marketing_opt_in, privacy_notice_version) on public.trade_in_requests to anon, authenticated;
revoke insert on public.inquiries from anon, authenticated;
grant insert (vehicle_id, kind, name, phone, email, message, privacy_notice_version) on public.inquiries to anon, authenticated;

create policy "anon uploads trade-in photos" on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'trade-in-photos'
    and (storage.foldername(name))[1] ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    and array_length(storage.foldername(name), 1) = 1);
create policy "admin reads trade-in photos" on storage.objects for select to authenticated
  using (bucket_id = 'trade-in-photos' and public.has_role(auth.uid(),'admin'));
create policy "admin deletes trade-in photos" on storage.objects for delete to authenticated
  using (bucket_id = 'trade-in-photos' and public.has_role(auth.uid(),'admin'));
create policy "public reads vehicle images" on storage.objects for select to anon, authenticated using (bucket_id = 'vehicle-images');
create policy "admin manages vehicle images" on storage.objects for all to authenticated
  using (bucket_id = 'vehicle-images' and public.has_role(auth.uid(),'admin'))
  with check (bucket_id = 'vehicle-images' and public.has_role(auth.uid(),'admin'));