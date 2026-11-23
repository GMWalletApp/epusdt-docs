---
operation: "okpay-notify"
method: "POST"
route: "/payments/okpay/v1/notify"
description: "Укажите этот URL в OKPay. Провайдер отправляет подписанные данные, а EPUSDT проверяет подпись с помощью token магазина. Ответ возвращается обычным текстом: success (200) или fail (400)."
---

# Принять уведомление OKPay {#receive-an-okpay-notification}

<ApiRoute />

<a class="api-example-jump" href="#request-example">Пример запроса ↓</a>

Укажите этот URL в OKPay. Провайдер отправляет подписанные данные, а EPUSDT проверяет подпись с помощью `token` магазина. Ответ возвращается обычным текстом: success (200) или fail (400).

## Связанные материалы {#related-resources}

- [Выбрать сеть или платёжный сервис](./switch-network)
- [Уведомления для продавца](../payment#callbacks)
