const variants = [
  {
    number: "I2-A",
    label: "Realistisch · Tageslicht",
    description: "Bewölktes Tageslicht, zurückhaltende Goldbeschriftung und natürliche Fahrzeug- und Kiesstruktur.",
    src: "/hero-varianten/autohaus-audi-real-a.webp",
  },
  {
    number: "I2-B",
    label: "Realistisch · Frühe Dämmerung",
    description: "Kühle frühe Dämmerung mit dezentem Innenlicht und angeglichener Fahrzeugbeleuchtung.",
    src: "/hero-varianten/autohaus-audi-real-b.webp",
  },
  {
    number: 1,
    label: "Freundlicher Tag",
    description: "Heller Himmel, warmes Fensterlicht und ein klarer Blick auf Fahrzeug und Fassade.",
    src: "/hero-varianten/autohaus-audi-1.webp",
  },
  {
    number: 2,
    label: "Blaue Stunde",
    description: "Kühler Abendhimmel mit stärkerem Kontrast zum warm beleuchteten Innenraum.",
    src: "/hero-varianten/autohaus-audi-2.webp",
  },
  {
    number: 3,
    label: "Warmer Abend",
    description: "Dezentes Abendlicht mit warmen Reflexen in den Fenstern.",
    src: "/hero-varianten/autohaus-audi-3.webp",
  },
] as const;

export default function HeroPreviewPage() {
  return (
    <main className="bg-silver-100 py-12 lg:py-20">
      <div className="page-container">
        <p className="eyebrow text-gold-700">Interne Auswahl</p>
        <h1 className="section-h2 mt-4 text-navy-900">Titelbild-Varianten</h1>
        <p className="mt-5 max-w-[60ch] text-lg leading-[1.6] text-ink-500">
          Neue realistische Fassungen und die bisherigen Entwürfe mit dem Autohaus in Perkam und dem dunkelgrünen Audi A5 Sportback.
        </p>

        <div className="mt-10 space-y-16 lg:mt-14 lg:space-y-24">
          {variants.map((variant) => (
            <section key={variant.number} aria-labelledby={`variante-${variant.number}`}>
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-silver-300 pb-4">
                <div>
                  <p className="eyebrow text-gold-700">Variante {variant.number}</p>
                  <h2 id={`variante-${variant.number}`} className="mt-2 font-display text-2xl font-light uppercase text-navy-900 lg:text-3xl">
                    {variant.label}
                  </h2>
                </div>
                <p className="max-w-xl text-base text-ink-500">{variant.description}</p>
              </div>
              <img
                src={variant.src}
                alt={`Titelbild Variante ${variant.number}: dunkelgrüner Audi A5 Sportback vor der Bavaria Autoarena`}
                width="2400"
                height="1340"
                loading={variant.number === "I2-A" ? "eager" : "lazy"}
                className="block h-auto w-full bg-silver-300 object-contain"
              />
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}