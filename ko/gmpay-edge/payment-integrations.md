---
title: "체인 내 결제, 거래소 및 지갑 결제"
description: "GMPay Edge의 온체인, 거래소, 지갑 통합 기능을 검토하고, 결제 단계에서 어떤 옵션이 표시되는지 어떤 요소가 제어하는지 확인하십시오."
titleTemplate: ":title | GMPay Edge"
---

# 결제 서비스 연동 {#payment-integrations}

GMPay Edge는 온체인, 거래, 지갑 어댑터를 포함합니다. 수신 방법이 별도로 구성되어 수신 노출이 관리됩니다.

다음 방법은 필요한 공개 연결 또는 읽기 전용 계정 설정이 필요하며, 사용 가능성 검사를 통과해야 지불자에게 제공될 수 있습니다.

| 유형 | 연동 | 기본 제공 자산 |
| --- | --- | --- |
| 온체인 | TRON / TRC20 | USDT, TRX |
| 온체인 | Ethereum / ERC20 | USDT, USDC, ETH |
| 온체인 | Base | USDT, USDC, ETH |
| 온체인 | BNB Smart Chain / BEP20 | USDT, USDC, BNB |
| 온체인 | Polygon | USDT, USDC, MATIC |
| 온체인 | TON | USDT, GRAM |
| 온체인 | Aptos | USDT, USDC |
| 온체인 | Solana | USDT, USDC |
| 거래소 | Binance | USDT, USDC |
| 거래소 | OKX | USDT, USDC |
| 지갑 | OKPay | USDT, TRX |

내장된 기능은 프로젝트 내에서 이미 존재합니다. 실제 사용에는 배포자 소유의 엔드포인트 또는 읽기 전용 자격 증명, 설정된 수신 방법, 백업, 모니터링, 그리고 실제 플랫폼과의 테스트가 필요합니다.
