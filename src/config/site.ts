export const siteConfig = {
  name: "Bavaria Autoarena GmbH",
  shortName: "Bavaria Autoarena",
  street: "Gewerbestraße 7",
  zip: "94368",
  city: "Perkam",
  phone: "+49 9421 000000",
  whatsapp: "+49 170 0000000",
  email: "info@bavaria-autoarena.de",
  openingHours: {
    monday: "09:00–18:00",
    tuesday: "09:00–18:00",
    wednesday: "09:00–18:00",
    thursday: "09:00–18:00",
    friday: "09:00–18:00",
    saturday: "09:00–13:00",
    sunday: "Geschlossen",
  },
  mobileDeUrl: "https://home.mobile.de/BAVARIAAUTOARENASTRAUBINGGMBH",
  rating: { value: 4.7, count: 85, source: "mobile.de", asOf: "09/2026" },
  features: { showMonthlyRate: false },
} as const;

const dayKeys = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

function getGermanTime(date = new Date()) {
  const parts = new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const weekday = parts.find((part) => part.type === "weekday")?.value ?? "So";
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? 0);
  const dayMap: Record<string, number> = { So: 0, Mo: 1, Di: 2, Mi: 3, Do: 4, Fr: 5, Sa: 6 };
  return { day: dayMap[weekday] ?? 0, minutes: hour * 60 + minute };
}

export function todaysHours(date = new Date()) {
  const { day } = getGermanTime(date);
  return siteConfig.openingHours[dayKeys[day]];
}

export function isOpenNow(date = new Date()) {
  const { day, minutes } = getGermanTime(date);
  if (day === 0) return false;
  const closing = day === 6 ? 13 * 60 : 18 * 60;
  return minutes >= 9 * 60 && minutes < closing;
}

export function currentOpeningStatus(date = new Date()) {
  if (!isOpenNow(date)) return "Jetzt geschlossen";
  return `Heute geöffnet bis ${date && getGermanTime(date).day === 6 ? "13:00" : "18:00"}`;
}