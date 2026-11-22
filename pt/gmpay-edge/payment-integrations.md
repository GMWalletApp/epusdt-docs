---
title: "Pagamentos on-chain, em exchanges e carteiras."
description: "Revise as integrações on-chain, de exchanges e de carteiras no GMPay Edge e verifique quais opções são exibidas no momento do checkout."
titleTemplate: ":title | GMPay Edge"
---

# Integrações de pagamento {#payment-integrations}

O GMPay Edge inclui adaptadores para blockchain, exchanges e carteiras. A exposição de transações é controlada separadamente através dos métodos de recebimento configurados.

Um método deve ter a configuração de acesso público ou de conta somente leitura necessária e passar pelas verificações de disponibilidade antes de ser oferecido a um pagador.

| Tipo | Integração | Ativos integrados |
| --- | --- | --- |
| No blockchain. | TRON / TRC20 | USDT, TRX |
| No blockchain. | Ethereum / ERC20 | USDT, USDC, ETH |
| No blockchain. | Base | USDT, USDC, ETH |
| No blockchain. | BNB Smart Chain / BEP20 | USDT, USDC, BNB |
| No blockchain. | Polígono | USDT, USDC, MATIC |
| No blockchain. | TON | USDT, GRAM |
| No blockchain. | Aptos | USDT, USDC |
| No blockchain. | Solana | USDT, USDC |
| Corretora | Binance | USDT, USDC |
| Corretora | OKX | USDT, USDC |
| Carteira | OKPay | USDT, TRX |

As integrações embutidas significam que a funcionalidade já está presente no projeto. No entanto, o uso em produção ainda exige pontos de extremidade (endpoints) e credenciais de somente leitura pertencentes ao responsável pelo deploy, juntamente com métodos de recebimento configurados, backups, monitoramento e testes de aceitação na plataforma real.
