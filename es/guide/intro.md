---
description: "Identifique las redes y tokens que EPUSDT admite, configure las direcciones de recepción y siga una orden desde el momento de la compra hasta la notificación de pago firmada."
title: "Redes compatibles, tokens y proceso de pago de comercio."
---

# Introducción {#introduction}

EPUSDT es una puerta de pago auto-alojada. Un comerciante crea un pedido, el comprador realiza el pago al finalizar la compra, y la puerta envía una notificación firmada una vez que el pago ha sido verificado. Los pagos directos en la cadena van a la dirección de recepción del comerciante.

Para desplegar con Codex, Claude Code, Cursor u OpenCode, facilita a tu agente la [guía de despliegue y la lista de comprobación](https://epusdt.com/agent-setup/prompt.md).

## Configure su primer pago. {#set-up-your-first-payment}

1. [Despliega la pasarela](/es/guide/installation/docker) y configura la URL HTTPS pública de la página de pago.
2. En el panel de administración, habilite una red y un activo, y agregue una dirección de recepción. Cree una clave de API para el comerciante y mantenga su `pid` y `secret_key` en su servidor.
3. [Crea un pedido de GMPay](/es/api/payment#create) y dirige al comprador a `payment_url`. Para una integración existente con EPay, usa el [flujo de redirección de EPay](/es/guide/integration/epay).

## Cadenas y tokens compatibles. {#networks}

El proceso de pago ofrece un activo de pago directo cuando su red y activo están habilitados, y se ha configurado una dirección de recepción. Estos son los valores predeterminados en una instalación nueva. Consulte `data.supported_assets` desde `GET /payments/gmpay/v1/config` para las opciones de su gateway.

El guion indica un activo nativo sin contrato. El comprador debe enviar el pago a la dirección del pedido. Los identificadores de la tabla sirven para verificar el activo.

<div class="asset-directory">

| Red (ID en la API) | Token | Contrato / ID del activo | Decimales |
| --- | --- | --- | ---: |
<!--@include: @/.vitepress/data/asset-rows.md-->

</div>

Arc acepta tanto native (tokens nativos) como USDC ERC-20. En Polygon, USDC y USDC.e son activos separados.

### A7A5 (TRC-20 / ERC-20) {#a7a5}

A7A5 está vinculado al rublo ruso. Activa A7A5 por separado en cada red que vayas a utilizar (TRON o Ethereum) y añade una cartera receptora en esa red. Si usas tipos de cambio fijos, añade una cotización `a7a5` por cada moneda de facturación. El valor indica cuántos A7A5 corresponden a una unidad de esa moneda.

En las versiones que incluyen A7A5, usa estos campos para seleccionarlo en un pedido GMPay. Las instalaciones anteriores pueden requerir una actualización.

| GMPay `network` | GMPay `token` | EPay `type` |
| --- | --- | --- |
| `tron` | `A7A5` | `a7a5.tron` |
| `ethereum` | `A7A5` | `a7a5.ethereum` |

[TRONSCAN](https://tronscan.org/#/token20/TLeVfrdym8RoJreJ23dAGyfJDygRtiWKBZ) · [Etherscan](https://etherscan.io/token/0x6fA0BE17e4beA2fCfA22ef89BF8ac9aab0AB0fc9)

### Métodos de pago integrados {#hosted-payment-methods}

OKX OnchainOS en la Capa X admite USDC, USDT y USDG. OKPay admite USDT y TRX de forma predeterminada. Habilite cada proveedor por separado. Consulte sus opciones en `data.xlayer` o `data.okpay`.

## De la transferencia a la ejecución/realización {#from-transfer-to-fulfillment}

ChainScanner opera de forma predeterminada dentro de EPUSDT. Cuando detecta una transferencia coincidente, el pedido se mueve a **5 · Confirmación**. Con la verificación estricta habilitada (que es la configuración predeterminada), se requiere la profundidad de confirmación necesaria y los resultados de coincidencia de dos nodos independientes para **2 · Pagado**. Tras dos rondas fallidas, el pedido se mueve a **6 · Revisión manual**. Solo se completa el pedido después de verificar la llamada de retorno de éxito firmada.

## Capturas de pantalla {#screenshots}

<table>
  <tr>
    <td align="center" valign="top" width="25%">
      <img src="/screenshots/web2.png" alt="Vista general del panel." height="200"><br>
      <sub>Vista general del panel.</sub>
    </td>
    <td align="center" valign="top" width="25%">
      <img src="/screenshots/web1.png" alt="Panel de administración" height="200"><br>
      <sub>Panel de administración</sub>
    </td>
    <td align="center" valign="top" width="25%">
      <img src="/screenshots/pay1.jpeg" alt="Página de pago" height="200"><br>
      <sub>Página de pago</sub>
    </td>
    <td align="center" valign="top" width="25%">
      <img src="/screenshots/pay2.jpeg" alt="Página de pago" height="200"><br>
      <sub>Página de pago</sub>
    </td>
  </tr>
</table>

## Proyectos relacionados y auditoría. {#related-projects-and-audit}

- [GMPay Edge](/es/gmpay-edge/) · Pasarela de pagos para Workers o Bun.
- [GMShop Edge](/es/gmshop-edge/) · Tienda de productos digitales.
- [Auditoría de seguridad de EPUSDT, mayo de 2026](https://github.com/VectorBits/audit/blob/main/epusdt-secure-audit-report-2026-05-14.pdf)
