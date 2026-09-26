import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

import { PRIVACY_VERSION } from "@/config/site";
export const PRIVACY_NOTICE_VERSION = PRIVACY_VERSION;
export const MIN_FILL_MS = 3000;

const optionalText = (max: number) => z.string().trim().max(max).optional().transform((v) => (v ? v : undefined));

export const inquirySchema = z.object({
  kind: z.enum(["probefahrt", "anfrage", "rueckruf", "finanzierung", "kontakt"]),
  name: z.string().trim().min(2, "Bitte geben Sie Ihren Namen an.").max(100),
  phone: optionalText(40).refine((v) => !v || /^[+\d\s()/-]{6,}$/.test(v), "Bitte eine gültige Telefonnummer angeben."),
  email: optionalText(255).refine((v) => !v || z.string().email().safeParse(v).success, "Bitte eine gültige E-Mail-Adresse angeben."),
  message: optionalText(2000),
  vehicleId: z.string().uuid().nullable(),
}).refine((d) => d.phone || d.email, { message: "Bitte Telefon oder E-Mail angeben.", path: ["phone"] });

export type InquiryInput = z.input<typeof inquirySchema>;

/** Inserts a lead. Never chains .select() – anon has no read access. */
export async function submitInquiry(input: InquiryInput, meta: { honeypot: string; startedAt: number }) {
  const data = inquirySchema.parse(input);
  // Bots: silently pretend success
  if (meta.honeypot || Date.now() - meta.startedAt < MIN_FILL_MS) return { ok: true as const };
  const { error } = await supabase.from("inquiries").insert({
    kind: data.kind, name: data.name, phone: data.phone ?? null, email: data.email ?? null,
    message: data.message ?? null, vehicle_id: data.vehicleId, privacy_notice_version: PRIVACY_NOTICE_VERSION,
  });
  if (error) {
    console.error("inquiry_insert_failed", error.code);
    return { ok: false as const };
  }
  return { ok: true as const };
}
