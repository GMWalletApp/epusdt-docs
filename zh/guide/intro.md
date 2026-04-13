# 项目简介

## Epusdt（Easy Payment Usdt）

`Epusdt` 是一个由 **Go 语言**编写的私有化 **加密支付中间件**，当前源码支持 `tron`、`solana`、`ethereum` 三种网络。

站长或开发者可通过 `Epusdt` 提供的 HTTP API 将代币收款集成至任何系统，无需复杂配置。当前源码可使用 **MySQL / SQLite / PostgreSQL** 保存订单数据，并使用运行时 SQLite 维护锁单状态。私有化部署无需额外手续费，代币直接进入您的钱包 💰

## 项目特点

- ✅ **私有化部署**，无需担心钱包被篡改和吞单
- ✅ **Go 跨平台**，支持 x86 / ARM 的 Windows / Linux
- ✅ **多网络钱包监听**，提高订单并发率
- ✅ **异步队列响应**，优雅且高性能
- ✅ **单一二进制**，无需额外运行时环境
- ✅ **HTTP API**，任何系统均可接入
- ✅ **Telegram 机器人**，支付消息快速通知

## 项目结构

```
Epusdt
├── plugins   # 已集成插件（如独角数卡）
├── src       # 核心源码
├── sdk       # 接入 SDK
├── sql       # 数据库 SQL 文件
└── wiki      # 知识库/文档
```

## 实现原理

Epusdt 通过监听多网络钱包入账事件，结合**金额差异**、**网络维度**和**时效性**判定交易归属。

```
简单流程：
1. 客户选择币种与网络后创建订单
2. 系统按 `network + token + wallet + amount` 维度锁定可用支付通道
3. 若当前金额通道已被占用，则按规则寻找新的可用金额
4. 后台持续监听多网络入账事件，匹配成功后更新父订单状态并触发回调
```

## 社区

- Telegram 频道：[https://t.me/epusdt](https://t.me/epusdt)
- Telegram 交流群：[https://t.me/epusdt_group](https://t.me/epusdt_group)
- GitHub：[https://github.com/GMwalletApp/epusdt](https://github.com/GMwalletApp/epusdt)
- GitHub Star：[![GitHub Stars](https://img.shields.io/github/stars/GMwalletApp/epusdt?style=flat&logo=github)](https://github.com/GMwalletApp/epusdt/stargazers)

## 开源协议

[GPLv3](https://www.gnu.org/licenses/gpl-3.0.html)

> ⚠️ 本项目仅供学习与技术交流，用户需自行遵守所在地法律法规。加密资产属高风险资产，GMwallet 不对任何资产损失或使用结果作出保证。
