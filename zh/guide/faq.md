---
description: "解答 EPUSDT 接入常见问题，包括如何选择 GMPay 或易支付、获取商户密钥、查询可用币种和验证回调。"
title: "商户接入常见问题"
---

# 常见问题

## 三种路由该怎么选？

- **新接入一律优先 GMPay**。
- **只有当上游系统要求 EPay 风格跳转收银台时** 才使用 EPay 兼容入口。
- **不要** 再以 `/payments/epusdt/v1/order/create-transaction` 为新接入基础，因为当前源代码已不再注册它。

## `pid` 和签名密钥从哪里来？

来自管理后台建立的 API key。每个商户都有自己的 `pid` 与对应 `secret_key`。

## 为什么不同环境看到的 GMPay config 不一样？

因为 `GET /payments/gmpay/v1/config` 是根据你自己后台数据实时计算的。

其中 `data.supported_assets` 会受到已启用的 chains、chain_tokens 与可用 wallet_address 影响。

## 需要配置哪些节点？

内置 ChainScanner 自带公共节点。TRON 可使用受支持的公共节点，TronGrid 密钥按所选服务商的要求配置。添加节点时，请选择对应的链以及服务商实际提供的协议。WebSocket 可用于监听新区块，再由 HTTP 节点读取区块内容。

后台显示各链的扫描进度，观测到的追块延迟超过五分钟时会提示。Solana、TON 或 Plasma 查询频繁时，建议配置来自两家独立服务商的兜底节点，并核对服务商配额。

## 如何设置汇率？

选择 `fixed` 使用 `rate.forced_rate_list`，或选择 `auto` 从 `rate.api_url` 获取汇率。自动刷新失败时沿用已缓存的汇率。清空固定汇率配置会恢复内置的 CNY 对 USDT、USDC 汇率。
