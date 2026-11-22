---
description: "Utiliza epctl para instalar una versión binaria de EPUSDT ya publicada en Linux, verifica la versión y administra el servicio."
---

# Instalación y verificación con epctl {#epctl-installation-and-verification-scripts}

`epctl` es el instalador y gestor de servicios binarios de nivel raíz para Linux, destinado a las binarios de `epusdt` ya liberados en las publicaciones de GitHub.
`epctl-docker-test.sh` es el script de validación end-to-end correspondiente.  Lanza Ubuntu + systemd dentro de Docker y verifica el comportamiento de descarga, instalación, inicio, actualización y la gestión de contraseñas de inicio con artefactos reales.

Para una instalación nueva, obtén los archivos de lanzamiento primero.

```sh
git clone --depth 1 --branch v2.1.1 https://github.com/GMWalletApp/epusdt.git
cd epusdt
```

## Alcance {#scope}

- Linux solamente
- Instalación binaria únicamente.
- La fuente de publicación está fijada a `https://github.com/GMWalletApp/epusdt/releases`
- La gestión de servicios se basa en systemd.

## Dependencias y privilegios {#dependencies-and-privileges}

`epctl` requiere los siguientes comandos:

- `curl`
- `tar`
- `systemctl`
- `install`
- `grep`
- `sed`

Notas:

- Los comandos `install`, `upgrade` y `self-install` escriben en `/opt`, `/etc/systemd` y `/usr/local/bin`.
- `status` y `logs` se ejecutan automáticamente de nuevo a través de `sudo` cuando sea necesario.
- En la práctica, el operador debe tener acceso `sudo`.

## Rutas fijas {#fixed-paths}

| Ítem | Ruta |
|------|------|
| Directorio de instalación | `/opt/epusdt` |
| Código binario principal | `/opt/epusdt/epusdt` |
| Escaneo binario | `/opt/epusdt/chainscanner` |
| Configuración activa | `/opt/epusdt/.env` |
| Configuración del escáner. | `/opt/epusdt/chainscanner.json` |
| Configuración de ejemplo | `/opt/epusdt/.env.example` |
| Activos de la interfaz de usuario extraídos | `/opt/epusdt/www` |
| Descargar caché | `/tmp/epusdt/<tag>/` |
| Unidad de systemd | `/etc/systemd/system/epusdt.service`, `/etc/systemd/system/chainscanner.service` |
| Global epctl path | `/usr/local/bin/epctl` |

## Inicio rápido {#quick-start}

Ejecuta el menú interactivo desde la raíz del repositorio:

```bash
./epctl
```

El idioma predeterminado para la interacción es el chino. Puede forzar cualquiera de los dos idiomas:

```bash
./epctl zh
./epctl en
./epctl --lang zh help
./epctl --lang en help
```

Instala el script en la variable PATH:

```bash
./epctl self-install
epctl
```

## Comandos comunes {#common-commands}

Descargar una versión específica.

```bash
./epctl download --tag v2.1.0
```

Instale el servicio (por defecto, usa `--component epusdt` con el escáner integrado). Utilice `--component all` para dos servicios separados.

```bash
./epctl install --tag v2.1.0 \
  --app-uri https://pay.example.com \
  --listen 127.0.0.1:18000
```

Implemente `chainscanner` de forma independiente (genera automáticamente tokens o acepta tokens e imprime los credenciales de conexión):

```bash
./epctl install --component chainscanner \
  --scanner-listen 0.0.0.0:9081
```

Implementar `epusdt` de forma independiente (conectándose a un `chainscanner` remoto).

```bash
./epctl install --component epusdt \
  --app-uri https://pay.example.com \
  --listen 127.0.0.1:8000 \
  --scanner-url http://10.0.0.2:9081 \
  --scanner-token <chainscanner_token> \
  --scanner-admin-token <chainscanner_admin_token>
```

Actualice a una versión más reciente (detecta automáticamente los componentes instalados, o especifique `--component all|epusdt|chainscanner`).

```bash
./epctl upgrade --tag v2.1.0
```

Ejecutar `./epctl upgrade --tag ...` reinicia directamente `epusdt` inmediatamente después de que los archivos son reemplazados.
Si deseas reemplazar solo los archivos, usa la opción `--no-restart`.
Si desea una confirmación explícita, use la opción `--prompt-restart`. En una terminal interactiva, el indicador es `[Y/n]`, por lo que al presionar Enter se reinicia por defecto.

Revisar la configuración, el estado y los registros.

```bash
./epctl show-config
./epctl status
./epctl logs --lines 200
```

Solicitar la contraseña de administrador inicial.

```bash
./epctl init-password
```

## Comportamiento cuando se omite la opción `--tag` {#behavior-when-tag-is-omitted}

Para `download`, `install` y `upgrade`, `epctl` determina la etiqueta de la última versión en GitHub, muestra la etiqueta exacta y pide confirmación.

Please provide the English text you would like me to translate. I’m ready when you are.

```bash
./epctl install --app-uri https://pay.example.com
```

En su uso interactivo, el script mostrará la última etiqueta resuelta antes de continuar.
Para la automatización, es preferible pasar la opción `--tag` explícitamente. Si usted desea omitir intencionalmente la confirmación, utilice:

```bash
EPCTL_ASSUME_YES=1 ./epctl download
```

## ¿Qué ocurre durante la primera instalación? {#what-happens-on-first-install}

`install` realiza los siguientes pasos:

1. Detecta la arquitectura del CPU actual y descarga el archivo de lanzamiento de GitHub correspondiente.
2. Extrae los archivos en `/tmp/epusdt/<tag>/extract/`
3. Instala el binario en `/opt/epusdt/epusdt`.
4. Instalar `.env.example` en `/opt/epusdt/.env.example`
5. Crear el usuario y grupo del sistema `epusdt`.
6. Crea automáticamente el archivo `/opt/epusdt/.env` a partir de `.env.example` si no existe.
7. Escribe y habilita el servicio `epusdt.service`.

Cuando el archivo `.env` se crea automáticamente, el script aplica únicamente los cambios mínimos de configuración.

- `install=false`
- `app_uri=<--app-uri, default http://127.0.0.1:8000>`
- `http_listen=<--listen, default 127.0.0.1:8000>`

Si el archivo `/opt/epusdt/.env` ya existe, instálalo y actualízalo, pero mantenlo sin modificar.
`/opt/epusdt/.env.example` se actualiza con la última versión disponible en cada instalación / actualización.

## ¿Qué ocurre durante la actualización? {#what-happens-during-upgrade}

`upgrade` realiza los siguientes pasos:

1. Detecta la arquitectura del CPU actual y descarga el archivo de lanzamiento de GitHub correspondiente.
2. Extrae los archivos en `/tmp/epusdt/<tag>/extract/`
3. Se requiere el archivo existente `/opt/epusdt/.env`. Si no existe, el comando falla y te indica que primero debes ejecutar `install`.
4. Reemplazar `/opt/epusdt/epusdt`
5. Reemplazar `/opt/epusdt/.env.example`
6. Mantener el archivo `/opt/epusdt/.env`
7. Refresca `epusdt.service` y ejecuta `systemctl daemon-reload`.
8. Reinicia `epusdt` inmediatamente de forma predeterminada.

Comportamiento adicional:

- `upgrade` ya no crea `.env` ni ejecuta `systemctl enable`.
- `upgrade --no-restart` solo reemplaza los archivos y muestra una advertencia manual para reiniciar.
- `upgrade --prompt-restart` pregunta si se debe reiniciar cuando esté disponible una terminal interactiva.
- Si el reinicio falla después de una actualización, el script intenta revertir a la versión anterior del archivo binario, `.env.example`, y el archivo de unidad.

## Detalles del servicio de systemd {#systemd-service-details}

El nombre del servicio está fijado en `epusdt.service` y utiliza la siguiente configuración principal:

```ini
WorkingDirectory=/opt/epusdt
ExecStart=/opt/epusdt/epusdt http start
User=epusdt
Group=epusdt
Restart=always
RestartSec=3
```

El directorio de trabajo permanece en `/opt/epusdt` porque el programa extrae sus archivos `www/` junto al ejecutable.

## Qué hace `init-password` {#what-init-password-does}

`epctl init-password` solo utiliza la ruta HTTP local:

```text
GET /admin/api/v1/auth/init-password
```

No accede directamente a la base de datos.

El script lee la variable `http_listen` de `/opt/epusdt/.env` y normaliza estos valores de escucha en un objetivo de solicitud local:

- `:8000` -> `127.0.0.1:8000`
- `0.0.0.0:8000` -> `127.0.0.1:8000`

Si la API devuelve `10040`, la contraseña de texto plano de inicio no está disponible. Las razones comunes son:

- La contraseña de administrador ya ha sido cambiada.
- La contraseña inicial ya ha sido utilizada y no se puede recuperar.

En ese caso, `epctl` muestra el cuerpo de error HTTP original para diagnóstico.

## Script de validación de Docker {#docker-validation-script}

El repositorio también ofrece:

```bash
./epctl-docker-test.sh <install-tag> [upgrade-tag]
```

Ejemplos:

```bash
./epctl-docker-test.sh v2.1.0
./epctl-docker-test.sh --lang en v2.0.0 v2.1.0
```

Realiza estas comprobaciones en la máquina local:

- Comienza directamente desde `ubuntu:24.04` e instala systemd y las dependencias de prueba durante el inicio del contenedor.
- inicia un contenedor privilegiado
- ejecuta `epctl self-install` dentro del contenedor.
- Descargar los artefactos reales de GitHub Release.
- Instala `epusdt`
- Cuando se proporciona `upgrade-tag`, verifica `upgrade --no-restart`, el `upgrade` predeterminado y no interactivo, y ambas ramas `n` / Enter de `upgrade --prompt-restart`.
- Verifica el servicio de systemd, `www/index.html`, la configuración, los registros y el estado.
- Verifica que `init-password` tiene éxito una vez y luego devuelve `10040` después de que se cambie la contraseña de administrador.

Requisitos:

- Docker instalado localmente.
- Permiso para ejecutar Docker.
- Acceso de salida a GitHub Releases

## Recomendaciones {#recommendations}

- Prefiera valores explícitos `--tag`.
- Después de la instalación, ejecute `./epctl show-config` una vez para verificar el `.env` activo.
- Cambie la contraseña de administrador inmediatamente después de obtener la contraseña inicial.
- Si desea validar el instalador en sí, ejecute `./epctl-docker-test.sh` primero.
