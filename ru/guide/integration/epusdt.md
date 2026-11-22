---
description: "Переместите существующую интеграцию торгового аккаунта EPUSDT из устаревших маршрутов ордеров в GMPay или в поток перенаправления, совместимый с EPay."
---

# Переход с прежних версий {#legacy-migration}

Текущий источник больше не отображает старый маршрут Epusdt.

## Удалённые маршруты {#removed-routes}

- `POST /api/v1/order/create-transaction`
- `POST /payments/epusdt/v1/order/create-transaction`

## Чем заменить {#what-to-use-instead}

### Если вы можете изменить код клиента {#if-you-control-the-client-code}

Для **GMPay**

```text
POST /payments/gmpay/v1/order/create-transaction
```

### Если внешняя система поддерживает только перенаправление EPay {#if-the-upstream-system-only-supports-redirect-style-epay-flows}

Для **совместимого с EPay режима**

```text
GET /payments/epay/v1/order/create-transaction/submit.php
POST /payments/epay/v1/order/create-transaction/submit.php
```

## Проверка при миграции {#migration-checklist}

- Замените URL прежнего метода API.
- Добавьте `pid` во все входящие запросы.
- Заново подписывайте запросы с помощью `secret_key` из записи продавца.
- Не используйте устаревшие инструкции с путём `/payments/epusdt/v1/...`.
- Если вам нужен динамический интерфейс для цепочки/токенов, используйте `/payments/gmpay/v1/config` и прочитайте `data.supported_assets`.
