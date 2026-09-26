import { notifyLead } from "./inquiries";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { PRIVACY_NOTICE_VERSION } from "@/lib/inquiries";

export const MIN_FUNNEL_MS = 5000;
export const MAX_PHOTOS = 6;
export const BUCKET = "trade-in-photos";

export type TradeInThanksState = { firstName: string; channel: string | null; intent: string };

declare module "@tanstack/react-router" {
  interface HistoryState { tradeIn?: TradeInThanksState }
}

export const brandOptions = ["Audi", "BMW", "Citroën", "Dacia", "Fiat", "Ford", "Honda", "Hyundai", "Kia", "Land Rover", "Mazda", "Mercedes-Benz", "MINI", "Mitsubishi", "Nissan", "Opel", "Peugeot", "Porsche", "Renault", "Seat", "Škoda", "Smart", "Suzuki", "Tesla", "Toyota", "Volkswagen", "Volvo", "Andere"];
export const currentYear = 2026;
export const yearOptions = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => currentYear - i);

const opt = (max: number) => z.string().trim().max(max).optional().transform((v) => (v ? v : undefined));

export const step1Schema = z.object({
  brand: z.string().trim().min(1, "Bitte wählen Sie eine Marke.").max(60),
  model: z.string().trim().min(1, "Bitte geben Sie das Modell an.").max(80, "Maximal 80 Zeichen."),
  year: z.number({ message: "Bitte wählen Sie das Erstzulassungsjahr." }).int().min(2000).max(currentYear),
  mileageKm: z.number({ message: "Bitte geben Sie den Kilometerstand an." }).int().min(0).max(2_000_000, "Bitte einen realistischen Kilometerstand angeben."),
  fuel: z.enum(["benzin", "diesel", "hybrid", "elektro", "gas"]).optional(),
  transmission: z.enum(["schaltung", "automatik"]).optional(),
  engineVariant: opt(80),
  accident: z.enum(["unfallfrei", "repariert", "schaden"], { message: "Bitte wählen Sie den Unfallstatus." }),
});

export const step2Schema = z.object({
  intent: z.enum(["inzahlung", "verkaufen", "bewerten"], { message: "Bitte wählen Sie Ihr Anliegen." }),
  desiredVehicleId: z.string().uuid().optional(),
  financing: z.enum(["ja", "nein", "unbekannt"]).optional(),
});

export const step3Schema = z.object({
  firstName: z.string().trim().min(1, "Bitte geben Sie Ihren Vornamen an.").max(60),
  lastName: z.string().trim().min(1, "Bitte geben Sie Ihren Nachnamen an.").max(60),
  phone: opt(40).refine((v) => !v || /^[+\d\s()/-]{6,}$/.test(v), "Bitte eine gültige Telefonnummer angeben."),
  email: opt(255).refine((v) => !v || z.string().email().safeParse(v).success, "Bitte eine gültige E-Mail-Adresse angeben."),
  zip: opt(5).refine((v) => !v || /^\d{5}$/.test(v), "Bitte eine fünfstellige PLZ angeben."),
  channel: z.enum(["anruf", "whatsapp", "email"]).optional(),
  marketing: z.boolean(),
}).refine((d) => d.phone || d.email, { message: "Bitte geben Sie Telefon oder E-Mail an, damit wir Ihnen das Angebot senden können.", path: ["phone"] });

export const step4Schema = z.object({
  exterior: z.enum(["sehr_gut", "gut", "gebrauchsspuren"]).optional(),
  interior: z.enum(["sehr_gut", "gut", "gebrauchsspuren"]).optional(),
  huUntil: opt(7).refine((v) => !v || /^\d{4}-\d{2}$/.test(v), "Bitte Monat und Jahr angeben."),
  previousOwners: z.enum(["1", "2", "3+"]).optional(),
  serviceBook: z.enum(["ja", "nein", "teilweise"]).optional(),
  damageNotes: opt(1000),
});

export type Step1 = z.infer<typeof step1Schema>;
export type Step2 = z.infer<typeof step2Schema>;
export type Step3 = z.infer<typeof step3Schema>;
export type Step4 = z.infer<typeof step4Schema>;

export function fieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) { const k = String(issue.path[0] ?? "form"); if (!out[k]) out[k] = issue.message; }
  return out;
}

export type SubmitResult = { ok: true } | { ok: false; reason: "rate_limited" | "error" };

/** Inserts the lead. No .select() – anon has no read access. */
export async function submitTradeIn(id: string, s1: Step1, s2: Step2, s3: Step3): Promise<SubmitResult> {
  const { error } = await supabase.from("trade_in_requests").insert({
    id, brand: s1.brand, model: s1.model, first_registration_year: s1.year, mileage_km: s1.mileageKm,
    fuel: s1.fuel ?? null, transmission: s1.transmission ?? null, engine_variant: s1.engineVariant ?? null, accident_status: s1.accident,
    intent: s2.intent, desired_vehicle_id: s2.intent === "inzahlung" ? s2.desiredVehicleId ?? null : null,
    financing_active: s2.financing === "ja" ? true : s2.financing === "nein" ? false : null,
    first_name: s3.firstName, last_name: s3.lastName, phone: s3.phone ?? null, email: s3.email ?? null, zip: s3.zip ?? null,
    contact_channel: s3.channel ?? null, marketing_opt_in: s3.marketing, privacy_notice_version: PRIVACY_NOTICE_VERSION,
  });
  if (!error) { notifyLead("trade_in", id); return { ok: true }; }
  console.error("trade_in_insert_failed", error.code);
  return { ok: false, reason: error.message?.includes("rate_limited") ? "rate_limited" : "error" };
}

export async function compressPhoto(file: File): Promise<Blob> {
  const { default: imageCompression } = await import("browser-image-compression");
  return imageCompression(file, { maxWidthOrHeight: 1600, maxSizeMB: 0.6, fileType: "image/jpeg", useWebWorker: true });
}

export async function uploadPhoto(requestId: string, blob: Blob): Promise<string> {
  const path = `${requestId}/${crypto.randomUUID()}.jpg`;
  for (let attempt = 0; attempt < 2; attempt++) {
    const { error } = await supabase.storage.from(BUCKET).upload(path, blob, { upsert: false, contentType: "image/jpeg" });
    if (!error) return path;
    if (attempt === 1) { console.error("trade_in_photo_upload_failed", error.name); throw error; }
  }
  throw new Error("upload_failed");
}

export async function completeTradeIn(id: string, s4: Step4, photoPaths: string[]) {
  const { data, error } = await supabase.rpc("complete_trade_in_request", {
    _id: id, _condition_exterior: s4.exterior ?? "", _condition_interior: s4.interior ?? "", _hu_until: s4.huUntil ?? "",
    _previous_owners: s4.previousOwners ?? "", _service_book: s4.serviceBook ?? "", _damage_notes: s4.damageNotes ?? "", _photo_paths: photoPaths,
  });
  if (error) { console.error("trade_in_complete_failed", error.code); return false; }
  return data === true;
}

export const channelLabel: Record<string, string> = { anruf: "Telefon", whatsapp: "WhatsApp", email: "E-Mail" };
