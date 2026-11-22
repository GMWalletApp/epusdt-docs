---
description: "Mova a integração existente do comerciante EPUSDT de rotas de pedidos desativadas para o GMPay ou para um fluxo de redirecionamento compatível com o EPay."
---

# Migração de versões anteriores {#legacy-migration}

A fonte atual não expõe mais a rota antiga do Epusdt.

## Rotas removidas {#removed-routes}

- `POST /api/v1/order/create-transaction`
- `POST /payments/epusdt/v1/order/create-transaction`

## O que usar em vez disso {#what-to-use-instead}

### Se você tem controle sobre o código do cliente. {#if-you-control-the-client-code}

Use **GMPay**:

```text
POST /payments/gmpay/v1/order/create-transaction
```

### Se o sistema anterior apenas suporta fluxos EPay no estilo de redirecionamento. {#if-the-upstream-system-only-supports-redirect-style-epay-flows}

Compatível com EPay:

```text
GET /payments/epay/v1/order/create-transaction/submit.php
POST /payments/epay/v1/order/create-transaction/submit.php
```

## Lista de verificação da migração {#migration-checklist}

- Substitua a URL antiga.
- Adicione o `pid` a todos os requests de entrada.
- Assine novamente as requisições com a `secret_key` do registro do lojista
- Pare de confiar em documentos antigos que mencionam `/payments/epusdt/v1/...`
- Se precisar de uma interface de usuário dinâmica para cadeias/tokens, acesse `/payments/gmpay/v1/config` e leia a seção `data.supported_assets`.
