trat Ai — Full Product & System Analysis

1. What the product actually is (one paragraph)

Strat Ai is an institutional-grade, AI-powered desktop trading terminal built for the NSE (Indian markets). It is a proprietary SaaS app that combines: (a) sub-second Rust market-data ingestion from Zerodha Kite, (b) a LangGraph multi-agent LLM reasoning engine (Python) that hunts and defends trade setups, (c) a Rust quantitative tool server that is the single source of truth for all market math, (d) F&O options analytics, (e) a paper-trading engine, and (f) a Tauri + Next.js desktop HUD with a "glass-box" UI that shows the AI's full reasoning, tool calls, and trade plan live. It is delivered as a native desktop app with a Node.js auth + payments backend (Zerodha OAuth, PhonePe, FREE/PRO subscription tiers).

The product name in code/docs is "Strat" / "Strat Ai" (the repo folder is Ai-trader). It is governed by a Proprietary & Confidential License — not open source.

---

2. The four planes (verified architecture)

┌────────────────────┬──────────────┬─────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────────────────────────────┐
│ Plane │ Language │ Services │ Status │
├────────────────────┼──────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────────────────┤
│ Data plane │ Rust │ ingestion (:8085), agents/technical, aggregator (:8080), alpha-terminal, tools/ tool server (:8084) │ Live │
├────────────────────┼──────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────────────────┤
│ Reasoning plane │ Python │ agents/deep-quant-loop (FastAPI + LangGraph, :8086) │ Live — this is the current brain │
├────────────────────┼──────────────┼────────────────────────────────────────────────────────────────────────┼──────────────────────────────────┤
│ Intelligence plane │ Node.js │ agents/sentiment, alpha-backend/auth-service (:3001), alpha-backend/payment-service (:3002) │ Live │
├────────────────────┼──────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────────────────┤
│ Presentation plane │ Rust + React │ Tauri native bridge + Next.js 15 / React 19 HUD │ Live │
└────────────────────┴──────────────┴────────────────────────────────────────────────────────────────────────┴──────────────────────────────────┘

Infrastructure (docker-compose): Redpanda (Kafka), QuestDB (time-series ticks), Rens), PostgreSQL (users/subscriptions/broker).

---

3. The two "designs" — and which one is real today

This is the most important thing to understand for business ops, because the repo g designs and the docs blend them.

Design A — "V1 Signal Pipeline" (original, partly legacy)

ingestion → technical agent → sentiment agent → aggregator → WebSocket BUY/SELL/HOLD conviction score → UI

This is what the README's "Service Catalog" and "Core Execution Flow" describe, and what STATE.md ("Alpha Suite Phase 10.2 — Canvas Order Flow Renderers") tracks. It still runs as the live
market-data fabric: the aggregator still streams live AggregatedDecision messages rontend useTradeStore still opens that WebSocket. But it is no longer thedecision-making brain — it's a background telemetry/feed layer.

Traces of the old design still in the code (verified):

- frontend/src-tauri/src/services/live_bridges.rs — comment explicitly says the Tauri core "used to open three internal WebSocket clients on boot — aggregator OHLC :8081, Predictive :8082, Quant-RAG :8083" and was refactored to lazy boot. Those three Rust engines (agents/predictive OLS regression, agents/quant-rag DeepSeek/NVIDIA-NIM anomaly) still exist and still feed chart "GhostLine" projections, but they are auxiliary, not the decision core.
- STATE.md (Phase 10.2 Volume Profile / Footprint canvas) describes V1-era UI work
- README's environment table and service catalog still list the V1 components as primary — slightly stale framing.

Design B — "Deep Quant Loop" (current, the real product)

User clicks "Find Quant Trade" → Tauri IPC → Python LangGraph agent (:8086) → calls Rust tool server (:8084) → streams SSE reasoning back → UI renders live transcript → commits trade via declare_trade (validated) or arms a price watch

This is the actual decision engine and the differentiator. It is documented in DEEP_QUANT_ANALYSIS.md (74KB, the most current spec) and agents/deep-quant-loop/prompt.md. Git history shows the last ~15 commits are all Deep Quant work.

Bottom line for ops: Pitch and operate around Design B (Deep Quant) as the product. Treat Design A as "the real-time data plumbing" that supports it.

---

4. The Deep Quant reasoning core — the real differentiator

A Python FastAPI service (agents/deep-quant-loop, :8086) running a compiled LangGraph state machine with 4 modes:

┌────────┬─────────────────────────────────────────────────────────────────────────┬──────────────────────────────────────────────────────────────────────────────┐
│ Mode │ What it does │ UI exposure │
├────────┼─────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────┤
│ FIND │ Hunts A+ setups across macro→microstructure; can commit a trade or arm a price watch │ ✅ Toggle in DeepQuantPanel │
├────────┼─────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────┤
│ VERIFY │ Co-pilot risk auditor of a user-proposed trade bracket (SL ≥ 1.5×ATR, R:R ≥ 1:2) + Bear-agent │ ✅ Toggle in DeepQuantPanel │
│ │ devil's advocate │ │
├────────┼─────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────┤
│ DEBATE │ Bull vs Bear agents argue from shared evidence, Judge classifies consensus → calibrated conviction │ ⚠️ Backend-supported, not a UI toggle (frontend activeMode is only │
│ │ 0–100 │ 'FIND'|'VERIFY') │
├────────┼─────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────┤
│ QA │ Ask follow-up questions grounded in the saved session; trade stays immutable │ ✅ Separate TradeQaPanel │
└────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────────────────────────────────────────────────────────────────────────┘

Key engineering principles (all verified in source):

- Glass-box SSE streaming: RUN_STARTED → REASONING / TOOL_CALL_* → DECISION → RUN_FINISHED, streamed live to the AgentTerminal transcript.
- Honest-failure markers: tools return {"unavailable": true} instead of hallucinat
- 20+ tools (tools.py, ~3,600 lines): candles, consensus, multi-TF trend, chart patterns, support/resistance, news, prediction, regime, relative strength, order flow, options analytics, forecast, session context, event risk, watch_price_condition, declare_trade.
- Adaptive Opportunity Engine tiers: a_plus / b_continuation / scalp / stand_asideems and heartbeats.
- Bounded hunt: reasoning budget exhausted → forced HOLD ("no-decision-reached"); never fabricates a plan.
- Resume/watch: agent can suspend; the Rust tool server watches live ticks and POSTs /resume when the level triggers — UI shows a "Watching" state.
- SQLite trade journal with per-setup expectancy tracking; conviction is calibratege is negative.

---

5. Quantitative analytical foundation (the "institutional" math)

All math is in pure, side-effect-free, property-tested modules:

- VWEPR — proprietary Volume-Weighted Exponential Price Regression (quadratic curvacceleration).
- Regime classification — trending / ranging / volatile / quiet (ADX, ATR, Bollinger width, EMA alignment).
- Order flow — CVD, delta, absorption detection, exhaustion detection, OFI.
- Relative strength — vs benchmark, sector rotation, breadth.
- Session engine — NSE IST phases (pre_open → opening → morning → midday → afternoon → closing → post_close), expiry awareness, time-favorability gating.
- Forecasting — regime-aware directional forecast, up-probability, ATR-scaled expected move.
- Options analytics — PCR, max-pain, IV skew (OTM-side), aggregate OI bias, neares

---

6. F&O (Options) data foundation

Fully automated derivatives pipeline:

- option_chain.rs — bounded, deterministic strike-ladder resolver (ATM selection, strike band, nearest expiries).
- option_chain_subscriber.rs — background Tauri task polling spot every 15s, re-subscribing when ATM shifts.
- Ingestion diffs option subscriptions (subscribe new, unsubscribe stale), with option sinks fault-isolated from equity path.
- /options/snapshot endpoint composes analytics + bias into one read-only payload for the F&O workspace.

---

7. Desktop terminal (the product surface)

Tauri Rust core (frontend/src-tauri/):

- Instrument master (SQLite, bulk-synced from Kite).
- Paper-trading engine (execution/paper.rs): fixed 2% risk-per-trade model, tick-by-tick SL/TP evaluation, real-time portfolio updates.
- QuestDB connection pool for historical candles.
- Security vault via @tauri-apps/plugin-stronghold — stores API keys/tokens encrypted (commands/security.rs).
- ~30 IPC commands across charts, deep_quant, fno, instruments, quant, radar, security, sentiment, ticker.

React frontend (frontend/src/):

- 4 workspace profiles: INTRADAY, SWING, INVESTOR, FNO — each switches layout, sidebar, and the agent's analysis horizon.
- Zustand stores: useTradeStore, useQuantStore, useChartUIStore, useAuthStore, use
- AgentTerminal + DeepQuantPanel + AiExecutionPlanView + VerificationForm + TradeQaPanel + QuantRadar.
- HTML5 Canvas overlays (Volume Profile, Level-2 Footprint).
- Tests: Playwright E2E, vitest store property tests, Rust integration tests.

---

8. SaaS / monetization layer (verified)

- auth-service (Node/Express, Prisma, Postgres :3001): login, signup, auth/me, Zerodha broker/connect + callback, upgrade-tier, subscription/tier. Models: User (walletBalance default ₹100,000 virtual), BrokerConnection (Zerodha tokens), Subscription (Stripe / Razorpay customer IDs, status, period end).
- payment-service (Node :3002): PhonePe checkout / webhook / redirect — this is th (Stripe/Razorpay fields exist in schema but PhonePe is the wired route.)
- Tiers: FREE (default on signup) → PRO upgrade (PremiumPaywall component in UI). Deep Quant features sit behind the paywall.
- Broker connection: Zerodha OAuth flow — user connects their Kite account; tokenson table and the Tauri vault.
- MOCK_BROKER env flag exists — lets the app run without a live Zerodha connection (useful for demos/trials).

---

9. Testing & quality (a genuine selling point)

- 278 Python property-based test files (pytest + Hypothesis) covering every pure module — regime, order flow, session/expiry, trade exits, debate/calibration, option chain, SSE ordering, honest-failure markers.
- Rust proptest + integration tests; vitest store invariants; Playwright E2E.
- "Purity-first" design: all quant math is side-effect-free and tested against arb

---

10. Operational setup (what you actually run)

- One-command launch: ignition.sh (Linux/macOS) or scripts/powershell/start_system.ps1 (Windows). Brings up Docker infra → pre-creates Kafka topics → starts services in order.
- Required keys: KITE_API_KEY/SECRET, LLM_API_URL/KEY/MODEL (OpenAI-compatible; default gemini-2.5-flash), NEWSDATA_API_KEY, QUESTDB_POSTGRES_URL, QUESTDB_ILP_ADDR, REDIS_URL, KAFKA_BROKER_URL.
  Optional: FINNHUB_API_KEY, KITE_ACCESS_TOKEN/REQUEST_TOKEN.
- Daily ops note: Kite access token resets at midnight IST; ingestion can exchange a request token for one at startup (:8087).

---

11. What to tell customers / investors (business framing)

- Market: Indian retail/prop traders on NSE (equity + F&O), desktop-first.
- Core differentiators: (1) Glass-box AI reasoning — every trade shows its full chain of thought, tool calls, and risk audit; (2) Self-defending — multi-agent debate + hard risk validator + negative-edge calibration; (3) Institutional microstructure (order flow, VWEPR, oply in Bloomberg-grade tools; (4) Paper trading with 2% fixed risk built in.
- Monetization: FREE → PRO subscription via PhonePe; broker-connected (Zerodha); virtual wallet for paper trading.
- Trust story: property-tested math, honest-failure markers (no hallucinated data), immutable committed trades.
