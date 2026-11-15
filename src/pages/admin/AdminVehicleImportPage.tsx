import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { insertVehicles, listAdminVehicles, slugify, uniqueSlug } from "@/lib/admin";
import type { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Field = "brand" | "model" | "price" | "first_registration" | "mileage" | "fuel" | "transmission" | "power" | "color" | "features" | "description" | "images" | "body_type";
const FIELDS: { key: Field; label: string; match: RegExp }[] = [
  { key: "brand", label: "Marke", match: /^(marke|make|hersteller)/i },
  { key: "model", label: "Modell", match: /^(modell|model)(?!.*beschr)/i },
  { key: "price", label: "Preis", match: /preis|price/i },
  { key: "first_registration", label: "Erstzulassung", match: /erstzul|first.?reg|^ez$/i },
  { key: "mileage", label: "Kilometer", match: /kilomet|km|laufleist|mileage/i },
  { key: "fuel", label: "Kraftstoff", match: /kraftstoff|fuel|treibstoff/i },
  { key: "transmission", label: "Getriebe", match: /getriebe|gearbox|transmission/i },
  { key: "power", label: "Leistung", match: /leistung|power|ps|kw/i },
  { key: "color", label: "Farbe", match: /farbe|colou?r/i },
  { key: "features", label: "Ausstattung", match: /ausstatt|feature|extras/i },
  { key: "description", label: "Beschreibung", match: /beschreib|descr|bemerk/i },
  { key: "images", label: "Bild-URLs", match: /bild|image|foto|photo/i },
  { key: "body_type", label: "Karosserie", match: /karosser|kategorie|category|body/i },
];

function parseCsv(text: string): string[][] {
  const first = text.split(/\r?\n/)[0] ?? "";
  const delim = (first.match(/;/g)?.length ?? 0) >= (first.match(/,/g)?.length ?? 0) ? ";" : (first.includes("\t") ? "\t" : ",");
  const rows: string[][] = []; let row: string[] = []; let cell = ""; let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; continue; }
    if (c === '"') q = true;
    else if (c === delim) { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(cell); if (row.some((x) => x.trim())) rows.push(row); row = []; cell = ""; }
    else cell += c;
  }
  row.push(cell); if (row.some((x) => x.trim())) rows.push(row);
  return rows.map((r) => r.map((x) => x.replace(/^\ufeff/, "").trim()));
}
const num = (s = "") => { const n = parseInt(s.replace(/[^\d]/g, ""), 10); return Number.isFinite(n) ? n : NaN; };
function parseDate(s = ""): string | null {
  const m = s.match(/(\d{1,2})[./-](\d{4})/) ?? s.match(/(\d{4})-(\d{1,2})/);
  if (!m) { const y = s.match(/\d{4}/); return y ? `${y[0]}-01-01` : null; }
  const [a, b] = m[1]!.length === 4 ? [m[2]!, m[1]!] : [m[1]!, m[2]!];
  return `${b}-${a.padStart(2, "0")}-01`;
}
const fuelOf = (s = ""): Database["public"]["Enums"]["fuel_type"] => /diesel/i.test(s) ? "diesel" : /elektr|electric/i.test(s) ? "elektro" : /hybrid/i.test(s) ? "hybrid" : /gas|lpg|cng/i.test(s) ? "gas" : "benzin";
const gearOf = (s = ""): Database["public"]["Enums"]["gearbox"] => /schalt|manu/i.test(s) ? "schaltung" : "automatik";

export default function AdminVehicleImportPage() {
  const qc = useQueryClient();
  const [rows, setRows] = useState<string[][]>([]);
  const [map, setMap] = useState<Partial<Record<Field, number>>>({});
  const [busy, setBusy] = useState(false);
  const [report, setReport] = useState<{ ok: number; dup: number; invalid: number } | null>(null);
  const header = rows[0] ?? [];
  const body = rows.slice(1);

  const onFile = async (file?: File) => {
    if (!file) return;
    const parsed = parseCsv(await file.text());
    setRows(parsed); setReport(null);
    const m: Partial<Record<Field, number>> = {};
    FIELDS.forEach((f) => { const idx = (parsed[0] ?? []).findIndex((h, i) => f.match.test(h) && !Object.values(m).includes(i)); if (idx >= 0) m[f.key] = idx; });
    setMap(m);
  };
  const get = (r: string[], k: Field) => (map[k] !== undefined ? r[map[k]!] ?? "" : "");

  const mapped = useMemo(() => body.map((r) => {
    const brand = get(r, "brand"), model = get(r, "model"), price = num(get(r, "price")), fr = parseDate(get(r, "first_registration")), km = num(get(r, "mileage"));
    const powerRaw = get(r, "power"); const p = num(powerRaw.split(/[(/]/)[0]);
    const ps = Number.isFinite(p) ? (/kw/i.test(powerRaw) && !/ps/i.test(powerRaw) ? Math.round(p / 0.7355) : p) : null;
    const valid = !!brand && !!model && price > 0 && !!fr && Number.isFinite(km);
    return { valid, row: {
      brand, model, title: `${brand} ${model}`.trim(), price_eur: price, first_registration: fr ?? "", mileage_km: km, fuel: fuelOf(get(r, "fuel")), transmission: gearOf(get(r, "transmission")),
      power_ps: ps, power_kw: ps ? Math.round(ps * 0.7355) : null, color: get(r, "color") || null, body_type: get(r, "body_type") || "Limousine",
      features: get(r, "features").split(/[;,|]/).map((s) => s.trim()).filter(Boolean), description: get(r, "description") || null,
      images: get(r, "images").split(/[;,|\s]+/).filter((u) => /^https?:\/\//.test(u)).map((url, sort) => ({ url, alt: `${brand} ${model}`, sort })),
    } };
  }), [body, map]); // eslint-disable-line react-hooks/exhaustive-deps

  const run = async () => {
    setBusy(true);
    try {
      const existing = await listAdminVehicles();
      const key = (b: string, m: string, fr: string, km: number) => `${b.toLowerCase()}|${m.toLowerCase()}|${fr.slice(0, 7)}|${km}`;
      const seen = new Set(existing.map((v) => key(v.brand, v.model, v.first_registration, v.mileage_km)));
      const taken = new Set<string>(); const out: Database["public"]["Tables"]["vehicles"]["Insert"][] = [];
      let dup = 0, invalid = 0;
      for (const { valid, row } of mapped) {
        if (!valid) { invalid++; continue; }
        const k = key(row.brand, row.model, row.first_registration, row.mileage_km);
        if (seen.has(k)) { dup++; continue; }
        seen.add(k);
        const slug = await uniqueSlug(`${row.title}-${row.first_registration.slice(0, 4)}`, taken); taken.add(slug);
        out.push({ ...row, slug: slug || slugify(row.title), status: "verfuegbar", is_demo: false });
      }
      for (let i = 0; i < out.length; i += 50) await insertVehicles(out.slice(i, i + 50));
      setReport({ ok: out.length, dup, invalid });
      await qc.invalidateQueries({ queryKey: ["admin"] }); await qc.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success(`${out.length} Fahrzeuge importiert.`);
    } catch { toast.error("Import fehlgeschlagen."); } finally { setBusy(false); }
  };

  return (
    <div>
      <Link to="/admin/fahrzeuge" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-tiffany-300"><ArrowLeft className="size-4" /> Zurück zur Liste</Link>
      <h1 className="mb-2 font-display text-2xl font-extrabold uppercase tracking-wide">CSV importieren</h1>
      <p className="mb-6 text-sm text-muted-foreground">mobile.de-Export oder eigene CSV (Trennzeichen ; oder ,). Duplikate werden über Marke + Modell + EZ + km erkannt.</p>
      <input type="file" accept=".csv,text/csv" onChange={(e) => void onFile(e.target.files?.[0])} className="mb-6 block text-sm file:mr-4 file:h-12 file:rounded-md file:border-0 file:bg-muted file:px-4 file:text-foreground" />
      {header.length ? <>
        <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wide">Spalten-Zuordnung</h2>
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FIELDS.map((f) => (
            <div key={f.key} className="space-y-1"><p className="text-xs text-muted-foreground">{f.label}</p>
              <Select value={map[f.key]?.toString() ?? "-"} onValueChange={(v) => setMap((m) => ({ ...m, [f.key]: v === "-" ? undefined : Number(v) }))}>
                <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="-">– nicht zuordnen –</SelectItem>{header.map((h, i) => <SelectItem key={i} value={String(i)}>{h || `Spalte ${i + 1}`}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          ))}
        </div>
        <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wide">Vorschau ({body.length} Zeilen, {mapped.filter((m) => m.valid).length} gültig)</h2>
        <div className="mb-6 max-h-96 overflow-auto rounded-lg border border-border bg-card">
          <Table>
            <TableHeader><TableRow><TableHead>Gültig</TableHead><TableHead>Marke</TableHead><TableHead>Modell</TableHead><TableHead>Preis</TableHead><TableHead>EZ</TableHead><TableHead>km</TableHead><TableHead>Kraftstoff</TableHead><TableHead>PS</TableHead><TableHead>Bilder</TableHead></TableRow></TableHeader>
            <TableBody>{mapped.slice(0, 50).map(({ valid, row }, i) => (
              <TableRow key={i}><TableCell>{valid ? "✓" : "✗"}</TableCell><TableCell>{row.brand}</TableCell><TableCell>{row.model}</TableCell><TableCell>{Number.isFinite(row.price_eur) ? row.price_eur : "–"}</TableCell><TableCell>{row.first_registration.slice(0, 7)}</TableCell><TableCell>{Number.isFinite(row.mileage_km) ? row.mileage_km : "–"}</TableCell><TableCell>{row.fuel}</TableCell><TableCell>{row.power_ps ?? "–"}</TableCell><TableCell>{row.images.length}</TableCell></TableRow>
            ))}</TableBody>
          </Table>
        </div>
        <Button variant="brand" onClick={run} disabled={busy || !mapped.some((m) => m.valid)}>{busy ? "Import läuft …" : "Import starten"}</Button>
      </> : null}
      {report ? <div className="mt-6 rounded-lg border border-primary/50 bg-card p-5 text-sm"><p className="font-semibold">Ergebnis</p><p>{report.ok} importiert · {report.dup} Duplikate übersprungen · {report.invalid} ungültige Zeilen</p></div> : null}
    </div>
  );
}
