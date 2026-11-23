---
description: "GMPay 주문을 생성하고, 결제 상태를 확인하며, EPUSDT 반환을 검증합니다. 상점 요청 매개변수, 서명 규칙 및 예시를 포함합니다."
title: "상업 결제 API, 서명 및 콜백"
---

# 가맹점 API {#merchant-api}

공용 설정 엔드포인트에서 결제 옵션을 확인하고, 서버에서 주문을 생성하여 구매자에게 반환된 결제 URL로 이동합니다. 주문을 처리하기 전에 서명된 알림을 확인하세요. [Python 주문 예시](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/sdk/python/gmpay_create_order.py) · [OpenAPI 사양](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/src/docs/swagger.json)

[요청 서명](#signing) · [GMPay 주문 생성](#create) · [상태 조회](#status) · [가맹점 콜백](#callbacks)

## 엔드포인트 {#endpoints}

| 용도 | 메서드 | 경로 | 인증 |
| --- | --- | --- | --- |
| [GMPay 주문 생성](/ko/api/endpoints/create-order) | POST | `/payments/gmpay/v1/order/create-transaction` | 가맹점 HMAC-SHA256 서명 |
| [결제 설정 조회](/ko/api/endpoints/config) | GET | `/payments/gmpay/v1/config` | 공개 |
| [호스팅 결제 페이지 열기](/ko/api/endpoints/open-checkout) | GET | `/pay/checkout-counter/{trade_id}` | 공개 |
| [결제 상세 정보 조회](/ko/api/endpoints/checkout-details) | GET | `/pay/checkout-counter-resp/{trade_id}` | 공개 |
| [주문 상태 조회](/ko/api/endpoints/order-status) | GET | `/pay/check-status/{trade_id}` | 공개 |
| [네트워크 또는 결제 서비스 선택](/ko/api/endpoints/switch-network) | POST | `/pay/switch-network` | 공개 |
| [트랜잭션 해시 제출](/ko/api/endpoints/submit-hash) | POST | `/pay/submit-tx-hash/{trade_id}` | 공개 |
| [가맹점 사이트로 돌아가기](/ko/api/endpoints/checkout-return) | GET | `/pay/return/{trade_id}` | 브라우저 리디렉션 |
| [EPay 주문 생성](/ko/api/endpoints/epay-order) | GET 또는 POST | `/payments/epay/v1/order/create-transaction/submit.php` | 가맹점 MD5 서명 |
| [OKPay 알림 수신](/ko/api/endpoints/okpay-notify) | POST | `/payments/okpay/v1/notify` | OKPay 서명 |

## 응답 형식 {#response-format}

JSON 엔드포인트는 `status_code`(성공 시 200), `message`, `data`(객체 또는 null), 그리고 서버에서 생성한 `request_id`를 반환합니다. 유효하지 않은 서명은 HTTP 401 오류를 반환합니다. 비즈니스 오류는 일반적으로 HTTP 400 오류와 함께 애플리케이션 오류 코드를 반환합니다.

```json
{
  "status_code": 200,
  "message": "success",
  "data": {},
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

<a id="signing"></a>

## 요청 서명 {#sign-a-request}

요청의 `pid`와 연결된 상점 키를 사용합니다. 새로운 설치는 기본 상점(PID `1000`)을 생성합니다. 상점 서버에 비밀 정보를 보관하십시오.

**GMPay**는 HMAC-SHA256을 사용합니다. `signature`, 빈 문자열, null 값을 제외하세요. 나머지 필드명을 대소문자를 구분해 ASCII 오름차순으로 정렬하고, 이스케이프하지 않은 `key=value` 쌍을 `&`로 연결하세요. `secret_key`를 HMAC 키로 사용하고 결과를 64자리 소문자 16진수로 인코딩하세요. `pid`와 값이 비어 있지 않은 `payment_type`을 포함해야 합니다. JSON으로 보내면 서버는 `100.00` 같은 숫자를 `100`으로 읽습니다. 원래 문자열 표현을 유지하려면 폼 인코딩을 사용하세요.

예시 데이터, 표준 문자열 및 서명에 데모 키 `epusdt_secret_key`를 사용합니다.

```text
pid=1000
order_id=ORD202605230001
currency=cny
token=usdt
network=tron
amount=100
notify_url=https://merchant.example/notify
redirect_url=https://merchant.example/return
name=VIP
```

```text
amount=100&currency=cny&name=VIP&network=tron&notify_url=https://merchant.example/notify&order_id=ORD202605230001&pid=1000&redirect_url=https://merchant.example/return&token=usdt
```

```text
signature=6f874b1919d95081835e2809b620e354a5866f5a6dbb2e432d1627f1eb10059d
```

### PHP 예시 {#php-examples}

GMPay:

```php
function gmpaySign(array $params, string $secretKey): string
{
    unset($params['signature']);
    ksort($params, SORT_STRING);

    $pairs = [];
    foreach ($params as $key => $value) {
        if ($value === '' || $value === null) {
            continue;
        }
        $pairs[] = $key . '=' . $value;
    }

    return hash_hmac('sha256', implode('&', $pairs), $secretKey);
}
```

EPay는 `sign`과 `sign_type`을 제외합니다. 정규화한 문자열 끝에 가맹점 비밀 키를 붙이고 MD5 해시를 계산하세요.

```php
function epaySign(array $params, string $secretKey): string
{
    unset($params['sign'], $params['sign_type']);
    ksort($params, SORT_STRING);

    $pairs = [];
    foreach ($params as $key => $value) {
        if ($value === '' || $value === null) {
            continue;
        }
        $pairs[] = $key . '=' . $value;
    }

    return strtolower(md5(implode('&', $pairs) . $secretKey));
}
```

<a id="create"></a>

## GMPay 주문 생성 {#create-a-gmpay-order}

`POST /payments/gmpay/v1/order/create-transaction`은 JSON 및 `application/x-www-form-urlencoded` 형식으로 데이터를 받습니다.

```json
{
  "pid": "1000",
  "order_id": "ORD202605230001",
  "currency": "cny",
  "token": "usdt",
  "network": "tron",
  "amount": 100,
  "notify_url": "https://merchant.example/notify",
  "redirect_url": "https://merchant.example/return",
  "name": "VIP",
  "signature": "6f874b1919d95081835e2809b620e354a5866f5a6dbb2e432d1627f1eb10059d"
}
```

<!-- #region create-fields -->

| 필드 | 유형 | 필수 | 설명 |
| --- | --- | --- | --- |
| `pid` | string | 예 | 상업용 PID는 이전에는 서명 키를 찾는데 사용되었습니다. |
| `order_id` | string | 예 | 독특한 상점 주문 ID (최대 32자). |
| `currency` | string | 예 | 환율, 예를 들어 `usd` 또는 `cny`. |
| `token` | string | 조건부 | 수령 자산. 네트워크와 연결하거나, 둘 다 제외합니다. |
| `network` | string | 조건부 | 공개 설정에서 네트워크 ID, 예를 들어 `binance` |
| `amount` | number | 예 | 0.01 초의 Fiat 금액 |
| `notify_url` | string | 예 | 비동기 성공 콜백 URL |
| `redirect_url` | string | 아니요 | 브라우저에서 돌아갈 URL입니다. |
| `name` | string | 아니요 | 상품명 또는 주문명입니다. |
| `payment_type` | string | 아니요 | 기본값은 GMPay입니다. EPay(대소문자 구분 없음)를 선택하면 EPay 형식의 콜백을 사용하며 숫자형 PID가 필요합니다. 값이 비어 있지 않으면 서명에 포함하세요. |
| `signature` | string | 예 | 64자 소문자 HMAC-SHA256 서명 |

<!-- #endregion create-fields -->

`token`과 `network`을 모두 전달하여 즉시 주소를 할당합니다. 둘 다 전달하지 않으면, (상태 4)에 통화 금액과 통화를 포함하는 자리 표시를 생성합니다. 단 하나의 값만 전달하면 유효하지 않습니다. 파이어를 선택하기 전에 `data.supported_assets`를 공개 설정에서 확인하세요.

### 응답 {#response}

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "trade_id": "20260523171652123456001",
    "order_id": "ORD202605230001",
    "amount": 100,
    "currency": "CNY",
    "actual_amount": 14.29,
    "receive_address": "TTestTronAddress001",
    "token": "USDT",
    "status": 1,
    "expiration_time": 1779530812,
    "payment_url": "https://pay.example.com/pay/checkout-counter/20260523171652123456001"
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

| 필드 | 유형 | 의미 |
| --- | --- | --- |
| `trade_id` | string | EPUSDT 거래 ID입니다. |
| `order_id` | string | 가맹점 주문 ID입니다. |
| `amount` | number | 요청에 지정한 법정화폐 금액입니다. |
| `currency` | string | 법정화폐입니다. |
| `actual_amount` | number | 결제할 암호화폐 수량입니다. |
| `receive_address` | string | 수신 주소입니다. |
| `token` | string | 자산 심볼입니다. |
| `status` | integer | 주문 상태. 4은 “선택 대기 중”을 의미합니다. |
| `expiration_time` | integer | Unix 시간(초)으로 만료 날짜. |
| `payment_url` | string | 브라우저에서 열기. |

대체 항목은 주소나 토큰이 없으며, `actual_amount`는 0입니다. 만료 또는 수동 종료는 상태를 3으로 변경하지만, 결제 예약은 진행되지 않습니다. 체크아웃 선택은 주소 또는 호스팅 URL을 결정합니다.

## 공용 체크아웃 설정 {#public-checkout-configuration}

`GET /payments/gmpay/v1/config` 엔드포인트는 체크아웃 브랜딩, 온체인 자산, EPay 기본 설정, 그리고 공용 `okpay` 및 `xlayer` 제공자 설정을 반환합니다. `supported_assets` 내의 각 항목은 활성화된 체인, 사용 가능한 수취 주소, 그리고 결제에 구성된 토큰을 필요로 합니다. 호스팅된 방법들은 자체의 `enabled` 플래그와 `allow_tokens` 목록을 노출합니다.

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "supported_assets": [
      {
        "network": "tron",
        "display_name": "TRON",
        "tokens": ["TRX", "USDT"]
      },
      {
        "network": "solana",
        "display_name": "Solana",
        "tokens": ["SOL", "USDC", "USDT"]
      }
    ],
    "site": {
      "cashier_name": "Acme Cashier",
      "logo_url": "https://cdn.example.com/logo.png",
      "website_title": "Acme Payments",
      "support_link": "https://example.com/support",
      "background_color": "#0f172a",
      "background_image_url": "https://cdn.example.com/background.png",
      "withdrawal_reminder_enabled": true
    },
    "epay": {
      "default_token": "",
      "default_currency": "cny",
      "default_network": ""
    },
    "okpay": {
      "enabled": false,
      "allow_tokens": ["USDT", "TRX"]
    },
    "xlayer": {
      "enabled": false,
      "allow_tokens": ["USDC", "USDT0", "USDG"]
    },
    "version": "v2.1.0"
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

### 출금 알림 {#exchange-withdrawal-reminder}

설정 로드 후, `site.withdrawal_reminder_enabled`이 참일 때만 알림을 표시합니다. 체인상에서 주문이 지불 대기 중이고, 수취 주소가 존재하며, `actual_amount > 0`이 0보다 클 경우에만. 이전 버전에서 플래그가 없는 경우, 참으로 간주합니다. 거래 수수료 후 예상되는 **총 수취 금액**을 주문과 동일한 정밀도와 토큰을 사용하여 표시합니다. [밝은 미리보기](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/wiki/img/withdrawal-reminder-light.png) · [어두운 미리보기](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/wiki/img/withdrawal-reminder-dark.png)

관리자들은 `GET /admin/api/v1/settings?group=brand`을 읽습니다. `brand.withdrawal_reminder_enabled`의 저장된 값은 `"true"` 또는 `"false"` 문자열입니다. 이를 변경하려면 다음 인증된 `PUT /admin/api/v1/settings` 요청을 보내세요. 반환된 항목의 `ok` 플래그를 확인하고 체크아웃을 다시 시작하세요.

```json
{"items":[{"group":"brand","key":"brand.withdrawal_reminder_enabled","type":"bool","value":false}]}
```

## 장바구니를 열고 주문 확인하세요. {#open-checkout-and-read-the-order}

`payment_url`이 생성될 때 반환되는 URL은 `GET /pay/checkout-counter/{trade_id}`을 가리킵니다. 브라우저에서 열면 301 리디렉션으로 이동합니다:

```text
/cashier/{trade_id}
```

화면에 표시할 상세 정보는 `GET /pay/checkout-counter-resp/{trade_id}`로 조회하세요. 이 응답의 `created_at`과 `expiration_time`은 **밀리초** 단위입니다. 이후 변경 사항은 상태 엔드포인트에서 주기적으로 조회하세요.

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "trade_id": "20260523171652123456001",
    "amount": 100,
    "actual_amount": 14.29,
    "token": "USDT",
    "currency": "CNY",
    "receive_address": "TTestTronAddress001",
    "network": "tron",
    "status": 1,
    "payment_type": "gmpay",
    "expiration_time": 1779530812000,
    "redirect_url": "https://merchant.example/return",
    "payment_url": "",
    "created_at": 1779530212000,
    "is_selected": false
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

동일한 부모 ID는 빈 온체인 필드를 가진 대체 용도로 반환됩니다. GMPay 또는 EPay 모두 이 상태를 만들 수 있습니다.

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "trade_id": "20260523171652123456001",
    "amount": 100,
    "actual_amount": 0,
    "token": "",
    "currency": "CNY",
    "receive_address": "",
    "network": "",
    "status": 4,
    "payment_type": "gmpay",
    "expiration_time": 1779530812000,
    "redirect_url": "https://merchant.example/return",
    "payment_url": "",
    "created_at": 1779530212000,
    "is_selected": false
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

결제 화면은 가맹점 콜백 형식을 결정하는 `payment_type`을 소문자(`gmpay` 또는 `epay`)로 반환합니다. X Layer의 OKX OnchainOS에서는 서버가 반환한 호스팅 결제 URL을 여세요. EPUSDT는 결제 서비스에서 주문 정산을 확인한 뒤 입금 처리합니다.

<a id="status"></a>

## 상태 조회 {#poll-status}

`GET /pay/check-status/{trade_id}`

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "trade_id": "20260523171652123456001",
    "status": 1
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

<!-- #region order-states -->

| 상태 | 의미 |
| --- | --- |
| 1 | 결제 대기 중 |
| 2 | 결제 완료 |
| 3 | 만료됨 |
| 4 | 네트워크, 자산 또는 제공업체 선정 대기 중입니다. |
| 5 | 매칭 전송이 확인되었습니다. |
| 6 | 두 번의 엄격한 검증이 실패했습니다. 수동적인 검토가 필요합니다. |

<!-- #endregion order-states -->

상태 5에서는 계속 상태를 조회하고 ‘확인 중’을 표시해 송금이 감지되었음을 구매자에게 알리세요. 기본적으로 EPUSDT는 필요한 블록 확인 수를 기다리고 독립된 두 노드에서 거래를 검증한 뒤 입금 처리합니다. 확인 수를 기다리는 시간은 검증 시도에 포함되지 않습니다. 검증 시도 횟수와 최초 노드 ID 목록은 재시작 후에도 유지됩니다. 상태 6에서는 자동 검증과 성공 콜백을 일시 중지합니다. 관리자는 `review_transaction_hash`를 확인하고 조사한 뒤 거래를 다시 검증할 수 있습니다.

구매자가 제공한 해시의 경우, `block_transaction_id`를 `POST /pay/submit-tx-hash/{trade_id}`로 전송합니다. 서버는 전송을 확인합니다. 브라우저는 `GET /pay/return/{trade_id}`를 통해 HTTP 302 리디렉션을 반환합니다.

## 수취 담당자 거래 해시 {#submit-cashier-transaction-hash}

`POST /pay/submit-tx-hash/{trade_id}`

이 엔드포인트는 호스팅된 계산대(cashier)가 자체적으로 거래 해시를 제출하여 수동적으로 검증할 수 있도록 합니다. 이는 관리자 측에서 지불(admin mark-paid) 기능보다 훨씬 제한적입니다.

- 이 주문은 체인 상에서 실행되는 주문이어야 합니다.
- 주문은 여전히 `status=1` 상태로, 결제 대기 중입니다.
- 유효 기간이 지난 주문은 체인 검증 전에 거부됩니다.
- OkPay/제공업체 주문은 지원되지 않습니다.

### 트랜잭션 해시 요청 {#submit-transaction-hash-request}

```json
{
  "block_transaction_id": "0xabc123..."
}
```

### 트랜잭션 해시 성공 응답 {#submit-transaction-hash-success-response}

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "trade_id": "20260523171652123456001",
    "block_transaction_id": "0xabc123...",
    "status": 2
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

TON은 표준 형식인 `ton:<receive_raw>:<lt>:<hash>`, `lt:hash` 또는 해당 주문 수신 주소의 최근 거래를 고유하게 식별하는 해시를 허용합니다. Aptos에서는 트랜잭션 해시를 사용합니다.

## 결제 네트워크 또는 제공업체 변경 {#switch-payment-network-or-provider}

`POST /pay/switch-network`에는 상위 주문의 `trade_id`, 대상 `token` 및 `network`를 전달하세요. 호스팅 결제라면 `okpay` 또는 `xlayer`와 해당 서비스가 지원하는 토큰을 선택하세요.

```json
{
  "trade_id": "20260523171652123456001",
  "token": "USDT",
  "network": "solana"
}
```

```json
{
  "trade_id": "20260523171652123456001",
  "token": "USDT",
  "network": "okpay"
}
```

- 보류 중인 부모 주문(상태 1 또는 4)만이 전환될 수 있습니다. 자녀는 다시 전환할 수 없습니다.
- 임시 주문에서 처음 결제 수단을 선택하면 같은 상위 주문이 완성되고 상태 1로 변경됩니다. 온체인 결제는 수신 주소와 금액을 할당받습니다. 호스팅 결제에서는 결제 서비스의 URL을 반환하며, OKPay의 수신 주소 필드에는 `OKPAY`가 들어갑니다.
- 완성된 대체 항목은 처음에는 `is_selected=false` 상태를 유지합니다. 동일한 대상 항목을 다시 선택하면 기존 순서를 유지하고 선택 상태로 표시합니다. 다른 대상 항목으로 전환하면, 부모당 최대 한 개의 자식 항목만 생성됩니다.
- 이 응답은 체크아웃 상세 형식입니다. 체인 내 주문은 호스팅된 `payment_url`이 비어 있습니다.

## EPay 호환 결제 {#epay-compatible-checkout}

`/payments/epay/v1/order/create-transaction/submit.php`로 GET 요청 또는 POST 양식을 보내세요. 성공 시에는 HTTP 302 응답을 반환합니다.

```text
/pay/checkout-counter/{trade_id}
```

<!-- #region epay-fields -->

| 필드 | 위치 | 유형 | 필수 | 설명 |
| --- | --- | --- | --- | --- |
| `pid` | 쿼리 또는 폼 | string | 예 | 상점 PID. 콜백에 숫자 PID를 사용하세요. |
| `money` | 쿼리 또는 폼 | number | 예 | 법정화폐 금액입니다. |
| `out_trade_no` | 쿼리 또는 폼 | string | 예 | 가맹점 주문 ID입니다. |
| `notify_url` | 쿼리 또는 폼 | string | 예 | 가맹점 콜백 URL입니다. |
| `return_url` | 쿼리 또는 폼 | string | 아니요 | 브라우저에서 돌아갈 URL입니다. |
| `name` | 쿼리 또는 폼 | string | 아니요 | 상품명 또는 주문명입니다. |
| `type` | 쿼리 또는 폼 | string | 아니요 | 비어 있거나, `alipay`, 또는 활성화된 `token.network` 선택기. |
| `token` | 쿼리 또는 폼 | string | 아니요 | 선택자가 일치하지 않을 때 요청된 토큰. |
| `network` | 쿼리 또는 폼 | string | 아니요 | 선택자가 일치하지 않을 때 요청된 네트워크. |
| `currency` | 쿼리 또는 폼 | string | 아니요 | EPay 통화 기본 설정을 변경합니다. |
| `sign` | 쿼리 또는 폼 | string | 예 | EPay MD5 서명입니다. |
| `sign_type` | 쿼리 또는 폼 | string | 아니요 | 일반적으로 `MD5`. |

<!-- #endregion epay-fields -->

MD5 계산에는 `sign` 및 `sign_type`을 제외한 모든 비어 있지 않은 수신 매개변수를 포함하세요. 플러그인 필드(예: `sitename`)도 포함합니다. 다음은 데모 비밀 키를 포함한 정규화 입력과 서명 예시입니다.

```text
money=100&name=VIP&notify_url=https://merchant.example/notify&out_trade_no=ORD202605230001&pid=1000&return_url=https://merchant.example/return&type=alipayepusdt_secret_key
```

```text
sign=b865b0acbb2b01554c35a1bd33351452
```

**자산 선택.** `type`에 유효한 `token.network`를 지정하면 요청에 따로 지정한 토큰·네트워크 및 관리자 기본값보다 우선합니다. 비어 있지 않은 알 수 없는 값(예: `usdt-tron`)은 `10009`를 반환합니다. 값이 비어 있거나 `alipay`이면 누락된 필드만 해당 EPay 기본값으로 채웁니다. 이후에도 두 필드가 모두 비어 있으면 임시 주문을 생성하고, 하나만 비어 있으면 요청을 거부합니다. 통화는 요청값, 설정된 기본값, `cny` 순으로 결정합니다.

신규 설치에서는 `cny`를 설정하고 기본 토큰과 네트워크를 비워 둡니다. 업그레이드 시 기존 설정을 유지합니다. 서버는 서명 검증 후 `payment_type=Epay`를 설정합니다. 실제로 전송하는 `type`, `token`, `network`, `currency`를 모두 서명에 포함하세요.

<a id="callbacks"></a>

## 가맹점 콜백 {#merchant-callbacks}

결제가 완료되면 EPUSDT가 주문의 `notify_url`로 알림을 보냅니다. 서명을 검증하고 주문과 금액이 일치하는지 확인하세요. 같은 알림이 여러 번 와도 주문은 한 번만 처리해야 합니다. HTTP 200으로 응답하고 본문에 `ok` 또는 `success`를 반환하세요(대소문자 무관). 전송에 실패하면 `order_notice_max_retry`와 `callback_retry_base_seconds` 설정에 따라 재시도합니다. 재시도 간격은 지수적으로 증가하며 최대 5분입니다.

### GMPay {#gmpay}

GMPay는 POST 요청으로 JSON을 전송합니다. `pid`로 가맹점 키를 조회하고, 주문 생성과 동일하게 필드를 정규화한 뒤 HMAC을 검증하세요. 본문에는 `payment_type`이 포함되지 않습니다.

```json
{
  "pid": "1000",
  "trade_id": "20260523171652123456001",
  "order_id": "ORD202605230001",
  "amount": 100,
  "actual_amount": 14.29,
  "receive_address": "TTestTronAddress001",
  "token": "USDT",
  "block_transaction_id": "0xabc123...",
  "signature": "498975a97bc34563bdb14df53fc18054645df9684d6c67d9b9dd90ec62be1018",
  "status": 2
}
```

| 필드 | 유형 | 의미 |
| --- | --- | --- |
| `pid` | string | 가맹점 서명 키 ID입니다. |
| `trade_id` | string | EPUSDT 거래 ID입니다. |
| `order_id` | string | 가맹점 주문 ID입니다. |
| `amount` | number | 법정화폐 금액입니다. |
| `actual_amount` | number | 수신한 암호화폐 수량입니다. |
| `receive_address` | string | 수신 주소입니다. |
| `token` | string | 수신한 자산입니다. |
| `block_transaction_id` | string | 체인 내 해시 또는 제공업체 주문 참조 |
| `signature` | string | lowercase HMAC-SHA256 해시 값 |
| `status` | integer | 결제 완료(2). |

### EPay {#epay}

EPay는 숫자형 `pid`를 포함한 GET 요청을 전송합니다. EPay 주문과 `payment_type=Epay`를 선택한 GMPay 주문에는 숫자형 가맹점 PID를 사용하세요. 콜백에는 주문에 저장된 `type`을 사용하며, 값이 없으면 `alipay`를 사용합니다. 수신한 EPay 주문과 같은 방식으로 MD5 서명을 검증하세요.

```text
pid=1000
trade_no=20260523171652123456001
out_trade_no=ORD202605230001
type=alipay
name=VIP
money=100.0000
trade_status=TRADE_SUCCESS
sign=cc44fab3f264615d859f8a1fd36d2f08
sign_type=MD5
```

## OKPay 서비스 콜백 {#okpay-provider-callback}

OKPay에 `POST /payments/okpay/v1/notify`를 등록하세요. JSON, URL 인코딩 폼, 멀티파트 폼 또는 쿼리 문자열 그대로의 본문을 허용합니다. EPUSDT는 상점 토큰으로 서비스의 서명을 검증하고 해당 주문을 결제 완료 처리한 뒤 가맹점 콜백을 보냅니다. 결제 수단 선택이 완료된 임시 주문과 외부 서비스 결제용 하위 주문 모두에 적용됩니다.

성공적인 답변

```text
success
```

실패 시 (HTTP 400)

```text
fail
```

## 애플리케이션 오류 코드 {#application-error-codes}

| 코드 | HTTP | 의미 |
| --- | --- | --- |
| `200` | 200 | 성공 |
| `400` | 400 | 시스템 오류 또는 검증 실패 |
| `401` | 401 | 유효하지 않은 서명 |
| `10001` | 400 | 이미 등록된 지갑 주소입니다 |
| `10002` | 400 | 이미 존재하는 주문 |
| `10003` | 400 | 사용 가능한 수신 주소가 없음 |
| `10004` | 400 | 금액이 결제 단위의 최소 정밀도보다 작음 |
| `10005` | 400 | 사용 가능한 주소와 금액의 조합이 없음 |
| `10006` | 400 | 환율 계산 실패 |
| `10007` | 400 | 이미 처리된 블록 |
| `10008` | 400 | 주문을 찾을 수 없음 |
| `10009` | 400 | 유효하지 않은 매개변수 |
| `10010` | 400 | 주문 상태가 변경됨 |
| `10011` | 400 | 하위 주문 수 한도에 도달함 |
| `10012` | 400 | 하위 주문에서는 네트워크를 변경할 수 없음 |
| `10013` | 400 | 대기 중인 주문이 아님 |
| `10014` | 400 | 비활성화된 네트워크 |
| `10016` | 400 | 자산을 찾을 수 없음 |
| `10017` | 400 | 결제 서비스가 비활성화됨 |
| `10018` | 400 | 결제 서비스 설정이 완료되지 않음 |
| `10019` | 400 | 결제 서비스가 지원하지 않는 토큰 또는 네트워크 |
| `10038` | 400 | 트랜잭션 해시 검증 실패 |
| `10039` | 400 | 온체인 주문만 수동 검증 가능 |
| `10041` | 400 | 유효하지 않은 알림 URL |
| `10042` | 400 | 결제 서비스에서 주문 생성 실패 |
| `10044` | 400 | 유효하지 않은 리디렉션 URL |
| `10045` | 400 | 주문의 가맹점 키를 사용할 수 없음 |
| `10046` | 400 | EPay 반환 매개변수 서명 실패 |

[전체 애플리케이션 오류 목록](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/src/util/constant/errno.go)

EPay 결제 방식 목록 및 선택 우선순위 관련 정보는 [EPay 통합 가이드](/ko/guide/integration/epay)를 참조하세요.
