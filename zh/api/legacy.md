# 接口迁移说明

目前源代码 **已不再注册** 旧路由 `POST /api/v1/order/create-transaction`。

同时也 **没有注册** 旧版兼容路由 `POST /payments/epusdt/v1/order/create-transaction`。

## 旧接入请改用以下任一现行路由

| 使用场景 | 当前可用路由 |
| --- | --- |
| 原生 JSON API（推荐） | `POST /payments/gmpay/v1/order/create-transaction` |
| 跳转式 / EPay 风格流程 | `GET / POST /payments/epay/v1/order/create-transaction/submit.php` |

## 迁移时请注意

1. **所有入站订单都必须带 `pid` 来识别商户。**
2. **验签使用对应 `api_keys` 数据记录的 `secret_key`**，而不是旧文件里的单一路由密钥。
3. **可用链与代币由后台数据决定**，请用 `/payments/gmpay/v1/config`，并从 `data.supported_assets` 取得实际可用组合。
4. **EPay 默认值** 目前来自后台设置 `epay.default_token` / `epay.default_currency` / `epay.default_network`，不是旧的 `epay_pid` / `epay_key` 类 env 配置。
