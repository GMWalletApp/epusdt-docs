---
description: "Instalar EPUSDT con Docker Compose, configurar la URL de acceso público, y mantener los datos de la puerta de enlace y ChainScanner de forma persistente durante los reinicios del contenedor."
title: "Instala el gateway de pagos utilizando Docker Compose."
---

# Instalación con Docker Compose {#install-with-docker-compose}

Utilice el archivo [Compose](https://github.com/GMWalletApp/epusdt/blob/v2.1.1/docker-compose.yaml) que viene con la versión que está instalando. El servicio predeterminado incluye ChainScanner.

Para una instalación nueva, obtén los archivos de lanzamiento primero.

```sh
git clone --depth 1 --branch v2.1.1 https://github.com/GMWalletApp/epusdt.git
cd epusdt
```

## Iniciar la pasarela de pagos {#start-the-gateway}

Desde la raíz del repositorio, configure la URL de acceso público en el entorno de Compose (por ejemplo, un archivo `.env` a nivel de proyecto). El punto de entrada la utiliza en cada inicio.

```dotenv
APP_URI=https://pay.example.com
EPUSDT_PORT=8000
```

```sh
docker compose up -d epusdt
docker compose logs --tail=100 epusdt
curl -fsS http://127.0.0.1:8000/payments/gmpay/v1/config
```

Dirige tu proxy inverso HTTPS hacia el puerto mapeado. Configura una dirección de recepción, y luego verifica `data.supported_assets` en la respuesta.

## Almacenamiento y actualizaciones {#storage-and-upgrades}

Crea los contenedores `./runtime/epusdt` en `/app/runtime`. Este directorio contiene el archivo `.env` de la aplicación, las bases de datos de negocio y de ejecución, y la base de datos del escáner integrado. El entorno de Compose a nivel de proyecto y la configuración de la aplicación son archivos separados.

Al actualizar desde v2.0.0, detén el servicio anterior, crea una copia de seguridad de su configuración y sus bases de datos y cópialas al nuevo volumen **antes de volver a crear el contenedor anterior**. Conserva las copias originales y comprueba los nombres de los archivos de bases de datos configurados. [Notas de la versión](https://github.com/GMWalletApp/epusdt/releases/tag/v2.1.0)

A partir de la versión 2.1.1, el gateway utiliza únicamente SQLite. Realice una copia de seguridad de las bases de datos de configuración, negocio y ejecución, así como de los datos del escáner. Si tiene una instalación anterior de MySQL o PostgreSQL, migre y verifique los datos antes de cambiar. Cambiar el valor de `db_type` por sí solo no migra los pedidos.

## Uso de un escáner independiente {#using-a-standalone-scanner}

Establece `CHAINSCANNER_URL=http://chainscanner:9081` y proporciona tokens de consumidor y administrador distintos. Conserva el volumen actual del escáner (`./runtime/chainscanner`), la URL y las credenciales al actualizar una implementación autónoma.

```sh
docker compose --profile scanner up -d
```
