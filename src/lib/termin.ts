import { useSyncExternalStore } from "react";

export type TerminVehicle = { id: string; title: string; price: string; image?: string | undefined };
export type TerminTopic = "Probefahrt" | "Besichtigung" | "Beratung / Finanzierung" | "Mein Auto bewerten lassen";
export const TERMIN_TOPICS: TerminTopic[] = ["Probefahrt", "Besichtigung", "Beratung / Finanzierung", "Mein Auto bewerten lassen"];
export const CALL_ME = "Egal – rufen Sie mich an";

type State = { open: boolean; vehicle?: TerminVehicle | undefined; topic?: TerminTopic | undefined; key: number };
let state: State = { open: false, key: 0 };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function openTermin(opts: { vehicle?: TerminVehicle; topic?: TerminTopic } = {}) {
  state = { open: true, vehicle: opts.vehicle, topic: opts.topic, key: state.key + 1 };
  emit();
}
export function closeTermin() { state = { ...state, open: false }; emit(); }
export function useTerminState() {
  return useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, () => state, () => state);
}

/** Berlin-local "now" as date string + minutes. */
function berlinNow() {
  const p = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Berlin", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
  const g = (t: string) => p.find((x) => x.type === t)?.value ?? "0";
  return { date: `${g("year")}-${g("month")}-${g("day")}`, minutes: (Number(g("hour")) % 24) * 60 + Number(g("minute")) };
}

const addDays = (iso: string, n: number) => { const d = new Date(`${iso}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const weekday = (iso: string) => new Date(`${iso}T12:00:00Z`).getUTCDay();

export function slotsFor(iso: string): string[] {
  const wd = weekday(iso);
  if (wd === 0) return [];
  const hours = wd === 6 ? [9, 10, 11, 12] : [9, 10, 11, 12, 13, 14, 15, 16, 17];
  const now = berlinNow();
  return hours.filter((h) => iso !== now.date || h * 60 >= now.minutes + 120).map((h) => `${String(h).padStart(2, "0")}:00`);
}

export function nextOpeningDays(count = 10): string[] {
  const out: string[] = [];
  let d = berlinNow().date;
  while (out.length < count) { if (slotsFor(d).length) out.push(d); d = addDays(d, 1); }
  return out;
}

export const chipLabel = (iso: string) => {
  const d = new Date(`${iso}T12:00:00Z`);
  return `${d.toLocaleDateString("de-DE", { weekday: "short", timeZone: "UTC" }).replace(".", "")} ${d.getUTCDate()}.${d.getUTCMonth() + 1}.`;
};
export const longLabel = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });

export function buildIcs(iso: string, time: string, summary: string) {
  const [h] = time.split(":").map(Number);
  const d = iso.replace(/-/g, "");
  const pad = (n: number) => String(n).padStart(2, "0");
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Bavaria Autoarena//Termin//DE", "BEGIN:VEVENT",
    `UID:${crypto.randomUUID()}@bavaria-autoarena.de`, `DTSTAMP:${stamp}`,
    `DTSTART;TZID=Europe/Berlin:${d}T${pad(h ?? 9)}0000`, `DTEND;TZID=Europe/Berlin:${d}T${pad((h ?? 9) + 1)}0000`,
    `SUMMARY:${summary.replace(/[,;]/g, " ")}`, "LOCATION:Bavaria Autoarena\\, Gewerbestraße 7\\, 94368 Perkam",
    "DESCRIPTION:Wunschtermin – wird telefonisch bestätigt. Bitte Führerschein mitbringen.", "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
}
