# API 概览

参阅[商户 API](/zh/api/payment)，了解签名示例、订单状态和回调验签。

## 当前对外可用路由

| 场景 | 方法 | 路径 | 是否需要签名 |
| --- | --- | --- | --- |
| 创建 GMPay 交易 | POST | `/payments/gmpay/v1/order/create-transaction` | 是 |
| 获取公开支付配置 | GET | `/payments/gmpay/v1/config` | 否 |
| 收银台页面 | GET | `/pay/checkout-counter/{trade_id}` | 否 |
| 收银台初始化数据 | GET | `/pay/checkout-counter-resp/{trade_id}` | 否 |
| 查询支付状态 | GET | `/pay/check-status/{trade_id}` | 否 |
| 切换支付网络/通道 | POST | `/pay/switch-network` | 否 |
| EPay 兼容创建交易 | GET/POST | `/payments/epay/v1/order/create-transaction/submit.php` | 是 |
| 提交交易哈希核验 | POST | `/pay/submit-tx-hash/{trade_id}` | 否，提交 `block_transaction_id` |
| 收银台返回商户 | GET | `/pay/return/{trade_id}` | 否，返回 HTTP 302 |
| OkPay 平台回调 | POST | `/payments/okpay/v1/notify` | OkPay 签名 |

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
