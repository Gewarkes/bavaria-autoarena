import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/Logo";

export default function NotFoundPage() {
  return (
    <section className="grid min-h-[64vh] place-items-center bg-background px-6 py-20 text-center">
      <div>
        <div className="mx-auto w-fit"><LogoMark className="h-20" /></div>
        <p className="mt-10 font-display text-7xl font-light text-primary">404</p>
        <h1 className="mt-4 section-h2 text-foreground">Diese Seite gibt es nicht</h1>
        <p className="mt-4 text-muted-foreground">Vielleicht wurde sie verschoben – unsere Fahrzeuge finden Sie hier:</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild variant="brand"><Link to="/fahrzeuge">Fahrzeuge ansehen</Link></Button>
          <Button asChild variant="outline"><Link to="/">Zur Startseite</Link></Button>
        </div>
      </div>
    </section>
  );
}
