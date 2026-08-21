# 架构

GMShop Edge 在 Cloudflare Workers 与 Node/Nitro 上运行同一套 React/TanStack 全栈应用。一个部署同时负责公开商城、用户账户、结账、交付、供应商集成、Telegram 集成和管理后台。

## 共享应用边界

路由保持轻量；功能页面、Schema、服务端函数和领域行为位于 `src/features`，跨领域运行时实现位于 `src/server`，Drizzle Schema 位于 `src/db/schema`。

身份、RBAC、商品、订单、库存、权益、供应商状态、余额账本、通知、重放保护、限流、Outbox 和审计数据均保存在权威数据库中。金额使用最小货币单位的十进制整数字符串存储，不使用浮点数计算。

## Cloudflare Workers 适配器

Workers 部署使用：

- `DB`：D1，保存权威应用与商业数据。
- `FILES`：私有 R2，保存商品媒体、下载文件、自动化产物和导出文件。
- `CACHE`：KV，仅保存经过验证、带版本且有容量限制的读取缓存；安全限流仍以数据库为准。
- `COMMERCE_QUEUE`：处理交付、自动化、通知、供应商和退款任务，并配置死信队列。
- `EMAIL`：可选的 Cloudflare Send Email 绑定。
- 每分钟 Cron Trigger：执行定时处理和维护。

## Node/Nitro 适配器

Node 运行时在一个数据目录内提供等价适配器：

- SQLite 权威数据库。
- 进程内有界缓存。
- 私有本地对象存储。
- 基于 SQLite 的持久队列。
- 每分钟执行的进程内调度器。

`GMSHOP_DATA_DIR` 包含数据库、对象、队列状态和全部运行时数据。Node 明确仅支持**单实例**，不支持多副本部署或共享网络存储。

## 数据与后台任务

私有对象必须通过已授权的数据库记录解析，客户端不能选择对象键。队列和定时任务在同步商城请求之外处理供应商同步与采购、交付、通知、退款、重试、保留策略、Telegram 维护和密钥轮换。

全新安装的迁移基线是 `drizzle/0000_gmshop.sql`；后续迁移按顺序应用，Node 数据操作会验证其校验和。
