# Introduction

## What current source actually provides

`Epusdt` is a self-hosted **crypto payment gateway** written in **Go**.

The GMWalletApp organization also maintains [GMPay Edge](/gmpay-edge/), a separate edge-native gateway for Cloudflare Workers. It shares the GMPay/EPay merchant-protocol context, but it is not the same runtime or deployment model as Epusdt.

Current source exposes two public order-entry flows:

- **GMPay** — `POST /payments/gmpay/v1/order/create-transaction`
- **EPay Compatible** — `GET/POST /payments/epay/v1/order/create-transaction/submit.php`

It also exposes:

- Hosted cashier pages under `/pay/*`
- Network switching for hosted checkout: `POST /pay/switch-network`
- Public payment config for frontend/cashier bootstrapping: `GET /payments/gmpay/v1/config`
- Admin API under `/admin/api/v1/*` for API keys, chains, chain tokens, wallet addresses, notification channels, and settings
- Admin rate settings that can use either an exchange-rate API URL or a forced USDT rate; if you rely only on the forced rate, the API URL can be left empty

## Security Audit

Epusdt has completed a third-party security audit.
[View Security Audit Report](https://github.com/VectorBits/audit/blob/main/epusdt-secure-audit-report-2026-05-14.pdf)


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

The `GET /payments/gmpay/v1/config` response is computed from live admin data.

Its `data.supported_assets` field is built from:

- enabled `chains`
- enabled `chain_tokens`
- available `wallet_address`

The same response also includes public site/cashier branding plus EPay / OkPay frontend config fields.

So the real supported networks/tokens depend on what the operator enabled in the admin console.

## First-time setup

If no config file is present on first boot, Epusdt launches a built-in **install wizard**. Complete database, domain, and initial settings in the browser, then continue managing runtime data from the admin UI/API.

## Screenshots

<table>
  <tr>
    <td align="center" valign="top" width="25%">
      <img src="/screenshots/web2.png" alt="Dashboard Overview" height="200"><br>
      <sub>Dashboard Overview</sub>
    </td>
    <td align="center" valign="top" width="25%">
      <img src="/screenshots/web1.png" alt="Admin Panel" height="200"><br>
      <sub>Admin Panel</sub>
    </td>
    <td align="center" valign="top" width="25%">
      <img src="/screenshots/pay1.jpeg" alt="Checkout Page" height="200"><br>
      <sub>Checkout Page</sub>
    </td>
    <td align="center" valign="top" width="25%">
      <img src="/screenshots/pay2.jpeg" alt="Payment Page" height="200"><br>
      <sub>Payment Page</sub>
    </td>
  </tr>
</table>
