---
description: "对接 EPUSDT 的 GMPay 下单接口，为商户请求签名，再把买家跳转到网关返回的收银台地址。"
---

# GMPay 接入（推荐）

所有新接入都建议直接使用 GMPay。

## 路由

```text
POST /payments/gmpay/v1/order/create-transaction
```

## 商户凭证要求

调用前请先在管理后台建立或查看 API key。

你需要：

- `pid`
- `secret_key`

其中 `pid` 必须出现在请求里，`secret_key` 用来计算签名。

## 最小请求体

```json
{
  "pid": "1000",
  "order_id": "ORD20260424001",
  "currency": "cny",
  "token": "usdt",
  "network": "tron",
  "amount": 100,
  "notify_url": "https://merchant.example.com/notify",
  "signature": "hmac-sha256-hex(...)"
}
```

## 签名规则

> 自 `v2.0.0` 起，GMPay 使用 HMAC-SHA256，不再使用 MD5。部署 v2 前请先升级客户端，否则会收到 `401 Unauthorized`；EPay 兼容请求不受影响。

1. 保留所有非空字段，排除 `signature`
2. 依 ASCII 键名排序
3. 拼成 `key=value&...`
4. 使用商户 `secret_key` 作为 HMAC key 计算 HMAC-SHA256
5. 将 64 位小写十六进位摘要作为 `signature`

## 常用配套接口

- `GET /payments/gmpay/v1/config`
- `POST /pay/switch-network`

如果前端需要动态取得可用链 / 代币，请从 `/payments/gmpay/v1/config` 响应中的 `data.supported_assets` 读取。

站点品牌信息见 `data.site`，支付设置见 `data.epay`、`data.okpay` 和 `data.xlayer`。

## 回调验证

GMPay 成功回调会以 JSON `POST` 发送到 `notify_url`。

使用商户密钥验证 HMAC-SHA256 签名，核对订单并防止重复发货。处理完成后返回 HTTP 200 和纯文本 `ok` 或 `success`（不区分大小写）。

## 成功响应补充

目前源代码在建单成功响应中也会返回 `payment_url`，因此调用端可以直接取得托管收银台跳转地址，不必自行拼接。
