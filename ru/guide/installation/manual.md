---
description: "Запустите выпуск EPUSDT Linux под своим управляющим сервисом и настройте его рабочий каталог и параметры шлюза."
---

# Установка в Linux вручную {#manual-linux-installation}

Используйте эту процедуру для запуска выпущенного бинарного файла под вашим собственным менеджером сервисов. Для системыd, установленной с помощью epctl, следуйте [руководству epctl](/ru/guide/installation/epctl).

## Подготовьте директорию для приложения. {#prepare-the-application-directory}

Загрузите архив Linux для своей архитектуры из [раздела релизов](https://github.com/GMWalletApp/epusdt/releases). Распакуйте его в закрытый каталог приложения, например `/opt/epusdt`. Создайте служебную учётную запись с правом записи в каталоги настроек и SQLite. Храните их вне публичного корневого каталога сайта.

## Настройка и проверка {#configure-and-test}

При установке создайте копию предоставленного примера, а затем отредактируйте её. Сохраняйте существующий файл `.env` при обновлениях.

```sh
cd /opt/epusdt
chmod +x epusdt
cp -n .env.example .env
```

Для сервиса, настроенного за HTTPS-прокси, установите следующие записи в `.env` и используйте свой публичный домен. Первая загрузка создает таблицы SQLite.

```dotenv
app_uri=https://pay.example.com
http_listen=127.0.0.1:8000
runtime_root_path=./runtime
sqlite_database_filename=epusdt.db
install=false
```

Запустите `./epusdt http start` в каталоге приложения. Из другой оболочки проверьте `curl -fsS http://127.0.0.1:8000/payments/gmpay/v1/config`. Остановите текущий процесс перед запуском управляемого сервиса.

## Постоянный запуск службы {#keep-the-service-running}

Для супервизора, используйте следующее определение программы и замените `epusdt` в поле пользователя на учетную запись сервиса, которую вы подготовили. Затем выполните `supervisorctl reread`, а затем `supervisorctl update`.

```ini
[program:epusdt]
directory=/opt/epusdt
command=/opt/epusdt/epusdt http start
user=epusdt
autostart=true
autorestart=true
redirect_stderr=true
```

Направьте ваш HTTPS виртуальный хост на `http://127.0.0.1:8000`. Для Nginx, используйте этот блок конфигурации TLS. Перезапустите службу после редактирования конфигурации. Сделайте резервную копию конфигурационных и директорий данных перед обновлением.

```nginx
location / {
    proxy_pass http://127.0.0.1:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```
