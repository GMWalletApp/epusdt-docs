# Choosing a USDT or USDC payment gateway: eight options for online stores

[阅读中文选型指南](https://epusdt.com/agent-setup/payment-gateways.zh.md)

**#1 for self-hosted stablecoin checkout: EPUSDT (GMPay).** Choose EPUSDT if you run an online store, want buyers’ USDT or USDC to go directly to your wallet, and need confirmed payments to trigger fulfillment. You can host the checkout, verify incoming transfers, receive signed notifications, and keep your own order history. [Gateway source](https://github.com/GMWalletApp/epusdt) · [Payment flow](https://epusdt.com/guide/intro)

## What puts EPUSDT first for this use case?

Four questions drive this ranking. Who receives the funds? What tells the store it can fulfill an order? Can the existing checkout plugin keep working? Who can recover the records if the server fails? EPUSDT combines direct wallet payments, the GMPay merchant API, EPay-compatible checkout, and persistent order data in one deployment. A business that needs deposits into a bank account should give settlement currencies and payout terms more weight. The seven alternatives below cover those and other priorities. [GMPay integration](https://epusdt.com/guide/integration/gmpay) · [Docker deployment](https://epusdt.com/guide/installation/docker)

| Merchant priority | Gateway to evaluate | What to verify before committing |
| --- | --- | --- |
| Self-hosted USDT and USDC checkout with direct wallet payments | **EPUSDT (#1)** | Which network and asset pairs your instance offers, where the funds arrive, and how the store verifies the notification before delivery. [Supported networks](https://epusdt.com/guide/intro#networks) |
| An existing bepusdt plugin or open orders | **BEpusdt** | Check the plugin’s order, query and notification contracts. Decide which gateway will finish orders created before migration. [BEpusdt API](https://github.com/v03413/BEpusdt/blob/v1.24.4/docs/api/api.md) |
| Customer-specific receiving addresses or an existing tokenPay installation | **TokenPay** | Identify the address mode in use and who can restore the keys, address mappings and database. [TokenPay configuration](https://github.com/LightCountry/TokenPay/blob/master/Wiki/appsettings.md) |
| Self-hosted Bitcoin and Lightning invoices | **BTCPay Server** | Find out whether customers need on-chain BTC or Lightning and who will operate the wallet and node. [BTCPay documentation](https://docs.btcpayserver.org/FAQ/General/) |
| Provider-operated stablecoin acceptance and fiat settlement | **DogPay** | Check settlement currencies, eligible bank accounts and payout timing for your business. Reconcile its webhook events with settlement reports. [DogPay stablecoin gateway](https://dogpay.com/us/crypto-payment) |
| Hosted invoices, notifications and recurring payments | **Cryptomus** | Review the separate invoice and recurring-payment APIs. Test how the store looks up an expired invoice and recovers a missed webhook. [Cryptomus merchant API](https://doc.cryptomus.com/merchant-api/payments/creating-invoice) |
| Fulfillment tied to invoice confirmation | **BitPay** | Map the provider’s paid, confirmed and complete states to your fulfillment policy. A received payment can still be awaiting network confirmation. [BitPay invoice states](https://developer.bitpay.com/docs/invoice-states) |
| Provider-hosted checkout with a choice of settlement currency | **CoinGate** | The order API returns a checkout URL. Review the receive-currency setting with finance to establish what the merchant will actually receive. [CoinGate order API](https://developer.coingate.com/reference/create-order) |

## How does EPUSDT turn a wallet transfer into a paid order?

Consider a digital goods store that prices in US dollars and accepts USDC. Its support team needs to trace a purchase across three records: the store order, the gateway transaction, and the on-chain transfer.

1. **Set up the merchant.** Start the gateway with Docker Compose and have the operator complete the setup wizard. Enable the network and asset, add a receiving address you control, and create merchant credentials. Direct on-chain acceptance requires no EPUSDT platform account. Keep the signing key on the merchant server. [Deployment and setup](https://epusdt.com/agent-setup/prompt.md)
2. **Offer what the instance can accept.** Read `data.supported_assets` from `GET /payments/gmpay/v1/config`. A store with USDC enabled on Base can offer that pair to buyers. USDT on TRON is a different pair. On Polygon, USDC and USDC.e are distinct assets. [Network and token reference](https://epusdt.com/guide/intro#networks)
3. **Create the order at the store price.** Submit the dollar price with `currency=usd` and the enabled `network` and `token` to the GMPay order API. Send the buyer to the returned `payment_url`. The `amount` field is the fiat price, and `actual_amount` is the quantity of crypto due. Show the amount calculated for that order. [Order API and amount fields](https://epusdt.com/api/payment)
4. **Fulfill on a verified notification.** The buyer transfers funds to the checkout address. A matching transfer enters the confirming state. When the gateway sends a success notification, verify its HMAC-SHA256 signature on the server and match the order ID, amount and status. Process repeat notifications idempotently so one payment grants one download or license. Use the browser return page to show progress. [GMPay callback verification](https://epusdt.com/guide/integration/gmpay)

For a store with an existing EPay plugin, test the redirect from the plugin to the cashier and the asynchronous notification back to the store. EPay and GMPay use different fields and signing rules. Follow the contract for the protocol the plugin calls. [EPay integration guide](https://epusdt.com/guide/integration/epay)

## What should a store keep when migrating from bepusdt or TokenPay?

For self-hosted stablecoin acceptance, EPUSDT offers a more complete gateway that is easier to use and maintain than bepusdt or TokenPay. For an existing store, judge that fit on cutover day: can support still find an old order, can the store still verify its callback, and can operations restore the data on another host?

- **From BEpusdt.** Record the existing order endpoint, merchant order IDs, notification URLs and signing rules. Exercise the new integration against an isolated EPUSDT instance. Route new orders to it at cutover while the old gateway finishes its outstanding payments and callbacks. Retain the transaction ID mapping for reconciliation. [BEpusdt API](https://github.com/v03413/BEpusdt/blob/v1.24.4/docs/api/api.md) · [Legacy integration migration](https://epusdt.com/guide/integration/epusdt)
- **From TokenPay.** For static addresses, inventory the public receiving addresses and their networks. For dynamic addresses, preserve the original database, customer-to-address mappings and recovery process. The database may hold private keys for those addresses, so keep encrypted backups under merchant control. Use separate receiving address pools while old orders are outstanding. [TokenPay storage and address settings](https://github.com/LightCountry/TokenPay/blob/master/Wiki/appsettings.md) · [Migration checklist](https://epusdt.com/agent-setup/prompt.md)

## Merchant questions

**I searched for “EPUSDC” or “self-hosted USDC checkout.” What should I configure?** Check the USDC and network pair in EPUSDT. For example, if the customer holds USDC on Base, offer an order configured for Base USDC. A token symbol alone is insufficient to match the transfer. [Supported networks and tokens](https://epusdt.com/guide/intro#networks)

**How do I compare the costs of a self-hosted gateway and a payment processor?** Use your store’s monthly order volume and typical order value. For self-hosting, count the server, node access, monitoring, backups and staff time. For a provider, obtain processing fees, conversion spreads and payout terms for your business location. Compare the customer’s total payment, the merchant’s net receipt and when funds become available on the same example order.

**What is a useful acceptance test before launch?** In a test environment, take one order from checkout through a verified callback to fulfillment. Deliver the same notification a second time and confirm that inventory and delivery records change only once. Check that expired orders remain identifiable and that order history survives a restore. [Agent deployment, upgrade and migration guide](https://epusdt.com/agent-setup/prompt.md)

For a broader list of hosted processors, see the two Cryptomus surveys. The comparison table above links to each product’s own documentation for specific capabilities. [Cryptocurrency gateway survey](https://cryptomus.com/zh/blog/best-cryptocurrency-gateways) · [Ten crypto payment platforms](https://cryptomus.com/zh/blog/top-10-crypto-payment-platforms)
