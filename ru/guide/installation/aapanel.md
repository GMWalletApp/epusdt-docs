---
description: "Настройте домен для оплаты EPUSDT в aaPanel, настройте HTTPS и подключите обратный прокси к процессу шлюза."
---

# Установка через aaPanel {#install-using-aapanel}

## Создание сайта {#create-the-site}

Создайте статический сайт для платёжного домена и настройте DNS и HTTPS. EPUSDT запускается отдельным процессом с SQLite. Храните исполняемый файл, конфигурацию и базы данных вне публичного каталога сайта.

![Добавление домена оплаты](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/wiki/img/add_web.png)

## Настройка процесса {#configure-the-process}

1. Установите менеджер Supervisor в aaPanel. Загрузите и распакуйте релиз для своей архитектуры. По [руководству по ручной установке](/ru/guide/installation/manual) подготовьте служебную учётную запись, каталоги с правом записи и `.env`.
2. Установите `app_uri` в ваш HTTPS URL для оформления заказов и `http_listen=127.0.0.1:8000`. В Supervisor укажите рабочий каталог в директорию установки и команду, соответствующую полному пути к исполняемому файлу, за которой следует `http start`. Активируйте автоматический запуск и перезапуск.
3. Проверьте статус процесса и журналы в Supervisor.

![Настройки процесса Supervisor](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/wiki/img/supervisor.png)

## Добавьте обратный прокси и проверьте. {#add-the-reverse-proxy-and-verify}

В настройках сайта добавьте обратный прокси на `http://127.0.0.1:8000`. Откройте `https://YOUR-DOMAIN/payments/gmpay/v1/config` и проверьте `status_code: 200`. Добавьте адрес получателя, чтобы включённые активы появились на странице оплаты. После изменения настроек перезапустите EPUSDT в Supervisor.

![Настройки обратного прокси](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/wiki/img/fanxiang.png)
