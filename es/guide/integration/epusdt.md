---
description: "Trasladar la integración actual de un comerciante EPUSDT de las rutas de pedidos inactivas a GMPay o a un flujo de redirección compatible con EPay."
---

# Migración desde versiones anteriores {#legacy-migration}

La fuente actual ya no muestra la ruta original del orden de Epusdt.

## Rutas eliminadas {#removed-routes}

- `POST /api/v1/order/create-transaction`
- `POST /payments/epusdt/v1/order/create-transaction`

## ¿Qué se puede usar en su lugar? {#what-to-use-instead}

### Si usted controla el código del cliente. {#if-you-control-the-client-code}

Utiliza **GMPay**:

```text
POST /payments/gmpay/v1/order/create-transaction
```

### Si el sistema previo solo admite flujos de EPay en estilo de redirección. {#if-the-upstream-system-only-supports-redirect-style-epay-flows}

Compatible con EPay:

```text
GET /payments/epay/v1/order/create-transaction/submit.php
POST /payments/epay/v1/order/create-transaction/submit.php
```

## Lista de comprobación para la migración {#migration-checklist}

- Reemplace la URL de destino anterior.
- Añadir `pid` a todas las solicitudes entrantes.
- Vuelve a firmar las solicitudes con la `secret_key` del registro del comercio
- Deja de depender de la documentación antigua que mencionaba `/payments/epusdt/v1/...`
- Si necesita una interfaz de usuario dinámica para cadenas/tokens, obtenga `/payments/gmpay/v1/config` y lea `data.supported_assets`.
