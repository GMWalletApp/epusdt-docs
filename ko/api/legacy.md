---
description: "퇴사된 EPUSDT API 엔드포인트와 그 대신 사용되는 현재의 상점 API 경로를 식별합니다."
---

# API 마이그레이션 {#api-migration}

현재 소스에는 기존 경로 `POST /api/v1/order/create-transaction`이 **등록되어 있지 않습니다**.

이전 호환 경로 `POST /payments/epusdt/v1/order/create-transaction`도 **등록되어 있지 않습니다**.

## 기존 연동을 대체할 API 경로 {#replace-old-integrations-with-one-of-these-live-routes}

| 사용 사례 | 현재 사용 가능한 경로 |
| --- | --- |
| 기본 JSON API (권장) | [`POST /payments/gmpay/v1/order/create-transaction`](/ko/api/endpoints/create-order) |
| 리디렉션 / EPay 호환 결제 | [`GET/POST /payments/epay/v1/order/create-transaction/submit.php`](/ko/api/endpoints/epay-order) |

## 마이그레이션 시 주요 변경 사항 {#important-migration-changes}

1. **모든 주문 생성 요청에는 가맹점을 식별하는 `pid`가 필요합니다.**
2. **서명 검증에는 해당 `api_keys` 레코드의 `secret_key`를 사용합니다.** 기존에 경로별로 사용하던 공용 키는 사용하지 않습니다.
3. **사용 가능한 네트워크와 토큰은 관리자가 설정합니다.** 고정 목록을 가정하지 말고 `/payments/gmpay/v1/config`에서 `data.supported_assets`를 조회하세요.
4. **EPay 기본값**은 관리자 설정(`epay.default_token`, `epay.default_currency`, `epay.default_network`)에서 가져옵니다. 이전 환경 변수인 `epay_pid`, `epay_key`는 더 이상 사용하지 않습니다.
