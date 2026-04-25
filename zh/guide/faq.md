# 常見問題

## 三種路由該怎麼選？

- **新接入一律優先 GMPay**。
- **只有當上游系統要求 EPay 風格跳轉收銀臺時** 才使用 EPay 相容入口。
- **不要** 再以 `/payments/epusdt/v1/order/create-transaction` 為新接入基礎，因為當前原始碼已不再註冊它。

## `pid` 和簽名金鑰從哪裡來？

來自管理後臺建立的 API key。每個商戶都有自己的 `pid` 與對應 `secret_key`。

## 為什麼不同環境看到的 supported-assets 不一樣？

因為 `/payments/gmpay/v1/supported-assets` 是根據你自己後臺裡啟用的 chains、chain_tokens，以及可用 wallet_address 即時計算的。
