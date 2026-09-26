import type { ReactNode } from "react";
import { PRIVACY_VERSION, siteConfig } from "@/config/site";

const sections: { id: string; title: string; body: ReactNode }[] = [
  { id: "verantwortlicher", title: "Verantwortlicher", body: <p>{siteConfig.name}, {siteConfig.street}, {siteConfig.zip} {siteConfig.city}<br />Telefon: {siteConfig.phone} · E-Mail: {siteConfig.email}<br />Vertreten durch den Geschäftsführer: {siteConfig.legal.managingDirector}</p> },
  { id: "hosting", title: "Hosting und technische Bereitstellung", body: <>
    <p>Diese Website wird über Lovable Labs Incorporated bereitgestellt. Datenbank und Dateispeicher betreibt Supabase, Inc. Beim Aufruf der Website verarbeiten die Server technisch notwendige Daten (IP-Adresse, Datum und Uhrzeit, aufgerufene Seite, Browsertyp) in Server-Logs, um die Website sicher und stabil auszuliefern.</p>
    <p>Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse liegt in einem sicheren und funktionsfähigen Internetauftritt. Mit den Dienstleistern bestehen Verträge zur Auftragsverarbeitung nach Art. 28 DSGVO.</p>
    <p>Eine Verarbeitung in den USA ist möglich. Sie erfolgt auf Grundlage des EU-US Data Privacy Framework (Angemessenheitsbeschluss) bzw. der EU-Standardvertragsklauseln.</p></> },
  { id: "anfragen", title: "Fahrzeuganfrage, Kontaktformular und Inzahlungnahme-Anfrage", body: <>
    <p>Wenn Sie uns über ein Formular kontaktieren, verarbeiten wir Ihre Angaben: Name, Telefonnummer und/oder E-Mail-Adresse, Ihre Nachricht sowie ggf. Wunschtermin und Wunschfahrzeug. Bei der Inzahlungnahme-Anfrage zusätzlich Fahrzeugdaten (Marke, Modell, Erstzulassung, Kilometerstand, Zustand, Unfallstatus), PLZ, bevorzugter Kontaktweg und freiwillig hochgeladene Fotos. Fotos liegen in einem zugriffsgeschützten Speicher, auf den nur unsere Mitarbeiter Zugriff haben.</p>
    <p>Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Durchführung vorvertraglicher Maßnahmen auf Ihre Anfrage).</p>
    <p>Kommt kein Vertrag zustande, löschen wir Ihre Daten spätestens 6 Monate nach dem letzten Kontakt. Kommt ein Vertrag zustande, bewahren wir die Daten aufgrund gesetzlicher Pflichten 10 Jahre auf (§ 257 HGB, § 147 AO).</p></> },
  { id: "werbung", title: "Werbekontakt nur mit Einwilligung", body: <p>Über passende Fahrzeuge und Aktionen informieren wir Sie per E-Mail oder WhatsApp nur, wenn Sie das freiwillige Häkchen gesetzt haben (Art. 6 Abs. 1 lit. a DSGVO). Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen – eine kurze Nachricht an {siteConfig.email} genügt.</p> },
  { id: "email", title: "E-Mail-Versand", body: <p>Für den Versand von E-Mails (z. B. Bestätigungen und Antworten auf Ihre Anfrage) nutzen wir Resend, Inc. als Auftragsverarbeiter. Dabei werden Ihre E-Mail-Adresse und der Inhalt der Nachricht verarbeitet. Eine Verarbeitung in den USA erfolgt auf Grundlage des EU-US Data Privacy Framework bzw. der Standardvertragsklauseln.</p> },
  { id: "whatsapp", title: "WhatsApp", body: <>
    <p>Auf unserer Website finden Sie Links zu WhatsApp (WhatsApp Ireland Limited, Merrion Road, Dublin 4, Irland). Daten werden erst übertragen, wenn Sie den Link anklicken und WhatsApp öffnen. Für die Kommunikation nutzen wir ein geschäftliches Konto ohne Übermittlung unseres Adressbuchs.</p>
    <p>Wenn Sie WhatsApp nicht nutzen möchten, erreichen Sie uns jederzeit telefonisch oder über unsere Formulare.</p></> },
  { id: "links", title: "Externe Links", body: <p>Google Maps binden wir nicht ein, sondern verlinken nur darauf. Erst beim Klick auf „Route in Google Maps öffnen“ gelangen Sie zu Google. Ebenso verlinken wir unsere Bewertungen und Inserate auf mobile.de. Für die Datenverarbeitung auf diesen Seiten ist der jeweilige Anbieter verantwortlich.</p> },
  { id: "cookies", title: "Cookies und lokale Speicherung", body: <p>Diese Website verwendet keine Tracking- oder Marketing-Cookies. Schriftarten werden von unserem eigenen Server geladen.</p> },
  { id: "rechte", title: "Ihre Rechte", body: <>
    <p>Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen (Art. 21 DSGVO).</p>
    <p>Sie können sich außerdem bei einer Aufsichtsbehörde beschweren, zum Beispiel beim Bayerischen Landesamt für Datenschutzaufsicht (BayLDA), Promenade 18, 91522 Ansbach.</p></> },
  { id: "stand", title: "Stand", body: <p>Stand: September 2026 · Version {PRIVACY_VERSION}</p> },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[260px_1fr] lg:px-6">
      <nav aria-label="Inhalt" className="lg:sticky lg:top-28 lg:self-start">
        <p className="font-display text-xs font-bold uppercase tracking-wide text-gold">Inhalt</p>
        <ol className="mt-4 space-y-2 text-sm">{sections.map((s, i) => <li key={s.id}><a href={`#${s.id}`} className="text-muted-foreground hover:text-gold">{i + 1}. {s.title}</a></li>)}</ol>
      </nav>
      <div className="max-w-3xl space-y-10">
        <h1 className="font-display text-3xl font-extrabold uppercase tracking-wide text-foreground sm:text-4xl">Datenschutzerklärung</h1>
        <p className="text-muted-foreground">Informationen nach Art. 13 DSGVO zur Verarbeitung Ihrer personenbezogenen Daten auf dieser Website.</p>
        {sections.map((s, i) => <section key={s.id} id={s.id} className="scroll-mt-28 space-y-3"><h2 className="font-display text-lg font-bold uppercase tracking-wide text-foreground">{i + 1}. {s.title}</h2><div className="space-y-3 leading-7 text-muted-foreground">{s.body}</div></section>)}
      </div>
    </div>
  );
}
