---
title: "Разверните магазин на Workers или Bun."
description: "Разверните GMShop Edge на рабочих станциях или в Bun, и настройте хранилище, очереди и фоновые задачи для цифрового магазина."
titleTemplate: ":title | GMShop Edge"
---

# Развёртывание {#deployment}

GMShop Edge поддерживает два режима производства:

- **Собственное размещение Bun/Nitro**: SQLite, закрытые локальные объекты, локальная очередь с сохранением данных и постоянный каталог данных. Сервис можно развернуть через Docker или запустить из исходного кода под управлением менеджера служб.
- **Cloudflare Workers**: D1, KV, R2, Queues, Cron Triggers и, при необходимости, Send Email.

Оба окружения предоставляют доступ к одному и тому же интерфейсу магазина, учетным записям клиентов, процессу оформления заказов, обработке заказов, административной панели, API поставщиков, интеграции с Telegram, и `/install` процедуре.

## Docker Compose {#docker-compose}

Публичный [пакет в GHCR](https://github.com/orgs/GMWalletApp/packages/container/package/gmshop-edge) поддерживает `linux/amd64` и `linux/arm64`. Сохраните следующий файл под именем `compose.yml`.

```yaml
services:
  gmshop-edge:
    image: ghcr.io/gmwalletapp/gmshop-edge:latest
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      GMSHOP_DATA_DIR: /var/lib/gmshop
    volumes:
      - gmshop-data:/var/lib/gmshop

volumes:
  gmshop-data:
```

Начните и проверьте сервис.

```bash
docker compose pull
docker compose up -d
curl --fail http://127.0.0.1:3000/healthz
docker compose ps
docker compose logs --follow gmshop-edge
```

Контейнер запускается от пользователя, отличного от root. `GMSHOP_DATA_DIR` содержит `gmshop.sqlite`, приватные объекты, состояние постоянной очереди и все данные, необходимые для работы. Необходимо сохранять и делать резервную копию тома `gmshop-data` каждый раз, когда контейнер обновляется или пересоздается.

`GMSHOP_DATA_DIR` – это единственная общедоступная переменная среды Bun. Настройте параметры Origin, разрешенных хостов, email, оплаты, поставщиков, Telegram и автоматизации через `/install` или `/admin`.

Bun поддерживает только один экземпляр. Несколько реплик и общее сетевое хранилище не поддерживаются. Перед обновлением, восстановлением или переносом прочтите [руководство по данным Bun](./node-data-operations.md).

## Запуск из исходного кода через Bun {#bun-source-deployment}

Вы можете запускать сервер разработки напрямую из исходного кода, без использования Docker. Установите Git и Bun 1.3 или более позднюю версию; Node.js потребуется только в том случае, если вы используете PM2 в качестве менеджера процессов.

```bash
git clone https://github.com/GMWalletApp/gmshop-edge.git
cd gmshop-edge
bun install --frozen-lockfile
bun run build:bun
sudo install -d -m 0700 -o "$USER" -g "$USER" /var/lib/gmshop
NODE_ENV=production HOST=0.0.0.0 PORT=3000 \
  GMSHOP_DATA_DIR=/var/lib/gmshop \
  bun run start:bun
```

Последняя команда выполняется в фоновом режиме. Необходимо поддерживать её с помощью systemd, Supervisor, PM2 или любого другого менеджера сервисов в производственной среде. Обеспечьте сохранение и резервное копирование каталога `GMSHOP_DATA_DIR`, как и для Docker-тома. Среда выполнения Bun остается одноэкземплярной; развертывание с несколькими репликами и общая сетевая хранилище не поддерживаются.

### PM2 {#pm2}

PM2 сам требует Node.js и npm, но GMShop Edge продолжает работать с Bun. Необходимо сохранять явную опцию `--interpreter bun`, чтобы PM2 не пытался запускать сгенерированный сервер с помощью Node.js.

```bash
npm install --global pm2
NODE_ENV=production HOST=0.0.0.0 PORT=3000 \
  GMSHOP_DATA_DIR=/var/lib/gmshop \
  pm2 start .output/server/index.mjs \
    --name gmshop-edge --interpreter bun
pm2 save
pm2 startup
```

Выполните команду, которую выведет `pm2 startup`, затем снова выполните `pm2 save`. Проверьте работу сервиса с помощью `pm2 logs gmshop-edge` и `curl --fail http://127.0.0.1:3000/healthz`.

Обновить исходное развертывание:

```bash
pm2 stop gmshop-edge
git pull --ff-only
bun install --frozen-lockfile
bun run build:bun
pm2 restart gmshop-edge --update-env
```

## Cloudflare Workers {#cloudflare-workers}

### Кнопка развёртывания {#deploy-button}

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/GMWalletApp/gmshop-edge)

Обученный поток подготавливает проект "Worker". После развертывания, откройте `/install` и проверьте следующие настройки:

- D1 `gmshop-edge` как `DB`.
- KV `gmshop-edge-cache` как `CACHE`.
- Приватный R2 `gmshop-edge-files` как `FILES`.
- Очередь `gmshop-edge-commerce` перенаправляется в очередь `COMMERCE_QUEUE`, а очередь `gmshop-edge-commerce-dlq` используется в качестве очереди для сообщений, которые не удалось обработать.
- Cron за одну минуту, и при выборе – Cloudflare Send Email как `EMAIL`.

### Wrangler CLI {#wrangler-cli}

```bash
bun install
bunx wrangler login
bun run deploy
```

`predeploy` (hook) создает или переиспользует имеющиеся ресурсы, применяет удаленные миграции и создает Worker. Идентификаторы D1/KV, которые были разрешены, добавляются только в `dist/server/wrangler.json`; идентификаторы, специфичные для аккаунта, не записываются в переносимый `wrangler.jsonc`.

## Первая установка {#first-install}

После запуска Docker или Bun, откройте `http://your-host:3000/install`. После развертывания Workers, откройте `/install` по адресу Worker. Подтвердите обнаруженный публичный адрес и разрешенные хосты перед созданием первого корневого администратора.

Установка создает первого корневого администратора, защищенные встроенные роли магазина, секреты выполнения, а также необходимые параметры для торговли, курсов валют, аутентификации и уведомлений. Она не создает искусственные товары, остатки, учетные данные поставщиков или конфигурации платежей.

После установки

1. Проверьте настройки системы, сгенерированные в `/admin`, и сделайте резервную копию конфигурации выполнения.
2. Настройте брендинг, регистрацию, аутентификацию, электронную почту, коммерцию, обработку заказов, удержание клиентов и настройки поставщика.
3. Создайте черновик продукта, включающий продаваемые товары и остаток, файлы или конфигурацию автоматизации; проведите проверки перед публикацией.
4. Настройте адаптер оплаты и завершите заказ на интеграцию с реальным провайдером перед открытием магазина.

Перед началом производства, необходимо проверить точные правила для хостов/происхождения, реальный email для оплаты и восстановления, обработку заказов/загрузок/автоматизации, повторные попытки в очереди и восстановление в "мертвой" очереди, возврат средств, восстановление недействительных прав, восстановление резервных копий, локализацию как для приложений, темы, поведение в мобильном режиме, навигация с помощью клавиатуры и восстановление администратора.
