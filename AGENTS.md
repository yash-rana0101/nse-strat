<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Hard constraints — always confirm with the user first

- **Never run lint, format, build, or test commands** (npm run lint, lint:fix, format, build, test, vitest, tsc/typecheck, etc.) without explicit confirmation from the user first, even if a pre-commit hook or another doc in this repo suggests running them.
- **Never run git commands** (status, diff, add, commit, push, branch, etc.) without explicit confirmation from the user first.
- **Never use git worktrees.**
- **Always follow the KISS principle** — prefer the simplest solution that works over clever or speculative abstraction.
