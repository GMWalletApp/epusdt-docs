---
description: "Get answers about GMPay and EPay, merchant credentials, enabled assets, and callback verification when integrating EPUSDT."
title: "Merchant integration FAQ"
---

# FAQ

## Which route should I use?

- **Use GMPay** for all new integrations.
- **Use EPay-compatible redirect** only when the upstream system expects an EPay-style cashier redirect.
- Do **not** build new integrations on `/payments/epusdt/v1/order/create-transaction` because that route is no longer registered in current source.

## Where do `pid` and signing keys come from?

From the admin panel API key records. Each merchant has a `pid` and a matching `secret_key`.

## Why does the GMPay config differ between environments?

Because `GET /payments/gmpay/v1/config` is computed from your own admin data.

Its `data.supported_assets` list depends on enabled chains, enabled chain tokens, and available wallet addresses in that environment.

## Which nodes do I need?

The embedded ChainScanner includes public nodes. TRON can use a supported public endpoint without a TronGrid key. When adding a node, select its network and the protocol the provider actually serves. A WebSocket subscription can announce a new block while a separate HTTP endpoint reads it.

The dashboard shows scan progress and warns when observed lag exceeds five minutes. For frequent Solana, TON or Plasma queries, configure fallback nodes from two independent providers and check their quotas.

## How are exchange rates set?

Choose `fixed` to use `rate.forced_rate_list` or `auto` to fetch rates from `rate.api_url`. Auto mode retains the last cached rates if a refresh fails. An empty forced-rate list restores the built-in CNY rates for USDT and USDC.
