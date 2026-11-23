---
operation: "create-order"
method: "POST"
route: "/payments/gmpay/v1/order/create-transaction"
description: "Подпишите запрос на своём сервере и направьте покупателя на payment_url. Передавайте token и network вместе или опустите оба параметра, чтобы покупатель сам выбрал их при оплате."
---

# Создать заказ GMPay {#create-a-gmpay-order}

<ApiRoute />

<a class="api-example-jump" href="#request-example">Пример запроса ↓</a>

Подпишите запрос на своём сервере и направьте покупателя на `payment_url`. Передавайте `token` и `network` вместе или опустите оба параметра, чтобы покупатель сам выбрал их при оплате.

## Параметры {#parameters}

<!--@include: ../payment.md#create-fields-->

В примере подпись рассчитана с демонстрационным ключом `epusdt_secret_key`. При изменении полей или ключа продавца пересчитайте подпись на своём сервере.

## Связанные материалы {#related-resources}

- [Открыть платёжную страницу](./open-checkout)
- [Подписи](../payment#signing)
