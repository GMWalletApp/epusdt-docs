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

同一个 config 响应也会带出公开收银台品牌信息（`data.site`）以及 EPay / OkPay 前端默认值（`data.epay`、`data.okpay`）。

## 回调验证

GMPay 成功回调会以 JSON `POST` 发送到 `notify_url`。

使用同一商户的 `secret_key` 依相同 HMAC-SHA256 规则验证回传 `signature`，然后返回纯文字 `ok`。

## 成功响应补充

目前源代码在建单成功响应中也会返回 `payment_url`，因此调用端可以直接取得托管收银台跳转地址，不必自行拼接。
