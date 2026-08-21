# API 概览

## 当前对外可用路由

| 方法 | 路由 | 说明 |
| --- | --- | --- |
| `POST` | `/payments/gmpay/v1/order/create-transaction` | 推荐的建立订单 API |
| `GET` | `/payments/gmpay/v1/config` | 返回公开支付配置，包含 `supported_assets`、站点品牌信息、EPay 默认值、OkPay 前端配置及服务器 `version` |
| `GET` / `POST` | `/payments/epay/v1/order/create-transaction/submit.php` | EPay 兼容跳转式建立订单入口 |
| `POST` | `/payments/okpay/v1/notify` | OkPay 服务器端回调入口 |
| `POST` | `/pay/switch-network` | 在托管收银台切换支付网络；可接受链上网络值与 `okpay` |
| `GET` | `/pay/checkout-counter/:trade_id` | 跳转入口，会把浏览器导向托管收银台 SPA |
| `GET` | `/pay/checkout-counter-resp/:trade_id` | 托管收银台 SPA 使用的 JSON 数据接口 |
| `GET` | `/pay/check-status/:trade_id` | 查询收银台订单状态 |

## 管理 API

管理 API 位于 `/admin/api/v1/*`，除登录与初始化密码相关接口外，其余都需要 JWT。

目前源代码可见的主要群组：

- `/auth/*`
- `/api-keys/*`
- `/notification-channels/*`
- `/config`
- 链 / 代币管理
- 钱包地址管理
- 设置管理

## 商户凭证规则

### GMPay

- 商户识别字段：`pid`
- 签名字段：`signature`
- 自 `v2.0.0` 起的签名演算法：对规范化后的非空引数字串做 HMAC-SHA256，HMAC key 为对应 `pid` 的已启用 `api_keys.secret_key`
- v2 之前的 GMPay MD5 客户端必须先升级后才能部署 `v2.0.0` 或更新版本

### EPay 兼容流程

- 商户识别字段：`pid`
- 签名字段：`sign`
- 签名密钥：对应 `pid` 的已启用 `api_keys.secret_key`
- `sign_type` 一般传 `MD5`
- EPay 的 `type` 接受 `alipay` 或有效的 `token.network` 选择器（如 `usdt.tron`）；已接受的选择器会沿用到 EPay 同步返回与异步回调。

## 建议接入顺序

1. 先在管理后台建立或查看商户凭证（`pid` + `secret_key`）
2. 若前端需要动态展示可用链 / 代币，先调用 `/payments/gmpay/v1/config`，并从 `data.supported_assets` 读取
3. 新接入优先使用 GMPay
4. 只有在上游系统依赖跳转式 EPay 流程时才使用 EPay 兼容入口
5. 接收回调时同样使用该商户的 `secret_key` 验签
