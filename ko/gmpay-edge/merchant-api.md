---
description: "GMPay Edge의 상점 자격 정보, HMAC 요청 서명, 그리고 주문 알림을 통합하거나, EPay 호환성 어댑터를 사용하십시오."
titleTemplate: ":title | GMPay Edge"
---

# 가맹점 API {#merchant-api}

GMPay는 기본 가맹점 프로토콜입니다. EPay는 호환 어댑터로, 동일한 인증 정보, 주문 서비스, 멱등성 규칙, 상태 전이, 결제 화면, 조회 동작 및 콜백 처리 과정을 사용합니다.

권위 있는 분야 및 상태 값의 경우, 배포된 인스턴스의 `/docs` 페이지 또는 저장소에 관리되는 OpenAPI 계약을 사용하세요: [`public/openapi.yaml`](https://github.com/GMWalletApp/gmpay-edge/blob/main/public/openapi.yaml).

## GMPay 서명 {#gmpay-signatures}

GMPay 요청에는 숫자 `pid`와 소문자 형식의 HMAC-SHA256 `signature`가 필요합니다.

요청에 서명하는 방법

1. `signature` 필드와 빈 값을 제외하세요.
2. ASCII 순서대로 필드를 정렬합니다.
3. `key=value` 쌍을 `&`로 연결하세요.
4. 비밀 키를 HMAC 키로 사용하십시오.
5. HMAC-SHA256을 계산해 소문자 16진수로 인코딩하세요.

## 주문 생성 {#create-order}

<span class="api-route"><b>POST</b> <code>/payments/gmpay/v1/order/create-transaction</code></span>

기존의 `order_id`를 재사용하면 중복 주문이 생성되지 않습니다. `token`과 `network`를 모두 생략하면 선택 가능한 주문이 생성되지만, GMPay Edge는 기본적으로 TRON으로 자동으로 설정되지 않습니다.

## 주문 조회 {#query-order}

<span class="api-route"><b>GET</b> <code>/payments/gmpay/v1/order/query</code></span>

`trade_id` 또는 `order_id` 하나를 제공하고, 동일한 인증 정보를 사용하여 요청을 완료합니다. 인증 정보는 사용자가 생성한 주문에 대해서만 조회할 수 있습니다.

## 콜백 수신 {#receive-callbacks}

상인(merchant)은 주문 생성 시 `notify_url`을 제공합니다. 콜백 대상은 SSRF 및 보안 정책을 확인해야 합니다.

제공된 이벤트는 일관된 패턴을 가지며, 보존된 시도, 제한된 재시도, 그리고 감사 기능이 적용된 수동 재시도 경로를 포함합니다. 핸들러는 서명을 확인하고, 중복 이벤트를 동일하게 처리하며, 로컬 상태를 커밋한 후에만 확인해야 합니다.

GMPay 콜백을 정상적으로 처리한 뒤에는 HTTP 200과 일반 텍스트 `ok`를 반환하세요.

## EPay 호환성 {#epay-compatibility}

EPay 호환성은 동일한 인증 방식과 주문 프로세스를 사용하지만, 기존의 EPay MD5 경계는 수신 요청 및 호환 가능한 응답에 적용됩니다.
