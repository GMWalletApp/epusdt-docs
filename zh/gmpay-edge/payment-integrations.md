# 支付接入

GMPay Edge 内建链上、交易所与钱包适配器。收银台是否展示某个支付方式，由已配置且可用的收款方式独立控制。

收款方式必须配置必要的公共连接或只读帐户信息，并通过可用性检查后，才会提供给付款人选择。

| 类型 | 接入 | 内建资产 |
| --- | --- | --- |
| 链上网络 | TRON / TRC20 | USDT、TRX |
| 链上网络 | Ethereum / ERC20 | USDT、USDC、ETH |
| 链上网络 | Base | USDT、USDC、ETH |
| 链上网络 | BNB Smart Chain / BEP20 | USDT、USDC、BNB |
| 链上网络 | Polygon | USDT、USDC、MATIC |
| 链上网络 | TON | USDT、GRAM |
| 链上网络 | Aptos | USDT、USDC |
| 链上网络 | Solana | USDT、USDC |
| 交易所 | Binance | USDT、USDC |
| 交易所 | OKX | USDT、USDC |
| 数字钱包 | OKPay | USDT、TRX |

内建接入表示项目已实作相关能力。正式生产使用仍需要部署者自己的端点或只读凭证、配置完成的收款方式、备份、监控，以及真实平台验收测试。
