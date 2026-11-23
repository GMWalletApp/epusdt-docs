---
description: "Создайте заказ GMPay, проверьте его статус оплаты и убедитесь в правильности обратных вызовов EPUSDT. Включает параметры запроса от продавца, правила подписи и примеры."
title: "API для обработки платежей от торговцев, подписи и уведомления"
---

# API продавца {#merchant-api}

Используйте публичный endpoint для конфигурации, чтобы узнать доступные варианты оплаты, создать заказ на вашем сервере и перенаправить покупателя по возвращенной ссылке для оформления заказа. Проверьте подписанное уведомление перед выполнением заказа. [Пример заказа на Python](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/sdk/python/gmpay_create_order.py) · [Спецификация OpenAPI](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/src/docs/swagger.json)

[Подпись запроса](#signing) · [Создание заказа GMPay](#create) · [Проверка статуса](#status) · [Уведомления для продавца](#callbacks)

## Методы API {#endpoints}

| Назначение | Метод | Путь | Аутентификация |
| --- | --- | --- | --- |
| [Создать заказ GMPay](/ru/api/endpoints/create-order) | POST | `/payments/gmpay/v1/order/create-transaction` | Подпись продавца HMAC-SHA256 |
| [Получить настройки оплаты](/ru/api/endpoints/config) | GET | `/payments/gmpay/v1/config` | Без авторизации |
| [Открыть платёжную страницу](/ru/api/endpoints/open-checkout) | GET | `/pay/checkout-counter/{trade_id}` | Без авторизации |
| [Получить сведения о платеже](/ru/api/endpoints/checkout-details) | GET | `/pay/checkout-counter-resp/{trade_id}` | Без авторизации |
| [Проверить статус заказа](/ru/api/endpoints/order-status) | GET | `/pay/check-status/{trade_id}` | Без авторизации |
| [Выбрать сеть или платёжный сервис](/ru/api/endpoints/switch-network) | POST | `/pay/switch-network` | Без авторизации |
| [Отправить хеш транзакции](/ru/api/endpoints/submit-hash) | POST | `/pay/submit-tx-hash/{trade_id}` | Без авторизации |
| [Вернуться на сайт продавца](/ru/api/endpoints/checkout-return) | GET | `/pay/return/{trade_id}` | Перенаправление браузера |
| [Создать заказ EPay](/ru/api/endpoints/epay-order) | GET или POST | `/payments/epay/v1/order/create-transaction/submit.php` | Подпись продавца MD5 |
| [Принять уведомление OKPay](/ru/api/endpoints/okpay-notify) | POST | `/payments/okpay/v1/notify` | Подпись OKPay |

## Формат ответа {#response-format}

JSON-эндпоинты возвращают `status_code` (200 при успехе), `message`, `data` (объект или null), а также `request_id`, сгенерированный сервером. Неверные подписи возвращают HTTP 401. Ошибки в бизнесе обычно возвращают HTTP 400 с кодом ошибки приложения.

```json
{
  "status_code": 200,
  "message": "success",
  "data": {},
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

<a id="signing"></a>

## Подпись запроса {#sign-a-request}

Используйте торговый ключ, связанный с идентификатором запроса (`pid`). Новая установка инициализирует торгового пользователя с PID `1000`. Сохраняйте секрет на сервере торгового пользователя.

**GMPay** использует HMAC-SHA256. Исключите `signature`, пустые строки и значения null. Отсортируйте имена остальных полей по возрастанию в порядке ASCII с учётом регистра. Соедините неэкранированные пары `key=value` через `&`, вычислите HMAC с ключом `secret_key` и запишите результат в виде 64 шестнадцатеричных символов в нижнем регистре. Включите `pid` и непустой `payment_type`. При передаче в JSON сервер прочитает число `100.00` как `100`. Отправка в формате формы сохраняет исходное строковое представление.

Примеры полей, стандартная строка и подпись, используя демонстрационный ключ `epusdt_secret_key`:

```text
pid=1000
order_id=ORD202605230001
currency=cny
token=usdt
network=tron
amount=100
notify_url=https://merchant.example/notify
redirect_url=https://merchant.example/return
name=VIP
```

```text
amount=100&currency=cny&name=VIP&network=tron&notify_url=https://merchant.example/notify&order_id=ORD202605230001&pid=1000&redirect_url=https://merchant.example/return&token=usdt
```

```text
signature=6f874b1919d95081835e2809b620e354a5866f5a6dbb2e432d1627f1eb10059d
```

### Примеры на PHP {#php-examples}

GMPay:

```php
function gmpaySign(array $params, string $secretKey): string
{
    unset($params['signature']);
    ksort($params, SORT_STRING);

    $pairs = [];
    foreach ($params as $key => $value) {
        if ($value === '' || $value === null) {
            continue;
        }
        $pairs[] = $key . '=' . $value;
    }

    return hash_hmac('sha256', implode('&', $pairs), $secretKey);
}
```

В EPay исключите поля `sign` и `sign_type`, добавьте секрет продавца в конец канонической строки и вычислите MD5.

```php
function epaySign(array $params, string $secretKey): string
{
    unset($params['sign'], $params['sign_type']);
    ksort($params, SORT_STRING);

    $pairs = [];
    foreach ($params as $key => $value) {
        if ($value === '' || $value === null) {
            continue;
        }
        $pairs[] = $key . '=' . $value;
    }

    return strtolower(md5(implode('&', $pairs) . $secretKey));
}
```

<a id="create"></a>

## Создать заказ GMPay {#create-a-gmpay-order}

`POST /payments/gmpay/v1/order/create-transaction` принимает JSON и `application/x-www-form-urlencoded`.

```json
{
  "pid": "1000",
  "order_id": "ORD202605230001",
  "currency": "cny",
  "token": "usdt",
  "network": "tron",
  "amount": 100,
  "notify_url": "https://merchant.example/notify",
  "redirect_url": "https://merchant.example/return",
  "name": "VIP",
  "signature": "6f874b1919d95081835e2809b620e354a5866f5a6dbb2e432d1627f1eb10059d"
}
```

<!-- #region create-fields -->

| Поле | Тип | Обязательный | Описание |
| --- | --- | --- | --- |
| `pid` | string | Да | Merchant PID ранее использовался для поиска ключа подписи. |
| `order_id` | string | Да | Уникальный идентификатор заказа торговца, до 32 символов. |
| `currency` | string | Да | Валюта, например, `usd` или `cny`. |
| `token` | string | При определённых условиях | Получение актива. Сопоставьте с сетью или исключите оба варианта. |
| `network` | string | При определённых условиях | ID сети из публичной конфигурации, например, `binance`. |
| `amount` | number | Да | Сумма фиата, превышающая 0,01. |
| `notify_url` | string | Да | URL для асинхронного вызова результата. |
| `redirect_url` | string | Нет | URL для возврата покупателя. |
| `name` | string | Нет | Название товара или заказа. |
| `payment_type` | string | Нет | По умолчанию используется GMPay. Значение EPay без учёта регистра выбирает формат уведомлений EPay и требует числовой PID. Любое непустое значение включайте в подпись. |
| `signature` | string | Да | HMAC-SHA256 подпись, 64 символа в нижнем регистре. |

<!-- #endregion create-fields -->

Передайте оба параметра `token` и `network`, чтобы сразу назначить адрес. Если не передавать оба параметра, создается заполнитель (статус 4), содержащий сумму и валюту фиатных средств. Передача только одного параметра недопустима. Проверьте `data.supported_assets` в публичной конфигурации перед выбором пары.

### Ответ {#response}

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "trade_id": "20260523171652123456001",
    "order_id": "ORD202605230001",
    "amount": 100,
    "currency": "CNY",
    "actual_amount": 14.29,
    "receive_address": "TTestTronAddress001",
    "token": "USDT",
    "status": 1,
    "expiration_time": 1779530812,
    "payment_url": "https://pay.example.com/pay/checkout-counter/20260523171652123456001"
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

| Поле | Тип | Описание |
| --- | --- | --- |
| `trade_id` | string | Идентификатор транзакции EPUSDT. |
| `order_id` | string | Идентификатор заказа у продавца. |
| `amount` | number | Сумма в фиатной валюте из запроса. |
| `currency` | string | Фиатная валюта. |
| `actual_amount` | number | Сумма к оплате в криптовалюте. |
| `receive_address` | string | Адрес получателя. |
| `token` | string | Обозначение актива. |
| `status` | integer | Состояние заказа. Значение 4 означает "ожидание выбора". |
| `expiration_time` | integer | Срок действия в виде Unix-времени в секундах. |
| `payment_url` | string | URL для открытия в браузере. |

Плейсхолдер не имеет адреса или токена и `actual_amount` равный нулю. Завершение срока действия или ручное закрытие переводит его в статус 3, не освобождая резервирование платежа. Выбор способа оплаты определяет адрес или URL для оплаты.

## Настройка для публичного кассового обслуживания {#public-checkout-configuration}

`GET /payments/gmpay/v1/config` возвращает информацию о брендинге оформления платежей, доступные активы, настройки по умолчанию для EPay, а также публичные настройки провайдеров `okpay` и `xlayer`. Каждый элемент в списке `supported_assets` требует наличия активной цепочки, доступного адреса для получения, и настроенного токена для оплаты. Методы, размещенные на платформе, имеют собственные флаги `enabled` и список `allow_tokens`.

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "supported_assets": [
      {
        "network": "tron",
        "display_name": "TRON",
        "tokens": ["TRX", "USDT"]
      },
      {
        "network": "solana",
        "display_name": "Solana",
        "tokens": ["SOL", "USDC", "USDT"]
      }
    ],
    "site": {
      "cashier_name": "Acme Cashier",
      "logo_url": "https://cdn.example.com/logo.png",
      "website_title": "Acme Payments",
      "support_link": "https://example.com/support",
      "background_color": "#0f172a",
      "background_image_url": "https://cdn.example.com/background.png",
      "withdrawal_reminder_enabled": true
    },
    "epay": {
      "default_token": "",
      "default_currency": "cny",
      "default_network": ""
    },
    "okpay": {
      "enabled": false,
      "allow_tokens": ["USDT", "TRX"]
    },
    "xlayer": {
      "enabled": false,
      "allow_tokens": ["USDC", "USDT0", "USDG"]
    },
    "version": "v2.1.0"
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

### Напоминание об снятии средств {#exchange-withdrawal-reminder}

После загрузки конфигурации, отображать напоминание только в том случае, если `site.withdrawal_reminder_enabled` установлено значение "true", на блокчейне ожидается оплата, доступен адрес для получения, и `actual_amount > 0`. Для старых версий, при отсутствии флага, считать его равным "true". Отображать ожидаемую **сумму полученных средств** после уплаты комиссий, используя ту же точность и тип токена, что и у заказа. [Обычный просмотр](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/wiki/img/withdrawal-reminder-light.png) · [Темный просмотр](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/wiki/img/withdrawal-reminder-dark.png)

Администраторы читают `GET /admin/api/v1/settings?group=brand`. Сохранное значение `brand.withdrawal_reminder_enabled` – это строка `"true"` или `"false"`. Чтобы изменить его, отправьте следующий аутентифицированный запрос `PUT /admin/api/v1/settings`. Проверьте флаг `ok` в возвращенном элементе и перезапустите процесс оформления заказа.

```json
{"items":[{"group":"brand","key":"brand.withdrawal_reminder_enabled","type":"bool","value":false}]}
```

## Откройте корзину и просмотрите заказ. {#open-checkout-and-read-the-order}

`payment_url`, возвращаемая при создании, указывает на `GET /pay/checkout-counter/{trade_id}`. Открытие этой ссылки в браузере приводит к 301 перенаправлению на:

```text
/cashier/{trade_id}
```

Для отображения сведений запросите `GET /pay/checkout-counter-resp/{trade_id}`. Поля `created_at` и `expiration_time` в этом ответе указаны в **миллисекундах**. Последующие изменения проверяйте через метод статуса.

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "trade_id": "20260523171652123456001",
    "amount": 100,
    "actual_amount": 14.29,
    "token": "USDT",
    "currency": "CNY",
    "receive_address": "TTestTronAddress001",
    "network": "tron",
    "status": 1,
    "payment_type": "gmpay",
    "expiration_time": 1779530812000,
    "redirect_url": "https://merchant.example/return",
    "payment_url": "",
    "created_at": 1779530212000,
    "is_selected": false
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

Для использования в качестве заполнителя возвращается тот же родительский ID с пустыми значениями в блокчейне. Как GMPay, так и EPay могут создавать такое состояние.

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "trade_id": "20260523171652123456001",
    "amount": 100,
    "actual_amount": 0,
    "token": "",
    "currency": "CNY",
    "receive_address": "",
    "network": "",
    "status": 4,
    "payment_type": "gmpay",
    "expiration_time": 1779530812000,
    "redirect_url": "https://merchant.example/return",
    "payment_url": "",
    "created_at": 1779530212000,
    "is_selected": false
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

Касса возвращает `payment_type` в нижнем регистре (`gmpay` или `epay`); это значение определяет формат уведомления продавца. Для OKX OnchainOS в X Layer открывайте платёжный URL из ответа сервера. Перед зачислением EPUSDT проверяет, что провайдер завершил расчёт по заказу.

<a id="status"></a>

## Проверка статуса {#poll-status}

`GET /pay/check-status/{trade_id}`

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "trade_id": "20260523171652123456001",
    "status": 1
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

<!-- #region order-states -->

| Статус | Описание |
| --- | --- |
| 1 | Ожидает оплаты |
| 2 | Оплачен |
| 3 | Истёк срок оплаты |
| 4 | Ожидаем выбора сети, активов или поставщика. |
| 5 | Наблюдается успешный перевод, который подтверждается. |
| 6 | Две этапы строгой проверки не увенчались успехом. Требуется ручной пересмотр. |

<!-- #endregion order-states -->

При статусе 5 продолжайте опрос и покажите «Подтверждается», чтобы покупатель знал, что перевод обнаружен. По умолчанию EPUSDT ждёт нужной глубины подтверждений и проверяет транзакцию через два независимых узла перед зачислением. Ожидание подтверждений не расходует попытку. Число попыток и первоначальные идентификаторы узлов сохраняются при перезапуске. При статусе 6 автоматическая проверка и уведомления об успехе приостанавливаются. Администратор может изучить `review_transaction_hash` и после выяснения причин повторить проверку.

Для предоставленного покупателем хеша транзакции, отправьте `block_transaction_id` по адресу `POST /pay/submit-tx-hash/{trade_id}`. Сервер проверяет передачу.  Маршрут возврата для браузера, `GET /pay/return/{trade_id}`, отправляет HTTP 302 перенаправление.

## Сгенерируйте хэш транзакции кассира. {#submit-cashier-transaction-hash}

`POST /pay/submit-tx-hash/{trade_id}`

Этот эндпоинт позволяет хост-кассиру отправлять хэш транзакции для ручной проверки. Он намеренно более узкий, чем действие "маркировано и оплачено" для администраторов.

- Заказ должен быть заказом внутри блокчейна.
- Заказ должен оставаться с статусом `status=1`, в ожидании оплаты.
- Завершенные заказы отклоняются до проведения полной проверки.
- Заказы через OkPay/провайдеры не поддерживаются.

### Запрос хэша транзакции {#submit-transaction-hash-request}

```json
{
  "block_transaction_id": "0xabc123..."
}
```

### Успешный ответ о подтверждении транзакции {#submit-transaction-hash-success-response}

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "trade_id": "20260523171652123456001",
    "block_transaction_id": "0xabc123...",
    "status": 2
  },
  "request_id": "b1344d70-ff19-4543-b601-37abfb3b3686"
}
```

Для TON допустимы канонический формат `ton:<receive_raw>:<lt>:<hash>`, запись `lt:hash` или один хеш, однозначно указывающий на недавнюю транзакцию по адресу получения заказа. Для Aptos передаётся хеш транзакции.

## Переключите платежную сеть или провайдера {#switch-payment-network-or-provider}

Метод `POST /pay/switch-network` принимает `trade_id` родительского заказа, целевые `token` и `network`. Для внешней платёжной страницы выберите `okpay` или `xlayer` и токен, который поддерживает этот сервис.

```json
{
  "trade_id": "20260523171652123456001",
  "token": "USDT",
  "network": "solana"
}
```

```json
{
  "trade_id": "20260523171652123456001",
  "token": "USDT",
  "network": "okpay"
}
```

- Только ожидающий заказ у родителя (статус 1 или 4) может быть переключен. Ребенок не может переключиться снова.
- Первый выбор способа оплаты завершает настройку того же родительского заказа и переводит его в статус 1. Для оплаты в блокчейне назначаются адрес и сумма. Для внешней оплаты возвращается URL провайдера. У OKPay поле адреса получателя содержит `OKPAY`.
- Заполненный заполнитель изначально сохраняет `is_selected=false`. Повторный выбор того же целевого объекта возвращает существующий порядок и помечает его как выбранный. Переход к другому целевому объекту может создавать не более одного дочернего элемента для каждого родительского.
- Ответ имеет структуру checkout-detail. Заказы, размещенные в блокчейне, имеют пустой `payment_url`.

## Оплата через EPay {#epay-compatible-checkout}

Отправьте запрос GET или форму POST по адресу `/payments/epay/v1/order/create-transaction/submit.php`. Успешный ответ возвращает HTTP 302:

```text
/pay/checkout-counter/{trade_id}
```

<!-- #region epay-fields -->

| Поле | Расположение | Тип | Обязательный | Описание |
| --- | --- | --- | --- | --- |
| `pid` | Строка запроса или форма | string | Да | ID торгующего. Используйте числовой PID для обратных вызовов. |
| `money` | Строка запроса или форма | number | Да | Сумма в фиатной валюте. |
| `out_trade_no` | Строка запроса или форма | string | Да | Идентификатор заказа у продавца. |
| `notify_url` | Строка запроса или форма | string | Да | URL для уведомлений продавца. |
| `return_url` | Строка запроса или форма | string | Нет | URL для возврата покупателя. |
| `name` | Строка запроса или форма | string | Нет | Название товара или заказа. |
| `type` | Строка запроса или форма | string | Нет | Пустое значение, `alipay`, или включенный селектор `token.network`. |
| `token` | Строка запроса или форма | string | Нет | Запрошен токен, когда не было найдено ни одного соответствующего селектора. |
| `network` | Строка запроса или форма | string | Нет | Запрошен сетевой ресурс, когда не было найдено соответствующего селектора. |
| `currency` | Строка запроса или форма | string | Нет | Переопределяет стандартный курс валюты EPay. |
| `sign` | Строка запроса или форма | string | Да | Подпись EPay по алгоритму MD5. |
| `sign_type` | Строка запроса или форма | string | Нет | Обычно `MD5`. |

<!-- #endregion epay-fields -->

Включите в расчёт MD5 все непустые входящие параметры, в том числе поля плагинов вроде `sitename`, кроме `sign` и `sign_type`. Ниже приведены каноническая строка с демонстрационным секретом и полученная подпись.

```text
money=100&name=VIP&notify_url=https://merchant.example/notify&out_trade_no=ORD202605230001&pid=1000&return_url=https://merchant.example/return&type=alipayepusdt_secret_key
```

```text
sign=b865b0acbb2b01554c35a1bd33351452
```

**Выбор актива.** Если в `type` передан поддерживаемый селектор `token.network`, он имеет приоритет над отдельными полями токена и сети и их настройками по умолчанию. Неизвестное непустое значение, например `usdt-tron`, приводит к ошибке `10009`. При пустом значении или `alipay` каждое пропущенное поле заполняется соответствующим значением EPay по умолчанию. Если оба поля остались пустыми, сервер создаёт предварительный заказ. Если отсутствует только одно, запрос отклоняется. Для валюты по порядку используются значение запроса, значение из настроек и `cny`.

При новой установке задаётся `cny`, а токен и сеть по умолчанию остаются пустыми. При обновлении настройки сохраняются. Сервер устанавливает `payment_type=Epay` после проверки подписи. Включайте в подпись все фактически передаваемые `type`, `token`, `network` и `currency`.

<a id="callbacks"></a>

## Уведомления для продавца {#merchant-callbacks}

После успешной оплаты EPUSDT отправляет уведомление на `notify_url` заказа. Проверьте подпись, заказ и сумму. Повторные уведомления обрабатывайте идемпотентно. Для подтверждения верните HTTP 200 с телом `ok` или `success` без учёта регистра. При сбое доставки повторные попытки выполняются согласно `order_notice_max_retry` и `callback_retry_base_seconds`; интервал увеличивается экспоненциально до пяти минут.

### GMPay {#gmpay}

GMPay отправляет JSON методом POST. Найдите локальный ключ продавца по `pid` и проверьте HMAC, используя ту же канонизацию, что и при создании заказа. В теле отсутствует `payment_type`.

```json
{
  "pid": "1000",
  "trade_id": "20260523171652123456001",
  "order_id": "ORD202605230001",
  "amount": 100,
  "actual_amount": 14.29,
  "receive_address": "TTestTronAddress001",
  "token": "USDT",
  "block_transaction_id": "0xabc123...",
  "signature": "498975a97bc34563bdb14df53fc18054645df9684d6c67d9b9dd90ec62be1018",
  "status": 2
}
```

| Поле | Тип | Описание |
| --- | --- | --- |
| `pid` | string | Идентификатор ключа подписи продавца. |
| `trade_id` | string | Идентификатор транзакции EPUSDT. |
| `order_id` | string | Идентификатор заказа у продавца. |
| `amount` | number | Сумма в фиатной валюте. |
| `actual_amount` | number | Полученная сумма в криптовалюте. |
| `receive_address` | string | Адрес получателя. |
| `token` | string | Полученный актив. |
| `block_transaction_id` | string | Ссылка на хэш или поставщика вне блокчейна. |
| `signature` | string | Строго говоря, HMAC-SHA256. |
| `status` | integer | Оплачен (2). |

### EPay {#epay}

EPay отправляет GET-запрос с числовым `pid`. Используйте числовой PID продавца для заказов EPay и для заказов GMPay с `payment_type=Epay`. Уведомление содержит сохранённый в заказе `type`; по умолчанию используется `alipay`. Проверяйте подпись MD5 так же, как для входящего заказа EPay.

```text
pid=1000
trade_no=20260523171652123456001
out_trade_no=ORD202605230001
type=alipay
name=VIP
money=100.0000
trade_status=TRADE_SUCCESS
sign=cc44fab3f264615d859f8a1fd36d2f08
sign_type=MD5
```

## Уведомление платёжного сервиса OKPay {#okpay-provider-callback}

Настройте в OKPay `POST /payments/okpay/v1/notify`. Метод принимает JSON, URL-кодированную форму, multipart-форму или тело в виде строки запроса. EPUSDT проверяет подпись провайдера с помощью токена магазина, завершает расчёт по заказу и отправляет уведомление продавцу. Это относится и к заполненному предварительному заказу, и к дочернему заказу с внешней платёжной страницей.

Успешный ответ.

```text
success
```

Ошибка (HTTP 400)

```text
fail
```

## Коды ошибок приложения {#application-error-codes}

| Код | HTTP | Описание |
| --- | --- | --- |
| `200` | 200 | Успех |
| `400` | 400 | Системная ошибка или ошибка проверки данных |
| `401` | 401 | Недействительная подпись |
| `10001` | 400 | Адрес кошелька уже существует |
| `10002` | 400 | Заказ уже существует |
| `10003` | 400 | Нет доступного адреса получателя |
| `10004` | 400 | Сумма меньше минимального шага платежа |
| `10005` | 400 | Нет доступной комбинации адреса и суммы |
| `10006` | 400 | Не удалось рассчитать курс |
| `10007` | 400 | Блок уже обработан |
| `10008` | 400 | Заказ не найден |
| `10009` | 400 | Недопустимые параметры |
| `10010` | 400 | Состояние заказа изменилось |
| `10011` | 400 | Достигнут лимит дочерних заказов |
| `10012` | 400 | В дочернем заказе нельзя изменить сеть |
| `10013` | 400 | Заказ не находится в ожидании оплаты |
| `10014` | 400 | Сеть отключена |
| `10016` | 400 | Актив не найден |
| `10017` | 400 | Платёжный сервис отключён |
| `10018` | 400 | Настройки платёжного сервиса неполны |
| `10019` | 400 | Платёжный сервис не поддерживает этот токен или сеть |
| `10038` | 400 | Не удалось проверить хеш транзакции |
| `10039` | 400 | Ручная проверка доступна только для ончейн-заказа |
| `10041` | 400 | Недопустимый URL уведомления |
| `10042` | 400 | Не удалось создать заказ в платёжном сервисе |
| `10044` | 400 | Недопустимый URL перенаправления |
| `10045` | 400 | Ключ продавца для этого заказа недоступен |
| `10046` | 400 | Не удалось подписать параметры возврата EPay |

[Полный список ошибок приложения](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/src/util/constant/errno.go)

Для информации о списках и порядке приоритета для метода EPay, смотрите [руководство по интеграции EPay](/ru/guide/integration/epay).
