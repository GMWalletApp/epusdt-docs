---
operation: "switch-network"
method: "POST"
route: "/pay/switch-network"
description: "상위 주문의 trade_id, token, network를 JSON 본문에 넣어 보내세요. 상위 주문은 대기 중이어야 합니다(상태 1 또는 4). 응답에서 수신 주소 또는 호스팅 결제 URL을 확인하세요."
---

# 네트워크 또는 결제 서비스 선택 {#select-a-network-or-provider}

<ApiRoute />

<a class="api-example-jump" href="#request-example">요청 예시 ↓</a>

상위 주문의 `trade_id`, `token`, `network`를 JSON 본문에 넣어 보내세요. 상위 주문은 대기 중이어야 합니다(상태 1 또는 4). 응답에서 수신 주소 또는 호스팅 결제 URL을 확인하세요.

## JSON 본문 {#json-body}

| 필수 필드 | 유형 | 예시 |
| --- | --- | --- |
| `trade_id` | string | `20260523171652123456001` |
| `token` | string | `USDT` |
| `network` | string | `tron` |

## 관련 문서 {#related-resources}

- [결제 설정 조회](./config)
- [가맹점 콜백](../payment#callbacks)
