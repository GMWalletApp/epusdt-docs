# 介面遷移說明

本文件說明 Epusdt 的路由變更及相關配置項。

## 路由變更

舊路由 `/api/v1/order/create-transaction` 已**移除**，請使用新路由：

| 接入方式 | 新路由 |
|----------|--------|
| GMPay（推薦） | `POST /payments/gmpay/v1/order/create-transaction` |
| Epusdt（舊版相容） | `POST /payments/epusdt/v1/order/create-transaction` |
| EPay 相容 | `GET/POST /payments/epay/v1/order/create-transaction/submit.php` |

> ⚠️ 舊路由 `/api/v1/order/create-transaction` 在當前版本中**已不存在**，請立即更新接入地址。

## 獨角數卡使用者

**只需修改一個地方**：在獨角數卡後臺支付外掛配置中，將 API 地址改為：

```
https://your-domain.com/payments/epusdt/v1/order/create-transaction
```

---

## 配置項說明

### `api_rate_url` — 匯率介面 URL

```bash
api_rate_url=https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/
```

系統請求 `{api_rate_url}/{currency}.json`，返回格式示例：

```json
{
  "cny": {
    "usdt": 0.1389,
    "trx": 0.0123
  }
}
```

支援自建匯率 API，按上述格式返回即可。

---

### `tron_grid_api_key` — TRON Grid API Key

```bash
tron_grid_api_key=your-api-key-here
```

在 [https://www.trongrid.io/](https://www.trongrid.io/) 註冊獲取，可提高請求限額和穩定性。

---

## 配置參考

```bash
order_expiration_time=15
order_notice_max_retry=0
api_rate_url=https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/
tron_grid_api_key=your-api-key-here
```
