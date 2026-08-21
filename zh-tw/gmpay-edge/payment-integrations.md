# 支付接入

GMPay Edge 內建鏈上、交易所與錢包適配器。收銀臺是否展示某個支付方式，由已配置且可用的收款方式獨立控制。

收款方式必須配置必要的公共連線或唯讀帳戶資訊，並通過可用性檢查後，才會提供給付款人選擇。

| 類型 | 接入 | 內建資產 |
| --- | --- | --- |
| 鏈上網路 | TRON / TRC20 | USDT、TRX |
| 鏈上網路 | Ethereum / ERC20 | USDT、USDC、ETH |
| 鏈上網路 | Base | USDT、USDC、ETH |
| 鏈上網路 | BNB Smart Chain / BEP20 | USDT、USDC、BNB |
| 鏈上網路 | Polygon | USDT、USDC、MATIC |
| 鏈上網路 | TON | USDT、GRAM |
| 鏈上網路 | Aptos | USDT、USDC |
| 鏈上網路 | Solana | USDT、USDC |
| 交易所 | Binance | USDT、USDC |
| 交易所 | OKX | USDT、USDC |
| 數字錢包 | OKPay | USDT、TRX |

內建接入表示專案已實作相關能力。正式生產使用仍需要部署者自己的端點或唯讀憑證、配置完成的收款方式、備份、監控，以及真實平台驗收測試。
