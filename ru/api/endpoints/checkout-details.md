---
operation: "checkout-details"
method: "GET"
route: "/pay/checkout-counter-resp/{trade_id}"
description: "Получите сумму, адрес получателя и выбранный способ оплаты. Поля created_at и expiration_time содержат время Unix в миллисекундах."
---

# Получить сведения о платеже {#read-checkout-details}

<ApiRoute />

<a class="api-example-jump" href="#request-example">Пример запроса ↓</a>

Получите сумму, адрес получателя и выбранный способ оплаты. Поля `created_at` и `expiration_time` содержат время Unix в миллисекундах.

## Параметры {#parameters}

`trade_id` · `string` · PATH

Идентификатор транзакции EPUSDT, полученный при создании заказа.

## Связанные материалы {#related-resources}

- [Проверить статус заказа](./order-status)
- [Уведомления для продавца](../payment#callbacks)
