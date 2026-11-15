import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Camera, X, CarFront, Tag, Search, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { siteConfig } from "@/config/site";
import { vehiclesQuery } from "@/lib/vehicles";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  brandOptions, yearOptions, step1Schema, step2Schema, step3Schema, step4Schema, fieldErrors, submitTradeIn,
  compressPhoto, uploadPhoto, completeTradeIn, MIN_FUNNEL_MS, MAX_PHOTOS, type Step1, type Step2, type Step3,
} from "@/lib/tradeIn";

type Props = { initialBrand?: string | undefined; initialModel?: string | undefined; initialDesiredVehicleId?: string | undefined };
type Errors = Record<string, string>;
type Loose<T> = { [K in keyof T]?: T[K] | undefined };
type Photo = { id: string; file: File; preview: string; state: "wartet" | "laedt" | "fertig" | "fehler"; path?: string };

const phoneHref = `tel:${siteConfig.phone.replace(/\s/g, "")}`;

function Chips<T extends string>({ options, value, onChange, label }: { options: { value: T; label: string }[]; value: T | undefined; onChange: (v: T | undefined) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = value === o.value;
        return <button key={o.value} type="button" role="radio" aria-checked={active} onClick={() => onChange(active ? undefined : o.value)}
          className={cn("h-11 rounded border px-4 text-sm font-medium transition-colors", active ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground hover:border-primary")}>{o.label}</button>;
      })}
    </div>
  );
}

function ChoiceCards<T extends string>({ options, value, onChange, label, cols = 3 }: { options: { value: T; label: string; hint?: string; icon?: ReactNode }[]; value: T | undefined; onChange: (v: T) => void; label: string; cols?: number }) {
  return (
    <div role="radiogroup" aria-label={label} className={cn("grid gap-2", cols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2")}>
      {options.map((o) => {
        const active = value === o.value;
        return <button key={o.value} type="button" role="radio" aria-checked={active} onClick={() => onChange(o.value)}
          className={cn("flex min-h-14 items-center gap-3 rounded-lg border p-3 text-left transition-colors sm:flex-col sm:items-start", active ? "border-primary bg-primary/10" : "border-border bg-background hover:border-primary/50")}>
          {o.icon && <span className="text-primary">{o.icon}</span>}
          <span><span className="block text-sm font-semibold text-foreground">{o.label}</span>{o.hint && <span className="mt-0.5 block text-xs text-muted-foreground">{o.hint}</span>}</span>
          {active && <Check className="ml-auto size-4 text-primary sm:hidden" />}
        </button>;
      })}
    </div>
  );
}

function Field({ label, error, children, optional, id }: { label: string; error?: string | undefined; children: ReactNode; optional?: boolean; id?: string }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}{optional ? <span className="ml-1 normal-case tracking-normal text-muted-foreground/70">(optional)</span> : <span className="text-primary"> *</span>}</label>
      {children}
      {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
    </div>
  );
}

const conditionOptions = [{ value: "sehr_gut" as const, label: "Sehr gut" }, { value: "gut" as const, label: "Gut" }, { value: "gebrauchsspuren" as const, label: "Gebrauchsspuren" }];

export function TradeInWizard({ initialBrand, initialModel, initialDesiredVehicleId }: Props) {
  const navigate = useNavigate();
  const startedAt = useRef(Date.now());
  const topRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [requestId, setRequestId] = useState<string | null>(null);
  const [brandOpen, setBrandOpen] = useState(false);

  const initialBrandMatch = initialBrand ? brandOptions.find((b) => b.toLowerCase() === initialBrand.toLowerCase() || (initialBrand === "VW" && b === "Volkswagen")) ?? "Andere" : "";
  const [s1, setS1] = useState<Loose<Step1> & { mileageText: string }>({ brand: initialBrandMatch, model: initialModel ?? "", mileageText: "" });
  const [s2, setS2] = useState<Loose<Step2>>({ desiredVehicleId: initialDesiredVehicleId, intent: initialDesiredVehicleId ? "inzahlung" : undefined });
  const [s3, setS3] = useState({ firstName: "", lastName: "", phone: "", email: "", zip: "", channel: undefined as Step3["channel"], marketing: false });
  const [s4, setS4] = useState({ exterior: undefined as "sehr_gut" | "gut" | "gebrauchsspuren" | undefined, interior: undefined as "sehr_gut" | "gut" | "gebrauchsspuren" | undefined, huMonth: "", huYear: "", previousOwners: undefined as "1" | "2" | "3+" | undefined, serviceBook: undefined as "ja" | "nein" | "teilweise" | undefined, damageNotes: "" });
  const [photos, setPhotos] = useState<Photo[]>([]);

  const vehicles = useQuery({ ...vehiclesQuery({ sort: "preis-auf" }), enabled: s2.intent === "inzahlung" });
  useEffect(() => () => photos.forEach((p) => URL.revokeObjectURL(p.preview)), []); // eslint-disable-line react-hooks/exhaustive-deps

  function go(n: number) { setErrors({}); setStep(n); topRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }); }

  function finish() {
    navigate({ to: "/auto-verkaufen/danke", state: { tradeIn: { firstName: s3.firstName.trim(), channel: s3.channel ?? null, intent: s2.intent ?? "bewerten" } } });
  }

  function onStep1(e: FormEvent) {
    e.preventDefault();
    const km = s1.mileageText ? Number(s1.mileageText.replace(/\D/g, "")) : undefined;
    const r = step1Schema.safeParse({ ...s1, mileageKm: km });
    if (!r.success) return setErrors(fieldErrors(r.error));
    go(2);
  }
  function onStep2(e: FormEvent) {
    e.preventDefault();
    const r = step2Schema.safeParse(s2);
    if (!r.success) return setErrors(fieldErrors(r.error));
    go(3);
  }
  async function onStep3(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    const r3 = step3Schema.safeParse(s3);
    if (!r3.success) return setErrors(fieldErrors(r3.error));
    const r1 = step1Schema.parse({ ...s1, mileageKm: Number(s1.mileageText.replace(/\D/g, "")) });
    const r2 = step2Schema.parse(s2);
    const id = crypto.randomUUID();
    // Bots: pretend success without saving
    if (honeypot || Date.now() - startedAt.current < MIN_FUNNEL_MS) return finish();
    setBusy(true);
    const res = await submitTradeIn(id, r1, r2, r3.data);
    setBusy(false);
    if (!res.ok) return setSubmitError(res.reason === "rate_limited" ? `Zu viele Anfragen – bitte rufen Sie uns an: ${siteConfig.phone}` : `Das hat leider nicht geklappt. Bitte versuchen Sie es erneut oder rufen Sie uns an: ${siteConfig.phone}`);
    setRequestId(id);
    go(4);
  }

  function addFiles(list: FileList | null) {
    if (!list) return;
    const room = MAX_PHOTOS - photos.length;
    const next = Array.from(list).filter((f) => f.type.startsWith("image/")).slice(0, room).map((file) => ({ id: crypto.randomUUID(), file, preview: URL.createObjectURL(file), state: "wartet" as const }));
    if (list.length > room) setErrors((e) => ({ ...e, photos: `Maximal ${MAX_PHOTOS} Fotos möglich.` }));
    setPhotos((p) => [...p, ...next]);
  }
  function removePhoto(id: string) { setPhotos((p) => { const x = p.find((i) => i.id === id); if (x) URL.revokeObjectURL(x.preview); return p.filter((i) => i.id !== id); }); }

  async function onStep4(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    const r = step4Schema.safeParse({ ...s4, huUntil: s4.huMonth && s4.huYear ? `${s4.huYear}-${s4.huMonth}` : undefined });
    if (!r.success) return setErrors(fieldErrors(r.error));
    if (!requestId) return finish();
    setBusy(true);
    const paths: string[] = [];
    for (const p of photos) {
      if (p.path) { paths.push(p.path); continue; }
      setPhotos((all) => all.map((i) => (i.id === p.id ? { ...i, state: "laedt" } : i)));
      try {
        const blob = await compressPhoto(p.file);
        const path = await uploadPhoto(requestId, blob);
        paths.push(path);
        setPhotos((all) => all.map((i) => (i.id === p.id ? { ...i, state: "fertig", path } : i)));
      } catch {
        setPhotos((all) => all.map((i) => (i.id === p.id ? { ...i, state: "fehler" } : i)));
      }
    }
    const ok = await completeTradeIn(requestId, r.data, paths);
    setBusy(false);
    if (!ok) return setSubmitError(`Ihre Anfrage ist bei uns angekommen, die Zusatzangaben konnten aber nicht gespeichert werden. Gerne ergänzen Sie diese telefonisch: ${siteConfig.phone}`);
    finish();
  }

  const whatsappPhotos = useMemo(() => {
    const text = `Fotos zu meiner Anfrage ${s3.firstName} ${s3.lastName}, ${s1.brand ?? ""} ${s1.model ?? ""}`.replace(/\s+/g, " ").trim();
    return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(text)}`;
  }, [s3.firstName, s3.lastName, s1.brand, s1.model]);

  const titles = ["Ihr Fahrzeug", "Ihr Wunsch", "Ihre Kontaktdaten", "Zustand und Fotos"];
  const nav = (backTo?: number, label = "Weiter") => (
    <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
      {backTo ? <Button type="button" variant="ghost" onClick={() => go(backTo)}>Zurück</Button> : <span />}
      <Button type="submit" variant="brand" disabled={busy} className="w-full sm:w-auto sm:min-w-44">{busy && <Loader2 className="animate-spin" />}{label}</Button>
    </div>
  );

  return (
    <div ref={topRef} id="bewertung" className="scroll-mt-28 rounded-sm border border-border bg-card p-6 sm:p-10">
      <div className="mb-6">
        <div className="eyebrow flex items-baseline justify-between"><span className="text-primary">Schritt {step} von 4</span><span className="text-subtle">{titles[step - 1]}</span></div>
        <div className="mt-3 h-px overflow-hidden bg-border" role="progressbar" aria-valuemin={1} aria-valuemax={4} aria-valuenow={step} aria-label="Fortschritt">
          <div className="h-full bg-primary transition-all duration-500 motion-reduce:transition-none" style={{ width: `${step * 25}%` }} />
        </div>
      </div>

      {step === 1 && (
        <form onSubmit={onStep1} noValidate className="space-y-5">
           <h2 className="font-display text-[26px] font-light leading-tight text-foreground lg:text-[32px]">Ihr Auto</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Marke" error={errors["brand"]}>
              <Popover open={brandOpen} onOpenChange={setBrandOpen}>
                <PopoverTrigger asChild>
                  <Button type="button" variant="outline" role="combobox" aria-expanded={brandOpen} aria-label="Marke" className="h-12 w-full justify-between font-normal">{s1.brand || <span className="text-muted-foreground">Marke wählen</span>}<ChevronsUpDown className="opacity-50" /></Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                  <Command><CommandInput placeholder="Marke suchen …" /><CommandList><CommandEmpty>Keine Marke gefunden – wählen Sie „Andere“.</CommandEmpty><CommandGroup>
                    {brandOptions.map((b) => <CommandItem key={b} value={b} onSelect={() => { setS1({ ...s1, brand: b }); setBrandOpen(false); }}><Check className={cn("size-4", s1.brand === b ? "opacity-100" : "opacity-0")} />{b}</CommandItem>)}
                  </CommandGroup></CommandList></Command>
                </PopoverContent>
              </Popover>
            </Field>
            <Field label="Modell" error={errors["model"]} id="ti-model"><Input id="ti-model" className="h-12" enterKeyHint="next" value={s1.model ?? ""} onChange={(e) => setS1({ ...s1, model: e.target.value })} placeholder="z. B. Golf" maxLength={80} /></Field>
            <Field label="Erstzulassung (Jahr)" error={errors["year"]}>
              <Select value={s1.year ? String(s1.year) : ""} onValueChange={(v) => setS1({ ...s1, year: Number(v) })}>
                <SelectTrigger className="h-12" aria-label="Erstzulassung Jahr"><SelectValue placeholder="Jahr wählen" /></SelectTrigger>
                <SelectContent>{yearOptions.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Kilometerstand" error={errors["mileageKm"]} id="ti-km">
              <div className="relative"><Input id="ti-km" inputMode="numeric" enterKeyHint="next" className="h-12 pr-12" value={s1.mileageText} placeholder="z. B. 90.000"
                onChange={(e) => { const d = e.target.value.replace(/\D/g, "").slice(0, 7); setS1({ ...s1, mileageText: d ? Number(d).toLocaleString("de-DE") : "" }); }} />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">km</span></div>
            </Field>
          </div>
          <Field label="Kraftstoff" optional><Chips label="Kraftstoff" value={s1.fuel} onChange={(v) => setS1({ ...s1, fuel: v })} options={[{ value: "benzin", label: "Benzin" }, { value: "diesel", label: "Diesel" }, { value: "hybrid", label: "Hybrid" }, { value: "elektro", label: "Elektro" }, { value: "gas", label: "Gas" }]} /></Field>
          <Field label="Getriebe" optional><Chips label="Getriebe" value={s1.transmission} onChange={(v) => setS1({ ...s1, transmission: v })} options={[{ value: "schaltung", label: "Schaltung" }, { value: "automatik", label: "Automatik" }]} /></Field>
          <Field label="Motor / Variante" optional id="ti-variant"><Input id="ti-variant" className="h-12" value={s1.engineVariant ?? ""} onChange={(e) => setS1({ ...s1, engineVariant: e.target.value })} placeholder="z. B. 2.0 TDI Highline" maxLength={80} /></Field>
          <Field label="Unfallstatus" error={errors["accident"]}><ChoiceCards label="Unfallstatus" value={s1.accident} onChange={(v) => setS1({ ...s1, accident: v })} options={[{ value: "unfallfrei", label: "Unfallfrei" }, { value: "repariert", label: "Unfall repariert" }, { value: "schaden", label: "Unfallschaden vorhanden" }]} /></Field>
          {nav()}
        </form>
      )}

      {step === 2 && (
        <form onSubmit={onStep2} noValidate className="space-y-5">
           <h2 className="font-display text-[26px] font-light leading-tight text-foreground lg:text-[32px]">Was möchten Sie machen?</h2>
          <Field label="Was möchten Sie?" error={errors["intent"]}>
            <ChoiceCards label="Absicht" value={s2.intent} onChange={(v) => setS2({ ...s2, intent: v })} options={[
              { value: "inzahlung", label: "In Zahlung geben", hint: "Auf ein Fahrzeug aus unserem Bestand anrechnen", icon: <CarFront className="size-5" /> },
              { value: "verkaufen", label: "Nur verkaufen", hint: "Wir kaufen Ihr Auto an", icon: <Tag className="size-5" /> },
              { value: "bewerten", label: "Erst mal bewerten lassen", hint: "Unverbindlich den Wert erfahren", icon: <Search className="size-5" /> },
            ]} />
          </Field>
          {s2.intent === "inzahlung" && (
             <Field label="Ihr nächstes Auto" optional>
              <Select value={s2.desiredVehicleId ?? "keins"} onValueChange={(v) => setS2({ ...s2, desiredVehicleId: v === "keins" ? undefined : v })}>
                 <SelectTrigger className="h-12" aria-label="Ihr nächstes Auto"><SelectValue placeholder="Auto wählen" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="keins">Noch nicht entschieden</SelectItem>
                  {(vehicles.data ?? []).map((v) => <SelectItem key={v.id} value={v.id}>{v.title} – {formatPrice(v.price_eur)}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          )}
          <Field label="Läuft auf das Fahrzeug noch eine Finanzierung oder ein Leasing?" optional>
            <Chips label="Finanzierung" value={s2.financing} onChange={(v) => setS2({ ...s2, financing: v })} options={[{ value: "ja", label: "Ja" }, { value: "nein", label: "Nein" }, { value: "unbekannt", label: "Weiß nicht" }]} />
          </Field>
          {nav(1)}
        </form>
      )}

      {step === 3 && (
        <form onSubmit={onStep3} noValidate className="space-y-5">
          <h2 className="font-display text-[26px] font-light leading-tight text-foreground lg:text-[32px]">Ihre Kontaktdaten</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Vorname" error={errors["firstName"]} id="ti-fn"><Input id="ti-fn" autoComplete="given-name" enterKeyHint="next" className="h-12" value={s3.firstName} onChange={(e) => setS3({ ...s3, firstName: e.target.value })} maxLength={60} /></Field>
            <Field label="Nachname" error={errors["lastName"]} id="ti-ln"><Input id="ti-ln" autoComplete="family-name" enterKeyHint="next" className="h-12" value={s3.lastName} onChange={(e) => setS3({ ...s3, lastName: e.target.value })} maxLength={60} /></Field>
          </div>
          <p className="text-sm text-muted-foreground">Bitte geben Sie mindestens Telefon <em>oder</em> E-Mail an – dorthin senden wir Ihr Angebot.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Telefon" optional error={errors["phone"]} id="ti-phone"><Input id="ti-phone" type="tel" inputMode="tel" autoComplete="tel" enterKeyHint="next" className="h-12" value={s3.phone} onChange={(e) => setS3({ ...s3, phone: e.target.value })} maxLength={40} /></Field>
            <Field label="E-Mail" optional error={errors["email"]} id="ti-email"><Input id="ti-email" type="email" inputMode="email" autoComplete="email" enterKeyHint="next" className="h-12" value={s3.email} onChange={(e) => setS3({ ...s3, email: e.target.value })} maxLength={255} /></Field>
            <Field label="PLZ" optional error={errors["zip"]} id="ti-zip"><Input id="ti-zip" inputMode="numeric" autoComplete="postal-code" enterKeyHint="next" className="h-12" value={s3.zip} onChange={(e) => setS3({ ...s3, zip: e.target.value.replace(/\D/g, "").slice(0, 5) })} /></Field>
          </div>
          <Field label="Bevorzugter Kontaktweg" optional><Chips label="Kontaktweg" value={s3.channel} onChange={(v) => setS3({ ...s3, channel: v })} options={[{ value: "anruf", label: "Anruf" }, { value: "whatsapp", label: "WhatsApp" }, { value: "email", label: "E-Mail" }]} /></Field>
          <label className="flex min-h-11 cursor-pointer items-start gap-3 py-2 text-sm text-muted-foreground"><Checkbox className="mt-0.5" checked={s3.marketing} onCheckedChange={(c) => setS3({ ...s3, marketing: c === true })} />Ich möchte über passende Fahrzeuge und Aktionen per E-Mail oder WhatsApp informiert werden (jederzeit widerrufbar).</label>
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden"><input tabIndex={-1} autoComplete="off" name="hp_field" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} /></div>
          <p className="text-xs leading-5 text-muted-foreground">Mit dem Absenden verarbeiten wir Ihre Angaben zur Erstellung eines Angebots. Details in unserer <a href="/datenschutz" className="inline-flex min-h-11 items-center text-primary underline-offset-4 hover:underline">Datenschutzerklärung</a>.</p>
          {submitError && <p role="alert" className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-foreground">{submitError} <a href={phoneHref} className="text-primary underline">Jetzt anrufen</a></p>}
          {nav(2, "Anfrage absenden")}
        </form>
      )}

      {step === 4 && (
        <form onSubmit={onStep4} noValidate className="space-y-5">
          <div className="flex items-start gap-3 rounded-md border border-success/40 bg-success/10 p-3 text-sm text-foreground"><Check className="mt-0.5 size-4 shrink-0 text-success" />Ihre Anfrage ist bei uns eingegangen.</div>
          <h2 className="font-display text-[26px] font-light leading-tight text-foreground lg:text-[32px]">Fast geschafft – je mehr Angaben, desto genauer unser Angebot.</h2>
          <Field label="Zustand außen" optional><ChoiceCards label="Zustand außen" value={s4.exterior} onChange={(v) => setS4({ ...s4, exterior: v })} options={conditionOptions} /></Field>
          <Field label="Zustand innen" optional><ChoiceCards label="Zustand innen" value={s4.interior} onChange={(v) => setS4({ ...s4, interior: v })} options={conditionOptions} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="HU gültig bis" optional error={errors["huUntil"]}>
              <div className="grid grid-cols-2 gap-2">
                <Select value={s4.huMonth} onValueChange={(v) => setS4({ ...s4, huMonth: v })}><SelectTrigger className="h-12" aria-label="HU Monat"><SelectValue placeholder="Monat" /></SelectTrigger><SelectContent>{Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent></Select>
                <Select value={s4.huYear} onValueChange={(v) => setS4({ ...s4, huYear: v })}><SelectTrigger className="h-12" aria-label="HU Jahr"><SelectValue placeholder="Jahr" /></SelectTrigger><SelectContent>{[2025, 2026, 2027, 2028].map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent></Select>
              </div>
            </Field>
            <Field label="Vorbesitzer" optional><Chips label="Vorbesitzer" value={s4.previousOwners} onChange={(v) => setS4({ ...s4, previousOwners: v })} options={[{ value: "1", label: "1" }, { value: "2", label: "2" }, { value: "3+", label: "3+" }]} /></Field>
          </div>
          <Field label="Scheckheft" optional><Chips label="Scheckheft" value={s4.serviceBook} onChange={(v) => setS4({ ...s4, serviceBook: v })} options={[{ value: "ja", label: "Ja" }, { value: "nein", label: "Nein" }, { value: "teilweise", label: "Teilweise" }]} /></Field>
          <Field label="Bekannte Schäden oder Mängel" optional error={errors["damageNotes"]} id="ti-damage">
            <Textarea id="ti-damage" rows={3} maxLength={1000} value={s4.damageNotes} onChange={(e) => setS4({ ...s4, damageNotes: e.target.value })} placeholder="z. B. Kratzer hinten links, Klimaanlage schwach" />
            <p className="text-right text-xs text-muted-foreground">{s4.damageNotes.length} / 1000</p>
          </Field>
          <Field label={`Fotos (max. ${MAX_PHOTOS})`} optional error={errors["photos"]}>
            <p className="text-xs text-muted-foreground">Außen von allen Seiten, Innenraum, Tacho, Schäden.</p>
            <div className="grid grid-cols-3 gap-2">
              {photos.map((p) => (
                <div key={p.id} className="relative aspect-square overflow-hidden rounded-md border border-border">
                  <img src={p.preview} alt="Vorschau Fahrzeugfoto" width={200} height={200} loading="lazy" className="size-full object-cover" />
                  {p.state === "laedt" && <div className="absolute inset-0 grid place-items-center bg-ink-900/70"><Loader2 className="size-5 animate-spin text-primary" /></div>}
                  {p.state === "fertig" && <span className="absolute bottom-1 left-1 grid size-6 place-items-center rounded-full bg-success text-primary-foreground"><Check className="size-3.5" /></span>}
                  {p.state === "fehler" && <span className="absolute inset-x-0 bottom-0 bg-destructive/90 px-1 py-0.5 text-center text-[10px] text-foreground">Fehler</span>}
                  {!busy && <button type="button" onClick={() => removePhoto(p.id)} aria-label="Foto entfernen" className="absolute right-1 top-1 grid size-8 place-items-center rounded-full bg-ink-900/80 text-foreground hover:text-tiffany-300"><X className="size-4" /></button>}
                </div>
              ))}
              {photos.length < MAX_PHOTOS && (
                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-primary/50 text-xs text-muted-foreground hover:border-primary hover:text-tiffany-300">
                  <Camera className="size-6" />Foto hinzufügen
                  <input type="file" accept="image/*" multiple capture="environment" className="sr-only" onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
                </label>
              )}
            </div>
            <a href={whatsappPhotos} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-primary hover:underline"><MessageCircle className="size-4" />Fotos lieber per WhatsApp senden</a>
          </Field>
          {submitError && <p role="alert" className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-foreground">{submitError}</p>}
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <Button type="button" variant="ghost" onClick={finish} disabled={busy}>Überspringen</Button>
            <Button type="submit" variant="brand" disabled={busy} className="w-full sm:w-auto sm:min-w-44">{busy && <Loader2 className="animate-spin" />}Angaben senden</Button>
          </div>
        </form>
      )}
    </div>
  );
}
