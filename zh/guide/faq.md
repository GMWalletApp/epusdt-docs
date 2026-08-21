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

## 链设置

### Tron 是否需要额外的 API Key？

是的。必须在后台配置 [TronGrid API Key](https://www.trongrid.io/)，否则节点请求将受到速率限制或被拒绝。

### 各链的 RPC 地址应使用哪种协定？

- **Tron** 和 **Solana（SOL）**：使用 **HTTP/HTTPS** 端点。
- **其他所有链**（如 ETH、BSC、Polygon 等）：使用 **WSS**（WebSocket）端点。

协定填错将导致交易监听静默失效。
