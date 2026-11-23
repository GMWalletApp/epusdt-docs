---
operation: "epay-order"
method: "GET/POST"
route: "/payments/epay/v1/order/create-transaction/submit.php"
description: "Передайте подписанные параметры в строке GET-запроса или в теле POST-запроса в формате формы. Если подпись MD5 верна, шлюз перенаправит покупателя на страницу оплаты с кодом HTTP 302."
---

# Создать заказ EPay {#create-an-epay-order}

<ApiRoute />

<a class="api-example-jump" href="#request-example">Пример запроса ↓</a>

Передайте подписанные параметры в строке GET-запроса или в теле POST-запроса в формате формы. Если подпись MD5 верна, шлюз перенаправит покупателя на страницу оплаты с кодом HTTP 302.

## Параметры {#parameters}

<!--@include: ../payment.md#epay-fields-->

В примере подпись рассчитана с демонстрационным ключом `epusdt_secret_key`. При изменении полей или ключа продавца пересчитайте подпись на своём сервере.

## Связанные материалы {#related-resources}

- [Вернуться на сайт продавца](./checkout-return)
- [Подписи](../payment#signing)
