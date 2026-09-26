import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const VEHICLE_BUCKET = "vehicle-images";
const TTL = 60 * 60 * 24 * 7;
const cache = new Map<string, { url: string; exp: number }>();
const inflight = new Map<string, Promise<string>>();

export const isExternal = (url: string) => /^https?:\/\//i.test(url);
export const bucketPath = (url: string) => url.replace(/^vehicle-images\//, "");

/** Externe URLs unverändert, Bucket-Pfade ("vehicle-images/<id>/<file>.webp") als Signed URL (7 Tage, gecacht). */
export async function resolveVehicleImage(url: string): Promise<string> {
  if (!url || isExternal(url)) return url;
  const hit = cache.get(url);
  if (hit && hit.exp > Date.now()) return hit.url;
  const running = inflight.get(url);
  if (running) return running;
  const p = supabase.storage.from(VEHICLE_BUCKET).createSignedUrl(bucketPath(url), TTL).then(({ data, error }) => {
    inflight.delete(url);
    if (error || !data) return "";
    cache.set(url, { url: data.signedUrl, exp: Date.now() + (TTL - 3600) * 1000 });
    return data.signedUrl;
  });
  inflight.set(url, p);
  return p;
}

export function useVehicleImage(url: string | undefined) {
  const [src, setSrc] = useState(() => (url && isExternal(url) ? url : cache.get(url ?? "")?.url ?? ""));
  useEffect(() => {
    let alive = true;
    if (url) void resolveVehicleImage(url).then((u) => alive && setSrc(u));
    else setSrc("");
    return () => { alive = false; };
  }, [url]);
  return src;
}

/** mobile.de-Bilder in passender Größe laden (Karten mo-640, Detail mo-1600). */
export function sizedImage(url: string | undefined, size: "card" | "full") {
  if (!url || !/classistatic\.de|mobile\.de/.test(url)) return url;
  const rule = size === "card" ? "mo-640" : "mo-1600";
  return /[?&]rule=/.test(url) ? url.replace(/rule=[^&]*/, `rule=${rule}`) : `${url}${url.includes("?") ? "&" : "?"}rule=${rule}`;
}
