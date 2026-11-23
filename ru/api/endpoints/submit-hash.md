---
operation: "submit-hash"
method: "POST"
route: "/pay/submit-tx-hash/{trade_id}"
description: "Для ончейн-заказа, ожидающего оплаты (статус 1), передайте block_transaction_id в теле JSON. Сервер проверит перевод перед обновлением заказа."
---

# Отправить хеш транзакции {#submit-a-transaction-hash}

<ApiRoute />

<a class="api-example-jump" href="#request-example">Пример запроса ↓</a>

Для ончейн-заказа, ожидающего оплаты (статус 1), передайте `block_transaction_id` в теле JSON. Сервер проверит перевод перед обновлением заказа.

## Параметры {#parameters}

`trade_id` · `string` · PATH

Идентификатор транзакции EPUSDT, полученный при создании заказа.

## Тело JSON {#json-body}

| Обязательное поле | Тип | Пример |
| --- | --- | --- |
| `block_transaction_id` | string | `0x…` |

## Связанные материалы {#related-resources}

- [Проверить статус заказа](./order-status)
- [Уведомления для продавца](../payment#callbacks)
