# src/services

<!-- BEGIN:folder-context -->
## Folder context

Request handling or service logic for `src/services`. Follow the registered routes, validation and persistence/upstream calls in the local files.

[Repository overview](../../README.md) · [Agent instructions](../../AGENTS.md) · [Parent context](../CONTEXT.md)

### Files to start with

- [`content.ts`](content.ts) — declares `DbBlog`, `DbDoc`, `DbFeature`, `DbChangelog`.
- [`pricing.ts`](pricing.ts) — declares `fetchPlans`.
- [`support.ts`](support.ts) — declares `submitContactInquiry`.
- [`wishlist.ts`](wishlist.ts) — declares `joinWishlistWithEmail`, `joinWishlistWithGoogle`.

Update this context and the relevant detailed Markdown whenever files, responsibilities, contracts or setup change. Record code inspection separately from checks actually run.
<!-- END:folder-context -->
