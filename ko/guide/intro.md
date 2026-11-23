---
description: "EPUSDT가 지원하는 네트워크와 토큰, 수신 주소 설정 방법, 결제부터 서명된 알림 수신까지의 주문 흐름을 안내합니다."
title: "지원 네트워크, 토큰 및 가맹점 결제"
---

# 소개 {#introduction}

EPUSDT는 자체 호스팅 결제 게이트웨이입니다. 가맹점이 주문을 생성하면 구매자가 결제 페이지에서 결제합니다. 게이트웨이는 결제를 검증한 뒤 서명된 알림을 보냅니다. 온체인 직접 결제에서는 자금이 가맹점의 수신 주소로 바로 입금됩니다.

Codex, Claude Code, Cursor 또는 OpenCode로 배포하려면 에이전트에 [배포 가이드 및 검증 체크리스트](https://epusdt.com/agent-setup/prompt.md)를 전달하세요.

## 첫 결제 설정 {#set-up-your-first-payment}

1. [게이트웨이를 배포](/ko/guide/installation/docker)하고 외부에서 접속할 수 있는 HTTPS 결제 URL을 설정하세요.
2. 관리자 콘솔에서 네트워크와 자산을 활성화하고 수신 주소를 추가하세요. 가맹점 API 키를 생성하고 `pid`와 `secret_key`를 가맹점 서버에 보관하세요.
3. [GMPay 주문을 생성](/ko/api/payment#create)하고 구매자를 `payment_url`로 리디렉션하세요. 기존 EPay 연동은 [EPay 리디렉션 방식](/ko/guide/integration/epay)을 사용하세요.

## 지원 체인 및 토큰 {#networks}

온체인 직접 결제 자산은 해당 네트워크와 자산이 활성화되어 있고 수신 주소가 등록된 경우에만 결제 화면에 표시됩니다. 아래는 신규 설치의 기본 목록입니다. 현재 게이트웨이에서 이용 가능한 옵션은 `GET /payments/gmpay/v1/config` 응답의 `data.supported_assets`에서 확인하세요.

| 네트워크 | API 네트워크 ID | 기본 자산 |
| --- | --- | --- |
| TRON | `tron` | TRX, USDT |
| Ethereum | `ethereum` | USDT, USDC |
| BNB Smart Chain | `binance` | USDT, USDC |
| Polygon PoS | `polygon` | USDT, USDC, USDC.e |
| Solana | `solana` | SOL, USDT, USDC |
| TON | `ton` | TON, USDT |
| Plasma | `plasma` | USDT |
| Aptos | `aptos` | USDT, USDC |
| Sui | `sui` | SUI, USDC |
| Arbitrum One | `arbitrum` | ETH, USDC |
| Base | `base` | ETH, USDC |
| OP Mainnet | `optimism` | ETH, USDC |
| Avalanche C-Chain | `avalanche` | AVAX, USDC |
| HyperEVM | `hyperevm` | HYPE, USDC |
| Monad | `monad` | MON, USDC |
| Arc | `arc` | USDC |

Arc는 네이티브 USDC와 ERC-20 USDC를 모두 지원합니다. Polygon에서 USDC와 USDC.e는 별도의 자산입니다.

### 외부 서비스 결제 수단 {#hosted-payment-methods}

X Layer의 OKX OnchainOS는 USDC, USDT0 및 USDG를 지원합니다. OKPay는 기본적으로 USDT와 TRX를 지원합니다. 각 서비스를 별도로 활성화하세요. 지원 옵션은 `data.xlayer` 또는 `data.okpay`에서 확인할 수 있습니다.

## 송금에서 주문 이행까지 {#from-transfer-to-fulfillment}

ChainScanner는 기본적으로 EPUSDT 안에서 실행됩니다. 일치하는 송금을 감지하면 주문은 **5 · 확인 중** 상태가 됩니다. 기본 설정인 엄격한 검증 모드에서는 필요한 블록 확인 수에 도달하고 독립된 두 노드의 결과가 일치해야 **2 · 결제 완료**로 변경됩니다. 두 차례 검증에 실패하면 **6 · 수동 검토**로 전환됩니다. 결제 성공 콜백의 서명을 검증한 뒤에만 주문을 이행하세요.

## 화면 예시 {#screenshots}

<table>
  <tr>
    <td align="center" valign="top" width="25%">
      <img src="/screenshots/web2.png" alt="대시보드 개요" height="200"><br>
      <sub>대시보드 개요</sub>
    </td>
    <td align="center" valign="top" width="25%">
      <img src="/screenshots/web1.png" alt="관리자 콘솔" height="200"><br>
      <sub>관리자 콘솔</sub>
    </td>
    <td align="center" valign="top" width="25%">
      <img src="/screenshots/pay1.jpeg" alt="결제 수단 선택 화면" height="200"><br>
      <sub>결제 수단 선택 화면</sub>
    </td>
    <td align="center" valign="top" width="25%">
      <img src="/screenshots/pay2.jpeg" alt="결제 화면" height="200"><br>
      <sub>결제 화면</sub>
    </td>
  </tr>
</table>

## 관련 프로젝트 및 보안 감사 {#related-projects-and-audit}

- [GMPay Edge](/ko/gmpay-edge/) · Workers 또는 Bun에서 실행하는 결제 게이트웨이입니다.
- [GMShop Edge](/ko/gmshop-edge/) · 디지털 상품 판매용 스토어입니다.
- [EPUSDT 보안 감사 (2026년 5월)](https://github.com/VectorBits/audit/blob/main/epusdt-secure-audit-report-2026-05-14.pdf)
