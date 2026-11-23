---
description: "Поддерживаемые сети и токены EPUSDT, настройка адресов получателя и путь заказа от оформления до подписанного уведомления об оплате."
title: "Поддерживаемые сети, токены и приём платежей"
---

# Введение {#introduction}

EPUSDT — платёжный шлюз, который продавец размещает на своём сервере. Продавец создаёт заказ, покупатель оплачивает его на платёжной странице, а шлюз после проверки отправляет подписанное уведомление. При прямой оплате в блокчейне средства поступают на адрес продавца.

Для установки через Codex, Claude Code, Cursor или OpenCode передайте агенту [руководство по развёртыванию и проверке установки](https://epusdt.com/agent-setup/prompt.md).

## Настройка первого платежа {#set-up-your-first-payment}

1. [Установите шлюз](/ru/guide/installation/docker) и задайте публичный HTTPS-адрес для оплаты.
2. В панели администратора включите сеть и актив, затем добавьте адрес получателя. Создайте ключ API продавца и храните его `pid` и `secret_key` на своём сервере.
3. [Создайте заказ GMPay](/ru/api/payment#create) и перенаправьте покупателя на `payment_url`. Для существующей интеграции EPay используйте [схему перенаправления EPay](/ru/guide/integration/epay).

## Поддерживаемые сети и токены {#networks}

Актив доступен для прямой оплаты, когда включены его сеть и сам актив, а также настроен адрес получателя. В таблице приведены значения для новой установки. Доступные на вашем шлюзе варианты перечислены в `data.supported_assets` ответа `GET /payments/gmpay/v1/config`.

| Сеть | Идентификатор сети в API | Активы по умолчанию |
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

В сети Arc принимаются нативный USDC и USDC стандарта ERC-20. В Polygon USDC и USDC.e считаются разными активами.

### Оплата через внешние сервисы {#hosted-payment-methods}

OKX OnchainOS в сети X Layer поддерживает USDC, USDT0 и USDG. OKPay по умолчанию поддерживает USDT и TRX. Включайте каждый сервис отдельно. Его параметры доступны в `data.xlayer` или `data.okpay`.

## От перевода до выполнения заказа {#from-transfer-to-fulfillment}

По умолчанию ChainScanner работает внутри EPUSDT. Когда сканер находит подходящий перевод, заказ переходит в состояние **5 · Подтверждение**. В строгом режиме, включённом по умолчанию, для перехода в **2 · Оплачен** нужно дождаться требуемого числа подтверждений и получить совпадающие результаты от двух независимых узлов. После двух неудачных проверок заказ переходит в **6 · Ручная проверка**. Выполняйте заказ только после проверки подписи уведомления об успешной оплате.

## Снимки экрана {#screenshots}

<table>
  <tr>
    <td align="center" valign="top" width="25%">
      <img src="/screenshots/web2.png" alt="Обзор панели управления" height="200"><br>
      <sub>Обзор панели управления</sub>
    </td>
    <td align="center" valign="top" width="25%">
      <img src="/screenshots/web1.png" alt="Панель администратора" height="200"><br>
      <sub>Панель администратора</sub>
    </td>
    <td align="center" valign="top" width="25%">
      <img src="/screenshots/pay1.jpeg" alt="Страница оформления заказа" height="200"><br>
      <sub>Страница оформления заказа</sub>
    </td>
    <td align="center" valign="top" width="25%">
      <img src="/screenshots/pay2.jpeg" alt="Страница оплаты" height="200"><br>
      <sub>Страница оплаты</sub>
    </td>
  </tr>
</table>

## Связанные проекты и аудит {#related-projects-and-audit}

- [GMPay Edge](/ru/gmpay-edge/) · Платёжный шлюз для Workers или Bun.
- [GMShop Edge](/ru/gmshop-edge/) · Интернет-магазин цифровых товаров.
- [Аудит безопасности EPUSDT, май 2026 г.](https://github.com/VectorBits/audit/blob/main/epusdt-secure-audit-report-2026-05-14.pdf)
