---
operation: switch-network
method: POST
route: "/pay/switch-network"
description: "Envie o trade_id do pedido principal, token e network no corpo JSON. O status deve ser 1 ou 4. Use o endereço ou a URL retornada."
---

# Selecionar rede ou provedor

<ApiRoute />

<a class="api-example-jump" href="#request-example">Exemplo de requisição ↓</a>

Envie o `trade_id` do pedido principal, `token` e `network` no corpo JSON. O status deve ser 1 ou 4. Use o endereço ou a URL retornada.

## Corpo JSON

| Campo obrigatório | Tipo | Exemplo |
| --- | --- | --- |
| `trade_id` | string | `20260523171652123456001` |
| `token` | string | `USDT` |
| `network` | string | `tron` |

## Recursos relacionados

- [Consultar configuração](./config)
- [Notificações ao lojista](../payment#callbacks)
