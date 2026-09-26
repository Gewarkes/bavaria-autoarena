export const tradeInFaq = [
  { q: "Kostet die Bewertung etwas?", a: "Nein. Die Bewertung ist für Sie vollständig kostenlos und unverbindlich." },
  { q: "Muss ich das Auto verkaufen?", a: "Nein. Sie erhalten ein unverbindliches Angebot und entscheiden in Ruhe, ob Sie es annehmen." },
  { q: "Wie schnell bekomme ich das Angebot?", a: "In der Regel innerhalb von 24 Stunden an Werktagen – per Telefon, WhatsApp oder E-Mail, wie Sie es wünschen. Das Angebot gilt unter Vorbehalt einer Besichtigung des Fahrzeugs." },
  { q: "Was ist mit laufender Finanzierung?", a: "Kein Problem. Wir klären die Restschuld mit Ihrer Bank und verrechnen sie mit dem Ankaufspreis." },
  { q: "Kaufen Sie auch Unfallfahrzeuge?", a: "Ja. Geben Sie den Schaden einfach im Formular an – wir bewerten auch Fahrzeuge mit Unfallschaden fair." },
  { q: "Welche Unterlagen brauche ich?", a: "Zulassungsbescheinigung Teil I und II, Ihren Personalausweis, alle Schlüssel sowie – falls vorhanden – Serviceheft und HU-Bericht." },
];

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tradeInFaq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}
