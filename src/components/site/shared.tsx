import { MapPin } from "lucide-react";
import type { ReactNode } from "react";
import { Ornament } from "@/components/Ornament";

export function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return <p className={`eyebrow ${dark ? "text-gold-400" : "text-gold-700"}`}>{children}</p>;
}

export function H2({ eyebrow, children }: { eyebrow?: string; children: ReactNode }) {
  return <div>{eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}<h2 className="section-h2 mt-3 text-navy-900">{children}</h2></div>;
}

export function PageHero({ eyebrow = "Bavaria Autoarena", title, children, aside }: { eyebrow?: string; title: string; children?: ReactNode; aside?: ReactNode }) {
  return (
    <section className="bg-navy-900 py-16 text-cream">
      <div className={`page-container grid gap-10 ${aside ? "lg:grid-cols-2 lg:items-center" : ""}`}>
        <div>
          <Eyebrow dark>{eyebrow}</Eyebrow>
          <h1 className="display-title mt-4 max-w-4xl">{title}</h1>
          {children && <div className="mt-6 max-w-2xl text-lg leading-[1.6] text-silver-300">{children}</div>}
        </div>
        {aside}
      </div>
    </section>
  );
}

export function MapGraphic() {
  return (
    <div>
        <div className="relative grid min-h-80 place-items-center overflow-hidden rounded-sm bg-silver-200">
        <svg viewBox="0 0 600 400" className="absolute inset-0 size-full opacity-70" aria-hidden="true"><g fill="none" stroke="currentColor" className="text-border"><path d="M-20 80 C130 130 220 20 620 120" strokeWidth="8" /><path d="M-40 270 C140 190 310 350 640 235" strokeWidth="5" /><path d="M90 -20 C180 150 110 270 210 430" strokeWidth="4" /><path d="M470 -20 C390 100 500 210 430 430" strokeWidth="7" /></g></svg>
        <div className="relative text-center"><MapPin className="mx-auto size-7 text-gold-700" strokeWidth={1.5} /><p className="mt-3 font-display text-sm uppercase tracking-[.12em] text-navy-900">Perkam</p><p className="mt-1 text-xs text-muted-foreground">bei Straubing</p></div>
      </div>
    </div>
  );
}

export function PrivacyHint() {
  return <p className="text-xs leading-5 text-muted-foreground">Mit dem Absenden verarbeiten wir Ihre Angaben zur Bearbeitung Ihrer Anfrage. Details in unserer <a href="/datenschutz" className="inline-flex min-h-11 items-center text-gold-700 underline underline-offset-4">Datenschutzerklärung</a>.</p>;
}

export function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return <button type="button" role="radio" aria-checked={active} onClick={onClick} className={`h-11 rounded-sm border px-4 text-sm transition-colors ${active ? "border-navy-900 bg-navy-900 text-cream" : "border-silver-300 bg-white text-navy-900 hover:border-gold-500"}`}>{children}</button>;
}

export function PhotoPlaceholder({ label, portrait = false }: { label: string; portrait?: boolean }) {
  return <div role="img" aria-label={`Foto folgt: ${label}`} className={`flex items-end rounded-sm bg-[#E4E5E7] p-4 ${portrait ? "aspect-16/10 md:aspect-4/5" : "aspect-16/10 md:aspect-3/2"}`}><p className="text-xs text-ink-500">Foto folgt</p></div>;
}
