---
operation: "open-checkout"
method: "GET"
route: "/pay/checkout-counter/{trade_id}"
description: "브라우저에서 결제 URL을 여세요. EPUSDT가 HTTP 301 응답으로 구매자를 /cashier/{trade_id}로 리디렉션합니다."
---

# 호스팅 결제 페이지 열기 {#open-hosted-checkout}

<ApiRoute />

<a class="api-example-jump" href="#request-example">요청 예시 ↓</a>

브라우저에서 결제 URL을 여세요. EPUSDT가 HTTP 301 응답으로 구매자를 `/cashier/{trade_id}`로 리디렉션합니다.

## 매개변수 {#parameters}

`trade_id` · `string` · PATH

주문 생성 시 반환된 EPUSDT 거래 ID입니다.

## 관련 문서 {#related-resources}

- [결제 상세 정보 조회](./checkout-details)
- [가맹점 콜백](../payment#callbacks)
