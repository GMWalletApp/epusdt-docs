---
operation: "order-status"
method: "GET"
route: "/pay/check-status/{trade_id}"
description: "EPUSDT의 trade_id로 주문 상태를 주기적으로 조회해 결제 화면을 갱신하세요. 주문은 가맹점 콜백의 서명을 검증한 뒤 이행하세요."
---

# 주문 상태 조회 {#poll-order-status}

<ApiRoute />

<a class="api-example-jump" href="#request-example">요청 예시 ↓</a>

EPUSDT의 `trade_id`로 주문 상태를 주기적으로 조회해 결제 화면을 갱신하세요. 주문은 가맹점 콜백의 서명을 검증한 뒤 이행하세요.

## 매개변수 {#parameters}

`trade_id` · `string` · PATH

주문 생성 시 반환된 EPUSDT 거래 ID입니다.

## 주문 상태 {#order-states}

<!--@include: ../payment.md#order-states-->

## 관련 문서 {#related-resources}

- [결제 상세 정보 조회](./checkout-details)
- [가맹점 콜백](../payment#callbacks)
