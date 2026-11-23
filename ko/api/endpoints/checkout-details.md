---
operation: "checkout-details"
method: "GET"
route: "/pay/checkout-counter-resp/{trade_id}"
description: "금액, 수신 주소 및 현재 선택한 결제 수단을 조회합니다. created_at과 expiration_time은 밀리초 단위의 Unix 타임스탬프입니다."
---

# 결제 상세 정보 조회 {#read-checkout-details}

<ApiRoute />

<a class="api-example-jump" href="#request-example">요청 예시 ↓</a>

금액, 수신 주소 및 현재 선택한 결제 수단을 조회합니다. `created_at`과 `expiration_time`은 밀리초 단위의 Unix 타임스탬프입니다.

## 매개변수 {#parameters}

`trade_id` · `string` · PATH

주문 생성 시 반환된 EPUSDT 거래 ID입니다.

## 관련 문서 {#related-resources}

- [주문 상태 조회](./order-status)
- [가맹점 콜백](../payment#callbacks)
