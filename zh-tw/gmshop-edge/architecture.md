# 架構

GMShop Edge 在 Cloudflare Workers 與 Bun/Nitro 上運行同一套 React/TanStack 全棧應用。一個部署同時負責公開商城、使用者帳戶、結帳、交付、供應商整合、Telegram 整合和管理後台。

## 共享應用邊界

路由保持輕量；功能頁面、Schema、伺服器端函式和領域行為位於 `src/features`，跨領域執行時實現位於 `src/server`，Drizzle Schema 位於 `src/db/schema`。

身分、RBAC、商品、訂單、庫存、權益、供應商狀態、餘額帳本、通知、重放保護、限流、Outbox 和審計資料均儲存在權威資料庫中。金額使用最小貨幣單位的十進位整數字串儲存，不使用浮點數計算。

## Cloudflare Workers 介面卡

Workers 部署使用：

- `DB`：D1，儲存權威應用與商務資料。
- `FILES`：私有 R2，儲存商品媒體、下載檔案、自動化產物和匯出檔案。
- `CACHE`：KV，僅儲存經過驗證、帶版本且有容量限制的讀取快取；安全限流仍以資料庫為準。
- `COMMERCE_QUEUE`：處理交付、自動化、通知、供應商和退款任務，並設定死信佇列。
- `EMAIL`：可選的 Cloudflare Send Email 繫結。
- 每分鐘 Cron Trigger：執行定時處理和維護。

## Bun/Nitro 介面卡

Bun 執行時在一個資料目錄內提供等價介面卡：

- SQLite 權威資料庫。
- 程序內有界快取。
- 私有本地物件儲存。
- 基於 SQLite 的持久佇列。
- 每分鐘執行的程序內排程器。

`GMSHOP_DATA_DIR` 包含資料庫、物件、佇列狀態和全部執行時資料。Bun 明確僅支援**單一執行個體**，不支援多副本部署或共享網路儲存。

## 資料與後台任務

私有物件必須透過已授權的資料庫記錄解析，客戶端不能選擇物件鍵。佇列和定時任務在同步商城請求之外處理供應商同步與採購、交付、通知、退款、重試、保留策略、Telegram 維護和金鑰輪換。

全新安裝的遷移基線是 `drizzle/0000_gmshop.sql`；後續遷移按順序應用，Bun 資料操作會驗證其驗證碼。
