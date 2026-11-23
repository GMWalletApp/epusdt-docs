---
operation: "switch-network"
method: "POST"
route: "/pay/switch-network"
description: "Передайте trade_id родительского заказа, token и network в теле JSON. Родительский заказ должен ожидать оплаты (статус 1 или 4). В ответе придёт адрес получателя или URL платёжной страницы."
---

# Выбрать сеть или платёжный сервис {#select-a-network-or-provider}

<ApiRoute />

<a class="api-example-jump" href="#request-example">Пример запроса ↓</a>

Передайте `trade_id` родительского заказа, `token` и `network` в теле JSON. Родительский заказ должен ожидать оплаты (статус 1 или 4). В ответе придёт адрес получателя или URL платёжной страницы.

## Тело JSON {#json-body}

| Обязательное поле | Тип | Пример |
| --- | --- | --- |
| `trade_id` | string | `20260523171652123456001` |
| `token` | string | `USDT` |
| `network` | string | `tron` |

## Связанные материалы {#related-resources}

- [Получить настройки оплаты](./config)
- [Уведомления для продавца](../payment#callbacks)
