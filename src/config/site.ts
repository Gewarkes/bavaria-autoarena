export const siteConfig = {
  name: "Bavaria Autoarena GmbH",
  shortName: "Bavaria Autoarena",
  street: "Gewerbestraße 7",
  zip: "94368",
  city: "Perkam",
  phone: "09421 600968390",
  phoneInternational: "+49 9421 600968390",
  phoneHref: "tel:+499421600968390",
  mobile: "0160 6045193",
  mobileInternational: "+49 160 6045193",
  mobileHref: "tel:+491606045193",
  whatsappNumber: "491606045193",
  appointmentHours: "Termine nach Vereinbarung – rufen Sie uns an",
  // TODO: Bestätigte Öffnungszeiten ergänzen, sobald sie vorliegen.
  openingHours: null,
  /** Öffentliche Domain ohne Slash am Ende, z. B. "https://www.bavaria-autoarena.de". Leer = og:image/Canonical bleiben relativ bzw. aus. */
  siteUrl: "",
  mobileDeUrl: "https://home.mobile.de/BAVARIAAUTOARENASTRAUBINGGMBH",
  reviewsUrl: "https://www.mobile.de/bewertungen/BAVARIAAUTOARENASTRAUBINGGMBH",
  rating: { value: 4.7, count: 85, source: "mobile.de" },
  features: { showMonthlyRate: false },
  legal: {
    managingDirectors: ["Edmond Mando", "Tomas Younan"],
    registerCourt: "Amtsgericht Straubing",
    registerNumber: "HRB 13339",
    // TODO: USt-IdNr. nach Erteilung eintragen; bis dahin nur in der Vorschau als ausstehend kennzeichnen.
    vatId: null,
    vatIdPreviewText: "USt-IdNr.: wird nachgereicht",
    responsibleMStV: "Edmond Mando und Tomas Younan, Gewerbestraße 7, 94368 Perkam",
  },
  financingPartners: ["Santander Consumer Bank", "DKB"],
  social: {
    tiktok: "https://www.tiktok.com/@bavaria_autoarena",
    facebook: "https://www.facebook.com/people/Bavaria-Autoarena-Straubing/100057080275525/",
    instagram: "",
    google: "",
  },
  // Repräsentatives Beispiel nach § 6a PAngV – nur sichtbar, wenn features.showMonthlyRate true ist
  financingExample: {
    cashPrice: "[[PLATZHALTER: Barzahlungspreis]]",
    downPayment: "[[PLATZHALTER: Anzahlung]]",
    netLoan: "[[PLATZHALTER: Nettodarlehensbetrag]]",
    months: "[[PLATZHALTER: Laufzeit]]",
    monthlyRate: "[[PLATZHALTER: Monatsrate]]",
    finalRate: "[[PLATZHALTER: Schlussrate]]",
    nominalRate: "[[PLATZHALTER: Sollzinssatz gebunden p. a.]]",
    effectiveRate: "[[PLATZHALTER: Effektiver Jahreszins]]",
    total: "[[PLATZHALTER: Gesamtbetrag]]",
    bank: "[[PLATZHALTER: Darlehensgeber, Anschrift]]",
  },
} as const;

/** Version der Datenschutzerklärung – wird mit jedem Formular gespeichert. */
export const PRIVACY_VERSION = "2026-09-v1";
export const phoneHref = siteConfig.phoneHref;
export const mobileHref = siteConfig.mobileHref;
export const whatsappHref = (text = "Hallo Bavaria Autoarena, ") => `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(text)}`;
export const mapsRouteUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${siteConfig.name}, ${siteConfig.street}, ${siteConfig.zip} ${siteConfig.city}`)}`;
export const currentOpeningStatus = () => siteConfig.appointmentHours;