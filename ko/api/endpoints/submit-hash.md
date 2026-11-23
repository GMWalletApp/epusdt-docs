---
operation: "submit-hash"
method: "POST"
route: "/pay/submit-tx-hash/{trade_id}"
description: "결제 대기 중인 온체인 주문(상태 1)의 block_transaction_id를 JSON 본문에 넣어 보내세요. 서버는 전송 내역을 검증한 뒤 주문을 갱신합니다."
---

# 트랜잭션 해시 제출 {#submit-a-transaction-hash}

<ApiRoute />

<a class="api-example-jump" href="#request-example">요청 예시 ↓</a>

결제 대기 중인 온체인 주문(상태 1)의 `block_transaction_id`를 JSON 본문에 넣어 보내세요. 서버는 전송 내역을 검증한 뒤 주문을 갱신합니다.

## 매개변수 {#parameters}

`trade_id` · `string` · PATH

주문 생성 시 반환된 EPUSDT 거래 ID입니다.

## JSON 본문 {#json-body}

| 필수 필드 | 유형 | 예시 |
| --- | --- | --- |
| `block_transaction_id` | string | `0x…` |

## 관련 문서 {#related-resources}

- [주문 상태 조회](./order-status)
- [가맹점 콜백](../payment#callbacks)
