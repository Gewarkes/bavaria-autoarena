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
- The homepage hero uses dedicated CDN asset pointers for desktop and 4:5 mobile crops of the original building photo; preserve architecture, mount original logo pixels above the garage, and keep unrelated page images unchanged. Frame the garage on the left and place desktop copy on the right to avoid obscuring the sign; retain optional `videoSrc` with the same poster.

- Stimmungsbilder (alles außer echten Bestandsfotos) zeigen keine Hersteller-Embleme oder Markenschriftzüge und liegen als kühl-dunkel gegradete Dateien in `src/assets`, damit keine fremden Marken beworben werden.
- `Reveal` versteckt nur Inhalte, die beim Laden unterhalb des Sichtbereichs liegen, und blendet sie vor Erreichen des Rands ein, damit ohne JavaScript oder bei schnellem Scrollen nichts unsichtbar bleibt.