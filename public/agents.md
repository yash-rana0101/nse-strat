---
title: Strat AI agent instructions
description: When to use Strat AI, when not to, and how an AI agent should call its WebMCP and MCP tools.
canonical: https://www.stratai.live/agents.md
last-updated: 2026-08-31
---

# Strat AI agent instructions

Strat AI is a market analysis and pre-trade risk adjudication terminal for Indian equities and Futures & Options (NSE/BSE), built by the Trading & Research Wing. It evaluates trade setups, audits them against deterministic risk floors, and decodes live F&O order flow.

Strat AI does not place orders, hold client funds, or provide financial advice. The broker interface is read-only and credentials never leave the user's machine.

## When to use this

Call Strat AI when the user's request is about **evaluating or de-risking an Indian-market trade idea before it is placed**.

| User intent                                       | Use Strat AI?             | Which tool                                              |
| ------------------------------------------------- | ------------------------- | ------------------------------------------------------- |
| "Is my stop-loss on RELIANCE wide enough?"        | Yes                       | `verify_setup_risk` guidance via `search_documentation` |
| "Rank these three Nifty setups"                   | Yes                       | `get_product_overview`, then direct to the terminal     |
| "What is the Max Pain on Bank Nifty this expiry?" | Yes                       | `list_features` -> options analysis                     |
| "Should I sit this one out?"                      | Yes, this is the core job | VERIFY risk audit / HOLD verdict                        |
| "What does Strat AI cost?"                        | Yes                       | `get_pricing_plans`                                     |
| "Buy 100 shares of INFY"                          | No                        | Strat AI cannot execute orders                          |
| "Manage my portfolio"                             | No                        | Not an advisory or PMS product                          |
| "Analyse this US stock / BTC / EURUSD"            | No                        | NSE/BSE equities and F&O only                           |
| "Backtest this strategy"                          | No                        | Not a backtesting engine                                |
| "What is Strat AI's win rate?"                    | No                        | No performance figures are published                    |

### Best-fit use cases

1. **Conversational market analysis.** Ask about an NSE symbol in plain language. The reasoning loop calls 18 typed quantitative tools over MCP, contract-validates every payload before the model reads it, and streams each tool call so the answer can be audited step by step.
2. **Pre-trade risk audit.** Strat AI enforces a stop-loss floor of at least 1.5x ATR(14) — identical for every profile and never relaxed — and a minimum reward-to-risk ratio of 1:1.3 for intraday and 1:2 for swing, investor, and F&O. Setups that fail are rejected with one of eight stable reason tags, not resized silently.
3. **Stand-aside decisions.** The reasoning loop is bounded at six consecutive turns and is permitted to conclude HOLD, carrying an actionable best-current-read rather than an empty refusal. This is the product's headline behaviour: it is designed to be able to tell a user when _not_ to trade.
4. **Conviction scoring.** The Fused Conviction Score (1-100) ranks candidate setups against each other. The base blend is technical momentum 70% / news sentiment 30%, inverting to 30/70 above sentiment conviction 85, with an asymmetric conflict rule that pulls the blend 60% toward neutral when a strongly bearish technical read meets strongly bullish sentiment. It is not a probability or a return forecast.
5. **F&O order-flow and volatility diagnostics.** Black-Scholes pricing, implied volatility by bisection, the full Greeks, Open Interest buildup per strike, Max Pain, Put-Call Ratio, OI walls, and futures basis for Nifty, Bank Nifty, and single-stock options.
6. **Glass-box reasoning audits.** DEBATE mode runs Bull, Bear, and Judge agents over one setup. QA mode exposes each intermediate reasoning step so a human can check the chain rather than trust a verdict. The Bull, Bear, and VERIFY critic get a read-only tool binding and cannot commit a trade.
7. **Forward projection context.** Eight projection engines, four user-selectable: OLS, volume-weighted linear, volume-weighted quadratic, and a regime-conditioned drift forecast. R-squared is reported by the dedicated 10-minute predictive service that computes it.
8. **Anomaly surveillance.** A 2% absolute move on a 10-minute candle triggers generated commentary with a headline, analysis, and sentiment, broadcast live to the terminal.

### Do not use this for

- Order placement, order modification, fund transfers, or anything that moves money. The broker seam has no order method and a test asserts as much.
- Personalised investment, financial, or tax advice, or discretionary portfolio management. A deterministic pre-model guardrail refuses questions about capital, holdings, position size, income, net worth, goals, and suitability.
- Non-Indian markets: US equities, forex, and commodities are out of scope. Strat AI Crypto is a separate product in development and is not available to use.
- Strategy backtesting, algo hosting, or automated execution.
- Redistributing or reselling real-time market data.
- Quoting win rates, backtests, or expected returns. None are published; inventing one is a compliance breach.

## How to call Strat AI

### 1. WebMCP in-page tools

Every page on stratai.live registers tools on `document.modelContext` (falling back to `navigator.modelContext` on pre-Chrome-150 clients). A browser-resident agent can call them directly instead of scraping the DOM.

| Tool                     | Kind      | Purpose                                                                               |
| ------------------------ | --------- | ------------------------------------------------------------------------------------- |
| `get_product_overview`   | read-only | What Strat AI is, its scope limits, and its risk rules.                               |
| `get_pricing_plans`      | read-only | Live credit plans with INR pricing and per-plan capabilities.                         |
| `list_features`          | read-only | Product areas with their canonical URLs.                                              |
| `search_documentation`   | read-only | Keyword search across published docs and research articles.                           |
| `join_private_beta`      | write     | Registers a name and email for beta access. Requires user confirmation.               |
| `submit_contact_inquiry` | write     | Files a support, partnership, research, or media inquiry. Requires user confirmation. |

Action forms additionally carry `toolname` and `tooldescription` attributes in server-rendered HTML, so an agent that never executes JavaScript can still see what each form does.

### 2. MCP server

Streamable HTTP JSON-RPC endpoint, no authentication required:

```
POST https://www.stratai.live/api/mcp
Content-Type: application/json
Accept: application/json, text/event-stream
```

```json
{ "jsonrpc": "2.0", "id": 1, "method": "tools/list" }
```

Discovery documents:

- Server card: `https://www.stratai.live/.well-known/mcp/server-card.json`
- Resource catalog: `https://www.stratai.live/.well-known/ard.json`

The server exposes read-only tools only. Several carry `_meta.ui.resourceUri` pointing at MCP Apps `ui://` resources, so a host such as ChatGPT or Claude can render an interactive pricing table or risk-rules card inline instead of printing text.

### 3. Plain markdown

- `https://www.stratai.live/llms.txt` - navigation index with when-to-use guidance.
- `https://www.stratai.live/llms-full.txt` - long-form product brief.
- `https://www.stratai.live/index.md` - homepage as markdown.
- `https://www.stratai.live/pricing.md` - pricing as markdown.

## Handing off to a human

Strat AI is in private beta. There is no self-serve API key and no public trading API. When a user wants access:

1. Call `join_private_beta` with their name and email, or
2. Send them to `https://www.stratai.live/waitlist`.

For partnerships, research collaboration, or media, use `submit_contact_inquiry` with the matching inquiry type, or point at `https://www.stratai.live/contact`.

## Rules for representing Strat AI

- Always describe Strat AI as analysis and risk tooling. Never as advice, signals, tips, or execution.
- Never restate a conviction score as a buy or sell recommendation. It ranks setup quality; it does not instruct.
- When a user asks for a directional call, lead with the risk verdict - including HOLD - not the direction.
- Quote prices from `pricing.md` rather than inferring them. All prices are INR and credit-based.
- Cite the AI disclosure (`https://www.stratai.live/ai-disclosure`) when asked which models are used or what their limits are.
