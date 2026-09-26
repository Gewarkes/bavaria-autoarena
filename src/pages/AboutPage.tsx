import { Link } from "@tanstack/react-router";
import { Check, Handshake, Scale, ShieldCheck, UserRound, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { PageHero, H2, Testimonials, TestimonialsNote } from "@/components/site/shared";

const values = [
  { icon: Handshake, title: "Ehrlich", text: "Wir beschreiben jedes Fahrzeug so, wie es ist – mit allen Stärken und Schwächen." },
  { icon: ShieldCheck, title: "Geprüft", text: "Kein Fahrzeug verlässt unseren Hof ohne gründliche Prüfung." },
  { icon: Scale, title: "Fair", text: "Transparente Endpreise und faire Bewertung Ihres Altfahrzeugs." },
  { icon: Heart, title: "Persönlich", text: "Sie sprechen immer direkt mit uns – ohne Callcenter und ohne Verkaufsdruck." },
];
const promise = ["HU-Check", "Probefahrt", "Fahrzeughistorie geprüft", "Servicehistorie eingesehen"];

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="Über uns" title="Neu gebaut. Fest verwurzelt in Niederbayern." aside={
        <div className="bg-rauten grid aspect-[4/3] place-items-center rounded-lg border border-gold/40 bg-darkest p-6 text-center text-sm text-muted-foreground">[[PLATZHALTER: Foto neues Autohaus Perkam]]</div>
      } />
      <Reveal className="mx-auto max-w-3xl space-y-5 px-5 py-16 text-lg leading-8 text-silver lg:px-6">
        <p>Seit Jahren handeln wir mit Gebrauchtwagen im Raum Straubing – zunächst in Aiterhofen. Jetzt sind wir in unser neu gebautes Autohaus in Perkam umgezogen.</p>
        <p>Jedes Fahrzeug prüfen wir vor dem Verkauf sorgfältig. So wissen Sie genau, was Sie bekommen.</p>
        <p>Wir beraten Sie persönlich und ohne Verkaufsdruck. Sie entscheiden in Ruhe – wir nehmen uns die Zeit dafür.</p>
      </Reveal>
      <section className="border-y border-border bg-darkest"><div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
        {[["85+", "Bewertungen"], ["4,7 / 5", "auf mobile.de (Stand 09/2026)"], ["25+", "Fahrzeuge"], ["[[PLATZHALTER: seit Jahr]]", "im Gebrauchtwagenhandel"]].map(([v, l]) => <div key={l} className="border-l border-gold/50 pl-5"><p className={`text-gold-gradient break-words font-display font-extrabold tracking-wide ${String(v).startsWith("[[") ? "text-lg" : "text-3xl"}`}>{v}</p><p className="mt-2 text-sm text-muted-foreground">{l}</p></div>)}
      </div></section>
      <Reveal className="mx-auto max-w-7xl px-5 py-16 lg:px-6">
        <H2 eyebrow="Wofür wir stehen">Unsere Werte</H2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{values.map(({ icon: Icon, title, text }) => <div key={title} className="rounded-lg border border-border bg-card p-6 transition-colors hover:border-gold/50"><Icon className="size-7 text-gold" /><h3 className="mt-4 font-display text-sm font-bold uppercase tracking-wide text-foreground">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></div>)}</div>
      </Reveal>
      <Reveal className="mx-auto max-w-7xl px-5 pb-16 lg:px-6">
        <H2 eyebrow="Ihre Ansprechpartner">Unser Team</H2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">{[1, 2, 3].map((i) => <div key={i} className="rounded-lg border border-border bg-card p-6 text-center"><div className="mx-auto grid size-24 place-items-center rounded-full border border-gold/40 bg-darkest"><UserRound className="size-12 text-silver" /></div><p className="mt-4 font-semibold text-foreground">[[PLATZHALTER: Name]]</p><p className="text-sm text-muted-foreground">[[PLATZHALTER: Position]]</p></div>)}</div>
      </Reveal>
      <Reveal className="mx-auto max-w-7xl px-5 pb-16 lg:px-6">
        <div className="rounded-lg border border-gold/50 bg-card p-6 md:p-10">
          <H2 eyebrow="Vor jedem Verkauf">Unser Prüfversprechen</H2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">{promise.map((p) => <li key={p} className="flex items-center gap-3 text-foreground"><span className="grid size-7 place-items-center rounded-full border border-gold/50 text-gold"><Check className="size-4" /></span>{p}</li>)}</ul>
        </div>
      </Reveal>
      <Reveal className="mx-auto max-w-7xl px-5 pb-16 lg:px-6"><H2 eyebrow="Erfahrungen unserer Kunden">Kundenstimmen</H2><Testimonials /><TestimonialsNote /></Reveal>
      <section className="bg-rauten"><div className="mx-auto max-w-7xl px-5 py-16 text-center lg:px-6"><h2 className="font-display text-3xl font-extrabold uppercase tracking-wide text-foreground">Lernen Sie uns kennen</h2><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Button asChild variant="gold"><Link to="/kontakt">Besuch vereinbaren</Link></Button><Button asChild variant="silver"><Link to="/fahrzeuge">Fahrzeuge ansehen</Link></Button></div></div></section>
    </>
  );
}
