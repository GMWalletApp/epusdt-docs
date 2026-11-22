---
description: "Find the networks and tokens EPUSDT supports, configure receiving addresses, and follow an order from checkout to signed payment notification."
title: "Supported networks, tokens and merchant checkout"
---

# Introduction

EPUSDT is a self-hosted payment gateway. A merchant creates an order, the buyer pays at checkout, and the gateway sends a signed notification once payment is verified. Direct on-chain payments go to the merchant’s receiving address.

To deploy with Codex, Claude Code, Cursor or OpenCode, give your agent the [deployment guide and acceptance checklist](https://epusdt.com/agent-setup/prompt.md).

## Set up your first payment

1. [Deploy the gateway](/guide/installation/docker) and set the public HTTPS checkout URL.
2. In the admin console, enable a network and an asset and add a receiving address. Create a merchant API key and keep its `pid` and `secret_key` on your server.
3. [Create a GMPay order](/api/payment#create) and redirect the buyer to `payment_url`. For an existing EPay integration, use the [EPay redirect flow](/guide/integration/epay).

## Supported chains and tokens {#networks}

Checkout offers a direct-payment asset when its network and asset are enabled and a receiving address is configured. These are the defaults on a fresh installation. Read `data.supported_assets` from `GET /payments/gmpay/v1/config` for the options on your gateway.

A dash marks a native asset with no contract. Use the address on the payment order as the recipient. The identifiers below are for verifying the asset.

<div class="asset-directory">

| Network (API ID) | Token | Contract / asset ID | Decimals |
| --- | --- | --- | ---: |
<!--@include: @/.vitepress/data/asset-rows.md-->

</div>

Arc accepts native and ERC-20 USDC. On Polygon, USDC and USDC.e are separate assets.

### A7A5 (TRC-20 / ERC-20) {#a7a5}

To accept A7A5 (pegged to the Russian ruble), enable it separately on TRON or Ethereum and add a receiving wallet on that network. In fixed-rate mode, add an `a7a5` quote to each billing currency you accept. The value is A7A5 per unit of billing currency.

For builds that include A7A5, the following fields select the asset in a GMPay order. An existing deployment may require an upgrade.

| GMPay `network` | GMPay `token` | EPay `type` |
| --- | --- | --- |
| `tron` | `A7A5` | `a7a5.tron` |
| `ethereum` | `A7A5` | `a7a5.ethereum` |

[TRONSCAN](https://tronscan.org/#/token20/TLeVfrdym8RoJreJ23dAGyfJDygRtiWKBZ) · [Etherscan](https://etherscan.io/token/0x6fA0BE17e4beA2fCfA22ef89BF8ac9aab0AB0fc9)

### Hosted payment methods

OKX OnchainOS on X Layer supports USDC, USDT0 and USDG. OKPay supports USDT and TRX by default. Enable each provider separately. Read its options from `data.xlayer` or `data.okpay`.

## From transfer to fulfillment

ChainScanner runs inside EPUSDT by default. When it sees a matching transfer, the order moves to **5 · Confirming**. With strict verification enabled (the default), the required confirmation depth and matching results from two independent nodes are needed for **2 · Paid**. Two unsuccessful rounds move the order to **6 · Manual review**. Fulfill the order only after verifying the signed success callback.

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

## Related projects and audit

- [GMPay Edge](/gmpay-edge/) · Payment gateway for Workers or Bun.
- [GMShop Edge](/gmshop-edge/) · Digital goods storefront.
- [EPUSDT security audit, May 2026](https://github.com/VectorBits/audit/blob/main/epusdt-secure-audit-report-2026-05-14.pdf)
