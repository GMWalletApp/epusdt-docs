---
description: "Как установить EPUSDT через Docker Compose, задать публичный URL для оплаты и сохранить данные шлюза и ChainScanner между перезапусками контейнеров."
title: "Установка платёжного шлюза через Docker Compose"
---

# Установка через Docker Compose {#install-with-docker-compose}

Используйте [файл Compose](https://github.com/GMWalletApp/epusdt/blob/v2.1.1/docker-compose.yaml) той версии, которую устанавливаете. Сервис по умолчанию включает ChainScanner.

Для новой установки сначала скачайте файлы нужной версии.

```sh
git clone --depth 1 --branch v2.1.1 https://github.com/GMWalletApp/epusdt.git
cd epusdt
```

## Запуск шлюза {#start-the-gateway}

В корне репозитория задайте публичный URL для оплаты в окружении Compose, например в файле `.env` проекта. Скрипт запуска читает его при каждом старте.

```dotenv
APP_URI=https://pay.example.com
EPUSDT_PORT=8000
```

```sh
docker compose up -d epusdt
docker compose logs --tail=100 epusdt
curl -fsS http://127.0.0.1:8000/payments/gmpay/v1/config
```

Направьте HTTPS-запросы с обратного прокси на опубликованный порт. Настройте адрес получателя, затем проверьте поле `data.supported_assets` в ответе.

## Хранение данных и обновление {#storage-and-upgrades}

Compose монтирует `./runtime/epusdt` в `/app/runtime`. Здесь находятся `.env` приложения, базы рабочих и служебных данных, а также база встроенного сканера. Файл окружения проекта Compose и файл настроек приложения хранятся отдельно.

При обновлении с v2.0.0 остановите прежний сервис и создайте резервную копию настроек и баз данных. Скопируйте их в новый каталог монтирования **до пересоздания контейнера**. Сохраните исходные копии и проверьте имена файлов баз в конфигурации. [Примечания к выпуску](https://github.com/GMWalletApp/epusdt/releases/tag/v2.1.0)

Начиная с v2.1.1 шлюз работает только с SQLite. Сохраните резервные копии настроек, рабочих и служебных баз, а также данных сканера. Если прежняя установка использует MySQL или PostgreSQL, перенесите и проверьте данные до переключения. Изменение одного лишь `db_type` не переносит заказы.

## Использование отдельного сканера {#using-a-standalone-scanner}

Установите `CHAINSCANNER_URL=http://chainscanner:9081` и задайте разные токены для потребителя и администратора. При обновлении отдельного сканера сохраните прежний том (`./runtime/chainscanner`), URL и учётные данные.

```sh
docker compose --profile scanner up -d
```
