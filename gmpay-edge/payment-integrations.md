# Payment integrations

GMPay Edge includes on-chain, exchange, and wallet adapters. Checkout exposure is controlled separately by configured receiving methods.

A method must have the required public connection or read-only account configuration and pass availability checks before it can be offered to a payer.

| Type | Integration | Built-in assets |
| --- | --- | --- |
| On-chain | TRON / TRC20 | USDT, TRX |
| On-chain | Ethereum / ERC20 | USDT, USDC, ETH |
| On-chain | Base | USDT, USDC, ETH |
| On-chain | BNB Smart Chain / BEP20 | USDT, USDC, BNB |
| On-chain | Polygon | USDT, USDC, MATIC |
| On-chain | TON | USDT, GRAM |
| On-chain | Aptos | USDT, USDC |
| On-chain | Solana | USDT, USDC |
| Exchange | Binance | USDT, USDC |
| Exchange | OKX | USDT, USDC |
| Wallet | OKPay | USDT, TRX |

Built-in integrations mean the capability exists in the project. Production use still requires deployer-owned endpoints or read-only credentials, configured receiving methods, backups, monitoring, and real-platform acceptance tests.
