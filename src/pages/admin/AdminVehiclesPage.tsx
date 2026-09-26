import { sizedImage } from "@/lib/vehicleImages";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { Plus, Search, Star, Upload } from "lucide-react";
import { toast } from "sonner";
import { listAdminVehicles, updateVehicle, VEHICLE_STATUSES, type AdminVehicle, type VehicleStatus } from "@/lib/admin";
import { formatFirstRegistration, formatKm, formatPrice } from "@/lib/format";
import { DemoBadge, ErrorBox, PageTitle, TableSkeleton, VehicleStatusBadge } from "@/components/admin/common";
import { VehicleImg } from "@/components/vehicles/VehicleImg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

type Img = { url: string; thumbUrl?: string };

export default function AdminVehiclesPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({ queryKey: ["admin", "vehicles"], queryFn: listAdminVehicles });
  const [q, setQ] = useState("");
  const [brokenImages, setBrokenImages] = useState<Set<string>>(() => new Set());
  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (data ?? []).filter((v) => !s || `${v.title} ${v.brand} ${v.model}`.toLowerCase().includes(s));
  }, [data, q]);

  const patch = async (v: AdminVehicle, p: Partial<Pick<AdminVehicle, "status" | "is_highlight">>, msg: string) => {
    await qc.cancelQueries({ queryKey: ["admin", "vehicles"] });
    qc.setQueryData<AdminVehicle[]>(["admin", "vehicles"], (old) => old?.map((x) => (x.id === v.id ? { ...x, ...p } : x)));
    try { await updateVehicle(v.id, p); toast.success(msg); void qc.invalidateQueries({ queryKey: ["vehicles"] }); }
    catch { toast.error("Änderung fehlgeschlagen."); }
    void qc.invalidateQueries({ queryKey: ["admin", "vehicles"] });
  };

  return (
    <div>
      <PageTitle title="Fahrzeuge">
        <Button asChild variant="silver"><Link to="/admin/fahrzeuge/import"><Upload className="size-4" /> CSV importieren</Link></Button>
        <Button asChild variant="gold"><Link to="/admin/fahrzeuge/neu"><Plus className="size-4" /> Neues Fahrzeug</Link></Button>
      </PageTitle>
      <div className="relative mb-4 max-w-sm"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Titel, Marke, Modell" className="h-10 pl-9" aria-label="Suche" /></div>
      {error ? <ErrorBox error={error} /> : isLoading ? <TableSkeleton /> : (
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader><TableRow><TableHead className="w-20">Bild</TableHead><TableHead>Titel</TableHead><TableHead>Preis</TableHead><TableHead>EZ</TableHead><TableHead>km</TableHead><TableHead>Status</TableHead><TableHead>Highlight</TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.length === 0 ? <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">Keine Fahrzeuge gefunden.</TableCell></TableRow> : rows.map((v) => {
                const images = v.images as Img[] | null;
                const img = images?.[v.cover_index ?? 0] ?? images?.[0];
                return (
                  <TableRow key={v.id} className="cursor-pointer" onClick={() => navigate({ to: "/admin/fahrzeuge/$id", params: { id: v.id } })}>
                     <TableCell><div className="h-12 w-16 overflow-hidden rounded bg-muted">{img ? <VehicleImg src={sizedImage(img.thumbUrl || img.url, "card")} alt="" width="64" height="48" loading="lazy" onError={() => setBrokenImages((previous) => new Set(previous).add(v.id))} className="size-full object-cover" /> : null}</div></TableCell>
                     <TableCell><span className="font-medium">{v.title}</span> {v.is_demo ? <DemoBadge /> : null}{brokenImages.has(v.id) ? <span className="mt-1 block text-xs font-semibold text-destructive">Bild nicht erreichbar</span> : null}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatPrice(v.price_eur)}</TableCell>
                    <TableCell>{formatFirstRegistration(v.first_registration)}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatKm(v.mileage_km)}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Select value={v.status} onValueChange={(s) => patch(v, { status: s as VehicleStatus }, "Status geändert.")}>
                        <SelectTrigger className="h-9 w-36 border-none bg-transparent px-0" aria-label={`Status ${v.title}`}><VehicleStatusBadge status={v.status} /></SelectTrigger>
                        <SelectContent>{VEHICLE_STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <button type="button" aria-label={v.is_highlight ? "Highlight entfernen" : "Als Highlight markieren"} onClick={() => patch(v, { is_highlight: !v.is_highlight }, v.is_highlight ? "Highlight entfernt." : "Als Highlight markiert.")} className="p-2">
                        <Star className={cn("size-5", v.is_highlight ? "fill-gold text-gold" : "text-muted-foreground")} />
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
