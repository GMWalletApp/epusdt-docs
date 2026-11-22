---
operation: "order-status"
method: "GET"
route: "/pay/check-status/{trade_id}"
description: "Периодически запрашивайте статус по trade_id EPUSDT, чтобы обновлять страницу оплаты. Выполняйте заказ только после проверки подписи уведомления для продавца."
---

# Проверить статус заказа {#poll-order-status}

<ApiRoute />

<a class="api-example-jump" href="#request-example">Пример запроса ↓</a>

Периодически запрашивайте статус по `trade_id` EPUSDT, чтобы обновлять страницу оплаты. Выполняйте заказ только после проверки подписи уведомления для продавца.

## Параметры {#parameters}

`trade_id` · `string` · PATH

Идентификатор транзакции EPUSDT, полученный при создании заказа.

## Состояния заказа {#order-states}

<!--@include: ../payment.md#order-states-->

## Связанные материалы {#related-resources}

- [Получить сведения о платеже](./checkout-details)
- [Уведомления для продавца](../payment#callbacks)
