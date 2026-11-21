---
description: "解答 EPUSDT 串接常見問題，包括如何選擇 GMPay 或易支付、取得商戶金鑰、查詢可用幣種與驗證回呼。"
title: "商戶串接常見問題"
---

# 常見問題

## 三種路由該怎麼選？

- **新接入一律優先 GMPay**。
- **只有當上游系統要求 EPay 風格跳轉收銀臺時** 才使用 EPay 相容入口。
- **不要** 再以 `/payments/epusdt/v1/order/create-transaction` 為新接入基礎，因為當前原始碼已不再註冊它。

## `pid` 和簽名金鑰從哪裡來？

來自管理後臺建立的 API key。每個商戶都有自己的 `pid` 與對應 `secret_key`。

## 為什麼不同環境看到的 GMPay config 不一樣？

因為 `GET /payments/gmpay/v1/config` 是根據你自己後臺資料即時計算的。

其中 `data.supported_assets` 會受到已啟用的 chains、chain_tokens 與可用 wallet_address 影響。

## 需要配置哪些節點？

內建 ChainScanner 自帶公共節點。TRON 可使用受支援的公共節點，TronGrid 金鑰按所選服務商的要求配置。新增節點時，請選擇對應的鏈以及服務商實際提供的協議。WebSocket 可用於監聽新區塊，再由 HTTP 節點讀取區塊內容。

後臺顯示各鏈的掃描進度，觀測到的追塊延遲超過五分鐘時會提示。Solana、TON 或 Plasma 查詢頻繁時，建議配置來自兩家獨立服務商的兜底節點，並核對服務商配額。

## 如何設定匯率？

選擇 `fixed` 使用 `rate.forced_rate_list`，或選擇 `auto` 從 `rate.api_url` 獲取匯率。自動重新整理失敗時沿用已快取的匯率。清空固定匯率配置會恢復內建的 CNY 對 USDT、USDC 匯率。
