# Bavaria Arena Launch

Baue die Website für "Bavaria Autoarena" – ein Gebrauchtwagen-Autohaus in Perkam bei Straubing (Niederbayern), das gerade in ein neu gebautes Autohaus eingezogen ist. Gesamte Website, alle Texte und alle UI-Beschriftungen auf DEUTSCH (Sie-Ansprache). Der Plan ist freigegeben – direkt umsetzen, keine Rückfragen.

## SCHRITT 1 (nur dieser Schritt jetzt): Design-System, Layout, Routen

### Markenwelt (aus dem Logo abgeleitet – Premium, nicht Discount)
Das Logo ist ein Wappenschild mit bayerischem Rautenmuster in Gold/Weiß, Schriftzug "BAVARIA" oben im Schild, darunter groß "AUTOARENA" (AUTO in gebürstetem Silber, ARENA in Gold), Claim "Ihr Partner für Mobilität". Das Logo wird als Datei nachgereicht – bis dahin bitte eine SVG-Wortmarke als Platzhalter in `src/components/Logo.tsx` bauen: "AUTO" in Silber-Verlauf, "ARENA" in Gold-Verlauf, darüber klein "BAVARIA" gesperrt, so dass ich sie später einfach durch das PNG ersetzen kann.

Farb-Tokens in `index.css` als HSL-CSS-Variablen und in tailwind.config anlegen:
- Hintergrund: Anthrazit-Blau `#141A26` (dunkelster: `#0C1018`, Karten: `#1C2331`, Rahmen: `#2A3446`)
- Gold: `#C9A961` (hell `#E5D3A0`, dunkel `#A8863E`) – für Primär-Buttons, Akzentlinien, Icons, Sterne. Gold-Verlauf `linear-gradient(135deg,#E5D3A0 0%,#C9A961 45%,#A8863E 100%)` als Utility-Klasse `.bg-gold-gradient` und `.text-gold-gradient` (background-clip: text)
- Silber: `#B8BEC7` für Sekundärtext, Rahmen, Sekundär-Buttons (Outline)
- Text: `#F5F6F8` (Haupt), `#9AA3B2` (gedämpft)
- Erfolg `#3FB27F`, Warnung `#E0A43C`
Kontrast prüfen: Gold-Text auf Anthrazit mindestens 4,5:1, Buttons mit dunklem Text `#141A26` auf Gold.

Schriften (lokal via @fontsource, NICHT von Google Fonts laden – Datenschutz): Überschriften "Montserrat" 700/800 in Versalien mit `tracking-wide`, Fließtext "Inter" 400/500/600. `@fontsource/montserrat` und `@fontsource/inter` installieren, nur die benötigten Schnitte importieren.

Bayerisches Rautenmuster: SVG-Pattern (Rauten 45°, Gold auf Transparent, 5 % Deckkraft) als Utility-Klasse `.bg-rauten` für Hero-Hintergrund und Footer. Feine goldene Trennlinien (1px, 40 % Deckkraft) als Sektionstrenner.

Buttons: `variant="gold"` (Gold-Verlauf, dunkler Text, leichter Glow beim Hover), `variant="silver"` (Outline Silber), `variant="ghost"`. Radius 8px, Höhe 48px auf Mobil. Karten mit 1px Rahmen `#2A3446`, Hover: Rahmen Gold 50 %.

### Konfiguration
`src/config/site.ts` mit allen Kontaktdaten an EINER Stelle: name "Bavaria Autoarena GmbH", street "Gewerbestraße 7", zip "94368", city "Perkam", phone "+49 9421 000000" (Platzhalter), whatsapp "+49 170 0000000" (Platzhalter), email "info@bavaria-autoarena.de" (Platzhalter), openingHours (Mo–Fr 09:00–18:00, Sa 09:00–13:00, So geschlossen – Platzhalter), mobileDeUrl "https://home.mobile.de/BAVARIAAUTOARENASTRAUBINGGMBH", rating { value: 4.7, count: 85, source: "mobile.de", asOf: "09/2026" }, features { showMonthlyRate: false }. Hilfsfunktion `isOpenNow()` und `todaysHours()` für "Heute geöffnet bis 18:00".

### Layout
- Header (sticky, dunkel mit leichtem Blur): Logo links, Navigation "Fahrzeuge · Auto verkaufen · Finanzierung · Über uns · Kontakt", rechts klickbare Telefonnummer (`tel:`) mit Öffnungsstatus ("Heute geöffnet bis 18:00" grün / "Jetzt geschlossen" grau) und Gold-Button "Fahrzeug bewerten" → /auto-verkaufen. Mobil: Burger-Menü (Sheet), Logo mittig.
- Mobile Sticky-Bottom-Bar (nur < md): drei Buttons "Anrufen" (tel:), "WhatsApp" (https://wa.me/<nummer ohne +>?text=Hallo%20Bavaria%20Autoarena,%20...), "Auto verkaufen" (Gold). Auf Fahrzeug-Detailseiten wird der WhatsApp-Text mit Fahrzeugtitel und Preis vorausgefüllt (Prop).
- Footer: Rautenmuster-Hintergrund, 4 Spalten: Logo + Claim "Ihr Partner für Mobilität" + kurzer Text; Kontakt (Adresse, Telefon, E-Mail, Öffnungszeiten); Links (Fahrzeuge, Auto verkaufen, Finanzierung, Über uns, Kontakt); Rechtliches (Impressum, Datenschutz). Unten: "© 2026 Bavaria Autoarena GmbH · Perkam bei Straubing" und Hinweis "Alle Preise sind Endpreise in Euro. Zwischenverkauf und Irrtum vorbehalten."
- Routen (React Router, jede Seite eigene Datei in `src/pages/`, mit `React.lazy`): `/` Startseite, `/fahrzeuge`, `/fahrzeuge/:slug`, `/auto-verkaufen`, `/auto-verkaufen/danke`, `/finanzierung`, `/ueber-uns`, `/kontakt`, `/impressum`, `/datenschutz`, `/admin` (vorerst Platzhalter), 404-Seite. Vorerst jede Seite nur mit H1 und einem Satz – Inhalte kommen in den nächsten Schritten.
- `react-helmet-async` einbinden mit `<Seo title description />`-Komponente; Standard-Titel-Muster "… | Bavaria Autoarena Perkam". `lang="de"` im HTML, Favicon-Platzhalter.
- ScrollToTop bei Routenwechsel, `prefers-reduced-motion` respektieren, Bilder immer mit `width`/`height`/`loading="lazy"`.

Nach dem Bau: kurz zusammenfassen, welche Dateien angelegt wurden.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://bavaria-autoarena.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d2bb6979-9555-497f-bf27-273b016d5955).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
