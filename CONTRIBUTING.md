# Contributing to Strat

Command examples in this guide are references. Agents must ask before running lint, format, build, tests, typechecks, database operations or Git commands, as required by the workspace and repository `AGENTS.md`. Never use worktrees. Keep the owning folder context and relevant detailed Markdown updated with code changes.

<!-- BEGIN:codebase-alignment -->
## Codebase alignment (2026-11-18)

Scope: Stock-specific marketing site; stock feature copy must be distinguished from release availability in the shared brand site. The code is an Astro 7 static website with React islands, Tailwind CSS, MDX and the Vercel adapter; it is not a Next.js terminal or Rust service monorepo.

- This checkout is an Astro website. Terminal/backend paths in retained product research describe separate repositories.
- Public capabilities and availability must follow `src/constants/agent.ts`; scripted demos, planned features and copied catalogues do not prove shipped backend behavior.

Implementation references: [`package.json`](package.json), [`astro.config.mjs`](astro.config.mjs), [`src/content.config.ts`](src/content.config.ts), [`src/services/content.ts`](src/services/content.ts).

Verification for this update was source/document inspection only. Previous test totals and deployment observations retain their original dates. No credentials, live host state or external policy claims were revalidated.
<!-- END:codebase-alignment -->

This is a **private, proprietary codebase**. Contributions are restricted to authorized internal developers and partners only. If you have been granted access, please read and follow these guidelines strictly to ensure code quality, performance, and security.

---

## 1. Codebase Architecture

Strat is structured as a monorepo containing multiple high-performance services written in Rust, Node.js, and TypeScript/Next.js:

- `/ingestion`: Ingests raw binary ticks from Zerodha Kite (Rust)
- `/alpha-terminal`: Aggregates ticks into tumbling 10m OHLC candles (Rust)
- `/agents`: Intelligence layer (Technical, Sentiment, Predictive, Quant-RAG agents)
- `/aggregator`: Decision fusion and strategy engine (Rust)
- `/auth`: Authentication microservice (Node.js/Express)
- `/frontend`: Tauri desktop shell and Next.js trading UI
- `/tools`: Simulation and load testing utilities

Before working on any service, read `AGENT_CONTEXT.md` for complete API interfaces, ports, and architectural constraints.

---

## 2. Development Workflow

### Step 1: Clone and Infrastructure

Ensure Docker is running and spin up the local infrastructure:

```bash
docker-compose up -d
```

This starts QuestDB (TSDB), Redpanda (Kafka), PostgreSQL (Auth DB), and Redis.

### Step 2: Running in Test Mode

For local development without active Zerodha Kite credentials, run the project in test mode by setting the environment variable:

```bash
ALPHA_TEST_MODE=true
```

This forces the ingestion pipeline to use the `/tools/load_tester` mock data generator.

### Step 3: Run Order

To launch the full stack, open multiple terminal windows or runs:

1. Ingestion: `cargo run --bin ingestion`
2. OHLC Engine: `cargo run --bin alpha-terminal`
3. Agents (Predictive, Quant-RAG, Technical, Sentiment)
4. Decision Aggregator: `cargo run --bin aggregator`
5. Tauri/Frontend Desktop App: `cd frontend && npm run tauri dev`

---

## 3. Git Rules & Branching

- **Branch Naming:**
  - Features: `feature/your-feature-name`
  - Bug Fixes: `bugfix/issue-description`
  - Hot Fixes: `hotfix/critical-patch`
- **Pull Requests:**
  - Target the `main` branch.
  - Every pull request must pass the automated test suites (Tauri tests, Cargo checks, Playwright E2E).
  - Requires a minimum of 1 code review approval.
- **Commit Messages:** Follow semantic commit messages:
  - `feat: add MacdHistogram calculation to consensus`
  - `fix: handle null values in Google News RSS scraper`
  - `perf: optimize chart updates by bypassing React state`

---

## 4. Code Quality & Standards

### Secrets and API Keys

> [!CAUTION]
> **NEVER COMMIT plaintext API keys, passwords, or credentials.**
> All Zerodha Kite credentials and private credentials must be stored locally in the desktop client using the Tauri Stronghold Vault (uses Argon2id key derivation and AES-256 encryption). If any secret is accidentally committed to Git, notify the team instantly, invalidate the secret immediately, and rewrite git history to remove it.

### Rust Style

- Run `cargo fmt` before staging files to ensure styling compliance.
- Keep compiler warnings to zero. Use explicit types instead of broad castings where possible.
- Verify your math against `technical_indicators_analysis.md`.

### TypeScript / Next.js / CSS Style

- All UI layouts must adhere to `DESIGN.md` tokens. Never use arbitrary hex codes or random padding; rely on the HSL CSS custom properties.
- Render interactive components with smooth transitions using ease-out-expo easing: `cubic-bezier(0.16, 1, 0.3, 1)`.
- Support `prefers-reduced-motion` media queries globally.
- Keep numbers and monospace values in the UI wrapped with `font-mono` (JetBrains Mono).
- Chart updates **must bypass React reconciliation state** and be updated directly using Lightweight Charts API references to maintain sub-50ms latency.

---

## 5. Reporting Issues & Feedback

If you spot a bug or want to propose a new quantitative feature:

1. Create a detailed issue on our private GitHub repository.
2. Outline the steps to reproduce, actual vs expected behavior, and service logs.
3. If it is a security vulnerability, do NOT create a public issue. Follow the instructions in [SECURITY.md](file:///d:/projects/aitrader-landing/SECURITY.md) immediately.

<!-- BEGIN:context-navigation -->
Folder map: [current folder context](README.md). Keep this document and the relevant context aligned with code changes.
<!-- END:context-navigation -->
