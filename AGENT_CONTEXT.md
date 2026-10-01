# Strat AI: Market Analysis & Pre-Trade Risk Terminal

> **Evaluate Setups with Quantitative Rigor. Pre-Trade Risk Adjudication for NSE/NFO.**
> Strat AI is a market analysis and pre-trade risk adjudication terminal purpose-built for the Indian Equities sector (NSE) and Futures & Options (F&O). It evaluates trade setups through multi-agent research loops, enforces deterministic stop-loss floors (≥ 1.5× ATR), and streams glass-box reasoning directly to the trader.

---

## The Philosophy: Objective Pre-Trade Risk Evaluation

Trading decisions in Indian markets are often complicated by conflicting media noise and lagging indicators.

Retail traders frequently suffer from behavioral pitfalls: entering trades without structural edge, setting stop losses that are too tight for market volatility, and failing to account for derivative market positioning.

**Strat AI provides an objective pre-trade research and risk layer.** It evaluates trade setups against deterministic mathematical rules, analyzes options open interest concentration, and stress-tests trade ideas with an adversarial Bear Agent critique before capital is committed.

---

## Core Capabilities

Strat AI provides an immersive, deeply analytical research environment:

### 1. Options & Volatility Analytics (F&O)

- **Institutional Concentration:** Analyzes open interest shifts, volume profile Point of Control (POC), and volatility skews to map derivative positioning.
- **Friction Points:** Maps Max Pain levels, strike buildup walls, and Put-Call Ratio (PCR) velocity to highlight structural market support and resistance.

### 2. Pre-Trade Risk Auditor & Multi-Agent Co-Pilot

- **1.5× ATR Stop Floor:** Deterministically rejects proposed trade brackets with stop losses tighter than 1.5× the 14-period ATR.
- **Reward-to-Risk Validation:** Enforces minimum profile thresholds (1:1.3 intraday / 1:2 swing).
- **Adversarial Critique:** Spawns a Bear Agent to attack the setup thesis, highlighting VWAP resistance, option walls, and session chop.

### 3. Market Surveillance & Anomaly Commentary

- **Surveillance Engine:** Scans for structural anomalies, including ≥ 2% candle moves and sector volume surges.
- **Context Commentary:** Explains the news drivers and market sentiment behind sudden volatility moves without guessing or fabricating data.

### 4. 10-Minute Trajectory Projections

- **OLS Linear Regression:** Plots rolling 14-period ordinary least squares trajectories on 10-minute candles.
- **R² Fit Score:** Displays the coefficient of determination directly on the chart so traders can assess how well the recent trend fits the model.

### 5. Fused Conviction Score (1–100) & Capital Guardrail

- **70/30 Fusion:** Combines technical momentum (70%) and news sentiment (30%) into a relative ranking score of setup quality (1–100).
- **Automatic Stand-Aside:** If technicals and news sentiment conflict, the system triggers an automatic **HOLD** recommendation to protect capital.

---

## Important Notice

Strat AI is an analytical research and decision support terminal. It does not execute trades, manage funds, or provide personalized financial advice. The broker integration is strictly read-only with no order-placement methods. All trading decisions are executed by the user.

[ **Explore Terminal** ] | [ **Join Private Beta** ]
