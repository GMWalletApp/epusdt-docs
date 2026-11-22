---
description: "Configure un dominio de pago EPUSDT en aaPanel, habilite HTTPS y conecte el proxy inverso al proceso de gateway."
---

# Instalación con aaPanel {#install-using-aapanel}

## Crear el sitio. {#create-the-site}

Cree un sitio estático para su dominio de pago y configure DNS y HTTPS. EPUSDT se ejecuta como un proceso separado con SQLite. Manten los archivos binarios, la configuración y las bases de datos fuera del directorio público del sitio.

![Añadir el dominio de la página de pago](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/wiki/img/add_web.png)

## Configurar el proceso {#configure-the-process}

1. Instala el gestor Supervisor en aaPanel. Descarga y extrae la versión correspondiente a tu arquitectura. Sigue la [guía de instalación](/es/guide/installation/manual) para preparar la cuenta de servicio, los directorios accesibles y el archivo `.env`.
2. Establece `app_uri` a tu URL de checkout HTTPS y `http_listen=127.0.0.1:8000`. En Supervisor, establece el directorio de trabajo a tu directorio de instalación y el comando al camino completo del binario, seguido de `http start`. Habilita el inicio y reinicio automático.
3. Verifique el estado del proceso y los registros en Supervisor.

![Configuración del proceso en Supervisor](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/wiki/img/supervisor.png)

## Agrega el proxy inverso y verifica. {#add-the-reverse-proxy-and-verify}

En la configuración del sitio, añade un proxy inverso que apunte a `http://127.0.0.1:8000`. Abre `https://YOUR-DOMAIN/payments/gmpay/v1/config` y comprueba que la respuesta incluya `status_code: 200`. Añade una dirección de recepción para ofrecer los activos habilitados en la página de pago. Tras cambiar la configuración, reinicia EPUSDT desde Supervisor.

![Configuración del proxy inverso](https://github.com/GMWalletApp/epusdt/blob/78ac7cc97637bf5f35bcf7d717d7def7d9aa6232/wiki/img/fanxiang.png)
