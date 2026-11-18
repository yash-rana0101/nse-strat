# Strat AI stock-landing website

Source inspection: 2026-11-18. This describes the checked-out code and configuration; it does not certify the live deployment or a passing test suite.

## Current implementation

Stock-specific marketing site; stock feature copy must be distinguished from release availability in the shared brand site. The code is an Astro 7 static website with React islands, Tailwind CSS, MDX and the Vercel adapter; it is not a Next.js terminal or Rust service monorepo.

- `astro.config.mjs` configures `output: static`, React/MDX/sitemap integrations, Tailwind through Vite and the Vercel adapter. Its current `site` value is `https://www.stratai.live`; verify domain configuration separately for a deployment.
- `src/pages/` defines Astro routes and server endpoints; `src/layouts/`, `src/components/` and `src/styles/` define presentation. `src/content/landing/` holds typed marketing copy and demo data.
- `src/services/content.ts` fetches blogs, docs, features, changelogs and policies from the separate content API. The content-collection configuration retains blog/docs/features loaders even where those local folders are absent.
- `src/utils/agent/` implements public product-information MCP/WebMCP tools. Browser action tools use page forms; the HTTP product MCP server advertises read-only tools. This is separate from `strat-mcp`, the authenticated market-data connector.
- `public/index.md` and `public/agents.md` are published machine-readable product documents. Keep them consistent with `src/constants/agent.ts`, and distinguish scripted demos from live market data.
- The package scripts are Astro dev/build/preview/check commands. There is no npm `test` script; `tests/` contains browser-check scripts with their own README.

Source: [`package.json`](package.json), [`astro.config.mjs`](astro.config.mjs), [`src/content.config.ts`](src/content.config.ts), [`src/services/content.ts`](src/services/content.ts), [`src/constants/agent.ts`](src/constants/agent.ts), [`src/utils/agent/readTools.ts`](src/utils/agent/readTools.ts), [`src/utils/agent/mcpServer.ts`](src/utils/agent/mcpServer.ts), [`src/utils/agent/actionTools.ts`](src/utils/agent/actionTools.ts).

## Script reference

These names come from `package.json`. Ask before running lint, format, build, test, typecheck, database or deployment operations; installation hooks may also build or generate files.

| Script | Definition |
|---|---|
| `dev` | `astro dev` |
| `build` | `astro build` |
| `preview` | `astro preview` |
| `astro` | `astro` |
| `lint` | `eslint .` |
| `lint:fix` | `eslint . --fix` |
| `format:check` | `prettier --check .` |
| `format` | `prettier --write .` |
| `typecheck` | `astro check` |

## Content ownership

Product copy and demo sequences belong to `src/content/landing/` and `src/constants/agent.ts`; pages/components render them. The blog API supplies remote editorial content. Browser demos do not exercise a running trading backend. Avoid copying stock-specific options, session or pricing details into crypto or shared-platform claims.

## Working in this repository

Read [AGENTS.md](AGENTS.md) and [CLAUDE.md](CLAUDE.md). Update the owning folder context and affected detailed documents with each code change. No lint, build, format, test or typecheck commands were run for this refresh.

## Detailed references

- [AGENT_CONTEXT.md](AGENT_CONTEXT.md)
- [AI_DISCLOSURE.md](AI_DISCLOSURE.md)
- [AI_MODEL_GOVERNANCE.md](AI_MODEL_GOVERNANCE.md)
- [BRAND_GUIDELINES.md](BRAND_GUIDELINES.md)
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- [CONTRIBUTING.md](CONTRIBUTING.md)
- [FEATURE_CATALOGUE.md](FEATURE_CATALOGUE.md)
- [SECURITY.md](SECURITY.md)
- [design.md](design.md)
- [details.md](details.md)
- [strat_ai_definitive_product_context.md](strat_ai_definitive_product_context.md)

<!-- BEGIN:folder-context -->
## Folder context

Stock-specific marketing site; stock feature copy must be distinguished from release availability in the shared brand site. The code is an Astro 7 static website with React islands, Tailwind CSS, MDX and the Vercel adapter; it is not a Next.js terminal or Rust service monorepo.

[Agent instructions](AGENTS.md) · [Parent context](../CONTEXT.md)

### Files to start with

- [`package.json`](package.json)
- [`astro.config.mjs`](astro.config.mjs)
- [`vercel.json`](vercel.json)

### Child directories

| Directory | Context |
|---|---|
| `.claude/` | [.claude](.claude/CONTEXT.md) |
| `.github/` | [.github](.github/CONTEXT.md) |
| `.husky/` | [.husky](.husky/CONTEXT.md) |
| `docs/` | [docs](docs/CONTEXT.md) |
| `public/` | [public](public/CONTEXT.md) |
| `src/` | [src](src/CONTEXT.md) |
| `tests/` | [tests](tests/README.md) |

Update this context and the relevant detailed Markdown whenever files, responsibilities, contracts or setup change. Record code inspection separately from checks actually run.
<!-- END:folder-context -->
