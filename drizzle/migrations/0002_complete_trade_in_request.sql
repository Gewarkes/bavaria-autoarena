create or replace function public.complete_trade_in_request(_id uuid, _condition_exterior text, _condition_interior text, _hu_until text, _previous_owners text, _service_book text, _damage_notes text, _photo_paths text[])
returns boolean language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if coalesce(array_length(_photo_paths,1),0) > 6 then raise exception 'too_many_photos'; end if;
  if length(coalesce(_damage_notes,'')) > 1000 then raise exception 'too_long'; end if;
  update public.trade_in_requests set
    condition_exterior = nullif(left(_condition_exterior,40),''),
    condition_interior = nullif(left(_condition_interior,40),''),
    hu_until = nullif(left(_hu_until,10),''),
    previous_owners = nullif(left(_previous_owners,10),''),
    service_book = nullif(left(_service_book,20),''),
    damage_notes = nullif(_damage_notes,''),
    photo_paths = coalesce((select array_agg(p) from unnest(_photo_paths) p where p like _id::text || '/%'), '{}')
  where id = _id and status = 'neu' and created_at > now() - interval '2 hours';
  get diagnostics n = row_count;
  return n > 0;
end $$;
revoke all on function public.complete_trade_in_request(uuid,text,text,text,text,text,text,text[]) from public;
grant execute on function public.complete_trade_in_request(uuid,text,text,text,text,text,text,text[]) to anon, authenticated;