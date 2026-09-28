import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Honeypot } from "@/components/forms/InquiryForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { mapsRouteUrl, phoneHref, siteConfig } from "@/config/site";
import { submitInquiry } from "@/lib/inquiries";
import { buildIcs, CALL_ME, chipLabel, closeTermin, longLabel, nextOpeningDays, slotsFor, TERMIN_TOPICS, useTerminState, type TerminTopic, type TerminVehicle } from "@/lib/termin";
import { cn } from "@/lib/utils";

const chip = (active: boolean) => cn("h-11 shrink-0 rounded-sm border px-4 text-sm tabular-nums transition-colors", active ? "border-navy-900 bg-navy-900 text-cream" : "border-silver-300 bg-white text-navy-900 hover:border-gold-500");
const label = "block font-display text-[12px] font-medium uppercase tracking-[.14em] text-ink-500";

export function TerminFlow({ vehicle, initialTopic, dark = false }: { vehicle?: TerminVehicle | undefined; initialTopic?: TerminTopic | undefined; dark?: boolean }) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(initialTopic ? 2 : 1);
  const [topic, setTopic] = useState<TerminTopic | undefined>(initialTopic);
  const [days, setDays] = useState<string[]>([]);
  const [date, setDate] = useState<string>();
  const [time, setTime] = useState<string>();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const startedAt = useRef(Date.now());
  useEffect(() => { const d = nextOpeningDays(10); setDays(d); setDate(d[0]); }, []);

  const callMe = time === CALL_ME;
  const slots = date ? slotsFor(date) : [];

  async function submit(e: FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next["name"] = "Bitte geben Sie Ihren Namen an.";
    if (!/^[+\d\s()/-]{6,}$/.test(phone.trim())) next["phone"] = "Bitte eine gültige Telefonnummer angeben.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setBusy(true); setFailed(false);
    const res = await submitInquiry({
      kind: topic === "Probefahrt" || topic === "Besichtigung" ? "probefahrt" : "rueckruf",
      name, phone, email: "", message: note.trim() || undefined, vehicleId: vehicle?.id ?? null,
      preferredDate: callMe ? undefined : date, preferredSlot: time, topic,
    }, { honeypot, startedAt: startedAt.current }).catch(() => ({ ok: false as const }));
    setBusy(false);
    if (res.ok) setStep(4); else setFailed(true);
  }

  function downloadIcs() {
    if (!date || !time || callMe) return;
    const blob = new Blob([buildIcs(date, time, `${topic ?? "Termin"} Bavaria Autoarena${vehicle ? ` – ${vehicle.title}` : ""}`)], { type: "text/calendar;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "termin-bavaria-autoarena.ics"; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }

  const text = dark ? "text-cream" : "text-navy-900";
  const firstName = name.trim().split(/\s+/)[0];

  if (step === 4) return (
    <div role="status" className={text}>
      <p className="font-display text-2xl font-light uppercase tracking-[.06em]">Danke, {firstName}!</p>
      <p className="mt-4 text-lg leading-[1.6]">
        {callMe ? <>Wir rufen Sie zurück{vehicle ? <> wegen des {vehicle.title}</> : null}.</>
          : <>Ihr Wunschtermin: {date ? longLabel(date) : ""}, {time} Uhr{vehicle ? <> für den {vehicle.title}</> : null}. Wir bestätigen ihn kurz per Anruf oder WhatsApp.</>}
      </p>
      <p className="mt-4 text-sm">Bitte Führerschein mitbringen.</p>
      <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
        {!callMe ? <Button type="button" variant="gold" onClick={downloadIcs}>In Kalender eintragen (.ics)</Button> : null}
        <a href={mapsRouteUrl} target="_blank" rel="noopener noreferrer" className="text-link">Route planen</a>
      </div>
      <p className="mt-6 text-xs opacity-75">{siteConfig.street}, {siteConfig.zip} {siteConfig.city}</p>
    </div>
  );

  return (
    <div className={text}>
      <ol aria-label="Fortschritt" className="flex items-center gap-2 font-display text-sm tabular-nums tracking-[.1em]">
        {[1, 2, 3].map((n, i) => <li key={n} className="flex items-center gap-2">{i ? <span aria-hidden className="opacity-40">·</span> : null}<span aria-current={step === n ? "step" : undefined} className={step === n ? "text-gold-600 font-semibold" : step > n ? "" : "opacity-40"}>{n}</span></li>)}
      </ol>
      {vehicle ? <div className="mt-5 flex items-center gap-4 border-y border-silver-300/60 py-3">{vehicle.image ? <img src={vehicle.image} alt="" width={96} height={54} className="h-[54px] w-24 shrink-0 rounded-sm bg-[#E4E5E7] object-cover" /> : null}<div className="min-w-0"><p className="truncate font-semibold">{vehicle.title}</p><p className="text-sm tabular-nums opacity-80">{vehicle.price}</p></div></div> : null}

      {step === 1 ? <section className="mt-6">
        <h3 className="font-display text-2xl font-light uppercase tracking-[.06em]">Worum geht's?</h3>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">{TERMIN_TOPICS.map((t) => <button key={t} type="button" onClick={() => { setTopic(t); setStep(2); }} className={cn("min-h-20 rounded-sm border p-5 text-left text-lg transition-colors", topic === t ? "border-gold-500 bg-gold-500/10" : "border-silver-300 bg-white text-navy-900 hover:border-gold-500")}>{t}</button>)}</div>
      </section> : null}

      {step === 2 ? <section className="mt-6">
        <h3 className="font-display text-2xl font-light uppercase tracking-[.06em]">Wann passt es Ihnen?</h3>
        <p className={cn(label, "mt-5")}>Tag</p>
        <div role="radiogroup" aria-label="Tag" className="hide-scrollbar -mx-1 mt-2 flex gap-2 overflow-x-auto px-1 pb-1">{days.map((d) => <button key={d} type="button" role="radio" aria-checked={date === d && !callMe} onClick={() => { setDate(d); if (time && time !== CALL_ME && !slotsFor(d).includes(time)) setTime(undefined); }} className={chip(date === d && !callMe)}>{chipLabel(d)}</button>)}</div>
        <p className={cn(label, "mt-5")}>Uhrzeit</p>
        <div role="radiogroup" aria-label="Uhrzeit" className="mt-2 flex flex-wrap gap-2">
          {slots.map((s) => <button key={s} type="button" role="radio" aria-checked={time === s} onClick={() => setTime(s)} className={chip(time === s)}>{s}</button>)}
          <button type="button" role="radio" aria-checked={callMe} onClick={() => setTime(CALL_ME)} className={chip(callMe)}>{CALL_ME}</button>
        </div>
        <div className="mt-7 flex items-center gap-4">
          {!initialTopic ? <button type="button" onClick={() => setStep(1)} className="inline-flex min-h-11 items-center gap-1 text-sm underline underline-offset-[6px]"><ArrowLeft className="size-4" strokeWidth={1.5} />Zurück</button> : null}
          <Button type="button" variant="gold" disabled={!time} onClick={() => setStep(3)}>Weiter</Button>
        </div>
      </section> : null}

      {step === 3 ? <form onSubmit={submit} noValidate className="relative mt-6 space-y-5">
        <h3 className="font-display text-2xl font-light uppercase tracking-[.06em]">Wie erreichen wir Sie?</h3>
        <p className="text-sm opacity-80">{topic}{callMe ? ` · ${CALL_ME}` : date ? ` · ${chipLabel(date)}, ${time} Uhr` : ""}</p>
        <Honeypot value={honeypot} onChange={setHoneypot} />
        <label className={label}>Name *<Input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" enterKeyHint="next" maxLength={100} className="mt-2 h-12 bg-white text-navy-900" aria-invalid={!!errors["name"]} /></label>
        {errors["name"] ? <p className="-mt-3 text-sm text-destructive">{errors["name"]}</p> : null}
        <label className={label}>Telefon *<Input type="tel" inputMode="tel" autoComplete="tel" enterKeyHint="next" maxLength={40} value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-2 h-12 bg-white text-navy-900" aria-invalid={!!errors["phone"]} /></label>
        {errors["phone"] ? <p className="-mt-3 text-sm text-destructive">{errors["phone"]}</p> : null}
        <label className={label}>Anmerkung<Input value={note} onChange={(e) => setNote(e.target.value)} maxLength={300} enterKeyHint="send" className="mt-2 h-12 bg-white text-navy-900" /></label>
        {failed ? <p role="alert" className="text-sm">Das hat leider nicht geklappt. Bitte versuchen Sie es erneut oder rufen Sie uns an: <a href={phoneHref} className="font-semibold underline">{siteConfig.phone}</a></p> : null}
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => setStep(2)} className="inline-flex min-h-11 items-center gap-1 text-sm underline underline-offset-[6px]"><ArrowLeft className="size-4" strokeWidth={1.5} />Zurück</button>
          <Button type="submit" variant="gold" disabled={busy} className="flex-1 sm:flex-none">{busy ? "Wird gesendet …" : "Termin anfragen"}</Button>
        </div>
        <p className="text-xs leading-5 opacity-75">Mit dem Absenden verarbeiten wir Ihre Angaben zur Terminvereinbarung. Details in der <Link to="/datenschutz" className="underline underline-offset-4">Datenschutzerklärung</Link>.</p>
      </form> : null}
    </div>
  );
}

export function TerminHost() {
  const s = useTerminState();
  const [mobile, setMobile] = useState(false);
  useEffect(() => { const m = window.matchMedia("(max-width: 767px)"); const f = () => setMobile(m.matches); f(); m.addEventListener("change", f); return () => m.removeEventListener("change", f); }, []);
  return (
    <Sheet open={s.open} onOpenChange={(o) => { if (!o) closeTermin(); }}>
      <SheetContent side={mobile ? "bottom" : "right"} className={cn("overflow-y-auto border-0 bg-silver-100 p-6 sm:p-10", mobile ? "h-[100dvh] pt-12" : "w-full sm:max-w-[560px]")}>
        <SheetTitle className="font-display text-sm font-medium uppercase tracking-[.16em] text-gold-700">Termin vereinbaren</SheetTitle>
        <SheetDescription className="sr-only">In drei Schritten einen Wunschtermin anfragen.</SheetDescription>
        <div className="mt-6"><TerminFlow key={s.key} vehicle={s.vehicle} initialTopic={s.topic} /></div>
      </SheetContent>
    </Sheet>
  );
}
