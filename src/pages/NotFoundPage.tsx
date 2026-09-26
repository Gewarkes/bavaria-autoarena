import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PagePlaceholder } from "./PagePlaceholder";
export default function NotFoundPage() { return <PagePlaceholder eyebrow="Fehler 404" title="Seite nicht gefunden">Die gewünschte Seite ist nicht verfügbar. <Button asChild variant="gold" className="mt-8 flex w-fit"><Link to="/">Zur Startseite</Link></Button></PagePlaceholder>; }