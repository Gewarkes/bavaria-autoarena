import { useQuery } from "@tanstack/react-query";
import { getRouteApi, Link, useNavigate } from "@tanstack/react-router";
import { SlidersHorizontal } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Reveal } from "@/components/Reveal";
import { SearchRequestForm } from "@/components/forms/SearchRequestForm";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { VehicleCard, VehicleCardSkeleton } from "@/components/vehicles/VehicleCard";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { bodyChips, priceChips, searchToFilter, sortOptions, type VehicleSearch } from "@/lib/vehicleSearch";
import { brandsQuery, vehiclesQuery } from "@/lib/vehicles";

const route = getRouteApi("/fahrzeuge/");
const kmSteps = [50000, 100000, 150000, 200000];
const ALL = "alle";
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 20 }, (_, i) => currentYear - i);

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return <button type="button" aria-pressed={active} onClick={onClick} className={cn("h-11 shrink-0 rounded border px-4 text-sm font-semibold transition-colors", active ? "border-gold bg-gold text-primary-foreground" : "border-border text-foreground hover:border-gold")}>{children}</button>;
}

function MoreFilters({ search, update }: { search: VehicleSearch; update: (patch: Partial<VehicleSearch>) => void }) {
  const brands = useQuery(brandsQuery()).data ?? [];
  const kmIndex = search.kmBis ? Math.max(0, kmSteps.indexOf(search.kmBis)) : kmSteps.length - 1;
  const label = "block text-xs font-semibold uppercase tracking-wide text-muted-foreground";
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
      <label className={label}>Marke<Select value={search.marke ?? ALL} onValueChange={(v) => update({ marke: v === ALL ? undefined : v })}><SelectTrigger className="mt-2 h-12 bg-background"><SelectValue /></SelectTrigger><SelectContent><SelectItem value={ALL}>Alle Marken</SelectItem>{brands.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent></Select></label>
      <label className={label}>Kraftstoff<Select value={search.kraftstoff?.toLowerCase() ?? ALL} onValueChange={(v) => update({ kraftstoff: v === ALL ? undefined : v })}><SelectTrigger className="mt-2 h-12 bg-background"><SelectValue /></SelectTrigger><SelectContent><SelectItem value={ALL}>Alle</SelectItem><SelectItem value="benzin">Benzin</SelectItem><SelectItem value="diesel">Diesel</SelectItem><SelectItem value="hybrid">Hybrid</SelectItem><SelectItem value="elektro">Elektro</SelectItem></SelectContent></Select></label>
      <label className={label}>Getriebe<Select value={search.getriebe?.toLowerCase() ?? ALL} onValueChange={(v) => update({ getriebe: v === ALL ? undefined : v })}><SelectTrigger className="mt-2 h-12 bg-background"><SelectValue /></SelectTrigger><SelectContent><SelectItem value={ALL}>Alle</SelectItem><SelectItem value="schaltung">Schaltung</SelectItem><SelectItem value="automatik">Automatik</SelectItem></SelectContent></Select></label>
      <div className={label}>Kilometer bis<p className="mt-2 text-sm normal-case tracking-normal text-foreground">{search.kmBis ? `${search.kmBis.toLocaleString("de-DE")} km` : "Beliebig"}</p><Slider className="mt-4" min={0} max={kmSteps.length - 1} step={1} value={[kmIndex]} onValueChange={([i]) => update({ kmBis: i === kmSteps.length - 1 ? undefined : kmSteps[i ?? 0] })} aria-label="Kilometer bis" /></div>
      <label className={label}>Erstzulassung ab<Select value={search.ezAb ? String(search.ezAb) : ALL} onValueChange={(v) => update({ ezAb: v === ALL ? undefined : Number(v) })}><SelectTrigger className="mt-2 h-12 bg-background"><SelectValue /></SelectTrigger><SelectContent><SelectItem value={ALL}>Beliebig</SelectItem>{years.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent></Select></label>
    </div>
  );
}

export default function VehiclesPage() {
  const search = route.useSearch();
  const navigate = useNavigate({ from: "/fahrzeuge/" });
  const [open, setOpen] = useState(false);
  const update = (patch: Partial<VehicleSearch>) => navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true, resetScroll: false });
  const reset = () => navigate({ search: {}, replace: true, resetScroll: false });
  const { data, isPending, isError } = useQuery(vehiclesQuery(searchToFilter(search)));
  const hasFilters = Object.entries(search).some(([k, v]) => k !== "sort" && v !== undefined);

  return <>
    <section className="border-b border-border">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-5 px-6 py-12 md:flex-row md:items-end md:justify-between md:px-12">
        <div><h1 className="font-display text-3xl font-bold leading-[1.1] text-foreground sm:text-5xl">Gebrauchtwagen in Perkam</h1><p className="mt-4 text-[17px] text-foreground/80">Jedes Auto geprüft und Probe gefahren. 12 Monate gesetzliche Gewährleistung.</p></div>
        <div className="shrink-0 text-sm text-muted-foreground" aria-live="polite">{isPending ? <span className="block h-4 w-16 animate-pulse rounded bg-muted" aria-label="Ergebniszahl wird geladen" /> : `${data?.length ?? 0} Autos`}</div>
      </div>
    </section>

    <div className="mx-auto max-w-[1200px] px-6 py-10 md:px-12">
      <div className="space-y-4">
        <div className="chip-fade -mx-5 lg:mx-0"><div className="hide-scrollbar flex gap-2 overflow-x-auto px-5 pb-1 lg:flex-wrap lg:px-0">{bodyChips.map((c) => <Chip key={c.label} active={search.karosserie === c.value} onClick={() => update({ karosserie: c.value })}>{c.label}</Chip>)}</div></div>
        <div className="chip-fade -mx-5 lg:mx-0"><div className="hide-scrollbar flex gap-2 overflow-x-auto px-5 pb-1 lg:flex-wrap lg:px-0">{priceChips.map((c) => <Chip key={c.label} active={search.preisAb === c.preisAb && search.preisBis === c.preisBis} onClick={() => update({ preisAb: c.preisAb, preisBis: c.preisBis })}>{c.label}</Chip>)}</div></div>
      </div>

      <Collapsible open={open} onOpenChange={setOpen} className="mt-6">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 md:flex md:flex-wrap md:justify-between">
          <div className="flex min-w-0 gap-2">
            <CollapsibleTrigger asChild><Button variant="silver" className="hidden md:inline-flex"><SlidersHorizontal />Mehr Filter</Button></CollapsibleTrigger>
            <Sheet><SheetTrigger asChild><Button variant="silver" className="md:hidden"><SlidersHorizontal />Mehr Filter</Button></SheetTrigger><SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto"><SheetHeader><SheetTitle>Mehr Filter</SheetTitle></SheetHeader><div className="p-4"><MoreFilters search={search} update={update} /><Button variant="ghost" className="mt-6 w-full" onClick={reset}>Filter zurücksetzen</Button></div></SheetContent></Sheet>
            {hasFilters ? <Button variant="ghost" onClick={reset}>Filter zurücksetzen</Button> : null}
          </div>
          <label className="flex min-w-0 items-center justify-end gap-2 text-sm text-muted-foreground"><span className="sr-only sm:not-sr-only">Sortierung</span><Select value={search.sort ?? "neu"} onValueChange={(v) => update({ sort: v === "neu" ? undefined : v })}><SelectTrigger aria-label="Sortierung" className="h-11 min-w-0 max-w-56 bg-background"><SelectValue /></SelectTrigger><SelectContent>{sortOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select></label>
        </div>
        <CollapsibleContent className="mt-4 hidden rounded-lg border border-border bg-card p-5 md:block"><MoreFilters search={search} update={update} /></CollapsibleContent>
      </Collapsible>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
        {isPending ? Array.from({ length: 6 }, (_, i) => <VehicleCardSkeleton key={i} />)
          : isError ? <div className="col-span-full rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">Die Fahrzeuge konnten gerade nicht geladen werden. <a href={siteConfig.mobileDeUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-gold">Bestand auf mobile.de ansehen</a></div>
          : data.length === 0 ? <div className="col-span-full rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">Keine Fahrzeuge mit diesen Kriterien – <button type="button" onClick={reset} className="font-semibold text-gold hover:text-gold-light">Filter zurücksetzen</button> oder <a href={siteConfig.mobileDeUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-gold hover:text-gold-light">alle Fahrzeuge auf mobile.de ansehen</a>.</div>
          : data.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
      </div>
    </div>

    <Reveal className="mx-auto max-w-[1200px] border-t border-border px-6 py-16 md:px-12">
      <div className="max-w-2xl"><h2 className="section-h2">Nicht das richtige Auto dabei?</h2><p className="mt-4 text-foreground/80">Schreiben Sie uns, was Sie suchen. Wir melden uns, wenn ein passendes Auto hereinkommt.</p><div className="mt-8"><SearchRequestForm /></div></div>
      <p className="mt-10 text-xs leading-5 text-muted-foreground">Alle Preise sind Endpreise in Euro. Zulassung und Überführung sind nicht enthalten und werden nur auf Wunsch gegen gesonderte Berechnung übernommen. Zwischenverkauf und Irrtum vorbehalten.</p>
    </Reveal>
  </>;
}
