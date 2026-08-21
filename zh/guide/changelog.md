# 版本日志

本文基于 `GMWalletApp/epusdt` 仓库中实际存在的 GitHub Releases、Tag、Release Note 和程序码差异整理，不凭空编写未发布特性。


## v2.0.0

- 发布标签：`v2.0.0`
- 发布时间：`2026-07-23T06:04:47Z`
- 官方发布说明：`GMPay 接入存在破坏性变更：签名从 MD5 改为 HMAC-SHA256`
- 完整变更：`https://github.com/GMWalletApp/epusdt/compare/v1.0.10...v2.0.0`

### 用户可见变更

- **GMPay 签名破坏性变更**：GMPay 请求与回调签名改用 HMAC-SHA256，HMAC key 为商户 `secret_key`。既有 MD5 GMPay 客户端若未升级，会收到 `401 Unauthorized`。
- EPay 兼容请求与回调不受影响，仍使用 `sign` / `sign_type` 的 MD5 规则。
- 托管收银台初始化数据新增 `server_time`，前端可用服务端时间计算倒数，避免依赖浏览器本地时钟。
- 新增不依赖第三方套件的 Python GMPay 建单示例：`sdk/python/gmpay_create_order.py`。
- 改善 EVM 支付回补恢复能力，中断后的扫描区间可更可靠地追回。

### 部署与配置变更

- 部署 v2.0.0 前必须先升级 GMPay 客户端：排除 `signature` 与空值，按 ASCII 键名排序，拼接为 `key=value&key=value`，再用 `secret_key` 计算小写十六进位 HMAC-SHA256。
- 汇率设置新增 `rate.mode=fixed|auto` 与 `rate.cache_ttl_seconds`（`10` 到 `86400` 秒）。fixed 模式使用 `rate.forced_rate_list`；auto 模式拉取 `rate.api_url` 并持久化快取。
- auto 汇率刷新遇到供应商回传部分数据时会保留上一次成功的币种汇率；刷新或持久化失败时会继续使用最后一次可用的持久化快取。

### API 变更

- `POST /payments/gmpay/v1/order/create-transaction` 现以 HMAC-SHA256 验证 GMPay `signature`，不再使用 MD5。
- GMPay 商户回调也必须使用同一套 HMAC-SHA256 规范化引数规则验签。
- `GET /pay/checkout-counter-resp/{trade_id}` 响应数据新增 `server_time`。
- 管理 API 新增 `GET /admin/api/v1/settings/rate/status` 与 `POST /admin/api/v1/settings/rate/refresh`，用于查看汇率快取状态与强制刷新。

### 依据来源

- GitHub Release `v2.0.0`
- PR `#104`（dev 合并）与 PR `#99`（EVM 回补恢复）
- Commits：`44d90b6`（EVM 回补恢复）、`f086d8b`（收银台 `server_time`）、`3dc8ab0`（auto 汇率模式与持久化回退快取）、`58141cd`（GMPay HMAC-SHA256 签名）、`2353d85`（Python GMPay SDK 示例）
- 涉及文件：`src/middleware/check_sign.go`、`src/util/sign/sign.go`、`src/model/service/epay_return.go`、`src/model/response/pay_response.go`、`src/config/rate.go`、`src/controller/admin/settings_controller.go`、`src/route/router.go`、`src/task/listen_evm_backfill.go`、`sdk/python/gmpay_create_order.py`


## v1.0.10

- 发布标签：`v1.0.10`
- 发布时间：`2026-07-10T13:24:42Z`
- 官方发布说明：`Allow admin to mark expired on-chain orders as paid and seed rates`
- 完整变更：`https://github.com/GMWalletApp/epusdt/compare/v1.0.9...v1.0.10`

### 用户可见变更

- 后台手动标记已支付现在可在提交交易 hash 并验证通过后修复**已过期的链上订单**；公开收银台交易 hash 提交仍只接受待支付订单，仍会拒绝过期订单与 OkPay / 第三方支付订单。
- 内建 CNY 稳定币强制汇率默认值：`cny.usdt` 与 `cny.usdc` 均为 `0.14705882352941177`。
- `rate.forced_rate_list` 为空时，更新设置或删除设置后会恢复内建 CNY 稳定币默认值；任何非空自定义 JSON 都视为用户主动配置，不会被合并或覆盖。
- `rate.api_url` 现在可留空；若有填写，仍必须是公开 HTTP/HTTPS URL。

### 部署与配置变更

- `epctl upgrade` 现在要求既有 `/opt/epusdt/.env`，因此升级不再建立新配置；新机请先执行 `install`。
- 直接执行 `epctl upgrade` 会替换 release 文件并默认重启 `epusdt`。可用 `--no-restart` 只更新文件不重启，或用 `--prompt-restart` 在交互终端询问。
- 升级部署会为目前 binary、`.env.example` 和 systemd unit 保留 rollback 备份；文件部署或重启失败时，`epctl` 会尝试还原上一版 release 文件。

### API 变更

- 后台 mark-paid 在链上交易验证通过后接受待支付与已过期链上订单。
- `POST /pay/submit-tx-hash/{trade_id}` 仍更严格：只接受待支付链上订单；过期订单会在验证前被拒绝。
- 汇率设置文件现在将 `rate.api_url` 视为可选，并说明 `rate.forced_rate_list` 的默认恢复行为。

### 依据来源

- GitHub Release `v1.0.10`
- PR `#97`（dev 合并）
- Commits：`392240e`（过期链上订单后台 mark-paid）、`d18965d`（CNY 稳定币强制汇率默认值）、`6589ad1`（epctl 升级重启控制与 rollback-safe 部署）、`8f03599` / `5668a2a`（前端构建同步）
- 涉及文件：`src/controller/admin/order_controller.go`、`src/controller/comm/pay_controller.go`、`src/model/service/order_service.go`、`src/model/data/settings_data.go`、`src/model/mdb/settings.go`、`src/model/dao/mdb_table_init.go`、`src/controller/admin/settings_controller.go`、`epctl`、`wiki/EPCTL.md`、`wiki/EPCTL.en.md`


## v1.0.9

- 发布标签：`v1.0.9`
- 发布时间：`2026-06-29T10:11:08Z`
- 官方发布说明：`Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.8...v1.0.9`

### 用户可见变更

- **EPay type 选择器**：EPay submit.php 现在接受 `type=alipay` 或有效的 `type=token.network` 选择器，例如 `usdt.tron`；有效选择器会直接决定支付 token/network。
- EPay 同步返回与异步回调现在会沿用订单保存的请求 `type`，不再一律固定回传 `alipay`。
- 安装流程能在首次初始化时回传管理员初始密码；已暴露的管理 API 则保留初始化密码哈希端点，用于前端提示是否仍在使用初始密码。
- 新增仓库根目录的 `epctl` Linux 二进制安装 / 服务管理脚本，以及 `epctl-docker-test.sh` Docker 端到端验收脚本。

### 部署与配置变更

- `epctl` 会把 release 二进制安装到 `/opt/epusdt`、建立 `epusdt.service`，安装 / 升级时保留既有 `/opt/epusdt/.env`，也可通过 `self-install` 安装到 `/usr/local/bin/epctl`。
- 当 EPay 传入有效 `type=token.network` 选择器时，`epay.default_token` 与 `epay.default_network` 会被忽略；`epay.default_currency` 仍负责法币币种回退。
- 本次发布未引入新的环境变数。

### API 变更

- `GET` / `POST /payments/epay/v1/order/create-transaction/submit.php` 现在限制非空 `type` 只能是 `alipay` 或目前可用的 `token.network` 选择器。
- `GET /pay/return/{trade_id}` 与 EPay 异步通知会沿用订单保存的 `type`；建单时未传 `type` 则回退为 `alipay`。
- `GET /admin/api/v1/auth/init-password-hash` 是本版保留的初始化密码状态端点；旧的明文 `init-password` 管理路由在本版未注册。

### 依据来源

- GitHub Release `v1.0.9`
- PR `#92`（dev 合并）
- Commits：`2dc538c`（EPay type 选择器）、`73aef80`（限制 submit type）、`15de0e6`（初始化密码保持可用）、`7d09adf`（安装流程回传初始化密码）、`1cdb1ed`（epctl 安装器与文件）
- 涉及文件：`src/route/router.go`、`src/controller/comm/order_controller.go`、`src/model/service/epay_return.go`、`src/install/installer.go`、`epctl`、`epctl-docker-test.sh`、`wiki/EPCTL.md`


## v1.0.8

- 发布标签：`v1.0.8`
- 发布时间：`2026-06-20T06:31:53Z`
- 官方发布说明：`Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.7...v1.0.8`

### 用户可见变更

- **新增 Aptos 链支付能力**：现在支持 Aptos 区块链上的 USDT 和 USDC 代币支付，收款地址可直接配置 Aptos 钱包地址。
- Aptos 代币配置由后台管理，支持自定义代币合约地址和 RPC 路由规则。
- 订单网络选项新增 `aptos`，前端收银台和订单 API 均已适配。
- 手动验证付款流程现已支持 Aptos 交易哈希验证，可在后台对 Aptos 订单进行链上核验。

### 部署与配置变更

- 本次发布未引入新的环境变数。
- 若需启用 Aptos 支付，需在后台"链管理"中新增 Aptos 链、配置 RPC 节点、新增代币（USDT/USDC），并在"钱包管理"中新增 Aptos 收款地址。

### API 变更

- `GET /payments/gmpay/v1/config` 响应的 `supported_assets` 阵列新增 `aptos` 网络条目。
- 订单建立、网络切换、手动验证等端点均已支持 `network=aptos` 参数。

### 依据来源

- GitHub Release `v1.0.8`
- PR `#91`（dev 合并）
- Commits：`de96a5d`（feat: add Aptos USDT/USDC payment support）、`8216c91`（fix(aptos): drive token support and RPC routing from config）
- 涉及文件：Aptos 链监听器（`src/model/service/aptos_task.go`）、Move 生态 RPC 路由（`src/model/service/move_task.go`）、代币/订单/钱包数据层


## v1.0.7

- 发布标签：`v1.0.7`
- 发布时间：`2026-06-16T11:37:43Z`
- 官方发布说明：`Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.6...v1.0.7`

### 用户可见变更

- **新增 TON 和 USDT Jetton 支付**：支持 TON 原生链支付及 TON 网络上的 USDT Jetton 代币支付，收款地址现在可配置 TON 钱包地址。
- **GMPay 和 EPay 占位订单支持**：允许商户建立占位订单，订单在建立阶段无需立即分配收款地址，适用于分批处理场景。
- EPay return relay 功能现已启用，可将 EPay 订单的 return_url 跳转流程通过服务器端中继，统一管理跳转逻辑。
- 运行时日志级别现可在后台设置中动态调整，无需重启服务。
- 新增 RPC 节点实时统计 SSE 端点，可实时监控各 RPC 节点的调用延迟、成功率和故障情况。

### 部署与配置变更

- 本次发布未引入新的环境变数。
- 若需启用 TON 支付，需在后台"链管理"中新增 TON 链、配置 lite client RPC 节点、新增 TON 原生币或 Jetton 代币，并在"钱包管理"中新增 TON 收款地址。

### API 变更

- `GET /payments/gmpay/v1/config` 响应的 `supported_assets` 阵列新增 `ton` 网络条目。
- `POST /payments/gmpay/v1/order/create-transaction` 现支持 `placeholder=true` 参数，建立占位订单。
- 新增 `GET /admin/v1/rpc/stats/stream` SSE 端点，实时推送 RPC 节点统计数据。

### 依据来源

- GitHub Release `v1.0.7`
- PR `#89`、`#87`（dev 合并）
- Commits：`9b397bd`（feat: support TON and USDT Jetton payments）、`3ab3659`（feat(payment): support placeholder orders for GMPay and EPay）、`9ac9894`（feat: add runtime log level settings）、`08d409d`（feat: add in-memory RPC runtime stats SSE endpoint）、`0215b27`（feat: add epay return relay and simplify multi-arch builds）
- 涉及文件：TON liteclient 扫链器（`src/task/listen_ton.go`）、订单服务、EPay 控制器、RPC 统计、设置管理


## v1.0.6

- 发布标签：`v1.0.6`
- 发布时间：`2026-06-11T16:51:24Z`
- 官方发布说明：`Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.5...v1.0.6`

### 用户可见变更

- README 新增安全稽核与产品截图，提升项目可信度与视觉化文件品质。
- 前端管理后台资源已同步更新至最新构建版本。

### 部署与配置变更

- 本次发布未引入新的环境变数或部署行为变更。

### API 变更

- 本次发布未新增或移除任何公开 API 路由。

### 依据来源

- GitHub Release `v1.0.6`
- PR `#87`（dev 合并）
- Commits：`54b83f8`（Update README with security audit and screenshots）、`3879853`（Add files）
- 涉及文件：README、静态资源


## v1.0.5

- 发布标签：`v1.0.5`
- 发布时间：`2026-06-09T16:25:25Z`
- 官方发布说明：`Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.4...v1.0.5`

### 用户可见变更

- 新增 RPC 节点实时统计 SSE 端点，管理员可实时监控各 RPC 节点的调用延迟、成功率和故障情况。
- 前端管理后台资源已同步更新。

### 部署与配置变更

- 本次发布未引入新的环境变数或部署行为变更。

### API 变更

- 新增 `GET /admin/v1/rpc/stats/stream` SSE 端点，实时推送 RPC 节点统计数据。

### 依据来源

- GitHub Release `v1.0.5`
- PR `#86`（dev 合并）
- Commits：`08d409d`（feat: add in-memory RPC runtime stats SSE endpoint）
- 涉及文件：RPC 控制器、统计数据模型


## v1.0.4

- 发布标签：`v1.0.4`
- 发布时间：`2026-06-03T13:01:37Z`
- 官方发布说明：`Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.3...v1.0.4`

### 用户可见变更

- 管理后台新增 RPC 节点建立与编辑功能，运营者现可直接在后台接口新增、修改 RPC 节点配置，无需手动编辑配置文件。
- 前端管理后台已同步最新构建。

### 部署与配置变更

- 本次发布未引入新的环境变数。
- RPC 节点配置可完全通过后台管理，不再依赖 `.env` 或配置文件。

### API 变更

- 后台 RPC 节点管理 API 新增建立和编辑端点（具体路径为 `POST /admin/v1/rpc/node` 和 `PUT /admin/v1/rpc/node/:id`）。

### 依据来源

- GitHub Release `v1.0.4`
- PR `#85`（dev 合并）
- Commits：`3e85bf7`（update www）
- 涉及文件：前端管理后台资源、RPC 节点控制器


## v1.0.3

- 发布标签：`v1.0.3`
- 发布时间：`2026-05-27T11:42:43Z`
- 官方发布说明：`Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.2...v1.0.3`

### 用户可见变更

- **订单 ID 改用加密随机 URL 安全字串**：订单的 `trade_id` 现在由加密随机生成器产生，长度更长且不可预测，提升订单连结的安全性。
- **RPC 节点用途隔离**：RPC 节点新增 `purpose` 字段，可配置为 `general`（一般扫链/健康检查）、`manual_verify`（仅用于手动验证付款）或 `both`。manual_verify 节点不参与自动扫链流程，避免手动验证操作与高频扫链任务抢占 RPC 配额。
- **收银台新增手动交易哈希提交功能**：用户在收银台页面可手动输入交易哈希（tx hash），服务器会自动进行链上验证，验证通过后订单状态立即更新为已付款，无需等待自动扫链。
- **后台趋势统计按数据库方言最佳化**：仪表板的趋势聚合查询现在会根据 SQLite 或 PostgreSQL 方言自动选择对应的日期函式，避免跨数据库兼容性问题。
- **拒绝私有 IP 回调与汇率 API**：系统现在会拒绝配置指向私有 IP 或 localhost 的 `notify_url` 和汇率 API URL，防止 SSRF 攻击。

### 部署与配置变更

- 本次发布未引入新的环境变数。
- 若需使用 RPC 节点用途隔离功能，可在后台 RPC 节点管理中编辑 `purpose` 字段。

### API 变更

- 订单 API 响应中的 `trade_id` 格式变更为更长的 URL 安全随机字串（例如：`3Kx9mP2qR7nL4sT8`），旧格式的短数字 ID 已废弃。
- 新增公开收银台手动交易哈希提交端点：`POST /pay/submit-hash/:trade_id`，请求体包含 `tx_hash` 字段。
- 管理后台 RPC 节点建立/编辑端点新增 `purpose` 字段（可选值：`general`、`manual_verify`、`both`）。

### 依据来源

- GitHub Release `v1.0.3`
- PR `#82`、`#81`（dev 合并）
- Commits：`c69b0d6`（feat: isolate manual verification RPC usage）、`13c81ee`（feat(order): use crypto-random url-safe trade IDs and update docs examples）、`fca75a9`（feat(payment): allow cashier manual tx hash submission）、`b70995f`（fix: aggregate dashboard trends by database dialect）、`8bf2ada`（fix: reject private callback and rate API URLs）、`7fcb7b3`（docs: update payment API integration guide）
- 涉及文件：订单服务、RPC 节点数据层、手动验证服务、收银台控制器、仪表板控制器、设置控制器


## v1.0.2

- 发布标签：`v1.0.2`
- 发布时间：`2026-05-22T15:16:34Z`
- 官方发布说明：`Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.1...v1.0.2`

### 用户可见变更

- 管理员 API 现在同时支持 `Authorization: Bearer <token>` 及不带 `Bearer ` 前缀的裸 JWT 格式，旧版客户端直接传送 token 不再遇到认证拒绝。
- EVM ERC20 转帐揃描现在会跳过订单建立之前到达的转帐记录，避免历史链上事件被误判为有效付款。
- OkPay 付款成功通知现在能正确传送，不再静默丢失。
- Solana 签名处理在遇到暂态错误时现在会重试——只有订单匹配与付款处理全部成功后，签名才标记为已处理，避免临时故障导致付款静默丢失。
- 汇率设置新增多币种强制汇率列表，允许运营者同时为多种币种设置固定汇率，不再只能设置单一 USDT 汇率。

### 部署与配置变更

- 本次发布未引入新的环境变数。
- 若之前使用单一强制 USDT 汇率，升级后可在管理后台汇率设置中更新为多币种格式。

### API 变更

- 管理员 JWT 中介层现在同时接受 `Authorization: Bearer <token>` 和 `Authorization: <token>`（裸 token）两种格式。
- 未新增或删除任何公开路由。

### 依据来源

- GitHub Release `v1.0.2`
- PR `#80`（dev 合并）
- Commits：`f4ef71b3`、`4b4701f5`、`449d22a4`、`dec1b97b`、`8a486116`、`2a00a033`
- 涉及文件：admin JWT 中介层、EVM ERC20 区块监听器、OkPay 通知处理、Solana 签名重试逶辑、汇率设置模型


## v1.0.1

- 发布标签：`v1.0.1`
- 发布时间：`2026-05-21T11:40:39Z`
- 官方发布说明：`feat: expose build version in public config` (PR #72)

### 用户可见变更

- `GET /payments/gmpay/v1/config` 响应新增 `version` 字段，返回当前服务器的建构版本（例如 `"version": "v1.0.1"`）。
- 设置记录在 upsert 时若已被软删除，现在会自动恢复，确保配置修改能正确生效。

### 部署与配置变更

- Docker 映像发布现在仅限 `v*` 格式的 tag 触发，非版本 tag 的建构不再发布到容器仓库。
- 建构版本在编译时通过 Docker 和 GoReleaser 注入，API 响应中的版本号与发布 tag 一致。

### API 变更

- `GET /payments/gmpay/v1/config` 响应新增 `version` 字串字段，反映服务器建构版本。

### 参考依据

- GitHub Release `v1.0.1`
- PR `#72`：feat: expose build version in public config
- Commits：`85b81e66`、`09642d4c`、`c19a7e5f`
- 相关文件：`src/model/response/support_response.go`、`src/model/data/settings_data.go`、`.github/workflows/docker-alpine.yml`

## v1.0.0


- 发布标签：`v1.0.0`
- 发布时间：`2026-05-20T16:09:00Z`
- 官方发布说明：`feat: verify manual mark-paid payments` (PR #70)

### 用户可见变更

- 管理员手动标记订单为已付款时，现在需要先进行链上验证——交易哈希会在接受状态变更前与链上数据核对。
- 验证内容包括：收款地址、代币合约地址、付款金额、确认数量及交易时间戳，防止误判。
- 同一交易哈希不可被重复使用，不能用于标记多个订单为已付款。
- 非链上订单类型不进入手动验证流程，会直接拒绝。
- `supported_assets` 响应新增 `display_name` 字段，前端可直接显示可读的链名称。
- 支持资产列表中 BSC 网络识别符从 `bsc` 改名为 `binance`。

### 部署与配置变更

- 本次发布未引入新的环境变数。
- Docker 映像及 docker-compose 配置无需变更。

### API 变更

- 管理员标记已付款端点现在需要有效的 `tx_hash` 参数并进行链上验证，无效或重复哈希将返回错误。
- `GET /payments/gmpay/v1/config` 的支持资产条目新增 `display_name` 字段。
- 支持资产中 BSC 网络値从 `bsc` 改为 `binance`。

### 依据来源

- GitHub 发布 `v1.0.0`，Pull Request [#70](https://github.com/GMWalletApp/epusdt/pull/70)
- 提交记录 `049a15c`
- `src/controller/admin/order_controller.go`、`src/model/service/manual_payment_verify.go`

## v0.9.7

- 发布标签：`v0.9.7`
- 发布时间：`2026-05-13T09:01:26Z`
- 官方发布说明：`Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.6...v0.9.7`

### 用户可见变更

- `README.zh-CN.md` 已删除；`README.md` 现为唯一主 README，将文件整合为单一入口。
- 前端管理后台资源（Service Worker precache manifest 及所有打包 JS 区块）已重新构建，所有静态资源以更新后的内容哈希重新命名，修复已载入过管理后台的用户可能遇到的快取问题。

### 部署与配置变更

- 本次发布未引入新的环境变数。
- 无运行时行为变更——本次发布仅涉及前端资源重新整理与文件整理。

### API 变更

- 未新增、移除或修改任何 API 路由。

### 依据来源

- GitHub release `v0.9.7`
- 对比差异 `v0.9.6...v0.9.7`
- 提交 `52b171b`、`4a69b7c`、`b0093c4`、`864eb59`
- 关键文件：`README.md`、`README.zh-CN.md`、`src/www/sw.js`、`src/www/index.html`、`src/www/assets/*`

## v0.9.6

- 发布标签：`v0.9.6`
- 发布时间：`2026-05-11T10:09:43Z`
- 官方发布说明：`Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.5...v0.9.6`

### 用户可见变更

- 首次启动时，初始管理员账号与密码现在会直接列印到控制台，不需要再去查数据库即可完成第一次登录。
- 管理后台外观设置新增 `background_color` 与 `background_image_url` 字段，可自订收银台页面的背景色与背景图片。
- 支付金额精度现在可设置，运营者可配置产生支付金额时保留几位小数。
- TRON 链代币解析改为在区块监听器中动态取得，不再需要在启动时写死代币合约地址。
- `README.md` 改为简体中文主 README；英文版独立为 `README.en.md`；`README.zh-CN.md` 已在后续 commit（4a69b7c8）中删除。
- `plugins/` 目录与内建的 `dujiaoka` 外挂示例已从仓库中移除。

### 部署与配置变更

- 未引入新的环境变数。
- README 重整属纯文件调整，不影响运行时行为。

### API 变更

- `GET /payments/gmpay/v1/config` 响应新增 `background_color` 与 `background_image_url` 字段（来自外观设置）。
- `GET /payments/gmpay/v1/config` 响应新增 `payment_amount_precision` 字段（来自支付设置）。
- 本次发布未新增或移除任何路由。

### 依据来源

- GitHub release `v0.9.6`
- Compare diff `v0.9.5...v0.9.6`
- 提交 `1a35cab`、`2d546e3`、`a8a3b86`、`3e0be9b`、`7c9e3e1`、`84972ea`、`1c805ed`、`8d2ddbd`、`07d1d83`、`7a905ba`、`4dc1ba8`、`4a69b7c`
- 关键文件：`src/bootstrap/bootstrap.go`、`src/controller/admin/settings_controller.go`、`src/model/data/settings_data.go`、`src/model/mdb/settings.go`、`src/task/listen_trc20_block.go`

## v0.9.5

- 发布标签：`v0.9.5`
- 发布时间：`2026-05-09T13:51:58Z`
- 官方发布说明：`Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.4...v0.9.5`

### 用户可见变更

- 托管收银台现在新增了 `okpay` 支付切换路径，不再只有原本的链上网络切换流程。
- checkout 响应现在会返回 `payment_url`，因此像 OkPay 这类第三方支付子订单可以明确跳转到外部支付连结，而不是只依赖本地收银台显示地址。
- 公开设置响应现在会暴露站点侧的 cashier 名称、logo URL、网站标题与支持连结，前端品牌展示不必再把这些信息硬编码在页面里。

### 部署与配置变更

- `.env.example` 已删除旧的 PostgreSQL / MySQL 设置区块；目前公开配置范例已回到以 SQLite 为主的实际部署路径，不再暗示这两种数据库仍是当前正常安装流程的一部分。
- Dockerfile 清理掉了多余的 `static` 复制步骤，与目前实际使用的前端交付路径保持一致。
- README 也顺手更新了 logo 与免责声明，但相较之下属于次要整理，不是本次版本的主要运行时变更。

### 接口变更

- GMPay 对前端公开的支付配置现在改由 `GET /payments/gmpay/v1/config` 提供，不再沿用较早期那条独立的 supported-assets 查询路径。
- `GET /payments/gmpay/v1/config` 会一次返回 `supported_assets`、站点品牌信息、EPay 默认值与 OkPay 公开配置字段。
- 新增 OkPay 回调入口：`POST /payments/okpay/v1/notify`。
- `POST /pay/switch-network` 现在文件与实际请求示例都已纳入 `network=okpay`，不再只限链上网络值。
- checkout 响应新增 `payment_url` 字段。

### 依据

- GitHub Release `v0.9.5`
- 对比差异 `v0.9.4...v0.9.5`
- 提交 `377176a`、`3623a54`、`51ad344`、`ff157c3`、`1a35cab`、`2d546e3`
- 关键程序码路径 `src/route/router.go`、`src/controller/comm/supported_asset_controller.go`、`src/model/response/order_response.go`、`src/model/response/support_response.go`、`src/.env.example`

## v0.9.4

- 发布标签：`v0.9.4`
- 发布时间：`2026-04-28T16:37:20Z`
- 官方发布说明：`Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.3...v0.9.4`

### 用户可见变更

- TRON 支付扫链目前已回到按区块监听的路径，先前那次对新版 TRON 流程的回退不再是当前上游有效状态。
- 后续支付处理修正也调整了收款成功后的订单通知行为。
- 托管收银台入口现在会先跳转到 SPA 的 cashier 流程，而不是直接由 `/pay/checkout-counter/:trade_id` 输出后端渲染 HTML 模板。

### 部署与配置变更

- 托管收银台目前依赖 SPA 版 `www/` 前端路径，而不是较早期那套独立 `static/` 收银台资产路径。
- 后续 Docker 映像也把已不再对应当前收银台交付路径的冗余 `static` 复制步骤清理掉了。

### 接口变更

- `GET /pay/checkout-counter/:trade_id` 现在作为 cashier SPA 的跳转入口。
- 目前源代码新增 `GET /pay/checkout-counter-resp/:trade_id`，作为新 SPA 收银台使用的 JSON 数据接口。
- 本次发布没有引入新的商户签名字段或回调契约变更。

### 依据

- GitHub Release `v0.9.4`
- 对比差异 `v0.9.3...v0.9.4`
- 提交 `9e885d8`、`de9c45a`、`96ea748`、`51a2acc`、`d17d212`、`9c533a7`、`ff68279`
- 上游 issue `#55`（Docker 部署缺少收银台文件）

## v0.9.3

- 发布标签：`v0.9.3`
- 发布时间：`2026-04-25T10:50:34Z`
- 官方发布说明：`Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.2...v0.9.3`

### 用户可见变更

- 修正安装完成后的根路由行为，现在 `GET /` 会稳定回到前端 SPA，而不会再被后端根路由拦截。
- 安装模式下仍会把根路径导向 `/install`，首次安装流程保持不变。

### 部署与配置变更

- 本次发布没有公布新的公共环境变数或部署旗标。
- 主要是调整主站根路由处理方式，让已完成安装的站点进入前端页面更稳定。

### 接口变更

- 本次发布没有新增公共 API 路由。
- 后端根路由由类似 `Any("/")` 的拦截方式改为 `POST("/")`，把一般浏览器的 `GET /` 保留给 SPA。

### 依据

- GitHub Release `v0.9.3`
- 对比差异 `v0.9.2...v0.9.3`
- 提交 `95879e3`、合并标签 `67263da`

## v0.9.2

- 发布标签：`v0.9.2`
- 发布时间：`2026-04-24T16:14:34Z`
- 官方发布说明：`Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.1...v0.9.2`

### 用户可见变更

- 管理后台的汇率设置现在支持配置强制 USDT 汇率。
- Docker 部署示例持续与目前的 `gmwallet/epusdt:latest` 镜像引用保持一致。

### 部署与配置变更

- 官方发布说明中未明确公布新的公共环境变数。
- 现有 Docker 升级示例仍使用 `gmwallet/epusdt:latest`。

### 接口变更

- 本次发布在官方说明与对比差异中未见新的公共 API 路由。

### 依据

- GitHub Release `v0.9.2`
- 对比差异 `v0.9.1...v0.9.2`
- 提交 `dd1bf70`、`143bc84`

## v0.9.1

- 发布标签：`v0.9.1`
- 发布时间：`2026-04-22T18:29:39Z`

### 用户可见变更

- 内建安装向导：首次启动时若没有可用配置文件，会自动进入 Web 安装页面。当前表单主要涵盖 `app_name`、`app_uri`、监听地址/埠、运行时路径、日志路径、订单过期时间与回呼重试次数等字段。
- Docker 镜像支持直接拉取 `docker pull gmwallet/epusdt:latest`，无需挂载 `.env` 即可完成首次部署。

### 部署与配置变更

- 安装向导提交后自动写入 `.env`，后续启动直接进入正常模式。
- `docker-compose.yaml` 的 `.env` 挂载现在是可选项。

### 接口变更

- 本次发布无新公共 API 路由。

## v0.9.0

- 发布标签：`v0.9.0`
- 发布时间：`2026-04-21T20:23:33Z`
- 官方发布说明：`Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.0.8...v0.9.0`

### 用户可见变更

- 新增完整管理后台，可管理 API Key、链、链上代币、钱包、订单、RPC 节点、系统设置、通知渠道与统计面板
- 多链能力进一步扩充套件，包含更完整的 EVM 监听支持，以及后台侧的链/代币管理流程
- 新增 Telegram 通知渠道，并补上与系统设置联动同步的更新
- 新增首装初始化流程，便于首次部署

### 部署与配置变更

- `.env.example` 将安装标记默认值改为启用，以配合首次安装流程
- 运行时新增 RPC 节点健康检查与自动切换能力
- 服务端执行包加入了构建后的后台静态资源
- 数据层新增 admin_user、api_key、chain、chain_token、rpc_node、settings、notification_channel 等模型

### 接口变更

- 新增完整的管理后台 REST API，覆盖认证、API Key、链、链代币、钱包、订单、RPC 节点、设置、统计面板与通知渠道
- 新增基于 JWT 的后台认证与 API Key 鉴权中介软体
- 支付、supported-asset、钱包、订单等请求/响应结构也随后台能力一并扩充套件

### 依据

- GitHub Release `v0.9.0`
- 对比差异 `v0.0.8...v0.9.0`
- 提交 `6bb47d4`、`5edc9dc`、`b499bc0`、`6ea5637`、`9163943`

## v0.0.8

- 发布标签：`v0.0.8`
- 发布时间：`2026-04-15T10:44:56Z`
- 官方发布说明：`- Enable polygon,plasma supports`

### 用户可见变更

- 新增 `polygon` 与 `plasma` 网络支持
- 支付页的网络选择逻辑有调整
- EVM 钱包地址储存逻辑得到修正

### 部署与配置变更

- 发布说明与对比差异中未见明确新增的环境变数

### 接口变更

- 官方发布说明中未明确宣告新的公共 API 路由
- 支持网络相关能力延续自 `v0.0.7` 这一轮开发

### 依据

- GitHub Release `v0.0.8`
- 对比差异 `v0.0.7...v0.0.8`
- 提交 `f7c5f67`、`097c716`

## v0.0.7

- 发布标签：`v0.0.7`
- 发布时间：`2026-04-15T06:00:55Z`
- 官方发布说明：`suport bsc, plasma, polygon......` + `support epay submit form params` + `Dev payment`

### 用户可见变更

- 新增 `bsc`、`polygon`、`plasma` 网络支持
- 新增 EPay 兼容 submit form 引数，提升对接兼容性
- Telegram 交互与支付相关处理在这一轮支付开发中有更新

### 部署与配置变更

- 支持网络的这一轮开发在源代码中新增了多条 EVM 监听路径
- 官方发布说明中未明确给出新的 `.env` 变数

### 接口变更

- 源代码历史中可见 supported-chain / supported-asset 相关接口能力
- 路由层更新了 EPay 兼容提交流程，对 `GET` 和 `POST` 方式都提供支持

### 依据

- GitHub Release `v0.0.7`
- 对比差异 `v0.0.6...v0.0.7`
- 提交 `9c003fb`、`8cd816c`、`786c5e8`、`70f8ed4`

## v0.0.6

- 发布标签：`v0.0.6`
- 发布时间：`2026-04-12T20:06:08Z`
- 官方发布说明：对比 `v0.0.5...v0.0.6`

### 用户可见变更

- Hosted checkout 改为两步支付流程
- 支持多网络支付切换
- Solana 扫链支持 `USDT` 与 `USDC`
- 新增 Ethereum ERC-20 的 `USDT` 与 `USDC` 扫链能力
- Telegram 支付通知新增网络信息
- Telegram 钱包地址校验增强，适配多网络地址

### 部署与配置变更

- 新增 `solana_rpc_url`
- 新增 `ethereum_ws_url`
- 新增 `epay_pid`
- 新增 `epay_key`
- 订单锁定与金额匹配逻辑加入 `network` 维度

### 接口变更

- 新增钱包管理界面 `/payments/gmpay/v1/wallet/*`
- 新增 `POST /pay/switch-network`
- 新增 EPay 兼容入口 `GET /payments/epay/v1/order/create-transaction/submit.php`
- checkout 返回结构新增 `is_selected`
- 下单流程新增可选字段 `name` 与 `payment_type`
- 当前源代码的网络标识使用小写值，例如 `tron`、`solana`、`ethereum`

### 依据

- GitHub Release `v0.0.6`
- 对比差异 `v0.0.5...v0.0.6`
- 提交 `3f071e6`、`32ca778`、`5e4d5df`

## v0.0.5

- 发布标签：`v0.0.5`
- 发布时间：`2026-04-03T17:05:30Z`
- 官方发布说明：`test: fix macOS path assertion and wallet address unique index`

### 用户可见变更

- 官方发布说明里没有明确的终端用户新功能

### 部署与配置变更

- 官方发布说明里没有明确的新部署变数

### 接口变更

- 程序码历史可见钱包地址唯一索引相关调整

### 依据

- GitHub Release `v0.0.5`
- 对比差异 `v0.0.4...v0.0.5`

## v0.0.4

- 发布标签：`v0.0.4`
- 发布名：`New UI Update`
- 发布时间：`2026-04-03T16:05:23Z`
- 官方发布说明：`feat: change payment ui`

### 用户可见变更

- 支付 UI 更新

### 部署与配置变更

- 发布说明中未宣告部署侧变化

### 接口变更

- 发布说明中未宣告接口侧变化

### 依据

- GitHub Release `v0.0.4`
- 官方发布说明正文
