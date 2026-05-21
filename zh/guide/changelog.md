# 版本日誌

本文基於 `GMwalletApp/epusdt` 倉庫中實際存在的 GitHub Releases、Tag、Release Note 和程式碼差異整理，不憑空編寫未釋出特性。


## v1.0.1

- 釋出標簽：`v1.0.1`
- 釋出時間：`2026-05-21T11:40:39Z`
- 官方釋出說明：`feat: expose build version in public config` (PR #72)

### 使用者可見變更

- `GET /payments/gmpay/v1/config` 回應新增 `version` 欄位，返回當前伺服器的建構版本（例如 `"version": "v1.0.1"`）。
- 設定記錄在 upsert 時若已被軟刪除，現在會自動恢復，確保配置修改能正確生效。

### 部署與配置變更

- Docker 映像發布現在僅限 `v*` 格式的 tag 觸發，非版本 tag 的建構不再發布到容器倉庫。
- 建構版本在編譯時透過 Docker 和 GoReleaser 注入，API 回應中的版本號與釋出 tag 一致。

### API 變更

- `GET /payments/gmpay/v1/config` 回應新增 `version` 字串欄位，反映伺服器建構版本。

### 參考依據

- GitHub Release `v1.0.1`
- PR `#72`：feat: expose build version in public config
- Commits：`85b81e66`、`09642d4c`、`c19a7e5f`
- 相關檔案：`src/model/response/support_response.go`、`src/model/data/settings_data.go`、`.github/workflows/docker-alpine.yml`

## v1.0.0


- 釋出標簽：`v1.0.0`
- 釋出時間：`2026-05-20T16:09:00Z`
- 官方釋出說明：`feat: verify manual mark-paid payments` (PR #70)

### 使用者可見變更

- 管理員手動標記訂單為已付款時，現在需要先進行鏈上驗證——交易哈希會在接受狀態變更前與鏈上數據核對。
- 驗證內容包括：收款地址、代幣合約地址、付款金額、確認數量及交易時間戳，防止誤判。
- 同一交易哈希不可被重複使用，不能用於標記多個訂單為已付款。
- 非鏈上訂單類型不進入手動驗證流程，會直接拒絕。
- `supported_assets` 回應新增 `display_name` 欄位，前端可直接顯示可讀的鏈名稱。
- 支援資產列表中 BSC 網絡識別符從 `bsc` 改名為 `binance`。

### 部署與配置變更

- 本次釋出未引入新的環境變數。
- Docker 映像及 docker-compose 配置無需變更。

### API 變更

- 管理員標記已付款端點現在需要有效的 `tx_hash` 參數並進行鏈上驗證，無效或重複哈希將返回錯誤。
- `GET /payments/gmpay/v1/config` 的支援資產條目新增 `display_name` 欄位。
- 支援資產中 BSC 網絡値從 `bsc` 改為 `binance`。

### 依據來源

- GitHub 釋出 `v1.0.0`，Pull Request [#70](https://github.com/GMWalletApp/epusdt/pull/70)
- 提交記錄 `049a15c`
- `src/controller/admin/order_controller.go`、`src/model/service/manual_payment_verify.go`

## v0.9.7

- 釋出標籤：`v0.9.7`
- 釋出時間：`2026-05-13T09:01:26Z`
- 官方釋出說明：`Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.6...v0.9.7`

### 使用者可見變更

- `README.zh-CN.md` 已刪除；`README.md` 現為唯一主 README，將文件整合為單一入口。
- 前端管理後台資源（Service Worker precache manifest 及所有打包 JS 區塊）已重新構建，所有靜態資源以更新後的內容雜湊重新命名，修復已載入過管理後台的使用者可能遇到的快取問題。

### 部署與配置變更

- 本次釋出未引入新的環境變數。
- 無執行時行為變更——本次釋出僅涉及前端資源重新整理與文件整理。

### API 變更

- 未新增、移除或修改任何 API 路由。

### 依據來源

- GitHub release `v0.9.7`
- 對比差異 `v0.9.6...v0.9.7`
- 提交 `52b171b`、`4a69b7c`、`b0093c4`、`864eb59`
- 關鍵檔案：`README.md`、`README.zh-CN.md`、`src/www/sw.js`、`src/www/index.html`、`src/www/assets/*`

## v0.9.6

- 釋出標籤：`v0.9.6`
- 釋出時間：`2026-05-11T10:09:43Z`
- 官方釋出說明：`Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.5...v0.9.6`

### 使用者可見變更

- 首次啟動時，初始管理員帳號與密碼現在會直接列印到控制台，不需要再去查資料庫即可完成第一次登入。
- 管理後台外觀設定新增 `background_color` 與 `background_image_url` 欄位，可自訂收銀臺頁面的背景色與背景圖片。
- 支付金額精度現在可設定，運營者可配置產生支付金額時保留幾位小數。
- TRON 鏈代幣解析改為在區塊監聽器中動態取得，不再需要在啟動時寫死代幣合約地址。
- `README.md` 改為簡體中文主 README；英文版獨立為 `README.en.md`；`README.zh-CN.md` 已在後續 commit（4a69b7c8）中刪除。
- `plugins/` 目錄與內建的 `dujiaoka` 外掛示例已從倉庫中移除。

### 部署與配置變更

- 未引入新的環境變數。
- README 重整屬純文件調整，不影響執行時行為。

### API 變更

- `GET /payments/gmpay/v1/config` 回應新增 `background_color` 與 `background_image_url` 欄位（來自外觀設定）。
- `GET /payments/gmpay/v1/config` 回應新增 `payment_amount_precision` 欄位（來自支付設定）。
- 本次釋出未新增或移除任何路由。

### 依據來源

- GitHub release `v0.9.6`
- Compare diff `v0.9.5...v0.9.6`
- 提交 `1a35cab`、`2d546e3`、`a8a3b86`、`3e0be9b`、`7c9e3e1`、`84972ea`、`1c805ed`、`8d2ddbd`、`07d1d83`、`7a905ba`、`4dc1ba8`、`4a69b7c`
- 關鍵檔案：`src/bootstrap/bootstrap.go`、`src/controller/admin/settings_controller.go`、`src/model/data/settings_data.go`、`src/model/mdb/settings.go`、`src/task/listen_trc20_block.go`

## v0.9.5

- 釋出標籤：`v0.9.5`
- 釋出時間：`2026-05-09T13:51:58Z`
- 官方釋出說明：`Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.4...v0.9.5`

### 使用者可見變更

- 託管收銀臺現在新增了 `okpay` 支付切換路徑，不再只有原本的鏈上網路切換流程。
- checkout 回應現在會返回 `payment_url`，因此像 OkPay 這類第三方支付子訂單可以明確跳轉到外部支付連結，而不是只依賴本地收銀臺顯示地址。
- 公開設定回應現在會暴露站點側的 cashier 名稱、logo URL、網站標題與支援連結，前端品牌展示不必再把這些資訊硬編碼在頁面裡。

### 部署與配置變更

- `.env.example` 已刪除舊的 PostgreSQL / MySQL 設定區塊；目前公開配置範例已回到以 SQLite 為主的實際部署路徑，不再暗示這兩種資料庫仍是當前正常安裝流程的一部分。
- Dockerfile 清理掉了多餘的 `static` 複製步驟，與目前實際使用的前端交付路徑保持一致。
- README 也順手更新了 logo 與免責聲明，但相較之下屬於次要整理，不是本次版本的主要執行時變更。

### 介面變更

- GMPay 對前端公開的支付配置現在改由 `GET /payments/gmpay/v1/config` 提供，不再沿用較早期那條獨立的 supported-assets 查詢路徑。
- `GET /payments/gmpay/v1/config` 會一次返回 `supported_assets`、站點品牌資訊、EPay 預設值與 OkPay 公開配置欄位。
- 新增 OkPay 回撥入口：`POST /payments/okpay/v1/notify`。
- `POST /pay/switch-network` 現在文件與實際請求示例都已納入 `network=okpay`，不再只限鏈上網路值。
- checkout 回應新增 `payment_url` 欄位。

### 依據

- GitHub Release `v0.9.5`
- 對比差異 `v0.9.4...v0.9.5`
- 提交 `377176a`、`3623a54`、`51ad344`、`ff157c3`、`1a35cab`、`2d546e3`
- 關鍵程式碼路徑 `src/route/router.go`、`src/controller/comm/supported_asset_controller.go`、`src/model/response/order_response.go`、`src/model/response/support_response.go`、`src/.env.example`

## v0.9.4

- 釋出標籤：`v0.9.4`
- 釋出時間：`2026-04-28T16:37:20Z`
- 官方釋出說明：`Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.3...v0.9.4`

### 使用者可見變更

- TRON 支付掃鏈目前已回到按區塊監聽的路徑，先前那次對新版 TRON 流程的回退不再是當前上游有效狀態。
- 後續支付處理修正也調整了收款成功後的訂單通知行為。
- 託管收銀臺入口現在會先跳轉到 SPA 的 cashier 流程，而不是直接由 `/pay/checkout-counter/:trade_id` 輸出後端渲染 HTML 模板。

### 部署與配置變更

- 託管收銀臺目前依賴 SPA 版 `www/` 前端路徑，而不是較早期那套獨立 `static/` 收銀臺資產路徑。
- 後續 Docker 映像也把已不再對應當前收銀臺交付路徑的冗餘 `static` 複製步驟清理掉了。

### 介面變更

- `GET /pay/checkout-counter/:trade_id` 現在作為 cashier SPA 的跳轉入口。
- 目前原始碼新增 `GET /pay/checkout-counter-resp/:trade_id`，作為新 SPA 收銀臺使用的 JSON 資料介面。
- 本次釋出沒有引入新的商戶簽名欄位或回撥契約變更。

### 依據

- GitHub Release `v0.9.4`
- 對比差異 `v0.9.3...v0.9.4`
- 提交 `9e885d8`、`de9c45a`、`96ea748`、`51a2acc`、`d17d212`、`9c533a7`、`ff68279`
- 上游 issue `#55`（Docker 部署缺少收銀臺檔案）

## v0.9.3

- 釋出標籤：`v0.9.3`
- 釋出時間：`2026-04-25T10:50:34Z`
- 官方釋出說明：`Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.2...v0.9.3`

### 使用者可見變更

- 修正安裝完成後的根路由行為，現在 `GET /` 會穩定回到前端 SPA，而不會再被後端根路由攔截。
- 安裝模式下仍會把根路徑導向 `/install`，首次安裝流程保持不變。

### 部署與配置變更

- 本次釋出沒有公布新的公共環境變數或部署旗標。
- 主要是調整主站根路由處理方式，讓已完成安裝的站點進入前端頁面更穩定。

### 介面變更

- 本次釋出沒有新增公共 API 路由。
- 後端根路由由類似 `Any("/")` 的攔截方式改為 `POST("/")`，把一般瀏覽器的 `GET /` 保留給 SPA。

### 依據

- GitHub Release `v0.9.3`
- 對比差異 `v0.9.2...v0.9.3`
- 提交 `95879e3`、合併標籤 `67263da`

## v0.9.2

- 釋出標籤：`v0.9.2`
- 釋出時間：`2026-04-24T16:14:34Z`
- 官方釋出說明：`Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.1...v0.9.2`

### 使用者可見變更

- 管理後臺的匯率設定現在支援配置強制 USDT 匯率。
- Docker 部署示例持續與目前的 `gmwallet/epusdt:latest` 映象引用保持一致。

### 部署與配置變更

- 官方釋出說明中未明確公布新的公共環境變數。
- 現有 Docker 升級示例仍使用 `gmwallet/epusdt:latest`。

### 介面變更

- 本次釋出在官方說明與對比差異中未見新的公共 API 路由。

### 依據

- GitHub Release `v0.9.2`
- 對比差異 `v0.9.1...v0.9.2`
- 提交 `dd1bf70`、`143bc84`

## v0.9.1

- 釋出標籤：`v0.9.1`
- 釋出時間：`2026-04-22T18:29:39Z`

### 使用者可見變更

- 內建安裝嚮導：首次啟動時若沒有可用設定檔，會自動進入 Web 安裝頁面。當前表單主要涵蓋 `app_name`、`app_uri`、監聽位址/埠、執行時路徑、日誌路徑、訂單過期時間與回呼重試次數等欄位。
- Docker 映象支援直接拉取 `docker pull gmwallet/epusdt:latest`，無需掛載 `.env` 即可完成首次部署。

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
