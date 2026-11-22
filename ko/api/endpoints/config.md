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

지원 버전에서는 `token_details`에서 심볼로 자산 ID와 소수 자릿수를 조회할 수 있습니다. 이전 버전은 `tokens`만 반환합니다. [기본 제공 컨트랙트 목록](../../guide/intro#networks)

## 관련 문서 {#related-resources}

- [GMPay 주문 생성](./create-order)
- [가맹점 콜백](../payment#callbacks)
