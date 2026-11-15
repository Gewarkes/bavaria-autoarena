import { useEffect, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Mail, MessageCircle, Phone, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { deleteTradeIn, fmtDateTime, getTradeIn, INTENT_LABEL, updateTradeIn } from "@/lib/admin";
import { formatKm, formatPrice } from "@/lib/format";
import { ErrorBox, LeadBadge, LeadEditor, TableSkeleton, waLink } from "@/components/admin/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const yn = (b: boolean | null) => (b == null ? "–" : b ? "Ja" : "Nein");

function Group({ title, rows }: { title: string; rows: [string, ReactNode][] }) {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <h2 className="mb-3 font-display text-xs font-bold uppercase tracking-wide text-primary">{title}</h2>
      <dl className="grid grid-cols-[10rem_1fr] gap-x-4 gap-y-2 text-sm">
        {rows.map(([k, v]) => <div key={k} className="contents"><dt className="text-muted-foreground">{k}</dt><dd className="break-words">{v || "–"}</dd></div>)}
      </dl>
    </section>
  );
}

function Photos({ paths }: { paths: string[] }) {
  const [urls, setUrls] = useState<string[]>([]);
  useEffect(() => {
    let alive = true;
    // Privater Bucket: ausschließlich Signed URLs (1 Stunde)
    void Promise.all(paths.map((p) => supabase.storage.from("trade-in-photos").createSignedUrl(p, 3600).then((r) => r.data?.signedUrl ?? "")))
      .then((u) => alive && setUrls(u.filter(Boolean)));
    return () => { alive = false; };
  }, [paths]);
  if (!paths.length) return <p className="text-sm text-muted-foreground">Keine Fotos hochgeladen.</p>;
  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{urls.map((u, i) => <a key={u} href={u} target="_blank" rel="noreferrer" className="block aspect-4/3 overflow-hidden rounded-md border border-border"><img src={u} alt={`Foto ${i + 1}`} width="400" height="300" loading="lazy" className="size-full object-cover" /></a>)}</div>;
}

export default function AdminTradeInDetailPage({ id }: { id: string }) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { data: r, isLoading, error } = useQuery({ queryKey: ["admin", "tradein", id], queryFn: () => getTradeIn(id) });
  const wish = useQuery({
    queryKey: ["admin", "vehicle-title", r?.desired_vehicle_id], enabled: !!r?.desired_vehicle_id,
    queryFn: async () => (await supabase.from("vehicles").select("title, slug").eq("id", r!.desired_vehicle_id!).maybeSingle()).data,
  });
  const [valuation, setValuation] = useState("");
  useEffect(() => setValuation(r?.internal_valuation_eur?.toString() ?? ""), [r?.internal_valuation_eur]);

  if (error) return <ErrorBox error={error} />;
  if (isLoading) return <TableSkeleton />;
  if (!r) return <p className="text-muted-foreground">Anfrage nicht gefunden.</p>;

  const save = async (patch: Parameters<typeof updateTradeIn>[1]) => {
    await updateTradeIn(id, patch);
    await qc.invalidateQueries({ queryKey: ["admin"] });
  };
  const saveValuation = async () => {
    const n = valuation.trim() === "" ? null : Math.round(Number(valuation.replace(/\D/g, "")));
    if (n !== null && (!Number.isFinite(n) || n < 0)) { toast.error("Bitte eine gültige Zahl eingeben."); return; }
    try { await save({ internal_valuation_eur: n }); toast.success("Bewertung gespeichert."); } catch { toast.error("Speichern fehlgeschlagen."); }
  };
  const remove = async () => {
    try { await deleteTradeIn(id, r.photo_paths); await qc.invalidateQueries({ queryKey: ["admin"] }); toast.success("Anfrage gelöscht."); navigate({ to: "/admin/inzahlungnahme" }); }
    catch { toast.error("Löschen fehlgeschlagen."); }
  };

  return (
    <div>
      <Link to="/admin/inzahlungnahme" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-tiffany-300"><ArrowLeft className="size-4" /> Zurück zur Liste</Link>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-2xl font-extrabold uppercase tracking-wide">{r.first_name} {r.last_name}</h1>
        <LeadBadge status={r.status} />
        <span className="text-sm text-muted-foreground">{fmtDateTime(r.created_at)}</span>
      </div>
      <div className="grid gap-5 xl:grid-cols-[1fr_22rem]">
        <div className="space-y-5">
          <Group title="Fahrzeug" rows={[["Marke / Modell", `${r.brand} ${r.model}`], ["Erstzulassung", r.first_registration_year], ["Kilometer", formatKm(r.mileage_km)], ["Kraftstoff", r.fuel], ["Getriebe", r.transmission], ["Variante", r.engine_variant], ["Unfallstatus", r.accident_status]]} />
          <Group title="Zustand" rows={[["Außen", r.condition_exterior], ["Innen", r.condition_interior], ["HU bis", r.hu_until], ["Vorbesitzer", r.previous_owners], ["Scheckheft", r.service_book], ["Schäden", r.damage_notes], ["Finanzierung aktiv", yn(r.financing_active)]]} />
          <Group title="Wunsch" rows={[["Absicht", INTENT_LABEL[r.intent] ?? r.intent], ["Wunschfahrzeug", r.desired_vehicle_id ? (wish.data ? <Link to="/fahrzeuge/$slug" params={{ slug: wish.data.slug }} target="_blank" className="text-primary underline">{wish.data.title}</Link> : "Fahrzeug nicht mehr verfügbar") : null]]} />
          <Group title="Kontakt" rows={[
            ["Telefon", r.phone ? <span className="flex flex-wrap gap-3"><a className="inline-flex items-center gap-1 text-primary underline" href={`tel:${r.phone}`}><Phone className="size-3.5" />{r.phone}</a><a className="inline-flex items-center gap-1 text-primary underline" href={waLink(r.phone)} target="_blank" rel="noreferrer"><MessageCircle className="size-3.5" />WhatsApp</a></span> : null],
            ["E-Mail", r.email ? <a className="inline-flex items-center gap-1 text-primary underline" href={`mailto:${r.email}`}><Mail className="size-3.5" />{r.email}</a> : null],
            ["PLZ", r.zip], ["Bevorzugter Kontaktweg", r.contact_channel], ["Werbekontakt", yn(r.marketing_opt_in)], ["Datenschutzhinweis", r.privacy_notice_version],
          ]} />
          <section className="rounded-lg border border-border bg-card p-5"><h2 className="mb-3 font-display text-xs font-bold uppercase tracking-wide text-primary">Fotos</h2><Photos paths={r.photo_paths} /></section>
        </div>
        <div className="space-y-5">
          <LeadEditor status={r.status} notes={r.internal_notes} onSave={save} extra={
            <div className="space-y-2">
              <Label htmlFor="val">Interne Bewertung (€)</Label>
              <div className="flex gap-2"><Input id="val" inputMode="numeric" value={valuation} onChange={(e) => setValuation(e.target.value)} className="h-12" placeholder="z. B. 12500" /><Button variant="plain" onClick={saveValuation}>Speichern</Button></div>
              {r.internal_valuation_eur != null ? <p className="text-xs text-muted-foreground">Aktuell: {formatPrice(r.internal_valuation_eur)}</p> : null}
            </div>
          } />
          <AlertDialog>
            <AlertDialogTrigger asChild><Button variant="destructive" className="w-full"><Trash2 className="size-4" /> Löschen</Button></AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader><AlertDialogTitle>Anfrage endgültig löschen?</AlertDialogTitle><AlertDialogDescription>Die Anfrage und alle {r.photo_paths.length} Fotos werden unwiderruflich entfernt.</AlertDialogDescription></AlertDialogHeader>
              <AlertDialogFooter><AlertDialogCancel>Abbrechen</AlertDialogCancel><AlertDialogAction onClick={remove}>Löschen</AlertDialogAction></AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
