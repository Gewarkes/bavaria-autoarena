import { useRef, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { phoneHref, siteConfig } from "@/config/site";
import { submitInquiry } from "@/lib/inquiries";
import { Honeypot } from "./InquiryForm";

const label = "block font-display text-[12px] font-medium uppercase tracking-[.14em] text-silver-300";
const field = "mt-2 h-12 rounded-sm border-0 border-b border-silver-400 bg-transparent px-0 text-cream placeholder:text-silver-400/70 focus-visible:ring-0 focus-visible:border-gold-400";

export function SearchRequestForm() {
  const startedAt = useRef(Date.now());
  const [wish, setWish] = useState("");
  const [budget, setBudget] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit(e: FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!wish.trim()) next["wish"] = "Bitte beschreiben Sie das gesuchte Auto.";
    if (name.trim().length < 2) next["name"] = "Bitte geben Sie Ihren Namen an.";
    if (!/^[+\d\s()/-]{6,}$/.test(phone.trim())) next["phone"] = "Bitte eine gültige Telefonnummer angeben.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setState("sending");
    const res = await submitInquiry({ kind: "anfrage", topic: "suchauftrag", name, phone, email: "", vehicleId: null,
      message: `Suchauftrag\nGesucht: ${wish.trim()}\nBudget: ${budget.trim() || "–"}` }, { honeypot, startedAt: startedAt.current }).catch(() => ({ ok: false as const }));
    setState(res.ok ? "done" : "error");
  }

  if (state === "done") return <div role="status" className="text-cream"><p className="font-display text-2xl font-light uppercase tracking-[.06em]">Danke, {name.trim().split(/\s+/)[0]}!</p><p className="mt-3 text-silver-300">Wir haben Ihren Suchauftrag. Sobald wir etwas Passendes haben, melden wir uns bei Ihnen.</p></div>;
  return (
    <form onSubmit={submit} noValidate className="relative grid gap-5">
      <Honeypot value={honeypot} onChange={setHoneypot} />
      <label className={label}>Was suchen Sie? *<Input value={wish} onChange={(e) => setWish(e.target.value)} placeholder="z. B. Audi RS6 Avant, ab 2020, schwarz" maxLength={200} className={field} /></label>
      {errors["wish"] ? <p className="-mt-3 text-sm text-gold-300">{errors["wish"]}</p> : null}
      <label className={label}>Budget ungefähr<Input value={budget} onChange={(e) => setBudget(e.target.value)} maxLength={60} className={field} /></label>
      <div className="grid gap-5 sm:grid-cols-2">
        <div><label className={label}>Name *<Input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" maxLength={100} className={field} /></label>{errors["name"] ? <p className="mt-2 text-sm text-gold-300">{errors["name"]}</p> : null}</div>
        <div><label className={label}>Telefon *<Input type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={40} className={field} /></label>{errors["phone"] ? <p className="mt-2 text-sm text-gold-300">{errors["phone"]}</p> : null}</div>
      </div>
      {state === "error" ? <p role="alert" className="text-sm text-cream">Das hat leider nicht geklappt. Bitte rufen Sie uns an: <a href={phoneHref} className="underline">{siteConfig.phone}</a></p> : null}
      <Button type="submit" variant="gold" disabled={state === "sending"} className="w-full sm:w-fit">{state === "sending" ? "Wird gesendet …" : "Suchauftrag abschicken"}</Button>
      <p className="text-xs leading-5 text-silver-400">Mit dem Absenden verarbeiten wir Ihre Angaben zur Bearbeitung Ihres Suchauftrags. Details in der <Link to="/datenschutz" className="underline underline-offset-4">Datenschutzerklärung</Link>.</p>
    </form>
  );
}
