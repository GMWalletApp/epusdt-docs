---
description: "Instale o EPUSDT com Docker Compose, configure a URL de checkout pública e mantenha os dados do gateway e do ChainScanner persistentes mesmo após reinicializações do contêiner."
title: "Instale o gateway de pagamento usando Docker Compose."
---

# Instalação com Docker Compose {#install-with-docker-compose}

Utilize o arquivo [Compose file](https://github.com/GMWalletApp/epusdt/blob/v2.1.1/docker-compose.yaml) do versionamento que está instalando. O serviço padrão inclui o ChainScanner.

Para uma instalação limpa, obtenha os arquivos de lançamento primeiro.

```sh
git clone --depth 1 --branch v2.1.1 https://github.com/GMWalletApp/epusdt.git
cd epusdt
```

## Iniciar o gateway {#start-the-gateway}

A partir do diretório raiz do repositório, configure a URL de checkout público no ambiente Compose (por exemplo, um arquivo `.env` de nível de projeto). O ponto de entrada a utiliza em cada inicialização.

```dotenv
APP_URI=https://pay.example.com
EPUSDT_PORT=8000
```

```sh
docker compose up -d epusdt
docker compose logs --tail=100 epusdt
curl -fsS http://127.0.0.1:8000/payments/gmpay/v1/config
```

Configure seu proxy HTTPS reverso para apontar para a porta mapeada. Defina um endereço de recebimento e, em seguida, verifique `data.supported_assets` na resposta.

## Armazenamento e atualizações {#storage-and-upgrades}

Crie os contêineres `./runtime/epusdt` em `/app/runtime`. Esse diretório contém o arquivo `.env` da aplicação, os bancos de dados de negócio e de execução, e o banco de dados do scanner integrado. O ambiente de contêiner do projeto e a configuração da aplicação são arquivos separados.

Ao atualizar da v2.0.0, pare o serviço antigo, faça backup da configuração e dos bancos de dados e copie-os para o novo ponto de montagem **antes de recriar o contêiner antigo**. Guarde os backups originais e confira os nomes dos arquivos de banco de dados na configuração. [Notas de versão](https://github.com/GMWalletApp/epusdt/releases/tag/v2.1.0)

A partir da versão 2.1.1, o gateway utiliza apenas SQLite. Faça backup dos bancos de dados de configuração, de negócios e de execução, bem como dos dados do scanner. Se você estiver migrando de uma instalação anterior do MySQL ou PostgreSQL, migre e verifique os dados antes de fazer a mudança. Alterar o valor de `db_type` sozinho não migra os pedidos.

## Uso de um scanner independente {#using-a-standalone-scanner}

Defina `CHAINSCANNER_URL=http://chainscanner:9081` e forneça tokens distintos para o consumidor e administrador. Mantenha o volume de scanner existente (`./runtime/chainscanner`), a URL e as credenciais ao atualizar um deployment independente.

```sh
docker compose --profile scanner up -d
```
