import { Link } from "@tanstack/react-router";
import { BadgeEuro, FileCheck2, Globe2, Repeat2, ShieldCheck, Truck } from "lucide-react";

export const services = [
  {
    id: "ankauf", icon: Repeat2, title: "Fahrzeugankauf & Inzahlungnahme", to: "/auto-verkaufen" as const, cta: "Auto bewerten lassen",
    short: "Wir kaufen Ihr Auto oder rechnen es direkt auf Ihr Wunschfahrzeug an. Sie erhalten ein faires Angebot innerhalb von 24 Stunden an Werktagen.",
    long: "Sie möchten Ihr Auto verkaufen oder beim Kauf in Zahlung geben? Wir bewerten Ihr Fahrzeug ehrlich und nachvollziehbar. Den Betrag zahlen wir aus oder rechnen ihn direkt auf Ihr Wunschfahrzeug an. Die Abmeldung übernehmen wir auf Wunsch gleich mit.",
    steps: ["Fahrzeugdaten online oder per WhatsApp senden", "Angebot innerhalb von 24 Stunden erhalten", "Kurz besichtigen, unterschreiben, fertig"],
  },
  {
    id: "finanzierung", icon: BadgeEuro, title: "Finanzierung & Leasing", to: "/finanzierung" as const, cta: "Finanzierung anfragen",
    short: "Mit unseren Partnern Santander Consumer Bank und DKB – auch mit Inzahlungnahme als Anzahlung. Laufzeit und Rate passen wir Ihrem Budget an.",
    long: "Wir vermitteln Finanzierungen über die Santander Consumer Bank und die DKB. Laufzeit, Anzahlung und Schlussrate stimmen wir auf Ihr Budget ab. Ihr bisheriges Fahrzeug kann als Anzahlung dienen. Finanzierung über Santander Consumer Bank oder DKB, Bonität vorausgesetzt.",
    steps: ["Wunschfahrzeug und Wunschrate nennen", "Angebot und Bonitätsprüfung durch die Bank", "Vertrag unterschreiben und losfahren"],
  },
  {
    id: "zulassung", icon: FileCheck2, title: "Zulassungsservice", to: "/kontakt" as const, cta: "Zulassung anfragen",
    short: "Wir melden Ihr Fahrzeug für Sie an – Sie steigen ein und fahren los. Kein Termin bei der Zulassungsstelle nötig.",
    long: "Den Gang zur Zulassungsstelle nehmen wir Ihnen ab. Wir kümmern uns um Anmeldung, Kennzeichen und Plaketten. Sie bringen nur die nötigen Unterlagen mit. Bei der Übergabe ist Ihr Auto fahrbereit.",
    steps: ["eVB-Nummer Ihrer Versicherung und Ausweis bereitstellen", "Wir melden das Fahrzeug an", "Übergabe mit Kennzeichen – losfahren"],
  },
  {
    id: "lieferung", icon: Truck, title: "Lieferservice", to: "/kontakt" as const, cta: "Lieferung anfragen",
    short: "Auf Wunsch bringen wir Ihr Fahrzeug zu Ihnen nach Hause – in ganz Niederbayern und darüber hinaus. Termin und Preis stimmen wir vorab ab.",
    long: "Sie haben keine Zeit für die Abholung? Wir liefern Ihr Fahrzeug bis vor Ihre Haustür. Das gilt für ganz Niederbayern und auf Anfrage auch darüber hinaus. Preis und Termin nennen wir Ihnen verbindlich vor dem Kauf.",
    steps: ["Lieferadresse und Wunschtermin nennen", "Festpreis für die Lieferung erhalten", "Übergabe bei Ihnen zu Hause"],
  },
  {
    id: "export", icon: Globe2, title: "Export & Ausfuhrkennzeichen", to: "/kontakt" as const, cta: "Export anfragen",
    short: "Unkomplizierter Fahrzeugexport mit allen Papieren und Kennzeichen. Wir bereiten die Unterlagen für Ihre Ausfuhr vor.",
    long: "Sie möchten ein Fahrzeug ins Ausland bringen? Wir erledigen Ausfuhrkennzeichen und die nötigen Papiere. Auf Wunsch organisieren wir auch die Kurzzeitversicherung. So starten Sie ohne Behördengänge.",
    steps: ["Zielland und Fahrzeug nennen", "Wir beantragen Ausfuhrkennzeichen und Papiere", "Abholung mit vollständigen Unterlagen"],
  },
  {
    id: "garantie", icon: ShieldCheck, title: "Gewährleistung & Garantie", to: "/kontakt" as const, cta: "Garantie anfragen",
    short: "12 Monate gesetzliche Gewährleistung, erweiterte Garantie auf Anfrage. So fahren Sie auch nach dem Kauf sorgenfrei.",
    long: "Für Verbraucher gilt beim Kauf die gesetzliche Gewährleistung von 12 Monaten. Auf Wunsch vermitteln wir eine erweiterte Garantie für zusätzliche Sicherheit. Umfang und Preis besprechen wir persönlich mit Ihnen.",
    steps: ["Garantiewunsch beim Kauf angeben", "Umfang und Laufzeit gemeinsam wählen", "Garantieunterlagen mit dem Fahrzeug erhalten"],
  },
];

export function ServicesGrid() {
  return (
    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {services.map(({ id, icon: Icon, title, short, to, cta }) => (
        <div key={id} className="flex flex-col rounded-lg border border-border bg-card p-6 transition-colors hover:border-gold/50">
          <Icon className="size-7 text-gold" />
          <h3 className="mt-4 font-display text-sm font-bold uppercase tracking-wide text-foreground">{title}</h3>
          <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{short}</p>
          <Link to={to} className="mt-5 text-sm font-semibold text-gold hover:text-gold-light">{cta} →</Link>
        </div>
      ))}
    </div>
  );
}
