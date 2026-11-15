<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Öffentliche Seiten bleiben als einzelne TanStack-Dateirouten unter `src/routes`; gemeinsame Darstellung liegt im Root-Layout, damit Navigation und Metadaten konsistent und serverseitig auslieferbar sind.
- Fahrzeug-/Bewertungsdaten laufen über src/lib/vehicles.ts (Browser-Client + React Query, explizite Spaltenlisten), damit RLS greift und Queries zentral bleiben.
- Das öffentliche Designsystem ist durchgehend dunkel und nutzt Jost Variable, Source Sans 3 Variable sowie die ink-/tiffany-Tokens aus src/styles.css; Komponenten verwenden nur diese semantischen Tokens, damit alle Seiten markenkonsistent bleiben.
- Siegelkennzeichnungen werden ausschließlich manuell über `seal_indices` gepflegt; Admin-Speichern darf keine automatische Bilderkennung ausführen, damit Händlerangaben erhalten bleiben.
- Fahrzeugbilder werden öffentlich durchgängig im 4:3-Rahmen mit `object-cover` und zentrierter Position gezeigt; eingebrannte Siegel bleiben sichtbar und steuern nur den Historienhinweis.
- Das Startseiten-Titelbild ist eine lokale Montage (`public/hero-autohaus*.webp`) aus eigenem Autohausfoto, Dekler-Ph-Fahrzeugfoto und Original-Logopixeln; Logos werden nie per KI nachgezeichnet.
