---
description: "GMShop Edge 매장들을 원본 공급업체 API를 통해 서명된 카탈로그, 주문 및 결제 채널 요청과 연결합니다."
titleTemplate: ":title | GMShop Edge"
---

# 공급업체 API {#native-supplier-api}

GMShop Edge는 다른 GMShop Edge 인스턴스의 상류 디지털 상품 공급업체 역할을 할 수 있습니다. 자체 프로토콜은 `/api/v1/supplier/*` 경로 아래에서 카탈로그, 주문, 결제 채널, 지갑 충전 등의 작업을 노출합니다. 이는 결제 게이트웨이 API가 아닌, 상류 공급 프로토콜입니다.

## 승인하고 권한 부여 {#enable-and-issue-credentials}

제공업체 API를 관리 설정에서 활성화한 후, 이 쇼핑몰에서 구매할 고객 계정용 API 키를 생성합니다. API 키는 생성 시에만 표시되며 암호화되어 저장됩니다. 키는 취소할 수 있으며, 배송 결과 확인 알림이 전송되는 위치를 제한하기 위해 선택적으로 허용된 콜백 오리진을 설정할 수 있습니다.

GMShop Edge 인스턴스는 `gmshop_edge` 공급자 어댑터를 선택하고, 발행된 키 ID와 비밀을 암호화된 실행 구성 파일에 저장합니다.

## 요청 서명 {#request-signing}

모든 요청은 HTTPS를 사용해야 하며, 명시적인 포트 없이 다음 내용을 보내야 합니다.

- `GMShop-Edge-Api-Key`: 발행된 키 ID.
- `GMShop-Edge-Timestamp`: 10자리의 유닉스 시간 (초 단위)
- `GMShop-Edge-Nonce`: 고유한 16~100자 알파 숫자/하이픈 값
- `GMShop-Edge-Signature`: 소문자 HMAC-SHA256 16진법 해시

다음 값들을 줄바꿈 문자를 사용하여 서명 페이로드를 구성하십시오.

```text
UPPERCASE_HTTP_METHOD
PATH_WITH_RAW_QUERY
UNIX_TIMESTAMP
NONCE
SHA256_HEX_OF_RAW_BODY
```

발급된 API 비밀 키로 해당 데이터의 HMAC-SHA256을 계산하세요. 서버는 최대 60초의 시간 차를 허용하고 각 nonce를 기록해 재사용을 감지합니다. 같은 nonce를 다시 사용하면 충돌 오류가 반환됩니다. 현재 분당 요청 한도는 키당 120회, 사용자당 300회입니다.

## 엔드포인트 {#endpoints}

| 작업 | HTTP | 경로 |
| --- | --- | --- |
| 테스트 인증 정보 | POST | `/api/v1/supplier/ping` |
| 카테고리 목록 조회 | GET | `/api/v1/supplier/categories` |
| 상품 목록 조회 | GET | `/api/v1/supplier/products` |
| 상품 조회 | GET | `/api/v1/supplier/products/{productId}` |
| 주문 생성 | POST | `/api/v1/supplier/orders` |
| 주문 조회 | GET | `/api/v1/supplier/orders/{orderId}` |
| 주문 취소 | POST | `/api/v1/supplier/orders/{orderId}/cancel` |
| 결제 채널 목록 조회 | GET | `/api/v1/supplier/payment-channels` |
| 충전 요청 생성 | POST | `/api/v1/supplier/topups` |
| 충전 내역 조회 | GET | `/api/v1/supplier/topups/{id}` |

주문 생성 및 잔액 충전 작업은 중복 가능합니다. 요청을 다시 시도할 때, 불확실한 경우 동일한 중복성을 유지하십시오. 클라이언트가 시간 초과로 인해 발생했더라도 새로운 공급업체 주문을 생성하지 마십시오.

## API 레퍼런스 {#api-reference}

배포된 인스턴스는 `/openapi`를 자체 인터랙티브 API 레퍼런스로 리디렉션합니다. 이 저장소는 또한 인증, 고객 처리, 공급업체 콜백, 관리, 웹 지원 및 자체 공급업체 프로토콜을 포함한 전체 [OpenAPI YAML](https://github.com/GMWalletApp/gmshop-edge/blob/main/public/openapi.yaml)을 게시합니다.
