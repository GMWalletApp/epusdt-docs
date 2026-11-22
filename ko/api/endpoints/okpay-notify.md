---
operation: "okpay-notify"
method: "POST"
route: "/payments/okpay/v1/notify"
description: "이 URL을 OKPay에 등록하세요. OKPay가 서명한 데이터를 보내면 EPUSDT가 상점의 token으로 서명을 검증합니다. 응답 본문은 일반 텍스트이며 성공 시 success (200), 실패 시 fail (400)입니다."
---

# OKPay 알림 수신 {#receive-an-okpay-notification}

<ApiRoute />

<a class="api-example-jump" href="#request-example">요청 예시 ↓</a>

이 URL을 OKPay에 등록하세요. OKPay가 서명한 데이터를 보내면 EPUSDT가 상점의 `token`으로 서명을 검증합니다. 응답 본문은 일반 텍스트이며 성공 시 success (200), 실패 시 fail (400)입니다.

## 관련 문서 {#related-resources}

- [네트워크 또는 결제 서비스 선택](./switch-network)
- [가맹점 콜백](../payment#callbacks)
