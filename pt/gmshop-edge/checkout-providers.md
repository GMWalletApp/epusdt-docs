---
description: "Configure os provedores de checkout e pagamento do GMShop Edge, juntamente com as configurações de autenticação e notificação, para a loja virtual."
titleTemplate: ":title | GMShop Edge"
---

# Checkout e provedores {#checkout-and-providers}

O GMShop Edge mantém as etapas de checkout, o estado da carteira, as credenciais do provedor, a configuração de autenticação e a entrega de notificações dentro do ambiente de implantação da loja.

## Pagamentos {#payments}

As quantidades de pedidos da loja utilizam unidades inteiras. As moedas fiduciárias selecionadas pelo cliente são convertidas a partir das taxas de câmbio da loja, e uma cotação imutável é passada para o provedor selecionado.

| Provedor | Página de pagamento | Reembolso | Notas de moeda |
| --- | --- | --- | --- |
| Stripe | Redirecionar | Automático | Controles de configuração do canal aceitam moedas. |
| Cryptomus | Redirecionar | Manual | Utiliza a moeda configurada na fatura. |
| GMpay | Redirecionar | Manual | Utiliza o endpoint compatível com Epusdt configurado. |
| EPay | Redirecionar | Manual | Exige `pid` numérico. O valor padrão de `paymentMethod` é `alipay`. |
| Alipay Page / WAP | Redirecionar | Automático | Exige `CNY` com duas casas decimais |
| WeChat Native | QR ou redirecionar | Automático | Exige `CNY` com duas casas decimais |
| WeChat H5 | Redirecionar | Automático | Requer `CNY` com duas casas decimais e o endereço IP do pagador. |

Os clientes cadastrados também podem efetuar pagamentos a partir do saldo integrado da loja. As operações de reembolso e pós-venda atualizam os registros de pagamento e do saldo através de transições idempotentes.

Um adaptador integrado não garante que um provedor esteja pronto para produção em um determinado ambiente. Configure credenciais de propriedade do provedor e realize testes completos de criação de pedidos, callback/webhook, pagamento, reembolso e reconciliação antes de abrir a loja.

## E-mail {#email}

Emails baseados em modelos suportam SMTP, Resend, Postmark, SendGrid, Mailgun, e a integração opcional com o Cloudflare Send Email `EMAIL`. Os registros de entrega mantêm o estado, enquanto a fila e o trabalho agendado oferecem tentativas limitadas.

## Autenticação {#authentication}

O Better Auth oferece suporte à configuração em tempo de execução para e-mail/senha, provedores de redes sociais, OIDC genérico, OIDC do Telegram e o widget de login do Telegram verificado como fallback. Os Mini Apps do Telegram verificam os `initData` para inscrição/login automático e podem importar um avatar do Telegram ausente. Os usuários do Telegram podem vincular um e-mail verificado independentemente de definir uma senha.

## Bot do Telegram e suporte {#telegram-bot-and-support}

O bot de webhook da grammY sincroniza comandos de loja localizados e botões fixos da Mini App. O recurso opcional mapeia um usuário do Telegram para um tópico do Fórum e encaminha mensagens em ambas as direções, sem armazenar o conteúdo das mensagens. Esse recurso de ligação confia apenas em um espelho administrativo fresco do Telegram e fecha conversas inativas de acordo com a política de manutenção configurada.

Configure o Token do Bot, o segredo OIDC, o grupo de suporte, a sincronização e as configurações de suporte web separadamente em `/admin`; não os inclua no commit.

## Lista de verificação de segurança {#security-checklist}

Utilize validação exata de Hosts Permitidos e Origem, HTTPS, proteção contra CSRF, limites para corpos de requisição, limites de taxa, monitoramento de filas/DLQ, reautenticação com senha fresca para exportações sensíveis, recuperação de administrador e backups testados. Segredos do provedor e de autenticação devem utilizar configuração em tempo de execução criptografada e nunca devem ser commitados.
