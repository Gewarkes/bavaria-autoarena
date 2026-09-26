import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { SearchRequestForm } from "@/components/forms/SearchRequestForm";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { categories, priceLimits, searchToFilter, sortOptions, type VehicleSearch } from "@/lib/vehicleSearch";
import { brandsQuery, vehiclesQuery } from "@/lib/vehicles";

const route = getRouteApi("/fahrzeuge/");
const fuels = [["benzin", "Benzin"], ["diesel", "Diesel"], ["hybrid", "Hybrid"], ["elektro", "Elektro"]] as const;

function UnderlineSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: readonly (readonly [string, string])[] }) {
  return (
    <label className="block min-w-0">
      <span className="block font-display text-[11px] font-medium uppercase tracking-[.16em] text-ink-500">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 h-11 w-full min-w-[150px] cursor-pointer appearance-none rounded-none border-0 border-b border-navy-900/25 bg-transparent bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%231A1F35%22 stroke-width=%221.5%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:12px] bg-[right_2px_center] bg-no-repeat pr-6 text-[15px] text-navy-900 focus:border-gold-600 focus:outline-none">
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  );
}

function Filters({ search, update }: { search: VehicleSearch; update: (p: Partial<VehicleSearch>) => void }) {
  const { data: brands } = useSuspenseQuery(brandsQuery());
  const u = (v: string) => (v ? v : undefined);
  return <>
    <UnderlineSelect label="Marke" value={search.marke ?? ""} onChange={(v) => update({ marke: u(v) })} options={[["", "Alle Marken"], ...brands.map((b) => [b, b] as const)]} />
    <UnderlineSelect label="Kategorie" value={search.kategorie ?? ""} onChange={(v) => update({ kategorie: u(v), karosserie: undefined })} options={[["", "Alle Kategorien"], ...categories.map((c) => [c.value, c.label] as const)]} />
    <UnderlineSelect label="Kraftstoff" value={search.kraftstoff?.toLowerCase() ?? ""} onChange={(v) => update({ kraftstoff: u(v) })} options={[["", "Alle"], ...fuels]} />
    <UnderlineSelect label="Preis bis" value={search.preisBis ? String(search.preisBis) : ""} onChange={(v) => update({ preisBis: v ? Number(v) : undefined, preisAb: undefined })} options={[["", "beliebig"], ...priceLimits.map((p) => [String(p), `${p.toLocaleString("de-DE")} €`] as const)]} />
  </>;
}

export default function VehiclesPage() {
  const search = route.useSearch();
  const navigate = useNavigate({ from: "/fahrzeuge/" });
  const [sheet, setSheet] = useState(false);
  const update = (patch: Partial<VehicleSearch>) => navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true, resetScroll: false });
  const reset = () => navigate({ search: {}, replace: true, resetScroll: false });
  const { data } = useSuspenseQuery(vehiclesQuery(searchToFilter(search)));
  const all = useSuspenseQuery(vehiclesQuery({}));
  const hasFilters = Object.entries(search).some(([k, v]) => k !== "sort" && v !== undefined);
  const sortSelect = <UnderlineSelect label="Sortierung" value={search.sort ?? "neu"} onChange={(v) => update({ sort: v === "neu" ? undefined : v })} options={sortOptions.map((o) => [o.value, o.label] as const)} />;
  const hits = `${data.length} Treffer`;

  return <>
    <section className="bg-navy-900 py-16 text-cream">
      <div className="page-container">
        <p className="eyebrow text-gold-400">Unser Bestand</p>
        <h1 className="display-title mt-4">Unsere Fahrzeuge</h1>
        <p className="mt-6 text-silver-300">{all.data ? `${all.data.length} Fahrzeuge vor Ort in Perkam` : "Fahrzeuge vor Ort in Perkam"} · Besichtigung nach Termin</p>
      </div>
    </section>

    <div className="sticky top-16 z-30 border-b border-silver-300 bg-silver-100/95 backdrop-blur lg:top-[68px]">
      <div className="page-container hidden items-end gap-6 py-4 md:flex">
        <div className="grid flex-1 grid-cols-4 gap-6"><Filters search={search} update={update} /></div>
        <div className="w-48">{sortSelect}</div>
        <div className="pb-3 text-sm tabular-nums text-ink-500" aria-live="polite">{hits}</div>
      </div>
      <div className="page-container flex items-center justify-between py-3 md:hidden">
        <Button type="button" variant="outline" className="border-navy-900 text-navy-900" onClick={() => setSheet(true)}><SlidersHorizontal strokeWidth={1.5} />Filter & Sortierung</Button>
        <span className="text-sm tabular-nums text-ink-500" aria-live="polite">{hits}</span>
      </div>
    </div>
    <Sheet open={sheet} onOpenChange={setSheet}>
      <SheetContent side="bottom" className="max-h-[90dvh] overflow-y-auto bg-silver-100 p-6">
        <SheetTitle className="font-display text-sm font-medium uppercase tracking-[.16em] text-navy-900">Filter & Sortierung</SheetTitle>
        <SheetDescription className="sr-only">Fahrzeuge filtern und sortieren</SheetDescription>
        <div className="mt-6 grid gap-5"><Filters search={search} update={update} />{sortSelect}</div>
        <div className="mt-8 grid gap-3"><Button type="button" variant="gold" onClick={() => setSheet(false)}>{hits ? `${hits} anzeigen` : "Anzeigen"}</Button>{hasFilters ? <Button type="button" variant="ghost" onClick={reset}>Filter zurücksetzen</Button> : null}</div>
      </SheetContent>
    </Sheet>

    <div className="bg-silver-100">
      <div className="page-container py-12">
        {hasFilters ? <button type="button" onClick={reset} className="text-link mb-4 hidden text-navy-900 md:inline-flex">Filter zurücksetzen</button> : null}
        <div className="grid gap-x-5 gap-y-10 md:grid-cols-2 md:gap-x-6 md:gap-y-12 lg:grid-cols-3 lg:gap-x-8">
          {data.length === 0 ? <div className="col-span-full bg-white p-8 text-center text-ink-500">Keine Fahrzeuge mit diesen Kriterien. <button type="button" onClick={reset} className="font-semibold text-gold-700 underline">Filter zurücksetzen</button></div>
            : data.map((v, i) => <VehicleCard key={v.id} vehicle={v} eager={i < 3} />)}
        </div>
        <p className="mt-12 text-xs leading-5 text-ink-500">Alle Preise sind Endpreise in Euro. Zulassung und Überführung sind nicht enthalten und werden nur auf Wunsch gegen gesonderte Berechnung übernommen. Zwischenverkauf und Irrtum vorbehalten.</p>
      </div>
    </div>

    <section id="suchauftrag" className="scroll-mt-24 bg-navy-900 py-16 text-cream md:py-20">
      <div className="page-container grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="section-h2">Nicht das Richtige dabei?</h2>
          <p className="mt-6 max-w-xl leading-[1.7] text-silver-300">Unser Bestand wechselt schnell, manches Auto ist verkauft, bevor es online steht. Sagen Sie uns, was Sie suchen – ob Familienkombi oder seltenen Sportwagen. Wir melden uns, sobald wir etwas Passendes haben. Ihre Anfrage behandeln wir vertraulich.</p>
        </div>
        <SearchRequestForm />
      </div>
    </section>
  </>;
}
