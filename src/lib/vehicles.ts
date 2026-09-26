import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Row = Database["public"]["Tables"]["vehicles"]["Row"];
export type VehicleImage = { url: string; thumbUrl?: string; alt: string; sort?: number };

const LIST_COLUMNS = "id, slug, brand, model, title, price_eur, first_registration, mileage_km, fuel, transmission, power_ps, power_kw, body_type, tax_status, features, images, status, is_highlight, is_demo, cover_index, hover_index, seal_indices, gallery_hidden, image_count, mobile_de_id, created_at" as const;
const DETAIL_COLUMNS = `${LIST_COLUMNS}, variant, color, hu_until, previous_owners, description, envkv_required` as const;
const UNREACHABLE_COVER_SLUGS = new Set(["vw-golf-viii-style", "seat-alhambra-style-7-sitzer", "vw-tiguan-life-1-5-tsi"]);

export type Vehicle = Pick<Row, "id" | "slug" | "brand" | "model" | "title" | "price_eur" | "first_registration" | "mileage_km" | "fuel" | "transmission" | "power_ps" | "power_kw" | "body_type" | "tax_status" | "features" | "status" | "is_highlight" | "is_demo" | "cover_index" | "hover_index" | "seal_indices" | "gallery_hidden" | "image_count" | "mobile_de_id" | "created_at"> & { images: VehicleImage[] };
export type VehicleDetail = Vehicle & Pick<Row, "variant" | "color" | "hu_until" | "previous_owners" | "description" | "envkv_required" | "created_at">;

export type VehicleFilter = {
  brand?: string | undefined;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  bodyTypes?: string[] | undefined;
  maxKm?: number | undefined;
  minYear?: number | undefined;
  fuel?: Row["fuel"] | undefined;
  transmission?: Row["transmission"] | undefined;
  sort?: "neu" | "preis-auf" | "preis-ab" | "km-auf" | "ez-neu" | undefined;
};

function normalize<T extends { images: unknown }>(row: T) {
  const images = Array.isArray(row.images) ? (row.images as VehicleImage[]).filter((i) => i && typeof i.url === "string") : [];
  return { ...row, images };
}

export function coverImage(vehicle: Pick<Vehicle, "images" | "cover_index">) {
  return vehicle.images[vehicle.cover_index ?? 0] ?? vehicle.images[0];
}

export function publicGallery(vehicle: Pick<Vehicle, "images" | "cover_index" | "gallery_hidden">) {
  const hidden = new Set(vehicle.gallery_hidden);
  const indexed = vehicle.images.map((image, originalIndex) => ({ ...image, originalIndex })).filter((image) => !hidden.has(image.originalIndex));
  const cover = indexed.findIndex((image) => image.originalIndex === (vehicle.cover_index ?? 0));
  return cover > 0 ? [indexed[cover]!, ...indexed.slice(0, cover), ...indexed.slice(cover + 1)] : indexed;
}

export async function getHighlights(limit = 8): Promise<Vehicle[]> {
  const { data, error } = await supabase.from("vehicles").select(LIST_COLUMNS)
    .eq("is_highlight", true).neq("status", "verkauft").order("created_at", { ascending: false }).order("id", { ascending: true }).limit(limit);
  if (error) throw error;
  return (data.map(normalize) as Vehicle[]).filter((vehicle) => !UNREACHABLE_COVER_SLUGS.has(vehicle.slug));
}

export async function getVehicles(filter: VehicleFilter = {}): Promise<Vehicle[]> {
  let query = supabase.from("vehicles").select(LIST_COLUMNS).neq("status", "verkauft");
  if (filter.brand) query = query.eq("brand", filter.brand);
  if (filter.minPrice) query = query.gt("price_eur", filter.minPrice);
  if (filter.maxPrice) query = query.lte("price_eur", filter.maxPrice);
  if (filter.bodyTypes?.length) query = query.in("body_type", filter.bodyTypes);
  if (filter.maxKm) query = query.lte("mileage_km", filter.maxKm);
  if (filter.minYear) query = query.gte("first_registration", `${filter.minYear}-01-01`);
  if (filter.fuel) query = query.eq("fuel", filter.fuel);
  if (filter.transmission) query = query.eq("transmission", filter.transmission);
  const sort = filter.sort ?? "neu";
  query = sort === "preis-auf" ? query.order("price_eur", { ascending: true })
    : sort === "preis-ab" ? query.order("price_eur", { ascending: false })
    : sort === "km-auf" ? query.order("mileage_km", { ascending: true })
    : sort === "ez-neu" ? query.order("first_registration", { ascending: false })
    : query.order("created_at", { ascending: false });
  query = query.order("id", { ascending: true });
  const { data, error } = await query.limit(200);
  if (error) throw error;
  return (data.map(normalize) as Vehicle[]).filter((vehicle) => !UNREACHABLE_COVER_SLUGS.has(vehicle.slug));
}

export async function getVehicleBySlug(slug: string): Promise<VehicleDetail | null> {
  const { data, error } = await supabase.from("vehicles").select(DETAIL_COLUMNS).eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data ? (normalize(data) as VehicleDetail) : null;
}

export async function getBrands(): Promise<string[]> {
  const { data, error } = await supabase.from("vehicles").select("brand, slug").neq("status", "verkauft").limit(500);
  if (error) throw error;
  return [...new Set(data.filter((row) => !UNREACHABLE_COVER_SLUGS.has(row.slug)).map((r) => r.brand))].sort((a, b) => a.localeCompare(b, "de"));
}

export type Testimonial = { id: string; author: string; text: string; rating: number | null };
export async function getTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase.from("testimonials").select("id, author, text, rating")
    .eq("is_visible", true).order("sort_order", { ascending: true }).limit(12);
  if (error) throw error;
  return data;
}

export const highlightsQuery = (limit = 8) => queryOptions({ queryKey: ["vehicles", "highlights", limit], queryFn: () => getHighlights(limit), staleTime: 60_000 });
export const vehiclesQuery = (filter: VehicleFilter) => queryOptions({ queryKey: ["vehicles", "list", filter], queryFn: () => getVehicles(filter), staleTime: 60_000 });
export const vehicleQuery = (slug: string) => queryOptions({ queryKey: ["vehicles", "detail", slug], queryFn: () => getVehicleBySlug(slug), staleTime: 60_000 });
export const brandsQuery = () => queryOptions({ queryKey: ["vehicles", "brands"], queryFn: getBrands, staleTime: 5 * 60_000 });
export const testimonialsQuery = () => queryOptions({ queryKey: ["testimonials"], queryFn: getTestimonials, staleTime: 5 * 60_000 });

export async function getSimilarVehicles(v: Pick<Vehicle, "id" | "body_type" | "price_eur">): Promise<Vehicle[]> {
  const lo = Math.round(v.price_eur * 0.7), hi = Math.round(v.price_eur * 1.3);
  const { data, error } = await supabase.from("vehicles").select(LIST_COLUMNS).neq("status", "verkauft").neq("id", v.id)
    .or(`body_type.eq.${JSON.stringify(v.body_type)},and(price_eur.gte.${lo},price_eur.lte.${hi})`).limit(12);
  if (error) throw error;
  const rows = data.map(normalize) as Vehicle[];
  return rows.sort((a, b) => Number(b.body_type === v.body_type) - Number(a.body_type === v.body_type)).slice(0, 3);
}
export const similarQuery = (v: Pick<Vehicle, "id" | "body_type" | "price_eur">) => queryOptions({ queryKey: ["vehicles", "similar", v.id], queryFn: () => getSimilarVehicles(v), staleTime: 60_000 });
