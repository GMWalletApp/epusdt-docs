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

## Chain Settings

### Does Tron require a special API key?

Yes. You must configure a [TronGrid API key](https://www.trongrid.io/) for Tron chain support.
Without it the node requests will be rate-limited or rejected.

### What protocol should I use for each chain's RPC URL?

- **Tron** and **Solana (SOL)**: use an **HTTP/HTTPS** endpoint.
- **All other chains** (e.g. ETH, BSC, Polygon …): use a **WSS** (WebSocket) endpoint.

Setting the wrong protocol will silently prevent transaction monitoring from working.

## Exchange Rate Settings

The system uses an exchange rate API to convert fiat amounts to crypto equivalents.

### Which exchange rate API is used?

The system can be configured to fetch rates from the community-provided [Fawaz Ahmed Currency API](https://github.com/fawazahmed0/exchange-api).

API base URL:

https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/

Example - fetch USDT rates:

https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usdt.json

> **Note:** This is a community-maintained free API. Accuracy is not guaranteed.
> For production environments, consider using a paid exchange rate provider.

### How do I configure the exchange rate API?

In the admin panel, go to **Settings - Exchange Rate** and enter your preferred API endpoint.
The system will poll it periodically to keep rates up to date.
