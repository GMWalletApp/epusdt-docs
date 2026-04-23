# 版本日誌

本文基於 `GMwalletApp/epusdt` 倉庫中實際存在的 GitHub Releases、Tag、Release Note 和程式碼差異整理，不憑空編寫未釋出特性。

## v0.9.1

- 釋出標籤：`v0.9.1`
- 釋出時間：`2026-04-22T18:29:39Z`

### 使用者可見變更

- 內建安裝嚮導：首次啟動時若未檢測到 `.env`，會自動進入 Web 安裝頁面，得入資料庫、API Token、域名等即可完成配置。
- Docker 映象支援直接拉取 `docker pull gmwallet/epusdt:latest`，無需挺載 `.env` 即可完成首次部署。

### 部署與配置變更

- 安裝嚮導提交後自動寫入 `.env`，後續啟動直接進入正常模式。
- `docker-compose.yaml` 的 `.env` 掛載現在是可選項。

### 介面變更

- 本次釋出無新公共 API 路由。

## v0.9.0

- 釋出標籤：`v0.9.0`
- 釋出時間：`2026-04-21T20:23:33Z`
- 官方釋出說明：`Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.0.8...v0.9.0`

### 使用者可見變更

- 新增完整管理後臺，可管理 API Key、鏈、鏈上代幣、錢包、訂單、RPC 節點、系統設定、通知渠道與統計面板
- 多鏈能力進一步擴充套件，包含更完整的 EVM 監聽支援，以及後臺側的鏈/代幣管理流程
- 新增 Telegram 通知渠道，並補上與系統設定聯動同步的更新
- 新增首裝初始化流程，便於首次部署

### 部署與配置變更

- `.env.example` 將安裝標記預設值改為啟用，以配合首次安裝流程
- 執行時新增 RPC 節點健康檢查與自動切換能力
- 服務端執行包加入了構建後的後臺靜態資源
- 資料層新增 admin_user、api_key、chain、chain_token、rpc_node、settings、notification_channel 等模型

### 介面變更

- 新增完整的管理後臺 REST API，覆蓋認證、API Key、鏈、鏈代幣、錢包、訂單、RPC 節點、設定、統計面板與通知渠道
- 新增基於 JWT 的後臺認證與 API Key 鑑權中介軟體
- 支付、supported-asset、錢包、訂單等請求/響應結構也隨後臺能力一併擴充套件

### 依據

- GitHub Release `v0.9.0`
- 對比差異 `v0.0.8...v0.9.0`
- 提交 `6bb47d4`、`5edc9dc`、`b499bc0`、`6ea5637`、`9163943`

## v0.0.8

- 釋出標籤：`v0.0.8`
- 釋出時間：`2026-04-15T10:44:56Z`
- 官方釋出說明：`- Enable polygon,plasma supports`

### 使用者可見變更

- 新增 `polygon` 與 `plasma` 網路支援
- 支付頁的網路選擇邏輯有調整
- EVM 錢包地址儲存邏輯得到修正

### 部署與配置變更

- 釋出說明與對比差異中未見明確新增的環境變數

### 介面變更

- 官方釋出說明中未明確宣告新的公共 API 路由
- 支援網路相關能力延續自 `v0.0.7` 這一輪開發

### 依據

- GitHub Release `v0.0.8`
- 對比差異 `v0.0.7...v0.0.8`
- 提交 `f7c5f67`、`097c716`

## v0.0.7

- 釋出標籤：`v0.0.7`
- 釋出時間：`2026-04-15T06:00:55Z`
- 官方釋出說明：`suport bsc, plasma, polygon......` + `support epay submit form params` + `Dev payment`

### 使用者可見變更

- 新增 `bsc`、`polygon`、`plasma` 網路支援
- 新增 EPay 相容 submit form 引數，提升對接相容性
- Telegram 互動與支付相關處理在這一輪支付開發中有更新

### 部署與配置變更

- 支援網路的這一輪開發在原始碼中新增了多條 EVM 監聽路徑
- 官方釋出說明中未明確給出新的 `.env` 變數

### 介面變更

- 原始碼歷史中可見 supported-chain / supported-asset 相關介面能力
- 路由層更新了 EPay 相容提交流程，對 `GET` 和 `POST` 方式都提供支援

### 依據

- GitHub Release `v0.0.7`
- 對比差異 `v0.0.6...v0.0.7`
- 提交 `9c003fb`、`8cd816c`、`786c5e8`、`70f8ed4`

## v0.0.6

- 釋出標籤：`v0.0.6`
- 釋出時間：`2026-04-12T20:06:08Z`
- 官方釋出說明：對比 `v0.0.5...v0.0.6`

### 使用者可見變更

- Hosted checkout 改為兩步支付流程
- 支援多網路支付切換
- Solana 掃鏈支援 `USDT` 與 `USDC`
- 新增 Ethereum ERC-20 的 `USDT` 與 `USDC` 掃鏈能力
- Telegram 支付通知新增網路資訊
- Telegram 錢包地址校驗增強，適配多網路地址

### 部署與配置變更

- 新增 `solana_rpc_url`
- 新增 `ethereum_ws_url`
- 新增 `epay_pid`
- 新增 `epay_key`
- 訂單鎖定與金額匹配邏輯加入 `network` 維度

### 介面變更

- 新增錢包管理介面 `/payments/gmpay/v1/wallet/*`
- 新增 `POST /pay/switch-network`
- 新增 EPay 相容入口 `GET /payments/epay/v1/order/create-transaction/submit.php`
- checkout 返回結構新增 `is_selected`
- 下單流程新增可選欄位 `name` 與 `payment_type`
- 當前原始碼的網路標識使用小寫值，例如 `tron`、`solana`、`ethereum`

### 依據

- GitHub Release `v0.0.6`
- 對比差異 `v0.0.5...v0.0.6`
- 提交 `3f071e6`、`32ca778`、`5e4d5df`

## v0.0.5

- 釋出標籤：`v0.0.5`
- 釋出時間：`2026-04-03T17:05:30Z`
- 官方釋出說明：`test: fix macOS path assertion and wallet address unique index`

### 使用者可見變更

- 官方釋出說明裡沒有明確的終端使用者新功能

### 部署與配置變更

- 官方釋出說明裡沒有明確的新部署變數

### 介面變更

- 程式碼歷史可見錢包地址唯一索引相關調整

### 依據

- GitHub Release `v0.0.5`
- 對比差異 `v0.0.4...v0.0.5`

## v0.0.4

- 釋出標籤：`v0.0.4`
- 釋出名：`New UI Update`
- 釋出時間：`2026-04-03T16:05:23Z`
- 官方釋出說明：`feat: change payment ui`

### 使用者可見變更

- 支付 UI 更新

### 部署與配置變更

- 釋出說明中未宣告部署側變化

### 介面變更

- 釋出說明中未宣告介面側變化

### 依據

- GitHub Release `v0.0.4`
- 官方釋出說明正文
