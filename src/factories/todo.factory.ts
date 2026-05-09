import { getDatabase } from "@/database/sqlite";
import { SqliteTodoRepository } from "@/repositories/sqlite-todo-repository";
import { CreateTodoUseCase } from "@/use-cases/todo/create-todo.use-case";
import { DeleteTodoUseCase } from "@/use-cases/todo/delete-todo.use-case";
import { ListTodosUseCase } from "@/use-cases/todo/list-todos.use-case";
import { UpdateTodoStatusUseCase } from "@/use-cases/todo/update-todo-status.use-case";

export function makeCreateTodoUseCase() {
  const database = getDatabase();
  const todoRepository = new SqliteTodoRepository(database);
  return new CreateTodoUseCase(todoRepository);
}

export function makeListTodosUseCase() {
  const database = getDatabase();
  const todoRepository = new SqliteTodoRepository(database);
  return new ListTodosUseCase(todoRepository);
}

export function makeUpdateTodoStatusUseCase() {
  const database = getDatabase();
  const todoRepository = new SqliteTodoRepository(database);
  return new UpdateTodoStatusUseCase(todoRepository);
}

export function makeDeleteTodoUseCase() {
  const database = getDatabase();
  const todoRepository = new SqliteTodoRepository(database);
  return new DeleteTodoUseCase(todoRepository);
}
