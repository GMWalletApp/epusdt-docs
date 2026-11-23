---
operation: "checkout-return"
method: "GET"
route: "/pay/return/{trade_id}"
description: "결제가 완료된 EPay 주문은 서명된 반환 매개변수와 함께 가맹점 사이트로 리디렉션됩니다. 그 외 주문은 결제 페이지로 돌아갑니다. 주문은 비동기 알림의 서명을 검증한 뒤 이행하세요."
---

# 가맹점 사이트로 돌아가기 {#return-to-the-merchant}

<ApiRoute />

<a class="api-example-jump" href="#request-example">요청 예시 ↓</a>

결제가 완료된 EPay 주문은 서명된 반환 매개변수와 함께 가맹점 사이트로 리디렉션됩니다. 그 외 주문은 결제 페이지로 돌아갑니다. 주문은 비동기 알림의 서명을 검증한 뒤 이행하세요.

## 매개변수 {#parameters}

`trade_id` · `string` · PATH

주문 생성 시 반환된 EPUSDT 거래 ID입니다.

## 관련 문서 {#related-resources}

- [EPay 주문 생성](./epay-order)
- [가맹점 콜백](../payment#callbacks)
