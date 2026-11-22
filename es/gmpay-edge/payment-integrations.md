---
title: "Pagos en cadena, a través de intercambios y billeteras."
description: "Revise las integraciones on-chain, de intercambio y de billetera en GMPay Edge y observe qué controles determinan qué opciones se muestran al momento de pagar."
titleTemplate: ":title | GMPay Edge"
---

# Integraciones de pago {#payment-integrations}

GMPay Edge incluye adaptadores para la cadena, intercambios y billeteras. La exposición a riesgos se controla por separado mediante los métodos de recepción configurados.

El método debe tener la configuración de conexión pública o de cuenta de solo lectura requerida y superar las pruebas de disponibilidad antes de poder ser ofrecido a un pagador.

| Tipo | Integración | Activos incorporados |
| --- | --- | --- |
| On-chain | TRON / TRC20 | USDT, TRX |
| On-chain | Ethereum / ERC20 | USDT, USDC, ETH |
| On-chain | Base | USDT, USDC, ETH |
| On-chain | BNB Smart Chain / BEP20 | USDT, USDC, BNB |
| On-chain | Polígono | USDT, USDC, MATIC |
| On-chain | TON | USDT, GRAM |
| On-chain | Aptos | USDT, USDC |
| On-chain | Solana | USDT, USDC |
| Plataforma de intercambio | Binance | USDT, USDC |
| Plataforma de intercambio | OKX | USDT, USDC |
| Cartera | OKPay | USDT, TRX |

Las integraciones incorporadas significan que la funcionalidad ya existe en el proyecto. Sin embargo, su uso en producción aún requiere puntos finales propiedad del implementador, credenciales de solo lectura, métodos de recepción configurados, copias de seguridad, monitoreo y pruebas de aceptación en la plataforma real.
