ALTER TABLE public.trade_in_requests ADD COLUMN IF NOT EXISTS notified_at timestamptz;
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS notified_at timestamptz;
GRANT INSERT (id) ON public.inquiries TO anon, authenticated;

CREATE TABLE public.pending_photo_deletions (
  path text PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, DELETE ON public.pending_photo_deletions TO authenticated;
GRANT ALL ON public.pending_photo_deletions TO service_role;
ALTER TABLE public.pending_photo_deletions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin reads pending deletions" ON public.pending_photo_deletions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin deletes pending deletions" ON public.pending_photo_deletions FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.cleanup_old_leads()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
declare t int; i int;
begin
  if auth.uid() is not null and not public.has_role(auth.uid(), 'admin') then raise exception 'forbidden'; end if;
  -- Storage objects cannot be deleted via SQL; queue paths, admin UI removes them via Storage API
  insert into public.pending_photo_deletions(path)
    select unnest(photo_paths) from public.trade_in_requests
    where status in ('abgeschlossen','abgelehnt') and created_at < now() - interval '6 months'
  on conflict do nothing;
  delete from public.trade_in_requests where status in ('abgeschlossen','abgelehnt') and created_at < now() - interval '6 months';
  get diagnostics t = row_count;
  delete from public.inquiries where status in ('abgeschlossen','abgelehnt') and created_at < now() - interval '6 months';
  get diagnostics i = row_count;
  return jsonb_build_object('trade_in', t, 'inquiries', i);
end $$;
REVOKE ALL ON FUNCTION public.cleanup_old_leads() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cleanup_old_leads() TO authenticated, service_role;

CREATE EXTENSION IF NOT EXISTS pg_cron;
SELECT cron.schedule('cleanup-old-leads', '0 3 * * *', 'select public.cleanup_old_leads()');