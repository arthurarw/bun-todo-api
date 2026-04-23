# Bun Todo API

API RESTful de Todo List construída com **Bun runtime**, **Express.js**, **SQLite** e **TypeScript**, seguindo princípios de **Clean Code** e **SOLID**, sem ORM.

## 1. Visão Geral

### Principais características

- Arquitetura em camadas: `controllers`, `services`, `repositories`, `entities`, `routes`.
- SQL nativo via `bun:sqlite`.
- Autenticação baseada em cookie HTTP-only com controle de sessão.
- CRUD completo de tarefas por usuário autenticado.
- Validação de entrada com `Zod v4`.
- Tratamento centralizado de erros com payload padronizado.
- Migrações SQL versionadas para SQLite.
- IDs em `TEXT` usando padrão UUID v7.
- Colunas em `snake_case`.
- Testes unitários de services e controllers com `bun test`.

## 2. Stack e Dependências

- Runtime: Bun
- Framework HTTP: Express
- Banco: SQLite (`bun:sqlite`)
- Validação: Zod v4
- UUID: `uuid` (v7)
- Cookies: `cookie-parser`
- Ambiente: `dotenv`

## 3. Estrutura do Projeto

```text
bun-todo-api/
  migrations/
    001_create_users_table.sql
    002_create_sessions_table.sql
    003_create_todos_table.sql
  scripts/
    init-db.ts
    migrate.ts
  src/
    config/
      env.ts
    controllers/
      auth-controller.ts
      todo-controller.ts
    contracts/
      session-repository.ts
      todo-repository.ts
      user-repository.ts
    database/
      sqlite.ts
    entities/
      session-entity.ts
      todo-entity.ts
      user-entity.ts
    errors/
      app-error.ts
    middlewares/
      auth-middleware.ts
      error-middleware.ts
    repositories/
      sqlite-session-repository.ts
      sqlite-todo-repository.ts
      sqlite-user-repository.ts
    routes/
      auth-routes.ts
      index-routes.ts
      todo-routes.ts
    services/
      auth-service.ts
      todo-service.ts
    types/
      express/
        index.d.ts
    validations/
      auth-schemas.ts
      todo-schemas.ts
    app.ts
    server.ts
  tests/
    controllers/
    helpers/
    services/
  .env.example
  package.json
  tsconfig.json
```

## 4. Instalação e Configuração

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

## 5. Variáveis de Ambiente

Arquivo `.env`:

```env
NODE_ENV=development
PORT=3000
DATABASE_PATH=./database.sqlite
COOKIE_NAME=session_token
SESSION_TTL_HOURS=24
```

## 6. Scripts Disponíveis

- `bun run dev`: sobe API com watch.
- `bun run build`: gera build em `dist`.
- `bun run start`: executa build.
- `bun run db:migrate`: aplica migrações pendentes.
- `bun run db:init`: inicializa banco executando migrações.
- `bun run test`: executa testes.
- `bun run test:watch`: executa testes em modo watch.
- `bun run typecheck`: valida tipagem TypeScript.

## 7. Endpoints da API

Base URL: `http://localhost:3000/api/v1`

### 7.1 Health

#### GET `/health`

Resposta:

```json
{
  "success": true,
  "message": "API online.",
  "data": {
    "status": "ok"
  }
}
```

### 7.2 Autenticação

#### POST `/auth/register`

Request:

```json
{
  "email": "john@doe.com",
  "password": "12345678"
}
```

Response `201`:

```json
{
  "success": true,
  "message": "Usuário registrado com sucesso.",
  "data": {
    "user": {
      "id": "0195f9cb-0eb8-7abc-a6a9-0ec0df542111",
      "email": "john@doe.com",
      "created_at": "2026-01-01T10:00:00.000Z",
      "updated_at": "2026-01-01T10:00:00.000Z"
    }
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

Response `200`: define cookie HTTP-only de sessão.

#### POST `/auth/logout`

Requer autenticação por cookie.

Response `200`:

```json
{
  "success": true,
  "message": "Logout efetuado com sucesso.",
  "data": null
}
```

#### GET `/auth/me`

Requer autenticação por cookie.

Response `200`:

```json
{
  "success": true,
  "message": "Usuário autenticado.",
  "data": {
    "user": {
      "id": "0195f9cb-0eb8-7abc-a6a9-0ec0df542111",
      "email": "john@doe.com",
      "created_at": "2026-01-01T10:00:00.000Z",
      "updated_at": "2026-01-01T10:00:00.000Z"
    }
  }
}
```

### 7.3 Tarefas (Todo)

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
  "success": true,
  "message": "Tarefa criada com sucesso.",
  "data": {
    "todo": {
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
}
```

#### GET `/todos`

Response `200`:

```json
{
  "success": true,
  "message": "Tarefas listadas com sucesso.",
  "data": {
    "todos": []
  }
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
  "success": true,
  "message": "Status da tarefa atualizado com sucesso.",
  "data": {
    "todo": {
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
}
```

#### DELETE `/todos/:id`

Response `200`:

```json
{
  "success": true,
  "message": "Tarefa removida com sucesso.",
  "data": null
}
```

## 8. Formato de Erro Padrão

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados de entrada inválidos.",
    "details": []
  }
}
```

## 9. Decisões de Arquitetura

- Repositórios isolam acesso ao SQLite via SQL nativo e facilitam troca de persistência.
- Services concentram regra de negócio e não dependem de Express.
- Controllers apenas coordenam HTTP, validação e chamadas de service.
- Middlewares lidam com autenticação e tratamento de erro de forma transversal.
- Contratos (`contracts`) aplicam inversão de dependência (SOLID - DIP).
- UUID v7 em IDs melhora ordenação temporal aproximada e garante unicidade distribuída.

## 10. Guia de Contribuição

1. Crie branch de feature a partir da principal.
2. Mantenha padrão de camadas e nomenclaturas em `snake_case` para colunas SQL.
3. Adicione/atualize testes ao alterar regras de negócio.
4. Execute antes de abrir PR:

```bash
bun run typecheck
bun run test
```

5. Documente mudanças relevantes no README.
