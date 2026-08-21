# 架构

GMShop Edge 以单个 Cloudflare Worker 承载公开商城、客户中心、结账、交付与管理后台。

## Cloudflare bindings

仓库在 `wrangler.jsonc` 与 `package.json` metadata 中宣告这些生产 bindings：

- `DB`：D1 数据库，保存认证、RBAC、商品、金额、订单、库存、权益、供应商、任务、重放保护、限流、outbox、审计与系统数据。
- `FILES`：私有 R2 bucket，保存商品媒体、下载文件、自动化制品与汇出。
- `CACHE`：KV namespace，保存短生命周期 RBAC 与公开配置快取；安全关键限流仍以 D1 为权威来源。
- `COMMERCE_QUEUE`：Cloudflare Queue，用于可靠交付、自动化、通知与退款工作。
- `EMAIL`：可选 Cloudflare Send Email binding，用于免凭证邮件 Provider。

Worker 也启用 Cron Triggers；目前仓库宣告 `* * * * *` 周期性执行交易工作。

## 数据权威来源

D1 是核心交易状态的权威数据源。KV 仅保存经校验、带版本且有界的上游目录快照与读取快取。R2 保存私有物件，但物件访问必须通过 D1 授权记录解析；客户端不能自行选择 object key。

## 模组边界

路由保持薄层。功能页面、schema、Server Function 与领域行为位于 `src/features`；跨领域运行时编排位于 `src/server`；全新安装的 Drizzle 基线是 `drizzle/0000_gmshop.sql`。

## 运维模型

Queue 与 Cron 将目录同步、供应商采购与核验、交付、重试、保留清理与密钥轮换移出同步请求，让商城结账保持响应，同时保留背景工作的重试与审计历史。
