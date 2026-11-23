---
operation: "config"
method: "GET"
route: "/payments/gmpay/v1/config"
description: "В supported_assets перечислены доступные для оплаты сети и токены. Параметры запроса и подпись продавца не требуются."
---

# Получить настройки оплаты {#read-checkout-configuration}

<ApiRoute />

<a class="api-example-jump" href="#request-example">Пример запроса ↓</a>

В `supported_assets` перечислены доступные для оплаты сети и токены. Параметры запроса и подпись продавца не требуются.

## Связанные материалы {#related-resources}

- [Создать заказ GMPay](./create-order)
- [Уведомления для продавца](../payment#callbacks)
