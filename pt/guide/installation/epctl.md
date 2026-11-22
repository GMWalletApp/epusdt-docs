---
description: "Utilize o epctl para instalar uma versão binária pré-compilada do EPUSDT no Linux, verificar a versão e gerenciar o serviço."
---

# Instalação e verificação com epctl {#epctl-installation-and-verification-scripts}

`epctl` é o instalador e gerenciador de serviços binário Linux, raiz do repositório, para os binários `epusdt` lançados no GitHub Releases.
`epctl-docker-test.sh` é o script de validação de ponta a ponta correspondente. Ele inicia o Ubuntu + systemd dentro do Docker e verifica o comportamento de download, instalação, inicialização, atualização e configuração da senha com artefatos de release reais.

Para uma instalação limpa, obtenha os arquivos de lançamento primeiro.

```sh
git clone --depth 1 --branch v2.1.1 https://github.com/GMWalletApp/epusdt.git
cd epusdt
```

## Escopo {#scope}

- Linux apenas
- Instalação binária apenas
- A fonte de lançamento está corrigida para `https://github.com/GMWalletApp/epusdt/releases`
- O gerenciamento de serviços é baseado no systemd.

## Dependências e Privilégios {#dependencies-and-privileges}

`epctl` espera que os seguintes comandos sejam utilizados:

- `curl`
- `tar`
- `systemctl`
- `install`
- `grep`
- `sed`

Anotações:

- Os comandos `install`, `upgrade` e `self-install` gravam em `/opt`, `/etc/systemd` e `/usr/local/bin`.
- `status` e `logs` são executados automaticamente novamente através de `sudo` quando necessário.
- Na prática, o operador deve ter acesso `sudo`.

## Caminhos Fixos {#fixed-paths}

| Item | Caminho |
|------|------|
| Diretório de instalação | `/opt/epusdt` |
| Principal paridade | `/opt/epusdt/epusdt` |
| Scanner binário | `/opt/epusdt/chainscanner` |
| Configuração ativa | `/opt/epusdt/.env` |
| Configuração do scanner | `/opt/epusdt/chainscanner.json` |
| Configuração de exemplo | `/opt/epusdt/.env.example` |
| Ativos do frontend extraídos | `/opt/epusdt/www` |
| Baixar cache | `/tmp/epusdt/<tag>/` |
| Unidade do systemd | `/etc/systemd/system/epusdt.service`, `/etc/systemd/system/chainscanner.service` |
| Global epctl path | `/usr/local/bin/epctl` |

## Início Rápido {#quick-start}

Execute o menu interativo a partir da raiz do repositório:

```bash
./epctl
```

A língua padrão para a interação é o chinês. No entanto, você pode forçar a utilização de qualquer idioma.

```bash
./epctl zh
./epctl en
./epctl --lang zh help
./epctl --lang en help
```

Instale o script no PATH:

```bash
./epctl self-install
epctl
```

## Comandos Comuns {#common-commands}

Baixar uma versão específica:

```bash
./epctl download --tag v2.1.0
```

Instale o serviço (o padrão é `--component epusdt` com o scanner integrado). Utilize `--component all` para dois serviços separados.

```bash
./epctl install --tag v2.1.0 \
  --app-uri https://pay.example.com \
  --listen 127.0.0.1:18000
```

Execute o `chainscanner` de forma independente (gera automaticamente ou aceita tokens e imprime os credenciais de conexão):

```bash
./epctl install --component chainscanner \
  --scanner-listen 0.0.0.0:9081
```

Implemente o `epusdt` de forma independente (conectando-se a um `chainscanner` remoto).

```bash
./epctl install --component epusdt \
  --app-uri https://pay.example.com \
  --listen 127.0.0.1:8000 \
  --scanner-url http://10.0.0.2:9081 \
  --scanner-token <chainscanner_token> \
  --scanner-admin-token <chainscanner_admin_token>
```

Atualize para a versão mais recente (detecta automaticamente os componentes instalados, ou especifique `--component all|epusdt|chainscanner`).

```bash
./epctl upgrade --tag v2.1.0
```

Executar `./epctl upgrade --tag ...` reinicia o `epusdt` imediatamente após os arquivos serem substituídos.
Se você quiser substituir apenas os arquivos, use a opção `--no-restart`.
Se você deseja uma etapa de confirmação explícita, passe a opção `--prompt-restart`. Em um terminal interativo, o prompt é `[Y/n]`, então pressionar Enter reinicia por padrão.

Verifique a configuração, o status e os logs.

```bash
./epctl show-config
./epctl status
./epctl logs --lines 200
```

Solicite a senha de administrador inicial.

```bash
./epctl init-password
```

## Comportamento quando a opção `--tag` é omitida {#behavior-when-tag-is-omitted}

Nos comandos `download`, `install` e `upgrade`, o `epctl` identifica a tag da versão mais recente no GitHub, exibe a tag exata e solicita confirmação.

Please provide the English text you would like me to translate. I’m ready when you are.

```bash
./epctl install --app-uri https://pay.example.com
```

Em uso interativo, o script exibirá a última tag resolvida antes de prosseguir.
Para a automação, é preferível especificar a opção `--tag` explicitamente. Se você deseja intencionalmente pular a confirmação, use:

```bash
EPCTL_ASSUME_YES=1 ./epctl download
```

## O que acontece na primeira instalação. {#what-happens-on-first-install}

`install` realiza as seguintes etapas:

1. Detecte a arquitetura atual do processador e baixe o arquivo de lançamento do GitHub correspondente.
2. Extraia os arquivos em `/tmp/epusdt/<tag>/extract/`
3. Instale o binário em `/opt/epusdt/epusdt`
4. Copie o arquivo `.env.example` para `/opt/epusdt/.env.example`
5. Crie o usuário e o grupo do sistema `epusdt`.
6. Crie automaticamente o arquivo `/opt/epusdt/.env` a partir de `.env.example` se ele não existir.
7. Escreva e habilite o serviço `epusdt.service`.

Quando o arquivo `.env` é criado automaticamente, o script aplica apenas as alterações mínimas de configuração.

- `install=false`
- `app_uri=<--app-uri, default http://127.0.0.1:8000>`
- `http_listen=<--listen, default 127.0.0.1:8000>`

Se o arquivo `/opt/epusdt/.env` já existir, não instale nem faça atualização; mantenha-o inalterado.
O arquivo `/opt/epusdt/.env.example` é atualizado a partir da versão mais recente em cada instalação / atualização.

## O que acontece durante a atualização. {#what-happens-during-upgrade}

`upgrade` realiza as seguintes etapas:

1. Detecte a arquitetura atual do processador e baixe o arquivo da versão GitHub.
2. Extraia os arquivos em `/tmp/epusdt/<tag>/extract/`
3. É necessário utilizar o arquivo `/opt/epusdt/.env`. Se o arquivo estiver ausente, o comando falha e informa que é preciso executar o comando `install` primeiro.
4. Substitua `/opt/epusdt/epusdt`
5. Substitua `/opt/epusdt/.env.example`
6. Mantenha o arquivo `/opt/epusdt/.env`
7. Reinicie o serviço `epusdt.service` e execute `systemctl daemon-reload`.
8. Reinicie `epusdt` automaticamente por padrão.

Comportamentos adicionais:

- `upgrade` deixou de criar o arquivo `.env` e de executar `systemctl enable`.
- `upgrade --no-restart` substitui apenas os arquivos e exibe um aviso manual para reiniciar.
- `upgrade --prompt-restart` pergunta se deseja reiniciar quando um terminal interativo estiver disponível.
- Se a reinicialização falhar após uma atualização, o script tenta reverter para a versão anterior do arquivo binário, `.env.example`, e do arquivo de unidade.

## Detalhes do Serviço systemd {#systemd-service-details}

O nome do serviço está definido como `epusdt.service` e utiliza as seguintes configurações principais:

```ini
WorkingDirectory=/opt/epusdt
ExecStart=/opt/epusdt/epusdt http start
User=epusdt
Group=epusdt
Restart=always
RestartSec=3
```

O diretório de trabalho permanece em `/opt/epusdt` porque o programa extrai seus arquivos `www/` ao lado do executável.

## O que `init-password` faz {#what-init-password-does}

`epctl init-password` apenas chama a rota HTTP local:

```text
GET /admin/api/v1/auth/init-password
```

Não acessa o banco de dados diretamente.

O script lê a linha `http_listen` do arquivo `/opt/epusdt/.env` e normaliza esses valores de escuta em um alvo de solicitação local:

- `:8000` -> `127.0.0.1:8000`
- `0.0.0.0:8000` -> `127.0.0.1:8000`

Se a API retornar `10040`, a senha de texto plano do bootstrap não estará mais disponível. As razões comuns incluem:

- A senha do administrador já foi alterada.
- A senha inicial já foi utilizada e não pode ser recuperada novamente.

Nesse caso, o `epctl` exibe o corpo de erro HTTP original para fins de diagnóstico.

## Script de Validação do Docker {#docker-validation-script}

O repositório também oferece:

```bash
./epctl-docker-test.sh <install-tag> [upgrade-tag]
```

Exemplos:

```bash
./epctl-docker-test.sh v2.1.0
./epctl-docker-test.sh --lang en v2.0.0 v2.1.0
```

Realiza estas verificações na máquina local:

- Inicia diretamente a partir de `ubuntu:24.04` e instala o systemd, juntamente com as dependências de teste durante o processo de inicialização do contêiner.
- inicia um espaço exclusivo
- executa `epctl self-install` dentro do container
- Baixar os artefatos reais do GitHub Release
- Instala `epusdt`
- Quando `upgrade-tag` é fornecido, verifica se `upgrade --no-restart` está sendo utilizado, o `upgrade` padrão e não interativo, e também as ramificações `n` / Enter de `upgrade --prompt-restart`.
- Verifica o serviço systemd, `www/index.html`, a configuração, os logs e o status.
- Verifica que `init-password` funciona uma vez e, posteriormente, retorna `10040` após a alteração da senha do administrador.

Requisitos:

- Docker instalado localmente
- Permissão para executar o Docker.
- Acesso de saída para GitHub Releases

## Recomendações {#recommendations}

- Prefira valores explícitos `--tag`.
- Após a instalação, execute `./epctl show-config` uma vez para verificar o arquivo `.env` ativo.
- Altere a senha de administrador imediatamente após obter a senha inicial.
- Se você quiser validar o próprio instalador, execute `./epctl-docker-test.sh` primeiro.
