# 旧版迁移说明

目前源代码已不再提供旧版 Epusdt 下单路由。

## 已移除路由

- `POST /api/v1/order/create-transaction`
- `POST /payments/epusdt/v1/order/create-transaction`

## 现在应该改用什么

### 如果你能控制客户端程序码

直接改用 **GMPay**：

```text
POST /payments/gmpay/v1/order/create-transaction
```

### 如果上游系统只支持跳转式 EPay 流程

改用 **EPay 兼容**：

```text
GET /payments/epay/v1/order/create-transaction/submit.php
POST /payments/epay/v1/order/create-transaction/submit.php
```

## 迁移清单

- 替换旧下单 URL
- 所有入站请求补上 `pid`
- 改用商户 API key 的 `secret_key` 重算签名
- 不要再依赖旧文件里的 `/payments/epusdt/v1/...`
- 如果前端需要动态显示链 / 代币，请改查 `/payments/gmpay/v1/config`，并从 `data.supported_assets` 读取
