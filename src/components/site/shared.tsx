import { useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { testimonialsQuery } from "@/lib/vehicles";

export function Eyebrow({ children }: { children: ReactNode }) {
  return <span className="sr-only">{children}</span>;
}

export function H2({ eyebrow, children }: { eyebrow?: string; children: ReactNode }) {
  return <div>{eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}<h2 className="font-display text-[1.75rem] font-semibold leading-[1.15] text-foreground md:text-4xl">{children}</h2></div>;
}

export function PageHero({ eyebrow, title, children, aside }: { eyebrow?: string; title: string; children?: ReactNode; aside?: ReactNode }) {
  return (
    <section className="border-b border-border">
      <div className={`mx-auto grid max-w-[1200px] gap-10 px-6 py-16 md:px-12 md:py-24 ${aside ? "lg:grid-cols-2 lg:items-center" : ""}`}>
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="max-w-4xl font-display text-3xl font-bold leading-[1.1] text-foreground sm:text-5xl">{title}</h1>
          {children && <div className="mt-6 max-w-2xl text-[17px] leading-[1.6] text-foreground/80">{children}</div>}
        </div>
        {aside}
      </div>
    </section>
  );
}

export function MapGraphic() {
  return (
    <div>
        <div className="relative grid min-h-80 place-items-center overflow-hidden rounded border border-border bg-darkest">
        <svg viewBox="0 0 600 400" className="absolute inset-0 size-full opacity-70" aria-hidden="true"><g fill="none" stroke="currentColor" className="text-border"><path d="M-20 80 C130 130 220 20 620 120" strokeWidth="8" /><path d="M-40 270 C140 190 310 350 640 235" strokeWidth="5" /><path d="M90 -20 C180 150 110 270 210 430" strokeWidth="4" /><path d="M470 -20 C390 100 500 210 430 430" strokeWidth="7" /></g></svg>
        <div className="relative text-center"><MapPin className="mx-auto size-7 text-silver" /><p className="mt-3 text-sm font-semibold text-foreground">Perkam</p><p className="mt-1 text-xs text-muted-foreground">bei Straubing</p></div>
      </div>
      <p className="mt-4 text-center text-sm text-muted-foreground">Straubing 15 Min · Regensburg 35 Min · Landshut 45 Min · Deggendorf 35 Min</p>
    </div>
  );
}

export function Testimonials() {
  const { data, isPending, isError } = useQuery(testimonialsQuery());
  if (isPending) return <div className="divide-y divide-border">{Array.from({ length: 3 }, (_, i) => <div key={i} className="h-36 animate-pulse" />)}</div>;
  if (isError || !data.length) return null;
  return <div className="divide-y divide-border">{data.slice(0, 3).map((t) => <figure key={t.id} className="py-7 first:pt-0 last:pb-0"><blockquote className="text-lg leading-[1.6] text-foreground">„{t.text}“</blockquote><figcaption className="mt-3 text-sm text-muted-foreground">{t.author}</figcaption></figure>)}</div>;
}

export function TestimonialsNote() {
  return <p className="mt-6 max-w-5xl text-xs leading-5 text-muted-foreground">Gekürzt wiedergegeben. Auf mobile.de bewerten nur Kunden, die dort Kontakt aufgenommen haben; mobile.de prüft die Bewertungen.</p>;
}

export function PrivacyHint() {
  return <p className="text-xs leading-5 text-muted-foreground">Mit dem Absenden verarbeiten wir Ihre Angaben zur Bearbeitung Ihrer Anfrage. Details in unserer <a href="/datenschutz" className="text-gold underline-offset-4 hover:underline">Datenschutzerklärung</a>.</p>;
}

export function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return <button type="button" role="radio" aria-checked={active} onClick={onClick} className={`h-11 rounded border px-4 text-sm font-medium transition-colors ${active ? "border-gold bg-gold text-primary-foreground" : "border-border text-foreground hover:border-gold"}`}>{children}</button>;
}

export function PhotoPlaceholder({ label, portrait = false }: { label: string; portrait?: boolean }) {
  return <div className={`flex items-end rounded border border-border bg-card p-5 ${portrait ? "aspect-16/10 md:aspect-4/5" : "aspect-16/10 md:aspect-3/2"}`}><p className="text-xs uppercase tracking-[0.08em] text-silver">Foto · {label}</p></div>;
}
