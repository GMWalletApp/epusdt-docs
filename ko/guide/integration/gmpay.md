---
description: "EPUSDT GMPay 주문 엔드포인트 통합, 상점 요청 서명, 그리고 게이트웨이에서 반환된 결제 URL로 구매자를 리디렉션합니다."
---

# GMPay 연동 (권장) {#gmpay-integration-recommended}

새로 연동할 때는 모두 GMPay를 사용하세요.

## 경로 {#route}

```text
POST /payments/gmpay/v1/order/create-transaction
```

## 상업 신용 증명 요구 {#merchant-credential-requirement}

API를 호출하기 전에, 관리 패널에서 API 키 행을 생성하거나 확인하세요.

필요한 항목

- `pid`
- `secret_key`

`pid`는 요청에 포함되어야 하며, `secret_key`는 서명 키입니다.

## 최소 요청 본문 {#minimal-request-body}

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

## 서명 규칙 {#signature-rule}

> `v2.0.0`부터 GMPay는 MD5 대신 HMAC-SHA256을 사용합니다. v2를 배포하기 전에 클라이언트를 업데이트하세요. 이전 방식으로 요청하면 `401 Unauthorized`가 반환됩니다. EPay 호환 요청은 영향을 받지 않습니다.

1. `signature`를 제외하고 값이 비어 있지 않은 모든 필드를 포함합니다.
2. 필드명을 ASCII 순서로 정렬합니다.
3. `key=value&...` 형식으로 제공해주세요.
4. 가맹점 `secret_key`를 HMAC 키로 사용해 HMAC-SHA256을 계산하세요.
5. `signature`로 64자 이하의 소문자 형태의 16진법 해시 값을 보내세요.

## 관련 API 경로 {#useful-companion-routes}

- `GET /payments/gmpay/v1/config`
- `POST /pay/switch-network`

클라이언트가 동적인 네트워크/토큰 옵션이 필요한 경우, `/payments/gmpay/v1/config` 응답에서 `data.supported_assets`로부터 정보를 읽어보세요.

`data.site`를 브랜드 관련 정보 확인하고, `data.epay`, `data.okpay` 및 `data.xlayer`는 결제 설정에 참고하세요.

## 콜백 검증 {#callback-verification}

GMPay 알림이 JSON 형식의 `POST` 요청으로 `notify_url`로 전송됩니다.

HMAC-SHA256 서명을 검증하고 결제된 주문과 일치하는지 확인한 뒤 멱등하게 처리하세요. HTTP 200과 일반 텍스트 `ok` 또는 `success`로 응답하세요(대소문자 무관).

## 성공 응답 참고 사항 {#success-response-note}

현재 제공되는 정보에는 `payment_url`이 성공적인 주문 생성 응답에 포함되어 있습니다. 따라서, 호출자는 URL을 직접 다시 생성하는 대신, 명시적인 결제 진행 리디렉션 대상 URL을 활용할 수 있습니다.
