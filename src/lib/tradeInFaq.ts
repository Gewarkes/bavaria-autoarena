export const tradeInFaq = [
  { q: "Kostet die Bewertung etwas?", a: "Nein. Anfrage und Angebot sind kostenlos, egal ob Sie verkaufen oder nicht." },
  { q: "Muss ich verkaufen, wenn ich angefragt habe?", a: "Nein. Sie bekommen den Preis, dann entscheiden Sie. Wir rufen auch nicht dreimal nach." },
  { q: "Wie schnell bekomme ich das Angebot?", a: "Am nächsten Werktag. Anfragen vom Samstagnachmittag beantworten wir am Montag." },
  { q: "Was ist, wenn das Auto noch finanziert ist?", a: "Das geht. Sie nennen uns die Bank und die Restschuld, wir lösen den Kredit mit dem Ankaufspreis ab und zahlen Ihnen die Differenz aus." },
  { q: "Kaufen Sie auch Unfallfahrzeuge?", a: "Ja, auch mit nicht reparierten Schäden. Geben Sie den Schaden im Formular an und hängen Sie Fotos an, dann fällt das Angebot realistischer aus." },
  { q: "Welche Unterlagen brauche ich?", a: "Zulassungsbescheinigung Teil I und II, alle Schlüssel, Serviceheft und HU-Bericht (falls vorhanden) und Ihren Personalausweis. Bei laufender Finanzierung die Ablöseinformation der Bank." },
];

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tradeInFaq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}
