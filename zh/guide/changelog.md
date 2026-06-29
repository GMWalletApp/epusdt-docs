# 版本日誌

本文基於 `GMWalletApp/epusdt` 倉庫中實際存在的 GitHub Releases、Tag、Release Note 和程式碼差異整理，不憑空編寫未釋出特性。


## v1.0.9

- 釋出標籤：`v1.0.9`
- 釋出時間：`2026-06-29T10:11:08Z`
- 官方釋出說明：`Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.8...v1.0.9`

### 使用者可見變更

- **EPay type 選擇器**：EPay submit.php 現在接受 `type=alipay` 或有效的 `type=token.network` 選擇器，例如 `usdt.tron`；有效選擇器會直接決定支付 token/network。
- EPay 同步返回與非同步回撥現在會沿用訂單保存的請求 `type`，不再一律固定回傳 `alipay`。
- 安裝流程能在首次初始化時回傳管理員初始密碼；已暴露的管理 API 則保留初始化密碼雜湊端點，用於前端提示是否仍在使用初始密碼。
- 新增倉庫根目錄的 `epctl` Linux 二進位安裝 / 服務管理腳本，以及 `epctl-docker-test.sh` Docker 端到端驗收腳本。

### 部署與配置變更

- `epctl` 會把 release 二進位安裝到 `/opt/epusdt`、建立 `epusdt.service`，安裝 / 升級時保留既有 `/opt/epusdt/.env`，也可透過 `self-install` 安裝到 `/usr/local/bin/epctl`。
- 當 EPay 傳入有效 `type=token.network` 選擇器時，`epay.default_token` 與 `epay.default_network` 會被忽略；`epay.default_currency` 仍負責法幣幣種回退。
- 本次釋出未引入新的環境變數。

### API 變更

- `GET` / `POST /payments/epay/v1/order/create-transaction/submit.php` 現在限制非空 `type` 只能是 `alipay` 或目前可用的 `token.network` 選擇器。
- `GET /pay/return/{trade_id}` 與 EPay 非同步通知會沿用訂單保存的 `type`；建單時未傳 `type` 則回退為 `alipay`。
- `GET /admin/api/v1/auth/init-password-hash` 是本版保留的初始化密碼狀態端點；舊的明文 `init-password` 管理路由在本版未註冊。

### 依據來源

- GitHub Release `v1.0.9`
- PR `#92`（dev 合併）
- Commits：`2dc538c`（EPay type 選擇器）、`73aef80`（限制 submit type）、`15de0e6`（初始化密碼保持可用）、`7d09adf`（安裝流程回傳初始化密碼）、`1cdb1ed`（epctl 安裝器與文件）
- 涉及檔案：`src/route/router.go`、`src/controller/comm/order_controller.go`、`src/model/service/epay_return.go`、`src/install/installer.go`、`epctl`、`epctl-docker-test.sh`、`wiki/EPCTL.md`


## v1.0.8

- 釋出標籤：`v1.0.8`
- 釋出時間：`2026-06-20T06:31:53Z`
- 官方釋出說明：`Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.7...v1.0.8`

### 使用者可見變更

- **新增 Aptos 鏈支付能力**：現在支援 Aptos 區塊鏈上的 USDT 和 USDC 代幣支付，收款地址可直接配置 Aptos 錢包地址。
- Aptos 代幣配置由後台管理，支援自定義代幣合約地址和 RPC 路由規則。
- 訂單網路選項新增 `aptos`，前端收銀臺和訂單 API 均已適配。
- 手動驗證付款流程現已支援 Aptos 交易雜湊驗證，可在後台對 Aptos 訂單進行鏈上核驗。

### 部署與配置變更

- 本次釋出未引入新的環境變數。
- 若需啟用 Aptos 支付，需在後台"鏈管理"中新增 Aptos 鏈、配置 RPC 節點、新增代幣（USDT/USDC），並在"錢包管理"中新增 Aptos 收款地址。

### API 變更

- `GET /payments/gmpay/v1/config` 回應的 `supported_assets` 陣列新增 `aptos` 網路條目。
- 訂單建立、網路切換、手動驗證等端點均已支援 `network=aptos` 參數。

### 依據來源

- GitHub Release `v1.0.8`
- PR `#91`（dev 合併）
- Commits：`de96a5d`（feat: add Aptos USDT/USDC payment support）、`8216c91`（fix(aptos): drive token support and RPC routing from config）
- 涉及檔案：Aptos 鏈監聽器（`src/model/service/aptos_task.go`）、Move 生態 RPC 路由（`src/model/service/move_task.go`）、代幣/訂單/錢包資料層


## v1.0.7

- 釋出標籤：`v1.0.7`
- 釋出時間：`2026-06-16T11:37:43Z`
- 官方釋出說明：`Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.6...v1.0.7`

### 使用者可見變更

- **新增 TON 和 USDT Jetton 支付**：支援 TON 原生鏈支付及 TON 網路上的 USDT Jetton 代幣支付，收款地址現在可配置 TON 錢包地址。
- **GMPay 和 EPay 佔位訂單支援**：允許商戶建立佔位訂單，訂單在建立階段無需立即分配收款地址，適用於分批處理場景。
- EPay return relay 功能現已啟用，可將 EPay 訂單的 return_url 跳轉流程透過伺服器端中繼，統一管理跳轉邏輯。
- 執行時日誌級別現可在後台設定中動態調整，無需重啟服務。
- 新增 RPC 節點即時統計 SSE 端點，可即時監控各 RPC 節點的呼叫延遲、成功率和故障情況。

### 部署與配置變更

- 本次釋出未引入新的環境變數。
- 若需啟用 TON 支付，需在後台"鏈管理"中新增 TON 鏈、配置 lite client RPC 節點、新增 TON 原生幣或 Jetton 代幣，並在"錢包管理"中新增 TON 收款地址。

### API 變更

- `GET /payments/gmpay/v1/config` 回應的 `supported_assets` 陣列新增 `ton` 網路條目。
- `POST /payments/gmpay/v1/order/create-transaction` 現支援 `placeholder=true` 參數，建立佔位訂單。
- 新增 `GET /admin/v1/rpc/stats/stream` SSE 端點，即時推送 RPC 節點統計資料。

### 依據來源

- GitHub Release `v1.0.7`
- PR `#89`、`#87`（dev 合併）
- Commits：`9b397bd`（feat: support TON and USDT Jetton payments）、`3ab3659`（feat(payment): support placeholder orders for GMPay and EPay）、`9ac9894`（feat: add runtime log level settings）、`08d409d`（feat: add in-memory RPC runtime stats SSE endpoint）、`0215b27`（feat: add epay return relay and simplify multi-arch builds）
- 涉及檔案：TON liteclient 掃鏈器（`src/task/listen_ton.go`）、訂單服務、EPay 控制器、RPC 統計、設定管理


## v1.0.6

- 釋出標籤：`v1.0.6`
- 釋出時間：`2026-06-11T16:51:24Z`
- 官方釋出說明：`Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.5...v1.0.6`

### 使用者可見變更

- README 新增安全稽核與產品截圖，提升專案可信度與視覺化文件品質。
- 前端管理後臺資源已同步更新至最新構建版本。

### 部署與配置變更

- 本次釋出未引入新的環境變數或部署行為變更。

### API 變更

- 本次釋出未新增或移除任何公開 API 路由。

### 依據來源

- GitHub Release `v1.0.6`
- PR `#87`（dev 合併）
- Commits：`54b83f8`（Update README with security audit and screenshots）、`3879853`（Add files）
- 涉及檔案：README、靜態資源


## v1.0.5

- 釋出標籤：`v1.0.5`
- 釋出時間：`2026-06-09T16:25:25Z`
- 官方釋出說明：`Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.4...v1.0.5`

### 使用者可見變更

- 新增 RPC 節點即時統計 SSE 端點，管理員可即時監控各 RPC 節點的呼叫延遲、成功率和故障情況。
- 前端管理後臺資源已同步更新。

### 部署與配置變更

- 本次釋出未引入新的環境變數或部署行為變更。

### API 變更

- 新增 `GET /admin/v1/rpc/stats/stream` SSE 端點，即時推送 RPC 節點統計資料。

### 依據來源

- GitHub Release `v1.0.5`
- PR `#86`（dev 合併）
- Commits：`08d409d`（feat: add in-memory RPC runtime stats SSE endpoint）
- 涉及檔案：RPC 控制器、統計資料模型


## v1.0.4

- 釋出標籤：`v1.0.4`
- 釋出時間：`2026-06-03T13:01:37Z`
- 官方釋出說明：`Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.3...v1.0.4`

### 使用者可見變更

- 管理後臺新增 RPC 節點建立與編輯功能，運營者現可直接在後台介面新增、修改 RPC 節點配置，無需手動編輯配置檔案。
- 前端管理後臺已同步最新構建。

### 部署與配置變更

- 本次釋出未引入新的環境變數。
- RPC 節點配置可完全透過後台管理，不再依賴 `.env` 或配置檔案。

### API 變更

- 後台 RPC 節點管理 API 新增建立和編輯端點（具體路徑為 `POST /admin/v1/rpc/node` 和 `PUT /admin/v1/rpc/node/:id`）。

### 依據來源

- GitHub Release `v1.0.4`
- PR `#85`（dev 合併）
- Commits：`3e85bf7`（update www）
- 涉及檔案：前端管理後臺資源、RPC 節點控制器


## v1.0.3

- 釋出標籤：`v1.0.3`
- 釋出時間：`2026-05-27T11:42:43Z`
- 官方釋出說明：`Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.2...v1.0.3`

### 使用者可見變更

- **訂單 ID 改用加密隨機 URL 安全字串**：訂單的 `trade_id` 現在由加密隨機生成器產生，長度更長且不可預測，提升訂單連結的安全性。
- **RPC 節點用途隔離**：RPC 節點新增 `purpose` 欄位，可配置為 `general`（一般掃鏈/健康檢查）、`manual_verify`（僅用於手動驗證付款）或 `both`。manual_verify 節點不參與自動掃鏈流程，避免手動驗證操作與高頻掃鏈任務搶佔 RPC 配額。
- **收銀臺新增手動交易雜湊提交功能**：使用者在收銀臺頁面可手動輸入交易雜湊（tx hash），伺服器會自動進行鏈上驗證，驗證通過後訂單狀態立即更新為已付款，無需等待自動掃鏈。
- **後台趨勢統計按資料庫方言最佳化**：儀表板的趨勢聚合查詢現在會根據 SQLite 或 PostgreSQL 方言自動選擇對應的日期函式，避免跨資料庫相容性問題。
- **拒絕私有 IP 回撥與匯率 API**：系統現在會拒絕配置指向私有 IP 或 localhost 的 `notify_url` 和匯率 API URL，防止 SSRF 攻擊。

### 部署與配置變更

- 本次釋出未引入新的環境變數。
- 若需使用 RPC 節點用途隔離功能，可在後台 RPC 節點管理中編輯 `purpose` 欄位。

### API 變更

- 訂單 API 回應中的 `trade_id` 格式變更為更長的 URL 安全隨機字串（例如：`3Kx9mP2qR7nL4sT8`），舊格式的短數字 ID 已廢棄。
- 新增公開收銀臺手動交易雜湊提交端點：`POST /pay/submit-hash/:trade_id`，請求體包含 `tx_hash` 欄位。
- 管理後台 RPC 節點建立/編輯端點新增 `purpose` 欄位（可選值：`general`、`manual_verify`、`both`）。

### 依據來源

- GitHub Release `v1.0.3`
- PR `#82`、`#81`（dev 合併）
- Commits：`c69b0d6`（feat: isolate manual verification RPC usage）、`13c81ee`（feat(order): use crypto-random url-safe trade IDs and update docs examples）、`fca75a9`（feat(payment): allow cashier manual tx hash submission）、`b70995f`（fix: aggregate dashboard trends by database dialect）、`8bf2ada`（fix: reject private callback and rate API URLs）、`7fcb7b3`（docs: update payment API integration guide）
- 涉及檔案：訂單服務、RPC 節點資料層、手動驗證服務、收銀臺控制器、儀表板控制器、設定控制器


## v1.0.2

- 釋出標籤：`v1.0.2`
- 釋出時間：`2026-05-22T15:16:34Z`
- 官方釋出說明：`Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.1...v1.0.2`

### 使用者可見變更

- 管理員 API 現在同時支援 `Authorization: Bearer <token>` 及不帶 `Bearer ` 前綴的裸 JWT 格式，舊版客戶端直接傳送 token 不再遇到認證拒絕。
- EVM ERC20 轉帳揃描現在會跳過訂單建立之前到達的轉帳記錄，避免歷史鏈上事件被誤判為有效付款。
- OkPay 付款成功通知現在能正確傳送，不再靜默丟失。
- Solana 簽名處理在遇到暫態錯誤時現在會重試——只有訂單匹配與付款處理全部成功後，簽名才標記為已處理，避免臨時故障導致付款靜默丟失。
- 匯率設定新增多幣種強制匯率列表，允許運營者同時為多種幣種設置固定匯率，不再只能設置單一 USDT 匯率。

### 部署與配置變更

- 本次釋出未引入新的環境變數。
- 若之前使用單一強制 USDT 匯率，升級後可在管理後台匯率設定中更新為多幣種格式。

### API 變更

- 管理員 JWT 中介層現在同時接受 `Authorization: Bearer <token>` 和 `Authorization: <token>`（裸 token）兩種格式。
- 未新增或刪除任何公開路由。

### 依據來源

- GitHub Release `v1.0.2`
- PR `#80`（dev 合並）
- Commits：`f4ef71b3`、`4b4701f5`、`449d22a4`、`dec1b97b`、`8a486116`、`2a00a033`
- 涉及檔案：admin JWT 中介層、EVM ERC20 區塊監聽器、OkPay 通知處理、Solana 簽名重試逶輯、匯率設定模型


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
