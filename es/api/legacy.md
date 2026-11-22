---
description: "Consulta los endpoints retirados de EPUSDT y las rutas actuales de la API para comercios que los sustituyen."
---

# Migración de la API {#api-migration}

La fuente actual **no registra** la ruta antigua `POST /api/v1/order/create-transaction`.

También **no registra** la antigua ruta de compatibilidad `POST /payments/epusdt/v1/order/create-transaction`.

## Reemplace las integraciones antiguas con una de estas rutas en vivo. {#replace-old-integrations-with-one-of-these-live-routes}

| Caso de uso | Ruta vigente |
| --- | --- |
| API JSON nativa (recomendada) | `POST /payments/gmpay/v1/order/create-transaction` |
| Redirección / Flujo al estilo de EPay | `GET/POST /payments/epay/v1/order/create-transaction/submit.php` |

## Cambios migratorios importantes {#important-migration-changes}

1. Cada solicitud de pedido entrante debe identificar al comerciante con `pid`.
2. **La firma se verifica con la `secret_key` del registro correspondiente de `api_keys`.** La antigua clave global específica de la ruta ya no se utiliza.
3. Las redes/tokens soportados son determinados por la administración, por lo que consulte `/payments/gmpay/v1/config` y lea `data.supported_assets` en lugar de asumir una lista fija.
4. Las configuraciones predeterminadas de EPay ahora provienen de la configuración del administrador (`epay.default_token`, `epay.default_currency`, `epay.default_network`), y no de las claves de entorno obsoletas como `epay_pid` / `epay_key`.
