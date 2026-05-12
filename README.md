# Bun Todo API

API RESTful de Todo List construída com **Bun runtime**, **Express.js**, **SQLite** e **TypeScript**, seguindo princípios de **Clean Code** e **SOLID**, sem ORM.

## 1. Visão Geral

### Principais características

- Arquitetura em camadas: `controllers`, `use-cases`, `repositories`, `entities`, `routes`, `factories`.
- SQL nativo via `bun:sqlite`.
- Autenticação baseada em JWT armazenado em cookie HTTP-only com revogação via sessão no banco.
- CRUD completo de tarefas por usuário autenticado.
- Validação de entrada com `Zod v4`.
- Tratamento centralizado de erros com payload padronizado.
- Migrações SQL versionadas para SQLite.
- IDs em `TEXT` usando padrão UUID v7.
- Colunas em `snake_case`.
- Testes unitários de use-cases e controllers com `bun test`.

## 2. Stack e Dependências

- Runtime: Bun
- Framework HTTP: Express
- Banco: SQLite (`bun:sqlite`)
- Validação: Zod v4
- UUID: `uuid` (v7)
- JWT: `jose`
- Cookies: `cookie-parser`
- Ambiente: `dotenv`

## 3. Instalação e Configuração

### Pré-requisitos

- Bun instalado e disponível no PATH.

### Passos

1. Clonar o repositório.
2. Copiar o arquivo de ambiente:

```bash
cp .env.example .env
```

3. Instalar dependências com Bun:

```bash
bun install
```

4. Inicializar banco e migrações:

```bash
bun run db:init
```

5. Rodar em desenvolvimento:

```bash
bun run dev
```

## 4. Variáveis de Ambiente

Arquivo `.env`:

```env
NODE_ENV=development
PORT=3000
DATABASE_PATH=./database.sqlite
COOKIE_NAME=session_token
SESSION_TTL_HOURS=24
JWT_SECRET=dev-secret-change-this-in-production-min32chars
```

## 5. Scripts Disponíveis

- `bun run dev`: sobe API com watch.
- `bun run build`: gera build em `dist`.
- `bun run start`: executa build.
- `bun run db:migrate`: aplica migrações pendentes.
- `bun run db:init`: inicializa banco executando migrações.
- `bun run test`: executa testes.
- `bun run test:watch`: executa testes em modo watch.
- `bun run typecheck`: valida tipagem TypeScript.

## 6. Endpoints da API

Base URL: `http://localhost:3000/api/v1`

### 6.1 Health

#### GET `/health`

Response `200`:

```json
{
  "data": {
    "status": "ok"
  }
}
```

### 6.2 Autenticação

#### POST `/auth/register`

Request:

```json
{
  "email": "john@doe.com",
  "password": "12345678"
}
```

Response `201` — define cookie HTTP-only de sessão:

```json
{
  "data": {
    "id": "0195f9cb-0eb8-7abc-a6a9-0ec0df542111",
    "email": "john@doe.com",
    "created_at": "2026-01-01T10:00:00.000Z",
    "updated_at": "2026-01-01T10:00:00.000Z"
  }
}
```

#### POST `/auth/login`

Request:

```json
{
  "email": "john@doe.com",
  "password": "12345678"
}
```

Response `200` — define cookie HTTP-only de sessão:

```json
{
  "data": {
    "id": "0195f9cb-0eb8-7abc-a6a9-0ec0df542111",
    "email": "john@doe.com",
    "created_at": "2026-01-01T10:00:00.000Z",
    "updated_at": "2026-01-01T10:00:00.000Z"
  }
}
```

#### POST `/auth/logout`

Requer autenticação por cookie.

Response `204`:

```json
{
  "data": null
}
```

#### GET `/auth/me`

Requer autenticação por cookie.

Response `200`:

```json
{
  "data": {
    "id": "0195f9cb-0eb8-7abc-a6a9-0ec0df542111",
    "email": "john@doe.com",
    "created_at": "2026-01-01T10:00:00.000Z",
    "updated_at": "2026-01-01T10:00:00.000Z"
  }
}
```

### 6.3 Tarefas (Todo)

Todos os endpoints abaixo exigem cookie de autenticação.

#### POST `/todos`

Request:

```json
{
  "title": "Estudar SOLID",
  "description": "Revisar princípios e aplicar no projeto"
}
```

Response `201`:

```json
{
  "data": {
    "id": "0195f9cb-4aa3-7d9f-9239-f7f4d210aaaa",
    "user_id": "0195f9cb-0eb8-7abc-a6a9-0ec0df542111",
    "title": "Estudar SOLID",
    "description": "Revisar princípios e aplicar no projeto",
    "status": "pending",
    "completed_at": null,
    "created_at": "2026-01-01T10:10:00.000Z",
    "updated_at": "2026-01-01T10:10:00.000Z"
  }
}
```

#### GET `/todos`

Response `200`:

```json
{
  "data": []
}
```

#### PATCH `/todos/:id/status`

Request:

```json
{
  "status": "completed"
}
```

Response `200`:

```json
{
  "data": {
    "id": "0195f9cb-4aa3-7d9f-9239-f7f4d210aaaa",
    "user_id": "0195f9cb-0eb8-7abc-a6a9-0ec0df542111",
    "title": "Estudar SOLID",
    "description": "Revisar princípios e aplicar no projeto",
    "status": "completed",
    "completed_at": "2026-01-01T10:20:00.000Z",
    "created_at": "2026-01-01T10:10:00.000Z",
    "updated_at": "2026-01-01T10:20:00.000Z"
  }
}
```

#### DELETE `/todos/:id`

Response `200`:

```json
{
  "data": null
}
```

## 7. Formato de Erro Padrão

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Dados de entrada inválidos.",
  "details": []
}
```

## 8. Decisões de Arquitetura

- **Use-Case Pattern**: cada operação é uma classe isolada com método `execute()`, facilitando teste e reuso.
- **Factories**: `src/factories/` compõe use-cases com repositórios concretos; trocar persistência exige alterar apenas a factory.
- Repositórios isolam acesso ao SQLite via SQL nativo e facilitam troca de persistência.
- Use-cases concentram regra de negócio e não dependem de Express.
- Controllers apenas coordenam HTTP, validação e chamadas de use-case.
- Middlewares lidam com autenticação e tratamento de erro de forma transversal.
- Contratos (`contracts`) aplicam inversão de dependência (SOLID - DIP).
- UUID v7 em IDs melhora ordenação temporal aproximada e garante unicidade distribuída.
- **JWT para tokens de sessão**: tokens assinados com HS256 via `jose` são armazenados em cookie HTTP-only. A sessão também é persistida no banco para suportar revogação explícita (logout). A validação dupla — assinatura JWT + consulta ao banco — garante segurança sem comprometer desempenho.

## 9. Guia de Contribuição

1. Crie branch de feature a partir da principal.
2. Mantenha padrão de camadas e nomenclaturas em `snake_case` para colunas SQL.
3. Adicione/atualize testes ao alterar regras de negócio.
4. Execute antes de abrir PR:

```bash
bun run typecheck
bun run test
```

5. Documente mudanças relevantes no README.
