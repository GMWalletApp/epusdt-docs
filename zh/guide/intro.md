# 專案簡介

## Epusdt（Easy Payment Usdt）

`Epusdt` 是一個由 **Go 語言**編寫的私有化 **加密支付中介軟體**，當前原始碼支援 `tron`、`solana`、`ethereum` 三種網路。

站長或開發者可透過 `Epusdt` 提供的 HTTP API 將代幣收款整合至任何系統，無需複雜配置。當前原始碼可使用 **MySQL / SQLite / PostgreSQL** 儲存訂單資料，並使用執行時 SQLite 維護鎖單狀態。私有化部署無需額外手續費，代幣直接進入您的錢包 💰

## 專案特點

- ✅ **私有化部署**，無需擔心錢包被篡改和吞單
- ✅ **Go 跨平臺**，支援 x86 / ARM 的 Windows / Linux
- ✅ **多網路錢包監聽**，提高訂單併發率
- ✅ **非同步佇列響應**，優雅且高效能
- ✅ **單一二進位制**，無需額外執行時環境
- ✅ **HTTP API**，任何系統均可接入
- ✅ **Telegram 機器人**，支付訊息快速通知

## 專案結構

```
Epusdt
├── plugins   # 已整合外掛（如獨角數卡）
├── src       # 核心原始碼
├── sdk       # 接入 SDK
├── sql       # 資料庫 SQL 檔案
└── wiki      # 知識庫/文件
```

## 實現原理

Epusdt 透過監聽多網路錢包入賬事件，結合**金額差異**、**網路維度**和**時效性**判定交易歸屬。

```
簡單流程：
1. 客戶選擇幣種與網路後建立訂單
2. 系統按 `network + token + wallet + amount` 維度鎖定可用支付通道
3. 若當前金額通道已被佔用，則按規則尋找新的可用金額
4. 後臺持續監聽多網路入賬事件，匹配成功後更新父訂單狀態並觸發回撥
```

## 社群

- Telegram 頻道：[https://t.me/epusdt](https://t.me/epusdt)
- Telegram 交流群：[https://t.me/epusdt_group](https://t.me/epusdt_group)
- GitHub：[https://github.com/GMwalletApp/epusdt](https://github.com/GMwalletApp/epusdt)
- GitHub Star：[![GitHub Stars](https://img.shields.io/github/stars/GMwalletApp/epusdt?style=flat&logo=github)](https://github.com/GMwalletApp/epusdt/stargazers)

## 開源協議

[GPLv3](https://www.gnu.org/licenses/gpl-3.0.html)

> ⚠️ 本專案僅供學習與技術交流，使用者需自行遵守所在地法律法規。加密資產屬高風險資產，GMwallet 不對任何資產損失或使用結果作出保證。
