import { useEffect, useState, type KeyboardEvent, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import imageCompression from "browser-image-compression";
import { ArrowLeft, GripVertical, ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { BODY_TYPES, getAdminVehicle, uniqueSlug, VEHICLE_STATUSES, type AdminVehicle } from "@/lib/admin";
import { VEHICLE_BUCKET, bucketPath, isExternal } from "@/lib/vehicleImages";
import { ErrorBox, TableSkeleton } from "@/components/admin/common";
import { VehicleImg } from "@/components/vehicles/VehicleImg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Img = { url: string; thumbUrl?: string | undefined; alt: string; sort: number };
type Form = {
  brand: string; model: string; variant: string; title: string; price: string; tax_status: AdminVehicle["tax_status"];
  month: string; year: string; km: string; fuel: AdminVehicle["fuel"]; transmission: AdminVehicle["transmission"]; ps: string;
  body_type: string; color: string; hu_until: string; previous_owners: string; features: string[]; description: string;
  status: AdminVehicle["status"]; is_highlight: boolean; is_demo: boolean; images: Img[];
};
const empty: Form = { brand: "", model: "", variant: "", title: "", price: "", tax_status: "differenz", month: "01", year: "", km: "", fuel: "benzin", transmission: "automatik", ps: "", body_type: "Limousine", color: "", hu_until: "", previous_owners: "", features: [], description: "", status: "verfuegbar", is_highlight: false, is_demo: false, images: [] };

const schema = z.object({
  brand: z.string().trim().min(1, "Marke fehlt."), model: z.string().trim().min(1, "Modell fehlt."), title: z.string().trim().min(3, "Titel fehlt."),
  price: z.coerce.number({ message: "Preis fehlt." }).int().min(1, "Preis fehlt."), year: z.coerce.number().int().min(1950, "EZ-Jahr fehlt.").max(2100),
  km: z.coerce.number({ message: "Kilometer fehlen." }).int().min(0),
});

const toForm = (v: AdminVehicle): Form => ({
  brand: v.brand, model: v.model, variant: v.variant ?? "", title: v.title, price: String(v.price_eur), tax_status: v.tax_status,
  month: v.first_registration.slice(5, 7), year: v.first_registration.slice(0, 4), km: String(v.mileage_km), fuel: v.fuel, transmission: v.transmission,
  ps: v.power_ps?.toString() ?? "", body_type: v.body_type, color: v.color ?? "", hu_until: v.hu_until ?? "", previous_owners: v.previous_owners?.toString() ?? "",
  features: v.features, description: v.description ?? "", status: v.status, is_highlight: v.is_highlight, is_demo: v.is_demo,
  images: ((v.images as Img[] | null) ?? []).map((i, idx) => ({ url: i.url, thumbUrl: i.thumbUrl, alt: i.alt ?? "", sort: idx })),
});

function F({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return <div className={`space-y-2 ${className ?? ""}`}><Label>{label}</Label>{children}</div>;
}
function Sel<T extends string>({ value, onChange, options, label }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[]; label: string }) {
  return <Select value={value} onValueChange={(v) => onChange(v as T)}><SelectTrigger aria-label={label} className="h-12"><SelectValue /></SelectTrigger><SelectContent>{options.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select>;
}

export default function AdminVehicleFormPage({ id }: { id?: string }) {
  const isNew = !id;
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [vehicleId] = useState(() => id ?? crypto.randomUUID());
  const existing = useQuery({ queryKey: ["admin", "vehicle", id], queryFn: () => getAdminVehicle(id!), enabled: !!id });
  const [f, setF] = useState<Form>(empty);
  const [titleTouched, setTitleTouched] = useState(!isNew);
  const [tag, setTag] = useState("");
  const [uploading, setUploading] = useState(0);
  const [busy, setBusy] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [removed, setRemoved] = useState<string[]>([]);

  useEffect(() => { if (existing.data) setF(toForm(existing.data)); }, [existing.data]);
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => {
    const n = { ...p, [k]: v };
    if (!titleTouched && (k === "brand" || k === "model" || k === "variant")) n.title = [n.brand, n.model, n.variant].map((s) => s.trim()).filter(Boolean).join(" ");
    return n;
  });
  const kw = f.ps ? Math.round(Number(f.ps) * 0.7355) : null;

  const addTag = () => { const t = tag.trim(); if (t && !f.features.includes(t)) set("features", [...f.features, t]); setTag(""); };
  const onTagKey = (e: KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } };

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    const list = [...files].filter((x) => x.type.startsWith("image/")).slice(0, 30);
    setUploading(list.length);
    const added: Img[] = [];
    for (const file of list) {
      try {
        const [full, thumb] = await Promise.all([
          imageCompression(file, { maxWidthOrHeight: 1600, fileType: "image/webp", initialQuality: 0.82, useWebWorker: true }),
          imageCompression(file, { maxWidthOrHeight: 480, fileType: "image/webp", initialQuality: 0.8, useWebWorker: true }),
        ]);
        const uid = crypto.randomUUID();
        const p1 = `${vehicleId}/${uid}.webp`, p2 = `${vehicleId}/${uid}-thumb.webp`;
        const up = async (p: string, b: Blob) => { const { error } = await supabase.storage.from(VEHICLE_BUCKET).upload(p, b, { contentType: "image/webp" }); if (error) throw error; };
        await up(p1, full); await up(p2, thumb);
        added.push({ url: `${VEHICLE_BUCKET}/${p1}`, thumbUrl: `${VEHICLE_BUCKET}/${p2}`, alt: f.title, sort: 0 });
      } catch { toast.error(`Bild „${file.name}“ konnte nicht hochgeladen werden.`); }
      setUploading((n) => n - 1);
    }
    setF((p) => ({ ...p, images: [...p.images, ...added].map((i, idx) => ({ ...i, sort: idx })) }));
  };
  const removeImg = (idx: number) => {
    const img = f.images[idx];
    if (img && !isExternal(img.url)) setRemoved((r) => [...r, bucketPath(img.url), ...(img.thumbUrl ? [bucketPath(img.thumbUrl)] : [])]);
    set("images", f.images.filter((_, i) => i !== idx).map((i, s) => ({ ...i, sort: s })));
  };
  const drop = (to: number) => {
    if (dragIdx === null || dragIdx === to) return;
    const arr = [...f.images]; const [m] = arr.splice(dragIdx, 1); arr.splice(to, 0, m!);
    set("images", arr.map((i, s) => ({ ...i, sort: s }))); setDragIdx(null);
  };

  const save = async () => {
    const parsed = schema.safeParse(f);
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "Bitte Eingaben prüfen."); return; }
    setBusy(true);
    const row = {
      brand: f.brand.trim(), model: f.model.trim(), variant: f.variant.trim() || null, title: f.title.trim(), price_eur: parsed.data.price, tax_status: f.tax_status,
      first_registration: `${parsed.data.year}-${f.month}-01`, mileage_km: parsed.data.km, fuel: f.fuel, transmission: f.transmission,
      power_ps: f.ps ? Number(f.ps) : null, power_kw: kw, body_type: f.body_type, color: f.color.trim() || null, hu_until: f.hu_until.trim() || null,
      previous_owners: f.previous_owners ? Number(f.previous_owners) : null, features: f.features, description: f.description.trim() || null,
      status: f.status, is_highlight: f.is_highlight, is_demo: f.is_demo, images: f.images,
    };
    try {
      if (isNew) {
        const { error } = await supabase.from("vehicles").insert({ ...row, id: vehicleId, slug: await uniqueSlug(row.title) });
        if (error) throw error;
      } else {
        const { error } = await supabase.from("vehicles").update(row).eq("id", vehicleId);
        if (error) throw error;
      }
      if (removed.length) await supabase.storage.from(VEHICLE_BUCKET).remove(removed);
      await qc.invalidateQueries({ queryKey: ["admin"] }); await qc.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success("Fahrzeug gespeichert.");
      navigate({ to: "/admin/fahrzeuge" });
    } catch { toast.error("Speichern fehlgeschlagen."); } finally { setBusy(false); }
  };

  if (existing.error) return <ErrorBox error={existing.error} />;
  if (id && existing.isLoading) return <TableSkeleton />;
  if (id && !existing.data) return <p className="text-muted-foreground">Fahrzeug nicht gefunden.</p>;

  const years = Array.from({ length: 40 }, (_, i) => String(new Date().getFullYear() - i));
  return (
    <div className="max-w-5xl">
      <Link to="/admin/fahrzeuge" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold"><ArrowLeft className="size-4" /> Zurück zur Liste</Link>
      <h1 className="mb-6 font-display text-2xl font-extrabold uppercase tracking-wide">{isNew ? "Neues Fahrzeug" : f.title}</h1>
      <div className="space-y-6">
        <section className="grid gap-4 rounded-lg border border-border bg-card p-5 sm:grid-cols-2 lg:grid-cols-3">
          <F label="Marke *"><Input className="h-12" value={f.brand} onChange={(e) => set("brand", e.target.value)} /></F>
          <F label="Modell *"><Input className="h-12" value={f.model} onChange={(e) => set("model", e.target.value)} /></F>
          <F label="Variante"><Input className="h-12" value={f.variant} onChange={(e) => set("variant", e.target.value)} /></F>
          <F label="Titel *" className="sm:col-span-2 lg:col-span-3"><Input className="h-12" value={f.title} onChange={(e) => { setTitleTouched(true); set("title", e.target.value); }} /></F>
          <F label="Preis (€) *"><Input className="h-12" inputMode="numeric" value={f.price} onChange={(e) => set("price", e.target.value.replace(/\D/g, ""))} /></F>
          <F label="Steuerstatus"><Sel label="Steuerstatus" value={f.tax_status} onChange={(v) => set("tax_status", v)} options={[{ value: "differenz", label: "Differenzbesteuert (§ 25a)" }, { value: "regel", label: "MwSt. ausweisbar" }]} /></F>
          <F label="Erstzulassung (Monat / Jahr) *"><div className="flex gap-2">
            <Sel label="Monat" value={f.month} onChange={(v) => set("month", v)} options={Array.from({ length: 12 }, (_, i) => { const m = String(i + 1).padStart(2, "0"); return { value: m, label: m }; })} />
            <Sel label="Jahr" value={f.year || "_"} onChange={(v) => set("year", v === "_" ? "" : v)} options={[{ value: "_", label: "Jahr" }, ...years.map((y) => ({ value: y, label: y }))]} />
          </div></F>
          <F label="Kilometer *"><Input className="h-12" inputMode="numeric" value={f.km} onChange={(e) => set("km", e.target.value.replace(/\D/g, ""))} /></F>
          <F label="Kraftstoff"><Sel label="Kraftstoff" value={f.fuel} onChange={(v) => set("fuel", v)} options={[{ value: "benzin", label: "Benzin" }, { value: "diesel", label: "Diesel" }, { value: "hybrid", label: "Hybrid" }, { value: "elektro", label: "Elektro" }, { value: "gas", label: "Gas" }]} /></F>
          <F label="Getriebe"><Sel label="Getriebe" value={f.transmission} onChange={(v) => set("transmission", v)} options={[{ value: "automatik", label: "Automatik" }, { value: "schaltung", label: "Schaltgetriebe" }]} /></F>
          <F label={`Leistung PS${kw ? ` (= ${kw} kW)` : ""}`}><Input className="h-12" inputMode="numeric" value={f.ps} onChange={(e) => set("ps", e.target.value.replace(/\D/g, ""))} /></F>
          <F label="Karosserie"><Sel label="Karosserie" value={f.body_type} onChange={(v) => set("body_type", v)} options={BODY_TYPES.map((b) => ({ value: b, label: b }))} /></F>
          <F label="Farbe"><Input className="h-12" value={f.color} onChange={(e) => set("color", e.target.value)} /></F>
          <F label="HU bis (MM/JJJJ)"><Input className="h-12" value={f.hu_until} maxLength={10} onChange={(e) => set("hu_until", e.target.value)} placeholder="z. B. 08/2027" /></F>
          <F label="Vorbesitzer"><Input className="h-12" inputMode="numeric" value={f.previous_owners} onChange={(e) => set("previous_owners", e.target.value.replace(/\D/g, ""))} /></F>
          <F label="Status"><Sel label="Status" value={f.status} onChange={(v) => set("status", v)} options={VEHICLE_STATUSES} /></F>
          <div className="flex items-center gap-6 pt-6">
            <label className="flex items-center gap-2 text-sm"><Switch checked={f.is_highlight} onCheckedChange={(v) => set("is_highlight", v)} /> Highlight</label>
            <label className="flex items-center gap-2 text-sm"><Switch checked={f.is_demo} onCheckedChange={(v) => set("is_demo", v)} /> Demo</label>
          </div>
        </section>
        <section className="space-y-4 rounded-lg border border-border bg-card p-5">
          <F label="Ausstattung (Enter zum Hinzufügen)">
            <div className="flex flex-wrap gap-2">{f.features.map((t) => <span key={t} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-sm">{t}<button type="button" aria-label={`${t} entfernen`} onClick={() => set("features", f.features.filter((x) => x !== t))}><X className="size-3.5" /></button></span>)}</div>
            <Input className="h-12" value={tag} onChange={(e) => setTag(e.target.value)} onKeyDown={onTagKey} onBlur={addTag} placeholder="z. B. Navigationssystem" />
          </F>
          <F label="Beschreibung"><Textarea rows={6} value={f.description} onChange={(e) => set("description", e.target.value)} /></F>
        </section>
        <section className="rounded-lg border border-border bg-card p-5">
          <div className="mb-3 flex items-center justify-between"><Label>Bilder (Reihenfolge per Drag & Drop, erstes Bild = Titelbild)</Label>
            <Button asChild variant="silver" size="sm"><label className="cursor-pointer"><ImagePlus className="size-4" /> Bilder hinzufügen<input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => { void upload(e.target.files); e.target.value = ""; }} /></label></Button>
          </div>
          {uploading > 0 ? <p className="mb-3 text-sm text-gold">{uploading} Bild(er) werden komprimiert und hochgeladen …</p> : null}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {f.images.map((img, i) => (
              <div key={img.url} draggable onDragStart={() => setDragIdx(i)} onDragOver={(e) => e.preventDefault()} onDrop={() => drop(i)} className="group relative aspect-4/3 cursor-move overflow-hidden rounded-md border border-border">
                <VehicleImg src={img.thumbUrl || img.url} alt={img.alt} width="240" height="180" loading="lazy" className="size-full object-cover" />
                <span className="absolute left-1 top-1 rounded bg-background/80 px-1.5 text-xs">{i + 1}</span>
                <GripVertical className="absolute bottom-1 left-1 size-4 text-foreground/70" />
                <button type="button" aria-label="Bild entfernen" onClick={() => removeImg(i)} className="absolute right-1 top-1 rounded bg-background/80 p-1"><X className="size-4" /></button>
              </div>
            ))}
          </div>
          {!f.images.length ? <p className="text-sm text-muted-foreground">Noch keine Bilder.</p> : null}
        </section>
        <div className="flex gap-3"><Button variant="gold" onClick={save} disabled={busy || uploading > 0}>{busy ? "Speichern …" : "Speichern"}</Button><Button asChild variant="ghost"><Link to="/admin/fahrzeuge">Abbrechen</Link></Button></div>
      </div>
    </div>
  );
}
