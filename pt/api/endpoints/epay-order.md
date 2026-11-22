---
operation: epay-order
method: GET/POST
route: "/payments/epay/v1/order/create-transaction/submit.php"
description: "Envie os parâmetros assinados na consulta GET ou em um formulário POST. Após verificar a assinatura MD5 e criar o pedido, o gateway redireciona com HTTP 302."
---

# Criar um pedido EPay

<span class="api-route"><b>GET/POST</b> <code>/payments/epay/v1/order/create-transaction/submit.php</code></span>

<a class="api-example-jump" href="#request-example">Exemplo de requisição ↓</a>

Envie os parâmetros assinados na consulta GET ou em um formulário POST. Após verificar a assinatura MD5 e criar o pedido, o gateway redireciona com HTTP 302.

## Parâmetros

<!--@include: ../payment.md#epay-fields-->

A assinatura do exemplo usa a chave de demonstração `epusdt_secret_key`. Recalcule-a no servidor se alterar os parâmetros ou a chave.

## Recursos relacionados

- [Voltar à loja](./checkout-return)
- [Assinaturas](../payment#signing)
