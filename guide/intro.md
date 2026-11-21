# Introduction

EPUSDT is a self-hosted payment gateway. A merchant creates an order, the buyer pays at checkout, and the gateway sends a signed notification once payment is verified. Direct on-chain payments go to the merchant’s receiving address.

## Set up your first payment

1. [Deploy the gateway](/guide/installation/docker) and set the public HTTPS checkout URL.
2. In the admin console, enable a network and an asset and add a receiving address. Create a merchant API key and keep its `pid` and `secret_key` on your server.
3. [Create a GMPay order](/api/payment#create) and redirect the buyer to `payment_url`. For an existing EPay integration, use the [EPay redirect flow](/guide/integration/epay).

## Supported chains and tokens {#networks}

Checkout offers a direct-payment asset when its network and asset are enabled and a receiving address is configured. These are the defaults on a fresh installation. Read `data.supported_assets` from `GET /payments/gmpay/v1/config` for the options on your gateway.

| Network | API network ID | Default assets |
| --- | --- | --- |
| TRON | `tron` | TRX, USDT |
| Ethereum | `ethereum` | USDT, USDC |
| BNB Smart Chain | `binance` | USDT, USDC |
| Polygon PoS | `polygon` | USDT, USDC, USDC.e |
| Solana | `solana` | SOL, USDT, USDC |
| TON | `ton` | TON, USDT |
| Plasma | `plasma` | USDT |
| Aptos | `aptos` | USDT, USDC |
| Sui | `sui` | SUI, USDC |
| Arbitrum One | `arbitrum` | ETH, USDC |
| Base | `base` | ETH, USDC |
| OP Mainnet | `optimism` | ETH, USDC |
| Avalanche C-Chain | `avalanche` | AVAX, USDC |
| HyperEVM | `hyperevm` | HYPE, USDC |
| Monad | `monad` | MON, USDC |
| Arc | `arc` | USDC |

Arc accepts native and ERC-20 USDC. On Polygon, USDC and USDC.e are separate assets.

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
