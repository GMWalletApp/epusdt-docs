---
operation: "config"
method: "GET"
route: "/payments/gmpay/v1/config"
description: "supported_assets에서 현재 결제 가능한 네트워크와 토큰을 확인하세요. 요청 매개변수와 가맹점 서명은 필요하지 않습니다."
---

# 결제 설정 조회 {#read-checkout-configuration}

<ApiRoute />

<a class="api-example-jump" href="#request-example">요청 예시 ↓</a>

`supported_assets`에서 현재 결제 가능한 네트워크와 토큰을 확인하세요. 요청 매개변수와 가맹점 서명은 필요하지 않습니다.

## 관련 문서 {#related-resources}

- [GMPay 주문 생성](./create-order)
- [가맹점 콜백](../payment#callbacks)
