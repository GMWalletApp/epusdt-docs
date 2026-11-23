---
operation: "create-order"
method: "POST"
route: "/payments/gmpay/v1/order/create-transaction"
description: "서버에서 요청에 서명한 뒤 구매자에게 payment_url을 여세요. token과 network는 함께 지정하거나 둘 다 생략하세요. 둘 다 생략하면 구매자가 결제 시 직접 선택합니다."
---

# GMPay 주문 생성 {#create-a-gmpay-order}

<ApiRoute />

<a class="api-example-jump" href="#request-example">요청 예시 ↓</a>

서버에서 요청에 서명한 뒤 구매자에게 `payment_url`을 여세요. `token`과 `network`는 함께 지정하거나 둘 다 생략하세요. 둘 다 생략하면 구매자가 결제 시 직접 선택합니다.

## 매개변수 {#parameters}

<!--@include: ../payment.md#create-fields-->

예시 서명에는 데모용 키 `epusdt_secret_key`를 사용했습니다. 필드나 가맹점 키가 바뀔 때마다 서버에서 서명을 다시 계산하세요.

## 관련 문서 {#related-resources}

- [호스팅 결제 페이지 열기](./open-checkout)
- [서명](../payment#signing)
