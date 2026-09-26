import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { listAllTestimonials, type TestimonialRow } from "@/lib/admin";
import { ErrorBox, PageTitle, TableSkeleton } from "@/components/admin/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const schema = z.object({ author: z.string().trim().min(2, "Autor fehlt.").max(80), text: z.string().trim().min(10, "Text zu kurz.").max(1500), rating: z.number().int().min(1).max(5), source: z.string().trim().min(2).max(60) });
type Draft = { id?: string; author: string; text: string; rating: number; source: string; approved_at: string };

export default function AdminTestimonialsPage() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ["admin", "testimonials"], queryFn: listAllTestimonials });
  const [draft, setDraft] = useState<Draft | null>(null);
  const refresh = async () => { await qc.invalidateQueries({ queryKey: ["admin", "testimonials"] }); await qc.invalidateQueries({ queryKey: ["testimonials"] }); };
  const run = async (fn: () => PromiseLike<{ error: unknown }>, msg: string) => {
    const { error: e } = await fn();
    if (e) toast.error("Speichern fehlgeschlagen."); else { toast.success(msg); await refresh(); }
  };
  const move = async (idx: number, dir: -1 | 1) => {
    const list = [...(data ?? [])]; const j = idx + dir; if (!list[j]) return;
    [list[idx], list[j]] = [list[j]!, list[idx]!];
    await Promise.all(list.map((t, i) => supabase.from("testimonials").update({ sort_order: i }).eq("id", t.id)));
    await refresh();
  };
  const save = async () => {
    if (!draft) return;
    const p = schema.safeParse(draft);
    if (!p.success) { toast.error(p.error.issues[0]?.message ?? "Bitte Eingaben prüfen."); return; }
    const row = { ...p.data, approved_at: draft.approved_at || null };
    await run(() => draft.id ? supabase.from("testimonials").update(row).eq("id", draft.id) : supabase.from("testimonials").insert({ ...row, sort_order: data?.length ?? 0, is_visible: false }), "Kundenstimme gespeichert.");
    setDraft(null);
  };
  const edit = (t: TestimonialRow) => setDraft({ id: t.id, author: t.author, text: t.text, rating: t.rating ?? 5, source: t.source, approved_at: t.approved_at ?? "" });

  return (
    <div className="max-w-4xl">
      <PageTitle title="Kundenstimmen"><Button variant="gold" onClick={() => setDraft({ author: "", text: "", rating: 5, source: "mobile.de", approved_at: "" })}><Plus className="size-4" /> Neue Kundenstimme</Button></PageTitle>
      <p className="mb-6 rounded-md border border-warning/50 bg-warning/10 p-3 text-sm text-warning">Nur mit Zustimmung des Verfassers veröffentlichen.</p>
      {error ? <ErrorBox error={error} /> : isLoading ? <TableSkeleton rows={3} /> : (
        <div className="space-y-3">
          {(data ?? []).map((t, i) => (
            <div key={t.id} className="flex gap-4 rounded-lg border border-border bg-card p-4">
              <div className="flex flex-col gap-1"><Button variant="ghost" size="sm" aria-label="Nach oben" disabled={i === 0} onClick={() => move(i, -1)}><ArrowUp className="size-4" /></Button><Button variant="ghost" size="sm" aria-label="Nach unten" disabled={i === (data?.length ?? 0) - 1} onClick={() => move(i, 1)}><ArrowDown className="size-4" /></Button></div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{t.author} <span className="ml-2 inline-flex">{Array.from({ length: t.rating ?? 0 }, (_, k) => <Star key={k} className="size-3.5 fill-gold text-gold" />)}</span></p>
                <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{t.text}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t.source}{t.approved_at ? ` · Freigabe ${new Date(t.approved_at).toLocaleDateString("de-DE")}` : ""}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <label className="flex items-center gap-2 text-xs"><Switch checked={t.is_visible} onCheckedChange={(v) => run(() => supabase.from("testimonials").update({ is_visible: v }).eq("id", t.id), v ? "Sichtbar geschaltet." : "Ausgeblendet.")} /> Sichtbar</label>
                <div className="flex"><Button variant="ghost" size="sm" aria-label="Bearbeiten" onClick={() => edit(t)}><Pencil className="size-4" /></Button><Button variant="ghost" size="sm" aria-label="Löschen" onClick={() => window.confirm("Kundenstimme löschen?") && run(() => supabase.from("testimonials").delete().eq("id", t.id), "Gelöscht.")}><Trash2 className="size-4" /></Button></div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Dialog open={!!draft} onOpenChange={(o) => !o && setDraft(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{draft?.id ? "Kundenstimme bearbeiten" : "Neue Kundenstimme"}</DialogTitle></DialogHeader>
          {draft ? <div className="space-y-4">
            <div className="space-y-2"><Label>Autor</Label><Input value={draft.author} onChange={(e) => setDraft({ ...draft, author: e.target.value })} /></div>
            <div className="space-y-2"><Label>Text</Label><Textarea rows={5} value={draft.text} onChange={(e) => setDraft({ ...draft, text: e.target.value })} /></div>
            <div className="space-y-2"><Label>Sterne</Label><div className="flex gap-1">{[1, 2, 3, 4, 5].map((n) => <button key={n} type="button" aria-label={`${n} Sterne`} onClick={() => setDraft({ ...draft, rating: n })}><Star className={n <= draft.rating ? "size-6 fill-gold text-gold" : "size-6 text-muted-foreground"} /></button>)}</div></div>
            <div className="grid grid-cols-2 gap-3"><div className="space-y-2"><Label>Quelle</Label><Input value={draft.source} onChange={(e) => setDraft({ ...draft, source: e.target.value })} /></div><div className="space-y-2"><Label>Freigabe-Datum</Label><Input type="date" value={draft.approved_at} onChange={(e) => setDraft({ ...draft, approved_at: e.target.value })} /></div></div>
            <p className="text-xs text-warning">Nur mit Zustimmung des Verfassers veröffentlichen.</p>
            <Button variant="gold" className="w-full" onClick={save}>Speichern</Button>
          </div> : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
