---
title: Strat AI
description: Product scope and published agent interfaces for this Strat AI website.
canonical: https://www.stratai.live/index.md
last-updated: 2026-11-18
---

# Strat AI

Strat AI is a market analysis and pre-trade risk adjudication terminal for Indian equities and Futures & Options (NSE/BSE). It evaluates trade setups, audits them against deterministic risk floors, and decodes live F&O order flow. It does not execute trades, hold funds, or provide financial advice.

## Product scope

This site describes the Indian-equity and F&O research product. Stock-specific broker, session and options context must not be applied to Crypto. The shared brand site controls the public release statement: Indian Stocks is not available yet and has no signup. A historical feature catalogue does not establish release availability.

## Published tools

The website product-information MCP endpoint is `/api/mcp`. It exposes read-only information tools: `get_product_overview`, `get_risk_rules`, `get_pricing_plans`, `list_features`, `search_documentation`. It is separate from the OAuth-protected market-data MCP connector. Website discovery documents are `/llms.txt`, `/llms-full.txt`, `/.well-known/mcp/server-card.json` and `/.well-known/ard.json`.

Browser WebMCP registration exposes information tools and, where supported by the page, form-based action tools. Form submissions need the user's explicit instruction and follow the page's validation and confirmation flow. They are not trading actions.

## Access and limits

Strat AI provides analysis and risk tooling. It does not execute trades or hold funds. Projections and scores do not guarantee outcomes. The user remains responsible for trading decisions. See the website's current product, pricing and legal pages for published terms.
