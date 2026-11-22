---
description: "Ejecuta la versión Linux de EPUSDT utilizando tu propio gestor de servicios y configura su directorio de trabajo y la configuración de la puerta de enlace."
---

# Instalación manual en Linux {#manual-linux-installation}

Utilice este procedimiento para ejecutar el binario liberado bajo su propio gestor de servicios. Para una instalación gestionada de systemd, siga la [guía de epctl](/es/guide/installation/epctl).

## Prepara el directorio de la aplicación. {#prepare-the-application-directory}

Descargue el archivo de Linux para su arquitectura desde [Releases](https://github.com/GMWalletApp/epusdt/releases). Extraiga el archivo en un directorio de aplicación privado, como `/opt/epusdt`. Configure una cuenta de servicio dedicada con acceso de escritura a los directorios de configuración y SQLite. Mantenha estos directorios fuera de la raíz web pública.

## Configurar y probar {#configure-and-test}

Al instalarlo, copie la copia de ejemplo incluida, y luego edite la copia. Conserve un archivo `.env` existente durante las actualizaciones.

```sh
cd /opt/epusdt
chmod +x epusdt
cp -n .env.example .env
```

Para un servicio configurado detrás de un proxy HTTPS, configure las siguientes entradas en `.env` y utilice su dominio público. El primer inicio crea las tablas SQLite.

```dotenv
app_uri=https://pay.example.com
http_listen=127.0.0.1:8000
runtime_root_path=./runtime
sqlite_database_filename=epusdt.db
install=false
```

Ejecuta `./epusdt http start` en el directorio de la aplicación. Desde otra terminal, verifica `curl -fsS http://127.0.0.1:8000/payments/gmpay/v1/config`. Detén el proceso en primer plano antes de iniciar el servicio gestionado.

## Mantener el servicio en funcionamiento. {#keep-the-service-running}

Para el Supervisor, utilice la siguiente definición de programa y reemplace `epusdt` en el campo de usuario con la cuenta de servicio que haya preparado. Ejecute `supervisorctl reread`, seguido de `supervisorctl update`.

```ini
[program:epusdt]
directory=/opt/epusdt
command=/opt/epusdt/epusdt http start
user=epusdt
autostart=true
autorestart=true
redirect_stderr=true
```

Dirige tu host virtual HTTPS a `http://127.0.0.1:8000`. Para Nginx, utiliza esta ubicación dentro del bloque de servidor TLS. Reinicia el servicio después de modificar su configuración. Realiza una copia de seguridad de las configuraciones y los directorios de datos antes de actualizar.

```nginx
location / {
    proxy_pass http://127.0.0.1:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```
