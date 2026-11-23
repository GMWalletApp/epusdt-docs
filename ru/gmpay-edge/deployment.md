---
title: "Разверните шлюз на Workers или Bun."
description: "Разверните GMPay Edge на Cloudflare Workers или на хосте Bun. Сравните настройки выполнения, требования к хранению и проверки при развертывании."
titleTemplate: ":title | GMPay Edge"
---

# Развёртывание {#deployment}

GMPay Edge поддерживает два режима выполнения:

- **Собственное размещение Bun/Nitro**: SQLite и постоянный локальный каталог данных. Можно развернуть сервис через Docker или запустить его из исходного кода под управлением менеджера служб.
- **Cloudflare Workers**: D1, KV, R2, Queues и Cron Triggers.

Обе среды предоставляют одинаковые API продавца, платёжную страницу, панель администратора, фоновые задачи и мастер установки `/install`.

## Docker Compose (рекомендуется) {#docker-compose-recommended}

Публичный [пакет в GHCR](https://github.com/orgs/GMWalletApp/packages/container/package/gmpay-edge) поддерживает `linux/amd64` и `linux/arm64`. Вход в реестр не требуется.

Сохраните следующее в файле `compose.yml`:

```yaml
services:
  gmpay-edge:
    image: ghcr.io/gmwalletapp/gmpay-edge:latest
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      GMPAY_DATA_DIR: /var/lib/gmpay
    volumes:
      - gmpay-data:/var/lib/gmpay

volumes:
  gmpay-data:
```

Запустите сервис:

```bash
docker compose pull
docker compose up -d
```

Тег `latest` отслеживает самую последнюю стабильную версию. Укажите полную версию, например, `1.0.0`, для воспроизводимой развертывания.

`GMPAY_DATA_DIR` содержит SQLite, загруженные файлы, приватные объекты, состояние очереди и все остальные данные, необходимые для работы. Необходимо сохранять и делать резервную копию тома `gmpay-data` при обновлении или пересоздании контейнера.

Перед резервным копированием, восстановлением или переносом развёрнутого сервиса прочтите раздел [Управление данными в Bun](./node-data-operations.md).

Проверьте работу сервиса и изучите логи с помощью:

```bash
curl --fail http://127.0.0.1:3000/healthz
docker compose ps
docker compose logs --follow gmpay-edge
```

Обновлять, сохраняя объем данных:

```bash
docker compose pull
docker compose up -d
```

### Команда Docker {#docker-command}

Если Compose недоступен, запустите контейнер напрямую:

```bash
docker volume create gmpay-data
docker run --detach --name gmpay-edge --restart unless-stopped \
  --publish 3000:3000 \
  --env GMPAY_DATA_DIR=/var/lib/gmpay \
  --volume gmpay-data:/var/lib/gmpay \
  ghcr.io/gmwalletapp/gmpay-edge:latest
```

## Запуск из исходного кода через Bun {#bun-source-deployment}

Вы можете запускать сервер разработки напрямую из исходного кода, без использования Docker. Установите Git и Bun 1.3 или более позднюю версию; Node.js потребуется только в том случае, если вы используете PM2 в качестве менеджера процессов.

```bash
git clone https://github.com/GMWalletApp/gmpay-edge.git
cd gmpay-edge
bun install --frozen-lockfile
bun run build:bun
sudo install -d -o "$USER" -g "$USER" /var/lib/gmpay
NODE_ENV=production HOST=0.0.0.0 PORT=3000 \
  GMPAY_DATA_DIR=/var/lib/gmpay \
  bun run start:bun
```

Последняя команда выполняется в фоновом режиме. Необходимо поддерживать её с помощью systemd, Supervisor, PM2 или любого другого менеджера сервисов в производственной среде. Обязательно сохраните и сделайте резервную копию каталога `GMPAY_DATA_DIR`, как и для Docker-тома.

### PM2 {#pm2}

PM2 сам требует Node.js и npm, но GMPay Edge продолжает работать с Bun. Необходимо использовать явную опцию `--interpreter bun`, чтобы PM2 не пытался запускать сгенерированный сервер с помощью Node.js.

```bash
npm install --global pm2
NODE_ENV=production HOST=0.0.0.0 PORT=3000 \
  GMPAY_DATA_DIR=/var/lib/gmpay \
  pm2 start .output/server/index.mjs \
    --name gmpay-edge --interpreter bun
pm2 save
pm2 startup
```

Выполните команду, которую выведет `pm2 startup`, затем снова выполните `pm2 save`. Проверьте работу сервиса с помощью `pm2 logs gmpay-edge` и `curl --fail http://127.0.0.1:3000/healthz`.

Обновить исходное развертывание:

```bash
pm2 stop gmpay-edge
git pull --ff-only
bun install --frozen-lockfile
bun run build:bun
pm2 restart gmpay-edge --update-env
```

## Cloudflare Workers {#cloudflare-workers}

### Кнопка развёртывания {#deploy-button}

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/GMWalletApp/gmpay-edge)

Пошаговая установка создаёт привязки из `wrangler.jsonc`, применяет миграции D1 и собирает Worker. Используйте следующую команду.

- Команда сборки: `bun run build`
- Команда развертывания: `wrangler deploy`

После развертывания, откройте `/install` в URL Работника, чтобы инициализировать экземпляр.

### Wrangler CLI {#wrangler-cli}

```bash
bun install
bunx wrangler login
bun run deploy
```

Если D1 необходимо готовить вручную:

```bash
bunx wrangler d1 create gmpay-edge
bun run db:migrate:remote
```

Не сохраняйте сгенерированный идентификатор базы данных.  Инструмент развертывания создает или переиспользует ресурсы D1, KV, R2 и Queue, применяет базовую конфигурацию D1 и создает Worker перед публикацией.

## Локальная разработка {#local-development}

Требования

- Bun 1.3 или новее
- Локальная среда, поддерживаемая Wrangler для разработчиков.

```bash
bun install
bun run dev
```

`bun run dev` применяет ожидающие миграции к локальной базе данных `gmpay-edge` (D1) и запускает приложение по адресу `http://localhost:3000`.

## Первая установка {#first-install}

После запуска Docker или Bun, откройте `http://your-host:3000/install`. После развертывания Workers, откройте `/install` по адресу Worker. Подтвердите обнаруженный публичный адрес и разрешенные хосты перед созданием первого корневого пользователя.

При установке создаются:

- Первая учётная запись.
- Защищённая роль `root`.
- Секреты среды выполнения.
- Настройки оплаты по умолчанию.
- Публичные команды Telegram и настройки по умолчанию Telegram.

Приложение не создает Telegram-бота или не вызывает Telegram. Настройки безопасности и электронной почты управляются в администраческом интерфейсе, а не через переменные среды контейнера.
