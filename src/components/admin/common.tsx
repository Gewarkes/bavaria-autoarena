import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { LEAD_STATUSES, VEHICLE_STATUSES, type LeadStatus, type VehicleStatus } from "@/lib/admin";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const leadTone: Record<LeadStatus, string> = {
  neu: "border-gold/60 bg-gold/15 text-gold-light", kontaktiert: "border-silver/50 bg-silver/10 text-foreground",
  termin: "border-warning/60 bg-warning/15 text-warning", angebot: "border-warning/60 bg-warning/10 text-warning",
  abgeschlossen: "border-success/60 bg-success/15 text-success", abgelehnt: "border-border bg-muted text-muted-foreground",
};
const vehTone: Record<VehicleStatus, string> = {
  verfuegbar: "border-success/60 bg-success/15 text-success", reserviert: "border-warning/60 bg-warning/15 text-warning", verkauft: "border-border bg-muted text-muted-foreground",
};
const pill = "inline-flex items-center whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-semibold";

export const LeadBadge = ({ status }: { status: LeadStatus }) => <span className={cn(pill, leadTone[status])}>{LEAD_STATUSES.find((s) => s.value === status)?.label}</span>;
export const VehicleStatusBadge = ({ status }: { status: VehicleStatus }) => <span className={cn(pill, vehTone[status])}>{VEHICLE_STATUSES.find((s) => s.value === status)?.label}</span>;
export const DemoBadge = () => <span className={cn(pill, "border-silver/40 text-silver")}>Demo</span>;

export function PageTitle({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <h1 className="font-display text-2xl font-extrabold uppercase tracking-wide text-foreground">{title}</h1>
      {children ? <div className="flex flex-wrap gap-2">{children}</div> : null}
    </div>
  );
}

export function StatusChips({ value, onChange }: { value: LeadStatus | "alle"; onChange: (v: LeadStatus | "alle") => void }) {
  const all = [{ value: "alle" as const, label: "Alle" }, ...LEAD_STATUSES];
  return (
    <div className="flex flex-wrap gap-2">
      {all.map((s) => <button key={s.value} type="button" onClick={() => onChange(s.value)} className={cn("h-9 rounded-full border px-4 text-sm", value === s.value ? "border-gold bg-gold/15 text-gold-light" : "border-border text-muted-foreground hover:border-gold/50")}>{s.label}</button>)}
    </div>
  );
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return <div className="space-y-2">{Array.from({ length: rows }, (_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>;
}

export function ErrorBox({ error }: { error: unknown }) {
  return <p className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">Daten konnten nicht geladen werden{error instanceof Error ? `: ${error.message}` : "."}</p>;
}

/** Status-Select + interne Notiz, gemeinsam für beide Lead-Typen. */
export function LeadEditor({ status, notes, onSave, extra }: {
  status: LeadStatus; notes: string | null;
  onSave: (patch: { status?: LeadStatus; internal_notes?: string | null }) => Promise<void>;
  extra?: ReactNode;
}) {
  const [text, setText] = useState(notes ?? "");
  const [busy, setBusy] = useState(false);
  useEffect(() => setText(notes ?? ""), [notes]);
  const run = async (patch: Parameters<typeof onSave>[0], msg: string) => {
    setBusy(true);
    try { await onSave(patch); toast.success(msg); } catch { toast.error("Speichern fehlgeschlagen."); } finally { setBusy(false); }
  };
  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-5">
      <div className="space-y-2">
        <Label>Status</Label>
        <Select value={status} onValueChange={(v) => run({ status: v as LeadStatus }, "Status gespeichert.")}>
          <SelectTrigger aria-label="Status"><SelectValue /></SelectTrigger>
          <SelectContent>{LEAD_STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      {extra}
      <div className="space-y-2">
        <Label htmlFor="notes">Interne Notiz</Label>
        <Textarea id="notes" rows={5} value={text} onChange={(e) => setText(e.target.value)} maxLength={4000} />
        <Button variant="gold" disabled={busy} onClick={() => run({ internal_notes: text.trim() || null }, "Notiz gespeichert.")}>Notiz speichern</Button>
      </div>
    </div>
  );
}

export const waLink = (phone: string) => `https://wa.me/${phone.replace(/\D/g, "").replace(/^0/, "49")}`;
