---
description: "EPUSDT 경로 및 HTTP 메서드를 사용하여 상점 주문, 결제 및 지불 상태에 대한 정보를 확인한 후, 서명 및 콜백 예제를 살펴보세요."
title: "결제 API 엔드포인트 레퍼런스"
---

# API 레퍼런스 {#api-reference}

서명 예시, 주문 상태 및 콜백 검증 방법은 [가맹점 API](/ko/api/payment)를 참고하세요.

## 공개 API 경로 {#live-public-routes}

| 용도 | 메서드 | 경로 | 인증 |
| --- | --- | --- | --- |
| [GMPay 주문 생성](/ko/api/endpoints/create-order) | POST | `/payments/gmpay/v1/order/create-transaction` | 가맹점 HMAC-SHA256 서명 |
| [결제 설정 조회](/ko/api/endpoints/config) | GET | `/payments/gmpay/v1/config` | 공개 |
| [호스팅 결제 페이지 열기](/ko/api/endpoints/open-checkout) | GET | `/pay/checkout-counter/{trade_id}` | 공개 |
| [결제 상세 정보 조회](/ko/api/endpoints/checkout-details) | GET | `/pay/checkout-counter-resp/{trade_id}` | 공개 |
| [주문 상태 조회](/ko/api/endpoints/order-status) | GET | `/pay/check-status/{trade_id}` | 공개 |
| [네트워크 또는 결제 서비스 선택](/ko/api/endpoints/switch-network) | POST | `/pay/switch-network` | 공개 |
| [트랜잭션 해시 제출](/ko/api/endpoints/submit-hash) | POST | `/pay/submit-tx-hash/{trade_id}` | 공개 |
| [가맹점 사이트로 돌아가기](/ko/api/endpoints/checkout-return) | GET | `/pay/return/{trade_id}` | 브라우저 리디렉션 |
| [EPay 주문 생성](/ko/api/endpoints/epay-order) | GET 또는 POST | `/payments/epay/v1/order/create-transaction/submit.php` | 가맹점 MD5 서명 |
| [OKPay 알림 수신](/ko/api/endpoints/okpay-notify) | POST | `/payments/okpay/v1/notify` | OKPay 서명 |

## 관리자 API {#admin-api-surface}

관리 API는 `/admin/api/v1/*` 경로 아래에 위치하며, 로그인 및 초기 비밀번호 엔드포인트 외에는 JWT로 보호됩니다.

현재 출처에서 잘 드러나는 주요 그룹

- 공용 계산원은 대기 중인 오프체인 주문에 대한 해시를 수락합니다. 관리자는 만료된 주문이나 수동 검토 대상 주문을 다시 확인할 수도 있습니다.
- 환율 설정에서 `rate.mode`는 `fixed` 또는 `auto`입니다. 고정 모드는 `rate.forced_rate_list`를 사용합니다. 자동 모드는 `rate.api_url`에서 환율을 가져와 기준 통화별 성공 응답을 캐시하고, 갱신 실패 시 마지막 영구 캐시를 유지합니다. `rate.forced_rate_list`를 비우면 기본 CNY USDT/USDC 환율이 복원됩니다.
- `/auth/*`
- `/api-keys/*`
- `/notification-channels/*`
- `/config`
- 체인/체인 토큰 관리
- 지갑 주소 관리
- 설정 관리

## 상업 신용 관련 규정 {#merchant-credential-rules}

### GMPay {#gmpay}

- 필요한 상점 식별자: `pid`
- 서명 필드: `signature`
- `v2.0.0`부터 적용되는 서명 알고리즘: `api_keys.secret_key`를 사용하여 `pid`와 일치하는, 표준화된 비어 있지 않은 매개변수 문자열에 기반한 HMAC-SHA256
- v2 GMPay MD5 클라이언들은 `v2.0.0` 또는 그 이후 버전으로 업그레이드되어야 합니다.

### EPay 호환 결제 흐름 {#epay-compatible-flow}

- 필요한 상점 식별자: `pid`
- 서명 필드: `sign`
- 서명 키: 활성화된 `api_keys` 행 중 `pid`와 일치하는 `secret_key`
- `sign_type`는 일반적으로 사용되며, 주로 `MD5`를 사용합니다.
- EPay의 `type`에는 `alipay` 또는 `usdt.tron`처럼 지원되는 `token.network` 값을 사용할 수 있습니다. 유효한 선택 값은 EPay의 반환 및 알림 콜백에도 그대로 포함됩니다.

## 추천 통합 순서 {#recommended-integration-order}

1. 관리 패널에서 상인 신원 생성 또는 확인 (`pid` + `secret_key`)
2. `/payments/gmpay/v1/config` 쿼리를 실행하고, 클라이언트가 동적 네트워크/토큰 옵션이 필요한 경우 `data.supported_assets`를 읽습니다.
3. 신규 연동에는 GMPay를 권장합니다
4. EPay 호환 리다이렉트는 상류 시스템이 해당 흐름을 예상할 때만 사용합니다.
5. 동일한 상점 `secret_key`를 사용하여 콜백을 확인합니다.
