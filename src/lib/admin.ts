import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type T = Database["public"]["Tables"];
export type LeadStatus = Database["public"]["Enums"]["lead_status"];
export type VehicleStatus = Database["public"]["Enums"]["vehicle_status"];
export type TradeInRow = T["trade_in_requests"]["Row"];
export type InquiryRow = T["inquiries"]["Row"];
export type AdminVehicle = T["vehicles"]["Row"];
export type TestimonialRow = T["testimonials"]["Row"];

export const LEAD_STATUSES: { value: LeadStatus; label: string }[] = [
  { value: "neu", label: "Neu" }, { value: "kontaktiert", label: "Kontaktiert" }, { value: "termin", label: "Termin" },
  { value: "angebot", label: "Angebot" }, { value: "abgeschlossen", label: "Abgeschlossen" }, { value: "abgelehnt", label: "Abgelehnt" },
];
export const VEHICLE_STATUSES: { value: VehicleStatus; label: string }[] = [
  { value: "verfuegbar", label: "Verfügbar" }, { value: "reserviert", label: "Reserviert" }, { value: "verkauft", label: "Verkauft" },
];
export const INTENT_LABEL: Record<string, string> = { inzahlungnahme: "Inzahlungnahme", verkauf: "Verkauf", unsicher: "Noch offen" };
export const KIND_LABEL: Record<string, string> = { probefahrt: "Probefahrt", anfrage: "Anfrage", rueckruf: "Rückruf", finanzierung: "Finanzierung", kontakt: "Kontakt" };
export const BODY_TYPES = ["SUV", "Van", "Bus", "Limousine", "Kombi", "Coupé", "Cabrio", "Kleinwagen", "Camper"];

const TRADE_LIST = "id, created_at, first_name, last_name, brand, model, first_registration_year, mileage_km, intent, contact_channel, status, phone, email" as const;
export type TradeInListItem = Pick<TradeInRow, "id" | "created_at" | "first_name" | "last_name" | "brand" | "model" | "first_registration_year" | "mileage_km" | "intent" | "contact_channel" | "status" | "phone" | "email">;

export async function listTradeIns(): Promise<TradeInListItem[]> {
  const { data, error } = await supabase.from("trade_in_requests").select(TRADE_LIST).order("created_at", { ascending: false }).limit(1000);
  if (error) throw error;
  return data;
}
export async function getTradeIn(id: string) {
  const { data, error } = await supabase.from("trade_in_requests").select("id, created_at, brand, model, first_registration_year, mileage_km, fuel, transmission, engine_variant, accident_status, hu_until, previous_owners, service_book, condition_exterior, condition_interior, damage_notes, financing_active, photo_paths, intent, desired_vehicle_id, first_name, last_name, phone, email, zip, contact_channel, marketing_opt_in, privacy_notice_version, status, internal_notes, internal_valuation_eur").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}
export async function updateTradeIn(id: string, patch: Partial<Pick<TradeInRow, "status" | "internal_notes" | "internal_valuation_eur">>) {
  const { error } = await supabase.from("trade_in_requests").update(patch).eq("id", id);
  if (error) throw error;
}
export async function deleteTradeIn(id: string, photos: string[]) {
  if (photos.length) {
    const { error } = await supabase.storage.from("trade-in-photos").remove(photos);
    if (error) throw error;
  }
  const { error } = await supabase.from("trade_in_requests").delete().eq("id", id);
  if (error) throw error;
}

const INQ_LIST = "id, created_at, kind, name, phone, email, message, status, internal_notes, vehicle_id, privacy_notice_version, vehicles(title, slug)" as const;
export type InquiryListItem = Omit<InquiryRow, never> & { vehicles: { title: string; slug: string } | null };
export async function listInquiries(): Promise<InquiryListItem[]> {
  const { data, error } = await supabase.from("inquiries").select(INQ_LIST).order("created_at", { ascending: false }).limit(1000);
  if (error) throw error;
  return data as InquiryListItem[];
}
export async function updateInquiry(id: string, patch: Partial<Pick<InquiryRow, "status" | "internal_notes">>) {
  const { error } = await supabase.from("inquiries").update(patch).eq("id", id);
  if (error) throw error;
}
export async function deleteInquiry(id: string) {
  const { error } = await supabase.from("inquiries").delete().eq("id", id);
  if (error) throw error;
}

const VEH_COLS = "id, slug, brand, model, variant, title, price_eur, first_registration, mileage_km, power_kw, power_ps, fuel, transmission, body_type, color, tax_status, hu_until, previous_owners, features, description, images, status, is_highlight, is_demo, envkv_required, created_at, updated_at" as const;
export async function listAdminVehicles(): Promise<AdminVehicle[]> {
  const { data, error } = await supabase.from("vehicles").select(VEH_COLS).order("created_at", { ascending: false }).limit(1000);
  if (error) throw error;
  return data;
}
export async function getAdminVehicle(id: string) {
  const { data, error } = await supabase.from("vehicles").select(VEH_COLS).eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}
export async function updateVehicle(id: string, patch: T["vehicles"]["Update"]) {
  const { error } = await supabase.from("vehicles").update(patch).eq("id", id);
  if (error) throw error;
}
export async function insertVehicles(rows: T["vehicles"]["Insert"][]) {
  const { error } = await supabase.from("vehicles").insert(rows);
  if (error) throw error;
}

export async function listAllTestimonials(): Promise<TestimonialRow[]> {
  const { data, error } = await supabase.from("testimonials").select("id, author, text, rating, source, approved_at, is_visible, sort_order").order("sort_order", { ascending: true });
  if (error) throw error;
  return data;
}

export function slugify(s: string) {
  return s.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "fahrzeug";
}
export async function uniqueSlug(base: string, taken?: Set<string>) {
  const root = slugify(base);
  const { data } = await supabase.from("vehicles").select("slug").like("slug", `${root}%`).limit(500);
  const used = new Set([...(data ?? []).map((r) => r.slug), ...(taken ?? [])]);
  if (!used.has(root)) return root;
  let i = 2; while (used.has(`${root}-${i}`)) i++;
  return `${root}-${i}`;
}

export function downloadCsv(filename: string, rows: (string | number | null | undefined)[][]) {
  const esc = (v: unknown) => { const s = v == null ? "" : String(v); return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  const blob = new Blob(["\ufeff" + rows.map((r) => r.map(esc).join(";")).join("\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export const fmtDateTime = (iso: string) => new Date(iso).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
