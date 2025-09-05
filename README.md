# Rinha Kanis

Sistema de processamento de pagamentos com arquitetura distribuída, circuit breaker e fallback automático.

## 🏗️ Arquitetura

O sistema é composto por:

- **API Gateway**: Servidor HTTP que recebe requisições de pagamento
- **Worker**: Processador assíncrono que consome filas Redis
- **Redis**: Cache e fila de mensagens para processamento
- **Nginx**: Load balancer para distribuir carga entre instâncias da API
- **Circuit Breaker**: Sistema de proteção contra falhas em cascata

## 🚀 Funcionalidades

- ✅ Processamento assíncrono de pagamentos
- ✅ Idempotência com TTL de 1 hora
- ✅ Circuit breaker com fallback automático
- ✅ Retry com backoff exponencial
- ✅ Load balancing com Nginx
- ✅ Monitoramento de métricas
- ✅ Docker Compose para orquestração

## 📋 Pré-requisitos

- [Bun](https://bun.sh/) (runtime JavaScript)
- [Docker](https://www.docker.com/) e Docker Compose
- [Redis](https://redis.io/) (via Docker)

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd rinha-kanis
```

2. Instale as dependências:
```bash
bun install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

## 🏃‍♂️ Execução

### Desenvolvimento Local

```bash
# Executar servidor
bun s

# Executar worker
bun src/worker.ts
```

### Produção com Docker

```bash
# Subir todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

## 📡 API Endpoints

### POST /payments
Cria um novo pagamento para processamento assíncrono.

**Request:**
```json
{
  "correlationId": "unique-id",
  "amount": 100.50
}
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
- `200`: Pagamento enfileirado com sucesso
- `400`: Dados inválidos ou JSON malformado

### GET /payments-summary
Retorna resumo dos pagamentos processados.

**Query Parameters:**
- `from`: Data de início (ISO 8601)
- `to`: Data de fim (ISO 8601)

**Response:**
```json
{
  "default": {
    "count": 150,
    "total": 15000.00
  },
  "fallback": {
    "count": 5,
    "total": 500.00
  }
}
```

### POST /purge-payments
Limpa todos os dados de pagamentos (desenvolvimento).

## ⚙️ Configuração

### Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|---------|
| `PORT` | Porta do servidor | `3000` |
| `REDIS_URL` | URL do Redis | `redis://localhost:6379` |
| `TOKEN` | Token de autenticação | `123` |
| `PROC_DEFAULT_URL` | URL do processador principal | `http://localhost:8001` |
| `PROC_FALLBACK_URL` | URL do processador de fallback | `http://localhost:8002` |
| `PROC_TIMEOUT_MS` | Timeout para processadores | `300` |
| `CB_FAIL_THRESHOLD` | Limite de falhas para circuit breaker | `3` |
| `CB_OPEN_MS` | Tempo de abertura do circuit breaker | `1000` |

## 🔧 Scripts Disponíveis

```bash
# Executar servidor
bun s

# Linter
bun run lint

# Corrigir problemas de linting
bun run lint:fix
```

## 🏗️ Estrutura do Projeto

```
src/
├── api/           # Definições de API
├── config/        # Configurações HTTP
├── types/         # Definições TypeScript
├── counters.ts    # Métricas e contadores
├── processor.ts   # Lógica de processamento
├── redis.ts       # Cliente Redis
├── server.ts      # Servidor HTTP
├── utils.ts       # Utilitários
└── worker.ts      # Worker assíncrono
```

## 🔄 Fluxo de Processamento

1. **Recebimento**: API recebe requisição de pagamento
2. **Idempotência**: Verifica se já foi processado (TTL 1h)
3. **Enfileiramento**: Adiciona job na fila Redis
4. **Processamento**: Worker consome fila e processa pagamento
5. **Circuit Breaker**: Tenta processador principal, fallback se necessário
6. **Retry**: Reenfileira com backoff exponencial em caso de falha
7. **Métricas**: Registra estatísticas de processamento

## 🛡️ Circuit Breaker

O sistema implementa circuit breaker para proteger contra falhas em cascata:

- **Fechado**: Requisições passam normalmente
- **Aberto**: Requisições são rejeitadas imediatamente
- **Meio-aberto**: Permite algumas requisições para testar recuperação

## 📊 Monitoramento

O sistema coleta métricas de:
- Pagamentos processados por processador
- Tempo de resposta
- Taxa de falhas
- Uso do circuit breaker

## 🧪 Qualidade de Código

- **ESLint**: Linting com regras TypeScript
- **Stylistic**: Formatação automática
- **TypeScript**: Tipagem estática
- **Clean Code**: Código limpo e bem estruturado

## 🐳 Docker

O projeto inclui:
- **Multi-stage build** otimizado
- **Alpine Linux** para imagens menores
- **Resource limits** configurados
- **Health checks** para monitoramento

## 📈 Performance

- Processamento assíncrono com filas Redis
- Load balancing com Nginx
- Circuit breaker para resiliência
- Retry com backoff exponencial
- Cache Redis para idempotência

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado e proprietário.