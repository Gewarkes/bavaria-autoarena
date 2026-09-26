import { useQuery } from "@tanstack/react-query";
import { MapPin, Star } from "lucide-react";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { testimonialsQuery } from "@/lib/vehicles";

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="font-display text-xs font-bold uppercase tracking-wide text-gold">{children}</p>;
}

export function H2({ eyebrow, children }: { eyebrow?: string; children: ReactNode }) {
  return <div>{eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}<h2 className="mt-3 font-display text-2xl font-bold uppercase tracking-wide text-foreground sm:text-3xl">{children}</h2></div>;
}

export function PageHero({ eyebrow, title, children, aside }: { eyebrow: string; title: string; children?: ReactNode; aside?: ReactNode }) {
  return (
    <section className="bg-rauten border-b border-border">
      <div className={`mx-auto grid max-w-7xl gap-10 px-5 py-14 md:py-20 lg:px-6 ${aside ? "lg:grid-cols-2 lg:items-center" : ""}`}>
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-4 max-w-4xl font-display text-3xl font-extrabold uppercase tracking-wide text-foreground sm:text-5xl">{title}</h1>
          <div className="mt-6 h-px w-20 bg-gold-gradient" />
          {children && <div className="mt-6 max-w-2xl text-lg leading-8 text-silver">{children}</div>}
        </div>
        {aside}
      </div>
    </section>
  );
}

export function MapGraphic() {
  return (
    <div>
      <div className="relative grid min-h-80 place-items-center overflow-hidden rounded-lg border border-border bg-darkest">
        <svg viewBox="0 0 600 400" className="absolute inset-0 size-full opacity-70" aria-hidden="true"><g fill="none" stroke="currentColor" className="text-border"><path d="M-20 80 C130 130 220 20 620 120" strokeWidth="8" /><path d="M-40 270 C140 190 310 350 640 235" strokeWidth="5" /><path d="M90 -20 C180 150 110 270 210 430" strokeWidth="4" /><path d="M470 -20 C390 100 500 210 430 430" strokeWidth="7" /></g></svg>
        <div className="relative text-center"><MapPin className="mx-auto size-16 fill-gold-dark text-gold-light" /><p className="mt-3 font-display text-sm font-bold uppercase tracking-wide text-foreground">Perkam</p><p className="mt-1 text-xs text-muted-foreground">bei Straubing</p></div>
      </div>
      <p className="mt-4 text-center text-sm text-muted-foreground">Straubing 15 Min · Regensburg 35 Min · Landshut 45 Min · Deggendorf 35 Min</p>
    </div>
  );
}

export function Testimonials() {
  const { data, isPending, isError } = useQuery(testimonialsQuery());
  if (isPending) return <div className="mt-10 grid gap-5 md:grid-cols-3">{Array.from({ length: 3 }, (_, i) => <div key={i} className="h-44 animate-pulse rounded-lg border border-border bg-card" />)}</div>;
  if (isError || !data.length) return null;
  return <div className="mt-10 grid gap-5 md:grid-cols-3">{data.map((t) => <figure key={t.id} className="rounded-lg border border-border bg-card p-6"><div className="flex gap-1 text-gold" aria-label={`${t.rating ?? 5} von 5 Sternen`}>{Array.from({ length: t.rating ?? 5 }, (_, index) => <Star key={index} className="size-4 fill-current" />)}</div><blockquote className="mt-5 leading-7 text-foreground">„{t.text}“</blockquote><figcaption className="mt-5 text-sm font-semibold text-muted-foreground">{t.author}</figcaption></figure>)}</div>;
}

export function TestimonialsNote() {
  return <p className="mt-6 max-w-5xl text-xs leading-5 text-muted-foreground">Bewertungen stammen von mobile.de (Stand {siteConfig.rating.asOf}). Dort können nur Nutzer bewerten, die über die Plattform Kontakt aufgenommen haben; mobile.de prüft die Bewertungen nach eigenen Richtlinien. Die Kundenstimmen sind gekürzt wiedergegeben. <a href={siteConfig.mobileDeUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-gold hover:text-gold-light">Alle Bewertungen auf mobile.de</a></p>;
}

export function PrivacyHint() {
  return <p className="text-xs leading-5 text-muted-foreground">Mit dem Absenden verarbeiten wir Ihre Angaben zur Bearbeitung Ihrer Anfrage. Details in unserer <a href="/datenschutz" className="text-gold underline-offset-4 hover:underline">Datenschutzerklärung</a>.</p>;
}

export function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return <button type="button" role="radio" aria-checked={active} onClick={onClick} className={`h-11 rounded-md border px-4 text-sm font-medium transition-colors ${active ? "border-gold bg-gold-gradient text-primary-foreground" : "border-gold/40 text-foreground hover:border-gold"}`}>{children}</button>;
}
