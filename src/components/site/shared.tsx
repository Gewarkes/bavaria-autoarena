import { MapPin } from "lucide-react";
import type { ReactNode } from "react";
import { Ornament } from "@/components/Ornament";

export function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return <p className={`eyebrow ${dark ? "text-primary" : "text-primary"}`}>{children}</p>;
}

export function H2({ eyebrow, children }: { eyebrow?: string; children: ReactNode }) {
  return <div>{eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}<h2 className="section-h2 mt-3 text-foreground">{children}</h2><span aria-hidden="true" className="brand-line mt-6 block h-px w-16" /></div>;
}

export function PageHero({ eyebrow = "Bavaria Autoarena", title, children, aside }: { eyebrow?: string; title: string; children?: ReactNode; aside?: ReactNode }) {
  return (
    <section className="relative border-b border-border bg-ink-900 pb-14 pt-16 text-foreground lg:pb-20 lg:pt-24">
      <div className={`page-container grid gap-10 ${aside ? "lg:grid-cols-12 lg:items-center" : ""}`}>
        <div className={aside ? "lg:col-span-6" : ""}>
          <Eyebrow dark>{eyebrow}</Eyebrow>
          <h1 lang="de" className={`display-title mt-5 max-w-4xl text-balance break-words hyphens-auto ${aside ? "lg:!text-[3rem] xl:!text-[3.5rem]" : ""}`}>{title}</h1>
          <span aria-hidden="true" className="brand-line mt-8 block h-px w-20" />
          {children && <div className="mt-8 max-w-[60ch] text-lg leading-[1.65] text-muted-foreground">{children}</div>}
        </div>
        {aside ? <div className="lg:col-span-6">{aside}</div> : null}
      </div>
    </section>
  );
}

export function MapGraphic() {
  return (
    <div>
        <div className="relative grid min-h-80 place-items-center overflow-hidden rounded-sm bg-ink-800">
        <svg viewBox="0 0 600 400" className="absolute inset-0 size-full opacity-70" aria-hidden="true"><g fill="none" stroke="currentColor" className="text-border"><path d="M-20 80 C130 130 220 20 620 120" strokeWidth="8" /><path d="M-40 270 C140 190 310 350 640 235" strokeWidth="5" /><path d="M90 -20 C180 150 110 270 210 430" strokeWidth="4" /><path d="M470 -20 C390 100 500 210 430 430" strokeWidth="7" /></g></svg>
        <div className="relative text-center"><MapPin className="mx-auto size-7 text-primary" strokeWidth={1.5} /><p className="mt-3 font-display text-sm uppercase tracking-[.12em] text-foreground">Perkam</p><p className="mt-1 text-xs text-muted-foreground">bei Straubing</p></div>
      </div>
    </div>
  );
}

export function PrivacyHint() {
  return <p className="text-xs leading-5 text-muted-foreground">Mit dem Absenden verarbeiten wir Ihre Angaben zur Bearbeitung Ihrer Anfrage. Details in unserer <a href="/datenschutz" className="inline-flex min-h-11 items-center text-primary underline underline-offset-4">Datenschutzerklärung</a>.</p>;
}

export function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return <button type="button" role="radio" aria-checked={active} onClick={onClick} className={`h-11 rounded-sm border px-4 text-sm transition-colors ${active ? "border-foreground bg-ink-800 text-foreground ring-1 ring-primary" : "border-border bg-card text-foreground hover:border-primary"}`}>{children}</button>;
}

export function PageImage({ src, alt, width, height, className = "aspect-[4/3]" }: { src: string; alt: string; width: number; height: number; className?: string }) {
  return <div className={`overflow-hidden rounded-sm bg-image-placeholder ${className}`}><img src={src} alt={alt} width={width} height={height} loading="lazy" className="size-full object-cover object-center" /></div>;
}

export function PhotoPlaceholder({ label, portrait = false }: { label: string; portrait?: boolean }) {
  return <div role="img" aria-label={`Foto folgt: ${label}`} className={`flex items-end rounded-sm bg-image-placeholder p-4 ${portrait ? "aspect-16/10 md:aspect-4/5" : "aspect-16/10 md:aspect-3/2"}`}><p className="text-xs text-muted-foreground">Foto folgt</p></div>;
}
