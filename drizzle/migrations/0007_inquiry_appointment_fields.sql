alter table public.inquiries add column if not exists preferred_date date, add column if not exists preferred_slot text, add column if not exists topic text;
grant insert (preferred_date, preferred_slot, topic) on public.inquiries to anon, authenticated;
grant all on public.inquiries to service_role;