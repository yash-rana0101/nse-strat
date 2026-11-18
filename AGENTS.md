# Strat AI stock-landing website — agent instructions

This repository uses Astro, not Next.js. Read `astro.config.mjs`, `package.json` and the owning folder context before framework changes.

## Hard constraints — always confirm with the user first

- **Never run lint, format, build, or test commands** (npm run lint, lint:fix, format, build, test, vitest, tsc/typecheck, etc.) without explicit confirmation from the user first, even if a pre-commit hook or another doc in this repo suggests running them.
- **Never run git commands** (status, diff, add, commit, push, branch, etc.) without explicit confirmation from the user first.
- **Never use git worktrees.**
- **Always follow the KISS principle** — prefer the simplest solution that works over clever or speculative abstraction.

<!-- BEGIN:current-repository -->
## Current checkout

Stock-specific marketing site; stock feature copy must be distinguished from release availability in the shared brand site. The code is an Astro 7 static website with React islands, Tailwind CSS, MDX and the Vercel adapter; it is not a Next.js terminal or Rust service monorepo.

Read [the repository overview](README.md) for source-backed boundaries and the folder-context map. Source inspection: 2026-11-18; no live deployment or check results are implied.
<!-- END:current-repository -->

<!-- BEGIN:documentation-maintenance -->
## Documentation maintenance

- Read the owning folder's `README.md` or `CONTEXT.md` and relevant detailed docs before changing code.
- In the same change, update the relevant Markdown for changed behavior, routes, schemas, configuration names, dependencies, setup or deployment. Update the repository overview and cross-repo architecture when their contracts change.
- Every maintained first-party folder must have a context Markdown file. Reuse a useful `README.md`; otherwise maintain `CONTEXT.md`. Keep it specific to the folder, with its purpose, entry files and links to parent/child context.
- Document new, moved and removed files at their owning folder; fix affected links and remove obsolete active instructions. Preserve dated plans, audit evidence, transcripts and fixture provenance as history, clearly separated from current implementation.
- Keep public product Markdown consistent with the constants and routes that publish it. Do not insert context files into content collections or fixture loaders without checking whether they will be ingested as application data.
- Exclude dependencies, Git metadata, generated/build output, caches, runtime data and vendored libraries from folder-context coverage. Never copy secrets or environment-file values into docs.
- Verify documentation by reading source. Do not claim checks passed unless they were actually run with permission. Lint, format, build, tests, typechecks, database operations and Git operations retain the owner's approval rules; never use worktrees.
<!-- END:documentation-maintenance -->
