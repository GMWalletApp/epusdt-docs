---
operation: "epay-order"
method: "GET/POST"
route: "/payments/epay/v1/order/create-transaction/submit.php"
description: "서명된 매개변수를 GET 쿼리 또는 POST 폼으로 전송하세요. MD5 서명이 유효하면 게이트웨이가 HTTP 302 응답으로 결제 페이지로 리디렉션합니다."
---

# EPay 주문 생성 {#create-an-epay-order}

<ApiRoute />

<a class="api-example-jump" href="#request-example">요청 예시 ↓</a>

서명된 매개변수를 GET 쿼리 또는 POST 폼으로 전송하세요. MD5 서명이 유효하면 게이트웨이가 HTTP 302 응답으로 결제 페이지로 리디렉션합니다.

## 매개변수 {#parameters}

<!--@include: ../payment.md#epay-fields-->

예시 서명에는 데모용 키 `epusdt_secret_key`를 사용했습니다. 필드나 가맹점 키가 바뀔 때마다 서버에서 서명을 다시 계산하세요.

## 관련 문서 {#related-resources}

- [가맹점 사이트로 돌아가기](./checkout-return)
- [서명](../payment#signing)
