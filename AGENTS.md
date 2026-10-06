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

## TechNexus architecture
- Use TanStack Start server functions and Lovable Cloud PostgreSQL for durable content; the fixed framework avoids redundant application servers.
- Store administrator permissions only in user_roles and enforce them in server functions and RLS; UI guards alone do not protect records.
- Store content entities as validated JSON records with indexed visibility status; shared editors keep CRUD consistent across club sections.
- Keep official uploaded brand imagery immutable in asset pointers; browser icons are size-only derivatives of the same source.
- Store club images in private storage and resolve signed viewing URLs for published content; workspace policy prohibits public buckets.
