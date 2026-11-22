---
description: "Определите устаревшие API-концы для EPUSDT и текущие маршруты API, которые их заменяют."
---

# Переход на новый API {#api-migration}

Прежний маршрут `POST /api/v1/order/create-transaction` **не зарегистрирован** в текущем исходном коде.

Прежний маршрут совместимости `POST /payments/epusdt/v1/order/create-transaction` также **не зарегистрирован**.

## Действующие маршруты для замены старой интеграции {#replace-old-integrations-with-one-of-these-live-routes}

| Сценарий | Действующий маршрут |
| --- | --- |
| Нативный JSON API (рекомендуется) | [`POST /payments/gmpay/v1/order/create-transaction`](/ru/api/endpoints/create-order) |
| Перенаправление в формате EPay | [`GET/POST /payments/epay/v1/order/create-transaction/submit.php`](/ru/api/endpoints/epay-order) |

## Основные изменения при переходе {#important-migration-changes}

1. **Каждый входящий запрос на создание заказа должен содержать идентификатор продавца `pid`.**
2. **Для проверки подписи используется `secret_key` соответствующей записи в `api_keys`.** Прежний общий ключ маршрута больше не применяется.
3. **Доступные сети и токены задаёт администратор.** Запрашивайте `/payments/gmpay/v1/config` и читайте `data.supported_assets`, поскольку список может меняться.
4. **Значения EPay по умолчанию** теперь берутся из настроек администратора (`epay.default_token`, `epay.default_currency`, `epay.default_network`). Прежние переменные окружения `epay_pid` и `epay_key` для этого больше не используются.
