🏛️ Product Overview -- Strat Ai

Strat Ai is an institutional-grade, AI-powered quantitative trading terminal built for the NSE (National Stock Exchange of India). It's a native desktop app (Tauri + Next.js + React 19) backed by a multi-language microservice fabric (Rust + Python + Node.js) that fuses live market microstructure, multi-agent LLM reasoning, and property-tested math into a single "glass-box" trading experience.

Current product identity: "Strat Ai — TRW (Trading & Research Wing) design system" — dark-mode, borderless, high-density HUD.

---

🧩 Core Feature Categories

1. Market Data & Ingestion (Rust)

- Zerodha Kite WebSocket ingestion — binary tick parsing (big-endian) into Protobuf Tick messages
- Dynamic subscription diffing — boots with zero subscriptions; the UI drives subscribe/unsubscribe/option_chain_set via TCP control port 8085
- Kite OAuth token exchange — auto-exchanges request token → access token at startup (port 8087)
- Dual-sink routing — equity ticks → Kafka + QuestDB; option ticks → isolated async tasks (fault isolation, no late
- Multi-source candle fusion — Daily archive ∪ Intraday cache ∪ Live tick aggregates, with priority resolution (Live > Intraday > Daily)
- Real-time OHLC aggregation — alpha-terminal (Rust) aggregates ticks into candles, WS broadcast

2. Storage & Streaming Infrastructure

- Redpanda (Kafka) — event backbone; topics market.ticks, technical_signals, sentiment_signals, trade_decisions (pre-created via ignition.sh to avoid race conditions)
- QuestDB — time-series tick storage (live_ticks, option_ticks, option_chain_snapshots, historical_candles, histori:8812, HTTP :9000, ILP :9009
- Redis — sentiment cache/dedup, session store
- PostgreSQL — auth, payment, subscription persistence (Prisma)
- SQLite (Tauri-local) — instrument master, trade journal

3. The Deep Quant AI Reasoning Core (Python / LangGraph) ⭐ primary product feature

The "brain" — FastAPI service on :8086 running a compiled LangGraph state machine. ~29K lines across 23 modules.

Four operational modes:

- FIND Mode — "Directional Hunter" — scans active timeframe, walks the macro→microstructure tool pipeline, identifies A+ setups, commits via declare_trade or arms watch_price_condition
- VERIFY Mode — "Co-Pilot Risk Auditor" — audits a user-proposed trade bracket against live ATR/Bollinger/S-R, runse critique
- DEBATE Mode — "Multi-Agent Consensus" — Bull Agent ↔ Bear Agent debate (N bounded rounds) → Judge Agent classifies consensus (STRONG_FLOOR / STRONG_GAP / CONTESTED_GAP) → calibrated conviction 0–100
- QA Mode — "Interactive Auditing" — follow-up questions grounded in persisted thread memory (MemorySaver checkpointer); the committed Declared_Trade is immutable under Q&A

Reasoning subsystems (each a pure, property-tested module):

- VWEPR — proprietary Volume-Weighted Exponential Price Regression (quadratic curvature via Cramer's rule) for S/R
- Regime classifier — Trending / Ranging / Volatile / Quiet (ADX, ATR, Bollinger width, EMA alignment)
- Order flow analysis — CVD, delta, absorption detection, exhaustion detection, OFI
- Relative strength — vs benchmark, sector rotation, market breadth
- Forecaster — regime-aware directional forecast, up-probability, ATR-scaled expected move
- Session engine — NSE IST phases (pre_open → opening → morning → midday → afternoon → closing → post_close), expiry awareness, time-favorability gating
- Multi-agent debate — Bull/Bear/Judge with independent per-role LLM models
- Conviction calibration — stance-consensus → conviction, adjusted downward by journal's historical expectancy
- Trade manager / simulator — multi-leg exits, breakeven triggers, trailing stops
- Backtest engine — historical simulation with bracket/trailing exit modeling
- Trade journal — SQLite-backed expectancy tracking ($R), per-setup-type edge
- Adaptive Opportunity Engine — opportunity tiers (a_plus / b_continuation / scalp / stand_aside), watch cycles, invalidation post-mortem, heartbeat resumes
- Options bias classifier — derives directional bias from PCR, max-pain, OI walls

4. Rust Quantitative Tool Server (:8084)

HTTP API the LangGraph agent calls for all market math (single source of truth):

- get_candles, get_consensus, get_support_resistance, get_multi_tf_trend
- get_chart_patterns (19 detectors: engulfing, hammer, doji, morning star, etc.)
- get_prediction (OLS / VWLR / VWEPR), get_news_context
- watch_condition (arms live-tick watcher that POSTs /resume on trigger)
- declare_trade (hard risk validator: SL ≥ 1.5×ATR, R:R ≥ 1:2; profile-aware floor — INTRADAY 1:1.5)
- VWAP, EMA (multi-period), Pivot S/R, Volume Profile (POC/VAH/VAL)
- Load tester — chaos engine with anomaly injector

5. Glass-Box Transparency (SSE streaming)

- Event protocol: RUN_STARTED → [REASONING | TOOL_CALL_START | TOOL_CALL_RESULT | TOOL_CALL_END | VERIFICATION_STEP | DECISION]* → RUN_FINISHED
- Strict ordering invariants: TOOL_CALL_START always precedes its RESULT/END; failed LLM stream emits ERROR with no fabricates a plan)
- Honest-failure markers — upstream tool failures return {"unavailable": true} instead of fabricated data; LLM discloses unavailability in reasoning
- Bounded reasoning budget — N consecutive reasoning-only turns → forced HOLD with no-decision-reached
- Session telemetry — measurement-only, best-effort observation layer that can never take the endpoint down

6. Desktop Terminal (Tauri + Next.js + React 19)

- Native desktop app — Tauri Rust core + Next.js HUD, IPC bridge
- 20+ Tauri IPC commands across 9 modules: charts, deep_quant, fno, instruments, quant, radar, security, sentiment,
- Workspace profiles — INTRADAY / SWING / INVESTOR / FNO (each adapts data-gathering + analysis horizon + R:R floor)
- Charting — HTML5 Canvas overlays: Volume Profile, Level-2 Footprint, custom order-flow renderers (Phase 10.2 complete)
- Ghost-line projections — predictive trend overlays on TradingView-style charts (useGhostLine)
- Split-chart view — side-by-side symbol comparison (INTRADAY/FNO)
- Layout components: IntradayLayout, SwingLayout (+ Confluence panel), InvestorLayout (+ Macro Sentiment panel), Fn
- AgentTerminal — live reasoning transcript with Markdown rendering, thinking groups, tool-execution steps, actionable trade plan
- Zustand stores: useTradeStore, useQuantStore, useChartUIStore, useAuthStore, useRadarStore

7. F&O / Options Workspace

- Bounded option chain resolution — ATM strike selection, strike-band window, nearest-expiry filtering
- Option chain subscriber — polls spot every 15s, re-subscribes when ATM shifts past threshold
- Options analytics — IV skew (OTM-side), PCR, max-pain, OI walls, aggregate OI bias, representative per-strike IV
- F&O UI — OI chain table, OI profile chart, IV skew chart, options HUD, metrics HUD, snapshot caching, live/most-recent status
- /options/snapshot endpoint — thin composition-only transport seam over F1/F2/F3 analytics

8. Paper Trading Engine

- Virtual portfolio in Tauri memory, fixed 2%-risk model: Qty = ⌊0.02 × Balance / |Entry − SL|⌉
- Tick-by-tick position monitoring — auto-close on SL/TP hit
- Real-time UI updates via paper_portfolio_update events
- Position states: OPEN → CLOSED_WIN | CLOSED_LOSS, running P&L on each closure

9. SaaS / Business Layer (Node.js) 💳 monetization

- Auth Service (:3001) — Express + Prisma + PostgreSQL + JWT
  - /auth/login, /auth/signup, /auth/me, /auth/subscription/tier
  - /broker/zerodha/connect + /broker/zerodha/callback (OAuth)
  - /internal/upgrade-tier
- Payment Service (:3002) — Express + Prisma
  - PhonePe checkout — /phonepe/checkout, /phonepe/webhook, /phonepe/redirect (India-native UPI payments)
- Subscription model (Prisma schema): User (email, walletBalance default ₹100,000, tier default FREE) → BrokerConnection (Zerodha tokens) → Subscription (Stripe/Razorpay customer IDs, status, currentPeriodEnd)
- Premium paywall — PremiumPaywall component gates PRO features ("Upgrade to PRO")
- Security vault — @tauri-apps/plugin-stronghold for API-key storage; commands save_api_key, check_api_key_exists, hydrate_key_cache, vault_store_token, open_browser
- Deep-link payment-success handling — frontend intercepts payment success event and refreshes user profile

10. Auxiliary Agents (Rust) ⚠️ partially legacy

- Technical Agent (Rust) — RSI, Bollinger, MACD, EMA crossovers → technical_signals Kafka topic (still in README; check if actively consumed)
- Sentiment Agent (Node.js) — NewsData.io + RSS polling, Finnhub company profiling, LLM classification (Gemini/Claude/OpenAI), Redis caching → sentiment_signals
- Predictive Agent (Rust) — OLS & linear regression projection (:8082)
- Quant-RAG Agent (Rust) — DeepSeek anomaly analysis via NVIDIA NIM (:8083)
- Aggregator (Rust, :8080) — fuses technical + sentiment signals (default 70/30 weight) → AggregatedDecision (BUY/SELL/HOLD + conviction 1–100), WS broadcast; dynamic conflict resolution → HOLD when signals diverge

▎ ⚠️ Verification note: The V1 signal pipeline (Technical Agent → Aggregator → WS :8080) still appears wired in useTradeStore.connectWebSocket and live_bridges.rs, but the active product surface is the Deep Quant LangGraph agent, which calls the Rust Tool
▎ Server directly and largely bypasses the Kafka aggregator path. The predictive (:8082) and quant-rag (:8083) bridirst subscribe_ticker. These V1 components are co-existing but secondary to the Deep Quant core.

11. Testing & Quality Foundation

- 278 Python property-based test files (pytest + Hypothesis) — regime, order flow, session, trade manager, debate, calibration, option chain, SSE ordering, F&O config totality, honest-failure markers
- Rust integration tests — cargo test + proptest (API + quant computation)
- 6 Zustand store test files (vitest) — state invariants, immutability, interaction contracts

- Purity-first design — all quant math in side-effect-free functions

12. Operations & Deployment

- Docker Compose stack — Redpanda, QuestDB, Redis, Postgres
- ignition.sh — one-command Linux/macOS launcher (infra → Kafka topic pre-creation → services in dependency order)
- scripts/powershell/ — Windows launcher suite (start_system.ps1, infra.ps1, backend.ps1, frontend.ps1, auth.ps1, stop-infra.ps1)
- Environment-driven config — root .env drives LLM provider, Kafka, QuestDB, Redis, Kite, NewsData, Finnhub

---

🚦 Honest Status Notes (so your business ops are grounded)

┌──────────────────────────────────────────────────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Area │ Status │
├──────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Deep Quant agent + Tool Server + Tauri UI │ ✅ Active, primary product. Most recent commits (last 10) all extend this. │
├──────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ F&O workspace, Volume Profile, Footprint canvas │ ✅ Active (Phase 10.2 complete). │
├──────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Auth + Payment (PhonePe) + Subscription + Vault │ ✅ Present and structured for SaaS. │
├──────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ V1 Technical/Sentiment/Aggregator Kafka pipeline │ ⚠️ Still in code & README, but superseded by Deep Quant for trrelying on it in pitches. │
├──────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Predictive + Quant-RAG agents │ ⚠️ Built with release targets; lazy-loaded bridges only. Secondary. │
├──────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ DEBATE / QA modes in UI │ ⚠️ Backend fully implemented; the DeepQuantPanel UI currently toggles. DEBATE/QA reachable via backend//qa but not as first-class UI buttons. │
├──────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Live broker order execution (real money) │ ❌ Not present — only paper trading. Zerodha connection is for data + account profile, not live order placement. │
