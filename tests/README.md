# Co-Pilot demo browser checks

Start the site with `pnpm dev` (or use the managed Preview), then run:

```sh
node tests/copilot-demo.mjs http://127.0.0.1:4321/
```

Requires the `agent-browser` CLI with its browser installed. The test creates a separate browser session, uses only fixed demo data, and closes the session afterwards. It covers FIND, VERIFY, every preset answer, sequential phases, keyboard activation, replay, cancellation, reconnection, mobile containment and reduced motion. Tool-specific assertions also cover the 18-tool library, all 11 screenshot calls, completion ordering, automatic terminal scrolling, retained telemetry and active-node pop styling.

<!-- BEGIN:folder-context -->
## Folder context

Checks and fixtures for the surrounding implementation. Read the named cases and nearby source; running them requires owner permission.

[Repository overview](../README.md) · [Agent instructions](../AGENTS.md) · [Parent context](../README.md)

### Files to start with

- [`copilot-demo.mjs`](copilot-demo.mjs) — declares `browser`, `check`, `complete`, `observePhases`.
- [`copilot-tools.mjs`](copilot-tools.mjs) — declares `checkDiagramSizes`, `checkToolLibrary`, `observeToolActivity`, `checkCompletedTools`.

Update this context and the relevant detailed Markdown whenever files, responsibilities, contracts or setup change. Record code inspection separately from checks actually run.
<!-- END:folder-context -->
