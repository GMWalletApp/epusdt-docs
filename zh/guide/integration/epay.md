# EPay 兼容接入（跳转式）

只有当你的上游系统明确依赖 EPay 风格跳转建单时，才建议使用这条流程。

## 路由

```text
GET /payments/epay/v1/order/create-transaction/submit.php
POST /payments/epay/v1/order/create-transaction/submit.php
```

## 商户凭证要求

入站请求 **不是** 用旧的 `epay_pid` / `epay_key` env 配置来验证。

目前源代码的实际流程是：

1. 读取请求中的 `pid`
2. 在 `api_keys` 里找到对应且已启用的数据记录
3. 使用该笔数据的 `secret_key` 验证 `sign`
4. 视需要再检查 IP 白名单

## 主要入站字段

必填：

- `pid`
- `money`
- `out_trade_no`
- `notify_url`
- `sign`

常见可选字段：

- `return_url`
- `name`
- `type`
- `token`
- `network`
- `currency`
- `sign_type`

`type` 现在支持两种形式：

- `alipay`：兼容值；实际 token/network 会依序从请求中的 `token` + `network`、后台 EPay 默认值解析。
- `token.network` 选择器，例如 `usdt.tron`：只有当该 token/network 组合目前可用时才接受。有效选择器会覆盖 `token`、`network`、`epay.default_token` 和 `epay.default_network`。

其他非空 `type` 会被视为参数错误。通过校验的 `type` 会保存到订单，后续 EPay 同步返回和异步回调会沿用。

## EPay 默认值来源

验签成功后，目前源代码会使用后台设置补出共用订单字段：

- `epay.default_token`
- `epay.default_currency`
- `epay.default_network`

EPay submit.php 的解析优先级是：

1. 有效的 `type=token.network` 选择器
2. 请求中显式传入的 `token` / `network`
3. 后台 `epay.default_token` / `epay.default_network`
4. 如果 token 和 network 最终仍同时为空，建立状态 `4` 的占位订单，由收银台引导用户选择

法币币种独立解析：请求 `currency` → `epay.default_currency` → `cny`。

## 成功后行为

建立订单成功后，浏览器会被跳转到：

```text
/pay/checkout-counter/{trade_id}
```

在目前源代码中，这条路径现在作为托管收银台 SPA 的跳转入口；收银台页面数据则由：

```text
/pay/checkout-counter-resp/{trade_id}
```

提供。


## 直接指定链和币种

上游「New API」或自订支付方式列表可以把不同链 / 币种拆成独立支付选项，并把 `type` 设为有效的 `token.network` 选择器。例如 `usdt.tron` 会直接建立 TRON USDT 订单；如果 Binance/BSC 的 USDT 已启用，`usdt.binance` 会直接建立对应订单。

示例支付方式配置：

```json
[
  { "color": "rgba(var(--semi-blue-5), 1)", "name": "GM Pay", "type": "custom1" },
  { "color": "rgba(var(--semi-blue-5), 1)", "name": "GM Pay usdt.binance", "type": "usdt.binance" },
  { "color": "rgba(var(--semi-blue-5), 1)", "name": "GM Pay usdt.tron", "type": "usdt.tron" }
]
```

`custom1` 只是上游的通用支付选项名称，不是 Epusdt 的链上选择器。不要把 `custom1` 原样提交到 EPay submit.php；通用入口应改为不传 `type`、传 `type=alipay`，或走普通 GMPay 占位订单流程。

## 回调验证

当订单 `payment_type = Epay` 时，worker 后续会以 EPay 风格 query 参数回调你的 `notify_url`，并且使用**同一商户的 `secret_key`** 来计算签名。

回调中的 `type` 会沿用订单保存的请求类型，也就是 `alipay` 或已接受的 `usdt.tron` 这类选择器；如果建单时没有传 `type`，出站回调会为兼容性回退到 `alipay`。

不要再用旧文件里独立的 `epay_key` 去验这类回调。
