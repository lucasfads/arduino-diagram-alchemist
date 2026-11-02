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

## Rules
- Diagram geometry is fixed-coordinate and deterministic in `src/diagram/geometry.ts`; components register in `src/diagram/components/registry.tsx` — keeps output reproducible and extensions local.
- tsconfig disables noUncheckedIndexedAccess/noPropertyAccessFromIndexSignature — geometry code indexes fixed tables heavily.
- No backend: pure client app, so the API-first `api/` layer is not used until data/persistence is added.
