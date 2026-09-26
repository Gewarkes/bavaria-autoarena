-- 1) Replace tautological INSERT policies on lead tables with real predicates.
-- Open anonymous submissions stay possible, but rows must be genuine new leads:
-- status must be 'neu' and internal fields must be empty.

drop policy if exists "anyone submits trade-in" on public.trade_in_requests;
create policy "anyone submits trade-in"
on public.trade_in_requests
for insert
to anon, authenticated
with check (
  status = 'neu'::lead_status
  and internal_notes is null
  and internal_valuation_eur is null
  and notified_at is null
);

drop policy if exists "anyone submits inquiry" on public.inquiries;
create policy "anyone submits inquiry"
on public.inquiries
for insert
to anon, authenticated
with check (
  status = 'neu'::lead_status
  and internal_notes is null
  and notified_at is null
);

-- 2) vehicle-images contains only public product photos of listed vehicles.
-- The bucket itself is switched to public via the Storage tool; here we drop
-- the unbound storage read policy (public buckets serve files without it).

drop policy if exists "public reads vehicle images" on storage.objects;