---
operation: "open-checkout"
method: "GET"
route: "/pay/checkout-counter/{trade_id}"
description: "Откройте платёжный URL в браузере. EPUSDT перенаправит покупателя на /cashier/{trade_id} с кодом HTTP 301."
---

# Открыть платёжную страницу {#open-hosted-checkout}

<ApiRoute />

<a class="api-example-jump" href="#request-example">Пример запроса ↓</a>

Откройте платёжный URL в браузере. EPUSDT перенаправит покупателя на `/cashier/{trade_id}` с кодом HTTP 301.

## Параметры {#parameters}

`trade_id` · `string` · PATH

Идентификатор транзакции EPUSDT, полученный при создании заказа.

## Связанные материалы {#related-resources}

- [Получить сведения о платеже](./checkout-details)
- [Уведомления для продавца](../payment#callbacks)
