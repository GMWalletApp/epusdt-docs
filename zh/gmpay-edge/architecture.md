# 架构

GMPay Edge 可作为单个 Worker 或单个 Bun/Nitro 容器执行。两种运行环境承载相同的产品入口与共享订单 / 支付核心，差异仅在基础设施适配器。

## 产品入口

- 商户客户端调用 GMPay 或 EPay 兼容边界。
- 付款人使用托管收银台。
- 运营者使用 `/admin`。
- Telegram 用户通过已配置的 Bot 交互。

## 运行环境服务

| 能力 | Cloudflare Workers | Bun/Nitro Docker |
| --- | --- | --- |
| 数据库 | D1 | `GMPAY_DATA_DIR` 中的 SQLite |
| 快取 | KV | 本地运行时快取 |
| 私有物件 | R2 | 持久化本地物件储存 |
| 背景任务 | Cloudflare Queues | 本地可靠伫列 |
| 排程 | Cron Triggers | Bun 排程器 |

Bun 数据目录也包含上传文件与可靠队列状态，必须挂载持久化数据卷并纳入备份。

## Cloudflare bindings

| Binding | Cloudflare 产品 | 用途 |
| --- | --- | --- |
| `DB` | D1 | 权威的应用、支付、授权与投递数据 |
| `CACHE` | KV | 短期已校验快取与辅助遥测数据 |
| `FILES` | R2 | 私有付款复核凭证与产生的汇出文件 |
| `PAYMENT_QUEUE` | Queues | 异步支付扫描 |
| `WEBHOOK_QUEUE` | Queues | 异步商户 Webhook 投递 |

## 背景任务

各运行环境对应的可靠伫列与排程器会将支付扫描和 Webhook 重试移出同步请求，也负责支付过期处理、清理、连接健康检查与汇率同步。

两种运行环境的 Webhook 投递都使用可靠 outbox，保留重试历史、人工重试与审计记录。

## 数据与安全模型

- 选定运行环境后，以 D1 或 SQLite 作为权威数据库。
- 快取与私有物件储存使用对应运行环境的适配器。
- 支付适配器保持只读。
- 管理后台使用 Better Auth、TOTP 与动态多角色 RBAC。

## 协议边界

GMPay 使用 **HMAC-SHA256** 签名。EPay 兼容边界仍保留旧版 **MD5** 规则。出站回调会保留订单来源协议的签名格式。
