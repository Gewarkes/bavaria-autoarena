import type { VehicleFilter } from "@/lib/vehicles";

export type VehicleSearch = {
  marke?: string | undefined; preisBis?: number | undefined; preisAb?: number | undefined; kraftstoff?: string | undefined; karosserie?: string | undefined;
  getriebe?: string | undefined; kmBis?: number | undefined; ezAb?: number | undefined; sort?: string | undefined;
};

const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim().slice(0, 60) : undefined);
const num = (v: unknown) => { const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN; return Number.isFinite(n) && n > 0 ? Math.round(n) : undefined; };

export function validateVehicleSearch(raw: Record<string, unknown>): VehicleSearch {
  return {
    marke: str(raw["marke"]), preisBis: num(raw["preisBis"]), preisAb: num(raw["preisAb"]), kraftstoff: str(raw["kraftstoff"]),
    karosserie: str(raw["karosserie"]), getriebe: str(raw["getriebe"]), kmBis: num(raw["kmBis"]), ezAb: num(raw["ezAb"]), sort: str(raw["sort"]),
  };
}

export const bodyChips = [
  { value: undefined, label: "Alle" }, { value: "SUV", label: "SUV" }, { value: "Van", label: "Van/Bus" },
  { value: "Limousine", label: "Limousine" }, { value: "Kombi", label: "Kombi" }, { value: "Coupé", label: "Coupé" }, { value: "Camper", label: "Camper" },
] as const;
export const bodyGroups: Record<string, string[]> = { Van: ["Van", "Bus"] };

export const priceChips = [
  { label: "Alle", preisAb: undefined, preisBis: undefined },
  { label: "bis 10.000 €", preisAb: undefined, preisBis: 10000 },
  { label: "10–15.000 €", preisAb: 10000, preisBis: 15000 },
  { label: "15–25.000 €", preisAb: 15000, preisBis: 25000 },
  { label: "über 25.000 €", preisAb: 25000, preisBis: undefined },
] as const;

export const sortOptions = [
  { value: "neu", label: "Neueste zuerst" }, { value: "preis-auf", label: "Preis aufsteigend" },
  { value: "preis-ab", label: "Preis absteigend" }, { value: "km-auf", label: "Kilometer aufsteigend" },
  { value: "ez-neu", label: "Erstzulassung neueste" },
] as const;

const fuelMap: Record<string, VehicleFilter["fuel"]> = { benzin: "benzin", diesel: "diesel", hybrid: "hybrid", elektro: "elektro", gas: "gas" };
const gearMap: Record<string, VehicleFilter["transmission"]> = { schaltung: "schaltung", automatik: "automatik" };

export function searchToFilter(s: VehicleSearch): VehicleFilter {
  const sort = sortOptions.find((o) => o.value === s.sort)?.value;
  return {
    brand: s.marke, minPrice: s.preisAb, maxPrice: s.preisBis,
    fuel: s.kraftstoff ? fuelMap[s.kraftstoff.toLowerCase()] : undefined,
    transmission: s.getriebe ? gearMap[s.getriebe.toLowerCase()] : undefined,
    bodyTypes: s.karosserie ? (bodyGroups[s.karosserie] ?? [s.karosserie]) : undefined,
    maxKm: s.kmBis, minYear: s.ezAb, sort,
  };
}
