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
