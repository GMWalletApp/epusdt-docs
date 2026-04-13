# Payment API

This page covers the current payment integration flow: creating transactions, redirecting users, handling callbacks, and checking order status.

## Create Transaction

Create a new payment order. Epusdt locks a wallet address and amount for the order window.

**Live endpoint:**

```
POST /payments/epusdt/v1/order/create-transaction
```

**Also available:**

```
POST /payments/gmpay/v1/order/create-transaction
```

::: tip
`/payments/...` is the current live API prefix. `/api/v1/order/create-transaction` is a legacy path from older docs, not a registered route in current source.
:::

### Request Parameters

Request method/content-type for create-order:

- `POST`
- `application/json`

::: info
Signature verification runs on the **raw incoming JSON body before** the legacy `/payments/epusdt/v1/...` wrapper injects default values. That means requests omitting `currency`, `token`, and `network` on the Epusdt-compatible route are still valid as long as the signature matches the fields you actually sent.

After signature verification passes, the compatibility wrapper rewrites the request body and fills missing values with `cny`, `usdt`, and `tron` before the shared create-order handler validates it.
:::

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `order_id` | string | ✅ | Your unique order ID, max 32 chars |
| `amount` | float | ✅ | Fiat amount; must be greater than `0.01` |
| `notify_url` | string | ✅ | Callback URL; Epusdt POSTs here after payment success |
| `redirect_url` | string | ❌ | Customer redirect URL after payment |
| `currency` | string | ✅* | Fiat currency code |
| `token` | string | ✅* | Token symbol |
| `network` | string | ✅* | Blockchain network |
| `signature` | string | ✅ | MD5 signature |

`*` The shared request validator requires `currency`, `token`, and `network`. On the live `/payments/epusdt/v1/...` route, current source injects defaults when omitted:

- `currency = cny`
- `token = usdt`
- `network = tron`

The `/payments/gmpay/v1/...` route does **not** inject these defaults.

::: warning
For new integrations, send `currency`, `token`, and `network` explicitly even when calling `/payments/epusdt/v1/...`. The omission behavior exists for legacy compatibility, not as the preferred contract.
:::

### Signature Generation

Generate `signature` with these rules:

1. Collect all non-empty parameters except `signature`
2. Sort by key in ASCII ascending order
3. Join as `key=value&key=value`
4. Append `api_auth_token` directly to the end
5. Compute lowercase MD5

#### Example

Given:

```
order_id = "20220201030210321"
amount = 42
notify_url = "http://example.com/notify"
redirect_url = "http://example.com/redirect"
```

Token:

```
api_auth_token = "epusdt_password_xasddawqe"
```

Sorted string:

```
amount=42&notify_url=http://example.com/notify&order_id=20220201030210321&redirect_url=http://example.com/redirect
```

Append token:

```
amount=42&notify_url=http://example.com/notify&order_id=20220201030210321&redirect_url=http://example.com/redirectepusdt_password_xasddawqe
```

MD5:

```
1cd4b52df5587cfb1968b0c0c6e156cd
```

#### Code Examples

::: code-group

```php [PHP]
<?php
function epusdtSign(array $parameter, string $signKey): string {
    ksort($parameter);
    reset($parameter);
    $sign = '';
    foreach ($parameter as $key => $val) {
        if ($val === '' || $val === null) continue;
        if ($key === 'signature') continue;
        if ($sign !== '') $sign .= '&';
        $sign .= "$key=$val";
    }
    return md5($sign . $signKey);
}
```

```python [Python]
import hashlib

def epusdt_sign(params: dict, token: str) -> str:
    filtered = {k: v for k, v in params.items() if v != '' and v is not None and k != 'signature'}
    sorted_str = '&'.join(f"{k}={v}" for k, v in sorted(filtered.items()))
    return hashlib.md5((sorted_str + token).encode()).hexdigest()
```

```go [Go]
import (
    "crypto/md5"
    "fmt"
    "sort"
    "strings"
)

func EpusdtSign(params map[string]string, token string) string {
    keys := make([]string, 0)
    for k, v := range params {
        if v != "" && k != "signature" {
            keys = append(keys, k)
        }
    }
    sort.Strings(keys)
    parts := make([]string, 0, len(keys))
    for _, k := range keys {
        parts = append(parts, k+"="+params[k])
    }
    raw := strings.Join(parts, "&") + token
    return fmt.Sprintf("%x", md5.Sum([]byte(raw)))
}
```

:::

### Response

Current JSON API responses are wrapped in HTTP 200. Inspect top-level `status_code` for the business result.

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "trade_id": "EP20240101XXXXXXXX",
    "order_id": "ORDER_20240101_001",
    "amount": 100.0,
    "currency": "cny",
    "actual_amount": 14.28,
    "receive_address": "TXXXXXXXXXXXXXXXXXXxx",
    "token": "usdt",
    "expiration_time": 1712500000,
    "payment_url": "http://your-server:8000/pay/checkout-counter/EP20240101XXXXXXXX"
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `trade_id` | string | Epusdt internal trade ID |
| `order_id` | string | Your original order ID |
| `amount` | float | Original fiat amount |
| `currency` | string | Fiat currency code |
| `actual_amount` | float | Actual token amount the customer needs to pay |
| `receive_address` | string | Payment address |
| `token` | string | Token symbol, such as `usdt` |
| `expiration_time` | int | Expiration Unix timestamp in seconds |
| `payment_url` | string | Hosted checkout URL |

Current create-order response does **not** include `network`.

Request payload now also accepts these optional fields:

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Optional product name, mainly used by the EPay-compatible flow |
| `payment_type` | string | Optional payment source marker, such as `epay` |

## Payment Flow

```
1. Your server calls the create-transaction API
2. Epusdt returns `trade_id`, `receive_address`, and `payment_url`
3. Redirect the customer to `payment_url` or render the address / QR code yourself
4. Customer sends funds to `receive_address`
5. Epusdt detects payment on-chain
6. Epusdt POSTs a callback to `notify_url`
7. Your server verifies the signature and returns exact body `ok`
8. If `redirect_url` exists, the hosted checkout page redirects the user after success
9. Customers can now switch token/network on the checkout page, and Epusdt may create child orders for the selected route
```

## Checkout Page

Hosted checkout page:

```
GET /pay/checkout-counter/:trade_id
```

Example:

```
https://pay.example.com/pay/checkout-counter/EP20240101XXXXXXXX
```

This page route is separate from the API prefix. In source, `payment_url` is built as:

```text
{app_uri}/pay/checkout-counter/{trade_id}
```

So if `app_uri` is `https://pay.example.com`, the checkout URL becomes `https://pay.example.com/pay/checkout-counter/{trade_id}`.

If your public deployment includes an extra external prefix, for example `https://example.com/epusdt`, set `app_uri` to that public base and let your proxy rewrite requests to the app's root-mounted `/pay/...` routes.

## Check Order Status

Status polling endpoint:

```
GET /pay/check-status/:trade_id
```

Example:

```
GET https://pay.example.com/pay/check-status/EP20240101XXXXXXXX
```

This is a checkout polling endpoint under `/pay/...`, not a create-order API route.

Response:

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "trade_id": "EP20240101XXXXXXXX",
    "status": 2
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

### Order Status Values

| Status | Meaning |
|--------|---------|
| `1` | Waiting for payment |
| `2` | Payment success |
| `3` | Expired |

## Callback / Webhook

When payment is confirmed on-chain and the order status has already become `2` (paid), Epusdt POSTs to the `notify_url` from the create-order request.

The callback body is signed with the same MD5 algorithm and `api_auth_token` used for create-order requests, and source sends it as a JSON body.

### Callback Payload

```json
{
  "trade_id": "EP20240101XXXXXXXX",
  "order_id": "ORDER_20240101_001",
  "amount": 100.0,
  "actual_amount": 14.28,
  "receive_address": "TXXXXXXXXXXXXXXXXXXxx",
  "token": "usdt",
  "block_transaction_id": "4d7d...",
  "status": 2,
  "signature": "a1b2c3d4e5f6..."
}
```

### Callback Fields

| Field | Type | Description |
|-------|------|-------------|
| `trade_id` | string | Epusdt internal trade ID |
| `order_id` | string | Your original order ID |
| `amount` | float | Original fiat amount |
| `actual_amount` | float | Actual token amount received |
| `receive_address` | string | Payment address |
| `token` | string | Token symbol |
| `block_transaction_id` | string | On-chain transaction ID |
| `status` | int | Order status (`2` = paid) |
| `signature` | string | MD5 signature for verification |

Current callback payload does **not** include `network`.

For switched child orders, the child order itself does not send its own callback. Instead, source code marks the parent order as paid and emits the callback using the parent order context.

### Verifying the Callback Signature

Use the same signing rules as the create-order request:

1. Keep all non-empty fields except `signature`
2. Sort by key
3. Join as `key=value&key=value`
4. Append `api_auth_token`
5. Compute lowercase MD5 and compare

### Responding to the Callback

::: danger Important
Your server **must** return the exact plain-text body `ok` with **HTTP 200**.

Examples:

- `ok` ✅
- `OK`, `ok\n`, `{"message":"ok"}` ❌

Current retry behavior is configuration-driven, not a fixed hardcoded retry count:

- `order_notice_max_retry` — maximum retry count after the first attempt
- `callback_retry_base_seconds` — exponential backoff base delay

Default `.env.example` values are:

- `order_notice_max_retry=0`
- `callback_retry_base_seconds=5`

So with default settings, Epusdt performs the first callback attempt, but no extra retries after a failure.
:::

## Switch Payment Network

Hosted checkout now supports switching to another token/network combination.

Endpoint:

```text
POST /pay/switch-network
```

Request body:

```json
{
  "trade_id": "EP20240101XXXXXXXX",
  "token": "USDC",
  "network": "solana"
}
```

Behavior in current source:

- If the requested token/network equals the parent order, source just marks it selected and returns the existing checkout data.
- If an active child order for that token/network already exists, source reuses it.
- Otherwise source creates a new child order, reserves a wallet on that network, and returns the child order checkout payload.
- Current source allows at most `2` active child orders per parent order.
- When one route gets paid, sibling child orders are expired and their locks are released.

Response shape matches checkout data and now includes `is_selected` on the checkout payload.

## EPay Compatible Route

Current source also exposes an EPay-style entrypoint:

```text
GET /payments/epay/v1/order/create-transaction/submit.php
```

Accepted query parameters include:

- `money`
- `name`
- `notify_url`
- `out_trade_no`
- `return_url`
- `sign`

Current behavior from source:

- It internally converts the request into a normal order creation flow.
- It forces `token=usdt`, `currency=cny`, and `network=tron`.
- It redirects the browser to `/pay/checkout-counter/{trade_id}` after order creation.
- Signature verification currently uses the normal `api_auth_token` logic in router code.

## Full Integration Example

```python
import hashlib
import requests

API_BASE = "https://pay.example.com"
API_AUTH_TOKEN = "your_api_auth_token"

def epusdt_sign(params: dict, token: str) -> str:
    filtered = {k: v for k, v in params.items() if v != '' and v is not None and k != 'signature'}
    sorted_str = '&'.join(f"{k}={v}" for k, v in sorted(filtered.items()))
    return hashlib.md5((sorted_str + token).encode()).hexdigest()

def create_order(order_id: str, amount: float, notify_url: str):
    params = {
        "order_id": order_id,
        "amount": amount,
        "notify_url": notify_url,
        "currency": "cny",
        "token": "usdt",
        "network": "tron",
    }
    params["signature"] = epusdt_sign(params, API_AUTH_TOKEN)

    response = requests.post(
        f"{API_BASE}/payments/epusdt/v1/order/create-transaction",
        json=params,
    )
    result = response.json()

    if result["status_code"] == 200:
        data = result["data"]
        print(f"Trade ID:     {data['trade_id']}")
        print(f"USDT Amount:  {data['actual_amount']}")
        print(f"Address:      {data['receive_address']}")
        print(f"Payment URL:  {data['payment_url']}")
        return data
    else:
        print(f"Error: {result['message']}")
        return None

create_order("ORDER_001", 100.00, "https://example.com/callback")
```

This explicit example works on both live create-order routes and is the recommended integration style. If you call `/payments/epusdt/v1/...`, current source also accepts requests that omit `currency`, `token`, and `network` because that compatibility route injects defaults after signature verification, but relying on that legacy behavior is not recommended for new clients.

If you expose the service behind a proxy subpath, keep the request URL and `API_BASE` aligned with the public base URL you configured in `app_uri`.

## Error Handling

| Status Code | Message | How to Fix |
|-------------|---------|------------|
| `400` | system / validation error | Check request body and required fields |
| `401` | `signature verification failed` | Verify your signature logic and `api_auth_token` |
| `10002` | `order already exists` | Use a unique `order_id` |
| `10003` | `no available wallet address` | Add more wallet addresses |
| `10004` | `invalid payment amount` | Check amount limits and minimum value |
| `10005` | `no available amount channel` | Retry with another amount or review channel allocation |
| `10008` | `order does not exist` | Verify the queried `trade_id` |
