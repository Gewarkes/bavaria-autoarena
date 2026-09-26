import type { ReactNode } from "react";

export function PagePlaceholder({ eyebrow, title, children }: { eyebrow?: string; title: string; children: ReactNode }) {
  return <section className="min-h-[56vh] border-b border-border"><div className="mx-auto max-w-[1200px] px-6 py-16 md:px-12 md:py-24">{eyebrow && <span className="sr-only">{eyebrow}</span>}<h1 className="max-w-4xl break-words font-display text-3xl font-bold leading-[1.1] text-foreground sm:text-5xl">{title}</h1><p className="mt-7 max-w-2xl text-[17px] leading-[1.6] text-foreground/80">{children}</p></div></section>;
}