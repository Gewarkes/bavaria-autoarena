import type { ReactNode } from "react";

export function PagePlaceholder({ eyebrow, title, children }: { eyebrow?: string; title: string; children: ReactNode }) {
  return <section className="bg-rauten min-h-[56vh] border-b border-gold/40"><div className="mx-auto max-w-7xl px-5 py-20 sm:py-28 lg:px-6">{eyebrow && <p className="mb-4 font-display text-xs font-bold uppercase tracking-wide text-gold">{eyebrow}</p>}<h1 className="max-w-4xl break-words font-display text-3xl font-extrabold uppercase tracking-wide text-foreground sm:text-6xl">{title}</h1><div className="mt-6 h-px w-20 bg-gold-gradient" /><p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">{children}</p></div></section>;
}