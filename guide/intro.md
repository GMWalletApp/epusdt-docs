# Introduction

## Epusdt (Easy Payment Usdt)

`Epusdt` is a self-hosted **crypto payment middleware** written in **Go**.

Current source supports payment collection on **Tron**, **Solana**, and **Ethereum** networks, with hosted checkout, async callbacks, and wallet management APIs. It works with **MySQL/SQLite/PostgreSQL** for order data plus a runtime SQLite database for temporary lock state.

With private deployment, there are **no transaction fees** and no third-party custody — USDT goes directly to your wallet. 💰

## Features

- ✅ **Private deployment** — no risk of wallet hijacking or missed orders
- ✅ **Cross-platform Go binary** — x86 and ARM, Windows and Linux
- ✅ **Multi-wallet monitoring** — Tron, Solana, and Ethereum payment detection
- ✅ **Multi-wallet management API** — add, list, enable, disable, and delete addresses
- ✅ **Async queue** — callback processing and background tasks
- ✅ **Hosted checkout** — redirect users to a built-in cashier page
- ✅ **HTTP API** — integrate with any system
- ✅ **Telegram bot** — instant payment notifications with network info

## Project Structure

```
Epusdt
├── plugins   # Integrated plugins (e.g. Dujiaoka)
├── src       # Core source code
├── sdk       # Integration SDK
├── sql       # Database SQL files
└── wiki      # Documentation
```

## How It Works

Epusdt monitors supported networks for incoming transfers on configured wallet addresses. It uses **amount matching** and **time-locking** to attribute payments to orders.

```
Flow:
1. Customer creates an order and gets a token amount plus a wallet address on the selected network
2. Server locks wallet address_1 + network + amount for the order window
3. If that amount is already taken on that wallet, source increments the amount and retries (up to 100 times)
4. Background tasks monitor supported chain inflows and match them against locked routes
5. When a match is confirmed, payment succeeds and Epusdt triggers the callback flow
6. Hosted checkout can also switch token/network, creating child orders when needed
```

## Community

- Telegram Channel: [https://t.me/epusdt](https://t.me/epusdt)
- Telegram Group: [https://t.me/epusdt_group](https://t.me/epusdt_group)
- GitHub: [https://github.com/GMwalletApp/epusdt](https://github.com/GMwalletApp/epusdt)
- GitHub Stars: [![GitHub Stars](https://img.shields.io/github/stars/GMwalletApp/epusdt?style=flat&logo=github)](https://github.com/GMwalletApp/epusdt/stargazers)

## License

[GPLv3](https://www.gnu.org/licenses/gpl-3.0.html)

> ⚠️ This project is for educational and technical purposes only. Users are responsible for compliance with local laws and regulations. Crypto assets carry high risk; GMwallet makes no guarantees regarding asset safety or outcomes.
