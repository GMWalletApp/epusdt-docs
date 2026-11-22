---
description: "Leia as notas de lançamento do EPUSDT e verifique as alterações no banco de dados, na API de implantação e na API de pagamento antes de atualizar um gateway auto-hospedado."
---

# Notas de versão {#release-notes}

## v2.1.1 {#v2-1-1}

2026-11-21 · [Notas de versão](https://github.com/GMWalletApp/epusdt/releases/tag/v2.1.1)

A partir de agora, o EPUSDT utiliza exclusivamente SQLite. Os usuários existentes do SQLite podem manter suas configurações e bancos de dados. Para MySQL ou PostgreSQL, faça backup, migre e verifique os dados antes de atualizar.

## v2.1.0 {#v2-1-0}

2026-11-21 · [Notas de versão](https://github.com/GMWalletApp/epusdt/releases/tag/v2.1.0)

- O ChainScanner embutido retoma a partir do progresso salvo e tenta as partes faltantes. A verificação rigorosa adiciona etapas de confirmação e revisão manual.
- Oitenta novas redes de pagamento direto elevam o total padrão para 16. O checkout também suporta o OKX OnchainOS na Camada X e um lembrete opcional de taxa de saque na corretora.
- Corrige problemas de contenção de bloqueio no SQLite e a liberação de uma ordem expirada, que libera a reserva do valor de uma nova ordem. Usuários que atualizam de v2.0.0 devem migrar seus dados antes de recriar o container.

## v2.0.0 {#v2-0-0}

- Tag da versão: `v2.0.0`
- Data de publicação: `2026-07-23T06:04:47Z`
- Nota de versão oficial: `Breaking change for GMPay integrations: GMPay signatures changed from MD5 to HMAC-SHA256`
- Histórico completo de alterações: `https://github.com/GMWalletApp/epusdt/compare/v1.0.10...v2.0.0`

### Mudanças visíveis para o usuário {#user-visible-changes}

- **Alteração na assinatura do GMPay**: As assinaturas para as solicitações e callbacks do GMPay agora utilizam HMAC-SHA256, com a chave HMAC sendo a `secret_key` do comerciante. Os clientes existentes baseados em MD5 do GMPay receberão um erro `401 Unauthorized` até a atualização.
- As solicitações e callbacks compatíveis com EPay não são afetados e continuam a utilizar MD5 com `sign` / `sign_type`.
- Os dados de inicialização do caixa agora incluem `server_time`, permitindo que os clientes calculem contagens regressivas com base no tempo do servidor, em vez de confiar nos relógios locais do navegador.
- Adicionado um exemplo de criação de pedido GMPay em Python, utilizando apenas bibliotecas padrão, no arquivo `sdk/python/gmpay_create_order.py`.
- A recuperação do preenchimento de pagamentos EVM foi aprimorada, permitindo a recuperação mais confiável de janelas de varredura interrompidas.

### Mudanças na implantação e na configuração {#deployment-and-configuration-changes}

- Atualize os clientes GMPay antes de implantar a v2.0.0. Exclua `signature` e os valores vazios, ordene os parâmetros pelo nome das chaves em ordem ASCII e concatene-os como `key=value&key=value`. Calcule o HMAC-SHA256 com `secret_key` e codifique o resultado em hexadecimal minúsculo.
- As configurações de taxa agora suportam `rate.mode=fixed|auto` e `rate.cache_ttl_seconds` entre `10` e `86400` segundos. O modo fixado utiliza `rate.forced_rate_list`; o modo automático busca `rate.api_url` e armazena um cache durável.
- A função de auto-avaliação de atualização mantém as taxas de moedas bem-sucedidas anteriores quando a resposta do provedor é parcial, e continua a servir o cache durável mais recente quando as atualizações ou a persistência falham.

### Mudanças na API {#api-changes}

- `POST /payments/gmpay/v1/order/create-transaction` passou a verificar a `signature` do GMPay com HMAC-SHA256 em vez de MD5.
- As chamadas de retorno do GMPay devem ser verificadas utilizando a mesma regra de parâmetros canônicos HMAC-SHA256.
- A resposta para `GET /pay/checkout-counter-resp/{trade_id}` agora inclui o `server_time`.
- As APIs de administração adicionam os endpoints `GET /admin/api/v1/settings/rate/status` e `POST /admin/api/v1/settings/rate/refresh` para inspeção e atualização forçada do cache de taxas.

### Fontes consultadas {#evidence-used}

- Versão no GitHub `v2.0.0`
- PR `#104` (fusão de desenvolvimento) e PR `#99` (recuperação do preenchimento do EVM)
- Commits: `44d90b6` (recuperação de preenchimento do EVM), `f086d8b` (checkout `server_time`), `3dc8ab0` (modo de taxa automático com cache de fallback persistente), `58141cd` (assinaturas HMAC-SHA256 para GMPay), `2353d85` (exemplo do SDK GMPay em Python)
- Arquivos: `src/middleware/check_sign.go`, `src/util/sign/sign.go`, `src/model/service/epay_return.go`, `src/model/response/pay_response.go`, `src/config/rate.go`, `src/controller/admin/settings_controller.go`, `src/route/router.go`, `src/task/listen_evm_backfill.go`, `sdk/python/gmpay_create_order.py`


## v1.0.10 {#v1-0-10}

- Tag da versão: `v1.0.10`
- Data de publicação: `2026-07-10T13:24:42Z`
- Nota de versão oficial: `Allow admin to mark expired on-chain orders as paid and seed rates`
- Histórico completo de alterações: `https://github.com/GMWalletApp/epusdt/compare/v1.0.9...v1.0.10`

### Mudanças visíveis para o usuário {#user-visible-changes-1}

- O manual de administração agora pode reparar **pedidos desativados na blockchain** após a verificação do hash da transação submetida. O caminho de submissão de transações da caixa pública ainda aceita apenas pedidos em espera e continua a rejeitar pedidos desativados e pedidos OkPay/provedor.
- Um valor padrão de taxa forçada integrado foi definido para a conversão de stablecoin CNY: tanto `cny.usdt` quanto `cny.usdc` agora exibem o valor padrão de `0.14705882352941177`.
- A lista `rate.forced_rate_list` vazia é restaurada para o valor padrão da stablecoin CNY integrada após as configurações de taxa serem atualizadas ou a configuração ser excluída. Qualquer JSON personalizado não vazio permanece sob a posse do usuário e não é mesclado ou sobrescrito.
- `rate.api_url` agora é opcional; no entanto, quando fornecido, ele ainda deve ser uma URL pública HTTP/HTTPS.

### Mudanças na implantação e na configuração {#deployment-and-configuration-changes-1}

- `epctl upgrade` agora exige um arquivo `/opt/epusdt/.env` existente, portanto, a atualização não cria um novo arquivo de configuração. Execute o comando `install` primeiro em uma máquina nova.
- O comando `epctl upgrade` substitui os arquivos de lançamento e reinicia o `epusdt` por padrão. Utilize a opção `--no-restart` para carregar os arquivos sem reiniciar, ou `--prompt-restart` para solicitar confirmação no terminal interativo.
- A atualização de implantação mantém backups de reversão para o binário atual, `.env.example` e a unidade systemd. Caso a implantação de arquivos ou a reinicialização falhe, o `epctl` tenta restaurar os arquivos da versão anterior.

### Mudanças na API {#api-changes-1}

- Administrador mark-pago aceita pedidos de espera e expirados após a verificação da transação na blockchain.
- `POST /pay/submit-tx-hash/{trade_id}` aceita apenas pedidos on-chain que aguardam pagamento. Pedidos expirados são rejeitados antes da verificação.
- A documentação das configurações de taxa agora trata `rate.api_url` como opcional e documenta o comportamento padrão de restauração para `rate.forced_rate_list`.

### Fontes consultadas {#evidence-used-1}

- Versão no GitHub `v1.0.10`
- PR `#97` (fusão de desenvolvimento)
- Commits: `392240e` (marca de admin: pagamento por ordens expiradas na blockchain), `d18965d` (taxas padrão de seed para stablecoins CNY), `6589ad1` (reinicio e controle de atualização do epctl, com deploy seguro para rollback), `8f03599` / `5668a2a` (sincronização de build do frontend)
- Arquivos: `src/controller/admin/order_controller.go`, `src/controller/comm/pay_controller.go`, `src/model/service/order_service.go`, `src/model/data/settings_data.go`, `src/model/mdb/settings.go`, `src/model/dao/mdb_table_init.go`, `src/controller/admin/settings_controller.go`, `epctl`, `wiki/EPCTL.md`, `wiki/EPCTL.en.md`


## v1.0.9 {#v1-0-9}

- Tag da versão: `v1.0.9`
- Data de publicação: `2026-06-29T10:11:08Z`
- Nota de versão oficial: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.8...v1.0.9`

### Mudanças visíveis para o usuário {#user-visible-changes-2}

- **Seletores EPay**: O EPay submit.php agora aceita `type=alipay` ou um seletor compatível `type=token.network` como `usdt.tron`. Os seletores válidos selecionam o token/rede de pagamento diretamente.
- Os callbacks de retorno e notificação do EPay agora mantêm o `type` armazenado da requisição, em vez de retornar sempre `alipay`.
- O fluxo de instalação pode retornar a senha de administrador inicial durante a configuração inicial, enquanto a API de administrador exposta agora mantém apenas o endpoint para o hash da senha inicial para alertas na interface do usuário.
- Adicionado o executável Linux `epctl` (instalador/gerenciador de serviços) e o script `epctl-docker-test.sh` para validação de ponta a ponta baseada em Docker.

### Mudanças na implantação e na configuração {#deployment-and-configuration-changes-2}

- `epctl` instala os binários liberados em `/opt/epusdt`, cria o arquivo `epusdt.service`, mantém o arquivo existente `/opt/epusdt/.env` durante a instalação/atualização, e pode ser instalado globalmente em `/usr/local/bin/epctl`.
- As variáveis `epay.default_token` e `epay.default_network` são ignoradas quando um seletor válido `type=token.network` é fornecido; no entanto, `epay.default_currency` continua a fornecer a moeda de fallback.
- Não são necessárias novas variáveis de ambiente.

### Mudanças na API {#api-changes-2}

- `GET` / `POST /payments/epay/v1/order/create-transaction/submit.php` agora restringe o valor de `type` a `alipay` ou a um seletor de `token.network` atualmente suportado.
- A resposta de `GET /pay/return/{trade_id}` e as notificações assíncronas do EPay reutilizam o `type` armazenado. Na ausência de `type`, usam `alipay`.
- `GET /admin/api/v1/auth/init-password-hash` permanece o endpoint inicial de senha exposto; a antiga rota de administração `init-password` em texto plano não está registrada nesta versão.

### Fontes consultadas {#evidence-used-2}

- Versão no GitHub `v1.0.9`
- PR `#92` (fusão de desenvolvimento)
- Commits: `2dc538c` (seletores de tipo EPay), `73aef80` (restrição de tipo de envio), `15de0e6` (manter a senha inicial disponível), `7d09adf` (retornar a senha inicial do administrador), `1cdb1ed` (instalador e documentação do epctl)
- Arquivos: `src/route/router.go`, `src/controller/comm/order_controller.go`, `src/model/service/epay_return.go`, `src/install/installer.go`, `epctl`, `epctl-docker-test.sh`, `wiki/EPCTL.md`


## v1.0.8 {#v1-0-8}

- Tag da versão: `v1.0.8`
- Data de publicação: `2026-06-20T06:31:53Z`
- Nota de versão oficial: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.7...v1.0.8`

### Mudanças visíveis para o usuário {#user-visible-changes-3}

- Agora, os ativos blockchain são suportados para pagamentos em USDT e USDC – o sistema inclui configuração de suporte de token, roteamento RPC e varredura de transações na blockchain para ativos baseados em Aptos Move.
- O suporte a tokens e o roteamento RPC agora são controlados pelas configurações da cadeia e das configurações chain_token definidas pelo administrador, eliminando os endereços de contrato codificados na ferramenta de análise.
- A verificação de pagamento manual agora suporta a validação de transações Aptos.
- O arquivo README foi atualizado para listar o Aptos juntamente com outras blockchains suportadas.

### Mudanças na implantação e na configuração {#deployment-and-configuration-changes-3}

- Os aptos chain necessitam de um endpoint RPC configurado no painel de administração – o scanner acompanhará as versões do ledger do Aptos e analisará os eventos do módulo Move para transferências de tokens.
- Não são necessárias novas variáveis de ambiente; a configuração da cadeia e do token do Aptos segue o fluxo de configuração existente da cadeia/token administrativo.

### Mudanças na API {#api-changes-3}

- Aptos agora está disponível como uma opção em cadeia na lista de ativos suportados e nos pontos de extremidade de criação de pedidos.
- Os pontos de extremidade de gerenciamento de cadeia de administração e token agora suportam campos de configuração específicos para Aptos.

### Fontes consultadas {#evidence-used-3}

- Versão no GitHub `v1.0.8`
- PR `#91` (fusão de desenvolvimento)
- Commits: `de96a5d` (Suporte Aptos), `8216c91` (Suporte a tokens baseado em configuração)
- Arquivos: `README.md`, `README.en.md`, `src/controller/admin/chain_token_controller.go`, `src/model/service/aptos_task.go`, `src/task/listen_aptos_scanner.go`, `src/util/address/move.go`


## v1.0.7 {#v1-0-7}

- Tag da versão: `v1.0.7`
- Data de publicação: `2026-06-16T11:37:43Z`
- Nota de versão oficial: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.6...v1.0.7`

### Mudanças visíveis para o usuário {#user-visible-changes-4}

- Os endpoints de criação de pedidos GMPay e EPay agora suportam pedidos com espaço reservado – é possível criar pedidos sem a necessidade de um endereço on-chain de pagamento imediato, permitindo integrações que precisam de IDs de pedido antes do método de pagamento real ser selecionado.
- Pedidos de marcador são convertidos em pedidos completos e on-chain quando o cliente seleciona uma rede de pagamento no fluxo de caixa.
- O fluxo de trabalho de pedidos agora suporta a seleção de rede adiada, permitindo que os comerciantes criem os pedidos e permitam que os clientes escolham a forma de pagamento posteriormente.

### Mudanças na implantação e na configuração {#deployment-and-configuration-changes-4}

- Não são necessárias novas variáveis de ambiente.
- O suporte para pedidos de espaço reservado está habilitado por padrão para os fluxos GMPay e EPay.

### Mudanças na API {#api-changes-4}

- O endpoint `POST /payments/gmpay/v1/order/create-transaction` e os endpoints de criação de pedidos do EPay agora aceitam pedidos sem os parâmetros `network` ou `token` no momento da criação. Quando ambos são omitidos, é criado um pedido provisório.
- Os pedidos de espaço reservado retornam um `trade_id` e uma URL do caixa, mas não incluem um endereço de carteira até que o cliente selecione uma rede.
- `POST /pay/switch-network` converte um pedido de marcador em um pedido completo na blockchain, atribuindo a rede selecionada e gerando um endereço de pagamento.

### Fontes consultadas {#evidence-used-4}

- Versão no GitHub `v1.0.7`
- PR `#89` (fusão de desenvolvimento)
- Commit: `3ab3659` (suporte para pedidos de marcador)
- Arquivos: `src/model/service/order_service.go`, `src/controller/comm/order_controller.go`, `src/model/mdb/orders_mdb.go`, `src/model/data/order_data.go`, `wiki/API.md`


## v1.0.6 {#v1-0-6}

- Tag da versão: `v1.0.6`
- Data de publicação: `2026-06-11T16:51:24Z`
- Nota de versão oficial: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.5...v1.0.6`

### Mudanças visíveis para o usuário {#user-visible-changes-5}

- O sistema agora suporta pagamentos na blockchain TON e Jetton USDT, incluindo a varredura de transações baseada em liteclient, a normalização de endereços TON (formatos brutos/amigáveis/de retorno) e a validação do contrato Jetton.
- A verificação de pagamento manual agora inclui a verificação de transações TON com validação de prova na cadeia.
- O nível de log em tempo de execução pode agora ser ajustado no painel de configurações administrativas, sem a necessidade de reiniciar o servidor – as alterações no nível de log têm efeito imediato em todos os loggers ativos.

### Mudanças na implantação e na configuração {#deployment-and-configuration-changes-5}

- O TON liteclient necessita de uma configuração pública do liteserver (rede principal ou rede de teste); o scanner irá sincronizar a partir do bloco mestre mais recente e acompanhar as cadeias de shards para as transferências de Jetton.
- Não são necessárias novas variáveis de ambiente; a configuração da cadeia TON e do token segue o fluxo de configuração existente da nó RPC e do token da cadeia.

### Mudanças na API {#api-changes-5}

- TON agora está disponível como uma opção em cadeia na lista de ativos suportados e nos pontos de extremidade de criação de pedidos.
- A API de configurações administrativas agora inclui o parâmetro `log_level` para ajustar os logs em tempo de execução (valores válidos: `debug`, `info`, `warn`, `error`).

### Fontes consultadas {#evidence-used-5}

- Versão no GitHub `v1.0.6`
- PR `#87` (fusão de desenvolvimento)
- Commits: `9b397bd` (suporte ao TON), `9ac9894` (nível de log em tempo de execução)
- Arquivos: `src/task/listen_ton.go`, `src/util/address/ton.go`, `src/model/service/ton_task.go`, `src/util/log/log.go`, `src/controller/admin/settings_controller.go`


## v1.0.5 {#v1-0-5}

- Tag da versão: `v1.0.5`
- Data de publicação: `2026-06-09T16:25:25Z`
- Nota de versão oficial: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.4...v1.0.5`

### Mudanças visíveis para o usuário {#user-visible-changes-6}

- O painel administrativo agora exibe estatísticas em tempo real sobre a execução dos nós RPC através de um endpoint Server-Sent Events (SSE), permitindo que a interface do usuário exiba o número de chamadas RPC, as taxas de sucesso e as estatísticas de erros em tempo real, sem a necessidade de consulta (polling).
- As estatísticas de tarefas RPC da Solana agora acompanham o número de chamadas por nó e por operação (análise de assinatura, recuperação de transação, recuperação de confirmação) e eventos de erro.
- As tarefas de análise de EVM e escaneamento de blocos agora reportam métricas de chamadas RPC ao rastreador de estatísticas em memória.
- O arquivo README foi atualizado com informações de auditoria de segurança e novas capturas de tela.

### Mudanças na implantação e na configuração {#deployment-and-configuration-changes-6}

- Não são necessárias novas variáveis de ambiente.
- O endpoint SSE está disponível em `/api/admin/v1/rpc/stats/stream` e requer autenticação com JWT de administrador.

### Mudanças na API {#api-changes-6}

- `GET /api/admin/v1/rpc/stats/stream` (SSE) retorna um fluxo JSON de estatísticas de tempo de execução de nós RPC; cada evento inclui o ID do nó, número de chamadas, número de sucessos, número de erros e o carimbo de data/hora da última ocorrência.

### Fontes consultadas {#evidence-used-6}

- Versão no GitHub `v1.0.5`
- PR `#86` (fusão de desenvolvimento)
- Commits: `08d409d` (Estatísticas RPC SSE), `54b83f8` (atualização do README), `3879853` (arquivos de ativos)
- Arquivos: `src/controller/admin/dashboard_controller.go`, `src/model/data/rpc_runtime_stats.go`, `src/task/listen_sol_job.go`, `src/task/listen_evm_ws.go`, `README.md`


## v1.0.4 {#v1-0-4}

- Tag da versão: `v1.0.4`
- Data de publicação: `2026-06-03T13:01:37Z`
- Nota de versão oficial: `feat(www): enable RPC node create and edit actions — Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.3...v1.0.4`

### Mudanças visíveis para o usuário {#user-visible-changes-7}

- A interface administrativa agora permite a criação e a edição de nós RPC diretamente no navegador – anteriormente, essas ações estavam desativadas ou eram incompletas na interface do usuário.

### Mudanças na implantação e na configuração {#deployment-and-configuration-changes-7}

- Não são necessários novas variáveis de ambiente ou alterações no backend; esta é uma atualização exclusiva do frontend.

### Mudanças na API {#api-changes-7}

- Não foram adicionados ou removidos nenhum endpoint da API; a interface do usuário agora está chamando corretamente os endpoints existentes de gerenciamento de nós.

### Fontes consultadas {#evidence-used-7}

- Versão no GitHub `v1.0.4`
- PR `#85`: recurso(www): habilitar ações de criação e edição de nós RPC
- Commit: `3e85bf7` (atualização de ativo web)
- Arquivos: `src/www/assets/*` (atualização do pacote frontend)


## v1.0.3 {#v1-0-3}

- Tag da versão: `v1.0.3`
- Data de publicação: `2026-05-27T11:42:43Z`
- Nota de versão oficial: `docs: update payment API integration guide — Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.2...v1.0.3`

### Mudanças visíveis para o usuário {#user-visible-changes-8}

- Os IDs de transação estão agora sendo gerados utilizando bytes aleatórios seguros criptograficamente e codificados em base64 segura para URL, substituindo o formato anterior baseado em timestamp — o que reduz o risco de colisões e melhora a anonimidade.
- Os nós RPC agora suportam um campo `purpose` (que pode ser `general`, `manual_verify` ou `both`), permitindo que os operadores dediquem nós exclusivamente à verificação manual de pagamentos, sem afetar o tráfego de varredura/WSS/verificação de saúde.
- A verificação de pagamento manual agora prioriza os nós `manual_verify` e, em caso de indisponibilidade de nós dedicados, recai sobre os nós `general`, distribuindo a carga de verificação separadamente da carga de escaneamento.
- A página de pagamento do caixa agora permite que os usuários enviem manualmente um hash de transação para verificação – os hashes enviados são validados na blockchain antes que a ordem seja marcada como paga.
- As consultas de agregação de tendências no painel agora utilizam SQL específico para cada sistema de banco de dados (MySQL/PostgreSQL/SQLite) para garantir a truncagem correta das datas em todos os bancos de dados suportados.
- As URLs de callback para pagamentos e as URLs da API de taxa agora estão validadas para rejeitar intervalos de IP privados (RFC 1918), prevenindo ataques SSRF através de URLs de callback controladas pelo usuário.
- O guia de integração da API de pagamento no README do repositório foi atualizado com exemplos mais claros e descrições dos endpoints.

### Mudanças na implantação e na configuração {#deployment-and-configuration-changes-8}

- Não são necessárias novas variáveis de ambiente.
- Os operadores agora podem marcar os nós RPC com `purpose: manual_verify` no painel de administração, a fim de isolar o tráfego de verificação do tráfego de varredura.

### Mudanças na API {#api-changes-8}

- `POST /api/admin/v1/order/update-trade-status` e `POST /payments/gmpay/v1/pay/submit-hash` aceitam um parâmetro `tx_hash` para a submissão manual do hash; o hash é validado na blockchain antes da alteração do status.
- Os endpoints de criação e atualização de nós RPC aceitam `purpose` (`general`, `manual_verify`, `both`). O padrão é `general`.

### Fontes consultadas {#evidence-used-8}

- Versão no GitHub `v1.0.3`
- PR `#81` (fusão de desenvolvimento)
- Commits: `c69b0d6` (isolamento de propósito RPC), `13c81ee` (IDs de transação aleatórios para criptografia), `fca75a9` (submissão de hash do caixa), `b70995f` (correção do dialeto SQL do painel), `0d97237` (atualização do README), `7fcb7b3` (documentação da API de pagamento)
- Arquivos: `src/model/mdb/rpc_node.go`, `src/model/data/rpc_node_data.go`, `src/controller/admin/rpc_controller.go`, `src/model/service/manual_payment_verify.go`, `src/model/mdb/orders_mdb.go`, `src/model/data/order_data_stats.go`, `src/controller/comm/pay_controller.go`, `README.md`


## v1.0.2 {#v1-0-2}

- Tag da versão: `v1.0.2`
- Data de publicação: `2026-05-22T15:16:34Z`
- Nota de versão oficial: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.1...v1.0.2`

### Mudanças visíveis para o usuário {#user-visible-changes-9}

- As solicitações da API de administração agora aceitam um token JWT simples no cabeçalho `Authorization`, sem o prefixo `Bearer `, além do formato padrão `Bearer <token>`. Os clientes que enviam um token bruto não recebem mais erros de autenticação.
- A varredura de transferências EVM ERC20 agora ignora transferências que ocorreram antes da criação do pedido, eliminando correspondências de pagamentos falsas provenientes de eventos blockchain desatualizados.
- As notificações de sucesso de pagamento OkPay agora são enviadas corretamente após a conclusão de um pedido através do caminho OkPay.
- O processamento de assinaturas agora tenta novamente em erros transitórios — uma assinatura é marcada como processada somente após a correspondência completa da ordem e o tratamento de pagamento serem totalmente bem-sucedidos, portanto, falhas temporárias não causam a perda silenciosa de pagamentos.
- As configurações de taxa de câmbio agora suportam uma lista de taxas de câmbio forçada em múltiplas moedas, permitindo que os operadores fixem as taxas de câmbio para várias moedas simultaneamente, em vez de uma única taxa global.

### Mudanças na implantação e na configuração {#deployment-and-configuration-changes-9}

- Não são necessárias novas variáveis de ambiente.
- A funcionalidade de taxa de câmbio múltipla pode exigir a atualização da configuração de taxas no painel de administração, caso você anteriormente utilizasse uma taxa de USDT forçada única.

### Mudanças na API {#api-changes-9}

- O middleware JWT de administração agora aceita tanto `Authorization: Bearer <token>` quanto `Authorization: <token>` (token sem prefixo).
- Não foram adicionados ou removidos novos percursos públicos.

### Fontes consultadas {#evidence-used-9}

- Versão no GitHub `v1.0.2`
- PR `#80` (fusão de desenvolvimento)
- Commits: `f4ef71b3`, `4b4701f5`, `449d22a4`, `dec1b97b`, `8a486116`, `2a00a033`
- Alterações: middleware JWT para o admin, ouvinte de blocos ERC20 do EVM, manipulador de notificações OkPay, lógica de repetição de assinatura Solana, modelo de configurações de taxa.


## v1.0.1 {#v1-0-1}

- Tag da versão: `v1.0.1`
- Data de publicação: `2026-05-21T11:40:39Z`
- Nota de versão oficial: `feat: expose build version in public config — Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v1.0.0...v1.0.1`

### Mudanças visíveis para o usuário {#user-visible-changes-10}

- A resposta de `GET /payments/gmpay/v1/config` inclui o campo `version`, que indica a versão do servidor em execução (por exemplo, `"version": "v1.0.1"`).
- Os registros de configurações "soft-deleted" agora são restaurados no processo upsert, em vez de serem simplesmente removidos, garantindo que as alterações de configuração tenham efeito corretamente após uma exclusão anterior.

### Mudanças na implantação e na configuração {#deployment-and-configuration-changes-10}

- A publicação de imagens Docker agora está restrita a pushes de tags `v*`; builds sem tags de versão não podem mais ser publicadas no registro.
- A versão de compilação é injetada durante a compilação através dos builds Docker e GoReleaser, de modo que a versão reportada na resposta da API corresponde à tag de lançamento.

### Mudanças na API {#api-changes-10}

- A resposta de `GET /payments/gmpay/v1/config` agora inclui `version` (string), que reflete a versão de construção do servidor.

### Fontes consultadas {#evidence-used-10}

- Versão no GitHub `v1.0.1`
- PR `#72`: recurso: exibir a versão do build na configuração pública
- Commits: `85b81e66`, `09642d4c`, `c19a7e5f`
- Arquivos: `src/model/response/support_response.go`, `src/controller/comm/supported_asset_controller.go`, `src/model/data/settings_data.go`, `.github/workflows/docker-alpine.yml`, `src/.goreleaser.yaml`

## v1.0.0 {#v1-0-0}

- Tag da versão: `v1.0.0`
- Data de publicação: `2026-05-20T16:09:00Z`
- Nota de versão oficial: `feat: verify manual mark-paid payments — Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.7...v1.0.0`

### Mudanças visíveis para o usuário {#user-visible-changes-11}

- O manual de administração de "marca como pago" agora executa a verificação na cadeia antes de marcar um pedido como pago – o hash da transação é validado na cadeia antes que a alteração do status seja aceita.
- Verificação das informações do destinatário, endereço do contrato de token, valor do pagamento, número de confirmações e carimbo de tempo da transação, para evitar falsos positivos.
- Hashes de transações duplicadas são rejeitados – a mesma transação fora da cadeia não pode ser usada para marcar vários pedidos como pagos.
- As ordens que não foram criadas como ordens on-chain são excluídas do processo de verificação manual (tipos de ordens que não são on-chain são rejeitados).
- A resposta `supported_assets` agora inclui um campo `display_name` ao lado da chave existente `network`, facilitando que as interfaces de usuário exibam os nomes das blockchains de forma legível para humanos, sem alterar o identificador da rede subjacente.
- A chave de rede BSC foi renomeada de `bsc` para `binance` na lista de ativos suportados.

### Mudanças na implantação e na configuração {#deployment-and-configuration-changes-11}

- Não são necessárias novas variáveis de ambiente.
- Sem alterações na configuração da imagem Docker ou na configuração do docker-compose.

### Mudanças na API {#api-changes-11}

- O ponto de administração para marcação de pagamentos agora exige um parâmetro `tx_hash` válido e realiza a validação na blockchain antes de aceitar a solicitação. Hashes inválidos ou duplicados resultam em uma resposta de erro.
- As entradas de ativos aceitos em `GET /payments/gmpay/v1/config` agora incluem `display_name`.
- O valor da rede BSC em ativos suportados mudou de `bsc` para `binance`.

### Fontes consultadas {#evidence-used-11}

- Versão no GitHub `v1.0.0`
- PR `#70`: recurso: verificar pagamentos manuais marcados como pagos
- Commit: `049a15c`
- Arquivos: `src/controller/admin/order_controller.go`, `src/model/service/manual_payment_verify.go`, `src/model/response/support_response.go`, `src/controller/comm/supported_asset_controller.go`

## v0.9.7 {#v0-9-7}

- Tag da versão: `v0.9.7`
- Data de publicação: `2026-05-13T09:01:26Z`
- Nota de versão oficial: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.6...v0.9.7`

### Mudanças visíveis para o usuário {#user-visible-changes-12}

- O arquivo `README.zh-CN.md` foi removido; agora, o arquivo `README.md` é o único arquivo de README principal, consolidando a documentação em um único ponto de acesso.
- Os ativos de administração do frontend (manifest de precache do service worker e todos os blocos de JS agrupados) foram reconstruídos com hashes de conteúdo atualizados, resolvendo problemas de cache desatualizado para usuários que haviam acessado anteriormente o painel de administração.

### Mudanças na implantação e na configuração {#deployment-and-configuration-changes-12}

- Não foram introduzidas novas variáveis de ambiente.
- Sem alterações no comportamento em tempo de execução — esta é apenas uma atualização de ativos da interface e uma limpeza da documentação.

### Mudanças na API {#api-changes-12}

- Nenhuma rota de API foi adicionada, removida ou modificada.

### Fontes consultadas {#evidence-used-12}

- Versão no GitHub `v0.9.7`
- Comparar alterações `v0.9.6...v0.9.7`
- Commits `52b171b`, `4a69b7c`, `b0093c4`, `864eb59`
- Arquivos: `README.md`, `README.zh-CN.md`, `src/www/sw.js`, `src/www/index.html`, `src/www/assets/*`

## v0.9.6 {#v0-9-6}

- Tag da versão: `v0.9.6`
- Data de publicação: `2026-05-11T10:09:43Z`
- Nota de versão oficial: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.5...v0.9.6`

### Mudanças visíveis para o usuário {#user-visible-changes-13}

- As credenciais administrativas iniciais agora são exibidas no console durante a primeira execução, permitindo que o primeiro login seja descoberto sem a necessidade de inspecionar o banco de dados.
- As configurações de aparência no painel administrativo agora aceitam `background_color` e `background_image_url` para personalizar o fundo da página de pagamento.
- A precisão do valor do pagamento agora é configurável — os operadores podem definir o número de casas decimais a serem aplicadas ao gerar valores de pagamento.
- A resolução de tokens da TRON chain agora é dinâmica no ouvinte de blocos, eliminando a necessidade de codificar manualmente os endereços dos contratos de token no início.
- `README.md` agora é a versão principal em chinês simplificado; existe um arquivo `README.en.md` separado para leitores em inglês. O arquivo `README.zh-CN.md` foi removido em um commit posterior (4a69b7c8).
- Os diretórios `plugins/` e o exemplo de plugin `dujiaoka` incluído foram removidos do repositório.

### Mudanças na implantação e na configuração {#deployment-and-configuration-changes-13}

- Não é necessário criar uma nova variável de ambiente.
- A reorganização do README é apenas para documentação e não afeta o comportamento em tempo de execução.

### Mudanças na API {#api-changes-13}

- A resposta de `GET /payments/gmpay/v1/config` agora inclui os campos de aparência `background_color` e `background_image_url`.
- A resposta de `GET /payments/gmpay/v1/config` passou a incluir `payment_amount_precision` das configurações de pagamento.
- Nenhuma rota foi adicionada ou removida.

### Fontes consultadas {#evidence-used-13}

- Versão no GitHub `v0.9.6`
- Comparar alterações `v0.9.5...v0.9.6`
- Commits: `1a35cab`, `2d546e3`, `a8a3b86`, `3e0be9b`, `7c9e3e1`, `84972ea`, `1c805ed`, `8d2ddbd`, `07d1d83`, `7a905ba`, `4dc1ba8`, `4a69b7c`
- Arquivos: `src/bootstrap/bootstrap.go`, `src/controller/admin/settings_controller.go`, `src/model/data/settings_data.go`, `src/model/mdb/settings.go`, `src/task/listen_trc20_block.go`

## v0.9.5 {#v0-9-5}

- Tag da versão: `v0.9.5`
- Data de publicação: `2026-05-09T13:51:58Z`
- Nota de versão oficial: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.4...v0.9.5`

### Mudanças visíveis para o usuário {#user-visible-changes-14}

- O processo de checkout agora, quando hospedado, inclui uma via `okpay` como opção de pagamento, além do fluxo de seleção da rede on-chain existente.
- O fluxo de pagamento agora pode retornar um `payment_url` nas respostas do checkout, permitindo que processos de pagamento de terceiros, como pedidos filhos do OkPay, tenham um destino de redirecionamento explícito, em vez de depender apenas da exibição de um endereço de caixa local.
- As respostas de configuração públicas agora exibem metadados de caixa (cashier) voltados para o site, como nome, URL do logo, título do site e link de suporte, tornando a renderização de marca e configuração do frontend menos rígida.

### Mudanças na implantação e na configuração {#deployment-and-configuration-changes-14}

- O arquivo de ambiente de exemplo removeu os blocos de configuração antigos do PostgreSQL e MySQL; a configuração publicada atual reflete as configurações padrão de tempo de execução focadas no SQLite, em vez de sugerir que esses back-ends de banco de dados ainda fazem parte do caminho de configuração normal.
- O Dockerfile foi otimizado, removendo etapas desnecessárias de cópia do `static`, que não correspondem mais ao caminho de entrega do frontend ativo.
- As tarefas de manutenção também atualizaram o conteúdo do logotipo/aviso, mas estas são secundárias às alterações de execução/pagamento mencionadas acima.

### Mudanças na API {#api-changes-14}

- A configuração frontal do GMPay agora é obtida através de `GET /payments/gmpay/v1/config`, em vez do método anterior de consulta direta para ativos suportados.
- `GET /payments/gmpay/v1/config` retorna os `supported_assets` juntamente com a identidade visual do site, as configurações padrão do EPay e os campos de configuração pública do OkPay.
- Adicionado o endpoint de callback do OkPay: `POST /payments/okpay/v1/notify`.
- `POST /pay/switch-network` agora documenta/aceita `network=okpay` além dos valores de rede on-chain.
- Os payloads de resposta de checkout agora incluem `payment_url`.

### Fontes consultadas {#evidence-used-14}

- Versão no GitHub `v0.9.5`
- Comparar alterações `v0.9.4...v0.9.5`
- Commits `377176a`, `3623a54`, `51ad344`, `ff157c3`, `1a35cab`, `2d546e3`
- Arquivos de código relevantes: `src/route/router.go`, `src/controller/comm/supported_asset_controller.go`, `src/model/response/order_response.go`, `src/model/response/support_response.go`, `src/.env.example`

## v0.9.4 {#v0-9-4}

- Tag da versão: `v0.9.4`
- Data de publicação: `2026-04-28T16:37:20Z`
- Nota de versão oficial: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.3...v0.9.4`

### Mudanças visíveis para o usuário {#user-visible-changes-15}

- A leitura de pagamentos TRON voltou a funcionar através de um caminho de ouvinte baseado em blocos no histórico de código atual, portanto, a reversão temporária do fluxo TRON mais recente não é mais o estado upstream eficaz.
- As correções para o processamento de pagamentos de acompanhamento ajustaram o comportamento das notificações de pedido após o processamento bem-sucedido do pagamento.
- A entrada de checkout hospedada agora é redirecionada para o fluxo de caixa da SPA, em vez de renderizar um modelo HTML do lado do servidor dedicado diretamente de `/pay/checkout-counter/:trade_id`.

### Mudanças na implantação e na configuração {#deployment-and-configuration-changes-15}

- O fluxo de checkout hospedado agora depende do caminho de entrega `www/` baseado em SPA, em vez do antigo caminho de ativos de checkout dedicado `static/`.
- A imagem do Docker foi posteriormente limpa para remover etapas de cópia `static` redundantes que não correspondem mais ao caminho de entrega do SPA ativo.

### Mudanças na API {#api-changes-15}

- `GET /pay/checkout-counter/:trade_id` agora funciona como uma entrada de redirecionamento para a interface do usuário (SPA) do caixa.
- A fonte atual expõe o endpoint `GET /pay/checkout-counter-resp/:trade_id` como o ponto de resposta JSON utilizado pelo novo fluxo de checkout da SPA.
- Não foi introduzido um novo campo de assinatura de comerciante ou contrato de callback nesta versão.

### Fontes consultadas {#evidence-used-15}

- Versão no GitHub `v0.9.4`
- Comparar alterações `v0.9.3...v0.9.4`
- Commits: `9e885d8`, `de9c45a`, `96ea748`, `51a2acc`, `d17d212`, `9c533a7`, `ff68279`
- Problema upstream `#55` referente à ausência de arquivos de checkout nas implantações Docker.

## v0.9.3 {#v0-9-3}

- Tag da versão: `v0.9.3`
- Data de publicação: `2026-04-25T10:50:34Z`
- Nota de versão oficial: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.2...v0.9.3`

### Mudanças visíveis para o usuário {#user-visible-changes-16}

- Corrigi a rota raiz após a instalação, para que o SPA seja servido consistentemente através de `GET /`, em vez de ser interceptado pelo manipulador raiz do backend.
- A opção de instalação continua a redirecionar o caminho raiz para `/install`, mantendo assim o fluxo de configuração inicial intacto.

### Mudanças na implantação e na configuração {#deployment-and-configuration-changes-16}

- Não foram publicadas novas variáveis de ambiente públicas ou flags de implantação para esta versão.
- O comportamento principal da rota de execução foi ajustado para garantir que as instâncias instaladas cheguem à aplicação web de forma mais confiável.

### Mudanças na API {#api-changes-16}

- Nenhuma nova rota de API pública foi introduzida nesta versão.
- O roteamento do backend foi alterado de um manipulador de estilo `Any("/")` (que capturava tudo) para um manipulador de backend `POST("/")`, deixando o tráfego normal do navegador `GET /` para a SPA.

### Fontes consultadas {#evidence-used-16}

- Versão no GitHub `v0.9.3`
- Comparar alterações `v0.9.2...v0.9.3`
- Commits incluindo `95879e3`, tag de merge `67263da`

## v0.9.2 {#v0-9-2}

- Tag da versão: `v0.9.2`
- Data de publicação: `2026-04-24T16:14:34Z`
- Nota de versão oficial: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.9.1...v0.9.2`

### Mudanças visíveis para o usuário {#user-visible-changes-17}

- As configurações de taxa administrativa agora permitem configurar uma taxa USDT forçada.
- Os exemplos de implantação do Docker continuam alinhados com a referência da imagem atual `gmwallet/epusdt:latest`.

### Mudanças na implantação e na configuração {#deployment-and-configuration-changes-17}

- Não foi publicado nenhuma nova variável de ambiente pública nas notas de lançamento.
- Os exemplos existentes de atualização do Docker continuam a utilizar `gmwallet/epusdt:latest`.

### Mudanças na API {#api-changes-17}

- Não foi identificada nenhuma nova rota de API pública nas notas de lançamento ou nas diferenças comparadas para esta versão.

### Fontes consultadas {#evidence-used-17}

- Versão no GitHub `v0.9.2`
- Comparar alterações `v0.9.1...v0.9.2`
- Commits incluindo `dd1bf70`, `143bc84`

## v0.9.1 {#v0-9-1}

- Tag da versão: `v0.9.1`
- Data de publicação: `2026-04-22T18:29:39Z`

### Mudanças visíveis para o usuário {#user-visible-changes-18}

- Assistente de instalação integrado: na primeira execução, sem um arquivo de configuração utilizável, agora inicia um fluxo de instalação baseado na web, em vez de falhar. A versão atual se concentra em `app_name`, `app_uri`, endereço/porta de ligação, caminho de execução, caminho de log, tempo de expiração da ordem e configurações de repetição de callback.
- A imagem Docker agora suporta o download direto com `docker pull gmwallet/epusdt:latest`; não é necessário montar um arquivo `.env` para a implantação inicial.

### Mudanças na implantação e na configuração {#deployment-and-configuration-changes-18}

- O assistente de instalação gera o arquivo `.env` automaticamente na primeira submissão; após as reinicializações subsequentes, ele ignora o assistente e inicia normalmente.
- O mapeamento de volume `docker-compose.yaml` para o arquivo `.env` agora é opcional — remova-o para uma primeira execução limpa, baseada em um assistente.

### Mudanças na API {#api-changes-18}

- Não há novas rotas de API públicas neste lançamento.

## v0.9.0 {#v0-9-0}

- Tag da versão: `v0.9.0`
- Data de publicação: `2026-04-21T20:23:33Z`
- Nota de versão oficial: `Full Changelog: https://github.com/GMWalletApp/epusdt/compare/v0.0.8...v0.9.0`

### Mudanças visíveis para o usuário {#user-visible-changes-19}

- Adicionado um painel administrativo completo para gerenciar chaves de API, blockchains, tokens de blockchain, carteiras, pedidos, nós RPC, configurações, notificações e estatísticas do painel.
- A compatibilidade com múltiplas blockchains foi expandida ainda mais, incluindo uma cobertura mais ampla dos ouvintes EVM e fluxos de gerenciamento de cadeias/tokens voltados para administradores.
- Os canais de notificação do Telegram foram adicionados e posteriormente sincronizados com as atualizações de configurações.
- Foi implementado um fluxo de instalação inicial para simplificar a configuração inicial.

### Mudanças na implantação e na configuração {#deployment-and-configuration-changes-19}

- O arquivo `.env.example` alterou o valor padrão da flag de instalação para "habilitado" no fluxo de configuração inicial.
- A execução agora inclui verificações de saúde dos nós RPC com suporte automático de failover.
- Os arquivos estáticos de administração foram adicionados ao tempo de execução do servidor.
- Novos modelos de persistência foram introduzidos para usuários administrativos, chaves de API, cadeias, tokens de cadeia, nós RPC, configurações e canais de notificação.

### Mudanças na API {#api-changes-19}

- Adicionado uma API REST de administração completa, abrangendo autenticação, chaves de API, cadeias, tokens de cadeia, carteiras, pedidos, nós RPC, configurações, estatísticas do painel e notificações.
- Implementação de autenticação de administrador baseada em JWT e middleware de autenticação por chave de API.
- As estruturas de resposta/solicitação relacionadas a pagamento, ativo suportado, carteira e pedidos foram expandidas, juntamente com o fluxo de trabalho administrativo.

### Fontes consultadas {#evidence-used-18}

- Versão no GitHub `v0.9.0`
- Comparar alterações `v0.0.8...v0.9.0`
- Commits incluindo `6bb47d4`, `5edc9dc`, `b499bc0`, `6ea5637`, `9163943`

## v0.0.8 {#v0-0-8}

- Tag da versão: `v0.0.8`
- Data de publicação: `2026-04-15T10:44:56Z`
- Nota de versão oficial: `- Enable polygon,plasma supports`

### Mudanças visíveis para o usuário {#user-visible-changes-20}

- Adicionado suporte para as redes `polygon` e `plasma`.
- O comportamento de seleção de rede na página de pagamento foi ajustado.
- A lógica de armazenamento do endereço da carteira EVM foi corrigida.

### Mudanças na implantação e na configuração {#deployment-and-configuration-changes-20}

- Não foram exibidas novas variáveis de ambiente na nota de lançamento ou na comparação de diff.

### Mudanças na API {#api-changes-20}

- Não foi introduzida uma nova rota de API pública de forma clara nas notas oficiais.
- O comportamento relacionado à rede, suportado a partir do fluxo de trabalho `v0.0.7`, continua.

### Fontes consultadas {#evidence-used-19}

- Versão no GitHub `v0.0.8`
- Comparar alterações `v0.0.7...v0.0.8`
- Commits incluindo `f7c5f67`, `097c716`

## v0.0.7 {#v0-0-7}

- Tag da versão: `v0.0.7`
- Data de publicação: `2026-04-15T06:00:55Z`
- Nota de versão oficial: `suport bsc, plasma, polygon......` + `support epay submit form params` + `Dev payment`

### Mudanças visíveis para o usuário {#user-visible-changes-21}

- Adicionado suporte para `bsc`, `polygon` e `plasma`.
- Os parâmetros de envio de formulário compatíveis com EPay foram adicionados para uma integração mais ampla.
- As interações e o tratamento de pagamentos no Telegram foram atualizados no fluxo de trabalho de pagamentos.

### Mudanças na implantação e na configuração {#deployment-and-configuration-changes-21}

- Novas funcionalidades de rede suportadas adicionaram múltiplas rotas de escuta EVM no histórico de código.
- Não foi publicada uma nova variável `.env` bem documentada no corpo das notas de lançamento oficiais.

### Mudanças na API {#api-changes-21}

- Adicionado trabalho relacionado às APIs relacionadas a cadeias de suporte/ativos suportados no histórico de código.
- A lógica do roteador foi atualizada para suportar tanto os métodos `GET` quanto `POST` para o fluxo de submissão compatível com EPay.

### Fontes consultadas {#evidence-used-20}

- Versão no GitHub `v0.0.7`
- Comparar alterações `v0.0.6...v0.0.7`
- Commits incluindo `9c003fb`, `8cd816c`, `786c5e8`, `70f8ed4`

## v0.0.6 {#v0-0-6}

- Tag da versão: `v0.0.6`
- Data de publicação: `2026-04-12T20:06:08Z`
- Anúncio oficial: comparar `v0.0.5...v0.0.6`

### Mudanças visíveis para o usuário {#user-visible-changes-22}

- A interface de checkout, anteriormente, foi redesenhada para um fluxo de pagamento em duas etapas.
- A opção de alternar a rota de pagamento foi adicionada para a seleção de checkout em múltiplas redes.
- A leitura de pagamentos Solana agora suporta `USDT` e `USDC`.
- Foi adicionada a detecção de pagamentos ERC-20 na Ethereum para `USDT` e `USDC`.
- As notificações de pagamento do Telegram agora incluem informações sobre a rede.
- A validação da carteira Telegram foi aprimorada para endereços multi-rede.

### Mudanças na implantação e na configuração {#deployment-and-configuration-changes-22}

- Adicionado: `solana_rpc_url`
- Adicionado: `ethereum_ws_url`
- Adicionado: `epay_pid`
- Adicionado: `epay_key`
- O bloqueio e a correspondência de pedidos agora consideram `network` durante a execução.

### Mudanças na API {#api-changes-22}

- Adicionadas as funcionalidades de gerenciamento de carteira sob `/payments/gmpay/v1/wallet/*`
- Adicionado: `POST /pay/switch-network`
- Adicionado o caminho compatível com EPay: `GET /payments/epay/v1/order/create-transaction/submit.php`
- A resposta de checkout agora inclui o campo `is_selected`.
- O fluxo de criação aceita opcionalmente os parâmetros `name` e `payment_type`.
- A fonte atual utiliza identificadores de rede em minúsculas, como `tron`, `solana` e `ethereum`.

### Fontes consultadas {#evidence-used-21}

- Versão no GitHub `v0.0.6`
- Comparar alterações `v0.0.5...v0.0.6`
- Commits incluindo `3f071e6`, `32ca778`, `5e4d5df`

## v0.0.5 {#v0-0-5}

- Tag da versão: `v0.0.5`
- Data de publicação: `2026-04-03T17:05:30Z`
- Nota de versão oficial: `test: fix macOS path assertion and wallet address unique index`

### Mudanças visíveis para o usuário {#user-visible-changes-23}

- Nenhuma funcionalidade principal para o usuário final foi descrita no comunicado oficial.

### Mudanças na implantação e na configuração {#deployment-and-configuration-changes-23}

- Não foram exibidas novas variáveis de implantação no comunicado oficial.

### Mudanças na API {#api-changes-23}

- O comportamento do índice único para endereços de carteira foi ajustado no histórico de código.

### Fontes consultadas {#evidence-used-22}

- Versão no GitHub `v0.0.5`
- Comparar alterações `v0.0.4...v0.0.5`

## v0.0.4 {#v0-0-4}

- Tag da versão: `v0.0.4`
- Nome da versão: `New UI Update`
- Data de publicação: `2026-04-03T16:05:23Z`
- Nota de versão oficial: `feat: change payment ui`

### Mudanças visíveis para o usuário {#user-visible-changes-24}

- A interface de pagamento foi atualizada.

### Mudanças na implantação e na configuração {#deployment-and-configuration-changes-24}

- Não foram mencionadas alterações focadas no processo de implantação nas notas de lançamento.

### Mudanças na API {#api-changes-24}

- Não foram mencionadas alterações na API nas notas de lançamento.

### Fontes consultadas {#evidence-used-23}

- Versão no GitHub `v0.0.4`
- Texto oficial de as informações do lançamento

## Observações para os mantenedores {#notes-for-maintainers}

Para as próximas versões, o formato de lançamento mais útil é:

1. Mudanças visíveis para o usuário
2. Alterações de implantação ou configuração
3. Alterações na API ou no esquema.
4. Observações sobre atualizações ou alterações significativas.
