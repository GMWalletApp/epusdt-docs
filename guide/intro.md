# Introduction

## What current source actually provides

`Epusdt` is a self-hosted **crypto payment gateway** written in **Go**.

Current source exposes two public order-entry flows:

- **GMPay** — `POST /payments/gmpay/v1/order/create-transaction`
- **EPay Compatible** — `GET/POST /payments/epay/v1/order/create-transaction/submit.php`

It also exposes:

- Hosted cashier pages under `/pay/*`
- Network switching for hosted checkout: `POST /pay/switch-network`
- Supported asset discovery: `GET /payments/gmpay/v1/supported-assets`
- Admin API under `/admin/api/v1/*` for API keys, chains, chain tokens, wallet addresses, notification channels, and settings
- Admin rate settings that can use either an exchange-rate API URL or a forced USDT rate; if you rely only on the forced rate, the API URL can be left empty

## Credential model

The live gateway no longer relies on a single global merchant key in the payment API docs.

Instead, each merchant uses an **API key row** created in the admin panel:

- `pid`
- `secret_key`
- optional `ip_whitelist`
- optional default `notify_url`

Incoming GMPay and EPay requests are both identified by `pid` and signed with the matching row's `secret_key`.

## Supported chains and tokens

Current source does **not** hardcode one public list in the docs layer.

The `/payments/gmpay/v1/supported-assets` response is computed from live admin data:

- enabled `chains`
- enabled `chain_tokens`
- available `wallet_address`

So the real supported networks/tokens depend on what the operator enabled in the admin console.

## First-time setup

If no config file is present on first boot, Epusdt launches a built-in **install wizard**. Complete database, domain, and initial settings in the browser, then continue managing runtime data from the admin UI/API.
