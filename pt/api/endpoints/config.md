---
operation: config
method: GET
route: "/payments/gmpay/v1/config"
description: "Consulte supported_assets para obter as redes e os tokens disponíveis. Não exige parâmetros nem assinatura do lojista."
---

# Consultar configuração

<ApiRoute />

<a class="api-example-jump" href="#request-example">Exemplo de requisição ↓</a>

Consulte `supported_assets` para obter as redes e os tokens disponíveis. Não exige parâmetros nem assinatura do lojista.

Nas versões compatíveis, consulte o símbolo em `token_details` para obter o identificador completo e as casas decimais. Versões anteriores retornam apenas `tokens`. [Catálogo de contratos](../../guide/intro#networks)

## Recursos relacionados

- [Criar um pedido GMPay](./create-order)
- [Notificações ao lojista](../payment#callbacks)
