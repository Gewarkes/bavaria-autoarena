import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

export default function NotFoundPage() {
  return (
    <section className="bg-rauten grid min-h-[64vh] place-items-center border-b border-gold/40 px-5 py-20 text-center">
      <div>
        <div className="mx-auto w-fit"><Logo /></div>
        <p className="text-gold-gradient mt-10 font-display text-7xl font-extrabold">404</p>
        <h1 className="mt-4 font-display text-2xl font-extrabold uppercase tracking-wide text-foreground sm:text-4xl">Diese Seite gibt es nicht</h1>
        <p className="mt-4 text-muted-foreground">Vielleicht wurde sie verschoben – unsere Fahrzeuge finden Sie hier:</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild variant="gold"><Link to="/fahrzeuge">Fahrzeuge ansehen</Link></Button>
          <Button asChild variant="silver"><Link to="/">Zur Startseite</Link></Button>
        </div>
      </div>
    </section>
  );
}
