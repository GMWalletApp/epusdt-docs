---
operation: create-order
method: POST
route: "/payments/gmpay/v1/order/create-transaction"
description: "Assine a solicitação no servidor e direcione o comprador a payment_url. Envie token e network juntos ou omita ambos para permitir a escolha no checkout."
---

# Criar um pedido GMPay

<span class="api-route"><b>POST</b> <code>/payments/gmpay/v1/order/create-transaction</code></span>

<a class="api-example-jump" href="#request-example">Exemplo de requisição ↓</a>

Assine a solicitação no servidor e direcione o comprador a `payment_url`. Envie `token` e `network` juntos ou omita ambos para permitir a escolha no checkout.

## Parâmetros

<!--@include: ../payment.md#create-fields-->

A assinatura do exemplo usa a chave de demonstração `epusdt_secret_key`. Recalcule-a no servidor se alterar os parâmetros ou a chave.

## Recursos relacionados

- [Abrir o checkout](./open-checkout)
- [Assinaturas](../payment#signing)
