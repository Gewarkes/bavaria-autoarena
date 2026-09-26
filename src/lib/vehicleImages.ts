import { useEffect, useState } from "react";

export const VEHICLE_BUCKET = "vehicle-images";

export const isExternal = (url: string) => /^https?:\/\//i.test(url);
export const bucketPath = (url: string) => url.replace(/^vehicle-images\//, "");

/**
 * Externe URLs unverändert, Bucket-Pfade ("vehicle-images/<id>/<file>.webp")
 * über die öffentliche Server-Route /api/public/vehicle-image ausliefern
 * (Bucket bleibt privat, Auslieferung serverseitig).
 */
export function vehicleImageSrc(url: string | undefined): string {
  if (!url) return "";
  if (isExternal(url)) return url;
  return `/api/public/vehicle-image?path=${encodeURIComponent(bucketPath(url))}`;
}

export function useVehicleImage(url: string | undefined) {
  const [src, setSrc] = useState(() => vehicleImageSrc(url));
  useEffect(() => {
    setSrc(vehicleImageSrc(url));
  }, [url]);
  return src;
}

/** mobile.de-Bilder in passender Größe laden (Karten mo-640, Detail mo-1600). */
export function sizedImage(url: string | undefined, size: "card" | "full") {
  if (!url || !/classistatic\.de|mobile\.de/.test(url)) return url;
  const rule = size === "card" ? "mo-640.jpg" : "mo-1600.jpg";
  return /[?&]rule=/.test(url) ? url.replace(/rule=[^&]*/, `rule=${rule}`) : `${url}${url.includes("?") ? "&" : "?"}rule=${rule}`;
}
