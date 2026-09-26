import { Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/shared";
import { Reveal } from "@/components/Reveal";
import { services, ServicesGrid } from "@/components/site/Services";
import { ContactForm } from "@/pages/ContactPage";

export default function ServicesPage() {
  return (
    <>
      <PageHero eyebrow="Leistungen" title="Mehr als nur Autos verkaufen.">
        Ankauf, Finanzierung, Zulassung, Lieferung und Export – bei uns erhalten Sie alles aus einer Hand.
      </PageHero>
      <div className="mx-auto max-w-7xl px-5 pb-10 lg:px-6"><ServicesGrid /></div>
      <div className="mx-auto max-w-7xl space-y-6 px-5 py-10 lg:px-6">
        {services.map(({ id, icon: Icon, title, long, steps, to, cta }) => (
          <Reveal key={id}>
            <section id={id} className="grid gap-6 rounded-lg border border-border bg-card p-6 md:grid-cols-[1fr_1fr] md:p-10">
              <div>
                <Icon className="size-8 text-gold" />
                <h2 className="mt-4 font-display text-2xl font-extrabold uppercase tracking-wide text-foreground">{title}</h2>
                <p className="mt-4 leading-7 text-muted-foreground">{long}</p>
                <Link to={to} className="mt-5 inline-block text-sm font-semibold text-gold hover:text-gold-light">{cta} →</Link>
              </div>
              <ol className="space-y-3 self-center">
                {steps.map((s, i) => (
                  <li key={s} className="flex items-center gap-4 rounded-md border border-border bg-background p-4">
                    <span className="text-gold-gradient font-display text-2xl font-extrabold">{i + 1}</span>
                    <span className="text-sm text-foreground">{s}</span>
                  </li>
                ))}
              </ol>
            </section>
          </Reveal>
        ))}
      </div>
      <div className="mx-auto max-w-3xl px-5 pb-20 pt-6 lg:px-6"><ContactForm /></div>
    </>
  );
}
